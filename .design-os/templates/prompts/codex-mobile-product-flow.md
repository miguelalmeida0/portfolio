# Codex Mobile Product Flow Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Selected mode:
Mobile Product Flow Mode

Active dials:

- MOBILE_NATIVE_FEEL: `{{MOBILE_NATIVE_FEEL}}`
- VISUAL_DENSITY: `{{VISUAL_DENSITY}}`
- MOTION_INTENSITY: `{{MOTION_INTENSITY}}`
- ART_DIRECTION: `{{ART_DIRECTION}}`
- IMPLEMENTATION_CLARITY: `{{IMPLEMENTATION_CLARITY}}`

Required files to read:

- `skills/mobile-product-flow/SKILL.md`
- `skills/visual-spec-compiler/SKILL.md`
- `design-dna/design-generation-dials.md`
- `design-dna/design-system-first-rules.md`
- `design-dna/mobile-product-rules.md`
- `design-dna/art-directed-palette-exploration.md` for expressive mobile app direction
- `docs/design/mobile-flow-spec.md`
- `visual-library/README.md`

Reference anchors:
`{{REFERENCE_ANCHORS}}`

Before coding:

1. If this is a new visual-heavy mobile app and no direction is approved, create `docs/design/direction-options.md` with Direction A Safe Refined, Direction B Artistic Expressive, and Direction C Unexpected High-Character. Stop for Migi to choose.
2. After Migi chooses A, B, C, or a hybrid, create `docs/design/selected-direction.md`.
3. Create `docs/design/visual-spec.md` with a Direction Gate Summary.
4. Create or fill `docs/design/mobile-flow-spec.md`.
5. Define screen sequence and mobile core loop.
6. Define safe areas, thumb zones, nav, gestures, and touch targets.
7. Define design-system tokens for mobile surfaces and controls.
8. If the selected mobile direction is artistic/creative/experimental, document palette exploration and contrast risk.
9. Define modal/sheet fit strategy: max-height, internal scroll, action placement, safe-area bottom, close behavior, and relationship to bottom nav.
10. Define bottom nav icon + label strategy: destination labels, icon family, icon per destination, active state, badges/counters, touch targets, and safe-area handling.
11. Define selection state strategy for chips/tabs/object selectors: selected, hover, pressed, focus, disabled, persistence behavior, accessibility attributes, and local state source.
12. Define add/create action differentiation: where the action lives, how it differs from content cards, plus/icon affordance, label, interaction, and confusion risk.
13. Define control decoration collision check: active indicators, underlines/progress strips, label safe zones, and fallback state treatment.

Hard bans:

- cut-off mobile sheets or modals
- primary sheet actions hidden below viewport
- active bars, progress strips, or underlines overlapping labels
- selectable chips/items without persistent selected state
- text-only bottom nav in practical mobile product flows unless explicitly justified
- add-new cards styled like content cards
- badges/counters overlapping nav icons or labels
- generic mobile template behavior

Implementation order:

1. 390-first shell and navigation.
2. Core mobile loop.
3. Local interactions.
4. Tablet/desktop adaptation only after mobile works.
5. Screenshot QA.

Evidence requirements:

- 390 screenshot
- no scaled-down website behavior
- nav readable and touch-safe
- bottom nav icons plus labels for practical product apps
- modal/sheet fit and safe-area behavior
- selection state persistence
- add/create affordance differentiation
- control indicators do not overlap labels
- interactions work locally
- direction gate honored when applicable

Final response contract:

- mobile flow plan
- visual spec
- direction options / selected direction where applicable
- palette exploration where applicable
- modal/sheet fit strategy
- bottom nav icon + label strategy
- selection state strategy
- add/create action differentiation
- control decoration collision check
- files changed
- interactions verified
- screenshots or blocker
- scorecard/done report
