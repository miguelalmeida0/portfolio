---
name: reference-grammar-compiler
description: Compile visual references into transferable design grammar: composition, density, typography, color, material, motion, interaction mechanics, responsive behavior, and anti-copy constraints. Use before reference-led implementation, redesign, landing, portfolio, editorial, or art-directed work.
---

# Reference Grammar Compiler

Use this skill to extract mechanics instead of copying skin.

## Required Output

Create:

- `docs/design/reference-grammar.md`
- `docs/design/reference-grammar.json`

## Grammar Fields

For each reference:

- source path or URL
- role: composition, typography, material, interaction, motion, density, image treatment, navigation
- transferable principles
- non-transferable brand skin
- composition grammar
- scale and density grammar
- typography grammar
- color/material grammar
- interaction grammar
- motion grammar
- responsive grammar
- "must not copy" list

## Hard Rules

- Extract mechanics, not logos, brand names, mascots, copy, proprietary media, or exact colors.
- Include rejected references when relevant and mark them as anti-grammar.
- Do not reduce references to mood words.
- Do not start implementation until the target grammar has buildable rules.

## Composition

Pairs with:

- `visual-target-reconstruction`
- `signature-interaction-director`
- `visual-style-selection`
- `failure-memory-retrieval-router`

## Audit Upgrade: Self-Correction Contract

Audit fix: Compile references into transferable grammar, not mood summaries.

Required evidence:
- reference anchors, composition/motion/material/type grammar, allowed moves, banned moves, and implementation translation.

Repair routing:
- visual-target-reconstruction or image-first-frontend owns build translation.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "reference-grammar-compiler"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
