# Prevention Rules

## Required Before Implementation

- `docs/design/protected-zone-map.md`
- `docs/design/media-object-stage-plan.md`
- `docs/design/scroll-motion-spec.md`

## Protected-Zone Map Must Include

- critical text zones
- media lanes
- start rect for media object
- end rect for media object
- forbidden overlap zones
- responsive fallback
- reduced-motion fallback

## QA Must Include

- scroll-state screenshots at sampled positions
- layout integrity review after scroll review
- overlap check for `data-overlay-object` or `data-scroll-object` against `data-protected-text` and `data-layout-critical`

## Do Not Fix By

- hiding text
- clipping text with `overflow: hidden`
- making text unreadable
- relying on z-index only
- letting media pass over text because it looks cinematic

## Score Caps

- moving video/media covers critical text: max score 3
- scroll-transformed object crosses protected text zone: max score 3
- video-to-object transform has no protected-zone map: max score 5
- media object is above text by z-index without readable surface: max score 4
- screenshot shows media/text collision: max score 3
- no scroll-state screenshots for media-heavy choreography: max score 5
