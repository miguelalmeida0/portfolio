# Navigation Responsiveness

Navigation must never rely on one desktop-only layout.

## Hard Blockers

- nav item label overflows its chip/pill/circle
- nav icon and text collide
- nav bar creates huge empty space at narrower widths
- nav becomes unreadable on resize
- nav text disappears without accessible label
- compact nav uses arbitrary two-letter abbreviations
- nav hides full labels without icons
- nav item active state causes layout jump or clipping
- circular nav item contains long text without fallback
- nav position overlaps page content unintentionally

## Required Nav Behavior

- define desktop, tablet, and mobile nav variants
- for mobile route/app experiences, define a persistent bottom nav / bottom route controller by default
- define label-to-icon transition if space is constrained
- define wrap/collapse/scroll behavior for many nav items
- preserve accessible labels when visual labels hide
- active state must not change item width unpredictably
- nav bar width must be content-aware, not huge empty pill by default
- route navigation must remain accessible while scrolling on mobile
- if nav becomes icon-only, custom labels or aria-labels must exist
- nav must be tested at 1440, 1280, 1024, 768, and 390

## Preferred Patterns

- desktop: full labels if space allows
- medium: short labels or segmented groups
- small: icon + active label only, or bottom drawer/menu
- art-directed nav can be custom, but it must still fit

## Compact Navigation Icon Fallback

When navigation does not have enough space for full labels, the fallback must be a recognizable icon system, not cryptic abbreviations.

Preferred compact patterns:

1. Icon + full label for active item.
2. Icon-only with accessible aria-label and screen-reader text.
3. Bottom nav with icon + short full label.
4. Compact menu/drawer if there are too many items.
5. Horizontal icon rail with active label shown separately.
6. Route dots only if a full chapter label is visible elsewhere.

Use icons from:

- Material Symbols / Material Icons when available.
- Existing project icon system if already installed.
- Inline SVG icons with Material-style clarity if no icon package is available.
- Lucide or another approved icon set only if already part of the project.

For Late Check FM-style station nav, use icons like:

- check-in: login / meeting_room / key
- wall: dashboard / view_quilt / article
- beds: bed
- now/tonight: schedule / event
- rules: rule / checklist
- book: calendar_month / shopping_bag / confirmation_number

Hard rule:

Do not use arbitrary two-letter abbreviations such as IN, WL, BD, NW, RL, BK as the primary visible nav fallback.

Allowed exception:

Only use short codes if all are true:

- the codes are brand/domain-standard
- the full label is visible nearby
- the icon is also present
- aria-label contains the full label
- the codes do not look like broken/clipped text

Hard blockers:

- compact nav uses arbitrary two-letter abbreviations
- user cannot understand nav item without decoding
- nav hides full labels without icons
- active state shows only a cryptic code
- nav looks like text was clipped into initials
- nav item has no aria-label/full accessible name
- nav changes to icon-only but icons are ambiguous
- nav creates huge empty space after labels collapse

## Hard Bans

- text forced into circles
- huge empty nav container after labels collapse
- default pill nav that wastes space
- active state that clips label
- nav with no responsive plan
- nav item content outside its hit target
- arbitrary two-letter compact nav abbreviations
- compact nav with no icons and no real menu pattern

## Score Caps

- nav label outside item: max score 3
- nav huge dead space at breakpoint: max score 4
- nav active state clips text: max score 3
- nav lacks responsive variant: max score 5
- nav inaccessible after label hiding: max score 5

## Final UI Integrity Gate v2 Addendum

Navigation must be checked across the full final UI v2 viewport matrix, scroll samples, and applicable nav states.

Hard blockers:

- nav label overflow at any sampled width
- compact nav abbreviation fallback without icon and accessible full label
- nav item content outside its hit target
- huge empty nav container when labels collapse

Final handoff is blocked if any nav failure appears at any sampled width, scroll position, or state.
- compact nav uses arbitrary abbreviations: max score 4
- nav hides full labels without icons: max score 4
- nav icons lack accessible labels: max score 5
- active compact nav item is unclear: max score 5
- nav looks clipped/broken at small width: max score 3
- no small-screen nav variant: max score 5

## Rejected Case Study

Use `visual-library/rejected/case-studies/late-check-fm-small-screen-nav-abbreviation-failure/` as the canonical rejected example. The issue is not the Late Check FM concept; the issue is a compact nav fallback that replaced readable labels with arbitrary initials instead of icons or a real menu.

## Final UI Integrity Gate

Before final handoff, run `final-ui-integrity-gate`. Nav overflow, clipped nav labels, cryptic compact nav, huge empty nav containers, or missing accessible labels are blockers until fixed and rerun.

## Persistent Mobile Bottom Navigation

For mobile and compact viewports, app-like navigation, route navigation, scroll chapter navigation, and multi-section interactive experiences must use a persistent bottom navigation / bottom route controller by default.

This applies to product apps, mobile product flows, scroll-heavy brand sites with route chapters, interactive landing pages with stations/sections, route-based experiences like Late Check FM, pages with 3+ primary destinations or chapters, and experiences where users need navigation while scrolling.

Default mobile behavior:

- nav is fixed or sticky near the bottom
- respects safe-area inset
- remains visible while scrolling
- uses icons or icon + active label
- has accessible full labels
- has minimum touch targets
- does not block important content
- active state is clear
- full route label is available for the active item

Allowed alternatives:

- bottom sheet menu
- bottom dock
- floating lower-right route controller
- gesture-safe bottom rail
- compact menu button fixed at bottom

Only allowed if it remains accessible while scrolling.

Hard blockers:

- mobile nav appears only at top and disappears on scroll
- route navigation is unavailable after scrolling
- mobile nav is not thumb-reachable
- nav labels are cryptic or abbreviation-only
- nav blocks content without safe-area handling
- nav has no accessible labels
- nav item hit targets are too small
- nav active state is unclear
- desktop nav is simply squeezed into mobile

Required:

- desktop nav variant
- tablet nav variant
- mobile bottom nav variant
- icon strategy
- active label strategy
- safe-area handling
- aria-label/full label strategy
- scroll behavior
- screenshot proof at 390, 430, 640, and 768

Score caps:

- mobile route nav disappears on scroll: max score 3
- mobile nav is top-only for app-like route experience: max score 4
- compact nav has no bottom/persistent access: max score 4
- mobile nav lacks icons or clear labels: max score 4
- mobile nav has no accessible labels: max score 5
- mobile nav blocks content: max score 4
- no mobile nav variant: max score 5
