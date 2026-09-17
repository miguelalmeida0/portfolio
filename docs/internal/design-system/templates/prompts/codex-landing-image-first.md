# Codex Landing Image-First Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Selected mode:
Landing Page / Poster Mode or Artistic / Creative Mode

Active dials:

- DESIGN_VARIANCE: `{{DESIGN_VARIANCE}}`
- ART_DIRECTION: `{{ART_DIRECTION}}`
- IMAGE_USAGE_PRIORITY: `{{IMAGE_USAGE_PRIORITY}}`
- IMPLEMENTATION_CLARITY: `{{IMPLEMENTATION_CLARITY}}`
- MOTION_INTENSITY: `{{MOTION_INTENSITY}}`

Required files to read:

- `skills/image-first-frontend/SKILL.md`
- `skills/image-first-website-to-code/SKILL.md`
- `skills/landing-page-pattern-director/SKILL.md`
- `skills/landing-page-craft-director/SKILL.md`
- `skills/signature-interaction-director/SKILL.md` for artistic, brand, portfolio, experimental, or award-reference work
- `skills/anti-ai-tell-preflight/SKILL.md`
- `agent-workflows/image-first-frontend-workflow.md`
- `design-dna/brief-inference-rules.md`
- `design-dna/anti-ai-tell-preflight.md`
- `design-dna/landing-page-craft-rules.md`
- `design-dna/art-directed-palette-exploration.md`
- `design-dna/unsplash-asset-sourcing-rules.md` when real imagery is needed
- `design-dna/motion-and-delight-rules.md`
- `design-intelligence/landing-pattern-guidance.md`
- `design-intelligence/landing-section-composition-library.json`
- `design-dna/design-system-first-rules.md`
- `evaluation/ui-scorecard.md`

Reference anchors:
`{{REFERENCE_ANCHORS}}`

Before coding:

1. Declare the design read.
2. If no visual direction is approved, create `docs/design/direction-options.md` with 3 distinct directions and stop for Migi to choose.
   - Each direction must include a distinct navigation concept, desktop nav behavior, mobile nav behavior, CTA/nav relationship, and default nav pattern avoided.
   - If all three directions use the same top bar, the direction gate fails.
   - Each direction must include navigation readability, identity chrome, decorative geometry, and line/divider strategy.
   - Hard bans: no unreadable nav over images/giant type/changing backgrounds, no forced app-name/logo/initials chrome, no decorative circular/orbital/radar/HUD overlays, no fake sonar rings, no generic orbit graphics, no decorative hairline/separator ornaments, no red divider lines as fake editorial detail, no section-label-plus-line filler.
3. When Migi chooses A, B, C, or a hybrid, proceed immediately to implementation. Do not stop after selected-direction.md. Do not ask for another confirmation unless Migi explicitly requested planning-only/spec-only/no-code.
4. After Migi chooses, create `docs/design/selected-direction.md`.
5. Select landing pattern and concept spine.
6. Generate or select one horizontal image/reference per section; never compress a multi-section page into one unreadable board.
7. For every section, define section job, composition anchor, background mode, CTA variation, image role, and second-read moment.
8. Select one signature interaction or explicitly justify why none fits. Extract mechanics from references, not visual brands, mascots, logos, names, colors, or content.
9. Explore safe refined, artistic expressive, and unexpected high-character palette directions; do not default to muddy AI-generated backgrounds. Reject sepia/espresso/umber brown-black archive wash even for nocturne, archive, field-guide, botanical, brass, tobacco, parchment, vintage, cinematic, or premium concepts.
10. If real imagery is required, create `docs/design/unsplash-search-plan.md`, search by role/query/orientation/color/content_filter/order_by, reject generic stock filler, and create `docs/design/unsplash-asset-manifest.md`.
11. Create `docs/design/navigation-strategy.md`; propose at least 3 nav concepts and select one based on the chosen direction.
12. Create `docs/design/image-first-website-analysis.md`.
13. For new visual-heavy landing/portfolio work with no approved direction, run the No-Image Fast Direction Gate and create `docs/design/direction-options.md`, `docs/design/direction-layout-maps.md`, and `docs/design/direction-risk-check.md`.
14. Create `docs/design/visual-spec.md`.
15. Create `docs/design/design-system-tokens.md`.
16. Create `docs/design/color-and-contrast.md` or an equivalent palette doc.
17. Define image role, image environment strategy, contrast strategy, navigation readability, identity chrome, decorative geometry, line/divider strategy, section rhythm, signature interaction, `docs/qa/anti-ai-tell-preflight.md`, motion strategy, and delight strategy when applicable.
18. If advanced/cinematic/portfolio motion is requested, create `docs/design/motion-choreography-plan.md` and score against `evaluation/benchmarks/motion-cinematic.benchmark.md`.

Implementation order:

1. image-led/poster hero
2. rhythm beyond hero
3. CTA and interaction proof
4. responsive/mobile adaptation
5. screenshot QA
6. motion sequence capture or blocker when motion is central

Evidence requirements:

- no Blogspot structure
- no generic feature-card fallback after hero
- no generic section stack after signature/award references
- no copied reference brand skin instead of transferred mechanics
- no signature interaction without accessibility and reduced-motion fallback
- no major Taste preflight failures
- no repeated generic section family
- no CTA wrapping or duplicate CTA intent
- no real-image use without source manifest, alt text, crop strategy, and text safe-zone notes
- screenshot evidence
- scorecard/done report

Final response contract:

- design read
- landing pattern
- image-first analysis
- anti-AI-tell preflight status
- direction options / selected direction
- direction layout maps / risk check
- paid image generation status: should be "not used" unless explicitly approved with `--paid-ok`
- palette exploration
- Unsplash search plan / asset manifest when applicable
- navigation strategy / selected navigation pattern
- motion/delight strategy if applicable
- motion-choreography plan / sequence evidence when advanced motion applies
- visual spec
- files changed
- build/lint result
- local dev server URL if running
- screenshots or blocker
- scorecard/done report
- remaining weaknesses
