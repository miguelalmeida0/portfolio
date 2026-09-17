# Codex Landing Taste Preflight Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Selected mode:
Landing / Portfolio / Marketing Taste Preflight

Design read:
`Reading this as: {{PAGE_KIND}} for {{AUDIENCE}}, with a {{VIBE}} language, leaning toward {{MODE_OR_AESTHETIC}}.`

Active dials:

- DESIGN_VARIANCE: `{{DESIGN_VARIANCE}}`
- MOTION_INTENSITY: `{{MOTION_INTENSITY}}`
- VISUAL_DENSITY: `{{VISUAL_DENSITY}}`
- ART_DIRECTION: `{{ART_DIRECTION}}`
- IMAGE_USAGE_PRIORITY: `{{IMAGE_USAGE_PRIORITY}}`
- IMPLEMENTATION_CLARITY: `{{IMPLEMENTATION_CLARITY}}`

Required files to read:

- `AGENTS.md`
- `design-dna/00_COMPACT_AGENT_CONTEXT.md`
- `design-dna/brief-inference-rules.md`
- `design-dna/anti-ai-tell-preflight.md`
- `design-dna/landing-page-craft-rules.md`
- `design-dna/art-directed-palette-exploration.md`
- `design-dna/oklch-contrast-and-palette-rules.md`
- `design-dna/interface-feel-rules.md`
- `skills/anti-ai-tell-preflight/SKILL.md`
- `skills/landing-page-craft-director/SKILL.md`
- `skills/oklch-contrast-palette/SKILL.md`
- `skills/make-interfaces-feel-better/SKILL.md`
- `evaluation/ui-scorecard.md`

Reference anchors:
`{{REFERENCE_ANCHORS}}`

Preflight requirements:

1. Confirm the design read.
2. Confirm `docs/design/direction-options.md` and `docs/design/selected-direction.md` exist when the landing/portfolio/marketing direction was not already approved.
3. Confirm visual spec and design-system tokens exist or block implementation.
4. Check Palette Exploration: Safe Refined, Artistic Expressive, and Unexpected High-Character options; selected palette; OKLCH/APCA notes; AI-default palette avoided.
5. Check for banned AI tells: generic purple, muddy generated-app palettes, sepia/espresso/umber brown-black archive wash, nocturne/archive/field-guide rationale for that banned palette, equal feature cards, fake numbers, div-based screenshots, generic names, decorative status dots, hero version labels, section-number eyebrows, scroll cues, duplicate CTA intent, CTA wrapping, logo-wall labels, prose-heavy hero stacks, and giant type without layout reason.
6. Check landing craft: image-first sections, varied rhythm, clear CTA path, no Blogspot structure, no repeated layout family, no compressed multi-section reference board.
7. Check APCA/WCAG contrast targets and OKLCH lightness repair for final palette.
8. Check interface-feel basics: active/focus states, loading/empty/error states, perceived performance, and no dead surfaces.
9. Check motion only when it has a purpose and reduced-motion behavior.

Final response contract:

- design read
- direction gate pass/fail
- palette exploration pass/fail
- preflight pass/fail
- OKLCH/APCA pass/fail
- interface-feel pass/fail
- score caps triggered
- required fixes before build/final handoff
- screenshot/evidence status
- remaining weaknesses
