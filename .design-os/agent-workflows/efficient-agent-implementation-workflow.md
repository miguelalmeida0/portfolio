# Efficient Agent Implementation Workflow

Use this when coding after the visual spec and design-system direction are clear.

## Operating Rules

1. Read useful context first.
2. Batch file reads and searches.
3. Inspect before editing.
4. Prefer focused search/replace for small edits.
5. Use structured bulk file creation only for intentional scaffolds.
6. Debug with logs, screenshots, and errors before guessing.
7. Avoid monolithic files.
8. Keep components focused.
9. Do not overengineer.
10. Report concise proof.

## File Discipline

- components should have one job
- mock data belongs in data files and must be domain-specific, plausible, and tied to the Domain Content Contract
- shared tokens belong in theme/style files
- utility functions belong outside components
- avoid one giant page file when the screen has multiple meaningful zones

## Debug Discipline

Before changing code after a failure:

- read the error
- inspect the relevant file
- check logs if available
- reproduce visually if UI-related
- patch the smallest credible cause

## Handoff Proof

Report:

- files changed
- commands run
- screenshot or blocker
- interactions verified
- scorecard/done-report status
- remaining weaknesses
