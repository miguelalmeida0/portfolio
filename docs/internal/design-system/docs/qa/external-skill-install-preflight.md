# External Skill Install Preflight

Date: 2026-07-02

Scope: safe install and ingestion pass for external UI skills.

## Baseline Commands

Commands run:

- `git branch --show-current`
- `git status --short`
- `node tools/design-os.mjs doctor`
- `node tools/design-os.mjs list-skills`

## Current Branch

`main`

## Git Status Summary

The working tree is dirty before external installation.

Summary from `git status --short`:

- many existing modified Design OS files from prior ingestion passes
- many existing untracked Design OS files from prior ingestion passes
- no deleted files reported

Important: continue carefully and do not silently overwrite existing Miguel Design OS skills.

## Doctor Result

`node tools/design-os.mjs doctor` passed.

## Current Skill List Summary

`node tools/design-os.mjs list-skills` passed and listed 23 skills.

Relevant existing skills before external install:

- `visual-concept-gate`
- `visual-target-reconstruction`
- `selection-first-products`
- `anti-ai-slop-review`
- `screenshot-scorecard-review`
- `frontend-art-director-review`
- `tailwind-migration-zero-regression`
- `truthful-state-product-naming`
- `data-visualization-selection`
- `visual-style-selection`
- `image-first-website-to-code`
- `visual-spec-compiler`
- `dashboard-graph-system`
- `landing-page-pattern-director`
- `image-first-frontend`
- `mobile-product-flow`
- `animation-vocabulary`
- `emil-design-engineering`
- `review-animations`
- `delight-opportunity-director`
- `motion-craft-director`
- `anti-ai-tell-preflight`
- `landing-page-craft-director`

## Conflict Scan

| Candidate | Current state | Conflict risk |
| --- | --- | --- |
| `animation-vocabulary` | `skills/animation-vocabulary/` exists | High: external install has same skill name. Preserve existing Miguel skill; archive external source separately if installed. |
| `emil-design-engineering` | `skills/emil-design-engineering/` exists | Medium: Emil source already distilled locally. |
| `review-animations` | `skills/review-animations/` exists | Medium: external UI wiki animation rules may overlap. |
| `motion-craft-director` | `skills/motion-craft-director/` exists | Medium: make-interfaces-feel-better may overlap with motion/polish rules. |
| `userinterface-wiki` | missing | Low: new routeable skill can be created. |
| `oklch-skill` | missing | Medium: integrate as Miguel-native `oklch-contrast-palette`, not raw external folder. |
| `oklch-contrast-palette` | missing | Low: new Miguel-native skill can be created. |
| `make-interfaces-feel-better` | missing | Low: new routeable polish skill can be created. |
| `visual-style-selection` | `skills/visual-style-selection/` exists | Medium: OKLCH/color guidance overlaps but should complement. |
| `anti-ai-tell-preflight` | `skills/anti-ai-tell-preflight/` exists | Medium: interface-feel rules overlap with final UI polish gates. |

## Preflight Decision

Proceed with installation attempts, but preserve both external raw sources and existing Miguel-native skills. Do not overwrite existing `skills/animation-vocabulary/`; if the installer writes a conflicting path, document the conflict and preserve the Miguel version.

Follow-up: installation attempts failed because `npx` could not resolve `registry.npmjs.org`. See `docs/qa/external-skill-install-log.md`.
