---
name: artifact-contract-validator
description: Validate that required Design OS artifacts, specs, reports, screenshots, manifests, proof captures, and gate outputs exist and are semantically consistent before implementation or final handoff.
---

# Artifact Contract Validator

Use this skill when a run claims readiness, completion, or handoff.

## Required Output

Create:

- `docs/qa/artifact-contract-report.md`
- `docs/qa/artifact-contract-report.json`

## Required Checks

- required files exist for the active mode
- required screenshots or blocked reasons exist
- selected direction matches implementation claim
- visual spec references active constraints
- review reports match available evidence
- score caps are applied before final praise
- protected folders were not modified
- known user complaints are resolved or explicitly still blocked

## Tooling

Run when practical:

```sh
node tools/artifact-contract-validator.mjs --mode <mode> --out docs/qa/artifact-contract-report.json
```

## Hard Rules

- Do not accept paperwork that contradicts screenshots.
- Do not mark complete if a required gate is missing.
- Do not treat file existence as semantic completion.
- Do not hide unresolved blockers in "remaining weaknesses" if they block handoff.

## Verdict

- `Pass`: required artifacts exist and agree with evidence.
- `Partial`: nonblocking gaps remain.
- `Block`: missing gate, missing proof, contradictory evidence, or unresolved P0.

## Audit Upgrade: Self-Correction Contract

Audit fix: Make artifacts enforceable instead of aspirational.

Required evidence:
- artifact path, expected schema/template, validation command, pass/fail output, and missing field list.

Repair routing:
- creative-orchestration-director routes failed artifacts back to the producing skill.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "artifact-contract-validator"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
