---
name: make-interfaces-feel-better
description: Use after visual spec, design-system tokens, and main layout exist when the UI is functionally present but feels stiff, dead, generic, unresponsive, or under-polished. Focuses on invisible details, feedback, perceived performance, states, spacing, and micro-polish before screenshot review.
---

# Make Interfaces Feel Better

This is a polish pass, not an art-direction replacement.

## Use After

- `docs/design/visual-spec.md` exists for visual-heavy work
- design-system tokens exist
- the main layout/shell exists
- visible interactions mostly work

## Use Before

- final screenshot-scorecard review
- done report validation
- claiming visual quality

## Files To Read

- `design-dna/interface-feel-rules.md`
- `design-intelligence/interface-feel-checklist.json`
- `design-dna/design-system-first-rules.md`
- `design-intelligence/navigation-pattern-guidance.md` when navigation feels generic or pasted on
- `evaluation/ui-scorecard.md`

## Output Contract

```md
## Interface Feel Pass
- dead/stiff surfaces found:
- feedback improvements:
- perceived performance improvements:
- typography/spacing improvements:
- empty/loading/error states:
- focus/active states:
- jank risks:
- fixes applied:
- remaining manual checks:
```

## Checks

- Pressable controls have hover, focus, active, disabled, and loading states.
- Navigation has visible active/focus states and feels integrated with the page, not pasted on.
- Navigation remains readable over images, giant type, video, gradients, and scroll-state background changes.
- CTA/nav placement feels intentional and proportionate.
- App-name/logo/initials chrome is removed unless the visual spec justifies it.
- Decorative orbit/HUD/radar line overlays are absent unless functional and approved.
- Decorative hairlines, red separators, label rails, and ticks are absent unless they separate real content.
- Mobile modals/sheets fit the viewport, respect safe areas, scroll internally when long, and keep primary actions visible/reachable.
- Practical mobile bottom nav has semantic icons plus readable labels.
- Selectable chips/items/tabs visibly preserve selected state until changed.
- Active bars, progress strips, underlines, and selected indicators do not overlap labels/content.
- Add/create actions look distinct from content cards and use plus/create affordance.
- Focus rings are visible and not ugly afterthoughts.
- Empty, loading, and error states are specific to the product.
- Spacing uses a consistent scale.
- Numeric/data text scans cleanly.
- State changes acknowledge the user quickly.
- Skeletons/progress states are truthful.
- Surfaces do not feel like dead rectangles.
- Motion, if present, is purposeful and reduced-motion aware.
- Advanced/cinematic motion, if requested, has more than one layer and follows `docs/design/motion-choreography-plan.md`.
- The UI has a few crafted details without becoming noisy.

## Stop Conditions

- Functionally working UI still feels dead, stiff, or generic.
- Visible controls have no active feedback.
- Navigation feels generic, pasted on, or disconnected from the visual thesis.
- Navigation becomes unreadable over its background.
- Forced app-name/logo/initials chrome remains without justification.
- Decorative circular/orbital/HUD overlays or hairline filler remain as polish.
- Mobile modal/sheet is cut off, hides actions, ignores safe areas, cannot scroll long content, or collides with bottom nav.
- Practical mobile product bottom nav is text-only without justification.
- Selectable controls lose selected state or confuse hover/pressed/selected.
- Control indicators overlap labels/content.
- Add/create affordance masquerades as content.
- Loading/empty/error states are missing or generic.
- Spacing is arbitrary.
- The polish pass tries to hide a broken core loop.
- The polish pass adds a token animation instead of fixing the broader motion choreography that Migi requested.

## Post-Build Review Escalation

- Use `skills/evidence-backed-critique/SKILL.md` when a finished interface still feels wrong but the exact issue is unclear.
- Use `skills/text-clarity-review/SKILL.md` when the interface feel problem is caused by vague CTAs, unclear state copy, generic empty/error/loading messages, inconsistent terms, or confusing labels.
- Use `skills/production-hardening-review/SKILL.md` when the polish pass reveals brittle behavior under long text, missing data, errors, slow networks, translations, accessibility, or small viewports.
- Do not run these reviews during direction selection; they are post-build quality layers.

## Layout Integrity Gate

Do not polish over layout failure. Clipped text, word overflow, nav overflow, CTA clipping, sticker/card/headline collision, and huge accidental blank space must be fixed before any feel-better pass can claim success.

Run `skills/layout-integrity-review/SKILL.md` before final handoff when the UI contains custom nav, stickers/cards/badges/overlays, large display type, or responsive composition.

Screenshot contradiction beats agent self-report.

## Audit Upgrade: Self-Correction Contract

Audit fix: Replace vague polish with measurable interaction states.

Required evidence:
- state inventory, feedback latency, focus/hover/pressed/selected evidence, spacing rhythm, and perceived performance notes.

Repair routing:
- motion-craft-director owns animation gaps; text/layout reviewers own clarity and collision gaps.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "make-interfaces-feel-better"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
