# QA Checklist

- Selected pattern visible.
- Route matches spec.
- Chapter nav syncs.
- Pinned stages never blank.
- Objects assemble/dock/settle as promised.
- Critical text never covered.
- Moving video/media never covers protected text.
- `docs/design/protected-zone-map.md` exists when media moves.
- `docs/design/media-object-stage-plan.md` exists when media moves.
- `docs/design/scroll-motion-spec.md` defines start/end media rects and forbidden overlap zones.
- Media has a reserved lane or an intentional readable text surface.
- Z-index is not the only collision strategy.
- Screenshots prove sampled scroll positions.
- No accidental horizontal overflow.
- Mobile fallback exists.
- Mobile route/chapter nav remains accessible after scroll.
- Mobile route/chapter nav uses persistent bottom navigation or an approved bottom-accessible controller by default.
- Bottom mobile route nav respects safe-area inset and keeps accessible full labels.
- Detail reveals triggered by cards/objects remain anchored to the selected trigger or use explicit focus/scroll context.
- Reduced-motion fallback exists.
- data-scroll hooks exist for QA.
- `data-overlay-object` / `data-scroll-object` and `data-protected-text` / `data-layout-critical` hooks exist where practical.

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

# Compact Nav Implementation Pattern

For compact viewports:

- prefer icon + active full label
- never show only arbitrary initials
- maintain aria-label with full destination name
- use title only if it does not create browser-native tooltip issues in art-directed UI
- ensure 44px minimum hit target where practical
- do not let active state change width enough to break layout
- no giant empty nav bar after label collapse

Example acceptable JSX pattern:

```tsx
<button aria-label="Check-in" data-nav-item>
  <MaterialIcon name="login" aria-hidden="true" />
  <span className="sr-only">Check-in</span>
  <span className="active-label">Check-in</span>
</button>
```

If Material Icons package is not available:

- use project-approved existing icons
- or create simple inline SVG icons
- do not install new dependencies unless explicitly approved
