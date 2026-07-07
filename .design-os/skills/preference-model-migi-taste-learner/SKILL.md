---
name: preference-model-migi-taste-learner
description: Maintain a Migi-specific preference model from explicit feedback, approved references, rejected failures, palette bans, interaction preferences, and concept-preservation notes. Use after Migi critique, approvals, direction selections, rejected outputs, and postmortems.
---

# Preference Model / Migi Taste Learner

Use this skill to make Design OS remember Migi's taste without turning every preference into a universal law.

## Required Output

Create or update:

- `docs/design/migi-preference-model.md`
- `docs/design/migi-preference-model.json`

When the preference should become durable Design OS memory, propose patches to:

- `design-dna/rejected-directions.md`
- `design-dna/anti-patterns.md`
- `visual-library/README.md`

## Preference Fields

- preference statement
- polarity: likes / dislikes / conditional
- confidence
- scope: global / mode-specific / project-specific
- evidence quote or artifact
- examples
- counterexamples
- recommended enforcement
- expiry or revisit condition

## Hard Rules

- Do not infer global taste from one weak signal.
- Preserve nuance: "concept liked, execution rejected" is not a rejection of the concept.
- Distinguish Migi preference from accessibility, usability, or objective layout failure.
- Cite evidence for every durable preference.
- Do not overwrite explicit newer feedback with older memory.

## Output Quality

The preference model should let future agents feel like they remember Migi without becoming rigid or repetitive.

## Audit Upgrade: Self-Correction Contract

Audit fix: Convert Migi preferences into reusable, conflict-aware memory.

Required evidence:
- preference source, confidence, scope, examples, counterexamples, and routing implication.

Repair routing:
- failure-memory-retrieval-router applies preference memory; visual-style-selection resolves conflicts.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "preference-model-migi-taste-learner"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
