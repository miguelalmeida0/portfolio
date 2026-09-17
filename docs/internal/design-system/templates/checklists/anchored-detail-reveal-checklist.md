# Anchored Detail Reveal Checklist

Use before final handoff when any card, row, object, station, media tile, or container opens detail content.

## Required Checks

- trigger element exists
- selected state is visible
- detail target exists
- trigger/detail relationship is visually obvious
- `data-detail-trigger` exists where practical
- `data-detail-panel` exists where practical
- `data-detail-for` matches the trigger id where practical
- `data-selected-item` marks the active trigger/state where practical
- close/minimize behavior exists
- keyboard/focus behavior is acceptable
- mobile behavior is defined
- long content wraps or scrolls without clipping

## Accepted Patterns

- trigger-anchored panel
- inline expansion
- adjacent side panel
- connected drawer
- mobile bottom sheet detail
- split view
- object pull-out / transform into detail

## Blockers

- detail panel disconnected from trigger
- selected item not visibly connected to detail
- detail opens below fold without focus/scroll
- selected trigger disappears with no context
- default modal used where designed reveal was required
- no selected state on trigger
- no close/focus/keyboard strategy

## Score Caps

- detail panel disconnected from trigger: max score 4.
- selected item not visibly connected to detail: max score 5.
- detail opens below fold without focus/scroll: max score 4.
- default modal used where designed reveal required: max score 5.
- no selected state on trigger: max score 5.
- no close/focus/keyboard strategy: max score 5.
