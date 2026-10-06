# Motion implementation and evidence

Source of truth: `.cache/leu-flow-pages`. Baseline: `914c8a4`.
The audit and priority matrix are in [MOTION_AUDIT.md](MOTION_AUDIT.md).

## Implemented decisions

| System | Why it exists | Ownership / primitive | Compact and reduced motion |
|---|---|---|---|
| Portrait depth | Gives the first viewport a precise response after the existing arrival completes | Portrait action, GSAP quickTo, matchMedia; existing wind animation now follows the shared preference policy | No portrait pointer movement on compact or coarse-pointer devices; reduced mode also stops wind |
| Selected Work entrance | Marks the change from introduction to evidence | SplitText line mask on the chapter title; ScrollTrigger transforms the F24 photograph inside its existing crop | Shorter title timing and at most 4px photo travel; reduced mode restores original typography and photo |
| Project attention | Makes a preview acknowledge focus while preserving its hit target | quickTo on the inner media plane and title arrow; existing video controller still owns playback | Touch press/release feedback, no hover simulation; reduced mode retains normal focus/color feedback |
| Needle selection | Preserves the identity of the artwork chosen from the results | Flip.fit on one disposable image; decoded intrinsic dimensions preserve the artwork's proportions despite different padding and desktop CSS zoom | No cross-screen flight on touch/compact layouts; short local opacity settle if the inspector is visible; reduced mode uses the original immediate selection |
| Case-study chapter punctuation | Separates problem, decision and evidence without moving reading copy | Shared SplitText action, masked lines, once-only ScrollTriggers; accessible heading labels and responsive re-splitting | Shorter timing/stagger; reduced mode removes wrappers and restores original headings |
| Reading orientation | Makes the existing active chapter and reading position continuous | ProductNav owns an animated active surface and transform-only progress rule | Existing compact navigation remains unchanged with a progress rule; reduced mode restores the original instantaneous active state |
| Project identity across routes | Connects project selection to the next reading context | Existing native View Transition owner shares a visible project label; does not introduce a second routing mechanism | Existing mobile menu/history veil remains authoritative; reduced mode uses ordinary navigation |

Timing derives from the existing motion tokens: 170ms feedback, 360ms state
change, 520ms chapter and 620ms object transfer. CustomEase defines the common
settle and feedback curves. No new dependency was installed.

## Lifecycle and interaction constraints

- GSAP imports are lazy. Server-rendered content and the first viewport never wait for them.
- Each owner uses matchMedia/context reversion plus explicit observer/listener cleanup. Async imports, font readiness, image decode and queued frames check ownership before touching the DOM.
- Needle cancels its disposable flight on another selection, scrolling, resize, preference change or unmount. Selection itself is never delayed by the animation.
- Photo and preview frames remain fixed; only their clipped contents move. There is no new pinning, scroll capture or global cursor.
- Chapter headings already in view at initialization stay visible, including restored scroll positions.
- All paragraphs, technical model state machines, project order, external URLs and navigation semantics remain unchanged.

## Evidence and reproducibility

Before local review: `artifacts/motion/before` contains desktop/mobile captures
and the actual control/route inventory. After visual review:
`artifacts/motion/after`. Automated runs attach their evidence to the GitHub
**Motion review** workflow on `motion-review/20261006`.

The workflow restores `src`, `package.json` and the lockfile from `914c8a4` in
its before job. Both jobs build and serve through Wrangler, using the same
scripts, browser and runner class. No development-server timings are presented
as production performance.

- `node scripts/motion-survey.mjs before|after`: all nine routes at desktop/mobile dimensions, complete scroll traversal, screenshots, console exceptions and raw timing data.
- `node scripts/motion-performance.mjs before|after`: three fresh browser contexts per homepage/Needle and desktop/mobile combination; mobile CPU slowed 4×; actual selection and preview-control interactions; scroll-frame samples. Includes matched before/after interaction videos.
- `node scripts/motion-acceptance.mjs`: all nine routes at 1440×900, 1280×800, 768×1024, 390×844 and 375×812; title visibility and semantic text, overflow, keyboard anchors, orientation-like resizing, fast/slow scrolling, mid-page reload, runtime and initial reduced motion, repeated SPA history, trigger cleanup, heap snapshots, artwork selection, fixed hover targets, initial arrival, mobile menu, touch release and scrollbar dragging.
- Existing case-study behavior/motion tests exercise F24, Second Voice, Leu and Flow with their original controls.

## Measurement interpretation

These are controlled Chromium lab samples on GitHub Linux runners. They are not
field INP, CrUX data, physical-phone results, Safari/Firefox coverage or an
exhaustive proof of zero jank. Event Timing reports sampled interaction duration;
entries below the observer's 16ms threshold may be absent. Frame intervals are
sampled during scrolling, not inferred from screenshots. The layout-shift value
is the sum of shifts without recent input, a conservative lab indicator rather
than a separately calculated field CLS session window.

Heap measurements use forced collection before/after repeated navigation.
Lazy-loaded modules and browser caches may remain resident; a single heap delta
is not proof of a leak. Trigger cleanup and repeated counts are checked directly.

Local headless Chromium is blocked by this Mac's browser-launch permissions.
Connected Chrome supplies local visual review; the Linux workflow supplies the
repeatable headless Playwright, CPU and memory evidence.

## Deliberately left alone

The existing silhouette arrival, wind headline, visible video loops, Story scene
runner, F24 architectural models, Flow proposal/rollback, Leu source return,
Second Voice comparison and Line M footer already have meaningful motion.
Their behaviors were retained. CV/PDF reading remains calm.

Rejected: velocity skew, new pinned chapters, every-card tilt, decorative
particles, animated gradients, a custom cursor, paragraph reveals, a second
intro/loader and a false F24 photo-to-interface morph. None explains the work
better than the existing content.

## Verification status

Final candidate evidence and production verification are recorded here after
the browser and performance runs complete. This working report is not yet a
production acceptance claim.
