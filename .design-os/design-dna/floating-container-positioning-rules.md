# Floating Container Positioning

Floating labels, stickers, cards, badges, notice slips, tags, props, and decorative containers are high-risk.

They may only be used if:

- anchored to a parent zone
- assigned a role
- assigned a safe movement range
- tested at all required viewport widths
- protected from overlapping critical content
- responsive position is defined
- overlap behavior is explicitly allowed or forbidden

## Hard Blockers

- floating object overlaps another important container
- floating object covers text
- floating object becomes lost at larger widths
- floating object is positioned with arbitrary absolute values
- floating object has no responsive rules
- floating object works at one width but fails at another
- floating object creates accidental empty space

## Required

- use CSS grid/flex placement where possible
- if absolute positioning is needed, constrain it inside a local relative parent
- use `clamp()` for offsets if needed
- use anchor/slot systems rather than free-floating values
- define desktop/tablet/mobile positions
- use `data-floating-object`
- use `data-overlap-allowed="true"` only when overlap is intentional and safe

## Score Caps

- floating object overlaps important container: max score 3
- floating object covers readable text: max score 3
- floating object has no responsive placement strategy: max score 5
- free-floating absolute object causes failure at intermediate width: max score 3

# Floating Object Resize Drift

Floating labels, stickers, badges, cards, route signs, tags, notice slips, and props must not drift unpredictably across viewport sizes.

## Hard Blockers

- floating object works on mobile but overlaps content on desktop
- floating object becomes lost at larger widths
- floating object crosses another container while resizing
- floating object is positioned with arbitrary absolute offsets
- floating object has no anchor zone
- floating object has no desktop/tablet/mobile placement rules
- floating object relies on one viewport width

## Required

- anchor floating objects to a local parent
- define min/max movement range
- use grid slots where possible
- use `clamp()` for offsets only with tested limits
- define placement per viewport class
- add `data-floating-object`
- add `data-floating-anchor` if practical
- final gate must sweep widths, not only fixed breakpoints

## Resize Drift Score Caps

- floating object overlaps content after resize: max score 3
- floating object becomes compositionally lost: max score 4
- arbitrary free-floating absolute object causes failure: max score 3
- no floating-object responsive strategy: max score 5
