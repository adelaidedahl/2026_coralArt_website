# Moorea Coral Reef Infinity

An interactive website for a hand-drawn sticker: click or tap any creature in
the full sticker to spotlight it and see its name, description, and a fun
fact. Plain HTML/CSS/JS, no build step, no backend — hosted on GitHub Pages.

**Live site:** https://adelaidedahl.github.io/2026_coralart_website/
(after GitHub Pages is enabled — see [Deployment](#deployment) below).

## How it works

- `index.html` loads `css/styles.css` and `js/main.js`.
- `js/main.js` fetches `data/creatures.json`, draws the full sticker image,
  and lays one clickable, transparent-background creature cutout on top of
  it for every entry in that file, positioned using each creature's `x`,
  `y`, `width`, `height` (in pixels, relative to the full sticker).
- Clicking/tapping a creature dims every other creature to ~35% opacity,
  brings the clicked one to full opacity with a highlight glow, and opens a
  popup with its name, description, and fun fact.
- Clicking the same creature again, clicking empty space, clicking outside
  the popup, pressing the close button, or pressing <kbd>Esc</kbd> all reset
  the sticker back to normal.

Because everything is driven by `data/creatures.json`, adding, renaming, or
re-describing creatures never requires touching HTML/CSS/JS.

## Folder structure

```
index.html                        Page markup
css/styles.css                    All styling (colors, fonts, layout, popup)
js/main.js                        Loads creatures.json and wires up interactivity
data/creatures.json               Content: names, descriptions, fun facts, positions
assets/images/sticker/            The one full sticker PNG goes here
assets/images/creatures/          Individual creature cutout PNGs go here
```

## Adding your images (do this first)

1. **Full sticker** — save it as:
   ```
   assets/images/sticker/full-sticker.png
   ```
2. **Each creature cutout** — save as `creature-01.png`, `creature-02.png`,
   etc. (already wired up for 22 creatures) in:
   ```
   assets/images/creatures/
   ```
   Each cutout should be cropped tightly to the same bounding box that
   creature occupies inside the full sticker, with a transparent background
   around it.

Until a file is added, the site shows a clearly-labeled dashed placeholder
box instead of a broken image, so you can preview and click-test the layout
before all artwork is ready.

## Filling in `data/creatures.json`

Open `data/creatures.json`. At the top:

```json
"sticker": {
  "file": "full-sticker.png",
  "referenceWidth": 4400,
  "referenceHeight": 1200,
  ...
}
```

1. Open your finished `full-sticker.png` in any image editor (Preview,
   Photoshop, GIMP, even macOS "Get Info") and note its exact pixel
   dimensions.
2. Set `referenceWidth` and `referenceHeight` to those exact numbers. This
   is the single most important step — every creature's position is
   calculated as a percentage of these two values, so if they're wrong,
   every overlay will be misaligned.

Then, for each creature in the `creatures` array:

```json
{
  "id": "creature-01",
  "name": "Clownfish",
  "image": "creature-01.png",
  "alt": "An orange and white clownfish peeking out of an anemone",
  "description": "A small reef fish that lives symbiotically among the stinging tentacles of sea anemones, which it's immune to.",
  "funFact": "Clownfish can change sex — every group has one dominant female, and if she dies, the top male changes sex to replace her.",
  "x": 0,
  "y": 0,
  "width": 200,
  "height": 1200
}
```

| Field         | What it is                                                            |
|---------------|-------------------------------------------------------------------------|
| `id`          | A unique, code-friendly identifier (letters, numbers, hyphens).       |
| `name`        | Shown as the popup heading.                                           |
| `image`       | Filename of that creature's cutout PNG in `assets/images/creatures/`. |
| `alt`         | Short accessible description of the image (for screen readers).      |
| `description` | 1–3 sentences shown in the popup body.                                |
| `funFact`     | A fun fact or stat shown in the popup's highlighted footer.           |
| `x`, `y`      | Pixel coordinates of the **top-left corner** of this creature's bounding box, measured on the full sticker image. |
| `width`, `height` | Pixel size of that bounding box.                                  |

### Finding `x`, `y`, `width`, `height`

Use any image editor's rectangular selection/crop tool on the full sticker:

- **Preview (Mac):** Tools → Rectangular Selection, draw a box around the
  creature — the size/position shows in the selection.
- **Photoshop/GIMP:** use the Marquee/Rectangle Select tool; the toolbar or
  status bar shows position and size in pixels as you drag.
- **Figma:** select the layer and read `X`, `Y`, `W`, `H` in the right panel.

Whatever tool you use, `x`/`y` is the distance from the sticker's top-left
corner to the creature's top-left corner, and `width`/`height` is the size
of the box around it — all in pixels, matching `referenceWidth` /
`referenceHeight`.

You don't need to be pixel-perfect — a slightly generous bounding box just
means a slightly larger clickable area, which is fine.

### Adding more or fewer creatures

Copy or delete an object in the `creatures` array in `data/creatures.json`
and add/remove the matching PNG in `assets/images/creatures/`. Nothing else
needs to change.

## Previewing locally

Because the page loads `data/creatures.json` via `fetch()`, opening
`index.html` directly from the filesystem (`file://`) will fail in most
browsers. Serve it locally instead, e.g.:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

or, in VS Code, use the "Live Server" extension.

## Deployment

This repo is set up for **GitHub Pages, deployed from the `main` branch**.
One-time setup (if not already enabled):

1. On GitHub, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.

After that, every push to `main` automatically republishes the site at:

```
https://adelaidedahl.github.io/2026_coralart_website/
```

No build step is required — it's plain static HTML/CSS/JS served as-is.

## Design system

| Token       | Value     | Usage                                  |
|-------------|-----------|-----------------------------------------|
| Deep navy   | `#2E3A4F` | Primary text, header/footer background |
| Slate blue-gray | `#63719A` | Secondary backgrounds/accents      |
| Burnt orange/rust | `#C1512E` | Accent, active/highlight states  |
| Light gray  | `#EAEAEA` | Light section backgrounds              |
| White       | `#FFFFFF` | Base background                        |

- Headings: **Manrope** (bold/extrabold)
- Body text: **Nunito Sans**
- Base font size: 16px
