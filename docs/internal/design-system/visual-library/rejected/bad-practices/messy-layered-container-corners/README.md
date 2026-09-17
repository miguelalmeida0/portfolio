# Messy Layered Container Corners

## What The Failure Is
Layered cards, frames, or media containers expose awkward notches, leaks, or single-corner fragments.

## Why It Feels Weak
The user sees construction mistakes instead of authored geometry. This destroys the premium feel of tactile/physical UI props.

## How To Detect
- Zoom into every visible corner.
- Compare foreground radius to backing radius.
- Check whether backplate sticks out only on an accidental corner.
- Resize and inspect again.

## How To Fix
Align radii, constrain overflow, adjust offset direction/amount, or remove the backplate.

## Score Caps
- messy exposed backing corner: max score 4
- mismatched radius causing broken corner: max score 3
- no corner inspection for layered media: max score 5

## Required Future Checks
- four-corner inspection
- `data-layered-container` QA where practical
- final screenshot proof
