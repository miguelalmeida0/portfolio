# Evidence-Backed Critique Prompt

Work in:
`{{PROJECT_PATH}}`

Target:
`{{TARGET}}`

Design mode:
`{{MODE}}`

User goal:
`{{USER_GOAL}}`

Evidence:
`{{SCREENSHOTS_OR_URL}}`

Use `skills/evidence-backed-critique/SKILL.md`.

Steps:

1. Resolve the target screen/app/component.
2. Inspect screenshots, browser, and source evidence when available.
3. Run Assessment A: design-director review.
4. Run Assessment B: deterministic evidence review.
5. If no sub-agent/task tool exists, start the report with `⚠️ DEGRADED: single-context (<reason>)`.
6. Synthesize into `templates/reports/evidence-backed-critique-report.md`.
7. Score Nielsen heuristics 0-4 each.
8. Assess cognitive load.
9. Select persona red flags.
10. List 3-5 priority issues with concrete fixes.
11. Save a snapshot with `tools/critique-storage.mjs` when possible.
12. Ask only targeted next questions grounded in findings.

Do not use this prompt for Fast Direction Gate.
