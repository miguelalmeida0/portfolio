# Restored typographic portrait introduction — 19 October 2026

Project: /Users/malmeida/Downloads/portfolio-canon3-current-4275-20261015-203402/current-state-copy

Preview: http://localhost:4275/hero-lab/typographic#top
Replay: http://localhost:4275/hero-lab/typographic?intro=replay#top

The previous name-silhouette opening was attached only to the older homepage. The typographic route now has a dedicated version registered to its existing front portrait, /turntable-header/miguel-front-contour.webp (1016×1065). No portrait pixels or other media were changed.

The sequence retains the 3.6-second progression: a small silhouette made from MIGUEL ALMEIDA rows grows, resolves into the photograph, and lands in the measured live header image box. Both materials share one rectangle and alpha silhouette. The header waits for that handoff before starting its role cycle, avoiding a second portrait entrance or an early turn to DESIGNER.

Normal entry runs once per tab session. #top is eligible; deeper anchor links bypass it. The replay URL explicitly replays the sequence. Reduced motion, saved motion preferences and data-saving policy continue to bypass the intro. Keyboard, pointer and scroll input can skip; the existing scroll gesture gate consumes only the dismissal gesture. Image failure, missing hydration and bounded timeouts release the page.

Verification:
- 22 intro browser tests passed in Chromium and WebKit.
- 16 existing header/navigation/Ask/video regression tests passed in Chromium and WebKit.
- 355 unit tests passed.
- Svelte/TypeScript check: 0 errors, 0 warnings.
- Portrait landing geometry differs by less than one CSS pixel at widths 390, 768 and 1440; desktop-to-mobile resize during transfer also passes.
- Natural completion and subsequent automatic role change pass.
- Reduced motion at entry and during playback, Escape, wheel scroll recovery, reload/session suppression, deep-link bypass, failed portrait request and stalled application scripts pass.
- Captured and visually inspected the silhouette, approach, photo resolution and final handoff.
- Local desktop browser and emulation evidence only; no physical-device or production-performance claim.

Changed existing files:
- src/app.html — first-paint eligibility and explicit replay
- src/routes/+layout.svelte — mount the appropriate intro on the typographic route
- src/lib/hero-lab/typographic/TypographicHero.svelte — coordinate presentation completion
- src/lib/hero-lab/typographic/turntable/src/types.ts
- src/lib/hero-lab/typographic/turntable/src/index.ts — delay cycling until handoff

Added:
- src/lib/components/experience/TurntableIntroduction.svelte
- src/lib/motion/turntable-introduction.ts
- tests/e2e/specs/typographic-intro.spec.ts
- tests/e2e/typographic-intro.config.ts

Run the focused checks with:
```sh
node node_modules/@playwright/test/cli.js test -c tests/e2e/typographic-intro.config.ts
```

Originals and evidence: /tmp/portfolio-intro-20261019/
- before/ and before.json preserve all five edited originals, with verified hashes.
- browser.log, header.log, unit.log and check.log contain fresh results.
- silhouette.png, approach.png, resolve.png, handoff.png and handoff-{390,768,1440}.png show the sequence.
- changes.diff records the scoped change.

Existing audit fixes and unrelated sections were preserved. No commits, pushes or deployments.

## Follow-up: final-size handoff

Replaced the fixed 3.05x enlargement with growth bounded by the live header portrait dimensions. Growth finishes before travel begins at 2150ms; width and height stay at the destination size throughout entry. This removes the enlarge-then-shrink behavior while retaining the reveal, timing, skip policy and role cycle.

The new regression first reproduced overshoot at 1200ms on a 390px viewport. After correction, all 28 intro browser tests pass in Chromium and WebKit, including no overshoot, no shrinking and fixed transfer dimensions at widths 390, 768 and 1440. All 355 unit tests pass; Svelte check reports 0 errors and 0 warnings. Visual captures confirm matching approach and final portrait dimensions. Originals, diff, logs and screenshots are retained in /tmp/portfolio-intro-size-20261019.

## Follow-up: stationary reveal with identical handoff pixels

The opening now reveals in place at the actual header portrait coordinates and dimensions from its first visible frame. Removed the centered starting pose, growth, travel and resize interpolation. Until the live header is measured, the portrait stays hidden to prevent a misplaced first-paint flash.

A strict screenshot comparison exposed a separate rasterization difference between the overlay photograph and the live photograph. The intro now reveals the actual live image in its original DOM location, through an alpha cutout in the backdrop. No duplicate photograph is displayed or swapped. The name silhouette shares the measured live rectangle. Temporary image and background styles are restored on completion, skip, reduced motion and failure.

Fresh verification: 28 browser tests passed in Chromium and WebKit; 355 unit tests passed; Svelte/TypeScript reported 0 errors and 0 warnings. At widths 390, 768 and 1440, the silhouette rectangle matches the live portrait within 0.02 CSS pixels at every sampled stage. Screenshot comparisons of the portrait rectangle immediately before and after completion report exactly zero changed channels and zero maximum difference in all six browser/viewport combinations. Resize, natural completion, role cycling, keyboard/wheel skip, reduced motion, image failure and stalled hydration also pass.

Evidence, original backups, diff and captures: /tmp/portfolio-intro-registration-20261019. The initial failing pixel run was diagnostic evidence; browser-final.log is the passing final run. Local verification only; no commit, push or deployment.
