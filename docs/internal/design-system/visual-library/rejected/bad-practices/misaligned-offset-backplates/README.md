# Misaligned Offset Backplates

## What The Failure Is
A backplate, backing card, offset shadow, or framed media layer does not align cleanly with the foreground container.

## Why It Feels Weak
Layered frames only feel designed when offset, radius, and exposed corners look intentional. Misalignment reads as broken layout.

## How To Detect
- Inspect all four corners.
- Compare front/back rect offsets.
- Compare border radii.
- Check at multiple widths.

## How To Fix
Use shared radius tokens, consistent offset variables, intentional clipping, and `data-layered-container`, `data-frontplate`, and `data-backplate` hooks where practical.

## Score Caps
- messy exposed backing corner: max score 4
- misaligned media backplate: max score 3
- mismatched radius causing broken corner: max score 3
- offset layer looks accidental: max score 4

## Required Future Checks
- corner inspection at breakpoint matrix
- radius/offset token review
- screenshot evidence for layered media frames
