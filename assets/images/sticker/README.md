# Full sticker image

Drop the complete sticker PNG in this folder as:

```
full-sticker.png
```

That exact filename is what `data/creatures.json` (`sticker.file`) and
`js/main.js` expect. If you'd rather use a different filename, update
`sticker.file` in `data/creatures.json` to match.

**Important:** once you add the file, open it in any image viewer/editor to
find its exact pixel dimensions (width × height), then set
`sticker.referenceWidth` and `sticker.referenceHeight` in
`data/creatures.json` to those exact numbers. Every creature's position is
calculated as a percentage of these two values, so if they don't match the
real image size, the overlays will drift out of alignment.
