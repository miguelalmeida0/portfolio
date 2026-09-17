# Editorial List Detail Modal

## Use
Use for editorial tech, explainers, feature lists, product sectors, FAQs, or structured discovery.

## Avoid
Avoid if the modal is only a default dialog or content dump.

## Ingredients
List rows, selected state, detail panel, close behavior, focus management.

## Implementation
Build list as buttons; detail panel/modal shares type, color, and spacing system.

## Motion
Panel opens with purposeful scale/slide; selected row remains visible.

## Fallbacks
- Accessibility: Focus trap, Escape close, aria-modal, return focus to row.
- Reduced motion: Inline accordion or full-page detail.

## Failure Signs
- default browser dialog styling
- row selection does not persist
