# Portfolio UI/UX audit — 19 October 2026

The six confirmed defects below are fixed and covered by regression checks. The current animated FRONTEND / DESIGNER portfolio remains available at http://localhost:4275/hero-lab/typographic#top.

Project: `/Users/malmeida/Downloads/portfolio-canon3-current-4275-20261015-203402/current-state-copy`
Server: Vite development server, port 4275, PID 5268 at verification.
This folder is a preserved current-state copy without a .git directory. The older portfolio-typographic-canon3-craft checkout was not modified.

## Fixes

| Reproduced defect | Correction and verification |
| --- | --- |
| Back during the forward route shutter left the URL and rendered page inconsistent | Release the interrupted transition and await its obsolete navigation completion before committing the history destination. Desktop and mobile Back/Forward regression checks pass in Chromium and WebKit. |
| Ask clipped its input and collapsed the answer region on short screens | Move the question into the scrollable answer region and constrain sheet/panel geometry to available height. At 390×320, the input ends at y=299 and the answer retains 94px in both engines. |
| Scrollbar hit area intercepted a project video's pause control | Narrow the rail from 44px to 24px. Real pointer pause/play passes. |
| Index accepted clicks before hydration installed its handler | Disable Index until its own component mounts. Keyboard, focus restoration and reduced-motion checks pass. |
| Fixed masthead covered the scrollbar thumb | Raise the narrow rail above the masthead and below the Ask panel. Pointer dragging and keyboard scrolling pass. |
| Mobile first paint used desktop layout until initialization | Add responsive pre-hydration layout, reserve compact control space and preload existing fonts. The authored final geometry and animation timings remain unchanged. No-JavaScript geometry and cold hydration regression checks pass. |

Application files changed:
- src/lib/motion/routeTransition.ts
- src/lib/components/ask/AskPanel.svelte
- src/lib/ask/ask.css
- src/lib/components/experience/BookmarkScrollbar.svelte
- src/lib/hero-lab/typographic/TypographicNav.svelte
- src/lib/hero-lab/typographic/TypographicHero.svelte
- src/lib/hero-lab/typographic/turntable/src/template.ts
- src/lib/hero-lab/typographic/turntable/styles/turntable-header.css

## Executed verification

| Check | Result |
| --- | --- |
| Current portfolio browser suite, Chromium and WebKit | 89 passed, 1 skipped, 0 failed, 0 flaky; the skipped CLS/CDP check is Chromium-only |
| Unit suite | 355 passed |
| HTTP route contract suite | 56 passed |
| Svelte/type check | 0 errors, 0 warnings |
| Broad browser route sweep | 27 page routes, 81 browser/viewport combinations |
| Automated accessibility scans | 18 scans, no reported axe violations |
| Internal URL checks | 32 checks |
| Touch emulation | Chromium and WebKit: role switching, orientation change, Index → CV → Back, short-screen Ask and close |

The broad sweep found no horizontal overflow, missing same-page anchors, broken loaded local images/videos, page errors or unexpected HTTP errors in the tested states. Current routes were checked at widths including 320, 390, 768 and 1440 pixels; short-height and orientation cases were exercised separately. This is sampled coverage, not proof for every possible viewport.

Detailed interactions include both header roles and resizing during transitions; wipe contrast; transition/history recovery; Index shortcuts and focus; Ask context, persistence, real local greeting and simulated 503 retry; CV counters and PDF zoom, annotation keyboard focus, new-tab links and fallback; all five case-study demos and chapter controls; the complete next-project tour ending at Work; Story career tabs and all eight scenes; footer keyboard behavior, truthful clipboard failure and PDF access; scrollbar dragging and video controls.

The page sweep covered:
- /, /cv, /cv/pdf, /story
- /hero-lab
- /hero-lab/typographic and its /story and /cv routes
- /hero-lab/cinematic, /hero-lab/kinetic
- /hero-lab/editorial-poster, /hero-lab/experimental, /hero-lab/kinetic-story
- /hero-lab/counterform, /hero-lab/bearing, /hero-lab/throughline and each one's /story and /cv routes
- /work/f24, /work/needle, /work/second-voice, /work/leu, /work/flow

Utility checks additionally verified the LinkedIn departure page, sitemap XML, expected 404 pages and working recovery links, portfolio PDF redirect, legacy case-study aliases, /lab redirect and legacy prototype Story/CV redirects.

## Performance evidence

Cold local Vite development server, emulated iPhone 13, 4× CPU slowdown, 9 Mbps down / 1.5 Mbps up, 60ms latency:

| Measurement | Result |
| --- | --- |
| Layout shift before / after initial-layout fix | 0.159 / 0.012 |
| First contentful paint, final sample | 452ms |
| Renderer ready, final sample | 9.375s |
| Transfer, final sample | 9.18MB |
| Steady animation sample | 659 frames over six seconds; p95 frame interval 16.7ms; no intervals over 50ms |
| Initial long tasks | 67ms, 185ms, 168ms |

The cold development load remains heavy. These numbers describe the local development bundle and a bounded sample; they do not establish production load performance, sustained performance on low-end hardware or production readiness. No production build or deployment was performed.

## Reproduce and inspect evidence

From the project directory:

```sh
node node_modules/@playwright/test/cli.js test -c tests/e2e/portfolio-audit.config.ts
```

The config uses the already-running localhost:4275 server. Set PORTFOLIO_AUDIT_URL to change it and PORTFOLIO_AUDIT_OUTPUT to change the artifact directory. Artifacts default to the OS temporary directory to avoid Vite watching generated HTML. Run source/type checks separately from browser tests: Svelte sync can trigger a development-server reload.

Fresh evidence is in /tmp/portfolio-fix-audit-20261019:
- verified/results.json — final isolated browser run (2026-10-19T10:05:05Z; 203 seconds)
- unit-final.log, check-final.log, route-tests.log
- route-audit.json — page, link and runtime sweep
- final-validation.json — touch, utility and final performance evidence
- validation-before-first-paint-fix.json — comparison measurement
- final-cold-mobile.png, chromium-touch-short-ask.png, webkit-touch-short-ask.png
- before.json, after.json, changes.json — preservation inventories
- backup/ — original contents of edited files

These /tmp artifacts are temporary; this report and the regression tests are retained in the project.

## Scope and limits

- No reset, branch changes, commits, pushes or deployments. Existing originals were backed up before edits; no original inventoried file was deleted and no media assets were changed.
- The design, animation treatment, authored content and navigation structure were preserved. Changes address behavior and responsive initialization.
- Chromium and WebKit were exercised with emulated touch. Firefox, physical devices and real mobile virtual keyboards remain unverified.
- Archive prototypes received route, layout, media, anchor and runtime checks; detailed interaction coverage focuses on the current typographic portfolio and all five case studies.
- Case-study demos use their authored examples; this audit does not certify separate hosted products or their backends.
- Some Ask regression tests use authored answers and deliberate service failures. No paid-provider availability claim is made.
- Zero axe findings is not a full manual accessibility certification.
- Historical test assumptions about superseded headings/layouts were triaged. The passing result refers to the current audit suite, not every historical end-to-end test in the repository.
