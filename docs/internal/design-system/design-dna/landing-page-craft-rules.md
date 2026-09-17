# Landing Page Craft Rules

Landing pages, portfolio pages, marketing pages, and image-led redesigns are visual products. They must not collapse into generic section stacks.

## Image-First Reference Rule

When generating or selecting landing-page references:

- use one separate horizontal image per section
- never compress a full multi-section landing page into one unreadable board
- every section reference must be readable enough to extract layout, type, image, CTA, and spacing

If image generation is not available, use visual-library references, Migi-provided screenshots, or sourced real imagery. When Unsplash or real photography is used, create `docs/design/unsplash-search-plan.md` and `docs/design/unsplash-asset-manifest.md`.

## Section Job Rule

Every section must have a job:

- hook
- proof
- educate
- compare
- demonstrate
- build trust
- convert
- close

No section exists only to fill scroll.

## Section Design Choices

Each section must choose:

- composition anchor
- background mode
- image role
- CTA variation
- primary text role
- second-read moment

Across the page:

- palette stays locked
- palette exploration happens before the palette is locked
- typography stays locked
- section rhythm varies
- image usage is structural, not decorative
- sourced images have roles, source metadata, alt text, crop strategy, palette relationship, and text safe zones
- hero does not default to AI classic left-text/right-image
- repeated layout families are avoided

## Palette Exploration Rule

Landing, portfolio, artistic, cinematic, creative, editorial, and experimental pages must not default to muddy generated-app palettes. The sepia/espresso/umber brown-black archive wash is banned for pages, stages, cards, panels, nav, sidebars, and containers; do not excuse it as nocturne, archive, field guide, botanical, brass, tobacco, parchment, vintage, cinematic, or premium.

Before implementation, propose:

- safe refined palette
- artistic expressive palette
- unexpected high-character palette

Then select one and lock it with OKLCH/APCA contrast notes. Do not choose the safest option automatically when the concept can support stronger color.

## No-Image Fast Direction Gate

New landing, portfolio, creative, cinematic, artistic, editorial, and major redesign work must begin with 3 distinct no-image direction cards and compact layout maps before coding. Paid image generation is not part of the default gate.

Required:

- Direction A: Safe Refined
- Direction B: Artistic Expressive
- Direction C: Unexpected High-Character
- `docs/design/direction-options.md`
- `docs/design/direction-layout-maps.md`
- `docs/design/direction-risk-check.md`

Direction cards must identify the primary product object, domain palette rationale, navigation model, interaction promises, likely failure risk, implementation complexity, and a simple ASCII/block layout map. Vague vibes are not enough.

When Migi selects Direction A, B, C, or a hybrid for a landing/portfolio/artistic page, that selection is approval to build unless Migi explicitly says planning-only, spec-only, wait, or no-code. Create `docs/design/selected-direction.md`, then continue into visual spec, design-system tokens, palette/contrast, navigation, anti-AI-tell preflight, implementation, validation, and URL handoff when a dev server starts.

## Hero Rules

- hero must fit the first viewport
- headline should usually be max 2 lines on desktop
- subtext should be short and readable
- CTA visible without scroll
- no prose-heavy hero stacks
- no trust/logo strip inside hero
- no tiny launch/version labels unless explicitly launch-specific
- no scroll cues

## Layout Rules

- no Blogspot structure
- no endless zigzag sections
- no generic repeated feature rows
- no split-header pattern by default
- no logo wall made of plain text wordmarks
- no text-only page unless explicitly typography-only and still visually composed
- no div-based fake screenshots as product visuals
- no generic stock filler as section imagery
- no stock image presented as real product/customer/facility proof

## Conversion Path

The CTA path must be clear:

- one primary CTA intent
- one label per intent
- no duplicate CTA meaning
- no CTA wrapping on desktop
- CTA contrast must pass

## Stop Conditions

- the page is only text and generic cards
- the hero is artistic but the rest becomes generic
- generated references are unreadable
- sections repeat the same family
- images are used as filler instead of structure
- real imagery is used without source metadata, manifest, or product-truth notes

## Advanced Motion For Landing / Portfolio

If a landing, portfolio, marketing, creative, or cinematic page uses advanced motion as part of the brief, the page needs choreography beyond hero movement.

Required:

- `docs/design/motion-choreography-plan.md`
- section-by-section motion map
- at least page/section, image/media, typography, navigation/menu, and micro-feedback layers
- reduced-motion fallback
- motion sequence evidence or documented blocker

Do not rely on a single background drift, fade-up everywhere, hover scale, or generic scroll reveal as the motion concept.
