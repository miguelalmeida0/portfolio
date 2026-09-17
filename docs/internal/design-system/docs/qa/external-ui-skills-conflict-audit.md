# External UI Skills Conflict Audit

Date: 2026-07-02

Scope: overlaps between requested external UI skills and existing Miguel Design OS skills.

## Summary

The requested external skills overlap with Miguel's existing Taste, Emil, motion, art-direction, and anti-slop layers. The safe approach is not to overwrite existing skills. Instead, this pass adds narrow Miguel-native skills and source-of-truth routing.

## Conflict Matrix

| Area | Conflict or complement? | Preferred routing order | Source of truth | Recommended future cleanup |
| --- | --- | --- | --- | --- |
| external `animation-vocabulary` vs existing `skills/animation-vocabulary/` | Conflict in name, complement in examples | Use existing Miguel skill; add missing example mappings | `skills/animation-vocabulary/SKILL.md` | After successful install, compare upstream glossary and merge only useful terms. |
| `review-animations` vs `userinterface-wiki` animation rules | Complement | Motion code review -> `review-animations`; broad animation principles -> `userinterface-wiki`; planning -> `motion-craft-director` | `skills/review-animations/STANDARDS.md` for approval thresholds | Keep code-review standards separate from broad UI wiki notes. |
| `motion-craft-director` vs `make-interfaces-feel-better` | Complement | Plan motion with `motion-craft-director`; polish dead/stiff UI with `make-interfaces-feel-better`; approve code with `review-animations` | `motion-craft-director` for strategy, `make-interfaces-feel-better` for final polish | Avoid turning the polish skill into a second motion-planning skill. |
| `oklch-contrast-palette` vs existing color guidance | Complement with stronger authority | Use `visual-style-selection` for style family; use `oklch-contrast-palette` for token contrast, palette scales, and repair | `design-dna/oklch-contrast-and-palette-rules.md` for color science | Fold duplicate high-level color advice into OKLCH docs later if needed. |
| `userinterface-wiki` vs `frontend-art-director-review` | Complement | Art direction/taste -> `frontend-art-director-review`; broad UI mechanics -> `userinterface-wiki` | `frontend-art-director-review` for visual thesis; `userinterface-wiki` for UI craft mechanics | Keep UI wiki routeable by category to avoid a generic giant review blob. |
| `anti-ai-slop-review` vs `anti-ai-tell-preflight` | Complement | Existing UI/product slop -> `anti-ai-slop-review`; landing/portfolio/marketing final tells -> `anti-ai-tell-preflight` | Both, depending on mode | Keep Taste preflight focused on landing/marketing and AI tells. |

## Routing Decision

- `oklch-contrast-palette`: source of truth for contrast, OKLCH palette scales, dark mode mapping, hue drift, and color repair.
- `userinterface-wiki`: broad UI craft router for typography, pseudo-elements, UX laws, audio feedback, predictive prefetching, and visual design mechanics.
- `make-interfaces-feel-better`: post-implementation polish pass before screenshot-scorecard review.
- `animation-vocabulary`: naming/specification only, not implementation or approval.

## Do Not Merge Yet

Do not delete or merge existing Emil/Taste/motion skills. The new skills are additive and routeable. A future cleanup pass can deduplicate language after successful upstream raw archives are available.
