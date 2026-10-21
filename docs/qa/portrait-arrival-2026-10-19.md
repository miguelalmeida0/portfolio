# First-arrival portrait correction — 19 October 2026

The previous crossfade release fixed the wrong interaction. The owner explicitly
wants the original WebGL front/back turn preserved. This release restores it
without changing the renderer, shader, portrait assets, or turn timing.

The reproduced bug was first arrival: at 1440x900 the server photo appeared at
630px high, then initialization resized it to 459.359px and GSAP set opacity to
zero plus a 40px translation before animating it back in. Captures and sampled
frames are in /tmp/portfolio-arrival-fix-20261019/live-arrival.json and the
live-before/after-hydration screenshots.

Fix:
- Restore automatic WebGL selection in TypographicHero.
- Remove only the photo's startup fade/translation tween.
- Reveal the photo once after the existing font measurement and layout finish,
  preventing the provisional server dimensions from flashing first.
- Keep the server photo visible with JavaScript disabled and recover it if
  application startup fails. Native input remains uncaptured.

Regression:
- Fresh browser contexts at 390px and 1440px, normal startup and delayed entry JS,
  sample every frame and require a single opaque, stationary photo appearance.
- Independent WebGL capability probing and both turn directions guard against
  replacing the original turn with a crossfade again.
- Original no-JavaScript and aborted-script fallback checks remain enabled.
- The original WebGL integration test is restored.

Executed validation:
- npm run check: 0 errors, 0 warnings.
- npm run test:unit: 355 passed.
- npm run build: passed, bootstrap integrity 1ofkxfc.
- Final production cold-load, turn, fallback and release-route tests:
  27 passed, 1 skipped (WebKit does not expose the Layout Shift API).
- Responsive controls, resizing during turns and typography-wipe checks also
  passed in both browsers in the preceding production run.
