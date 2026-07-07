# P0 Layout Integrity Rules

Layout integrity is a P0 visual-quality gate in Miguel Design OS.

A UI cannot be considered visually good if text, charts, nav, cards, badges, buttons, forms, or containers visibly break under real viewport sizes. This is not a polish issue. It is structural failure.

## Definition

Layout integrity means:

- text stays inside containers
- chart bars, lines, points, axes, and labels stay inside plotting/card areas
- cards do not collapse below readable width
- nav remains understandable and does not overlap content
- chips, pills, and badges wrap or truncate intentionally
- images and badges do not collide
- buttons remain proportionate
- forms remain readable
- labels stay semantic
- containers adapt instead of squeezing content into unreadable garbage

## Hard Rule

If text, charts, badges, buttons, nav, or cards visibly break, the design fails before taste is discussed.

## Required Viewports

Visual-heavy work must prove layout integrity at:

- 1440
- 1280
- 1024
- 768
- 390

For each viewport, check:

- nav readable
- toolbar aligned
- cards readable
- charts contained
- no overlap
- no horizontal overflow
- primary action reachable

## Responsive Adaptation

Responsive design is not shrinking the same desktop layout until it breaks.

Desktop can be dense. Tablet must reorganize. Mobile must use a dedicated simplified structure. Dashboards should switch from multi-column cockpit layouts to stacked command sections when width drops.

If a card cannot preserve its content at a width, change the layout:

- stack vertically
- convert to a list row
- collapse secondary details
- move details into a drawer
- hide noncritical metadata
- use abbreviations only with visible legends
- change chart type for smaller widths

## Chart Bounds

Charts must respect their containers.

Rules:

- chart bars, lines, points, and markers remain inside the plot area
- axes and labels do not overlap content
- chart padding accounts for labels and markers
- SVG overflow is controlled
- charts have explicit dimensions or responsive containers
- if a chart cannot fit, use a simpler chart at that breakpoint

## Semantic Labels

Labels cannot collapse into meaningless fragments.

Forbidden:

- `C`, `U`, or `?` without an obvious legend
- cryptic initials in operational UI
- clipped words that lose meaning
- nav abbreviations without explanation
- chart labels shortened beyond comprehension

Allowed:

- standard abbreviations
- explained abbreviations
- compact labels with visible legends

If a label becomes too small to read or understand, the layout must change.

## Dashboard-Specific Rules

Dashboard layouts must have structural integrity at every width.

Rules:

- dense desktop dashboards may use multi-column layouts
- at tablet width, reduce columns or reorganize panels
- at mobile width, become a stack of prioritized sections
- charts must change size or representation
- queues can become compact lists
- side rails must convert to bottom or compact nav
- cards must not become skinny unreadable columns

Rejected:

- 3-column dashboard squeezed into tablet
- long text cards forced into narrow columns
- charts overflowing because panels got too small
- desktop rail turning into giant mobile pills
- same desktop composition used at every size

## Implementation Tools

Use real responsive constraints:

- `minmax(0, 1fr)`
- min-width rules
- `flex-wrap`
- `overflow: hidden` only with intentional truncation
- `line-clamp`
- max-width
- responsive grid collapse
- container queries where useful
- chart clipping and margins
- SVG/viewBox discipline
- explicit chart bounds
- content-aware breakpoints

## Scorecard Impact

These caps apply before taste scoring:

- text visibly escapes container: max 2/10
- chart bars/lines escape bounds: max 2/10
- containers overlap on resize: max 3/10
- card content clipped/cut off: max 4/10
- dashboard cards too narrow to read: max 4/10
- labels collapse into meaningless fragments: max 5/10
- responsive design only works at one viewport: max 5/10

A broken layout cannot be award-level.
