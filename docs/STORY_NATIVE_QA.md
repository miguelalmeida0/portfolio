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

## 9 October 2026: single-owner arrival and scroll reveals

Entering Story originally stacked a 640ms headline fade/translate and a
720ms portrait crop/scale inside the root View Transition's crossfade.
The two animation timelines competed, especially when the route snapshot
was captured during the intro animation. The page now uses only a gentle,
Story-specific route crossfade. Mobile menu navigation keeps its existing
veil, and Story history traversal keeps its native safeguards.

Below-fold reading sections reveal once using the shared IntersectionObserver
action: copy settles over a small distance, followed by a shallow aperture
on its interactive example. Content already in the first viewport is not
re-hidden during hydration. Motion remains optional, does not lock scrolling,
and leaves native anchors, focus, keyboard navigation, reduced motion and
JavaScript-disabled reading intact. No new animation dependencies were added.

Regression coverage is in `tests/unit/story-reveal.test.mjs` and
`tests/e2e/specs/story-motion.spec.ts`; the latter is included in
desktop and mobile CI browser smoke.

## 9 October 2026: portrait continuity from Home

The homepage photograph and Story photograph now participate in a named,
same-document View Transition when the home picture is decoded and visible.
The same original portrait is snapshotted and interpolated by the browser.
Only the real picture travels, not the Ask UI over the home photograph.
The sage background moves with the snapshot and the root scene crossfades
quietly behind it. A duration under 800 ms uses a settling ease without
bouncing, a separate overlay clone, layout mutations or new dependencies.

On mobile, an eligible home-to-Story link closes the menu before the snapshot
and permits the same browser-managed photo transition. Rapid repeated taps
remain single-owner. Offscreen, undecoded, unsupported and reduced-motion
cases retain the existing navigation, including its mobile opaque veil.
Story exit and history snapshot safety is unchanged.

Regression tests for image continuity, mobile entry, reduced motion and
shared-photo cleanup are in `tests/e2e/specs/story-portrait-transition.spec.ts`.

## 9 October 2026: the name silhouette replaces the portrait flight

The photograph's shared View Transition did not match the original introduction,
so the photo flight has been removed. Home to Story, Story back to Home,
browser history between them, and other-page visits into Story now use one
condensed name-and-silhouette transition inspired by the existing first-visit
introduction. It reuses the exact 63 rows of MIGUEL ALMEIDA typography and the
original silhouette path, with the decoded photograph's alpha mask where
available.

One fixed surface covers the old route before Kit commits the new document,
then the name lettering resolves toward the destination portrait. Position
is measured from the real object-fit image rectangle. Offscreen or undecoded
portraits begin from the centered name instead of flying from nowhere.
Navigation uses one owner, avoids competing root view transitions, and takes
less than one second at standard motion preferences. Reduced motion keeps
the original accessible route behavior; interruption releases hidden images
and removes the overlay. The first-visit introduction is unchanged.

Regression tests are in `tests/e2e/specs/story-identity-transition.spec.ts`
and `tests/unit/route-transition.test.mjs`.

## 9 October 2026: single full-page fade for Story navigation

The user rejected the portrait-flight and name-silhouette route effects. Their
experimental modules, related styles and browser tests have been removed.
Story now uses the portfolio's existing full-page route veil, with only opacity
animated (230 ms cover, 400 ms reveal), in both directions, including page
history navigation. Kit commits the new route while the page is completely
covered. No letter shapes, moving images, zoom, masking, blur or extra hero
entrance animations participate. Mobile menu navigation uses the same fade
with focus and screen-reader behavior preserved.

The homepage's original first-visit name introduction is independent and was
not changed. Normal Story Lenis scrolling, chapter links and below-fold
reveals are unchanged. Reduced-motion visitors see no decorative fade.
Validation is in `tests/e2e/specs/story-fade-transition.spec.ts` and the
route owner's unit tests; the former runs on desktop and mobile in CI.

## 9 October 2026: editorial page continuity and restored navigation

The prior 230 ms cover and 400 ms reveal used an opaque full-screen veil,
hiding both pages and showing a nearly blank canvas during every Story
navigation. Story also hid the site's primary desktop navigation and mobile
menu, leaving a fixed Back pill overlapping the header's right side.

Story now uses the browser's View Transition API to keep the outgoing and
incoming pages visible together. A short opacity cross-dissolve with at most
11 px of vertical settle replaces the blank veil. The regular header is
present and active on Story, and when it is onscreen its snapshot is placed
in a stable independent transition layer, rather than leaving with the page.
The previous floating Back pill has been removed; the site logo provides a
consistent Home link and the Work, Story, CV, Contact and Ask controls are
available in the header. Story is marked as the current page in desktop
and mobile navigation.

For mobile navigation, close the menu before capturing the old page; no
opaque veil competes with the native Story transition in supporting browsers.
The existing menu veil remains the fallback for unsupported/reduced motion
cases and unrelated routes. The new history and rapid-navigation cleanup
guards restore the route state only for the transition that owns it.

The original first-visit name introduction and case studies are untouched.
Native Story scrolling, in-page links, focus restoration, and scroll reveals
are retained. Browser acceptance is in
`tests/e2e/specs/story-editorial-transition.spec.ts`, with route-owner
unit tests and updated native Story reading tests.
