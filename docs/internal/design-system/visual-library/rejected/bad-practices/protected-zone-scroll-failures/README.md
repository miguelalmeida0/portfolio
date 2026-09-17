# Protected-Zone Scroll Failures

## Bad Practice

- Moving video/media object overlaps important text during scroll.
- Pinned/sticky media crosses through content zones.
- Video-to-object transform has no safe movement path.
- Z-index is used as decoration instead of layout architecture.
- Scroll object has no reserved media lane.
- Protected text zones are not defined.

## Required Fix

- reserve media lane
- define protected text zones
- define media movement path
- test all scroll states
- run layout integrity checker
- run scroll choreography checker
- capture screenshots at sampled scroll positions

## Required Hooks

- `data-overlay-object`
- `data-scroll-object`
- `data-protected-text`
- `data-layout-critical`
