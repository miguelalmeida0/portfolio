---
name: visual-style-selection
description: Select and constrain a visual style direction from a large style taxonomy for frontend, mobile, dashboard, landing page, creative, portfolio, BI, SaaS, consumer, and image-led UI work. Use when Codex needs to choose a style category, reject mismatched aesthetics, define design tokens, avoid random AI palette/style mixing, or translate visual-library references into an implementation-ready style system.
---

# Visual Style Selection

Use this skill when the task needs a deliberate visual style choice rather than default web-app styling.

## Files To Read

- `skills/visual-style-selection/references/style-taxonomy.md`
- `templates/visual-style-selection-report.template.md`

## Operating Rule

Do not pick a style by vibe alone. Select a style only after checking:

- product type
- audience
- task density
- reference folder mode
- accessibility risk
- performance risk
- mobile behavior
- conversion/product goal
- implementation complexity
- Migi's rejected directions

## Workflow

1. Identify the product mode: dashboard, landing/poster, creative/experimental, mobile product flow, selection/gallery, marketing, portfolio, BI/analytics, or utility.
2. Inspect relevant visual-library references.
3. Choose one primary style family and up to one supporting accent style.
4. Name styles explicitly rejected for this product.
5. Extract tokens: background, surface, text, muted text, accent, state colors, radius, shadow, border, motion, spacing, and type mood.
6. Define style constraints: what can vary and what cannot.
7. Check accessibility/performance/mobile fit.
8. Fill `templates/visual-style-selection-report.template.md` before visual-heavy implementation.

## Style Discipline

- One primary style is the spine. Do not mash five aesthetics together.
- Style must serve product clarity, not decorate around weak structure.
- If a style has low contrast risk, fix contrast before implementation.
- If a style has performance risk, simplify effects or choose a lighter style.
- If references are dashboard-heavy, style must still preserve density, chart clarity, and layout integrity.
- If references are landing/artistic, style must support image-led composition, sparse copy, and poster logic.
- If references are mobile, style must preserve thumb-safe, readable flow.

## Required Output

Report:

- selected style category
- source/reference evidence
- product fit
- do-not-use warnings
- token set
- effects/motion rules
- accessibility risks and mitigations
- performance risks and mitigations
- mobile behavior
- implementation checklist
- scorecard risks

## Stop Conditions

Stop and choose again when:

- style conflicts with product purpose
- style is selected only because it looks cool
- style worsens readability
- style creates AI scale inflation
- style creates machine-generated palette
- style encourages generic SaaS/admin layout when references require stronger art direction
- implementation mixes incompatible style systems without a clear hierarchy

## Audit Upgrade: Self-Correction Contract

Audit fix: Bind style choice to approved and rejected reference memory.

Required evidence:
- style family, approved anchors, rejected anchors, token/effect limits, accessibility/performance fit.

Repair routing:
- frontend-art-director-review and anti-ai-slop-review own style drift repairs.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "visual-style-selection"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
