---
name: shape-quality-review
description: Review vector, SVG, shape-heavy, abstract-form, background-atmosphere, annotation, label, and illustration-heavy UI for roleless shapes, blobs, collision, weak hierarchy, and broken visual systems.
---

# Shape Quality Review

## Hard Rule

No shape may exist without role, layer, bounds, anchors, responsive behavior, and accessibility meaning or explicit decorative status.

## No Ambient Background Blobs

Do not use large vague background blobs, ghost ellipses, generic radial glows, random translucent ovals, fake lens shapes, or abstract atmosphere shapes unless they are the primary product object, part of the selected signature interaction, directly derived from an approved reference mechanic, or explicitly named in the shape inventory with role, layer, and purpose.

Score caps:

- visible generic background blob: max score 4
- generic dot/star field as atmosphere: max score 4
- atmosphere shape has no role/purpose: max score 4
- background decoration competes with primary content: max score 4
- "premium glow" with no reference justification: max score 5

## Annotation Protected Zone

Leader lines, annotation rules, stems, connectors, and decorative lines may never cross through label text. Every annotation must define anchor point, leader path, label box, protected label zone, collision fallback, and responsive fallback.

If a leader line cuts through text: max score 3. If annotation labels collide with art or other labels: max score 4.

## Review Output

- shape inventory
- failure table
- remove/keep/change recommendations
- score caps
- screenshot evidence requirement

## Audit Upgrade: Self-Correction Contract

Audit fix: Back shape critique with inventory tooling.

Required evidence:
- shape inventory, data-vector hooks, screenshot evidence, collision findings, and keep/remove/change table.

Repair routing:
- vector-form-system-director owns model repair; material-surface-director owns surface repair.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "shape-quality-review"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
