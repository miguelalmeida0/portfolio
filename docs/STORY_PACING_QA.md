# Story chapter pacing — 6 October 2026, afternoon

This replaces the earlier free-scroll decision in STORY_SCROLL_QA.md following
the user's explicit request for step-by-step progression and a final reveal pause.

## Behavior

- Wheel gestures advance one chapter. A burst cannot skip chapters during travel.
  Sustained input can advance again after 850ms. Reversing changes direction immediately.
- One scoped GSAP tween owns chapter travel (shared cinematic duration, 620ms).
  Story disables Lenis wheel smoothing to avoid competing scroll owners.
- Tall inline chapters advance in readable segments before moving to the next chapter.
  One vertical swipe advances one segment; taps and scene controls still work.
- Desktop illustration, stage and reading chapter share a viewport center above
  the fixed dock. The final panel uses the same geometry, including short laptops.
- The final green reveal holds downward wheel/key/touch progression for 2.2 seconds.
  Home, Back, Continue, reverse scrolling, Escape and scrollbar dragging bypass it.
- Home and labeled Back remain in the fixed dock; a prominent top pair appears
  after the first chapter. The dock also exposes all chapters directly.
- Reduced motion keeps stepping but uses instant travel and no timed hold.
  Runtime preference changes finish travel and release the pause immediately.
- Component teardown kills the tween, timers and all input listeners. No new
  ScrollTriggers, extra scene timelines or animation of the personal photo.

## Evidence

Local connected-browser inspection confirmed centered laptop chapters and the
prominent exits. Playwright runs against the production build on Linux because
the local sandbox blocks launching headless Chrome.

The matrix covers 1920×1080, 1440×900, 1280×800, 1440×685, 768×1024,
390×844 and 375×812 in normal and reduced motion. It checks fast wheel bursts,
all chapter arrivals, center alignment within 2px, touch segments, final hold and
release, full summary reveal, action clearance, immediate Back/Home, keyboard
PageDown/PageUp, browser Back, responsive remounts, overflow and page errors.

First candidate run 37466110080 passed all six phone/tablet journeys. All eight
desktop journeys exposed a 32px offset at the final sticky boundary; the old
40px (80% density) bottom margin caused it and was removed. The strict centering
assertion is retained. Corrected candidate `2aea841` passed **14/14 browser
journeys**, typecheck, lint, all **80 unit tests**, and production build in
[run 37467160542](https://github.com/miguelalmeida0/portfolio/actions/runs/37467160542).
Only this evidence note changed after that tested candidate.

CI screenshots live under artifacts/portfolio-corrections/steps. The previous
free-scroll baseline remains at artifacts/portfolio-corrections/story/before-laptop.png.
This interaction fix makes no new field INP, LCP or performance-score claim.
