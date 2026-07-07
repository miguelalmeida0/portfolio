# tailwind-migration-zero-regression

## Name

tailwind-migration-zero-regression

## Description

Migration playbook for Tailwind or global CSS work where the goal is visual parity, not redesign.

## Use When

- Migrating CSS to Tailwind.
- Refactoring global CSS.
- Replacing ad hoc styles with utility classes.
- Consolidating styling primitives.
- Cleaning Tailwind config or theme tokens.

## Do Not Use When

- The user asks for a redesign.
- The task is visual concept exploration.
- The existing UI is intentionally being changed.
- The change is unrelated to CSS or Tailwind.

## Required Inputs

- Current screenshots or visual baseline.
- Files being migrated.
- Existing styling ownership.
- Tailwind config and global CSS.
- Acceptance criteria for parity.

## Files To Read

- `design-dna/00_COMPACT_AGENT_CONTEXT.md`
- `rules/design-tokens.md`
- `rules/components.md`
- Current project's Tailwind config and global CSS files
- `evaluation/ui-scorecard.md` for screenshot proof expectations

## Workflow

1. State that this is a migration, not a redesign.
2. Capture or inspect the pre-change visual baseline when possible.
3. Preserve visual parity unless Migi explicitly approves a visual change.
4. Avoid turning global CSS into a dumping ground.
5. Keep one-off styling near the local owner component.
6. Create semantic primitives only when a pattern is truly reused.
7. Do not rename or reshape components just to suit Tailwind.
8. Capture or inspect post-change screenshots.
9. Compare before/after for regression at `390 / 768 / 1440` when possible.

## Stop Conditions

- Stop if the migration changes the design direction.
- Stop if no visual baseline exists and the UI can run.
- Stop if global CSS grows with one-off component styling.
- Stop if parity cannot be verified.

## Output Contract

```md
Migration scope:
Visual changes intended: yes/no
Baseline evidence:
Files changed:
Global CSS changes:
Local owner styling:
Semantic primitives added:
Parity result:
Remaining regression risk:
```

## Scorecard Blockers

- Redesign disguised as migration: prevents completion.
- No screenshot proof when UI can run: max score 8.
- Visual regression in primary flow: prevents elite.
- Clickable/passive ambiguity introduced: max score 7.
- Overlap/collision introduced: max score 6.

## Safety/Scope Rules

- Do not use Tailwind migration to sneak in redesign.
- Do not add external dependencies.
- Do not delete styling without proving no visual regression.
- Do not touch unrelated product logic.

## Audit Upgrade: Self-Correction Contract

Audit fix: Keep narrow utility value with visual parity proof.

Required evidence:
- before/after screenshots, class mapping, changed files, build result, and zero-regression checklist.

Repair routing:
- screenshot-scorecard-review owns visual parity failures.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "tailwind-migration-zero-regression"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
