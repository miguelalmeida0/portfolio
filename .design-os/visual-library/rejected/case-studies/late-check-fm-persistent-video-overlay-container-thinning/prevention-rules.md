# Prevention Rules

## Hard Rules

- Video should be hero-only by default unless a later media role is explicitly justified.
- Persistent video overlays require a reserved media lane.
- No video/image/media may cover critical text.
- Never thin containers to fit media.
- Content containers must keep readable minimum widths.
- Media must leave, dock, shrink, or stack before it damages text readability.
- Z-index is not a layout strategy.

## Required Before Implementation

- `docs/design/protected-zone-map.md`
- `docs/design/media-object-stage-plan.md`
- `docs/design/scroll-motion-spec.md`
- Minimum readable card widths.
- Media start/end rects.
- Reduced-motion fallback.

## Required Review

- Layout integrity review.
- Media-stage review.
- Scroll choreography review.
- Screenshot scorecard at required breakpoints and sampled scroll positions.
