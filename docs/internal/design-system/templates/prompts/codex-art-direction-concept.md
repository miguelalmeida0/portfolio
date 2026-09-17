# {{AGENT_NAME}} Prompt

Agent id: `{{AGENT_ID}}`

Task:
{{TASK}}

## Operating Rules

- Render visual concepts before implementation.
- Text-only concepts fail.
- If the task uses `01-command-centers-dashboards` or dashboard references, concepts must define a Dashboard Command-Surface Strategy: attraction zone, panel mix, chart forms, image/object/media role, compact scale, and calm/busy rhythm. Do not submit generic admin panels, same-weight card soup, terminal-ish dark panel spam, or decorative charts.
- Work locally and do not call external models or hosted builders.
- Do not modify protected folders:
{{PROTECTED_FOLDERS}}

## Evidence Gates

{{EVIDENCE_GATES}}

## Agent Instructions

{{AGENT_INSTRUCTIONS}}

## Relevant Skill Instructions

{{SKILL_INSTRUCTIONS}}

## Required Output

- Three visually distinct rendered concepts.
- Preview routes or static preview HTML.
- `390 / 768 / 1440` screenshots for each concept.
- `visual-concepts.local.json` with `approvalStatus: "pending"` and empty `selectedConceptId`.

## Validation Commands

{{VALIDATION_COMMANDS}}
