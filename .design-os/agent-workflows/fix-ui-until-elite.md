# Workflow: Fix UI Until Elite

Use when iterating an existing UI until it clears the Design OS bar.

## Mandatory Start

1. Read `design-dna/00_COMPACT_AGENT_CONTEXT.md`.
2. Read `AGENTS.md` and route to the smallest matching skill set.
3. For UI quality fixes, load `skills/anti-ai-slop-review/SKILL.md` and `skills/screenshot-scorecard-review/SKILL.md`.
4. If the fix is visual-heavy or Migi rejected the direction, also load `skills/visual-concept-gate/SKILL.md`.
5. Read only the files listed by the selected skills before editing.
6. Classify the task: bug fix, technical refactor, copy/content edit, frontend QA, visual-heavy UI, new app, redesign, or selection/gallery/roster/product-discovery experience.
7. Inspect the current project type, framework, routes, components, styling system, and tokens.
8. If the fix is visual-heavy or Migi rejected the direction, run the Visual Concept Gate before editing.
9. Define or restate the project-specific visual identity.
10. Name any source-project evidence and what must not be copied literally.
11. Capture current screenshots as evidence; do not treat old captures as templates.
12. Score with `evaluation/ui-scorecard.md` before choosing fixes.

## Iteration Loop

1. Capture 390, 768, and 1440 px screenshots.
2. Run lightweight scripts when practical: horizontal scroll, overlap, and scale inflation.
3. Score with `evaluation/ui-scorecard.md`.
4. List blockers and the top 3 score-limiting defects.
5. If the blocker is art direction, stop polishing and produce 3 new theses for approval: safe expected, more original/art-directed, wild but controlled.
6. Build or patch the visual shell before feature depth.
7. Fix the highest-impact defect.
8. Run lint/build/tests where available.
9. Restart or refresh the app.
10. Recapture affected screenshots.
11. Rescore.
12. Repeat until score is 90+ with no blockers, or document the blocker.

## Fix Priority

Fix in this order:

1. layout breakage, overlap, clipping, blank primary states
2. unclear primary object or action
3. skipped Visual Concept Gate for visual-heavy work
4. same rejected layout with new paint
5. source-project palette/layout copying
6. clickable/passive ambiguity
7. responsive failures
8. missing component states
9. unsupported claims or fake data
10. vague copy
11. visual refinement and motion

## Constraints

- Do not repaint before fixing hierarchy.
- Do not repaint before fixing art direction.
- Do not keep a rejected structure and change only colors, scale, glow, spacing, cards, borders, or motion.
- Do not add containers to solve hierarchy.
- Do not add explanatory copy to solve poor layout.
- Do not add motion to hide weak state handling.
- Do not import In The Loop social patterns unless the product is social coordination.

## Done

Elite requires:

- score 90+
- no scorecard blockers
- Visual Concept Gate completed and approved when required
- screenshots at 390, 768, and 1440 px
- project-specific visual identity preserved
- no literal source-app copying
- final report includes approved rendered concept, files changed, screenshots, score, blockers fixed, remaining risks, and whether the UI was patched after review
