# Leu supplied-image showcase and sharp film

The Leu opening uses the six owner-supplied images. The overview presents the
three-phone composition on desktop and a readable complete handset on mobile.
Home → Library → Read → Tell it back are keyboard-accessible learning steps.
Platform focus preserves the selected step. The desktop image consistently
represents the reading companion rather than pretending to change into other
screens. Phone overview exposes the full four-screen composition, with a local
horizontal scroll viewport on small displays. The reader close-up uses the
larger phone in the hero, retaining 46% more source pixels than the four-screen
composition. Existing learning and engineering sections are preserved.

PNG originals were encoded as lossless WebP, preserving transparency. Supplied
WebP files were copied unchanged. Superseded gallery images and film files are
retired rather than shipping a second obsolete generation.

The blur originated in the preferred 960×540 WebM. Its replacement is a
40-second, 30 fps, 2560×1440 film in VP9 and H.264, with a matching sharp poster.
Real Leu browser states were captured at 2880×1800 from the existing product
build and composed at 2560×1440; the old film was not upscaled. The sequence
covers Home, Library, Read, Explanation, Own words, Explore, Trails, and Home,
with quiet transitions. Cache-versioned filenames prevent the old film from
being reused. Both codec paths retain autoplay, mute, loop, pause, retry, and
poster fallback behavior.

Recreate source captures with:

```sh
node scripts/media/capture-leu-product.mjs /absolute/path/to/leu/web/dist
node scripts/media/render-leu-film.mjs
```

The scripts require the project's Playwright browser and ffmpeg. Set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` for an existing Chromium installation.
Product sample PDFs are opened within the local browser; no uploaded user PDFs
or credentials are included in the captures.

## Verification

- Production build passes. Svelte check: zero errors; four existing warnings in PreviewMedia.
- 189 unit tests pass; 22 served-route tests pass.
- 10 final gallery checks pass on desktop/mobile, including 320/390/768/1440
  widths, aspect ratios, keyboard learning steps, platform focus, and scoped scrolling.
- Five film tests pass per desktop/mobile: playback, pause/resume, actual decoded
  resolution, preferred codec failure, missing media, and blocked autoplay.
- The broader 96-test browser selection completed with 86 passes initially.
  Ten Ask tests initially lacked POST bodies in the temporary local SSR harness;
  correcting that harness resolved them. Three mobile Ask tests then reached
  the existing per-address rate limit when desktop/mobile shared one address;
  all three pass in isolated reruns. No Ask production behavior was changed.
- Required CI smoke verifies the replacement film decodes at Full HD or above.
- All five case-study routes render their headings and return 200. Current
  deployed source was inspected before release. Visual review covered desktop
  and mobile; the existing typography, product header, and interactive learning
  loop are retained.
