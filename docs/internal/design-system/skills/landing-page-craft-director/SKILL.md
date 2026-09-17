---
name: landing-page-craft-director
description: Direct landing, portfolio, marketing, and redesign pages using Taste and imagegen rules. Use for landing pages, portfolios, marketing sites, premium hero pages, image-led product pages, or redesign visual passes that need section rhythm, concept spine, CTA path, image discipline, and anti-Blogspot craft.
---

# Landing Page Craft Director

Use for landing/portfolio/marketing pages. Do not use as the primary skill for dashboards or dense product apps.

## Files To Read

- `design-dna/brief-inference-rules.md`
- `design-dna/landing-page-craft-rules.md`
- `design-dna/art-directed-palette-exploration.md`
- `design-dna/unsplash-asset-sourcing-rules.md` when real photography is needed
- `design-intelligence/navigation-pattern-guidance.md`
- `design-intelligence/navigation-patterns.json`
- `design-dna/anti-ai-tell-preflight.md`
- `agent-workflows/image-first-frontend-workflow.md`
- `design-intelligence/landing-section-composition-library.json`

## Workflow

1. Declare the design read.
2. Set active dials.
3. If no direction is approved, create 3 directions and stop for Migi during the first pass.
4. When Migi selects A, B, C, or a hybrid, treat that as implementation approval unless Migi explicitly says planning-only/spec-only/no-code.
5. Create/update `docs/design/selected-direction.md` and continue immediately into visual spec, `docs/design/design-system-tokens.md`, `docs/design/color-and-contrast.md` or equivalent palette doc, `docs/qa/anti-ai-tell-preflight.md`, implementation, validation, and URL handoff when applicable.
6. Choose concept spine after direction selection.
7. Define section jobs.
8. For generated references, create one horizontal image per section.
9. For each section, choose composition anchor, background mode, image role, CTA variation, and second-read moment.
10. If real photography is needed, create `docs/design/unsplash-search-plan.md` and `docs/design/unsplash-asset-manifest.md` before implementation.
11. Create `docs/design/navigation-strategy.md`; landing, portfolio, and creative work requires 3 navigation concepts before selecting one.
12. Explore safe refined, artistic expressive, and unexpected high-character palettes.
13. Lock selected palette and typography across the page.
14. Vary section rhythm.
15. Remove decorative orbit/HUD circles, forced brand chrome, and decorative hairline ornaments unless documented as functional.
16. Run anti-AI-tell preflight before handoff.

## Required Page Strategy

- concept spine:
- section order:
- conversion path:
- hero composition:
- image usage priority:
- Unsplash/search plan when real images are needed:
- asset manifest:
- navigation strategy:
- selected navigation pattern:
- motion choreography plan when advanced/cinematic/portfolio motion is requested:
- palette lock:
- palette exploration:
- typography lock:
- CTA label system:
- section rhythm:
- anti-repetition plan:

## Stop Conditions

- generic left-text/right-image default
- no direction-options gate before an unapproved visual-heavy landing/portfolio build
- redundant implementation approval request after Migi already selected a direction
- no palette exploration for artistic/cinematic/portfolio/landing direction
- real photography needed but no search plan or asset manifest exists
- sourced images are generic filler, uncropped, uncredited, or missing alt text
- navigation uses a generic top bar without exploration
- navigation becomes unreadable over imagery, giant type, or scroll-state background changes
- forced app-name/logo/initials chrome appears without visual-spec justification
- decorative orbital/circular/HUD overlays appear as atmosphere
- decorative hairlines, red dividers, label rails, or separator ticks appear as filler
- all direction options use the same navbar
- nav competes with the hero scene or poster composition
- advanced motion is requested but no motion-choreography plan exists
- cinematic/portfolio motion is reduced to one background drift or fade-up everywhere
- repeated same-family sections
- Blogspot / content-template structure
- text-only page when images are needed
- unreadable generated references
- CTA path unclear

## Signature Interaction Gate

For artistic, brand, portfolio, experimental landing, playful product, and image-led sites, consult `skills/signature-interaction-director/SKILL.md` when references include memorable mechanics such as portal entry, scroll route choreography, mascot motion, scroll-assembled cards, editorial list modals, media constellations, directional page transitions, or playful entry gates.

Rules:
- Select one signature interaction before implementation, or explicitly justify why none is appropriate.
- Extract mechanics, not brand skin. Do not copy logos, mascots, names, colors, exact content, or proprietary media.
- Include the selected mechanic in the visual spec when chosen.
- Final review must check whether the signature mechanic is visible, meaningful, accessible, and supported by reduced motion.
- If no signature interaction appears after award-level references, final verdict cannot be "masterpiece."
- Generic section stack after signature references is a hard failure.

## Layout Integrity Gate

Landing-page craft fails if text is clipped, covered, or overflowing. Stickers, cards, badges, media, and art-directed overlays require protected text zones.

Before handoff, run `skills/layout-integrity-review/SKILL.md` after screenshot evidence exists.

Block if:

- card/sticker/image covers headline text
- large display type is clipped by viewport, mask, or container
- CTA/button text clips
- nav label overflows item
- nav creates huge empty space at a breakpoint
- page has huge accidental blank viewport space

## Elite Scroll Choreography Routing

When a landing, brand, portfolio, editorial, playful product, or video-first site depends on scroll as the experience, route to skills/elite-scroll-choreography-director/SKILL.md before implementation. The selected scroll pattern must appear in the visual spec, and skills/scroll-choreography-review/SKILL.md must run after implementation.

Block fade-only scroll when elite scroll was requested, pinned blank frames, moving objects covering critical text, horizontal routes without mobile fallback, scroll-to-assemble claims where objects do not visibly assemble, and scroll navigation that does not sync to chapters. Run layout-integrity review after scroll-choreography review.

## Audit Upgrade: Self-Correction Contract

Audit fix: Delegate overlapping landing decisions to pattern, interaction, image, and evidence skills.

Required evidence:
- section job map, rhythm map, CTA path, reference anchors, and selected companion skills.

Repair routing:
- landing-page-pattern-director, signature-interaction-director, image-first-frontend, and anti-ai-tell-preflight own specific repairs.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "landing-page-craft-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.

## Small-Screen Nav Clarity Requirement

For every visual/product/landing/mobile page with navigation, the agent must define:

- desktop nav variant
- tablet nav variant
- mobile/compact nav variant
- label/icon behavior
- active state behavior
- accessible labels
- hit target sizes
- overflow behavior

Compact nav must use icons or a real menu pattern. Two-letter abbreviations are not a design system.

Review requirement:

- screenshot-scorecard-review must inspect compact nav at 768 and 390
- layout-integrity-review must flag abbreviation fallback as a failure
- final-scorecard cannot pass if compact nav looks clipped, cryptic, or broken

## Final UI Integrity Gate Requirement

Before final handoff, run final-ui-integrity-gate.

The agent must not claim success if:

- clipped text remains
- overlap remains
- nav overflow remains
- media/text collision remains
- accidental blank space remains
- the user's original complaint remains true

The final review order must be:

1. build/lint
2. screenshot capture
3. scroll-choreography-review if scroll-heavy
4. layout-integrity-review
5. final-ui-integrity-gate
6. final-scorecard
