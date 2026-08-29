// ============================================================================
// Local admin server for benosh.tech.
//
// Deliberately dependency-free: it uses only Node built-ins, so there is no
// npm install to run, nothing to keep updated, and nothing that can rot. If
// Node runs, this runs.
//
// It binds to 127.0.0.1 only. Nothing here is reachable from the network, so
// there is no login, no token, and no exposed surface to attack.
//
// It also owns the Next dev server: started as a child process here rather
// than in a second console window, so closing the panel closes the preview too
// and the panel can report the port Next actually picked.
// ============================================================================

import { createServer } from "node:http";
import { spawn } from "node:child_process";
import {
  readFile,
  writeFile,
  readdir,
  mkdir,
  unlink,
  stat,
} from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  validateContent,
  findMissingAssets,
  SKILL_ICON_NAMES,
  CONTACT_ICON_NAMES,
} from "./schema.mjs";

const ADMIN_DIR = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(ADMIN_DIR, "..");
const CONTENT_FILE = join(REPO, "src", "content", "content.json");
const CONTENT_REL = "src/content/content.json";
const PUBLIC_DIR = join(REPO, "public");

const PORT = Number(process.env.ADMIN_PORT) || 4322;
const MAX_BODY = 40 * 1024 * 1024; // generous: images arrive as base64
const IS_WIN = process.platform === "win32";

/**
 * The pre-publish build writes here instead of .next.
 *
 * Next serves the dev preview out of .next and rebuilds it on demand; a
 * production build into the same folder wipes what the dev server is holding
 * open, and the preview then 404s layout.css — which drops every Tailwind
 * class at once and reads as a design bug rather than a clobbered directory.
 * next.config.mjs picks this up through NEXT_DIST_DIR.
 */
const CHECK_DIST = ".next-admin-check";

// --- small helpers ----------------------------------------------------------

/**
 * npm on Windows is npm.cmd, and since the CVE-2024-27980 fix Node refuses to
 * spawn a .cmd without a shell — it throws EINVAL rather than running it. So
 * npm goes through the shell and everything else (git, taskkill: real .exes)
 * does not. Every argument passed here is a fixed literal, never user input,
 * so there is nothing for the shell to reinterpret.
 */
const needsShell = (cmd) => IS_WIN && cmd === "npm";

/**
 * Node deprecates passing a separate args array alongside `shell: true`, so a
 * shelled command is handed over as one already-joined string instead.
 */
const shellForm = (cmd, args) => [[cmd, ...args].join(" "), []];

/** Runs a command and resolves with its exit code and combined output. */
function run(cmd, args, { cwd = REPO, onLine, env } = {}) {
  return new Promise((done) => {
    const shell = needsShell(cmd);
    const [command, argv] = shell ? shellForm(cmd, args) : [cmd, args];
    const child = spawn(command, argv, {
      cwd,
      shell,
      windowsHide: true,
      env: { ...process.env, ...env },
    });
    let out = "";
    const take = (chunk) => {
      const text = chunk.toString();
      out += text;
      if (onLine) {
        for (const line of text.split(/\r?\n/)) if (line.trim()) onLine(line);
      }
    };
    child.stdout.on("data", take);
    child.stderr.on("data", take);
    child.on("error", (err) => done({ code: 1, out: `${out}\n${err.message}` }));
    child.on("close", (code) => done({ code: code ?? 1, out }));
  });
}

const json = (res, status, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(body);
};

function readBody(req) {
  return new Promise((done, fail) => {
    let size = 0;
    const parts = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        fail(new Error("That upload is too large."));
        req.destroy();
        return;
      }
      parts.push(chunk);
    });
    req.on("end", () => {
      try {
        done(
          parts.length ? JSON.parse(Buffer.concat(parts).toString("utf8")) : {}
        );
      } catch {
        fail(new Error("The request body was not valid JSON."));
      }
    });
    req.on("error", fail);
  });
}

/** Strips anything that could escape the folder it is written into. */
function safeSlug(input) {
  const slug = String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "image";
}

/** True when a site-absolute URL like "/projects/x.webp" exists on disk. */
function publicFileExists(url) {
  const clean = decodeURIComponent(String(url).split("?")[0].split("#")[0]);
  const target = resolve(PUBLIC_DIR, "." + clean);
  if (!target.startsWith(PUBLIC_DIR + sep)) return false;
  return existsSync(target);
}

async function gitInfo() {
  const [branch, status, upstream] = await Promise.all([
    run("git", ["rev-parse", "--abbrev-ref", "HEAD"]),
    run("git", ["status", "--porcelain"]),
    run("git", ["rev-list", "--left-right", "--count", "HEAD...@{upstream}"]),
  ]);
  const counts =
    upstream.code === 0 ? upstream.out.trim().split(/\s+/) : ["0", "0"];
  return {
    branch: branch.out.trim() || "unknown",
    dirty: status.out.trim().length > 0,
    changedFiles: status.out.trim().split(/\r?\n/).filter(Boolean).length,
    ahead: Number(counts[0]) || 0,
    behind: Number(counts[1]) || 0,
  };
}

async function loadContent() {
  return JSON.parse(await readFile(CONTENT_FILE, "utf8"));
}

// --- the Next dev server ----------------------------------------------------

const dev = { child: null, url: "", lines: [] };

function startDev() {
  if (process.env.ADMIN_NO_DEV) return;
  const shell = needsShell("npm");
  const [command, argv] = shell
    ? shellForm("npm", ["run", "dev"])
    : ["npm", ["run", "dev"]];
  dev.child = spawn(command, argv, {
    cwd: REPO,
    shell,
    windowsHide: true,
  });

  const take = (chunk) => {
    const text = chunk.toString();
    dev.lines.push(text);
    if (dev.lines.length > 200) dev.lines.shift();
    // Next prints "- Local: http://localhost:3000". Read the port back rather
    // than assuming 3000: if something else already holds it, Next quietly
    // moves to 3001 and a hard-coded preview link would open nothing.
    const found = text.match(/http:\/\/localhost:(\d+)/);
    if (found && !dev.url) {
      dev.url = found[0];
      console.log(`  Live preview running at      ${dev.url}`);
    }
  };
  dev.child.stdout.on("data", take);
  dev.child.stderr.on("data", take);
  dev.child.on("error", (err) => {
    console.error(`  Could not start the live preview: ${err.message}`);
  });
}

/**
 * Windows does not kill a process tree when the parent dies, and `npm run dev`
 * is npm wrapping node — killing npm alone would leave Next holding the port.
 */
function stopDev() {
  if (!dev.child || dev.child.killed) return;
  const pid = dev.child.pid;
  dev.child.killed = true;
  try {
    if (IS_WIN) {
      spawn("taskkill", ["/pid", String(pid), "/T", "/F"], {
        windowsHide: true,
        stdio: "ignore",
      });
    } else {
      dev.child.kill("SIGTERM");
    }
  } catch {
    /* already gone */
  }
}

for (const signal of ["exit", "SIGINT", "SIGTERM", "SIGBREAK", "SIGHUP"]) {
  process.on(signal, () => {
    stopDev();
    if (signal !== "exit") process.exit(0);
  });
}

// --- request handlers -------------------------------------------------------

const STATIC = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/app.js": ["app.js", "text/javascript; charset=utf-8"],
  "/styles.css": ["styles.css", "text/css; charset=utf-8"],
};

async function serveStatic(res, path) {
  const [file, type] = STATIC[path];
  const body = await readFile(join(ADMIN_DIR, file));
  res.writeHead(200, { "content-type": type, "cache-control": "no-store" });
  res.end(body);
}

/** Serves files out of public/ so the panel can show picture previews. */
async function serveAsset(res, path) {
  const rel = decodeURIComponent(path.slice("/asset".length));
  const target = resolve(PUBLIC_DIR, "." + rel);
  if (!target.startsWith(PUBLIC_DIR + sep) || !existsSync(target)) {
    res.writeHead(404).end("Not found");
    return;
  }
  const types = {
    ".webp": "image/webp",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".gif": "image/gif",
    ".pdf": "application/pdf",
  };
  res.writeHead(200, {
    "content-type":
      types[extname(target).toLowerCase()] || "application/octet-stream",
    "cache-control": "no-store",
  });
  res.end(await readFile(target));
}

async function handleSaveContent(req, res) {
  const body = await readBody(req);
  const content = body?.content;

  const problems = validateContent(content);
  if (problems.length) return json(res, 400, { ok: false, problems });

  // Written with a trailing newline and stable 2-space indent so git diffs
  // stay small and readable rather than one giant reflowed line.
  await writeFile(CONTENT_FILE, JSON.stringify(content, null, 2) + "\n", "utf8");

  const warnings = findMissingAssets(content, publicFileExists);
  return json(res, 200, { ok: true, warnings, git: await gitInfo() });
}

/** Where an uploaded picture is allowed to land, keyed by what it is for. */
const UPLOAD_FOLDERS = {
  projects: { dir: join(PUBLIC_DIR, "projects"), prefix: "/projects" },
  texture: { dir: join(PUBLIC_DIR, "texture"), prefix: "/texture" },
  root: { dir: PUBLIC_DIR, prefix: "" },
};

async function handleUploadImage(req, res) {
  const { slug, data, folder } = await readBody(req);
  if (!data) {
    return json(res, 400, { ok: false, error: "No image data was received." });
  }

  const target = UPLOAD_FOLDERS[folder] || UPLOAD_FOLDERS.projects;
  await mkdir(target.dir, { recursive: true });

  const name = `${safeSlug(slug)}.webp`;
  const b64 = data.includes(",") ? data.slice(data.indexOf(",") + 1) : data;
  await writeFile(join(target.dir, name), Buffer.from(b64, "base64"));

  return json(res, 200, { ok: true, src: `${target.prefix}/${name}` });
}

async function handleListAssets(res) {
  const collect = async (dir, prefix) => {
    if (!existsSync(dir)) return [];
    const names = await readdir(dir);
    const out = [];
    for (const name of names) {
      const full = join(dir, name);
      const info = await stat(full);
      if (!info.isFile()) continue;
      if (!/\.(webp|png|jpe?g|svg|gif)$/i.test(name)) continue;
      out.push({ url: `${prefix}/${name}`, bytes: info.size });
    }
    return out.sort((a, b) => a.url.localeCompare(b.url));
  };
  const [projects, texture, root] = await Promise.all([
    collect(UPLOAD_FOLDERS.projects.dir, "/projects"),
    collect(UPLOAD_FOLDERS.texture.dir, "/texture"),
    collect(PUBLIC_DIR, ""),
  ]);
  return json(res, 200, { ok: true, images: [...projects, ...texture, ...root] });
}

async function handleDeleteAsset(req, res) {
  const { url } = await readBody(req);
  const clean = decodeURIComponent(String(url || ""));
  const target = resolve(PUBLIC_DIR, "." + clean);
  if (!target.startsWith(PUBLIC_DIR + sep) || !existsSync(target)) {
    return json(res, 400, {
      ok: false,
      error: "That file is not in the public folder.",
    });
  }

  // Refuse to delete anything the content still points at.
  const content = await loadContent();
  if (JSON.stringify(content).includes(clean)) {
    return json(res, 409, {
      ok: false,
      error: "That picture is still being used - remove it from the site first.",
    });
  }

  await unlink(target);
  return json(res, 200, { ok: true });
}

/**
 * Publishes: runs the same build Vercel will run, and only pushes if it passes.
 * Streams newline-delimited JSON so the panel can show progress live.
 */
async function handlePublish(req, res) {
  const { message } = await readBody(req);
  res.writeHead(200, {
    "content-type": "application/x-ndjson; charset=utf-8",
    "cache-control": "no-store",
  });
  const send = (event) => res.write(JSON.stringify(event) + "\n");

  const fail = (step, detail) => {
    send({ type: "failed", step, detail });
    res.end();
  };

  try {
    // 1. Re-validate what is actually on disk.
    send({ type: "step", step: "check", label: "Checking your content" });
    const content = await loadContent();
    const problems = validateContent(content);
    if (problems.length) return fail("check", problems.join("\n"));

    const missing = findMissingAssets(content, publicFileExists);
    if (missing.length) return fail("check", missing.join("\n"));

    // 2. Build. A green build here means a green build on Vercel, which is what
    //    stops a broken site going live.
    send({ type: "step", step: "build", label: "Building the site" });
    const build = await run("npm", ["run", "build"], {
      env: { NEXT_DIST_DIR: CHECK_DIST },
      onLine: (line) => send({ type: "log", line }),
    });
    if (build.code !== 0) return fail("build", build.out.slice(-4000));

    // 3. Commit.
    send({ type: "step", step: "commit", label: "Saving a version" });
    const add = await run("git", ["add", "-A"]);
    if (add.code !== 0) return fail("commit", add.out);

    const staged = await run("git", ["diff", "--cached", "--name-only"]);
    if (!staged.out.trim()) {
      send({ type: "done", nothingToDo: true, git: await gitInfo() });
      res.end();
      return;
    }
    send({
      type: "log",
      line: `Changed: ${staged.out.trim().split(/\r?\n/).join(", ")}`,
    });

    const subject = String(message || "").trim() || "Update site content";
    const commit = await run("git", ["commit", "-m", subject]);
    if (commit.code !== 0) return fail("commit", commit.out);

    // 4. Push - this is what triggers the Vercel deploy.
    send({ type: "step", step: "push", label: "Publishing to the web" });
    const info = await gitInfo();
    const push = await run("git", ["push", "origin", info.branch], {
      onLine: (line) => send({ type: "log", line }),
    });
    if (push.code !== 0) return fail("push", push.out.slice(-4000));

    send({ type: "done", git: await gitInfo() });
    res.end();
  } catch (err) {
    fail("unexpected", err?.message || String(err));
  }
}

// --- router -----------------------------------------------------------------

const server = createServer(async (req, res) => {
  const path = (req.url || "/").split("?")[0];

  try {
    if (req.method === "GET" && STATIC[path]) return await serveStatic(res, path);
    if (req.method === "GET" && path.startsWith("/asset/")) {
      return await serveAsset(res, path);
    }

    if (req.method === "GET" && path === "/api/state") {
      const content = await loadContent();
      return json(res, 200, {
        ok: true,
        content,
        git: await gitInfo(),
        warnings: findMissingAssets(content, publicFileExists),
        siteUrl: content?.site?.url || "",
        previewUrl: dev.url,
        skillIcons: SKILL_ICON_NAMES,
        contactIcons: CONTACT_ICON_NAMES,
      });
    }

    if (req.method === "POST" && path === "/api/content") {
      return await handleSaveContent(req, res);
    }
    if (req.method === "POST" && path === "/api/image") {
      return await handleUploadImage(req, res);
    }
    if (req.method === "GET" && path === "/api/assets") {
      return await handleListAssets(res);
    }
    if (req.method === "POST" && path === "/api/asset/delete") {
      return await handleDeleteAsset(req, res);
    }
    if (req.method === "POST" && path === "/api/publish") {
      return await handlePublish(req, res);
    }

    if (req.method === "POST" && path === "/api/revert") {
      // Throws away uncommitted edits - the "undo everything since last
      // publish". Only possible once the file has been published at least once;
      // before that git has no previous version to restore, so say so plainly
      // rather than surfacing git's "pathspec did not match" error.
      const tracked = await run("git", ["ls-files", "--error-unmatch", CONTENT_REL]);
      if (tracked.code !== 0) {
        return json(res, 400, {
          ok: false,
          error:
            "There is nothing to undo yet - this content has never been published.",
        });
      }
      const result = await run("git", ["checkout", "--", CONTENT_REL]);
      if (result.code !== 0) return json(res, 500, { ok: false, error: result.out });
      const content = await loadContent();
      return json(res, 200, { ok: true, content, git: await gitInfo() });
    }

    res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
  } catch (err) {
    json(res, 500, { ok: false, error: err?.message || String(err) });
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n  Port ${PORT} is already in use.`);
    console.error("  The panel may already be open in another window.\n");
  } else {
    console.error(`\n  ${err.message}\n`);
  }
  process.exit(1);
});

// 127.0.0.1 rather than 0.0.0.0: this must never be reachable off this machine.
server.listen(PORT, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${PORT}`;
  console.log(`\n  benosh.tech admin running at ${url}`);
  console.log(`  Editing: ${CONTENT_FILE}`);
  console.log(`  Starting the live preview - it takes a few seconds.`);
  console.log(`\n  Close this window when you are finished.\n`);

  startDev();

  // Opened here rather than from the launcher script so it can only happen
  // once the server is genuinely accepting connections.
  if (process.env.ADMIN_NO_OPEN) return;
  const [cmd, args] =
    process.platform === "win32"
      ? ["cmd", ["/c", "start", "", url]]
      : process.platform === "darwin"
        ? ["open", [url]]
        : ["xdg-open", [url]];
  spawn(cmd, args, {
    stdio: "ignore",
    detached: true,
    windowsHide: true,
  }).unref();
});
