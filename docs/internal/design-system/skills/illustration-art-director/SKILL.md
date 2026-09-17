---
name: illustration-art-director
description: Direct, plan, and review custom illustration systems before frontend implementation. Use for botanical, character, mascot, product-object, editorial SVG, hero illustration, custom SVG scene, field-guide, specimen, and illustration-heavy landing work where visual quality must be proven before full-page composition.
---

# Illustration Art Director

Use this skill before coding illustration-heavy work.

## Illustration-First Gate

For any illustration-heavy project, especially botanical, character, mascot, product object, editorial SVG, hero illustration, or custom SVG scene, first create isolated illustration assets before building the full page.

Required gate outputs:

- `docs/design/illustration-art-direction.md`
- `docs/design/illustration-style-guide.md`
- `docs/design/illustration-asset-options.md`
- at least 1 isolated hero illustration component or SVG
- `docs/qa/illustration-gate-review.md`

Stop after the illustration gate unless explicitly instructed to continue.

No full page implementation may begin if:

- illustration looks amateur
- illustration is made from primitive shapes with no detail system
- silhouette is weak
- linework is poor
- texture/material is generic
- reference grammar was not extracted
- Migi has not selected/approved an illustration direction when approval is required

## Botanical / Organic Illustration Minimum Bar

Botanical, animal, human, and organic illustrations are high-risk.

Before coding, require:

- reference grammar
- silhouette study
- linework strategy
- detail budget
- material/texture strategy
- simplification strategy
- what makes the subject believable

For botanical plates specifically, require stem structure, leaf/petal hierarchy, asymmetry, vein or line detail where appropriate, root/stem/petal relationship, botanical label/callout safe zones, and distinct species silhouettes.

Reject repeated ellipse leaves, generic petal flowers, flat doodle stems, childlike plant silhouettes, copy-paste leaves, and generic botanical icons scaled up as hero art.

## No Ambient Background Blobs

Reject large vague background blobs, ghost ellipses, generic radial glows, random translucent ovals, fake lens shapes, and abstract atmosphere unless they are the primary object, part of the selected signature interaction, derived from an approved reference mechanic, or named in the shape inventory with role, layer, and purpose.

## Native Tooltip Ban

No art-directed SVG may expose browser-native tooltips over the visual surface. Do not put `title` attributes or child `<title>` elements on inner SVG shapes. Use top-level SVG `<title>` and `<desc>` only for accessibility.

## Annotation Protected Zone

Leader lines, annotation rules, stems, connectors, and decorative lines may never cross through label text. Every annotation needs anchor point, leader path, label box, protected label zone, collision fallback, and responsive fallback.

## Score Caps

- full page built before illustration asset passes: max score 4
- hero illustration looks amateur: max score 4
- botanical/character/object illustration uses primitive ellipses/blobs: max score 4
- no isolated illustration review before full page: max score 5
- illustration-heavy project has no style guide: max score 5
- primitive botanical illustration: max score 4
- no species-specific silhouette: max score 5

## Audit Upgrade: Self-Correction Contract

Audit fix: Add examples and isolated asset-gate outputs before page build.

Required evidence:
- illustration brief, style guide, subject grammar, motif library, asset options, and what not to draw.

Repair routing:
- svg-illustration-system and illustration-quality-review own asset implementation and review.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "illustration-art-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
