# Postmortem Ingestion Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Use:
`docs/qa/dogfood-postmortem.template.md`

Mission:
Convert a dogfood failure into the correct Miguel Design OS update without overgeneralizing one project failure into a universal rule.

Required inputs:

- dogfood target project
- screenshots reviewed
- benchmark used
- prompt used
- rules under test
- observed failures
- current app patch needs

Output:

1. Project-specific notes.
2. Design OS global rules only if the failure is repeatable/system-level.
3. Benchmark updates if the screenshot should become gold/rejected/neither.
4. Scorecard caps if the failure should block future work.
5. Prompt template fixes if the agent drifted because instructions were weak.
6. Skill routing fixes if the right specialist was skipped.

Rules:

- Do not patch Design OS just because one app has a bug.
- Do not create duplicate screenshot libraries.
- Reference existing `visual-library` assets only.
- If the failure is execution-only, patch the target app prompt or QA checklist, not global taste.
- If the failure repeats across dogfood targets, propose a global rule.
