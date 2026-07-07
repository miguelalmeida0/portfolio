# Mobile Nav Not Persistent Bottom

## What Failed
Mobile route/app navigation appears at the top or inside the page flow instead of remaining available near the bottom of the viewport.

## Why It Hurts UX
Mobile users lose thumb-reachable primary navigation while scrolling. App-like, route-based, and chaptered experiences need persistent route access.

## How To Detect
- Test 390, 430, 640, and 768 widths.
- Scroll down at least one viewport.
- Confirm `data-nav-mobile` or `data-nav-primary` remains visible, bottom-positioned, safe-area aware, and accessible.

## How To Fix
- Use a bottom nav, bottom route dock, bottom sheet menu, lower-right controller, or gesture-safe bottom rail.
- Provide icons or icon + active label.
- Preserve full accessible labels.
- Respect safe-area insets and avoid blocking content.

## Required Future Checks
- mobile screenshot proof at required widths
- scroll-state proof after at least one viewport
- active route proof
- safe-area and touch-target review

## Score Caps
- mobile route nav disappears on scroll: max score 3
- mobile nav is top-only for app-like route experience: max score 4
- compact nav has no bottom/persistent access: max score 4
- mobile nav blocks content: max score 4
