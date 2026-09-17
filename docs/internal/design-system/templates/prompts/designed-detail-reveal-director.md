# Designed Detail Reveal Director Prompt

Use this when lists, cards, services, media, work items, or objects need a non-default reveal.

## Inputs
- project path:
- protected folders:
- selected direction:
- trigger elements:
- detail content model:
- responsive targets:
- accessibility constraints:

## Required Output
- reveal pattern
- trigger/state model
- spatial relationship between trigger and detail
- selected state
- detail position
- focus and close behavior
- keyboard behavior
- responsive fallback
- mobile behavior
- accessibility labels
- data hooks
- text overflow handling
- loading/empty/error states if async
- QA checklist

## Required Patterns
- Trigger-Anchored Panel: detail panel appears adjacent to selected card; selected card remains visible; connector/shared surface indicates relationship.
- Inline Expansion: selected card expands in place; content remains in flow; best for simple mobile layouts.
- Mobile Bottom Sheet Detail: selected card opens bottom sheet; sheet title matches selected item; close/back action is obvious.
- Split View: selected item remains visible and detail appears beside it.

## Required Hooks
- `data-detail-trigger`
- `data-detail-panel`
- `data-detail-for`
- `data-selected-item`

Hard bans: default modal when designed reveal was required, no focus/close behavior, selection that does not update details, overflowing panel, detail panel disconnected from trigger, detail opens below fold without focus/scroll context.
