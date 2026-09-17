# Codex Imagegen Frontend Web Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Selected mode:
Imagegen Frontend Web / Landing Reference Generation

Design read:
`Reading this as: {{PAGE_KIND}} for {{AUDIENCE}}, with a {{VIBE}} language, leaning toward {{MODE_OR_AESTHETIC}}.`

Active dials:

- DESIGN_VARIANCE: `{{DESIGN_VARIANCE}}`
- IMAGE_USAGE_PRIORITY: `{{IMAGE_USAGE_PRIORITY}}`
- ART_DIRECTION: `{{ART_DIRECTION}}`
- VISUAL_DENSITY: `{{VISUAL_DENSITY}}`
- MOTION_INTENSITY: `{{MOTION_INTENSITY}}`

Required files to read:

- `design-dna/landing-page-craft-rules.md`
- `design-dna/anti-ai-tell-preflight.md`
- `design-dna/art-directed-palette-exploration.md`
- `design-dna/unsplash-asset-sourcing-rules.md` when real imagery is needed
- `agent-workflows/image-first-frontend-workflow.md`
- `skills/image-first-frontend/SKILL.md`
- `skills/landing-page-craft-director/SKILL.md`
- `design-intelligence/landing-section-composition-library.json`

Reference generation contract:

1. If no visual direction is approved, create `docs/design/direction-options.md` with Direction A Safe Refined, Direction B Artistic Expressive, and Direction C Unexpected High-Character. Stop for Migi to choose.
2. After Migi chooses A, B, C, or a hybrid, create `docs/design/selected-direction.md`.
3. Generate or select one horizontal image/reference per section, not one compressed full-page board.
4. Each section must define a job, composition anchor, background mode, CTA variation, image role, and second-read moment.
5. Explore Safe Refined, Artistic Expressive, and Unexpected High-Character palette options; do not default to muddy AI-background colors. Reject sepia/espresso/umber brown-black archive wash even when the concept says nocturne, archive, field guide, botanical, brass, tobacco, parchment, vintage, cinematic, or premium.
6. If real imagery is required, create `docs/design/unsplash-search-plan.md` and `docs/design/unsplash-asset-manifest.md`; include source/photographer/download metadata, alt text, crop strategy, palette relationship, text safe zones, and product-truth notes.
7. Keep the selected palette and typography locked across sections.
8. Vary section rhythm without breaking the concept spine.
9. Use images structurally, not as decoration.
10. After references, create `docs/design/visual-spec.md` with Direction Gate Summary and Palette Exploration, then define design-system tokens before implementation.

Evidence requirements:

- section-by-section references or documented blocker
- direction options / selected direction
- visual spec
- palette exploration and contrast notes
- Unsplash search plan / asset manifest when applicable
- anti-AI-tell checklist
- screenshot QA after implementation
- final scorecard / done report
