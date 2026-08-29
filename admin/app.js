// ============================================================================
// Admin panel UI for benosh.tech.
//
// Plain JavaScript on purpose - no framework, no build step, no dependencies.
// Open it, edit, publish. Nothing here needs installing or updating.
//
// Editing model: text inputs write straight into the state object and schedule
// a debounced save, so typing never re-renders (and never steals focus).
// Only structural changes - add, delete, reorder - trigger a re-render.
// ============================================================================

// --- tiny DOM helper --------------------------------------------------------

function h(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on")) {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key in node && key !== "list") node[key] = value;
    else node.setAttribute(key, value);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

const $ = (sel) => document.querySelector(sel);

// --- state ------------------------------------------------------------------

const state = {
  content: null,
  section: "hero",
  open: new Set(), // which list items are expanded
  problems: [],
  warnings: [],
  saveTimer: null,
  siteUrl: "",
  previewUrl: "",
  skillIcons: [],
  contactIcons: [],
};

/**
 * The rail, in the order the sections appear on the page itself - so finding
 * something in here is the same act as finding it on the site.
 */
const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "statement", label: "Statement" },
  { id: "about", label: "About", count: (c) => c.about.facts.length },
  { id: "projects", label: "Projects", count: (c) => c.projects.items.length },
  { id: "live", label: "Live sites", count: (c) => c.liveSites.items.length },
  { id: "skills", label: "Skills", count: (c) => c.skills.items.length },
  {
    id: "beyond",
    label: "Beyond code",
    count: (c) => c.achievements.items.length,
  },
  { id: "contact", label: "Contact", count: (c) => c.contact.links.length },
  { id: "menu", label: "Menu & footer", count: (c) => c.nav.links.length },
  { id: "site", label: "Site details" },
  { id: "pictures", label: "Pictures" },
];

const PAGE_COPY = {
  hero: [
    "Hero",
    "The first screen: your name, the line under it, the two site buttons, and the bar along the bottom.",
  ],
  statement: [
    "Statement",
    "The full-screen line between the hero and About, over the dark photo.",
  ],
  about: ["About", "Your photo, your story, and the three facts beside it."],
  projects: [
    "Projects",
    "The work shown down the middle of the page. Drag the handle on the left of a row to reorder - the numbering follows the order automatically.",
  ],
  live: ["Live sites", "The deployed sites. These also fill the two buttons in the hero and the links in the footer."],
  skills: ["Skills", "The grouped toolkit. Every skill belongs to one of your groups."],
  beyond: ["Beyond code", "Chess, markets, hackathons - the read-down list behind the ghost pawn."],
  contact: ["Contact", "The closing section: the résumé button and your contact cards."],
  menu: ["Menu & footer", "The top navigation, the button in the corner, and the footer line."],
  site: [
    "Site details",
    "The browser tab title and the text search engines and link previews show. Nothing here is visible on the page itself.",
  ],
  pictures: [
    "Pictures",
    "Everything in your public folder. Delete anything the site no longer points at.",
  ],
};

/** Written next to any field that understands the highlight markers. */
const MARKER_HINT =
  "Wrap a word in *stars* for italic green, or **two stars** for bright white.";

// --- server calls -----------------------------------------------------------

async function api(path, options) {
  const res = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options,
  });
  return res.json();
}

function setSaveState(tone, label) {
  const el = $("#save-state");
  el.dataset.tone = tone;
  el.textContent = label;
}

function touch() {
  setSaveState("saving", "Saving");
  clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(save, 700);
}

async function save() {
  clearTimeout(state.saveTimer);
  try {
    const result = await api("/api/content", {
      method: "POST",
      body: JSON.stringify({ content: state.content }),
    });
    if (!result.ok) {
      state.problems = result.problems || [result.error || "Could not save."];
      setSaveState("error", "Not saved");
      renderBanners();
      return false;
    }
    state.problems = [];
    state.warnings = result.warnings || [];
    setSaveState("saved", "Saved");
    renderBanners();
    return true;
  } catch {
    setSaveState("error", "Not saved");
    return false;
  }
}

// --- field builders ---------------------------------------------------------

/**
 * One labelled control.
 *
 * Required is the DEFAULT, because nearly every value on the site has to be
 * filled in - only a handful of extras are genuinely skippable. Pass
 * `{ optional: true }` for those, and they simply lose the asterisk.
 */
function field(label, control, hint, opts = {}) {
  const labelNode = h("label", {}, label);
  if (!opts.optional) {
    labelNode.append(
      h("span", { class: "req", text: "*", title: "Must be filled in" })
    );
  }
  return h(
    "div",
    { class: "field" },
    labelNode,
    control,
    hint ? h("span", { class: "hint", text: hint }) : null
  );
}

/** Text input bound to obj[key]. `onEcho` mirrors the value elsewhere live. */
function text(obj, key, { placeholder = "", type = "text", onEcho } = {}) {
  const input = h("input", {
    type,
    placeholder,
    value: obj[key] ?? "",
    oninput: () => {
      obj[key] = input.value;
      if (onEcho) onEcho(input.value);
      touch();
    },
  });
  return input;
}

function area(obj, key, { rows = 3, placeholder = "" } = {}) {
  const input = h("textarea", {
    rows,
    placeholder,
    value: obj[key] ?? "",
    oninput: () => {
      obj[key] = input.value;
      touch();
    },
  });
  return input;
}

function select(obj, key, options, { allowEmpty = true, labelOf } = {}) {
  const node = h("select", {
    onchange: () => {
      obj[key] = node.value === "" && allowEmpty ? undefined : node.value;
      touch();
    },
  });
  if (allowEmpty) node.append(h("option", { value: "", text: "Default" }));
  for (const opt of options) {
    node.append(
      h("option", {
        value: opt,
        text: labelOf ? labelOf(opt) : opt,
        selected: obj[key] === opt,
      })
    );
  }
  node.value = obj[key] ?? "";
  return node;
}

/**
 * Chip editor for an array of plain strings (tech tags).
 * Enter or comma commits; backspace on an empty box removes the last chip.
 */
function chips(list, { placeholder = "Type and press Enter" } = {}) {
  const wrap = h("div", { class: "chips" });

  const input = h("input", {
    type: "text",
    placeholder,
    onkeydown: (event) => {
      if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        const value = input.value.trim();
        if (value) {
          list.push(value);
          input.value = "";
          paint();
          touch();
        }
      } else if (
        event.key === "Backspace" &&
        input.value === "" &&
        list.length
      ) {
        list.pop();
        paint();
        touch();
      }
    },
    onblur: () => {
      const value = input.value.trim();
      if (value) {
        list.push(value);
        input.value = "";
        paint();
        touch();
      }
    },
  });

  function paint() {
    wrap.textContent = "";
    list.forEach((item, i) => {
      wrap.append(
        h(
          "span",
          { class: "chip" },
          item,
          h("button", {
            type: "button",
            text: "×",
            title: `Remove ${item}`,
            onclick: () => {
              list.splice(i, 1);
              paint();
              touch();
            },
          })
        )
      );
    });
    wrap.append(input);
  }

  paint();
  return wrap;
}

/** Textarea where each blank-line-separated block becomes one paragraph. */
function paragraphs(obj, key, { rows = 8 } = {}) {
  const input = h("textarea", {
    rows,
    value: (obj[key] ?? []).join("\n\n"),
    placeholder: "Leave a blank line between paragraphs.",
    oninput: () => {
      obj[key] = input.value
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean);
      touch();
    },
  });
  return input;
}

/** Textarea where each line becomes one array entry. */
function lines(obj, key, { rows = 4, hintPerLine = "one per line" } = {}) {
  const input = h("textarea", {
    rows,
    value: (obj[key] ?? []).join("\n"),
    placeholder: hintPerLine,
    oninput: () => {
      obj[key] = input.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      touch();
    },
  });
  return input;
}

function card(title, ...children) {
  return h(
    "div",
    { class: "card" },
    title ? h("p", { class: "card-title", text: title }) : null,
    ...children
  );
}

// --- reorderable list -------------------------------------------------------

/**
 * Renders an array as collapsible, drag-reorderable cards.
 *
 * @param {object} config
 * @param {any[]} config.list        the array being edited (mutated in place)
 * @param {string} config.keyOf      unique-ish id for remembering open state
 * @param {(item, i) => string} config.title
 * @param {(item, i) => string} [config.meta]
 * @param {(item, i) => string} [config.index]
 * @param {(item, i, setTitle) => Node} config.body
 * @param {() => object} config.make new blank entry
 * @param {string} config.addLabel
 */
function sortableList(config) {
  const container = h("div", { class: "items" });
  let dragFrom = null;

  const commit = () => {
    touch();
    render();
  };

  if (config.list.length === 0) {
    container.append(h("div", { class: "empty", text: "Nothing here yet." }));
  }

  config.list.forEach((item, i) => {
    const openKey = `${config.keyOf}:${i}`;
    const isOpen = state.open.has(openKey);

    const titleNode = h("span", {
      class: "item-name",
      text: config.title(item, i),
    });

    const head = h(
      "div",
      {
        class: "item-head",
        onclick: (event) => {
          if (event.target.closest(".grip")) return;
          if (isOpen) state.open.delete(openKey);
          else state.open.add(openKey);
          render();
        },
      },
      h("span", { class: "grip", text: "⫶", title: "Drag to reorder" }),
      config.index
        ? h("span", { class: "item-index", text: config.index(item, i) })
        : null,
      titleNode,
      config.meta
        ? h("span", { class: "item-meta", text: config.meta(item, i) })
        : null,
      h("span", { class: "caret", text: "▶" })
    );

    const item_card = h("div", { class: "item", "data-open": String(isOpen) }, head);

    if (isOpen) {
      item_card.append(
        h(
          "div",
          { class: "item-body" },
          config.body(item, i, (label) => {
            titleNode.textContent = label;
          }),
          h(
            "div",
            { class: "item-actions" },
            h("button", {
              class: "btn btn-sm btn-ghost",
              type: "button",
              text: "Duplicate",
              onclick: () => {
                config.list.splice(i + 1, 0, structuredClone(item));
                commit();
              },
            }),
            h("button", {
              class: "btn btn-sm btn-ghost btn-danger",
              type: "button",
              text: "Delete",
              onclick: () => {
                if (
                  !confirm(
                    `Delete "${config.title(item, i)}"? This cannot be undone from here.`
                  )
                ) {
                  return;
                }
                config.list.splice(i, 1);
                state.open.delete(openKey);
                commit();
              },
            })
          )
        )
      );
    }

    // Drag to reorder: only the grip starts a drag, so clicking the row still
    // expands it rather than picking the card up.
    const grip = head.querySelector(".grip");
    grip.addEventListener("mousedown", () => {
      item_card.draggable = true;
    });
    item_card.addEventListener("dragstart", (event) => {
      dragFrom = i;
      item_card.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(i));
    });
    item_card.addEventListener("dragend", () => {
      item_card.draggable = false;
      item_card.classList.remove("dragging");
      container
        .querySelectorAll(".item")
        .forEach((n) => n.classList.remove("drop-target"));
    });
    item_card.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      item_card.classList.add("drop-target");
    });
    item_card.addEventListener("dragleave", () =>
      item_card.classList.remove("drop-target")
    );
    item_card.addEventListener("drop", (event) => {
      event.preventDefault();
      const from = dragFrom ?? Number(event.dataTransfer.getData("text/plain"));
      if (Number.isNaN(from) || from === i) return;
      const [moved] = config.list.splice(from, 1);
      config.list.splice(i, 0, moved);
      state.open.clear();
      commit();
    });

    container.append(item_card);
  });

  container.append(
    h("button", {
      class: "btn",
      type: "button",
      style: "align-self:flex-start;margin-top:2px",
      text: config.addLabel,
      onclick: () => {
        config.list.push(config.make());
        state.open.clear();
        state.open.add(`${config.keyOf}:${config.list.length - 1}`);
        commit();
      },
    })
  );

  return container;
}

// --- images -----------------------------------------------------------------

const IMAGE_QUALITY = 0.86;

/**
 * Resizes in the browser and encodes WebP, so no image library is needed.
 * Alpha survives the round trip, which matters for the cut-out hero portrait.
 */
async function makeWebp(file, maxWidth) {
  const bitmap = await createImageBitmap(file);
  const width = Math.min(bitmap.width, maxWidth);
  const height = Math.round((bitmap.height / bitmap.width) * width);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise((done) =>
    canvas.toBlob(done, "image/webp", IMAGE_QUALITY)
  );
  if (!blob || blob.type !== "image/webp") {
    throw new Error("This browser cannot make WebP images. Try Chrome or Edge.");
  }
  const data = await new Promise((done) => {
    const reader = new FileReader();
    reader.onload = () => done(reader.result);
    reader.readAsDataURL(blob);
  });

  bitmap.close?.();
  return { data, width, height };
}

function slugify(value) {
  return (
    String(value || "image")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image"
  );
}

/**
 * Drop zone bound to a plain URL string at obj[key].
 *
 * Dropping a file resizes it, writes a .webp into public/ and points the field
 * at it. The path stays editable by hand underneath, for pictures put there by
 * some other route.
 */
function imagePicker(
  obj,
  key,
  { folder = "projects", slug = "image", maxWidth = 1600, label = "Picture", hint, optional = false } = {}
) {
  const zone = h("div", { class: "dropzone" });
  const pathInput = text(obj, key, { placeholder: "/projects/example.webp" });
  const fileInput = h("input", {
    type: "file",
    accept: "image/*",
    class: "sr-only",
    onchange: () => fileInput.files[0] && accept(fileInput.files[0]),
  });

  function paint() {
    zone.textContent = "";
    const src = obj[key];
    if (src) {
      zone.append(
        h("img", { src: `/asset${src}`, alt: "" }),
        h("span", { class: "badge", text: String(src).split("/").pop() })
      );
    } else {
      zone.append(
        h("span", {
          class: "placeholder",
          text: "Drop a picture here, or click to choose one",
        })
      );
    }
  }

  async function accept(file) {
    if (!file.type.startsWith("image/")) {
      toast("That file is not a picture.");
      return;
    }
    zone.textContent = "";
    zone.append(h("span", { class: "placeholder", text: "Processing…" }));
    try {
      const image = await makeWebp(file, maxWidth);
      const result = await api("/api/image", {
        method: "POST",
        body: JSON.stringify({
          slug: slugify(typeof slug === "function" ? slug() : slug),
          data: image.data,
          folder,
        }),
      });
      if (!result.ok) throw new Error(result.error || "Upload failed.");

      obj[key] = result.src;
      pathInput.value = result.src;
      paint();
      touch();
      toast("Picture added.");
    } catch (err) {
      paint();
      toast(err.message || "Could not process that picture.");
    }
  }

  zone.addEventListener("click", () => fileInput.click());
  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("over");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("over"));
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("over");
    const file = event.dataTransfer.files[0];
    if (file) accept(file);
  });

  paint();

  const labelNode = h("label", {}, label);
  if (!optional) {
    labelNode.append(
      h("span", { class: "req", text: "*", title: "Must be filled in" })
    );
  }

  return h(
    "div",
    { class: "field" },
    labelNode,
    zone,
    fileInput,
    pathInput,
    h("span", {
      class: "hint",
      text: hint || "Pictures are resized and saved as .webp automatically.",
    })
  );
}

// --- shared field groups ----------------------------------------------------

/** The numbered rail, eyebrow, heading and optional intro line of a section. */
function headingFields(heading) {
  return card(
    "Section heading",
    h(
      "div",
      { class: "row row-2" },
      field("Number", text(heading, "index"), 'The two digits in the margin, e.g. "02".'),
      field("Eyebrow", text(heading, "label"), "The small line above the heading.")
    ),
    field("Heading", text(heading, "title"), MARKER_HINT),
    field("Intro line", area(heading, "lede", { rows: 2 }), "Optional. Leave empty for no intro line.", {
      optional: true,
    })
  );
}

/** A {label, href} pair, side by side. */
function linkFields(link, { label = "Link", hint } = {}) {
  return h(
    "div",
    { class: "row row-2" },
    field(`${label} text`, text(link, "label")),
    field(`${label} address`, text(link, "href"), hint)
  );
}

/**
 * Icon names are how react-icons spells things, not how anyone reads them:
 * splitting the camel case gets most of the way there ("FaChartLine" ->
 * "Chart line") but leaves nonsense like "Cplusplus", so the names that do not
 * survive that treatment are spelled out.
 */
const ICON_NAMES = {
  SiCplusplus: "C++",
  SiJavascript: "JavaScript",
  SiTypescript: "TypeScript",
  SiNextdotjs: "Next.js",
  SiNodedotjs: "Node.js",
  SiTailwindcss: "Tailwind CSS",
  SiHtml5: "HTML",
  SiMysql: "MySQL",
  SiPostgresql: "PostgreSQL",
  SiSqlite: "SQLite",
  SiScikitlearn: "scikit-learn",
  SiTensorflow: "TensorFlow",
  SiOpenai: "OpenAI",
  SiRaspberrypi: "Raspberry Pi",
  SiGithub: "GitHub",
  FaJava: "Java",
  FaPenNib: "Pen nib",
  FaMobileScreen: "Mobile",
  FaLocationDot: "Location",
  FaChartLine: "Chart",
  HiOutlineMail: "Email",
  FaLinkedinIn: "LinkedIn",
  FaGithub: "GitHub",
  FaXTwitter: "X (Twitter)",
  FaYoutube: "YouTube",
};

/** "SiPython" -> "Python", "FaChartLine" -> "Chart". */
function prettyIcon(name) {
  if (ICON_NAMES[name]) return ICON_NAMES[name];
  const stripped = String(name).replace(/^(Si|Fa|Hi)/, "").replace(/^Outline/, "");
  const words = stripped.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return words.charAt(0).toUpperCase() + words.slice(1).toLowerCase();
}

/** Labels collide (SiGithub and FaGithub both read "Github") - disambiguate. */
function iconLabeller(names) {
  const counts = new Map();
  for (const name of names) {
    const pretty = prettyIcon(name);
    counts.set(pretty, (counts.get(pretty) || 0) + 1);
  }
  return (name) => {
    const pretty = prettyIcon(name);
    return counts.get(pretty) > 1 ? `${pretty} (${name})` : pretty;
  };
}

// --- section renderers ------------------------------------------------------

const renderers = {
  hero() {
    const hero = state.content.hero;
    return [
      card(
        "Headline",
        field(
          "Availability line",
          text(hero, "availability"),
          "The small line with the pulsing dot above your name."
        ),
        h(
          "div",
          { class: "row row-2" },
          field("Name, first line", text(hero, "nameLine1")),
          field("Name, second line", text(hero, "nameLine2"), "Shown italic, in green.")
        ),
        field("Tagline", text(hero, "tagline"), "The bright line under your name."),
        field("Intro sentence", area(hero, "intro", { rows: 2 }), "The dimmer line under the tagline.")
      ),
      card(
        "Buttons and links",
        field(
          "Label above the site buttons",
          text(hero, "portalLabel"),
          'The two buttons themselves are your live sites - edit them under "Live sites".'
        ),
        linkFields(hero.primaryLink, { label: "First link" }),
        linkFields(hero.secondaryLink, { label: "Second link" })
      ),
      card(
        "Portrait",
        imagePicker(hero.portrait, "src", {
          folder: "root",
          slug: "me-cutout",
          maxWidth: 1200,
          label: "Cut-out photo",
          hint: "A background-removed photo works best - the figure stands in front of the arch.",
        }),
        field(
          "Photo description",
          text(hero.portrait, "alt"),
          "Read aloud by screen readers, and shown if the picture fails to load."
        )
      ),
      card(
        "Bottom bar",
        h(
          "div",
          { class: "row row-2" },
          field("Location", text(hero.rail, "location")),
          field("College", text(hero.rail, "affiliation"), "Optional. Hidden on phones.", {
            optional: true,
          })
        ),
        h(
          "div",
          { class: "row row-2" },
          field("Scroll label", text(hero.rail, "scrollLabel")),
          field("Scroll link", text(hero.rail, "scrollHref"), 'Usually "#about".')
        )
      ),
    ];
  },

  statement() {
    const intro = state.content.intro;
    return [
      card(
        "The line",
        field("First line", text(intro, "line1")),
        field("Second line", text(intro, "line2"), "Shown much larger, italic, in green."),
        field("Sentence underneath", area(intro, "body", { rows: 2 }))
      ),
      card(
        "Background",
        imagePicker(intro, "texture", {
          folder: "texture",
          slug: "code",
          maxWidth: 1600,
          label: "Background picture",
          hint: "It is crushed almost to black and tinted green, so detail barely shows - texture, not a photo.",
        })
      ),
    ];
  },

  about() {
    const about = state.content.about;
    return [
      headingFields(about.heading),
      card(
        "Photo",
        imagePicker(about.portrait, "src", {
          folder: "root",
          slug: "me",
          maxWidth: 1200,
          label: "Photo",
        }),
        h(
          "div",
          { class: "row row-2" },
          field("Photo description", text(about.portrait, "alt")),
          field(
            "Photo position",
            text(about.portrait, "position", { placeholder: "center 25%" }),
            'How the photo sits in its frame, e.g. "center 25%".'
          )
        )
      ),
      card(
        "Your story",
        field("Paragraphs", paragraphs(about, "bio"), `${MARKER_HINT} Leave a blank line between paragraphs.`)
      ),
      card(
        "Facts",
        h("p", {
          class: "hint",
          text: "Three reads best - they sit in a row of three columns under your story.",
        }),
        sortableList({
          list: about.facts,
          keyOf: "fact",
          title: (f) => f.kicker || "Untitled fact",
          meta: (f) => f.body || "",
          make: () => ({ kicker: "New fact", body: "" }),
          addLabel: "Add a fact",
          body: (f, i, setTitle) =>
            h(
              "div",
              {},
              field("Label", text(f, "kicker", { onEcho: setTitle }), "Shown small, in green."),
              field("Sentence", area(f, "body", { rows: 2 }))
            ),
        })
      ),
    ];
  },

  projects() {
    const projects = state.content.projects;
    return [
      headingFields(projects.heading),
      sortableList({
        list: projects.items,
        keyOf: "project",
        index: (_, i) => String(i + 1).padStart(2, "0"),
        title: (p) => p.title || "Untitled project",
        meta: (p) => p.tag || "",
        make: () => ({
          title: "New project",
          tag: "",
          description: "",
          tech: [],
          image: "",
        }),
        addLabel: "Add a project",
        body: (p, i, setTitle) =>
          h(
            "div",
            {},
            h(
              "div",
              { class: "row row-2" },
              field("Title", text(p, "title", { onEcho: setTitle })),
              field("Type label", text(p, "tag"), 'e.g. "Python + UI" or "Figma case study".')
            ),
            field("Description", area(p, "description", { rows: 4 })),
            field("Tech tags", chips(p.tech), "Enter after each one."),
            imagePicker(p, "image", {
              folder: "projects",
              slug: () => p.title,
              maxWidth: 1600,
              label: "Screenshot",
              optional: true,
              hint: "Optional. Without one, the row shows a large numeral instead.",
            })
          ),
      }),
    ];
  },

  live() {
    const live = state.content.liveSites;
    return [
      headingFields(live.heading),
      card(
        "Card labels",
        h(
          "div",
          { class: "row row-2" },
          field('"Online" label', text(live, "onlineLabel"), "Next to the pulsing dot."),
          field('"Open" label', text(live, "openLabel"), "Bottom-right of each card.")
        )
      ),
      h("p", {
        class: "hint",
        text: "These also fill the two big buttons in the hero and the links in the footer.",
      }),
      sortableList({
        list: live.items,
        keyOf: "live",
        title: (s) => s.title || "Untitled site",
        meta: (s) => s.domain || "",
        make: () => ({
          title: "New site",
          tag: "Live site",
          domain: "",
          href: "https://",
          description: "",
          tech: [],
        }),
        addLabel: "Add a live site",
        body: (s, i, setTitle) =>
          h(
            "div",
            {},
            h(
              "div",
              { class: "row row-2" },
              field("Title", text(s, "title", { onEcho: setTitle })),
              field("Type label", text(s, "tag"), 'e.g. "Live site" or "Live app".')
            ),
            h(
              "div",
              { class: "row row-2" },
              field("Domain shown", text(s, "domain"), "Without https://"),
              field("Full address", text(s, "href"), "Must start with https://")
            ),
            field("Description", area(s, "description", { rows: 3 })),
            field("Tech tags", chips(s.tech), "Enter after each one.")
          ),
      }),
    ];
  },

  skills() {
    const skills = state.content.skills;
    const labelOf = iconLabeller(state.skillIcons);
    return [
      headingFields(skills.heading),
      card(
        "Groups",
        field(
          "Group names",
          lines(skills, "groups", { rows: 4, hintPerLine: "One group per line" }),
          "One per line. Each becomes a column, in this order. Renaming one here means re-picking the group on every skill that used the old name - saving is blocked until you do, because a skill in a group that no longer exists would vanish from the site."
        )
      ),
      sortableList({
        list: skills.items,
        keyOf: "skill",
        title: (s) => s.name || "Untitled skill",
        meta: (s) => s.group || "",
        make: () => ({
          name: "New skill",
          icon: state.skillIcons[0] || "FaCode",
          group: skills.groups[0] || "",
        }),
        addLabel: "Add a skill",
        body: (s, i, setTitle) =>
          h(
            "div",
            {},
            h(
              "div",
              { class: "row row-3" },
              field("Name", text(s, "name", { onEcho: setTitle })),
              field(
                "Group",
                select(s, "group", skills.groups, { allowEmpty: false }),
                "Add groups above first."
              ),
              field(
                "Icon",
                select(s, "icon", state.skillIcons, { allowEmpty: false, labelOf }),
                "Only these can be drawn."
              )
            )
          ),
      }),
    ];
  },

  beyond() {
    const beyond = state.content.achievements;
    return [
      headingFields(beyond.heading),
      card(
        "Background symbol",
        field(
          "Symbol",
          text(beyond, "watermark", { placeholder: "♟" }),
          "The huge faded glyph behind this section. Leave empty for none.",
          { optional: true }
        )
      ),
      sortableList({
        list: beyond.items,
        keyOf: "beyond",
        title: (a) => a.title || "Untitled entry",
        meta: (a) => a.kicker || "",
        make: () => ({ kicker: "", title: "New entry", detail: "" }),
        addLabel: "Add an entry",
        body: (a, i, setTitle) =>
          h(
            "div",
            {},
            h(
              "div",
              { class: "row row-2" },
              field("Label", text(a, "kicker"), 'The green word in the margin, e.g. "Tournament".'),
              field("Title", text(a, "title", { onEcho: setTitle }))
            ),
            field("Description", area(a, "detail", { rows: 3 }))
          ),
      }),
    ];
  },

  contact() {
    const contact = state.content.contact;
    const labelOf = iconLabeller(state.contactIcons);
    return [
      headingFields(contact.heading),
      card(
        "Résumé button",
        linkFields(contact.resume, {
          label: "Button",
          hint: "A file in your public folder, e.g. /resume.pdf",
        })
      ),
      sortableList({
        list: contact.links,
        keyOf: "contact",
        title: (l) => l.label || "Untitled link",
        meta: (l) => l.value || "",
        make: () => ({
          label: "New link",
          value: "",
          href: "",
          icon: state.contactIcons[0] || "HiOutlineMail",
        }),
        addLabel: "Add a contact link",
        body: (l, i, setTitle) =>
          h(
            "div",
            {},
            h(
              "div",
              { class: "row row-2" },
              field("Label", text(l, "label", { onEcho: setTitle }), "The small line on the card."),
              field("What is shown", text(l, "value"), "e.g. your address or @handle.")
            ),
            h(
              "div",
              { class: "row row-2" },
              field(
                "Where it goes",
                text(l, "href"),
                "A full https:// address, or mailto:you@example.com"
              ),
              field(
                "Icon",
                select(l, "icon", state.contactIcons, { allowEmpty: false, labelOf })
              )
            )
          ),
      }),
    ];
  },

  menu() {
    const nav = state.content.nav;
    const footer = state.content.footer;
    return [
      card(
        "Site name, top left",
        h(
          "div",
          { class: "row row-2" },
          field("Name", text(nav, "brand"), 'The white part, e.g. "benosh".'),
          field("Highlighted part", text(nav, "brandAccent"), 'The green part, e.g. ".tech".', {
            optional: true,
          })
        )
      ),
      card("Button, top right", linkFields(nav.cta, { label: "Button" })),
      card(
        "Menu items",
        h("p", {
          class: "hint",
          text: "Hidden on phones. Each address is usually a #section on this page.",
        }),
        sortableList({
          list: nav.links,
          keyOf: "nav",
          title: (l) => l.label || "Untitled item",
          meta: (l) => l.href || "",
          make: () => ({ label: "New item", href: "#" }),
          addLabel: "Add a menu item",
          body: (l, i, setTitle) =>
            h(
              "div",
              { class: "row row-2" },
              field("Text", text(l, "label", { onEcho: setTitle })),
              field("Address", text(l, "href"), 'e.g. "#projects"')
            ),
        })
      ),
      card(
        "Footer",
        h(
          "div",
          { class: "row row-2" },
          field("Name in the copyright", text(footer, "name"), "The year is added automatically."),
          field("Built-with note", text(footer, "builtWith"), "Bottom right.")
        ),
        h("p", {
          class: "hint",
          text: "The links along the middle of the footer are your live sites.",
        })
      ),
    ];
  },

  site() {
    const site = state.content.site;
    return [
      card(
        "Address",
        field(
          "Web address",
          text(site, "url"),
          "The address link previews are resolved against. Change this only if the domain changes."
        )
      ),
      card(
        "Browser and search engines",
        field("Browser tab title", text(site, "title")),
        field(
          "Search description",
          area(site, "description", { rows: 3 }),
          "The grey text under your title in Google results. Around 150 characters."
        )
      ),
      card(
        "Link previews",
        h("p", {
          class: "hint",
          text: "What appears when someone pastes your link into WhatsApp, LinkedIn or Discord.",
        }),
        field("Share title", text(site, "ogTitle")),
        field("Share description", area(site, "ogDescription", { rows: 2 })),
        field("Twitter description", area(site, "twitterDescription", { rows: 2 }))
      ),
    ];
  },

  pictures() {
    const wrap = h("div", { class: "card" });
    wrap.append(h("p", { class: "card-title", text: "In your public folder" }));
    const list = h("div", { class: "items" });
    wrap.append(list);

    const paint = async () => {
      list.textContent = "";
      const result = await api("/api/assets");
      if (!result.ok || !result.images.length) {
        list.append(h("div", { class: "empty", text: "No pictures yet." }));
        return;
      }
      const used = JSON.stringify(state.content);
      for (const image of result.images) {
        const inUse = used.includes(image.url);
        list.append(
          h(
            "div",
            { class: "item", "data-open": "false" },
            h(
              "div",
              { class: "item-head", style: "cursor:default" },
              h("img", {
                src: `/asset${image.url}`,
                alt: "",
                style:
                  "width:54px;height:36px;object-fit:contain;background:var(--surface-2)",
              }),
              h("span", { class: "item-name", text: image.url }),
              h("span", {
                class: "item-meta",
                text: `${Math.round(image.bytes / 1024)} KB${inUse ? " · in use" : ""}`,
              }),
              h("button", {
                class: "btn btn-sm btn-ghost btn-danger",
                type: "button",
                text: "Delete",
                disabled: inUse,
                title: inUse
                  ? "This picture is on the site - remove it there first."
                  : "Delete this file",
                onclick: async () => {
                  if (!confirm(`Delete ${image.url}? This cannot be undone.`)) return;
                  const result = await api("/api/asset/delete", {
                    method: "POST",
                    body: JSON.stringify({ url: image.url }),
                  });
                  if (!result.ok) return toast(result.error || "Could not delete.");
                  toast("Deleted.");
                  paint();
                },
              })
            )
          )
        );
      }
    };

    paint();
    return [wrap];
  },
};

// --- chrome -----------------------------------------------------------------

function renderRail() {
  const nav = $("#rail-nav");
  nav.textContent = "";
  for (const section of SECTIONS) {
    const count = section.count ? section.count(state.content) : null;
    nav.append(
      h(
        "button",
        {
          type: "button",
          "aria-current": String(state.section === section.id),
          onclick: () => {
            state.section = section.id;
            state.open.clear();
            render();
          },
        },
        h("span", { text: section.label }),
        count !== null ? h("span", { class: "count", text: String(count) }) : null
      )
    );
  }
}

function renderBanners() {
  const holder = $("#banners");
  if (!holder) return;
  holder.textContent = "";

  if (state.problems.length) {
    holder.append(
      h(
        "div",
        { class: "banner banner-error" },
        h("strong", { text: "Not saved - please fix these:" }),
        h(
          "ul",
          {},
          state.problems.map((p) => h("li", { text: p }))
        )
      )
    );
  }
  if (state.warnings.length) {
    holder.append(
      h(
        "div",
        { class: "banner banner-warn" },
        h("strong", { text: "Saved, but check these:" }),
        h(
          "ul",
          {},
          state.warnings.map((w) => h("li", { text: w }))
        )
      )
    );
  }
}

function render() {
  renderRail();

  const [title, blurb] = PAGE_COPY[state.section];
  $("#page-title").textContent = title;

  const page = $("#page");
  page.textContent = "";
  page.append(
    h(
      "div",
      { class: "page-head" },
      h("h2", { text: title }),
      h("p", { text: blurb }),
      h(
        "p",
        { class: "legend" },
        h("span", { class: "req", text: "*" }),
        " must be filled in before you can publish. Everything else is optional."
      )
    ),
    h("div", { id: "banners" }),
    ...[renderers[state.section]()].flat()
  );

  renderBanners();
}

function toast(message) {
  const node = h("div", { class: "toast", text: message });
  document.body.append(node);
  setTimeout(() => node.remove(), 2600);
}

// --- publish ----------------------------------------------------------------

const PUBLISH_STEPS = [
  ["check", "Checking your content"],
  ["build", "Building the site"],
  ["commit", "Saving a version"],
  ["push", "Publishing to the web"],
];

async function runPublish() {
  const dialog = $("#publish-dialog");
  const body = $("#publish-body");
  const foot = $("#publish-foot");
  const message = $("#publish-message").value;

  body.textContent = "";
  const stepList = h("ul", { class: "steps" });
  const nodes = {};
  for (const [id, label] of PUBLISH_STEPS) {
    const node = h(
      "li",
      { "data-state": "waiting" },
      h("span", { class: "dot" }),
      h("span", { text: label })
    );
    nodes[id] = node;
    stepList.append(node);
  }
  const consoleBox = h("div", { class: "console", text: "" });
  body.append(stepList, consoleBox);
  foot.textContent = "";

  const log = (line) => {
    consoleBox.textContent += line + "\n";
    consoleBox.scrollTop = consoleBox.scrollHeight;
  };

  const finish = (ok, headline, detail) => {
    $("#publish-title").textContent = headline;
    $("#publish-sub").textContent = detail;
    foot.textContent = "";
    foot.append(
      h("button", {
        class: ok ? "btn btn-primary" : "btn",
        text: "Close",
        onclick: () => dialog.close(),
      })
    );
    if (ok) refreshGit();
  };

  try {
    const response = await fetch("/api/publish", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let current = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        if (!part.trim()) continue;
        const event = JSON.parse(part);

        if (event.type === "step") {
          if (current) nodes[current].dataset.state = "done";
          current = event.step;
          nodes[current].dataset.state = "active";
        } else if (event.type === "log") {
          log(event.line);
        } else if (event.type === "failed") {
          if (event.step && nodes[event.step]) {
            nodes[event.step].dataset.state = "failed";
          }
          log(event.detail || "");
          finish(
            false,
            "Nothing was published",
            "Your site is untouched and still live. Fix what is listed below, then try again."
          );
          return;
        } else if (event.type === "done") {
          if (current) nodes[current].dataset.state = "done";
          for (const [id] of PUBLISH_STEPS) {
            if (nodes[id].dataset.state === "waiting") {
              nodes[id].dataset.state = "done";
            }
          }
          finish(
            true,
            event.nothingToDo ? "Nothing to publish" : "Published",
            event.nothingToDo
              ? "Your live site already matches what is here."
              : "Vercel is rebuilding now. benosh.tech will be live in about a minute."
          );
          return;
        }
      }
    }

    finish(
      false,
      "Publishing stopped",
      "The connection ended unexpectedly. Nothing was lost - try again."
    );
  } catch (err) {
    log(err?.message || String(err));
    finish(false, "Publishing failed", "Nothing was published. Your site is untouched.");
  }
}

function openPublishDialog() {
  const dialog = $("#publish-dialog");
  $("#publish-title").textContent = "Publish to the web";
  $("#publish-sub").textContent =
    "Your site will be rebuilt and checked before anything goes live.";

  const body = $("#publish-body");
  body.textContent = "";
  const input = h("input", {
    type: "text",
    id: "publish-message",
    placeholder: "Updated my about section",
    maxLength: 72,
  });
  body.append(
    field("What did you change?", input, "Just a note for your own history.", {
      optional: true,
    })
  );

  const foot = $("#publish-foot");
  foot.textContent = "";
  foot.append(
    h("button", { class: "btn", text: "Cancel", onclick: () => dialog.close() }),
    h("button", { class: "btn btn-primary", text: "Publish now", onclick: runPublish })
  );

  dialog.showModal();
  input.focus();
}

async function refreshGit() {
  const result = await api("/api/state");
  if (result.ok) {
    state.warnings = result.warnings || [];
    renderBanners();
  }
}

// --- boot -------------------------------------------------------------------

async function boot() {
  const result = await api("/api/state");
  if (!result.ok) {
    $("#page").textContent = "";
    $("#page").append(
      h("div", {
        class: "banner banner-error",
        text: result.error || "Could not load your content.",
      })
    );
    return;
  }

  state.content = result.content;
  state.warnings = result.warnings || [];
  state.siteUrl = result.siteUrl;
  state.previewUrl = result.previewUrl;
  state.skillIcons = result.skillIcons || [];
  state.contactIcons = result.contactIcons || [];

  const link = $("#live-link");
  link.href = result.siteUrl || "#";
  $("#brand-site").textContent =
    (result.siteUrl || "").replace(/^https?:\/\/(www\.)?/, "") || "your site";

  // The preview link only works once Next has printed its port, which takes a
  // few seconds. Poll until it appears rather than shipping a dead link.
  const preview = $("#preview-link");
  const setPreview = (url) => {
    if (!url) return false;
    preview.href = url;
    preview.textContent = "Open live preview →";
    return true;
  };
  if (!setPreview(state.previewUrl)) {
    preview.textContent = "Preview starting…";
    const timer = setInterval(async () => {
      const fresh = await api("/api/state");
      if (fresh.ok && setPreview(fresh.previewUrl)) clearInterval(timer);
    }, 2000);
    setTimeout(() => clearInterval(timer), 90000);
  }

  setSaveState("saved", "Saved");
  render();
}

$("#btn-publish").addEventListener("click", openPublishDialog);

$("#btn-revert").addEventListener("click", async () => {
  if (
    !confirm(
      "Throw away every change you have made since your last publish?\n\nThis cannot be undone."
    )
  ) {
    return;
  }
  const result = await api("/api/revert", { method: "POST" });
  if (!result.ok) {
    toast(result.error || "Could not undo.");
    return;
  }
  state.content = result.content;
  state.open.clear();
  state.problems = [];
  setSaveState("saved", "Saved");
  render();
  toast("Changes undone.");
});

// Ctrl/Cmd+S saves immediately rather than waiting for the debounce.
window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    save().then((ok) => ok && toast("Saved."));
  }
});

// Never let the window close with an edit still sitting in the debounce.
window.addEventListener("beforeunload", (event) => {
  if ($("#save-state").dataset.tone === "saving") {
    event.preventDefault();
    event.returnValue = "";
  }
});

boot();
