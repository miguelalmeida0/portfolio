# Fixed Overlay Covering Content

## What The Failure Is

A fixed, sticky, pinned, or overlay element covers important content, cards, text, CTA, nav, or detail panels.

## Why It Kills Trust

The UI appears broken and hostile. The user cannot trust content that can disappear under a layer.

## How To Detect It

- Compare fixed/sticky rects against `data-layout-critical`, buttons, nav labels, cards, and protected text.
- Sample scroll states.
- Capture final viewport screenshots.

## How To Fix It

- Reserve space for the fixed element.
- Move it to a safe lane.
- Dock or dismiss it after its stage.
- Add responsive variants and safe-area padding.

## Score Caps

- fixed/sticky overlay covers content: max score 3
- media/image/video over readable text: max score 3
- unresolved user complaint remains visible: max score 2

## Required Future Checks

- scroll-choreography-review when scroll-heavy
- layout-integrity-review
- final-ui-integrity-gate
