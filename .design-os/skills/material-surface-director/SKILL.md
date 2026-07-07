---
name: material-surface-director
description: Direct and review material, texture, fill, surface, atmosphere, grain, glass, paper, smoke, metal, ink, fabric, stone, liquid, and light treatments so they feel domain-specific rather than generic AI decoration.
---

# Material Surface Director

## No Ambient Background Blobs

Do not use large vague background blobs, ghost ellipses, generic radial glows, random translucent ovals, fake lens shapes, or abstract atmosphere shapes unless they are the primary product object, part of the selected signature interaction, directly derived from an approved reference mechanic, or explicitly named in the shape inventory with role, layer, and purpose.

Reject:

- vague light blob in the corner
- random huge transparent ellipse
- generic star/dot field
- abstract glow that exists only to make the page feel "premium"
- background shapes that compete with content
- background shapes that do not interact with anything
- decorative orbits/HUD lines

Allowed:

- subtle material-specific paper grain
- real photographic grain
- low-opacity scan texture
- ink speckle
- surface wear
- texture tied to domain material
- a purposeful mask/object used by the signature interaction

Score caps:

- visible generic background blob: max score 4
- generic dot/star field as atmosphere: max score 4
- "premium glow" with no reference justification: max score 5

## Audit Upgrade: Self-Correction Contract

Audit fix: Define implementable CSS/SVG material patterns, not just bans.

Required evidence:
- material role, domain fit, tokens, fill/stroke/filter pattern, performance and contrast risk.

Repair routing:
- oklch-contrast-palette owns contrast repair; shape-quality-review owns visual misuse.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "material-surface-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
