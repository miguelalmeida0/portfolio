# Midnight Scent Theater - Figma-Ready Visual Grammar Plan

## Status

Writable Figma file: not provided in this turn.

Figma path used: local fallback. This package creates design specs, JSON manifests, QA checks, and a normal Figma Plugin API snippet. It does not use Figma AI, Figma Make, Figma Weave, image generation, AI credits, Dev Mode, Figma Motion, Figma Draw, or any paid/plan-gated feature.

## Concept

Midnight Scent Theater is a fictional editorial perfume landing page built like a nocturnal stage. The page grammar should feel cinematic, sensual, and editorial without becoming random dark luxury decoration. The core visual language is a theater reveal: a moon/lens opens like a stage aperture, the bottle silhouette becomes the hero object, curtain folds control scene transitions, and smoke marks carry scent-note atmosphere.

## Required Figma Pages

The local Plugin API snippet creates or updates these pages when pasted into a writable Figma file:

- `00 Shape Tokens`
- `01 Vector Grammar`
- `02 Motif Library`
- `03 Morph Boards`
- `04 Motion Storyboards`
- `05 Export Specs`
- `99 QA Review`

Snippet path: `docs/design/midnight-scent-theater/figma-plugin-snippets/create-midnight-scent-theater-pages.js`

## Visual Mode

- Mode: editorial perfume landing page
- Mood: midnight stage, perfume ritual, moonlit aperture, velvet curtain, smoked scent notes
- Composition principle: image-less vector theater system, not generated photography
- Shape principle: every shape has a role, layer, bounds, anchors, material, responsive behavior, accessibility status, and code handoff
- Hard bans: decorative orbit/HUD rings, random blobs, fake glass ovals, roleless smoke, shapes covering text, arbitrary morph claims, fade/slide pretending to be morphing

## Layer Model

1. `background-object`: midnight surface, stage void, deep editorial page background
2. `atmosphere`: smoke marks and faint scent trails, decorative only when explicitly marked
3. `mask`: moon/lens masks, curtain masks, portal crop shapes
4. `hero-object`: scent bottle silhouette, product object frame
5. `frame`: chapter panels, product object frames, editorial cards
6. `foreground-object`: curtain edge, brass hardware, scent-note silhouettes
7. `callout`: couture label, scent note label, chapter label
8. `control`: CTA, navigation pills, chapter controls

## Shape Tokens

Token file: `docs/design/midnight-scent-theater/shape-tokens.json`

Geometry and material are separated. Shape tokens do not include brand color.

Project token direction:

- `project.hero.shapeFamily`: `moon-lens + scent-bottle-silhouette`
- `project.motion.morphFamily`: `circle-to-lens`, `squircle-to-bottle`, `curtain-fold-to-mask`, `petal-to-smoke`
- `project.surface.smoothing`: `0.62`
- `project.icon.strokeWidth`: `1.75`

## Motif Library

### Moon / Lens Motif

- Role: `mask`, `hero-object`, `frame`
- Layer: mask above atmosphere, below hero bottle unless used as primary portal
- Geometry: circle, ellipse, cropped lens, aperture capsule
- Material: moon ivory, smoked silver, dark violet shadow, optional thin brass keyline
- Responsive behavior: desktop can be oversized and cropped; mobile becomes centered portal behind the bottle
- Accessibility: decorative when used as atmosphere; meaningful when it frames product state
- Code handoff: SVG ellipse/capsule or CSS `clip-path: ellipse(...)`
- Motion potential: circle-to-lens transition, lens wipe, aperture crop
- Avoid: fake glass oval, orbital rings, radar/HUD circles

### Scent Bottle Silhouette Motif

- Role: `hero-object`, `foreground-object`, `icon.container`
- Layer: hero-object above lens, below editorial labels
- Geometry: squircle shoulder, narrow neck, stopper cap, heavy base
- Material: black glass, ink violet, moon edge highlight, brass stopper
- Responsive behavior: desktop large vertical silhouette; mobile simplified bottle icon or cropped hero object
- Accessibility: meaningful hero object, needs title/desc in SVG export
- Code handoff: SVG symbol or React component with geometry props
- Motion potential: squircle-to-bottle morph, object reveal, selection snap
- Avoid: fake proof of real product; this is a fictional concept object

### Curtain Reveal Motif

- Role: `mask`, `foreground-object`, `transition`
- Layer: foreground-object over scene during transition; mask when controlling reveal
- Geometry: vertical fold strips, scalloped edge, split left/right panels
- Material: velvet black, oxblood, midnight plum, low brass keyline
- Responsive behavior: desktop side curtains; mobile top/bottom reveal or compact mask edge
- Accessibility: decorative unless it controls a content reveal
- Code handoff: CSS transform strips, SVG mask, or clip-path inset
- Motion potential: curtain reveal, editorial scroll chapter transition
- Avoid: random wavy panels with no stage/reveal role

### Smoke Mark Motif

- Role: `atmosphere`, `decorative`, `scent-note`
- Layer: atmosphere behind text, or scent-note marker beside labels
- Geometry: petal-to-smoke compatible blobs, soft comma marks, thin trailing paths
- Material: translucent moon grey, violet smoke, amber undertone
- Responsive behavior: reduce count on mobile; never cover labels or CTAs
- Accessibility: decorative by default and aria-hidden in code
- Code handoff: SVG paths with opacity variables; avoid fixed theme fills
- Motion potential: petal-to-smoke morph, draw-on scent trail, low-frequency hover drift
- Avoid: random blobs, text obstruction, particle noise

## Morph Board

| Morph | Before | After | Compatibility | Technique | Easing | Reduced Motion |
|---|---|---|---|---|---|---|
| moon aperture | circle | horizontal lens | same family, stable center anchor | CSS border-radius / SVG ellipse attributes | `cubic-bezier(.2,.8,.2,1)` | instant lens state with opacity crossfade under 120ms |
| bottle reveal | squircle | bottle silhouette | parametric bridge: shoulder radius, neck width, base width | SVG path interpolation only after normalized points | `cubic-bezier(.16,1,.3,1)` | static bottle silhouette appears after curtain mask opens |
| curtain mask | vertical fold strips | content mask frame | compatible rect/fold strips | CSS transform and clip-path | `cubic-bezier(.76,0,.24,1)` | hard cut to final revealed layout |
| scent note | petal | smoke mark | decorative only, normalized path recommended | SVG path interpolation or GSAP/Flubber for narrow decorative case | `cubic-bezier(.22,1,.36,1)` | static smoke mark with no path interpolation |
| chapter portal | card frame | shadow portal | compatible rounded rect/squircle family | CSS radius/scale/box-shadow tokens | `cubic-bezier(.2,.7,0,1)` | static portal frame |

## Motion Storyboard

Primary storyboard: `midnight-curtain-lens-reveal`

1. `frame 01 start`: closed velvet curtain masks the center; moon lens is a narrow slit behind it
2. `frame 02 anticipation`: brass hardware marks tighten inward; bottle silhouette shadow appears behind curtain
3. `frame 03 transformation`: curtain folds slide apart while moon circle expands into lens aperture
4. `frame 04 settle`: bottle silhouette rises 12px and keyline draws on
5. `frame 05 final state`: editorial headline and CTA snap into stable text-safe zones

Motion manifest: `docs/design/midnight-scent-theater/figma-motion-manifest.json`

Timing:

- Curtain reveal: 720ms
- Lens transition: 640ms overlapping from 120ms
- Bottle reveal: 520ms after lens midpoint
- Smoke draw-on: 900ms low-priority decorative motion
- Selection snap: 160ms for controls

Reduced-motion fallback:

- No morph paths
- No curtain sliding
- Use a single static open lens frame
- Bottle appears in final position
- Smoke marks render static
- Controls keep 100-160ms color/border state feedback only

## Code Handoff

Manifest: `docs/design/midnight-scent-theater/code-handoff-manifest.json`

Handoff targets:

- Shape tokens: JSON to CSS custom properties
- Motifs: SVG components with geometry props and material props separated
- Motion: CSS/SVG for basic reveal, GSAP or Motion only if runtime project already uses it
- Accessibility: title/desc for meaningful bottle/lens SVGs; `aria-hidden` for decorative smoke
- Responsive: desktop theater composition, tablet centered bottle/lens, mobile stacked editorial reveal

## Export Strategy

Vector manifest: `docs/design/midnight-scent-theater/vector-export-manifest.json`

Rules:

- Preserve SVG `viewBox`
- Use `currentColor` for reusable icon-like marks
- Do not bake fixed theme fills into reusable geometry
- Meaningful SVGs need title/desc
- Decorative smoke/curtain textures are aria-hidden
- Document parity risks for masks, filters, blends, and morph paths

## QA Checklist

Checklist path: `docs/design/midnight-scent-theater/qa-checklist.md`

Must pass:

- Every shape has a named role
- Every motif maps to library entry
- Decorative smoke does not cover text
- Moon/lens is not an orbit/HUD/radar decoration
- Curtain is tied to reveal/mask behavior
- Bottle silhouette is fictional and labeled as concept object
- Morph boards include compatibility notes
- Motion storyboard includes reduced-motion fallback
- Code handoff includes shape tokens, vector export manifest, motion manifest, accessibility notes
