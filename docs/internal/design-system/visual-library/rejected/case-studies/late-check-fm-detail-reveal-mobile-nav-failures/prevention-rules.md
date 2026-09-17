# Prevention Rules

## Anchored Detail Reveal
- Every detail reveal must preserve spatial context.
- Every trigger needs a selected state.
- Every detail panel needs a visual relationship to its trigger.
- Use `data-detail-trigger`, `data-detail-panel`, `data-detail-for`, and `data-selected-item`.
- If a detached reveal is intentional, document it with `data-detail-detached-allowed="true"` and provide focus/scroll context.

## Persistent Mobile Bottom Navigation
- Mobile route/app navigation is bottom-positioned by default.
- Scroll-heavy experiences must keep route controls accessible while scrolling.
- Use icons or icon + active label with full accessible labels.
- Respect safe-area insets.
- Never squeeze desktop navigation into mobile.

## Final Review
Block final handoff if:

- a detail panel feels lost from the clicked item
- a selected trigger is not visibly connected to detail
- mobile route navigation disappears on scroll
- primary mobile route controls are top-only
- bottom navigation blocks content or lacks accessible labels
