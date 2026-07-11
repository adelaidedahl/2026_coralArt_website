# Individual creature cutout images

Drop each creature's individual cutout PNG in this folder. Filenames must
match the `image` field for that creature in `data/creatures.json`.

The project ships with 22 placeholder slots already wired up:

```
creature-01.png
creature-02.png
...
creature-22.png
```

Each cutout PNG should:

- Be cropped to the same bounding box the creature occupies within the full
  sticker (transparent background outside the creature itself).
- Use the pixel `x`, `y`, `width`, `height` values you record for that
  creature in `data/creatures.json` — see the root `README.md` for the full
  walkthrough on measuring these.

Until a given file is added, the site shows a dashed placeholder box with
the creature's name in its place, so the layout and click behavior can be
previewed/tested before all artwork is final.
