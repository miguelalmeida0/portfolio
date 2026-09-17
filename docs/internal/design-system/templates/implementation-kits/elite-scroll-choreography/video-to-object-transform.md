# video to object transform

Video changes role from full stage to object/card/tile. Preserve controls, captions, and fallback.

Required: route map, chapter map, moving object inventory, reduced-motion fallback, mobile fallback, and QA evidence.

## Media/Text Protected Zone Pattern

Before implementation, create:

- `docs/design/protected-zone-map.md`
- `docs/design/media-object-stage-plan.md`
- `docs/design/scroll-motion-spec.md`

The video-to-object transform must define:

- protected media lane
- protected text zones
- start media rect
- end media rect
- movement path
- forbidden overlap map
- responsive fallback
- reduced-motion fallback

Z-index is not a layout strategy. The media object may move above decorative paper, cards, or background forms, but it may not cover headlines, body copy, CTAs, nav labels, captions, station labels, card titles, or anything marked `data-protected-text` or `data-layout-critical`.

Use `data-overlay-object` or `data-scroll-object` on moving media and `data-protected-text` or `data-layout-critical` on critical text so scroll/layout checkers can detect overlap.

## Hero-Only Video Pattern

- video lives in top stage
- later sections use normal readable layout
- optional static thumbnail appears later if useful

## Reserved Media Lane Pattern

- media stays sticky only inside a reserved column/lane
- text never enters media lane
- media collapses below/above content on narrower widths

## Media Dock Pattern

- media starts large
- media docks into a clearly bounded small card
- content layout reserves space for the docked card
- no overlap

## Media Exit Pattern

- media leaves after hero stage
- scroll continues with cards/content without video
