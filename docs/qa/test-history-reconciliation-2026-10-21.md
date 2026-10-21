# Test history reconciliation — 21 October 2026

The owner authorized reconciling test's 17 unique commits with the reviewed
main-based mega-fix, then validating before promotion and deployment.

Parents: remote test 1118854e81b9c13527d1ffdba28687f1a21794a1 and
mega-fix b3b6ef97472b02954b3c6446281bedcaf631a3cd.
Main at preparation: 1fe54028f0588158552b132314472db0406203fb.
This two-parent merge preserves all remote commits without rewriting history.
The temporary black-homepage exercise was reverted before integration.

## Decisions

| Remote commit | Preserved intent / resolution |
| --- | --- |
| c68b129 | Needle Ask plan, browser fixtures, deterministic source contracts retained; current copy remains first person. |
| ea05e5e | Responsive portrait and focus improvements retained where still active; modern fullscreen navigation owns focus restoration. |
| de928c2 | Browser helper and engine-specific contracts retained; obsolete layout assertions remain historical. |
| d10b1f0 | Recovered case-study history preserved; current main case components and layouts retained. |
| fa6f91e | Needle interactions, Ask source IDs and keyboard-accessible Flow pipeline preserved. |
| 388addd | Responsive portrait decode and engine-specific historical snapshots preserved. |
| ae98cb2 | Inactive F24 surfaces retain contrast; current Flow obsolete-event styling and stronger reduced-motion rules supersede older variants. |
| afc1cb9 | Linux WebKit playbin3 applied to both historical and maintained browser configurations. |
| d6e13c4 | Byte-range test-worker configuration retained for the historical suite; release acceptance continues against the actual Pages build. |
| 6f7168c | Owner branch and author policies already present in candidate. |
| a9c33ea | Current public documentation retained; superseded layout descriptions remain in history. |
| 5b4c66f | Current Needle links preserved. |
| 6042fde | Current owner links retained. |
| 9f5440a | Pinned Actions and disabled credential persistence retained; candidate uses newer pins. |
| 90c5d4e | Sticky case navigation source/live links retained in newer ProductNav and current action tests. |
| ba0d064 | Flow remains code-only, with no fabricated live-app action. |
| 1118854 | Earlier disabled test pushes superseded by explicit owner request to reconcile and validate test before release. |

The 36 conflicts were resolved against the current production architecture.
Valid F24 fragment destinations, case Ask sources, pointer scaling, responsive
portrait decode, and independent browser support changes carry forward.
Late-font fragment alignment uses the shared scroll owner and cancels on user
input, subsequent navigation, or disposal. Six new regression cases failed
before this reconciliation and passed afterward (26 route-transition tests).

Removed VideoLoop and old story-scroll tests remain deleted: PreviewMedia and
the current Story suite replace them. Historical browser tests/snapshots remain
available but are not certified against the redesigned homepage. Maintained
acceptance is tests/e2e/portfolio-release.config.ts, including accessibility,
responsive layouts, navigation, case demos, PDFs, and Ask.

## Validation procedure

Run type checks, unit tests, production build, route health, and native Chromium
and WebKit on this exact committed candidate. Local native browser launch is
restricted, so GitHub test-branch CI is the browser release gate. No production
promotion until those gates pass. Push validated main to use the existing
Cloudflare integration; do not run a second direct deployment.

Pre-commit checks: 420/421 unit tests passed; the build-identity test exceeded
Node's default child-process output buffer on the large uncommitted merge diff.
Svelte reported zero errors/warnings after its configuration fallback. Neither
counts as final release acceptance; repeat both on the clean merge commit.

Final review identified mouse/pen scrollbar input as an additional cancellation
path. Its regression failed before the fix and passes afterward; pointerdown
is captured alongside wheel, touch and keyboard input. No other important
reconciliation issue was found. The first clean merge passed all 421 unit tests,
56 route checks, type checks and production build. Final CI must include this
pointer correction as well.
