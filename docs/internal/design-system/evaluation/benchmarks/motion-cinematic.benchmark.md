# Motion Cinematic Benchmark

## Purpose

Test whether motion feels award-level, choreographed, and concept-specific rather than like a static page with one animation sprinkled on top.

## Gold References

- `visual-library/approved/inspiration/advanced-motion-sites/`
- `visual-library/approved/inspiration/navigation-art-direction/`
- `visual-library/approved/inspiration/05-landing-hero-pages/` when present
- `visual-library/approved/inspiration/02-creative-experimental-ui/` when present

## Rejected References

- `visual-library/rejected/`
- `visual-library/case-studies/`

## Gold Reference Mechanics

- pinned scroll scenes
- reel/menu overlays
- image-as-canvas reveals
- kinetic typography
- section handoffs
- navigation choreography
- progress/status motion when meaningful
- behind-the-scenes media sequences
- horizontal or pinned gallery motion
- reduced-motion fallback that preserves meaning

## Rejected Motion Mechanics

- one background drift
- fade-up everywhere
- random hover scaling
- `transition: all`
- no reduced motion
- motion unrelated to concept
- motion that blocks reading
- janky scroll effects
- static page after advanced motion was requested
- copied reference motion with no adaptation to product concept

## Required Design OS Skills

- `skills/animation-vocabulary/SKILL.md`
- `skills/advanced-motion-choreography/SKILL.md`
- `skills/motion-craft-director/SKILL.md`
- `skills/review-animations/SKILL.md`
- `skills/make-interfaces-feel-better/SKILL.md`
- `skills/screenshot-scorecard-review/SKILL.md`

## Required Prompt Template

- `templates/prompts/codex-advanced-motion-choreography.md`
- `templates/prompts/codex-motion-benchmark-review.md`

## Screenshot Evidence Required

- 1440
- 1024
- 768
- 390
- motion screenshot sequence when possible via `node tools/capture-motion-sequence.mjs --url <url> --name <name>`
- `docs/design/motion-choreography-plan.md`
- `docs/qa/motion-review.md`

## Scoring Criteria

- motion concept
- motion hierarchy
- section choreography
- image/media choreography
- typography choreography
- navigation/menu choreography
- performance
- accessibility
- mobile behavior
- implementation craft
- evidence quality

## Hard Failure Signs

- Advanced motion requested but only one animation exists.
- No motion-choreography plan.
- No reduced-motion behavior.
- No section-by-section motion map.
- Same fade-up pattern used everywhere.
- Motion cannot be named technically.
- Motion creates layout shift, scroll jank, or unreadable content.
- No evidence or documented capture blocker.

## Elite Scroll Choreography Addendum

When scroll is central to this benchmark, also score against evaluation/benchmarks/elite-scroll-choreography.benchmark.md. Require a selected scroll pattern, route map, chapter map, mobile fallback, reduced-motion fallback, and post-build scroll-choreography-review. Fade-only sections, blank pinned frames, movement covering critical text, and horizontal routes without mobile fallback are hard failures.
