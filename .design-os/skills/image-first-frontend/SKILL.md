---
name: image-first-frontend
description: Build visual-heavy frontend work from image or section references first, with deep extraction of typography, spacing, component logic, colors, image roles, and anti-drift implementation. Use for image-to-code, screenshots, generated visual references, premium websites, landing pages, artistic UI, or any frontend where visual references are the design source of truth.
---

# Image-First Frontend

Use when visual references or generated images should drive implementation.

## Files To Read

- `skills/image-first-website-to-code/SKILL.md`
- `agent-workflows/image-first-frontend-workflow.md`
- `templates/image-first-website-analysis.template.md`
- `design-dna/design-system-first-rules.md`
- `design-dna/art-directed-palette-exploration.md` for artistic/landing/portfolio/cinematic/experimental work
- `design-dna/unsplash-asset-sourcing-rules.md` when real imagery or Unsplash assets are needed
- `design-intelligence/navigation-pattern-guidance.md` when navigation affects composition
- `design-dna/landing-page-craft-rules.md` for landing/marketing/portfolio work
- `design-dna/anti-ai-tell-preflight.md` for landing/marketing/portfolio work

## Workflow

1. Select or generate visual references.
2. Prefer section-specific references over compressed boards.
3. For generated landing references, use one horizontal image per section.
4. Analyze text, type, spacing, buttons, colors, images, layout, and unclear details.
5. If no visual direction is approved, create `docs/design/direction-options.md` with 3 distinct directions and stop for Migi during the first pass.
6. When Migi selects A, B, C, or a hybrid, treat that as implementation approval unless Migi explicitly says planning-only/spec-only/no-code.
7. After selection, create `docs/design/selected-direction.md` and continue immediately into the build pipeline.
8. Create `docs/design/design-system-tokens.md` from the references and selected direction.
9. For expressive modes, explore safe refined, artistic expressive, and unexpected high-character palettes before locking tokens.
10. Create `docs/design/color-and-contrast.md` or an equivalent palette doc for significant visual work.
11. If real imagery is needed, route `skills/unsplash-asset-sourcing/SKILL.md`, create `docs/design/unsplash-search-plan.md`, and create `docs/design/unsplash-asset-manifest.md`.
12. If navigation is present, create `docs/design/navigation-strategy.md`; propose 3 navigation concepts and select a pattern before implementation.
13. For landing/portfolio/marketing, define section jobs, composition anchors, background modes, CTA variations, and `docs/qa/anti-ai-tell-preflight.md`.
14. If advanced/cinematic/portfolio motion is requested, create `docs/design/motion-choreography-plan.md` before implementation.
15. Remove decorative orbital/radar/HUD line overlays, forced brand chrome, and decorative hairline ornaments unless the visual spec documents functional meaning.
16. Implement faithful visual shell first.
17. Add interactions only after shell is coherent.
18. Screenshot compare and score.

## Output

Create or update:

- `docs/design/image-first-website-analysis.md` for websites/landing pages
- `docs/design/visual-spec.md` for general visual-heavy work
- `docs/design/unsplash-search-plan.md` when Unsplash or real image sourcing is used
- `docs/design/unsplash-asset-manifest.md` when Unsplash images are selected
- `docs/design/navigation-strategy.md` when navigation is present
- `docs/design/motion-choreography-plan.md` when advanced/cinematic/portfolio motion is requested

## Stop Conditions

- no readable reference
- reference is too compressed
- direction gate applies but direction options or selected direction are missing
- agent asks for implementation permission after Migi already selected A, B, C, or a hybrid
- expressive mode uses a safe AI-default palette with no exploration
- real imagery is needed but no Unsplash/source plan exists
- navigation defaults to a generic top bar without exploration
- navigation overlays image/type/scroll-state backgrounds without readability protection
- visible logo/app-name/initials chrome appears without visual-spec justification
- decorative circular/orbital/radar/HUD overlays appear as atmosphere
- decorative separator hairlines, red lines, label rails, or ticks appear as filler
- nav competes with image-led composition or is pasted over the hero
- major sourced image has no manifest entry, source metadata, alt text, crop strategy, or text safe-zone notes
- selected imagery is generic stock filler or misleading product proof
- implementation starts from generic components
- image/text balance drifts
- fake micro-UI clutter appears
- landing references compress multiple sections into one unreadable board
- anti-AI-tell preflight is skipped for landing/portfolio/marketing work
- advanced motion is requested but the page only has one animation, repeated fade-up, or no section motion map
- motion is central but no motion benchmark/evidence plan exists
- no screenshot proof

## Elite Scroll Choreography Routing

When a landing, brand, portfolio, editorial, playful product, or video-first site depends on scroll as the experience, route to skills/elite-scroll-choreography-director/SKILL.md before implementation. The selected scroll pattern must appear in the visual spec, and skills/scroll-choreography-review/SKILL.md must run after implementation.

Block fade-only scroll when elite scroll was requested, pinned blank frames, moving objects covering critical text, horizontal routes without mobile fallback, scroll-to-assemble claims where objects do not visibly assemble, and scroll navigation that does not sync to chapters. Run layout-integrity review after scroll-choreography review.

## Audit Upgrade: Self-Correction Contract

Audit fix: Strengthen provenance, crop, and reference drift verification.

Required evidence:
- asset manifest, crop safe zones, section reference mapping, current screenshots, and drift notes.

Repair routing:
- unsplash-asset-sourcing owns provenance; screenshot-scorecard-review owns crop/readability proof.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "image-first-frontend"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
