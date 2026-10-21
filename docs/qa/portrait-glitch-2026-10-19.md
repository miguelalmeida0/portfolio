> Superseded by portrait-arrival-2026-10-19.md. The crossfade addressed the wrong interaction; the original WebGL turn is restored and the first-arrival photo flash is fixed separately.

# Portrait distortion fix — 19 October 2026

Live reproduction captured recurring distortion during FRONTEND / DESIGNER
changes. The synthetic WebGL turn projects two photographs onto a curved
surface and visibly stretches/smears the face between poses. Correcting a
hidden-surface intersection defect in an experiment did not remove that
visible distortion, so the shader experiment was not shipped.

The portfolio now explicitly uses the header's existing image crossfade.
Both registered portrait assets and their geometry are unchanged. Typography,
role controls, autoplay, layout, scrolling and routes retain their existing
behavior. The optional WebGL renderer source is unchanged.

The new browser regression failed against the canvas implementation, then
passed with the image transition. It samples every animation frame through
four alternating role changes at 390px and 1440px in Chromium and WebKit,
checking that the original images remain visible, their combined opacity
does not drop, their frame does not resize, and each role reaches its photo
and headline without page errors. Existing tests now assert rendered photo
opacity rather than the optional renderer's internal data-rest-role attribute.

Evidence is in /tmp/portfolio-photo-glitch-20261019, including live-before
frames, the rejected shader experiment, the failing regression, production
build logs, browser results and final local captures. This is desktop-browser
and emulated-viewport evidence, not a physical-device test.

Validation:
- npm run check: 0 errors, 0 warnings.
- npm run test:unit: 355 passed.
- npm run build: passed; bootstrap integrity 1cwduop.
- Production-browser checks: 22 passed in Chromium and WebKit (release routes, portrait frames, responsive controls and typography wipe).
