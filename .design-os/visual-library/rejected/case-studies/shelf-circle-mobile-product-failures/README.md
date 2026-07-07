# Shelf Circle Mobile Product Failures

## Project
Shelf Circle

## Mode
Mobile product flow / selection-first product

## Why This Case Study Exists
Shelf Circle exposed mobile product UI failures that look small in isolation but break usability in repeated product flows: cut-off sheets, overlapping active indicators, nonpersistent selection, text-only bottom navigation, and add actions that look like normal content.

Screenshots in this folder are rejected Design OS evidence. They are not production assets.

## Failure Summary
- Detail modal / bottom sheet opens too low and appears cut off.
- Active/progress/underline decoration overlaps button content.
- Selectable object-name chips do not visibly preserve selected state.
- Bottom navigation labels lack destination icons.
- Add-new item card is too similar to existing object cards.

## Correction Principles
- Mobile sheets must fit the viewport, respect safe areas, and keep primary actions visible or internally scrollable.
- Control indicators need their own spatial layer and must never cross label text.
- Selectable chips, tabs, filters, and object buttons must persist selected state until changed.
- Practical mobile product bottom nav needs meaningful icons plus readable labels.
- Add/create actions need distinct affordance: plus icon, dashed action surface, FAB, CTA row, or separate create module.

## Rules That Should Catch These Failures
- Modal and Bottom Sheet Fit Is Non-Negotiable.
- Control Decoration Cannot Collide With Control Content.
- Selectable Controls Must Preserve State.
- Mobile Bottom Navigation Requires Icons and Labels.
- Add Actions Must Not Masquerade As Content Items.
- P0 Layout Integrity.
- Mobile Product Flow Mode.
- Selection / Gallery / Browse Mode.

## Screenshots

| Filename | Failure Shown | Why Rejected | Correction Principle | Mapped Rule | Scorecard Cap | Scope |
| --- | --- | --- | --- | --- | --- | --- |
| `screenshots/modal-sheet-cut-off-mobile.png` | Detail sheet opens low and appears clipped against the mobile viewport. | A cut-off sheet makes the product feel broken and can hide actions. | Constrain sheet height, add internal scroll, respect safe areas, and separate it from bottom navigation. | Modal and Bottom Sheet Fit Is Non-Negotiable | Mobile modal/sheet is cut off: max score 3 | Global rule candidate |
| `screenshots/control-indicator-overlaps-button-label.png` | Active/progress bar crosses the "Available" button label area. | Selection/progress decoration reduces readability and looks glitchy. | Put indicators outside the protected label zone or use active background/border/icon state. | Control Decoration Cannot Collide With Control Content | Active/underline bar overlaps button label: max score 4 | Global rule candidate |
| `screenshots/nonpersistent-object-chip-selection.png` | Object chips appear selectable but do not show a durable selected state. | Users cannot tell what item/category is selected. | Use persistent selected styling, separate hover/pressed/selected states, and update actual local behavior. | Selectable Controls Must Preserve State | Selectable chip/item does not retain selected state: max score 4 | Global rule candidate |
| `screenshots/bottom-nav-missing-icons.png` | Bottom navigation uses labels without icons. | Practical mobile nav becomes less scannable and less app-like. | Pair each destination with a semantic icon and readable label using one icon family. | Mobile Bottom Navigation Requires Icons and Labels | Mobile product bottom nav has labels but no icons: max score 6 | Global rule candidate |
| `screenshots/add-card-masquerades-content.png` | Add card looks too similar to existing object cards. | Users can mistake a create affordance for a real object item. | Give add actions a distinct plus/create affordance, dashed/action styling, or separate CTA surface. | Add Actions Must Not Masquerade As Content Items | Add/new action looks like a normal content item: max score 5 | Global rule candidate |

## What Future Agents Should Do Instead
- Define sheet fit and safe-area behavior before coding mobile detail panels.
- Create a state matrix for chips, tabs, bottom nav, and add actions.
- Use icons plus labels for mobile product bottom nav.
- Make creation affordances unmistakable and visually separate from content.
- Screenshot at 390 px before claiming a mobile product UI is usable.
