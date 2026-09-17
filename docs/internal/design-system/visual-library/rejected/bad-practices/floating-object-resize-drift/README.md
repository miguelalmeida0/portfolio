# Floating Object Resize Drift

## Failure

Floating labels, stickers, cards, badges, props, or route signs drift unpredictably during resize.

## Why V2 Missed It

Fixed breakpoint sampling can pass a safe width while missing collision at intermediate widths.

## Detection

- Sweep width from 360 to 1920.
- Track `data-floating-object` overlap with cards, panels, protected text, and layout-critical content.
- Flag floating objects outside parent or anchor.

## Fix

- Anchor floating objects to a local parent.
- Define min/max movement.
- Prefer grid slots.
- Use `clamp()` only with tested bounds.

## Required Future Checks

Width sweep proof is mandatory before handoff.

## Score Caps

- floating object overlaps content after resize: max score 3
- floating object becomes compositionally lost: max score 4
- arbitrary absolute floating object causes failure: max score 3
- no floating responsive strategy: max score 5
