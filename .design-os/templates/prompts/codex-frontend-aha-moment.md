# Codex Frontend Aha Moment Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Selected mode:
Frontend Aha Moment

Active dials:
`{{ACTIVE_DIALS}}`

Required files to read:

- `agent-workflows/frontend-aha-moment-workflow.md`
- `agent-workflows/efficient-agent-implementation-workflow.md`
- `skills/visual-spec-compiler/SKILL.md`
- `skills/domain-realism-mock-data-director/SKILL.md`
- `skills/anti-ai-tell-preflight/SKILL.md` for landing, portfolio, marketing, or redesign work
- `skills/motion-craft-director/SKILL.md` when motion is planned
- `skills/delight-opportunity-director/SKILL.md` when delight is planned
- `design-dna/brief-inference-rules.md`
- `design-dna/art-directed-palette-exploration.md` for artistic, cinematic, landing, portfolio, creative, editorial, or experimental work
- `design-dna/anti-ai-tell-preflight.md`
- `design-dna/motion-and-delight-rules.md`
- `design-dna/design-system-first-rules.md`

Before coding:

1. Declare the design read for visual-heavy or marketing/redesign work.
2. If this is new visual-heavy work and no direction is approved, create `docs/design/direction-options.md` with Direction A Safe Refined, Direction B Artistic Expressive, and Direction C Unexpected High-Character. Stop for Migi to choose.
3. After Migi chooses A, B, C, or a hybrid, create `docs/design/selected-direction.md`.
4. Route `skills/domain-realism-mock-data-director/SKILL.md` and define the Domain Content Contract.
5. Create `docs/design/visual-spec.md` with a Direction Gate Summary and Domain Content Contract.
5. For artistic, cinematic, landing, portfolio, creative, editorial, or experimental work, include Palette Exploration with Safe Refined, Artistic Expressive, and Unexpected High-Character palette options.
6. Define domain-specific local/mock data file path.
7. Define the core frontend loop.
8. Define which interactions must work locally.
9. Run Taste anti-AI-tell preflight when landing/portfolio/marketing/redesign work is involved.
10. Define motion and delight strategy when planned.
11. State what backend would replace later.

Implementation order:

1. design-system tokens
2. visual shell
3. mock data file
4. core local loop
5. working visible interactions
6. screenshot QA

Rules:

- mock data is allowed but truthful
- mock data must be domain-specific and plausible for the business
- mock data must not be buried in components
- no random `mission control`, `topology`, `traces`, abstract metrics, or generic app sections without a real domain/data contract
- no backend unless Migi requested it
- no dead visible buttons
- no coding before Migi selects a visual direction when the direction gate applies
- no safe AI-default muddy palette for expressive modes without palette exploration
- no Taste preflight failures before visual handoff
- no motion without purpose, frequency fit, and reduced-motion behavior
- delight must not delay or hide the core loop
- exported/generated artifacts should be deterministic when possible

Final response contract:

- files changed
- design read / Taste preflight status where applicable
- direction options / selected direction where applicable
- palette exploration where applicable
- mock data location
- Domain Content Contract status
- interactions verified
- backend not added unless requested
- motion/delight status where applicable
- screenshots or blocker
- scorecard/done report
