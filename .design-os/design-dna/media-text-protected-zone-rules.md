# Media / Text Protected Zones

Moving media objects, video frames, image cards, portals, sticky media, and scroll-transformed objects may never cover critical text.

Critical text includes:

- headlines
- body copy
- nav labels
- CTA labels
- card titles
- station labels
- captions
- form labels
- detail panel content
- any element marked `data-layout-critical`
- any element marked `data-protected-text`

## Hard Blockers

- video object covers text
- image/card covers headline
- media frame hides caption
- sticky media overlaps body copy
- scroll-transformed object passes through protected text
- media z-index sits above readable content without an intentional readable mask/panel
- media movement path has no forbidden zones
- video-to-object transform crosses content lane

## Required For Scroll/Media-Heavy UI

- protected-zone map
- media movement map
- start/end media rects
- forbidden overlap zones
- responsive behavior
- reduced-motion behavior
- screenshot proof across scroll positions

## Allowed

- media can overlap decorative paper/card/background shapes
- media can sit behind text only if text has a deliberate readable surface
- media can pass behind non-critical decorative content
- media can clip/mask intentionally inside its own lane

## Forbidden

- solving by hiding text
- solving by overflow hidden
- solving by making text unreadable
- solving with z-index only
- letting media path cross headline/body/CTA/nav areas

## Media Never Over Text

Images, videos, SVG objects, media frames, portals, masks, and large decorative objects must never sit on top of readable text.

Critical text includes:

- headline
- body
- nav
- CTA
- card title
- card body
- captions
- labels
- form fields
- station labels
- any `data-layout-critical`
- any `data-protected-text`

Hard rule:

- Media may overlap decoration.
- Media may overlap empty space.
- Media may overlap its own frame.
- Media may not overlap text.

Exceptions:

Only allowed if text is intentionally inside the media and has a dedicated readable surface, for example a caption chip, label panel, or subtitle background.

Forbidden:

- video over card text
- image over headline
- media over body copy
- floating object over CTA
- transparent media over text
- media moving through text during scroll
- media covering content at intermediate scroll states

Score caps:

- media over text visible in screenshot: max score 3
- media crosses text during scroll: max score 3
- no protected-zone map for media-heavy design: max score 5

## Score Caps

- moving video/media covers critical text: max score 3
- scroll-transformed object crosses protected text zone: max score 3
- video-to-object transform has no protected-zone map: max score 5
- media object is above text by z-index without readable surface: max score 4
- screenshot shows media/text collision: max score 3
- no scroll-state screenshots for media-heavy choreography: max score 5

## Rejected Case Study

Use `visual-library/rejected/case-studies/late-check-fm-scroll-media-text-collision/` as the canonical rejected example. The concept is promising; the execution is rejected because the media object covers critical text.

## Final UI Integrity Gate

Before final handoff, run `final-ui-integrity-gate`. Any media/image/video/overlay object over readable text is a blocker. Text wins over visual objects: text, CTA, navigation, and readable card content beat media, shape, card, and animation layers.
## Final UI Integrity Gate v2 Addendum

Media/text protected zones must be checked across the full final UI v2 viewport matrix and scroll samples.

Hard blockers:

- video, image, SVG, canvas, media stage, overlay object, fixed object, or sticky object overlaps protected text
- media/text collision appears only at intermediate width
- media/text collision appears only during sticky, pinned, selected, or scroll state

Final handoff is blocked if media/text collision remains in any sampled viewport, scroll point, or state.
