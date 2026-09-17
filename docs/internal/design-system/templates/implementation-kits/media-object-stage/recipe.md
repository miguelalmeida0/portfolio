# Recipe

1. Name the media role.
2. Define crop, aspect ratio, safe zones, and focal point.
3. Create media state map.
4. Plan fallback poster/loading/error states.
5. Decide controls, captions, and focus behavior.
6. Test desktop/tablet/mobile crops.
7. Verify text never relies on a lucky frame.

## Scroll/Media Movement Add-On

When the media object moves during scroll:

1. Define protected text zones.
2. Define the protected media lane.
3. Define start and end media rects.
4. Define forbidden overlap zones.
5. Define responsive and reduced-motion fallbacks.
6. Add `data-overlay-object` or `data-scroll-object`.
7. Add `data-protected-text` or `data-layout-critical`.
8. Capture screenshots at sampled scroll positions.
9. Run scroll choreography review, then layout integrity review.

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
