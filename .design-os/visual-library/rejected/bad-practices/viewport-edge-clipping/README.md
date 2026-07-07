# Viewport Edge Clipping

## Failure

Critical content is cut by the viewport edge at rest: headings, card text, CTAs, nav labels, active panels, or protected text are only partially visible.

## Why V2 Missed It

Fixed breakpoint checks can miss clipped states between widths, at alternate heights, or during horizontal scroll positions.

## Detection

- Inspect critical element bounding boxes against the viewport.
- Treat `data-card`, `data-panel`, `data-active-panel`, CTAs, nav labels, `data-layout-critical`, `data-protected-text`, and `data-text-fit` as critical.
- Sample width sweep, heights, and scroll states.

## Fix

- Reflow, resize, or stack active content.
- Add snap/readable resting states for horizontal routes.
- Document any intentional non-critical editorial crop.

## Required Future Checks

Run Final UI Integrity Gate v3 before handoff.

## Score Caps

- critical text clipped by viewport edge: max score 2
- active card/panel partially unreadable: max score 3
- CTA/nav clipped by viewport edge: max score 3
- no viewport-edge clipping check: max score 5
