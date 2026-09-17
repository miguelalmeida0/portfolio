# Overlapping Containers Failure

## Failure

Two route label containers overlap in a way that is not documented, not protected, and not readable as an intentional layer relationship.

## Detection

- Compare bounding boxes of `data-card`, `data-sticker`, `data-panel`, `data-overlay-object`, and `data-layout-critical`.
- Flag overlap unless `data-overlap-allowed="true"` is present and no readable text is covered.
- Review screenshots at 1440, 1280, 1024, 768, and 390.

## Fix

- Reflow the labels into a single stack, rail, wrap, or responsive variant.
- Define layers and safe zones when overlap is intentional.
- Never let a decorative or secondary object cover readable text.
