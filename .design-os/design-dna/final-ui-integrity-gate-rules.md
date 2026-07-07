# Final UI Integrity Gate

No frontend/design task may be handed off until final UI integrity passes.

Build/lint is not visual proof.
Component splitting is not visual proof.
Reports are not visual proof.
Screenshots and DOM geometry are required.

## Hard Blockers

- clipped text
- cut words
- nav overflow
- button/CTA clipping
- card title/body clipping
- media over text
- container overlap over text
- fixed/sticky overlay covering content
- text hidden with overflow hidden
- accidental huge blank viewport areas
- unresolved user complaint

If a blocker appears in any required screenshot, final verdict is failed.

## No Overlap Without Permission

Visual overlap is allowed only when all are true:

- overlap is intentional
- overlap is documented
- overlapped object is decorative or protected
- no readable text is covered
- z-index/layers are defined
- screenshot proof shows readability

Otherwise container overlap is a blocker.

## No Hidden Text Fixes

Do not use overflow hidden, clip, max-height, fixed height, or masking to hide a text-fit failure.

If text is intentionally truncated:

- it must be non-critical
- it must have a title/aria/full-detail path
- it must be documented
- it must not be CTA/nav/card title text

## Text Wins Over Visual Objects

If text and media/shape/card/animation compete:

- text wins
- CTA wins
- navigation wins
- readable card content wins
- visual object moves, docks, resizes, or exits

## Final Handoff Rule

If final UI integrity is `failed` or `blocked`, final handoff must say so and cannot claim success. Fix the UI, rerun screenshots and DOM geometry validation, then rerun the gate.
## Final UI Integrity Gate v2

The final UI gate must test a matrix of viewport widths, scroll positions, and interactive states.

Fixed breakpoint checks are not enough.

Required viewport matrix:

- 390
- 430
- 640
- 768
- 900
- 1024
- 1180
- 1280
- 1366
- 1440
- 1536
- 1728
- 1920

Required scroll samples:

- 0
- 0.10
- 0.20
- 0.35
- 0.50
- 0.65
- 0.80
- 0.90
- 1.00

Required state samples where applicable:

- default
- nav active states
- selected card/detail panel open
- sticky/pinned active section
- compact nav state
- reduced motion state if practical

Hard rule: if a layout failure appears at any sampled width, scroll point, or state, final handoff is blocked.

Hard blockers:

- any clipped/cut critical text
- text hidden by overflow
- card/sticker/label covering critical text
- floating label/container drifting into another container
- media/image/video/SVG over text
- fixed/sticky overlay covering content
- nav label overflow
- compact nav abbreviation fallback
- CTA clipping
- card title/body clipping
- body horizontal overflow, unless it is intentional controlled horizontal scroll and documented
- accidental blank viewport area
- user's original complaint remains visible

Score caps:

- final gate v2 not run on visual frontend work: max score 4
- final gate v2 failed but handoff claimed success: max score 2
- layout failure appears at any sampled width: max score 3
- floating container overlaps another container: max score 3
- cut text remains after gate: max score 2
- final report lacks screenshot matrix evidence: max score 4
- final report does not include failed/passed viewport list: max score 4

Final report must include finalUiIntegrityVerdict, viewport matrix tested, scroll samples tested, blocker count, screenshot evidence directory, passed states, failed states, and whether any original user complaint remains visible.

# Final UI Integrity Gate v3

Final UI Integrity Gate v3 supersedes v2 for visual/frontend handoff.

The final UI gate must perform a viewport resize sweep, not only fixed breakpoint checks.

## Required Width Sweep

- minimum: 360
- maximum: 1920
- step: 40px or smaller if practical

## Required Height Samples

- 720
- 844
- 900
- 1080

At minimum, test:

- 360x720
- 390x844
- 430x844
- 640x900
- 768x900
- 900x900
- 1024x900
- 1180x900
- 1280x900
- 1366x900
- 1440x900
- 1536x900
- 1728x1080
- 1920x1080

## Required Scroll Samples

- 0
- 0.10
- 0.20
- 0.35
- 0.50
- 0.65
- 0.80
- 0.90
- 1.00

## Required State Samples

- default
- nav active states
- selected card/detail open
- compact nav state
- sticky/pinned stage
- reduced-motion if practical

## Hard Rule

If any blocker appears at any sampled width, height, scroll position, or state, final handoff is blocked.

## V3 Hard Blockers

- cut text
- viewport-edge clipping
- partially visible critical containers
- overlapping containers
- floating-object drift
- fake live/realtime/status language without real live behavior
- decorative narrative/replay/mission/case-file chrome without real product behavior
- sepia/espresso/umber brown-black surface on page, card, panel, note, container, sidebar, nav, or stage
- messy offset/backplate/layered-container corner geometry
- clicked nav item does not become active
- adjacent/right-side nav item becomes active instead
- first/last nav item never receives active state
- app name/brand chrome unreadable over dark or variable background
- accidental huge blank space
- horizontal scroll showing unreadable partial content
- user complaint still visible

## Fake Live / Fake Realtime Check

Before final handoff:

- search visible copy for `LIVE`, `live feed`, `realtime`, `real-time`, `online now`, `currently live`, `streaming`, `presence`, and `activity feed`
- if found, require documented live behavior
- if no real live behavior exists, block final handoff

## AI Theater Chrome Check

Before final handoff:

- search visible copy for `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Mission Room`, `Case File`, `CL-`, `dossier`, `operation`, and decorative severity/status chips
- if found, require a real product object, data source, route/state change, or user task it supports
- if the language is decorative incident drama, block final handoff

## Sepia Container Surface Check

Before final handoff:

- inspect page backgrounds, cards, panels, notes, containers, sidebars, nav, modals, drawers, detail panels, and framed objects
- block any muddy sepia/espresso/umber brown-black surface family
- do not accept commander, incident, archive, nocturne, premium, warm dark mode, parchment, tobacco, brass, or operational rationales

Accepted proof:

- `data-live-justified="true"`
- `data-live-source`
- `data-update-cadence`
- `data-realtime-source`

## Layered Container Corner Check

Before final handoff:

- inspect media frames
- inspect offset cards
- inspect backplates
- inspect layered containers
- inspect all four corners
- ensure backplate and frontplate radii/offsets are intentional
- block if any corner looks broken, messy, or accidental

Expected hooks:

- `data-layered-container`
- `data-backplate`
- `data-frontplate`

## Navigation Active State Check

Before final handoff:

- click every nav item
- include first and last nav items
- verify the clicked item becomes active
- verify no adjacent/right-side item receives selected state incorrectly
- verify visual active state and `aria-current`/`aria-selected` agree
- verify mobile bottom nav works after scrolling
- verify desktop/tablet/mobile nav variants use the same active source-of-truth
- block if any nav item cannot become selected
- block if active state maps to the wrong item

## Brand Chrome Readability Check

Before final handoff:

- inspect app name, wordmark, logo text, and persistent brand chrome
- inspect dark, light, image, video, gradient, and scroll background states behind it
- require a stable readability strategy when the background changes
- block if app name/wordmark struggles against darker backgrounds

Expected hooks:

- `data-brand-chrome`
- `data-app-name`
- `data-wordmark`
- `data-brand-contrast-safe="true"`

## Final Report Must Include

- viewport widths tested
- heights tested
- scroll samples tested
- passed states
- failed states
- blocker count
- screenshot evidence directory
- final handoff allowed true/false

## V3 Score Caps

- final gate v3 not run on visual frontend work: max score 4
- final gate v3 failed but handoff claimed success: max score 2
- fixed breakpoint-only evidence for final handoff: max score 4
- width sweep evidence missing: max score 4
- viewport-edge clipping remains: max score 2
- active card/panel partially unreadable: max score 3
- horizontal scroll shows partial critical content at rest: max score 3
- floating object drifts or overlaps after resize: max score 3
- fake LIVE badge: max score 4
- fake live feed label: max score 3
- fake live icon/dot: max score 3
- fake realtime/presence status: max score 3
- fake narrative/fictional incident chip: max score 4
- replay/mission chrome used as default identity: max score 4
- oversized replay metadata strip: max score 4
- fake case-file or dossier identifier: max score 3
- repeated AI-theater chips across pages: max score 3
- sepia/espresso/umber surface appears on card/panel/container: max score 2
- sepia/espresso/umber surface appears on nav/sidebar/chrome: max score 2
- final handoff claims success while sepia container remains visible: max score 2
- messy exposed backing corner: max score 4
- misaligned media backplate: max score 3
- mismatched radius causing broken corner: max score 3
- clicked nav item does not become selected: max score 2
- adjacent/right-side item becomes selected: max score 2
- nav item never receives selected state: max score 2
- first/last nav item never receives selected state: max score 2
- app name unreadable over dark/variable background: max score 3
- brand chrome over image/background without contrast strategy: max score 4
- wordmark contrast depends on lucky crop/scroll position: max score 4
- blank scroll state remains: max score 4
- user complaint remains visible: max score 2
