# Detail Reveal Anchor Failure

## Failure
The selected card triggered a detail panel that appeared far away from the object the user clicked.

## Why It Hurts UX
- The user loses spatial context.
- The trigger no longer feels responsible for the revealed content.
- The detail panel reads as random page content instead of an intentional response.
- Users must visually search to understand what changed.

## Detection
- Click or tap each card/item/detail trigger.
- Confirm the selected trigger remains visible or explicitly represented.
- Confirm the detail panel appears inline, adjacent, connected by a connector, transformed from the trigger, focused into view, or opened as a clearly named mobile sheet.
- Flag any reveal separated by large empty space or unrelated page regions.

## Required Fix
Use one of the approved patterns:

- inline expansion
- adjacent side panel in the same zone
- anchored popover
- connected drawer
- mobile bottom sheet with selected item title
- split view
- object pull-out / transform into detail

## Score Caps
- detail panel disconnected from trigger: max score 4
- selected item not visibly connected to detail: max score 5
- detail opens below fold without focus/scroll: max score 4
- default modal used where designed reveal required: max score 5
