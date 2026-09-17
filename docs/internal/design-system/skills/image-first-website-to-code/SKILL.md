---
name: image-first-website-to-code
description: Image-first website and landing-page implementation workflow for visually important web tasks, especially premium landing pages, marketing sites, editorial brand pages, portfolio sites, product pages, hero sections, multi-section websites, and redesigns. Use when Codex should generate or use visual section references first, deeply analyze them, then implement a faithful frontend without drifting into generic coded layouts.
---

# Image-First Website To Code

Use this skill for visually important websites, landing pages, hero sections, marketing pages, product pages, editorial brand pages, portfolios, and premium multi-section sites.

## Files To Read

- `skills/image-first-website-to-code/references/image-first-workflow.md`
- `templates/image-first-website-analysis.template.md`

## Core Directive

Visual website work should not begin as freeform coding when image generation or strong visual references are available.

Preferred order:

1. Generate or select visual section references.
2. Deeply analyze those references.
3. Implement the frontend as a translation layer.
4. Screenshot QA the implementation.

## Codex-Specific Rule

When generating references inside Codex, prefer large, readable, section-specific images instead of one compressed website board.

- 1 section: 1 image.
- 4 sections: 4 images.
- 8 sections: 8 images when reasonable.
- Complex/unclear section: add an extraction/detail image.

Do not crop old images to create section references. Generate a fresh standalone section/detail image when clarity is needed.

## Implementation Discipline

- The image/reference is the source of truth.
- Code must preserve layout logic, type mood, spacing, component style, palette, image treatment, and section rhythm.
- Do not simplify distinctive references into generic stacked sections.
- Do not add nested card prisons, fake technical pills, or micro-label clutter.
- Hero sections must stay clean, readable, and visible on small laptop viewports.
- If a generated section image is unclear, regenerate or request a clearer section reference before guessing.

## Required Analysis

Before coding, extract:

- readable text
- section purpose
- visual priority
- typography relationships
- spacing relationships
- component and button logic
- color/material logic
- image/media treatment
- grid/alignment behavior
- section rhythm
- details that are unclear

## Stop Conditions

Stop before coding when:

- no image/reference exists and visual quality is central
- section reference is too compressed to inspect
- text/buttons/components are unreadable in the reference
- implementation starts from generic templates instead of reference analysis
- hero becomes cluttered
- sections repeat the same layout without reference support
- coded result drifts from the visual references

## Audit Upgrade: Self-Correction Contract

Audit fix: Clarify its boundary with image-first frontend and landing craft.

Required evidence:
- section-by-section reference extraction, implementation mapping, asset/crop proof, and landing companion route.

Repair routing:
- image-first-frontend owns reference fidelity; landing-page-craft-director owns rhythm and CTA repairs.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "image-first-website-to-code"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
