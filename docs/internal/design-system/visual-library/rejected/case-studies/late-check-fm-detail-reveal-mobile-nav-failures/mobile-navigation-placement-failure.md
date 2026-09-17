# Mobile Navigation Placement Failure

## Failure
Mobile route navigation appeared only near the top of the page and disappeared as the user scrolled.

## Why It Hurts UX
- Primary route access is lost during the actual mobile session.
- Route controls are not thumb-reachable.
- Scroll-heavy experiences become harder to navigate after the hero.
- Users must scroll back to the top for basic movement.

## Detection
- Test mobile widths at 390, 430, 640, and 768.
- Scroll down at least one viewport.
- Confirm route navigation remains visible or immediately accessible.
- Confirm the mobile nav is bottom-positioned, safe-area aware, readable, and accessible.

## Required Fix
Use a persistent bottom navigation, bottom route dock, bottom sheet menu, floating lower-route controller, or gesture-safe bottom rail.

## Score Caps
- mobile route nav disappears on scroll: max score 3
- mobile nav is top-only for app-like route experience: max score 4
- compact nav has no bottom/persistent access: max score 4
- mobile nav lacks accessible labels: max score 5
