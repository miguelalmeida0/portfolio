# Image-First Website Workflow

Source ingested from Migi's open-source image-to-code skill file. This reference is normalized for Miguel Design OS and should be used with Design OS evidence gates.

## Baseline Configuration

Use these defaults unless the task clearly says otherwise:

- design variance: high, but coherent
- visual density: airy to moderate
- art direction: bold when references support it
- implementation clarity: very high
- image usage priority: high when appropriate
- spacing generosity: high
- analysis precision: very high
- image generation eagerness: high
- UI simplicity discipline: high

## Mandatory Image-First Rule

For visual website tasks, do not start with code if image generation or precise visual references are available.

Workflow:

1. Infer section count and site type.
2. Generate/select section references first.
3. Generate additional detail/extraction images if needed.
4. Deeply analyze every image.
5. Extract the design system.
6. Implement the site to match the references as closely as reasonable.
7. Capture screenshots and compare against the reference/analysis.

## Section Image Rule

Inside Codex, section clarity beats collage convenience.

Prefer:

- one large image per section
- fresh image for each unclear section
- extraction/detail image for typography, buttons, cards, pricing, testimonials, nav, footer, or CTA details

Avoid:

- one giant compressed multi-section board
- unreadable text and tiny controls
- cropping a hero or pricing area from a bigger board
- using distorted cutouts as implementation source

## Deep Analysis Standard

For every section image, inspect:

- section role
- visual priority
- readable text
- heading/subheading/CTA wording
- type scale relationships
- font mood
- line count and wrapping
- spacing between major elements
- internal padding/gutters
- button shape, hierarchy, padding, icon usage
- card/block logic
- color palette
- background treatment
- image treatment
- shadows, borders, dividers, radius logic
- grid/alignment behavior
- repeated motifs
- unclear details

If something important is unclear, generate/request a clearer reference before coding.

## Hero Cleanliness

The hero must feel like a strong opening scene.

Do:

- use one clear focal point
- keep headline short and powerful
- keep subcopy concise
- show the primary CTA clearly
- preserve negative space
- ensure small-laptop readability

Avoid:

- crowded heroes
- multiple competing focal points
- 4+ line hero headlines
- filler pills/status labels
- fake technical microcopy
- nested dashboard panels unless requested

## Anti-Drift Implementation

During implementation:

- preserve section order and rhythm
- preserve spacing logic
- preserve type mood and scale relationships
- preserve image/text balance
- preserve component family
- preserve distinctive layout mechanics
- avoid replacing sections with generic rows
- avoid merging all sections into one repeated pattern
- avoid nested-card container prisons

## Combinatorial Direction Engine

Choose a coherent combination, not a style mashup:

- theme paradigm: pristine light, deep dark, bold studio solid, or quiet premium neutral
- background character: subtle grid, pure field, full-bleed imagery, or tactile texture
- typography character: grotesk, refined grotesk, expressive display, compressed statement, editorial serif/sans, or Swiss hierarchy
- hero architecture: cinematic centered, asymmetric split, image-first, editorial offset, typographic behemoth, or floating visual system
- section system: bento rhythm, editorial blocks, poster storytelling, gallery cadence, Swiss grid, or asymmetric marketing flow
- signature components: choose exactly four strong components
- motion language: choose exactly two state/transition cues

## Website Image System

A site may need image moments beyond the hero:

- hero media
- editorial crops
- product visuals
- framed photos
- gallery blocks
- section images
- layered media panels

Each image must have a role and a stable implementation frame unless the selected Design OS mode requires image-as-environment.

## Final Check

Before handoff:

- Were references generated/selected before code?
- Were enough section images used?
- Were unclear sections regenerated or clarified?
- Was text extracted where readable?
- Were typography, spacing, buttons, colors, and components analyzed?
- Is the hero clean on a small laptop?
- Is the implementation faithful to the references?
- Are sections varied but coherent?
- Are unnecessary pills/labels/nested containers removed?
- Are screenshot QA and done-report gates satisfied?
