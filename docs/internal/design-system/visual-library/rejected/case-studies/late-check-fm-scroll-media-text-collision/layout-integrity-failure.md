# Layout Integrity Failure

## What Failed

The layout allowed a media object to occupy the same visual space as readable content. This is a P0 layout integrity failure, not a polish issue.

## Layout Failures

- Media object covers critical text.
- Text is partially hidden instead of protected.
- Intermediate scroll state is not layout-safe.
- Z-index is doing the work of layout architecture.
- The media object lacks a reserved lane.

## Review Requirement

Layout integrity review must run after scroll choreography review for scroll-heavy pages. Review must inspect intermediate scroll states when media, cards, stickers, portals, or pinned objects move.

## Tooling Hooks

Use:

- `data-overlay-object`
- `data-scroll-object`
- `data-protected-text`
- `data-layout-critical`

These hooks allow lightweight geometry checks to detect media/text overlap.
