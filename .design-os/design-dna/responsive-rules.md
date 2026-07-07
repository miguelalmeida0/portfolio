# Responsive Rules

A UI is not responsive until screenshots prove it at 390, 768, and 1440 px.

## Required Evidence

Capture or document why capture failed:

```txt
captures/{project-or-feature}/mobile/primary.png   390 px
captures/{project-or-feature}/tablet/primary.png   768 px
captures/{project-or-feature}/desktop/primary.png  1440 px
```

Use screenshots as evidence for the current UI. Do not use old captures as templates to recreate.

## 390 px Mobile Checks

Pass requires:

- primary object appears before secondary panels
- primary action appears in or directly after the primary object
- no accidental horizontal scroll
- sticky header/footer does not cover content
- text in buttons, tags, nav, and cards does not clip
- tap targets are at least 44 px for primary controls where practical
- bottom nav and sticky CTA are not both fighting for the same space

Allowed exception: documented horizontal scroll for dense comparison tables or carousels.

## 768 px Tablet Checks

Pass requires:

- layout is not just a stretched mobile column unless reading is the task
- two-column layout only appears when both columns remain readable
- nav does not collide with page title or actions
- inspector/drawer behavior is defined
- primary action remains visible without hunting

## 1440 px Desktop Checks

Pass requires:

- non-editorial tools use width for context, comparison, preview, table density, or inspector
- mobile-width controls are not stretched to huge full-width buttons
- line length is controlled for reading surfaces
- data columns align and numeric values use consistent alignment
- primary object and supporting context can be scanned together

## CSS Implementation Checks

Use:

- `min-width: 0` on flex/grid children that contain text
- `overflow-wrap: anywhere` or equivalent for untrusted long strings
- stable `aspect-ratio` for media and fixed-format tiles
- explicit safe-area padding for fixed mobile bars
- container or layout breakpoints tied to content needs, not palette reuse

Avoid:

- viewport-scaled font sizes for normal UI text
- negative letter spacing
- hover states that change element size
- fixed-height cards containing unpredictable copy

## Failure Conditions

Do not finish while any are true:

- accidental horizontal scroll at 390 px
- primary action hidden below sticky UI
- text clipped in the primary flow
- desktop is stretched mobile for a tool/dashboard/workspace
- modal/drawer cannot be closed or read on mobile
- screenshot evidence missing and no blocker documented
