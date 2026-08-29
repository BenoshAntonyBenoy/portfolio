# Editing benosh.tech

Everything on the site — every word, link and picture — lives in one file,
`src/content/content.json`. This panel is the front end for that file. You do
not need to open any code to change the site.

## Opening it

Double-click **`benosh main adminpanel.bat`** in the project folder.

A black window opens and your browser follows a moment later. The window is the
panel running; leave it open while you work and close it when you are done.
Closing it also stops the live preview.

The first run installs what the site needs and takes a minute. Later runs are
instant.

## The two links in the bottom-left corner

- **Open live preview** — the site running on this computer, showing your
  unsaved-to-the-web changes as you type. Takes a few seconds to appear on
  startup.
- **Open published site** — the real benosh.tech, as the world currently sees
  it.

## Editing

Pick a section on the left; the rail follows the order of the page itself.
Every change saves to your computer automatically about a second after you stop
typing — the word beside **Publish** tells you where you stand (*Saving*,
*Saved*, *Not saved*). Nothing you do here touches the live site until you
press Publish.

Lists — projects, skills, contact links — work the same way everywhere:

- Click a row to open it.
- Drag the `⫶` handle on the left to reorder. Project numbers follow the order
  by themselves.
- **Duplicate** copies a row, which is the quickest way to add something
  similar.

### Highlighting a word

Section headings and your About paragraphs understand two marks:

| You type | You get |
| --- | --- |
| `Featured *projects*` | *projects* in italic green |
| `I'm **Benosh Benoy**` | **Benosh Benoy** in bright white |

One highlight per heading is the house style. A lone `*` with no partner is
refused, because it would show up as a literal asterisk on the live site.

### Pictures

Drop a file onto any picture box. It is resized, converted to `.webp` and saved
into the site's `public` folder for you. You can also type a path by hand in the
box underneath.

The **Pictures** page lists every file in that folder. Anything the site still
points at cannot be deleted until you remove it from the section that uses it.

## Publishing

Press **Publish**. Four things happen in order:

1. **Checking your content** — every required field is filled, every highlight
   is paired, every picture exists.
2. **Building the site** — the same build Vercel runs. If it fails, publishing
   stops here.
3. **Saving a version** — a commit, with the note you typed.
4. **Publishing to the web** — pushes to GitHub, which is what tells Vercel to
   deploy.

benosh.tech goes live about a minute later.

If any step fails, **nothing is published and the live site is untouched**. The
reason is printed in the box; fix it and press Publish again.

## Undo all changes

Throws away everything you have changed since your last publish and puts the
content back the way the live site has it. It cannot be undone, and it does not
touch anything already published.

## If something goes wrong

**"Port 4322 is already in use"** — the panel is already open in another window.
Close it, or use the one that is already running.

**"Node.js is not installed"** — install it from <https://nodejs.org>, then run
the `.bat` again.

**Publishing fails at "Publishing to the web"** — that step needs your GitHub
sign-in, which lives on this computer. If it has expired, publishing from a
terminal once (`git push`) will prompt you to sign in again and fix it for the
panel too.

**The preview looks wrong but the panel says Saved** — reload the preview tab.
If it is still wrong, close the black window and start the `.bat` again.

## For a developer reading this later

- `server.mjs` — Node built-ins only, no dependencies. Binds `127.0.0.1` only,
  so there is no auth by design. It also owns the `next dev` child process.
- `schema.mjs` — the real validation gate. The site imports `content.json`
  through a cast (`src/lib/content.ts`), so TypeScript cannot check it; this
  runs before every write and before every publish.
- `app.js` — the panel UI. Plain JS, no build step. Text inputs mutate state and
  debounce a save; only add/delete/reorder re-render.
- The pre-publish build writes to `.next-admin-check`, not `.next`, so it cannot
  clobber the running dev server. `next.config.mjs` reads `NEXT_DIST_DIR`.
- Icon names in `content.json` must exist in `src/lib/icons.ts`. The lists in
  `schema.mjs` mirror it, and adding an icon means editing both.
