---
name: evidence-backed-critique
description: Full post-build UI critique mode that combines design-director judgment, screenshot/browser evidence, Nielsen scoring, cognitive load, persona red flags, priority issues, and persisted critique snapshots.
---

# Evidence-Backed Critique

Use when Migi asks to critique a finished UI, uploads screenshots for review, a dogfood app reaches final state, a UI feels wrong but the issue is unclear, or post-build quality scoring is needed.

Do not use during Fast Direction Gate, first direction options, implementation coding, or quick small fixes unless Migi explicitly asks for critique.

## Files To Read

- `agent-workflows/evidence-backed-critique-workflow.md`
- `templates/reports/evidence-backed-critique-report.md`
- `evaluation/ui-scorecard.md`
- relevant Design OS rules for the active mode

## Inputs

- target app/page/component
- screenshot(s) or browser URL if available
- design mode
- user goal
- relevant Design OS rules
- previous critique snapshot if available

## Method

Run two assessments:

1. Design director review: visual thesis, hierarchy, composition, typography, palette/domain fit, navigation, interaction clarity, accessibility, states, copy, emotional fit, cognitive load, and Nielsen heuristics.
2. Evidence review: screenshots/browser evidence, layout overflow, collisions, dead/placebo navigation, contrast issues, responsive breakpoints, console/browser issues, and detector findings if available.

If sub-agents are available, isolate A and B before synthesis. If not, the report must start with:

`⚠️ DEGRADED: single-context (<reason>)`

Do not silently degrade.

## Required Output

- full critique report using `templates/reports/evidence-backed-critique-report.md`
- Nielsen score `/40`
- P0/P1/P2/P3 issue list
- cognitive load notes
- persona red flags
- concrete fixes
- next recommended Design OS actions
- saved snapshot if possible

## Persona Selection

- Desktop tools: Alex, Sam, Riley.
- Landing pages: Jordan, Riley, Casey.
- Mobile apps: Casey, Jordan, Sam.
- Dashboards/admin: Alex, Sam, Riley.

## Snapshot Persistence

Use `tools/critique-storage.mjs` when possible:

```bash
node tools/critique-storage.mjs slug "<target>"
node tools/critique-storage.mjs write <slug> <body-file>
node tools/critique-storage.mjs trend <slug> 5
```

## Stop Conditions

- Full critique silently degrades from dual assessment to single context.
- No heuristic scoring.
- No persona red flags.
- Priority issues are vague or lack concrete fixes.
- Screenshot/browser evidence is available but ignored.
- Placebo navigation or layout collision is found but not marked P0/P1.

## Visualization Evidence

When the target contains charts, graphs, diagrams, maps, timelines, floor plans, node graphs, pattern canvases, or spatial product objects, critique must include:

- whether the visualization answers a real user question
- whether chart/diagram labels, axes, values, units, legends, and tooltips are readable
- whether spatial labels have protected zones
- whether objects overlap or feel hand-placed
- whether selection changes visible details/inspector state
- whether color is the only encoding
- whether data/diagram hardening is needed

Route follow-up to `skills/chart-system-director/SKILL.md`, `skills/diagram-canvas-system/SKILL.md`, or `skills/data-viz-hardening-review/SKILL.md`.

When runnable spatial UI markup exists, include `tools/diagram-integrity-check.mjs` output in Assessment B or state why it was blocked.

## Audit Upgrade: Self-Correction Contract

Audit fix: Become the central critique memory loop.

Required evidence:
- screenshots/tools/references, Nielsen/cognitive/persona findings, score caps, skill verdicts, and repair queue.

Repair routing:
- creative-orchestration-director owns routing; specialist skills own repairs.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "evidence-backed-critique"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
