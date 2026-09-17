# Mobile Navigation Defaults

Use this rule for mobile apps, mobile web apps, consumer product flows, app-like dashboards, onboarding/profile/search/home screens, and any responsive application with 3+ primary destinations.

## Default

For applications that have 3+ primary destinations, mobile navigation defaults to a bottom navigation bar.

Default behavior:

- desktop: top navigation or left sidebar
- tablet: adaptive depending on layout
- mobile: bottom navigation by default

## Reason

- thumb reach
- larger usable content area
- cleaner hierarchy
- modern premium mobile products
- removes duplicated navigation patterns
- aligns with Migi's preferred interaction model

The top of the screen should be reserved for branding, current page title, search, context, or hero imagery, not primary navigation.

## Exceptions

Top navigation is acceptable only when:

- documentation sites
- desktop-first enterprise tools
- editor software
- websites where the primary experience is scrolling rather than application usage

Otherwise, bottom navigation is the default.

## Bottom Navigation Quality Bar

Bottom navigation must never be generic.

Requirements:

- beautifully proportioned
- premium spacing
- generous touch targets
- excellent icon/text alignment
- clear icon plus readable label for each primary destination in practical product apps
- semantically matched icons from one consistent icon family
- compact fallback uses icons or a real menu pattern, never arbitrary two-letter labels
- full accessible name exists through aria-label or screen-reader text when visual labels hide
- active state feels intentional
- floating or integrated depending on design direction
- proper safe-area support
- works with gesture navigation
- smooth state transitions
- labels remain readable
- never cramped
- never oversized

## Rejected

- desktop navigation copied directly onto mobile
- top navigation consuming valuable mobile space
- tiny icon bars
- text-only bottom navigation in practical product apps unless explicitly justified
- cryptic two-letter labels as the visual fallback
- arbitrary initials such as IN, WL, BD, NW, RL, or BK without icons and nearby full labels
- cryptic icons without labels
- inconsistent icon families
- badges/counters overlapping labels or icons
- oversized bottom bars
- generic Android-looking navigation
- poor safe-area handling
- duplicated top and bottom navigation

## Persistent Mobile Bottom Navigation

For mobile and compact viewports, app-like navigation, route navigation, scroll chapter navigation, and multi-section interactive experiences must use a persistent bottom navigation / bottom route controller by default.

This applies to:

- product apps
- mobile product flows
- scroll-heavy brand sites with route chapters
- interactive landing pages with stations/sections
- route-based experiences like Late Check FM
- pages with 3+ primary destinations or chapters
- experiences where users need navigation while scrolling

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
