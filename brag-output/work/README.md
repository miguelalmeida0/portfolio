# Portfolio film: source

Everything used to make `../brag.mp4`. The film is an HTML composition in which
every frame is a pure function of time. It is captured frame by frame in headless
Chromium and encoded with ffmpeg. The soundtrack is synthesised in Python. Nothing
comes from a template or a stock library.

| Path | What it is |
|---|---|
| `composition/index.html`, `styles.css` | The stage: the portfolio's real hero, Selected work, and the project chapters, set in the site's own tokens (`src/app.css`, `tailwind.css`). |
| `composition/timeline.js` | The timeline. `window.__render(t)` applies one frame and resolves once its images have decoded. |
| `composition/fonts/` | Libre Baskerville and Roboto (the site's fonts) and Source Serif 4 (Second Voice's serif), all under the OFL. |
| `composition/assets/miguel-cutout.png` | The hero portrait with a luminance matte, used to set the name behind Miguel on the end card. Built by `make-matte.py`. |
| `composition/assets/vigia/` | Two real VIGIA console captures from `miguelalmeida0/vigia-crisis` (`data/validation/release/operator-console-screenshots/`). |
| `soundtrack.py` | The original score: 96 BPM, D major, one bar per scene, with the effects pitched to the key and sharing its reverb. Mastered to -14 LUFS and -1.3 dBTP. |
| `audio/soundtrack.json` | Loudness stats and the cue sheet (every effect and the visual event it follows). |
| `render.mjs` | Stills and video capture. `check-determinism.mjs` renders the same instants in order and shuffled, then compares them. |

## Rebuild

Run from the repository root (Node 22, Python 3 with numpy, scipy and Pillow, ffmpeg with libx264).

```bash
# 1. The two product films, as frames the timeline can address exactly.
mkdir -p brag-output/work/frames/secondvoice brag-output/work/frames/mirror
ffmpeg -i static/projects/ghostwriter/ghostwriter-demo.mp4 -q:v 2 -start_number 0 brag-output/work/frames/secondvoice/f%04d.jpg
ffmpeg -i static/projects/mirror-ai/active-image-demo.mp4 -q:v 2 -start_number 0 brag-output/work/frames/mirror/f%04d.jpg

# 2. Matte and soundtrack.
python3 brag-output/work/make-matte.py
python3 brag-output/work/soundtrack.py

# 3. Stills for review, then the film (frame 0 is the poster instant).
node brag-output/work/render.mjs --stills 1.9,4.2,9.9,11.9,13.9,16.8,18.9,21.2,24.4 --out brag-output/work/stills
node brag-output/work/render.mjs --video brag-output/work/video-60.mp4 --fps 60 --crf 17 --poster 24.4

# 4. Mux.
ffmpeg -i brag-output/work/video-60.mp4 -i brag-output/work/audio/soundtrack.wav \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart brag-output/brag.mp4
```

`render.mjs` expects Chromium at `/opt/pw-browsers/chromium`. On another machine, change `executablePath` in `render.mjs`.

## Timing

Ten bars of 2.5 s. Each cut lands on a bar line and each product moment lands on a beat. The Second Voice film is offset so that its button press falls on beat 2 of bar 4, and the Mirror AI film so that the giraffe's contour closes on beat 2 of bar 5.

| Bar | Time | Scene |
|---|---|---|
| 1 | 0.0–2.5 | Camera Harness reads the portrait: *Identifying…* → **Miguel Almeida ✓** |
| 2–3 | 2.5–7.5 | The real hero; the cursor clicks *Explore my work*; Selected work |
| 4 | 7.5–10.0 | Second Voice AI: the live rewrite as Tolkien |
| 5 | 10.0–12.5 | Mirror AI: the contour and inspector |
| 6 | 12.5–15.0 | Camera Harness: iris open, result needs confirmation |
| 7 | 15.0–17.5 | VIGIA: operational briefing, then event response |
| 8 | 17.5–20.0 | F24: Built from scratch. Used by hundreds of companies. |
| 9 | 20.0–22.5 | I build the systems around AI. |
| 10 | 22.5–25.0 | End card |
