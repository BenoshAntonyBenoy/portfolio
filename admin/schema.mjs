// ============================================================================
// Runtime validation for src/content/content.json.
//
// The site imports content.json through a cast (see src/lib/content.ts), so
// TypeScript alone cannot prove the file is well formed. This validator is the
// real gate: the admin server runs it before every write, so a malformed
// document never reaches disk and therefore never reaches the repository.
//
// Errors are phrased for a human reading them in the panel, not for a stack
// trace: "Project 3: title is empty", not "expected string at [2].title".
// ============================================================================

/** Fields that must be a non-empty string. */
const str = (v) => typeof v === "string" && v.trim().length > 0;
/** Fields that may be absent or blank, but must be text when present. */
const blankable = (v) => v === undefined || v === null || typeof v === "string";
const arr = (v) => Array.isArray(v);

/**
 * Icon names the site can actually draw. Mirrors the two maps in
 * src/lib/icons.ts — a name that is not imported there renders nothing, which
 * looks like a broken build rather than a typo, so it is rejected here.
 */
export const SKILL_ICON_NAMES = [
  "SiPython",
  "SiC",
  "SiCplusplus",
  "SiJavascript",
  "SiTypescript",
  "SiReact",
  "SiNextdotjs",
  "SiTailwindcss",
  "SiHtml5",
  "SiNodedotjs",
  "SiGit",
  "SiGithub",
  "SiFigma",
  "SiMysql",
  "SiPostgresql",
  "SiSqlite",
  "SiPandas",
  "SiNumpy",
  "SiScikitlearn",
  "SiTensorflow",
  "SiOpenai",
  "SiVite",
  "SiLinux",
  "SiCanva",
  "SiBlender",
  "SiNotion",
  "SiArduino",
  "SiRaspberrypi",
  "FaBrain",
  "FaPenNib",
  "FaVideo",
  "FaDatabase",
  "FaChartLine",
  "FaCode",
  "FaJava",
  "FaMobileScreen",
  "FaPalette",
  "FaRobot",
  "FaChess",
  "FaTerminal",
  "FaCloud",
  "FaLightbulb",
];

export const CONTACT_ICON_NAMES = [
  "HiOutlineMail",
  "FaLinkedinIn",
  "FaGithub",
  "FaDiscord",
  "FaXTwitter",
  "FaInstagram",
  "FaWhatsapp",
  "FaTelegram",
  "FaYoutube",
  "FaPhone",
  "FaLocationDot",
  "FaBehance",
  "FaDribbble",
  "FaMedium",
];

/** Collects problems as plain sentences instead of throwing on the first one. */
class Problems {
  constructor() {
    this.found = [];
  }
  add(where, what) {
    this.found.push(`${where}: ${what}`);
  }
  str(where, label, value) {
    if (!str(value)) this.add(where, `${label} is empty`);
  }
  blankable(where, label, value) {
    if (!blankable(value)) this.add(where, `${label} must be text if it is set`);
  }
  strList(where, label, value, min = 1) {
    if (!arr(value)) return this.add(where, `${label} must be a list`);
    if (value.length < min) {
      this.add(where, `${label} needs at least ${min} entry`);
    }
    if (value.some((s) => !str(s))) this.add(where, `${label} has a blank entry`);
  }
  list(where, label, value, min = 1) {
    if (!arr(value)) {
      this.add(where, `${label} must be a list`);
      return false;
    }
    if (value.length < min) {
      this.add(where, `${label} needs at least ${min} entry`);
    }
    return true;
  }
  oneOf(where, label, value, allowed) {
    if (!str(value)) return this.add(where, `${label} is empty`);
    if (!allowed.includes(value)) {
      this.add(where, `${label} "${value}" is not one this site can show`);
    }
  }
  /** Two entries sharing a name break the list React draws from it. */
  unique(where, label, values) {
    const seen = new Set();
    for (const value of values) {
      const key = String(value ?? "").trim().toLowerCase();
      if (!key) continue;
      if (seen.has(key)) {
        this.add(where, `two entries share the same ${label} ("${value}") - they must differ`);
        return;
      }
      seen.add(key);
    }
  }
}

/**
 * Highlight markers must come in pairs.
 *
 * `*word*` is italic accent and `**word**` is bright — a stray asterisk renders
 * as a literal asterisk in a heading, which nobody notices until it is live.
 */
function checkMarkers(p, where, label, value) {
  if (typeof value !== "string") return;
  const stripped = value.replace(/\*\*[^*]+\*\*/g, "").replace(/\*[^*]+\*/g, "");
  if (stripped.includes("*")) {
    p.add(where, `${label} has a * without a matching one - highlights are written *like this*`);
  }
}

function checkLink(p, where, item, { label = "link" } = {}) {
  if (!item || typeof item !== "object") return p.add(where, `${label} is missing`);
  p.str(where, "label", item.label);
  p.str(where, "link", item.href);
}

function checkHeading(p, where, heading) {
  if (!heading || typeof heading !== "object") {
    return p.add(where, "section heading is missing");
  }
  p.str(where, "number", heading.index);
  p.str(where, "eyebrow", heading.label);
  p.str(where, "heading", heading.title);
  p.blankable(where, "intro line", heading.lede);
  checkMarkers(p, where, "heading", heading.title);
}

function checkImage(p, where, image, { needsPosition = false } = {}) {
  if (!image || typeof image !== "object") return p.add(where, "picture is missing");
  p.str(where, "picture file", image.src);
  p.str(where, "picture description", image.alt);
  if (needsPosition) p.blankable(where, "picture position", image.position);
}

/**
 * Validates a whole content document.
 * @returns {string[]} human-readable problems; empty means it is safe to write.
 */
export function validateContent(c) {
  const p = new Problems();

  if (!c || typeof c !== "object") {
    return ["The content file is not a document."];
  }

  // --- site -----------------------------------------------------------------
  const site = c.site;
  if (!site || typeof site !== "object") p.add("Site details", "are missing");
  else {
    p.str("Site details", "web address", site.url);
    if (str(site.url) && !/^https?:\/\//i.test(site.url)) {
      p.add("Site details", "web address must start with http:// or https://");
    }
    p.str("Site details", "browser tab title", site.title);
    p.str("Site details", "search description", site.description);
    p.str("Site details", "share title", site.ogTitle);
    p.str("Site details", "share description", site.ogDescription);
    p.str("Site details", "Twitter description", site.twitterDescription);
  }

  // --- menu -----------------------------------------------------------------
  const nav = c.nav;
  if (!nav || typeof nav !== "object") p.add("Menu", "is missing");
  else {
    p.str("Menu", "site name", nav.brand);
    p.blankable("Menu", "highlighted part of the site name", nav.brandAccent);
    if (p.list("Menu", "menu items", nav.links, 1)) {
      nav.links.forEach((link, i) => checkLink(p, `Menu item ${i + 1}`, link));
      p.unique("Menu", "label", nav.links.map((l) => l?.label));
    }
    checkLink(p, "Menu button", nav.cta);
  }

  // --- hero -----------------------------------------------------------------
  const hero = c.hero;
  if (!hero || typeof hero !== "object") p.add("Hero", "is missing");
  else {
    p.str("Hero", "availability line", hero.availability);
    p.str("Hero", "first name line", hero.nameLine1);
    p.str("Hero", "second name line", hero.nameLine2);
    p.str("Hero", "tagline", hero.tagline);
    p.str("Hero", "intro sentence", hero.intro);
    p.str("Hero", "label above the site buttons", hero.portalLabel);
    checkLink(p, "Hero first link", hero.primaryLink);
    checkLink(p, "Hero second link", hero.secondaryLink);
    checkImage(p, "Hero portrait", hero.portrait);
    const rail = hero.rail;
    if (!rail || typeof rail !== "object") p.add("Hero bottom bar", "is missing");
    else {
      p.str("Hero bottom bar", "location", rail.location);
      p.blankable("Hero bottom bar", "college", rail.affiliation);
      p.str("Hero bottom bar", "scroll label", rail.scrollLabel);
      p.str("Hero bottom bar", "scroll link", rail.scrollHref);
    }
  }

  // --- statement ------------------------------------------------------------
  const intro = c.intro;
  if (!intro || typeof intro !== "object") p.add("Statement", "is missing");
  else {
    p.str("Statement", "first line", intro.line1);
    p.str("Statement", "second line", intro.line2);
    p.str("Statement", "sentence underneath", intro.body);
    p.str("Statement", "background picture", intro.texture);
  }

  // --- about ----------------------------------------------------------------
  const about = c.about;
  if (!about || typeof about !== "object") p.add("About", "is missing");
  else {
    checkHeading(p, "About", about.heading);
    checkImage(p, "About photo", about.portrait, { needsPosition: true });
    p.strList("About", "paragraphs", about.bio, 1);
    (about.bio ?? []).forEach((para, i) =>
      checkMarkers(p, `About paragraph ${i + 1}`, "paragraph", para)
    );
    if (p.list("About", "facts", about.facts, 1)) {
      about.facts.forEach((fact, i) => {
        const where = `About fact ${i + 1}`;
        p.str(where, "label", fact?.kicker);
        p.str(where, "sentence", fact?.body);
      });
      p.unique("About facts", "label", about.facts.map((f) => f?.kicker));
    }
  }

  // --- projects -------------------------------------------------------------
  const projects = c.projects;
  if (!projects || typeof projects !== "object") p.add("Projects", "are missing");
  else {
    checkHeading(p, "Projects", projects.heading);
    if (p.list("Projects", "projects", projects.items, 1)) {
      projects.items.forEach((item, i) => {
        const where = `Project ${i + 1}${str(item?.title) ? ` (${item.title})` : ""}`;
        p.str(where, "title", item?.title);
        p.str(where, "type label", item?.tag);
        p.str(where, "description", item?.description);
        p.strList(where, "tech tags", item?.tech, 1);
        p.blankable(where, "picture", item?.image);
      });
      p.unique("Projects", "title", projects.items.map((i) => i?.title));
    }
  }

  // --- live sites -----------------------------------------------------------
  const live = c.liveSites;
  if (!live || typeof live !== "object") p.add("Live sites", "are missing");
  else {
    checkHeading(p, "Live sites", live.heading);
    p.str("Live sites", '"online" label', live.onlineLabel);
    p.str("Live sites", '"open" label', live.openLabel);
    if (p.list("Live sites", "sites", live.items, 1)) {
      live.items.forEach((item, i) => {
        const where = `Live site ${i + 1}${str(item?.title) ? ` (${item.title})` : ""}`;
        p.str(where, "title", item?.title);
        p.str(where, "type label", item?.tag);
        p.str(where, "domain", item?.domain);
        p.str(where, "link", item?.href);
        if (str(item?.href) && !/^https?:\/\//i.test(item.href)) {
          p.add(where, "link must start with http:// or https://");
        }
        p.str(where, "description", item?.description);
        p.strList(where, "tech tags", item?.tech, 1);
      });
      p.unique("Live sites", "link", live.items.map((i) => i?.href));
    }
  }

  // --- skills ---------------------------------------------------------------
  const skills = c.skills;
  if (!skills || typeof skills !== "object") p.add("Skills", "are missing");
  else {
    checkHeading(p, "Skills", skills.heading);
    p.strList("Skills", "groups", skills.groups, 1);
    p.unique("Skills groups", "name", skills.groups ?? []);
    if (p.list("Skills", "skills", skills.items, 1)) {
      skills.items.forEach((item, i) => {
        const where = `Skill ${i + 1}${str(item?.name) ? ` (${item.name})` : ""}`;
        p.str(where, "name", item?.name);
        p.oneOf(where, "icon", item?.icon, SKILL_ICON_NAMES);
        if (!str(item?.group)) p.add(where, "group is empty");
        else if (arr(skills.groups) && !skills.groups.includes(item.group)) {
          p.add(where, `group "${item.group}" is not one of your groups`);
        }
      });
      p.unique("Skills", "name", skills.items.map((i) => i?.name));
    }
  }

  // --- beyond code ----------------------------------------------------------
  const beyond = c.achievements;
  if (!beyond || typeof beyond !== "object") p.add("Beyond code", "is missing");
  else {
    checkHeading(p, "Beyond code", beyond.heading);
    p.blankable("Beyond code", "background symbol", beyond.watermark);
    if (p.list("Beyond code", "entries", beyond.items, 1)) {
      beyond.items.forEach((item, i) => {
        const where = `Beyond code ${i + 1}${str(item?.title) ? ` (${item.title})` : ""}`;
        p.str(where, "label", item?.kicker);
        p.str(where, "title", item?.title);
        p.str(where, "description", item?.detail);
      });
      p.unique("Beyond code", "title", beyond.items.map((i) => i?.title));
    }
  }

  // --- contact --------------------------------------------------------------
  const contact = c.contact;
  if (!contact || typeof contact !== "object") p.add("Contact", "is missing");
  else {
    checkHeading(p, "Contact", contact.heading);
    checkLink(p, "Résumé button", contact.resume);
    if (p.list("Contact", "links", contact.links, 1)) {
      contact.links.forEach((item, i) => {
        const where = `Contact link ${i + 1}${str(item?.label) ? ` (${item.label})` : ""}`;
        p.str(where, "label", item?.label);
        p.str(where, "what is shown", item?.value);
        p.str(where, "link", item?.href);
        p.oneOf(where, "icon", item?.icon, CONTACT_ICON_NAMES);
      });
      p.unique("Contact", "label", contact.links.map((i) => i?.label));
    }
  }

  // --- footer ---------------------------------------------------------------
  const footer = c.footer;
  if (!footer || typeof footer !== "object") p.add("Footer", "is missing");
  else {
    p.str("Footer", "name", footer.name);
    p.str("Footer", "built-with note", footer.builtWith);
  }

  return p.found;
}

/**
 * Second-pass check that every picture the document points at actually exists
 * in public/. Kept separate from validateContent so the pure shape check stays
 * filesystem-free and easy to reason about.
 *
 * @returns {string[]} warnings about missing files.
 */
export function findMissingAssets(c, fileExists) {
  const missing = [];
  const seen = new Set();

  const check = (where, url) => {
    if (!str(url) || !url.startsWith("/")) return;
    if (url.startsWith("//") || url.includes("://")) return; // external, not ours
    const key = `${where}|${url}`;
    if (seen.has(key)) return;
    seen.add(key);
    if (!fileExists(url)) missing.push(`${where}: ${url} is not in the public folder`);
  };

  check("Hero portrait", c?.hero?.portrait?.src);
  check("About photo", c?.about?.portrait?.src);
  check("Statement background", c?.intro?.texture);
  check("Résumé button", c?.contact?.resume?.href);

  for (const [i, item] of (c?.projects?.items ?? []).entries()) {
    const where = `Project ${i + 1}${str(item?.title) ? ` (${item.title})` : ""}`;
    check(where, item?.image);
  }

  return missing;
}
