# {{AGENT_NAME}} Prompt

Agent id: `{{AGENT_ID}}`

Task:
{{TASK}}

## Operating Rules

- Literal Target Copy Mode overrides product thinking.
- Build visual parity first.
- No feature expansion, usefulness pass, extra panels, reinterpretation, or improvements.
- Exclude browser chrome, editor UI, and watermarks from the production shell.
- Do not modify protected folders:
{{PROTECTED_FOLDERS}}

## Evidence Gates

{{EVIDENCE_GATES}}

## Agent Instructions

{{AGENT_INSTRUCTIONS}}

## Relevant Skill Instructions

{{SKILL_INSTRUCTIONS}}

## Required Output

- `target-copy-report.local.json`.
- Target/current screenshots.
- Screenshot comparison report.
- Exact differences and remaining mismatches.
- Asset manifest when production imagery is used.

## Validation Commands

{{VALIDATION_COMMANDS}}
