# Recipe

1. Choose the reveal surface.
2. Define trigger, selected state, and content model.
3. Define the spatial relationship between trigger and detail.
4. Choose an anchored pattern: trigger-anchored panel, inline expansion, mobile bottom sheet detail, split view, or object pull-out.
5. Add `data-detail-trigger`, `data-detail-panel`, `data-detail-for`, and `data-selected-item`.
6. Define open, close, focus, and keyboard behavior.
7. Plan mobile fallback.
8. Stress long text and viewport height.
9. Verify selection changes visible detail content.
10. Verify the detail does not open lost elsewhere on the page.
11. Avoid default modal styling unless it is truly right.

## Acceptance Checks

- clicking the trigger produces a visibly connected detail
- selected trigger remains clear or is represented by the detail sheet/title
- detail is in the same viewport or intentionally scrolled/focused into view
- mobile detail uses inline expansion, bottom sheet, or a route with explicit context
- keyboard users can open and close the detail
- long content wraps or scrolls without clipping
