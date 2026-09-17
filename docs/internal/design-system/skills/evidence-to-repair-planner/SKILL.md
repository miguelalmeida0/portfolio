---
name: evidence-to-repair-planner
description: Convert screenshots, detector reports, scorecard findings, critique notes, and user complaints into ordered repair tasks with cause hypotheses, patch strategy, file targets, verification commands, and acceptance criteria.
---

# Evidence To Repair Planner

Use this skill after any review, detector, screenshot, or Migi critique finds failures.

## Required Output

Create:

- `docs/qa/evidence-to-repair-plan.md`
- `docs/qa/evidence-to-repair-plan.json`

## Required Table

| Evidence | Failure Mode | Likely Cause | Repair Strategy | Target Files | Verification | Priority |
|---|---|---|---|---|---|---|

## Repair Model

For each issue, define:

- evidence source: screenshot path, report path, user quote, detector finding
- failure mode
- likely root cause
- smallest credible repair
- files or components likely involved
- verification command or screenshot proof
- acceptance criteria
- whether the fix should preserve concept, visual language, or interaction

## Hard Rules

- Screenshot contradiction beats self-report.
- Do not propose "polish" for structural layout failure.
- Do not broaden scope unless the failure class demands it.
- Do not mark fixed without verification.
- Preserve liked concept energy when execution is rejected.

## Priority

Order repairs:

1. P0 blockers: clipped text, inaccessible controls, broken navigation, app unusable
2. P1 concept-breaking visual failures
3. P2 craft and polish
4. P3 nice-to-have refinements

## Audit Upgrade: Self-Correction Contract

Audit fix: Translate evidence into executable repairs.

Required evidence:
- source evidence, finding, owner skill, target, action, acceptance check, and evidence rerun.

Repair routing:
- creative-orchestration-director prioritizes and sequences repair tasks.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "evidence-to-repair-planner"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
