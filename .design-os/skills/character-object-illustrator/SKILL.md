---
name: character-object-illustrator
description: Plan and review believable character, mascot, product-object, botanical, animal, human, and organic illustrations with silhouette, linework, detail, material, and simplification strategy before implementation.
---

# Character Object Illustrator

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

Reject:

- leaves made only from repeated ellipses
- flowers made only from generic petals
- flat doodle stems
- childlike plant silhouettes
- repeated copy-paste leaves
- generic "botanical" icons scaled up as hero art

Score caps:

- primitive botanical illustration: max score 4
- repeated ellipse leaves as hero art: max score 4
- no species-specific silhouette: max score 5
- no reference grammar: max score 5

## Illustration-First Gate

For hero illustration or custom SVG scene work, create isolated asset options and stop for review before full-page implementation.

## Audit Upgrade: Self-Correction Contract

Audit fix: Add construction grammar for believable subjects.

Required evidence:
- silhouette, proportion, pose/object axes, detail budget, simplification, variants, and animation potential.

Repair routing:
- illustration-quality-review owns anatomy/object silhouette rejection.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "character-object-illustrator"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
