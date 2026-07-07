# Scroll Choreography Failure

## What Failed

The scroll route allows the video/media object to travel across content space. The choreography has a promising direction, but the moving object is not constrained by a safe path.

## Why It Fails

- Scroll motion changes object position without checking text zones.
- Intermediate scroll states are unsafe.
- The video-to-object transform behaves like a layer floating above content instead of a planned stage object.
- The route lacks sampled evidence across the scroll timeline.

## Prevention Rule

Every scroll-heavy page with moving media must include:

- `docs/design/scroll-motion-spec.md`
- `docs/design/protected-zone-map.md`
- `docs/design/media-object-stage-plan.md`
- screenshots at sampled scroll positions

## Blocker

No moving media object may cover critical text at any scroll sample.
