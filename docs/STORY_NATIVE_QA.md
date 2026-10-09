# Story editorial redesign, 6 October 2026

This supersedes STORY_PACING_QA.md. The user rejected paced chapter scrolling
and explicitly requested a redesign that needs no scrolling changes.

## Design

- Native document scrolling on every device. Remove the chapter controller and
  exclude Story from Lenis installation, including custom anchor travel.
- A visible introduction, compact topic index, and eight editorial rows. Each
  answer owns its illustration in normal document flow; none are exchanged in a
  sticky stage or gated by the reader's scroll position.
- One fixed top-right Back link to home. The index uses real hash links that
  remain useful with JavaScript disabled. No fixed bottom dock or repeated step
  buttons, no viewport-sized chapters, no nested illustration scrollers.
- Preserve the authored answers and interactive examples. Play examples only
  when requested, with reduced-motion state changes applied immediately.
- The green short version is a normal, always-accessible section with copy and
  contact actions. No timed hold and no claim that all eight were read.
- Keep existing colors and professional type. Desktop uses an index rail and
  answer/example pairs; tablet and mobile use a normal stacked reading flow.

## Regression evidence

The previous controller captures wheel, touchmove and navigation keys, cancels
their default behavior and writes scroll positions through a GSAP tween. A
small input in the live browser moved from y=0 to y=590 and selected chapter 2.

The native-wheel regression waits for hydration and observes cancellation in a
later task, after every event listener has completed. A microtask observation
was too early in a native event dispatch and was corrected before accepting it.

The corrected regression failed against `85c162b` in run 37476411512:
the wheel event was prevented.

## Rendered review

Local Chrome review covered desktop (1440px and 1512px), tablet (768px),
and mobile (390px). The chapter index, centered answer/example pairs, mobile
stacking, fixed Back link, green summary and F24 presentation image were inspected.
Needle's live and candidate first view retain the same geometry and content.
Before/after captures are in `artifacts/story-editorial/`.

The first implementation run, 37478362360, passed native input, all eight
examples, no-JavaScript reading and F24 photo checks. Its mobile Back/reload
stress case exposed an unhandled ViewTransition callback rejection. The route
owner now handles `updateCallbackDone` rejection alongside `ready` and `finished`.
The next run exposed an additional route/history race during an unfinished
snapshot. Story now bypasses snapshot transitions and the mobile history veil:
entering and leaving this reading page is ordinary, immediate navigation.
The stress assertions were retained unchanged.

## Scope and performance

No new dependencies. Story no longer installs Lenis, ScrollTriggers or a paced
scroll controller. Its only scroll observation is IntersectionObserver for the
index highlight and cancellation of examples leaving view. Example timers are
cancelled on unmount and when the tab becomes hidden. No ambient animation runs
behind reading copy. Field INP/LCP figures have not been measured in this pass.

F24 uses the existing 1024x685 presentation photo, with its intrinsic ratio,
lazy loading, descriptive alt text and no image animation. The homepage photo
composition and downloadable CV are unchanged.

## Passing release checks

Run [37479488178](https://github.com/miguelalmeida0/portfolio/actions/runs/37479488178)
on application commit `a226bbe` passed:

- Typecheck and lint: zero errors and warnings; production build passed.
- 80 unit tests, 11 case-study data tests and 35 case-study interaction/motion tests.
- 14 new browser tests: native wheel regression; five viewport sizes in both
  standard and reduced motion; touch, PageDown, every chapter link, fixed Back,
  copy, history/reload and resize; all eight interactive examples; reading with
  JavaScript disabled; uncropped, static F24 image.
- No page errors or horizontal overflow in the browser matrix.

This is Chromium automation plus real Chrome visual review, not a Safari or
physical-device performance certification. Playwright captures and traces are
attached to the CI run as `portfolio-corrections`.

## 9 October 2026: shared portfolio motion restored

Story now opts into the existing Lenis scroll owner and its same-page link
navigation. Wheel easing stays continuous and does not snap between chapters;
touch and keyboard reading remain browser-native. Chapter and summary links
use their CSS `scroll-margin-top` for final positioning, preserve fragment
URLs and move focus after scrolling. Reduced motion scrolls immediately.

A deliberate link into Story participates in the standard case-study
View Transition, with one short intro and portrait reveal. The prior native
exits and Back/Forward safeguards remain in place to avoid the earlier
history snapshot race. The portrait no longer has an on-image caption.

The historical QA evidence above describes the earlier native-only contract,
not this later behavior. Regression coverage lives in
`tests/e2e/specs/story-motion.spec.ts` and the updated Story test suite.
