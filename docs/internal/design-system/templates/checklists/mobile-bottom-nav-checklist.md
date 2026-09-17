# Mobile Bottom Nav Checklist

Use for mobile route/app experiences, scroll-heavy chapter navigation, interactive landing pages with stations/sections, and pages with 3+ primary destinations.

## Required Checks

- desktop nav variant exists
- tablet nav variant exists
- mobile bottom nav or approved bottom-accessible alternative exists
- nav remains accessible after scroll
- safe-area inset is respected
- active state is clear
- icons or icon + active labels are used
- full accessible labels exist
- minimum touch targets are met where practical
- nav does not block important content
- proof exists at 390, 430, 640, and 768 widths

## Accepted Patterns

- persistent bottom nav
- bottom route dock
- bottom sheet menu
- floating lower-right route controller
- gesture-safe bottom rail
- compact menu button fixed at bottom

## Blockers

- mobile nav appears only at top and disappears on scroll
- route navigation is unavailable after scrolling
- mobile nav is not thumb-reachable
- nav labels are cryptic or abbreviation-only
- nav blocks content without safe-area handling
- nav has no accessible labels
- desktop nav is simply squeezed into mobile

## Score Caps

- mobile route nav disappears on scroll: max score 3.
- mobile nav is top-only for app-like route experience: max score 4.
- compact nav has no bottom/persistent access: max score 4.
- mobile nav lacks icons or clear labels: max score 4.
- mobile nav has no accessible labels: max score 5.
- mobile nav blocks content: max score 4.
- no mobile nav variant: max score 5.
