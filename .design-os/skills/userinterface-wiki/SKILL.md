---
name: userinterface-wiki
description: Use for broad UI/UX craft review when typography, visual design, UX laws, pseudo-elements, audio feedback, predictive prefetching, animation principles, exit animations, container animation, or interaction quality need routeable guidance.
---

# User Interface Wiki

This is a broad UI craft skill. It does not replace specialist skills.

## Routing

- Animation planning: use `skills/motion-craft-director/SKILL.md`, then this skill for broader context.
- Animation code review: use `skills/review-animations/SKILL.md` as source of truth.
- Palette/contrast: use `skills/oklch-contrast-palette/SKILL.md`.
- Visual art direction: use `skills/frontend-art-director-review/SKILL.md`.
- Dead/stiff interface polish: use `skills/make-interfaces-feel-better/SKILL.md`.

## Files To Read

- `design-intelligence/userinterface-wiki-rules.json`
- `design-intelligence/userinterface-wiki-guidance.md`
- `design-intelligence/navigation-pattern-guidance.md` when navigation composition matters
- `evaluation/ui-scorecard.md`

## Output Contract

```md
## UI Wiki Review
- categories used:
- strongest applicable rules:
- anti-patterns found:
- routed specialist skills:
- required fixes:
- score caps:
```

## Categories

- animation principles
- timing functions
- exit animations
- CSS pseudo-elements
- audio feedback
- sound synthesis
- morphing icons
- container animation
- laws of UX
- predictive prefetching
- typography
- visual design

## Review Questions

- Do pressable elements provide active feedback?
- Are hit targets comfortable for the platform?
- Does timing match frequency of use?
- Do exit animations preserve spatial/state continuity?
- Are pseudo-elements layered and semantic enough?
- Does audio have a visual equivalent and mute path?
- Is perceived performance improved without lying?
- Do typography choices support scanning, numbers, and hierarchy?
- Do visual grouping rules support proximity, similarity, and common region?
- Does navigation placement support the composition and interaction model?
- Are navigation active/focus states visible and understandable?
- Does navigation remain readable over every background and scroll state it crosses?
- For practical mobile product apps, does bottom nav use semantic icons plus readable labels?
- Do mobile modals/sheets fit the viewport, safe areas, and internal scrolling needs?
- Do selectable chips/tabs/items preserve selected state after tap?
- Do active bars, progress strips, or underlines overlap labels/content?
- Do add/create affordances look distinct from content cards?
- Are decorative orbital/radar/HUD circles absent unless functional?
- Are logo/app-name/initials chrome and decorative hairline separators justified rather than template habits?
- If advanced motion is requested, are page/section, image/media, typography, nav/menu, and micro-feedback layers planned?
- Does motion use named techniques instead of vague "smooth" movement?
- Is motion evidence captured or blocked honestly?

## Stop Conditions

- The UI has pressable surfaces with no feedback.
- High-frequency interactions are slowed by unnecessary animation.
- Audio feedback is added without mute or visual equivalent.
- Data/pricing/dashboard numbers lack tabular alignment.
- Pseudo-elements create inaccessible content or broken layering.
- Advanced motion requested but only one animation exists.
- Navigation becomes unreadable over images, giant type, or changing backgrounds.
- Decorative circular/orbital/HUD overlays are used as fake atmosphere.
- Forced brand chrome or decorative separator hairlines appear without functional justification.
- Mobile sheet/modal is cut off or hides primary actions.
- Practical mobile product bottom nav lacks icons plus labels.
- Selectable controls do not preserve selected state.
- Add/create action is styled like normal content.
- Control indicator overlaps label/content.

## Audit Upgrade: Self-Correction Contract

Audit fix: Act as a router/reference, not a broad catch-all.

Required evidence:
- categories used, specialist skills routed, strongest applicable rules, and what this skill intentionally does not own.

Repair routing:
- creative-orchestration-director reroutes broad findings to narrower specialists.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "userinterface-wiki"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
