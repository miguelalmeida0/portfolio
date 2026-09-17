---
name: landing-page-pattern-director
description: Select and enforce landing page patterns for artistic, poster, image-led, conversion, product-demo, trust, storytelling, and premium marketing pages. Use when building or reviewing landing pages, hero sections, marketing sites, product pages, brand pages, or pages that risk becoming generic Blogspot/SaaS section stacks.
---

# Landing Page Pattern Director

Use for landing pages, hero pages, marketing pages, product pages, portfolio/editorial pages, and premium website sections.

## Files To Read

- `design-intelligence/landing-pattern-guidance.md`
- `design-intelligence/landing-patterns.json`
- `design-intelligence/landing-section-composition-library.json`
- `design-dna/landing-page-craft-rules.md`
- `design-dna/anti-ai-tell-preflight.md`
- `skills/image-first-website-to-code/SKILL.md` when image-first references apply
- `skills/landing-page-craft-director/SKILL.md` when landing/portfolio craft is central
- `design-dna/layout-recipes.md`

## Workflow

1. Select landing pattern: poster, product demo, conversion, storytelling, trust, or hybrid.
2. If Migi asked for artistic/creative/cinematic/image-led, use poster logic first.
3. Define hero architecture.
4. Define section rhythm beyond the hero.
5. Define copy density and CTA strategy.
6. Define image role and contrast protection.
7. Reject generic section stacking.
8. For generated references, require one horizontal image per section.
9. Run anti-AI-tell preflight before implementation and handoff.

## Output

Include in `docs/design/visual-spec.md`:

- selected landing pattern
- hero architecture
- image role
- section rhythm
- copy density
- CTA strategy
- visual rhythm after hero
- forbidden Blogspot/SaaS drift
- anti-AI-tell plan
- section job, composition anchor, background mode, CTA variation, and image role per section

## Stop Conditions

- artistic landing page becomes normal SaaS grid
- hero is artistic but rest is generic
- image used as filler
- page is text-heavy despite image-led references
- no image-first analysis when references are available
- generated references are compressed into one unreadable board
- anti-AI-tell preflight is skipped

## Signature Interaction Gate

For artistic, brand, portfolio, experimental landing, playful product, and image-led sites, consult `skills/signature-interaction-director/SKILL.md` when references include memorable mechanics such as portal entry, scroll route choreography, mascot motion, scroll-assembled cards, editorial list modals, media constellations, directional page transitions, or playful entry gates.

Rules:
- Select one signature interaction before implementation, or explicitly justify why none is appropriate.
- Extract mechanics, not brand skin. Do not copy logos, mascots, names, colors, exact content, or proprietary media.
- Include the selected mechanic in the visual spec when chosen.
- Final review must check whether the signature mechanic is visible, meaningful, accessible, and supported by reduced motion.
- If no signature interaction appears after award-level references, final verdict cannot be "masterpiece."
- Generic section stack after signature references is a hard failure.

## Elite Scroll Choreography Routing

When a landing, brand, portfolio, editorial, playful product, or video-first site depends on scroll as the experience, route to skills/elite-scroll-choreography-director/SKILL.md before implementation. The selected scroll pattern must appear in the visual spec, and skills/scroll-choreography-review/SKILL.md must run after implementation.

Block fade-only scroll when elite scroll was requested, pinned blank frames, moving objects covering critical text, horizontal routes without mobile fallback, scroll-to-assemble claims where objects do not visibly assemble, and scroll navigation that does not sync to chapters. Run layout-integrity review after scroll-choreography review.

## Audit Upgrade: Self-Correction Contract

Audit fix: Require evidence-backed pattern selection instead of pattern vibes.

Required evidence:
- selected pattern ID, rejected patterns, reference examples, section obligations, and score caps.

Repair routing:
- landing-page-craft-director owns rhythm repairs; screenshot-scorecard-review owns evidence.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "landing-page-pattern-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
