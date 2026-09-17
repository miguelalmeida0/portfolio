# Offset Container Alignment Failure

## Failure
The video/container backplate exposed a messy bottom-left corner that looked accidental.

## Why It Feels Weak
Offset frames and backplates only feel premium when their geometry is obviously intentional. Messy corners make the UI read as broken boxes.

## Detect
- Inspect all four corners of media frames and layered containers.
- Compare frontplate/backplate rects and border radii.
- Flag single-corner leaks, mismatched radius, and unbalanced offsets.

## Fix
Use shared radius tokens, consistent offsets, intentional overflow clipping, and `data-layered-container`, `data-frontplate`, and `data-backplate` hooks where practical.

## Score Caps
- messy exposed backing corner: max score 4
- misaligned media backplate: max score 3
- mismatched radius causing broken corner: max score 3
- offset layer looks accidental: max score 4
