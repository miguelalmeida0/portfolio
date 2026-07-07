# {{AGENT_NAME}} Prompt

Agent id: `{{AGENT_ID}}`

Task:
{{TASK}}

## Operating Rules

- Work locally.
- No paid tools, API keys, hosted Lovable, screenshot-to-code generation, Onlook hosted usage, or external model calls.
- Do not modify protected folders:
{{PROTECTED_FOLDERS}}

## Evidence Gates

{{EVIDENCE_GATES}}

## Agent Instructions

{{AGENT_INSTRUCTIONS}}

## Relevant Skill Instructions

{{SKILL_INSTRUCTIONS}}

## Required Output

- `inspiration-queue.local.json` when collecting a queue.
- `inspiration-manifest.local.json` when references are selected.
- Source URLs, attribution notes, and local-only screenshot paths when captured.
- Top references, composition patterns, and anti-patterns.

## Validation Commands

{{VALIDATION_COMMANDS}}
