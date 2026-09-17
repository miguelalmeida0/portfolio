# Directional Page Transition

## Use
Use for brand, service, portfolio, or editorial sites with a small route set.

## Avoid
Avoid complex apps where route changes must be instant and predictable.

## Ingredients
Direction map, route color tokens, history behavior, focus restoration.

## Implementation
Use CSS transitions between page states or route containers.

## Motion
New page slides from right/left/top with color/material shift.

## Fallbacks
- Accessibility: Respect browser history and focus target heading.
- Reduced motion: Instant route change with color state only.

## Failure Signs
- direction with no information model
- transition hides content
