# Motif Library

## Motif Table

| Motif | Role | When To Use | When Not To Use | Default Layer | Materials | Motion Potential | Code Export Notes | Anti-Patterns |
|---|---|---|---|---|---|---|---|---|
| Moon/lens | `mask`, `hero-object`, `frame` | Hero portal, image reveal, chapter transition, bottle halo. | As fake glass oval or random background circle. | masks-and-clips | pearl paper, soft ink rim, restrained highlight | circle to lens, lens transition, mask reveal | Export as SVG ellipse/superellipse or CSS clip-path; preserve safe zone. | fake lens, overblur, arbitrary orbit |
| Scent bottle silhouette | `hero-object`, `selection-target` | Primary product object, morph target, chapter anchor. | As fake product proof or generic stock bottle. | primary-object | ink silhouette, velvet fill, brass keyline | squircle to bottle, object reveal, selection snap | Meaningful SVG with title/desc; fixed brand fills allowed only in project-specific asset. | generic perfume icon, clipped label |
| Curtain reveal | `mask`, `foreground-object` | Chapter entry, scroll reveal, stage edge, image wipe. | As random wavy side panels. | masks-and-clips | velvet plane, paper shadow, subtle fold keyline | curtain fold to mask, mask reveal | Prefer clipPath or CSS mask with stable seam anchors. | wavy filler, text covered |
| Smoke mark | `atmosphere`, `decorative`, `callout` | Scent trail, note atmosphere, petal-to-smoke morph endpoint. | To fill empty space or cover text. | atmosphere | translucent ink, soft grain, low-contrast paper stain | petal to smoke, drift, draw-on opacity | Decorative by default; aria-hidden unless scent-note label. | random blob, overblurred blob |
| Couture label | `callout`, `control` | Scent notes, chapter metadata, selected state. | As meaningless premium badges. | labels-and-callouts | paper label, brass pin, ink text | selection snap, draw-on keyline | HTML text preferred; SVG frame can be decorative. | badge soup |
| Brass hardware mark | `ornament`, `connector` | Hinges, mask seams, physical dividers. | As generic gold lines. | foreground-object | brass stroke, matte highlight | draw-on stroke | Use currentColor or CSS variable stroke. | ornamental separators |
| Shadow portal | `background-object`, `frame` | Stage depth behind bottle or chapter transition. | As muddy dark blob. | background-object | ink wash, paper shadow | portal scale, lens transition | CSS radial layer or SVG mask; keep text outside. | muddy blob |
| Architectural plane | `background-object` | Editorial structure, chapter planes, depth. | As arbitrary tilted rectangles. | background-object | matte paper, quiet keyline | parallax layer drift | CSS/SVG polygon with named layer. | random slabs |

## Required Motifs For This Project

### Moon/Lens Motif

- Role: `mask` and `hero-object`.
- Bounds: centered behind bottle, not covering headline.
- Anchors: center, image focal point, safe-zone edge.
- Motion: circle to lens, lens transition.
- Export: SVG ellipse/superellipse or CSS clip-path.

### Scent Bottle Silhouette Motif

- Role: `hero-object`.
- Bounds: center stage; no label clipping.
- Anchors: cap top, shoulder left/right, base center.
- Motion: squircle to bottle silhouette through normalized path or staged mask reveal.
- Export: meaningful SVG with `title` and `desc`.

### Curtain Reveal Motif

- Role: `mask`.
- Bounds: left/right stage edges or full-screen chapter mask.
- Anchors: top rail, center seam.
- Motion: curtain reveal with anticipation, open, settle.
- Export: CSS mask or SVG `clipPath`; fallback is static open curtain.

### Smoke Mark Motif

- Role: `atmosphere` or `decorative`.
- Bounds: outside copy safe zones.
- Anchors: bottle shoulder, lower-left stage, scent note point.
- Motion: petal to smoke mark only when paths are normalized; otherwise fade-free draw-on or static.
- Export: decorative SVG or CSS mask; `aria-hidden` by default.

