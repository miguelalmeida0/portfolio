# Workflow: Generate New App

Use when building a new app, screen, or frontend feature.

## Mandatory Start

1. Read `design-dna/00_COMPACT_AGENT_CONTEXT.md`.
2. Read `AGENTS.md` and route to the smallest matching skill set.
3. Run `node tools/design-os.mjs route --task "<task>"` when the CLI is available.
4. For new or visual-heavy work, load `skills/visual-concept-gate/SKILL.md`.
5. If references exist, also load `skills/visual-target-reconstruction/SKILL.md`.
6. If the product is selection-first, also load `skills/selection-first-products/SKILL.md`.
7. Read only the files listed by the selected skills before touching UI code.
8. Classify the task: bug fix, technical refactor, copy/content edit, frontend QA, visual-heavy UI, new app, redesign, or selection/gallery/roster/product-discovery experience.
9. Inspect the current project type, framework, routes, components, styling system, and tokens.
10. If visual-heavy, create and validate the brief: `node tools/design-os.mjs new-brief` then `node tools/design-os.mjs validate-brief design-brief.local.json`.
11. If visual-heavy, produce 3 rendered concepts with preview routes and `1440 / 768 / 390` screenshot files, then validate them: `node tools/design-os.mjs validate-concepts visual-concepts.local.json`.
12. If visual-heavy, show Migi the rendered concepts, wait for approval, set `approvalStatus: "approved"` and `selectedConceptId`, then run `node tools/design-os.mjs check-visual-gate design-brief.local.json visual-concepts.local.json` before implementation.
13. Define a project-specific visual identity before choosing palette or layout.
14. Name any golden project used as evidence and what will not be copied.
15. Plan screenshots as evidence for the new work, not templates from old apps.
16. Plan to run `evaluation/ui-scorecard.md` before finishing.

## Design Intent Record

Write this before implementation:

```md
Project type:
Task classification:
Primary user:
Primary object:
Primary action:
Visual-heavy work?:
Inspiration/reference provided?:
Selected skill/playbook:
Archetype:
Layout recipe:
Visual identity words:
Visual Concept Gate status:
Approved rendered concept:
Concept preview screenshots:
Density:
Token direction:
Component contracts:
States:
Responsive risks:
Screenshot targets:
Score target:
```

## Visual Concept Gate

Run this gate for visual-heavy UI, new apps, redesigns, selection/gallery/roster/product-discovery experiences, and any work with inspiration images.

Do not code first.

Produce exactly 3 rendered visual concepts:

1. Safe expected direction.
2. More original/art-directed direction.
3. Wild but controlled direction.

Each concept includes a preview route, screenshots at 1440 / 768 / 390 when possible, visual metaphor, first-screen composition, focal object, interaction concept, typography/scale direction, color/material direction, emotional hook, hidden information, absent elements, why it avoids obvious app/theme cliches, why it creates desire, 1440 / 768 / 390 behavior, and what would make it fail.

Stop and wait for Migi's approval after he reviews the visuals. Implement only the approved direction. Text-only concepts do not satisfy the gate. No visual screenshots = Visual Concept Gate failed.

If references are provided, analyze composition, focal object, hidden information, emotional hook, material, texture, interaction model, and intentional absence. Do not reduce references to dark, neon, cards, glass, glow, big text, or gradients.

When references materially drive the work, store them under `docs/inspiration/[project]/` and create or update `docs/inspiration-analysis.md`.

Save the 3 concepts as `visual-concepts.local.json` or a project-scoped equivalent and validate them with `node tools/design-os.mjs validate-concepts`.

## Implementation Order

1. Reuse existing framework and local component patterns.
2. Build the approved visual shell/poster composition before feature depth.
3. Add or map semantic tokens.
4. Build the primary object and primary action.
5. Add secondary context only after the main path works.
6. Implement states: empty, loading, error, disabled, selected, focus-visible.
7. Make clickable/passive roles distinct in code and visuals.
8. Add responsive behavior for 390, 768, and 1440 px.
9. Add product-specific copy and assets only when they identify the subject, show the product/object, explain state, or help inspection.
10. Add product logic only after the visual shell works.

## Verification

1. Run available lint/build/tests.
2. Start the app if possible.
3. Capture 390, 768, and 1440 px screenshots.
4. Run `scripts/check-horizontal-scroll.mjs`, `scripts/check-overlap.mjs`, and `scripts/check-scale-inflation.mjs` when practical.
5. Inspect for Design OS blockers.
6. Score with `evaluation/ui-scorecard.md`.
7. Fix blockers and recapture changed screens.

## Delivery

Report:

- skills used
- design brief path
- visual concepts path
- design intent record summary
- approved rendered concept
- key files changed
- screenshot files
- scorecard result
- blockers fixed
- remaining weaknesses
- whether the UI was patched after review

Do not claim the UI is Miguel-aligned without screenshot evidence and a score.
