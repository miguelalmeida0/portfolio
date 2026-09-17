# Codex Contrast Review Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Selected mode:
Contrast / Legibility Review

Required files to read:

- `design-dna/oklch-contrast-and-palette-rules.md`
- `skills/oklch-contrast-palette/SKILL.md`
- `evaluation/ui-scorecard.md`

Review scope:
`{{SCREENS_OR_COMPONENTS}}`

Check:

- important text over flat backgrounds
- important text over image/gradient/video/texture
- small labels and metadata
- CTA and navigation contrast
- chart labels and state colors
- focus rings and UI component contrast
- 1440 / 768 / 390 responsive contrast risks

Rules:

- Important text must never rely on hope.
- Use scrims, plates, masks, vignettes, safe zones, or text outside imagery.
- Use APCA as the preferred contrast model.
- Use WCAG 2 when claiming formal compliance.
- Repair color pairs with OKLCH lightness.

Final response contract:

- pass/fail
- contrast blockers
- APCA/WCAG target notes
- image/text protection notes
- exact fixes required
- screenshot evidence or blocker
