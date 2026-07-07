# Anchored Detail Reveal

When a user clicks, taps, selects, or opens a card/item/container, the resulting detail panel must preserve spatial context.

The detail must feel connected to the clicked object.

## Allowed Patterns

1. Inline expansion directly below/inside the selected card.
2. Adjacent side panel in the same visual row/zone.
3. Drawer that slides from the selected side or section.
4. Popover anchored to the trigger with arrow/connector.
5. Full-screen mobile sheet that clearly names the selected item and animates from the trigger.
6. Split view where selected item remains visible and detail appears beside it.
7. Object pull-out pattern where selected card becomes or transforms into detail.

## Hard Blockers

- detail panel opens far away from clicked card
- detail panel appears in unrelated page region
- selected trigger disappears with no context
- user cannot tell what opened the detail
- detail panel feels like a random section lower on the page
- trigger and detail are separated by large empty space
- detail panel appears below the fold without auto-scroll/focus/context
- default modal/panel opens without visual connection
- selected card and detail panel are not linked visually or programmatically

## Required For Every Detail Reveal

- trigger element
- selected state
- detail target
- visual connection
- focus management where practical
- close/minimize behavior
- responsive behavior
- keyboard/accessibility behavior
- `data-detail-trigger`
- `data-detail-panel`
- `data-detail-for` matching trigger id
- `data-selected-item`

## Detection Expectations

- detail panel should appear within the same viewport or adjacent context when opened
- if detail opens elsewhere, the page must scroll/focus to it intentionally
- if full-screen on mobile, it must identify the selected item and provide return/close

## Score Caps

- detail panel disconnected from trigger: max score 4
- selected item not visibly connected to detail: max score 5
- detail opens below fold without focus/scroll: max score 4
- default modal used where designed reveal required: max score 5
- no selected state on trigger: max score 5
- no close/focus/keyboard strategy: max score 5
