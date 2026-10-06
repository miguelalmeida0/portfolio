# Motion implementation and evidence

Source of truth: `.cache/leu-flow-pages`. Baseline: `914c8a4`.
The audit and priority matrix are in [MOTION_AUDIT.md](MOTION_AUDIT.md).

## Follow-up corrections — 6 October

The user rejected added motion on personal photographs. Removed the portrait
pointer action and the F24 photo's scroll transform. The existing initial arrival
sequence is unchanged. The F24 case-study placeholder now uses the same authentic
hackathon asset as the homepage, at its natural aspect ratio.

Reproduced live F24 → Second Voice opening at scrollY 5073. The case studies'
document-wide CSS smooth scrolling competed with SvelteKit route restoration.
The document now scrolls instantly for route restoration; one Lenis owner handles
wheel and deliberate anchor journeys across home and case studies. Touch stays
native, nested scroll surfaces retain their own input, and reduced motion disables
Lenis. Connected Chrome verified next-project scrollY 0 and Back restoring 6687.

Desktop case-study canvases now share the site gutters instead of a 1312px cap
shrunk to 1050 physical pixels by the approved 80% density. At a 1512px viewport,
the canvas grows from 1049.6px to 1339.2px. Paragraph measures remain constrained.

Regression runner: `scripts/portfolio-corrections.mjs`. Evidence is written to
`artifacts/portfolio-corrections`. The measurements below describe the earlier
motion release, not a fresh performance benchmark of these follow-up changes.

## Implemented decisions

| System | Why it exists | Ownership / primitive | Compact and reduced motion |
|---|---|---|---|
| Static personal photography | Keeps the portrait and team photograph calm, as requested | No added portrait pointer action or F24 photo ScrollTrigger; existing wind text follows the shared preference policy | Photos stay static in all modes |
| Selected Work entrance | Marks the change from introduction to evidence | SplitText line mask on the chapter title | Shorter title timing; reduced mode restores original typography |
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

Final source candidate: `50e9b95`. [Full passing workflow](https://github.com/miguelalmeida0/portfolio/actions/runs/37442005099).

- Build, typecheck and repository lint: PASS, zero Svelte diagnostics.
- Unit tests: 80/80. Authored data/diff tests: 11/11.
- Existing Flow/Leu behavior and motion tests: 21/21; F24/Second Voice: 14/14.
- Motion acceptance: PASS, 45 route/viewport combinations plus lifecycle, initial/runtime reduced motion, keyboard, history, resize, first arrival, pointer, touch and scrollbar checks.
- All 18 before/after survey captures retain identical page heights and heading content. No horizontal overflow, page exceptions or console warnings/errors were recorded in the final production-build surveys.
- Repeated Needle mounts started with seven triggers on every visit: `7, 7, 7, 7, 7`. Every return to CV had zero triggers and zero temporary artwork layers.
- After warming the modules, collected JS heap changed from 3.99MB to 4.78MB across the navigation exercise. Per-cycle samples are retained in `acceptance/results.json`; this is a measured residency increase, not a claim of zero memory growth or an exhaustive leak proof.

### Final controlled performance comparison

Three fresh contexts per condition; medians for LCP/long-task totals, maximum
sampled interaction duration. Mobile uses 390×844 and 4× CPU slowdown; desktop
uses 1440×900. All numbers below are milliseconds.

| Route / device | LCP before → after | Max interaction before → after | Long-task total before → after |
|---|---:|---:|---:|
| Home / desktop | 312 → 376 | 32 → 40 | 0 → 55 |
| Home / mobile 4× | 280 → 340 | 24 → 24 | 70 → 201 |
| Needle / desktop | 272 → 256 | 24 → 40 | 0 → 0 |
| Needle / mobile 4× | 456 → 492 | 32 → 40 | 277 → 484 |

Scroll-frame p95 remained 16.7–16.8ms. The highest after-run interaction sample
was 40ms; the longest after-run task was 135ms. The maximum layout-shift sum in
the full route survey was 0.02151, on Second Voice, equal to its baseline value.

The largest median LCP increase in this run was 64ms. The preceding passing
comparison (`3db5f8b`, run `37440392870`) had flat or lower medians in all four
conditions, so these small samples also show runner variance. Initial parsing
and setup still add work, particularly on throttled Needle. Optional GSAP loading
was moved after the first paint when an earlier draft showed a larger startup
cost. These results do not establish field INP or a universal zero LCP regression.

Raw final evidence: `artifacts/motion/review-50e9b95-before` and
`artifacts/motion/review-50e9b95-after`, including JSON measurements, screenshots
and WebM recordings. The evidence is local and also attached to the workflow;
large recordings are intentionally not stored in Git.

### Corrections made during verification

- Used explicit `scaleX`/`scaleY` quickTo properties after the stronger hover assertion exposed an unsupported combined-scale reset and its browser warning.
- Waited for Svelte's delegated selection and the new image's decode before measuring Needle artwork; source/target padding and CSS zoom no longer distort the flight.
- Kept every already-visible heading unsplit during lazy startup or restored navigation.
- Kept wide touch screens on the smaller, directly tracked scroll interpretation.
- Supplied explicit fixture directories to the existing behavior suites in ESM CI. Their assertions were not weakened.

Production publication and the public-domain spot check follow this accepted
source candidate. The final delivery message records that deployment outcome.
