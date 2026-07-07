# {{AGENT_NAME}} Prompt

Agent id: `{{AGENT_ID}}`

Task:
{{TASK}}

## Operating Rules

- Build/lint is not visual QA.
- Screenshot evidence is required.
- Block fake done reports.
- For dashboard/command-center work, block generic admin templates, same-weight card soup, no attraction zone, decorative charts, terminal-ish dark panel spam, and oversized low-density dashboards.
- Do not modify protected folders:
{{PROTECTED_FOLDERS}}

## Evidence Gates

{{EVIDENCE_GATES}}

## Agent Instructions

{{AGENT_INSTRUCTIONS}}

## Relevant Skill Instructions

{{SKILL_INSTRUCTIONS}}

## Required Output

- Visual QA run folder under `docs/qa-runs/`.
- Screenshots at `390 / 768 / 1440`.
- Button/link inventory and potential dead-button inventory.
- Manual checklist fields for overlap, buttons, artifacts, crop, and object swap.
- Updated `done-report.local.json`.

## Validation Commands

{{VALIDATION_COMMANDS}}
