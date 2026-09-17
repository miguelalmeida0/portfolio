---
name: creative-session-state-manager
description: Maintain the evolving creative session state for Design OS work: brief facts, Migi approvals, rejected directions, selected direction, open risks, artifact graph, required gates, and next actions. Use at the start of nontrivial design/frontend work, after user feedback, after direction selection, after failed reviews, and before resuming a partially completed run.
---

# Creative Session State Manager

Use this skill to prevent agents from forgetting the live creative context.

## Required Output

Create or update:

- `docs/design/creative-session-state.md`
- `docs/design/creative-session-state.json`

## State Model

Track:

- current user goal
- product/concept read
- selected direction and approval status
- Migi-liked elements to preserve
- Migi-rejected elements to avoid
- protected folders and explicit constraints
- active skills and required gates
- artifact graph: specs, reports, screenshots, prompts, tools, manifests
- unresolved risks and blockers
- next action with reason
- evidence provenance for every strong claim

## Hard Rules

- Do not replace specific user feedback with vague taste summaries.
- Preserve distinction between rejected concept and rejected execution.
- Treat screenshots, reports, and Migi comments as higher authority than agent self-report.
- Never mark approval inferred if Migi explicitly asked to stop, document only, or not implement.
- If state conflicts with current user message, current user message wins and state must record the change.

## Composition

Use before:

- `skill-orchestration-planner`
- `visual-spec-compiler`
- `failure-memory-retrieval-router`
- `creative-prototype-spike-director`

Use after:

- direction selection
- screenshot review
- failed validation
- Migi critique
- postmortem ingestion

## Quality Bar

The state file should let a fresh agent resume without rereading the whole thread and without losing the creative intent.

## Audit Upgrade: Self-Correction Contract

Audit fix: Persist creative decisions so agents stop rediscovering the same context.

Required evidence:
- active direction, references, rejected motifs, open risks, owner skill, and next evidence gate.

Repair routing:
- failure-memory-retrieval-router owns repeated mistakes; creative-orchestration-director owns open repairs.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "creative-session-state-manager"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
