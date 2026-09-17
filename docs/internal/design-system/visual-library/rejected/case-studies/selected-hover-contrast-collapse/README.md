# Selected Hover Contrast Collapse

## Why Rejected

This case is rejected because a selected navigation item loses its readable label when hover is applied. The control appears selected, but the selected + hover state turns into a light pill with no visible text, so the user cannot read the active destination.

This is a global Design OS failure. Interactive text must remain readable in every state, including combined states such as selected + hover and selected + focus. A control that is readable only at rest is not designed.

## Screenshots

| Filename | Failure Shown | Why Rejected | Correction Principle | Mapped Rule | Scorecard Cap |
| --- | --- | --- | --- | --- | --- |
| `screenshots/selected-hover-text-disappears.png` | Selected navigation item becomes unreadable on hover | The selected item has a light active surface, but the hover/selected text treatment disappears against that surface. | Define and test a state contrast matrix for default, hover, focus-visible, active, selected, selected + hover, selected + focus, disabled, and pressed states. | Stateful Text Contrast; P0 Layout Integrity; Navigation Readability | selected + hover makes text disappear max 3; unreadable interactive text state max 4 |

## Correction Principles

- Interactive text contrast is stateful, not static.
- Test combined states, especially selected + hover and selected + focus.
- Selected states must stay committed and readable when pointer, keyboard, or touch feedback is added.
- Do not rely on opacity, blend modes, or inherited colors that can make labels vanish on active surfaces.
- Screenshot evidence beats assumptions from CSS token names.

## Rules This Should Catch

- Stateful Text Contrast.
- Navigation Readability.
- Mobile Product Interaction Integrity.
- P0 Layout Integrity.
- OKLCH/APCA color rule.
- Screenshot Scorecard Review.

## Scorecard Caps

- Selected + hover makes text disappear: max score 3.
- Any interactive text is unreadable in hover, focus, active, selected, selected + hover, or selected + focus: max score 4.
- State contrast matrix missing for nav, tabs, chips, segmented controls, cards, or buttons: max score 6.
- Hover/focus styling reduces text contrast below readable thresholds: max score 5.
