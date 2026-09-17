---
name: illustration-quality-review
description: Review custom illustration, SVG scenes, botanical plates, character/mascot art, product-object illustration, editorial visuals, and hero illustration for professional quality before full-page build or final handoff.
---

# Illustration Quality Review

## Required Evidence

- isolated illustration asset or component
- style guide
- reference grammar
- screenshot or rendered proof when possible
- accessibility/decorative status

## Illustration-First Gate

Fail the review if an illustration-heavy full page was built before isolated hero illustration proof. Stop after the gate unless Migi explicitly approves continuing.

Score caps:

- full page built before illustration asset passes: max score 4
- no isolated illustration review before full page: max score 5
- illustration-heavy project has no style guide: max score 5

## Botanical / Organic Illustration Minimum Bar

Fail primitive organic art. Botanical plates require stem structure, leaf/petal hierarchy, asymmetry, vein or line detail where appropriate, root/stem/petal relationship, botanical label/callout safe zones, and distinct species silhouettes.

Score caps:

- primitive botanical illustration: max score 4
- repeated ellipse leaves as hero art: max score 4
- no species-specific silhouette: max score 5
- no reference grammar: max score 5

## Native Tooltip Ban

No art-directed SVG may expose browser-native tooltips over the visual surface. Child SVG `title` attributes or child `<title>` elements fail unless intentionally interactive and approved.

If a browser-native tooltip appears in screenshot review: max score 4.

## Annotation Protected Zone

Leader lines, annotation rules, stems, connectors, and decorative lines may never cross through label text. Every annotation must define anchor point, leader path, label box, protected label zone, collision fallback, and responsive fallback.

If a leader line cuts through text: max score 3. If labels collide with art or other labels: max score 4.

## No Ambient Background Blobs

Reject vague background blobs, ghost ellipses, generic radial glows, random translucent ovals, fake lens shapes, generic dot/star fields, and decorative orbits unless they are purposeful, named, and reference-justified.

## Audit Upgrade: Self-Correction Contract

Audit fix: Use professional quality rubric and reference grammar.

Required evidence:
- reference grammar, isolated asset screenshot, silhouette/material/anatomy/accessibility findings, and final verdict.

Repair routing:
- illustration-art-director owns concept repair; svg-illustration-system owns SVG repair.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "illustration-quality-review"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
