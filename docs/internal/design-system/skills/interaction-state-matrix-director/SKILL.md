---
name: interaction-state-matrix-director
description: Specify and review interactive component states across default, hover, focus-visible, active, selected, selected+hover, selected+focus, disabled, loading, error, empty, and responsive variants before implementation and final QA.
---

# Interaction State Matrix Director

Use this skill when UI has nav, tabs, chips, buttons, cards, stickers, selection states, drawers, modals, forms, or any stateful interaction.

## Required Output

Create:

- `docs/design/interaction-state-matrix.md`
- `docs/design/interaction-state-matrix.json`

## Matrix Fields

For each interactive object:

- object id
- role
- default
- hover
- focus-visible
- active/pressed
- selected
- selected+hover
- selected+focus
- disabled
- loading
- error/empty if relevant
- keyboard behavior
- accessible name
- contrast/readability proof
- layout shift risk
- responsive variant

## Hard Rules

- Selected+hover and selected+focus must be readable.
- Active state may not clip labels or change dimensions unpredictably.
- Hidden visual labels must preserve accessible names.
- Focus states must be visible and not ugly afterthoughts.
- Interaction states may not cover protected text zones.
- Do not ship placebo navigation: selected state must change visible state, route, scope, filter, or content.

## Composition

Pairs with:

- `layout-integrity-review`
- `make-interfaces-feel-better`
- `text-clarity-review`
- `production-hardening-review`

## Audit Upgrade: Self-Correction Contract

Audit fix: Make every interactive state auditable.

Required evidence:
- state matrix for default/hover/focus/active/selected/disabled/combined states and screenshot proof.

Repair routing:
- make-interfaces-feel-better owns feedback polish; oklch-contrast-palette owns contrast repairs.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "interaction-state-matrix-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
