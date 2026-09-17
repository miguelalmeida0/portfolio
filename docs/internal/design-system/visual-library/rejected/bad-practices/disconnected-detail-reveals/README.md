# Disconnected Detail Reveals

## What Failed
A selected card, item, or container opens detail content in a distant or unrelated page region.

## Why It Hurts UX
The user loses the trigger/detail relationship and has to search for what changed. Detail reveals should feel like a response to the selected object, not a random section appearing elsewhere.

## How To Detect
- Click every `data-detail-trigger`.
- Verify the related `data-detail-panel` has matching `data-detail-for`.
- Check that trigger and panel are inline, adjacent, connected, transformed, focused into view, or opened as a clearly named full-screen/mobile sheet.
- Flag large visual gaps unless `data-detail-detached-allowed="true"` is documented.

## How To Fix
- Use inline expansion, adjacent panels, anchored popovers, connected drawers, split views, or mobile bottom sheets.
- Keep the selected trigger visible or clearly represented.
- Add selected state, focus handling, close behavior, and keyboard behavior.

## Required Future Checks
- screenshot/click evidence for selected detail state
- data hooks for trigger and panel
- keyboard/focus review
- mobile detail behavior review

## Score Caps
- detail panel disconnected from trigger: max score 4
- selected item not visibly connected to detail: max score 5
- detail opens below fold without focus/scroll: max score 4
- default modal used where designed reveal required: max score 5
