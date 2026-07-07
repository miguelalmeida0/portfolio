# Codex OKLCH Palette Pass Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Selected mode:
OKLCH / APCA Palette Pass

Required files to read:

- `AGENTS.md`
- `design-dna/oklch-contrast-and-palette-rules.md`
- `design-dna/design-system-first-rules.md`
- `skills/oklch-contrast-palette/SKILL.md`
- `design-intelligence/contrast-thresholds.json`
- `design-intelligence/oklch-palette-generation.json`
- `evaluation/ui-scorecard.md`

Review target:
`{{FILES_OR_TOKENS}}`

Requirements:

1. Identify semantic color tokens.
2. Check APCA targets: normal text `Lc 60`, large text `Lc 45`, UI components `Lc 30`.
3. Check WCAG 2 targets when formal compliance is claimed.
4. Repair contrast through OKLCH lightness, not chroma/saturation.
5. Flag HSL ramp hue drift above `10deg`.
6. Confirm numeric palette scale and dark-mode token mapping.
7. Preserve reference/product palette intent while fixing contrast.

Final response contract:

- tokens reviewed
- APCA/WCAG issues
- OKLCH repairs
- hue drift risk
- dark-mode mapping
- score caps triggered
- remaining manual checks
