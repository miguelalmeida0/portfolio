---
name: responsive-constraint-solver
description: Define breakpoint contracts and responsive behavior before implementation for layouts, navigation, hero type, cards, stickers, overlays, charts, canvases, and media-heavy compositions.
---

# Responsive Constraint Solver

Use this skill before building responsive UI and whenever text/container/nav failures are likely.

## Required Output

Create:

- `docs/design/responsive-constraint-contract.md`
- `docs/design/responsive-constraint-contract.json`

## Required Breakpoints

- 1440
- 1280
- 1024
- 768
- 390

## Contract Fields

For each major object:

- object id
- role
- desktop behavior
- tablet behavior
- mobile behavior
- min/max size
- wrapping/collapse/hide/switch rules
- protected text zones
- overflow strategy
- interaction state impact
- screenshot proof requirement

## Hard Rules

- Navigation must define desktop, tablet, and mobile variants.
- Dynamic labels need a text-fit strategy.
- Active/selected states may not change dimensions unpredictably.
- Stickers, cards, badges, and overlays may not overlap protected text zones.
- Large display type needs crop, wrap, scale, and safe-zone rules.
- Fixed heights for text-heavy containers require proof.

## Output Quality

A developer should be able to implement responsive behavior from the contract without guessing what happens at intermediate widths.

## Audit Upgrade: Self-Correction Contract

Audit fix: Solve responsive constraints before layout collapse.

Required evidence:
- breakpoint model, container constraints, text-fit risks, nav behavior, and 390/768/1440 proof.

Repair routing:
- layout-integrity-review owns post-build verification.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "responsive-constraint-solver"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
