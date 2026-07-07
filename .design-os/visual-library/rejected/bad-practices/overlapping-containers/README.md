# Overlapping Containers

## What The Failure Is

Cards, stickers, panels, route labels, overlays, or fixed objects cross into each other's readable space without an intentional layer model.

## Why It Kills Trust

Users read accidental overlap as broken implementation. It also makes screenshots contradict the final report.

## How To Detect It

- Compare DOM bounding rects for critical containers.
- Inspect 1440, 1280, 1024, 768, and 390 screenshots.
- Search for overlaps without `data-overlap-allowed="true"`.

## How To Fix It

- Reflow into grid/stack/rail variants.
- Reserve safe zones.
- Define z-index and layer ownership.
- Move decorative objects away from text.

## Score Caps

- overlapping containers cover text: max score 3
- screenshot shows unresolved overlap: max score 3
- final UI integrity gate not run: max score 5

## Required Future Checks

- layout-integrity-review
- final-ui-integrity-gate
- screenshot-scorecard-review
