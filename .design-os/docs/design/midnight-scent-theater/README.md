# Midnight Scent Theater

Figma-ready visual grammar plan for a fictional editorial perfume landing page. No paid Figma AI, Figma Make, Figma Weave, or image generation was used.

Writable Figma file status: no file URL or file key was provided, so this pack is local specs plus plugin snippets only.

## Required Figma Pages

When a writable Figma design file is available, run `figma-plugin-snippets/create-midnight-scent-theater-pages.js` to create:

1. `00 Shape Tokens`
2. `01 Vector Grammar`
3. `02 Motif Library`
4. `03 Morph Boards`
5. `04 Motion Storyboards`
6. `05 Export Specs`
7. `99 QA Review`

## Concept

Midnight Scent Theater is an editorial landing page where a perfume bottle appears as the lead object on a small night stage. The visual grammar is built from moon/lens portals, a bottle silhouette, curtain-mask reveals, and restrained smoke marks. The page should feel theatrical and tactile, not like a generic luxury product grid.

## Hard Shape Rule

Every visible shape must have:

- role
- layer
- bounds
- anchors
- material
- responsive behavior
- accessibility meaning or explicit decorative status
- code handoff strategy

## Page Mapping

| Page | Purpose | Local Source |
|---|---|---|
| `00 Shape Tokens` | Geometry, smoothing, keyline, mask, and morph tokens. | `shape-tokens.json` |
| `01 Vector Grammar` | Shape roles, layers, safe zones, responsive rules. | `vector-grammar.md` |
| `02 Motif Library` | Moon/lens, scent bottle, curtain, smoke, and support motifs. | `motif-library.md` |
| `03 Morph Boards` | Compatible morph pairs and implementation notes. | `morph-board.md` |
| `04 Motion Storyboards` | Five-frame storyboards with timing and fallbacks. | `motion-storyboard.md` |
| `05 Export Specs` | Code handoff, vector export rules, manifests. | `code-handoff-manifest.json` |
| `99 QA Review` | QA checklist and score blockers. | `qa-checklist.md` |

## Core Motifs

- Moon/lens motif: hero portal and image mask.
- Scent bottle silhouette motif: primary product object and morph target.
- Curtain reveal motif: chapter mask and transition device.
- Smoke mark motif: atmosphere and decorative morph endpoint.

## Runtime Targets

- CSS for responsive shape tokens and simple masks.
- SVG for meaningful motifs and draw-on stroke.
- GSAP or Motion for scroll timelines and compatible morphs.
- Canvas only if smoke marks become particle fields.

## Reduced Motion

Reduced motion replaces morphs and scroll choreography with static final compositions, instant masks, and one short opacity confirmation. The bottle remains visible; scent notes become static labels; smoke is a still texture.

