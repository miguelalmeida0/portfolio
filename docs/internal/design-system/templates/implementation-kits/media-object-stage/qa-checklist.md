# QA Checklist

- Media has a named interface role.
- Crop preserves the subject at every breakpoint.
- Text has stable readability over or beside media.
- Poster/loading/error states are designed.
- Controls and captions are accessible when needed.
- Reduced motion keeps the story intact.
- Moving media has a protected lane.
- Critical text zones are marked and avoided.
- Start/end media rects are documented.
- Forbidden overlap zones are documented.
- Scroll-state screenshots prove no media/text collision.
- Z-index is not used as the only collision strategy.

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
