# Morph Board

## Rules

- Prefer compatible parametric families.
- Do not claim arbitrary paths morph cleanly unless normalized.
- Preserve text-safe zones during every morph.
- Every morph needs reduced-motion fallback.

## Morph Families

| ID | Before | After | Compatibility Notes | Point / Structure Notes | Easing | Technique | Reduced Motion |
|---|---|---|---|---|---|---|---|
| `circle-to-lens` | moon circle | horizontal lens | Compatible if both remain ellipse/superellipse-derived. | Keep center anchor and radius variables stable. | `cubic-bezier(0.22, 1, 0.36, 1)` | CSS border-radius, SVG ellipse attrs, or Motion layout | Static lens appears immediately. |
| `lens-to-bottle-mask` | lens mask | scent bottle silhouette mask | Needs staged bridge: lens -> squircle -> normalized bottle path. | Bottle path must define cap, shoulders, body, base with consistent winding. | `cubic-bezier(0.16, 1, 0.3, 1)` | SVG path interpolation only after normalization, or GSAP MorphSVG | Use final bottle silhouette with instant mask. |
| `curtain-fold-to-mask` | vertical fold planes | open chapter mask | Compatible as clip-path polygons if seam anchors stay stable. | Top rail and center seam remain fixed. | `cubic-bezier(0.65, 0, 0.35, 1)` | CSS `clip-path` or SVG mask timeline | Show open chapter state. |
| `petal-to-smoke-mark` | scent petal | smoke mark | Decorative only; arbitrary organic morph allowed only with normalized points. | Use same point count and winding; otherwise use draw-on opacity. | `cubic-bezier(0.33, 1, 0.68, 1)` | SVG/GSAP, Flubber only for decorative smoke | Static smoke mark in final position. |
| `card-frame-to-shadow-portal` | product frame | dark portal | Compatible as scale/radius/blur variables, not path morph. | Center anchor stays on bottle. | `cubic-bezier(0.22, 1, 0.36, 1)` | CSS variables or SVG filter transition | Static portal shadow. |

## Primary Morph Board

### Board: Moon Lens To Bottle Reveal

1. Before: `mask / moon-lens / closed / hero`.
2. Bridge: `mask / moon-lens / stretched / anticipation`.
3. Transformation: `mask / bottle-silhouette / reveal / normalized-path`.
4. Settle: `hero-object / scent-bottle / visible / final`.
5. Final: bottle silhouette owns the hero; moon lens becomes a quiet halo.

Implementation target: SVG + GSAP/Motion, with CSS fallback for lens-only state.

