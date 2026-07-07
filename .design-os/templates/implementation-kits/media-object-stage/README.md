# Media Object Stage Kit

Use this kit when video, image, or mixed media is the primary interface object.

Media should have a role: hero, crop, mask, sticky object, poster, portal, card, broadcast tile, proof window, or detail view.

## Protected Media Lane

When media moves, pins, scales, rotates, docks, or becomes an interface object, it needs a reserved lane or a documented stage path. The lane must not cross critical text.

Required companion artifacts:

- `docs/design/protected-zone-map.md`
- `docs/design/media-object-stage-plan.md`
- `docs/design/scroll-motion-spec.md`

Use `data-overlay-object` or `data-scroll-object` for the moving media and `data-protected-text` or `data-layout-critical` for critical text. Z-index is not a layout strategy.

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
