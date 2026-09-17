---
name: skill-orchestration-planner
description: Select and sequence the smallest sufficient set of Design OS skills as a gate-aware DAG for a task. Use when work is nontrivial, visual-heavy, multi-phase, high-risk, or when many specialist skills could apply and an agent needs a precise execution route.
---

# Skill Orchestration Planner

Use this skill to turn the Design OS skill library into an execution system.

## Required Output

Create:

- `docs/design/skill-orchestration-plan.md`
- `docs/design/skill-orchestration-plan.json`

## Plan Model

Each step must include:

- skill id
- purpose in this run
- required inputs
- required outputs
- gate type: `pre-build`, `build`, `post-build`, `repair`, `final`
- stop condition
- downstream dependencies
- evidence required

## Required Reasoning

- Classify the task mode.
- Identify high-risk failure classes from the brief and prior Design OS memory.
- Choose only the skills that change the outcome.
- Put foundation gates before implementation.
- Put evidence/review gates after screenshots or runnable proof.
- Add repair loops when a detector or review can fail.

## Hard Bans

- Do not load the whole skill library by default.
- Do not run post-build reviews during direction selection.
- Do not skip layout, state, or artifact validation for visual-heavy implementation.
- Do not use broad review skills as substitutes for specialist gates.

## Default Post-Build Order

1. `screenshot-scorecard-review`
2. `layout-integrity-review`
3. interaction verification
4. `text-clarity-review`
5. `production-hardening-review`
6. `anti-ai-slop-review`
7. `artifact-contract-validator`
8. final scorecard

## Audit Upgrade: Self-Correction Contract

Audit fix: Plan skill chains before loading too much context.

Required evidence:
- candidate skills, chosen order, skipped skills, artifacts, and phase exits.

Repair routing:
- creative-orchestration-director owns runtime repair loop and verdict closure.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "skill-orchestration-planner"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
