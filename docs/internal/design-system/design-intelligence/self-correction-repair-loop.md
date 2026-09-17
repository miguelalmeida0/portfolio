# Self-Correction Repair Loop

Design OS should turn critique into fixes without waiting for Migi to restate the problem.

## Loop

1. Route specialist skills.
2. Produce the specialist artifact.
3. Capture evidence or write a blocked-evidence note.
4. Emit `templates/skill-verdict.template.json`.
5. Convert every blocker and score cap into a repair queue item.
6. Assign an owner skill and acceptance check.
7. Apply the repair.
8. Re-run the evidence gate that found the issue.
9. Close the task only when P0 repairs are resolved and residual risk is named.

## Repair Task Shape

Each repair task must include:

- priority: P0, P1, or P2
- owner skill
- target file, selector, component, artifact, or behavior
- concrete action
- acceptance check
- evidence command or screenshot needed to close it

## Verdict Status

- `pass`: output satisfies the skill contract and evidence exists.
- `needs-repair`: output is usable only after named repairs.
- `blocked`: required evidence or precondition is unavailable.
- `not-applicable`: skill was considered and intentionally skipped.

## Escalation

- Three repeated failures with the same root cause become a Design OS patch candidate.
- A score cap below 60 must create at least one P0 or P1 repair.
- A blocker without an owner skill is an orchestration failure.
- Evidence that contradicts self-report wins.
