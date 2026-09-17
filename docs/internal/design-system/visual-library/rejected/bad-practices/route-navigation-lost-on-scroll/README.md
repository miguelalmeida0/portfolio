# Route Navigation Lost On Scroll

## What Failed
Primary route/chapter navigation is available at page top but disappears after the user scrolls.

## Why It Hurts UX
The user can no longer move through the experience without reversing direction. This is especially bad for route-based, station-based, scroll-heavy, or app-like interfaces.

## How To Detect
- Identify route/chapter navigation.
- Scroll through the page at mobile and tablet widths.
- Confirm primary navigation remains visible, sticky/fixed, or immediately accessible through a persistent bottom control.

## How To Fix
- Move route navigation to a bottom persistent controller on mobile.
- Use sticky/fixed behavior with safe-area support.
- If a menu is used, keep its entry control persistent.

## Required Future Checks
- scroll-sample screenshots
- viewport matrix at 390, 430, 640, 768
- active state review
- accessible label review

## Score Caps
- mobile route nav disappears on scroll: max score 3
- mobile nav is top-only for app-like route experience: max score 4
- no persistent route access in scroll-heavy mobile UI: max score 4
