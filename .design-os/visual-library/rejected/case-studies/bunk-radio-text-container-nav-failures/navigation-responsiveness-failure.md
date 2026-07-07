# Navigation Responsiveness Failure

## Failure

Navigation labels overflow circular/pill controls. At resized widths, the nav bar collapses into huge empty space instead of a designed tablet/mobile variant.

## Rules

- Navigation must never rely on one desktop-only layout.
- Nav labels may not escape chips, pills, circles, buttons, or hit targets.
- Circular nav items may not contain long text without a fallback.
- Active state must not change item width unpredictably.
- Nav bar width must be content-aware, not a huge empty pill by default.
- If labels hide, accessible labels must remain.

## Score Caps

- nav label outside item: max score 3
- nav huge dead space at breakpoint: max score 4
- nav active state clips text: max score 3
- nav lacks responsive variant: max score 5
- nav inaccessible after label hiding: max score 5
