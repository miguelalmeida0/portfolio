---
name: animation-vocabulary
description: Map vague motion descriptions to precise animation terminology. Use when Migi asks what an animation is called, describes a motion effect without the right term, or an agent needs exact motion vocabulary for prompts, specs, reviews, or implementation notes.
---

# Animation Vocabulary

Return the best term first, then a one-line definition. If needed, include 1-2 close alternatives.

## Output Format

```md
**Best term** - One-line definition.

Close alternatives:
- **Term** - How it differs.
```

## Common Terms

- Fade in / fade out: opacity-based appearance or disappearance.
- Slide in: element enters from an edge.
- Scale in: element grows from smaller to full size.
- Pop in: scale entrance with slight overshoot.
- Reveal: content is uncovered through clip-path, mask, or cover movement.
- Stagger: multiple elements animate one after another.
- Orchestration: coordinated timing across multiple animations.
- Translate: movement on x/y axes.
- Transform origin: anchor point for scale or rotation.
- Origin-aware animation: popover/menu grows from its trigger.
- Crossfade: one element fades out while another fades in.
- Morph: one shape turns into another.
- Shared element transition: one element travels/transforms between views.
- Layout animation: size/position changes animate instead of snapping.
- Direction-aware transition: forward/back navigation uses opposite directions.
- Scroll reveal: element animates when entering the viewport.
- Scroll-driven animation: animation progress tied to scroll position.
- Parallax: background/foreground move at different speeds.
- Press feedback: subtle button/control response on pointer down.
- Swipe to dismiss: drag element offscreen to close.
- Rubber-banding: resisted overscroll with snap-back.
- Ease-out: starts fast, ends slow.
- Ease-in-out: slow/fast/slow for on-screen movement.
- Spring: physics-based movement with stiffness/damping/mass.
- Momentum: motion carries velocity after drag/interruption.
- Skeleton shimmer: placeholder sheen while content loads.
- Number ticker: digits roll or count to a value.
- Clip-path reveal: hard-edged shape-based reveal.
- Mask reveal: soft/fadeable reveal.
- Interruptible animation: can redirect mid-flight.
- Reduced motion: toned-down or removed movement for user preference.

## Example Mappings

- "popover grows out of the button" -> **Origin-aware animation**.
- "items come in one by one" -> **Stagger**.
- "thumbnail expands into full card" -> **Shared element transition**.
- "iOS overscroll snap-back" -> **Rubber-banding**.
- "one shape turns into another" -> **Morph**.

## Rules

- Do not invent terms when the glossary has no match.
- Disambiguate terms that sound similar.
- Keep answers short unless Migi asks for implementation details.
- This skill names/specifies motion only. It does not design, implement, or approve motion by itself.

## Advanced Motion Vocabulary

For advanced motion planning, prefer exact terms that can be implemented and reviewed:

- pinned section
- scrubbed timeline
- scroll-linked parallax
- scroll-triggered reveal
- clip-path reveal
- mask reveal
- sticky horizontal scroll
- view transition
- image-to-panel expansion
- staggered typography
- kinetic marquee
- menu reveal
- reel overlay
- hover image trail
- floating CTA transition

If Migi asks for award-level, cinematic, or scroll-heavy motion, name the likely techniques and route to `skills/advanced-motion-choreography/SKILL.md`.

## Audit Upgrade: Self-Correction Contract

Audit fix: Feed named terms into specs and repair tasks.

Required evidence:
- chosen term, close alternatives, implementation implication, and misuse warning.

Repair routing:
- motion-craft-director or advanced-motion-choreography owns downstream action.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "animation-vocabulary"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
