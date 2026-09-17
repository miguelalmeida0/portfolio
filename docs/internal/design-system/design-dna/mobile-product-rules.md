# Mobile Product Rules

Mobile UI is not a desktop website squeezed into a phone viewport.

Use this file for mobile apps, mobile web flows, onboarding, profile/search/home screens, consumer product flows, and mobile reference-folder work.

## Platform Mode First

Declare one:

- `ios-native`
- `android-native`
- `cross-platform-native`
- `mobile-web`
- `responsive-web-with-mobile-priority`

This choice affects navigation, safe areas, gestures, typography, bottom sheets, control density, and motion.

## Screen-First Flow

Mobile work must describe the sequence of screens, not only one pretty still.

Required:

- entry screen
- primary action screen
- selected/detail state
- confirmation/output state
- empty/error state where relevant

Beautiful single-screen Dribbble-style mockups fail if the usable flow is unclear.

## Safe Areas

Rules:

- respect top and bottom safe areas
- primary actions must not sit under system gestures
- bottom nav must leave breathing room
- modals/sheets must account for keyboard and thumb reach
- hero/media crops must survive notches and dynamic browser bars

## Modal and Bottom Sheet Fit Is Non-Negotiable

Mobile modals, drawers, sheets, and detail panels must fit the viewport and respect safe areas.

A modal or sheet fails if:

- it opens too low on the screen
- the bottom is cut off
- primary actions are hidden below the viewport
- content cannot scroll inside the sheet
- sheet height is not constrained
- safe-area bottom is ignored
- header or close button is cramped
- the sheet competes with bottom navigation
- the user cannot clearly see where the modal begins and ends

Rules:

- define `max-height` for mobile sheets
- scroll long sheet content internally
- keep primary actions visible or sticky inside the sheet
- respect `safe-area-inset-bottom`
- open detail sheets at a visually intentional height
- use internal scroll instead of page clipping when content exceeds viewport
- keep close/dismiss control reachable
- hide, dim, or spatially separate bottom navigation when a modal/sheet is active

## Navigation

Mobile navigation must be crafted:

- for apps with 3+ primary destinations, bottom navigation is the default
- compact top nav, tab bar, sheet flow, or gesture flow must be justified by product mode
- labels must remain understandable
- selected state must be obvious but not noisy
- icons need labels or obvious meaning
- nav cannot wrap into oversized pills
- nav cannot overlap content

## Mobile Navigation Defaults

For applications that have 3+ primary destinations, mobile navigation defaults to a bottom navigation bar.

Default behavior:

- desktop: top navigation or left sidebar
- tablet: adaptive depending on layout
- mobile: bottom navigation by default

Reasons:

- thumb reach
- larger usable content area
- cleaner hierarchy
- modern premium mobile product behavior
- removes duplicated navigation patterns
- aligns with Migi's preferred interaction model

The top of the mobile screen should be reserved for:

- branding
- current page title
- search
- context
- hero imagery

It should not be the default home for primary navigation.

Exceptions where top navigation may be acceptable:

- documentation sites
- desktop-first enterprise tools
- editor software
- websites where the primary experience is scrolling rather than application usage

Outside those exceptions, use bottom navigation as the default.

## Bottom Navigation Quality Bar

Bottom navigation must never be generic.

Requirements:

- beautifully proportioned
- premium spacing
- generous touch targets
- excellent icon/text alignment
- meaningful icon plus readable label for each primary destination
- active state feels intentional
- floating or integrated depending on design direction
- proper safe-area support
- works with gesture navigation
- smooth state transitions
- labels remain readable
- never cramped
- never oversized

## Mobile Bottom Navigation Requires Icons And Labels

For practical mobile product apps with bottom navigation, each primary destination should have both:

- a clear icon
- a readable label

Rules:

- bottom nav items need meaningful icons
- labels must remain readable
- labels must remain readable in default, hover, focus-visible, active/pressed, selected, selected+hover, selected+focus, and disabled states
- icons must not replace labels unless Migi explicitly approves
- icons must semantically match the destination
- active state must affect icon and label
- badges/counters must not crowd labels or icons
- use a consistent icon family
- Material Symbols, Material Icons, Lucide, or Heroicons are acceptable depending on project style
- for practical product apps, Material Symbols or an equivalent semantic icon set is preferred

Forbidden:

- text-only bottom nav for practical mobile product apps unless explicitly justified
- cryptic icons without labels
- inconsistent icon styles
- fake decorative icons
- badges overlapping labels
- oversized active pills that crush adjacent items

Examples:

- Shelf: inventory, shelves, home, or storage icon
- Borrowed: hand, assignment, clock, or arrow icon
- Add: plus or add-circle icon
- People: group or person icon
- Notes: note or chat icon

## Touch Targets

Rules:

- minimum target should generally be 44 px or larger
- primary thumb actions should sit in reachable zones
- destructive actions require spacing and confirmation
- dense controls need grouping and rhythm
- tiny labels or icon-only controls need tooltips/accessible names where possible

## Typography

Rules:

- text must remain readable at 390
- avoid desktop display scale on mobile
- body text needs real line height
- labels cannot collapse into cryptic fragments
- long titles need wrapping, truncation, or alternate layout

## Mobile Visual Density

Mobile can be rich, but it cannot be cramped.

Use:

- prioritized screen stack
- progressive disclosure
- sheets/drawers for details
- compact metadata rows
- clear selected/detail states

Avoid:

- desktop dashboards squeezed into columns
- tiny chart axes
- overloaded cards
- invisible hierarchy
- three competing CTAs

## Control Decoration Cannot Collide With Control Content

Active bars, underlines, progress strips, borders, shadows, highlights, and selection indicators must never overlap button labels or interactive content.

A control fails if:

- underline sits on top of button text
- active bar overlaps label
- progress strip crosses button content
- decorative stroke reduces readability
- selected indicator makes the control feel broken
- indicator is visually detached from the control state

Rules:

- active indicators need their own spatial layer
- underline/bar must sit outside the text safe area
- control labels need a protected text zone
- active state must improve clarity, not reduce it
- button and segmented-control variants must be checked at realistic text lengths
- if an indicator cannot fit, use background, border, icon, or color shift instead

## Selectable Controls Must Preserve State

Any chip, tab, filter, object selector, category selector, segmented control, or item button that appears selectable must visibly preserve its selected state after click/tap.

A selectable control fails if:

- click does not visibly select it
- selected state disappears immediately
- hover/active state is confused with selected state
- state flickers or glitches
- selected item is not accessible through aria/state
- selected item cannot be identified by color/shape/text/icon
- selected state is lost unintentionally during local interaction

Rules:

- selected state must be visually distinct
- selected state must persist until changed
- hover, pressed, focused, and selected states must be different
- selected+hover and selected+focus must stay readable and must not make the selected label disappear
- selected state must be keyboard/focus accessible
- selected chips/tabs should use `aria-selected` or equivalent where appropriate
- state changes must update actual UI behavior, not only style

## Add Actions Must Not Masquerade As Content Items

An add-new action must be visually distinct from existing list/content items.

Rules:

- add action must have a different visual treatment from content cards
- add action should use a clear plus icon or creation affordance
- add action may use a large plus button, dashed outline, empty-state panel, floating action button, bottom sheet trigger, distinct CTA row, or separate add item module
- add action must not look like an existing object/item unless the difference is extremely clear
- add action label must be explicit
- if placed in a grid, add tile must have different shape, icon, border, or color logic
- add action should not be confused with a category/object card

## Mobile Screenshot Proof

At minimum, mobile work needs 390 px screenshot proof.

For serious mobile work, capture:

- 390
- 768
- relevant device/safe-area viewport if available

Check:

- nav readable
- touch targets reachable
- no horizontal overflow
- no clipped titles
- no cards squeezed into garbage
- primary action visible
- core flow evident
- modals/sheets fit and keep actions reachable
- bottom nav has icons plus labels for practical product apps
- selection states persist after tap
- add/create affordance is distinct from content
- active indicators never overlap labels

## Output Artifact

Create or fill `docs/design/mobile-flow-spec.md` for mobile-first work.
