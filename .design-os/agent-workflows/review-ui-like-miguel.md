# Workflow: Review UI Like Miguel

Use for UI critique, QA, or design review.

## Mandatory Start

1. Read `design-dna/00_COMPACT_AGENT_CONTEXT.md`.
2. Read `AGENTS.md` and route to the smallest matching skill set.
3. Run `node tools/design-os.mjs route --task "<task>"` when the CLI is available.
4. For existing UI review, load `skills/anti-ai-slop-review/SKILL.md`.
5. If screenshots exist or the UI can run, also load `skills/screenshot-scorecard-review/SKILL.md`.
6. If Migi asks for an elite redesign critique, also load `skills/frontend-art-director-review/SKILL.md`.
7. Read only the files listed by the selected skills before judging the UI.
8. Classify the task: bug fix, technical refactor, copy/content edit, frontend QA, visual-heavy UI, new app, redesign, or selection/gallery/roster/product-discovery experience.
9. Inspect the current project type, user, primary object, primary action, framework, and styling system.
10. If visual-heavy work was involved, verify the Visual Concept Gate happened before implementation and name the approved rendered concept.
11. If concept artifacts exist, run `node tools/design-os.mjs validate-concepts <concept-file>`.
12. If screenshot report artifacts exist, run `node tools/design-os.mjs validate-screenshot-report <report-file>`.
13. Define the project-specific visual identity from the product, not from a source app.
14. Identify any source-project evidence used and reject literal copying as a review goal; do not copy old apps literally.
15. Capture or request screenshots; old Design OS captures are evidence, not templates.
16. Score with `evaluation/ui-scorecard.md` before finishing.

## Evidence To Capture

Capture or inspect:

- 390 px mobile
- 768 px tablet
- 1440 px desktop
- current route or primary flow
- hover/focus/selected states when possible
- empty/loading/error states when present

If screenshots are unavailable, state the blocker and lower confidence.

## Review Checklist

Purpose:

- primary object visible in first viewport
- primary action attached to that object
- secondary content does not compete

Identity:

- visual identity fits current project type
- Visual Concept Gate was completed for visual-heavy work
- inspiration references were reconstructed by composition/focal object/hidden information, not flattened into style traits
- palette is not copied from a golden app
- app-specific evidence is marked as evidence only

Interaction:

- clickable/passive roles are distinct
- one primary action per zone
- focus, selected, disabled, and loading states exist

Composition:

- no container soup
- no generic dashboard unless Migi explicitly asked for a plain admin tool
- dashboard/command-center references must show one attraction zone, varied panel weights, useful chart forms, reference-driven palette, deliberate image/object/media roles when relevant, compact scale, mixed materials, and calm/busy rhythm
- no same-weight dashboard card soup, murky monochrome / terminal-green palette, single-accent overuse, text-and-metrics-only admin layout, terminal-ish dark panel spam, decorative charts, image-starved surfaces, or dead live/monitoring surfaces
- no same rejected layout with new paint
- no generic app layout replacing a strong reference composition
- no accidental overlap/collision
- desktop adds actionable context for tools/workspaces: inspector, preview, comparison, table density, or source rail
- mobile has no accidental horizontal scroll

Copy:

- labels use specific verbs
- helper copy changes a decision
- claims have source, recency, or visible basis

## Output

Lead with findings ordered by severity. Each finding includes:

- severity
- screenshot/file evidence
- violated Design OS rule
- concrete fix

Then include:

- skills used
- approved rendered concept, if applicable
- scorecard total and category scores
- whether Visual Concept Gate was required and completed
- blockers
- top 3 fixes
- verification gaps
- whether the UI was patched after review

Do not reward a UI for matching an old screenshot. Reward it for applying the right principle to the current product.
