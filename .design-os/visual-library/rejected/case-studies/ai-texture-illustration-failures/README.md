# AI Texture And Amateur Illustration Failures

## Why Rejected

This case is rejected because it shows three recurring AI-builder defaults that Migi explicitly does not want: a vague light blob added to make a dark UI feel "advanced," a weird dotted background texture used as fake atmosphere, and an amateur vector illustration whose lines and labels collide with text.

These are global Design OS failures. Texture, illustration, and vector forms must have a role, layer, bounds, anchors, responsive behavior, and text-safe zones. If a background or drawing exists only because it looks cool, remove it.

## Screenshots

| Filename | Failure Shown | Why Rejected | Correction Principle | Mapped Rule | Scorecard Cap |
| --- | --- | --- | --- | --- | --- |
| `screenshots/ai-light-blob-background.png` | Weird light blob on a dark textured UI | The central foggy glow is a generic AI "cool advanced UI" move with no source, material logic, or role. | Use a real visual thesis: product object, image environment, material field, color plane, or functional lighting tied to the scene. | No AI Ambient Blob; Human Palette Direction; Shape Role Discipline | unmotivated ambient blob max 4 |
| `screenshots/weird-dotted-background-texture.png` | Repeating dotted/star-field background texture | The dot field reads like generated texture filler rather than a meaningful surface, diagram, grid, or material. | Remove decorative dot textures unless they are explicit data, a functional grid, a brand pattern with a reason, or a sourced material texture. | No Decorative Dot Texture; No Generic AI Atmosphere | dotted background texture max 4 |
| `screenshots/amateur-illustration-text-collision.png` | Amateur vector flower, clipped words, and callout lines crossing text | The illustration looks childish and unmodeled; stems, arcs, labels, and callout lines cross or cut words instead of respecting protected zones. | Use a shape inventory, label lanes, callout routes, and collision checks; if the illustration cannot meet that bar, remove it. | Vector Form System; Text Safe Zones; Label Collision Discipline | amateur illustration max 4; line crosses text max 3 |

## Hard Rules

- Do not use blurred ambient light blobs, foggy radial glows, soft spotlight smears, or "cool advanced UI" haze as default background texture.
- Do not use dotted/star-field/micro-dot background texture as atmosphere unless Migi explicitly asks for that exact motif and the visual spec proves a functional role.
- Do not ship amateur vector illustrations: unstable geometry, childish linework, fake botanical/scientific plates, arbitrary petals/stems, or unmodeled decorative shapes fail the visual system.
- Do not let illustration lines, stems, arcs, callouts, masks, or vector paths cross through readable words.
- Do not clip or cut words with viewport edges, parent overflow, masks, decorative frames, or illustration layers.
- Every texture and illustration must have a declared role, layer, bounds, anchors, responsive behavior, and text-safe zone.

## Correction Principles

- Replace fake atmosphere with composition, product object, imagery, material, type hierarchy, or meaningful motion.
- If texture is needed, choose a real material strategy with scale, opacity, repeat, and contrast rules.
- If illustration is needed, create a shape inventory and layer model before drawing.
- Labels and callouts need protected lanes and routes; decorative paths must yield to text.
- Screenshot QA must inspect whether typography is cut, crossed, or made secondary by the illustration.

## Rules This Should Catch

- No AI Ambient Blob.
- No Decorative Dot Texture.
- Vector Form System Director.
- Shape Role Discipline.
- Label Collision Discipline.
- P0 Layout Integrity.
- Visual-library rejected evidence review.

## Scorecard Caps

- Unmotivated ambient blob/glow used as background atmosphere: max score 4.
- Decorative dotted/star-field background texture used as fake advanced UI atmosphere: max score 4.
- Amateur/childlike vector illustration in premium/editorial UI: max score 4.
- Illustration, callout, stem, arc, or path crosses readable words: max score 3.
- Words are clipped/cut by viewport, mask, parent overflow, or illustration layer: max score 3.
- Texture or illustration lacks role/layer/bounds/anchors: max score 5.
