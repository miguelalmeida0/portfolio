# Designed Detail Reveal Kit

Use this kit for drawers, panels, sleeves, split views, object pull-outs, station boards, route rooms, and ritual selectors.

## Required Architecture

- trigger element with `data-detail-trigger`
- selected state with `data-selected-item`
- reveal surface with `data-detail-panel`
- `data-detail-for` matching the trigger id
- close/minimize behavior
- focus/keyboard behavior where practical
- mobile behavior
- screenshot proof of the open state

## Trigger-Anchored Panel

- detail panel appears adjacent to selected card
- selected card remains visible
- arrow/connector or shared surface indicates relationship
- best for desktop/tablet cards, rows, and station boards
- avoid if the panel would be pushed far away at responsive widths

## Inline Expansion

- selected card expands in place
- content remains in flow
- best for simple mobile layouts
- avoids spatial drift because the trigger becomes the detail surface
- must still preserve close/collapse and keyboard behavior

## Mobile Bottom Sheet Detail

- selected card opens bottom sheet
- sheet title matches selected item
- selected item remains represented
- close/back action is obvious
- sheet respects safe-area and does not collide with bottom nav

## Split View

- selected item remains visible in a list or board
- detail appears beside it in a reserved panel
- selected state is visually clear
- mobile fallback becomes inline expansion or bottom sheet

## Hard Bans

- detail panel opens far away from clicked card
- detail panel appears in unrelated page region
- selected trigger disappears with no context
- detail opens below the fold without focus/scroll behavior
- default detached modal used where designed reveal was required

## Hero-Only Video Pattern

- video lives in top stage
- later sections use normal readable layout
- optional static thumbnail appears later if useful

## Reserved Media Lane Pattern

- media stays sticky only inside a reserved column/lane
- text never enters media lane
- media collapses below/above content on narrower widths

## Media Dock Pattern

- media starts large
- media docks into a clearly bounded small card
- content layout reserves space for the docked card
- no overlap

## Media Exit Pattern

- media leaves after hero stage
- scroll continues with cards/content without video
