---
name: motion-craft-director
description: Plan and evaluate motion as part of product experience. Use when defining motion strategy, product transitions, brand motion, hover/press feedback, signature animation moments, reduced-motion behavior, or when animation risks becoming fade-and-rise noise.
---

# Motion Craft Director

Motion communicates state, feedback, hierarchy, and continuity.

## Rule

One signature motion moment is better than scattered motion everywhere.

## Motion Plan

Create:

```md
## Motion Strategy
- should motion exist?
- frequency profile:
- motion purpose:
- hero/signature moment:
- feedback layer:
- transition layer:
- delight layer:
- reduced-motion behavior:
- performance budget:
```

## Timing Defaults

- product transitions: 150-250ms
- button feedback: 100-160ms
- popovers/tooltips: 125-200ms
- modals/drawers: 200-500ms
- brand motion can be longer when it does not block tasks

## Avoid

- fade-and-rise everywhere
- animation with no purpose
- ease-in UI motion
- scale(0) entrances
- `transition: all`
- motion on high-frequency actions
- hover motion on touch devices
- animation fatigue

## Required

- reduced-motion behavior
- transform/opacity default
- explicit purpose per animation
- performance budget
- consistency with product mood

## Advanced Motion Escalation

If the task asks for advanced animations, cinematic motion, artistic motion, award-winning motion, Awwwards/Godly/Recent-level motion, scroll animations, appearing while scrolling, or portfolio motion, route to `skills/advanced-motion-choreography/SKILL.md` before implementation.

Advanced motion requires `docs/design/motion-choreography-plan.md`, not only this lightweight motion strategy.

Block final handoff when:

- advanced motion was requested but only one animation exists
- page/section choreography is missing
- image/media choreography is missing despite reference need
- typography or navigation/menu motion is missing despite reference need
- no reduced-motion fallback exists
- no motion benchmark review or motion evidence exists when motion is central

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

Audit fix: Tie motion to an interaction state machine.

Required evidence:
- trigger/state table, frequency profile, duration/easing, reduced-motion behavior, and acceptance checks.

Repair routing:
- review-animations owns code repair; make-interfaces-feel-better owns micro-feedback gaps.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "motion-craft-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.

## Elite Experience Specialist Routing

When a selected direction or reference asks for elite craft beyond broad signature/scroll planning, route the smallest relevant specialist:

- scroll-physics-smoothing-director for smoothing, scrub, lerp, snap, settle, velocity, touch behavior, mobile fallback, reduced motion, and scroll performance.
- media-object-stage-director when video/image/media is the primary object: hero, mask, sticky object, poster, portal, card, broadcast tile, or detail view.
- physical-interface-props-director for stickers, tickets, labels, stamps, keycards, rails, pins, tabs, and tactile cards.
- designed-detail-reveal-director for drawers, panels, sleeves, split views, object pull-outs, station boards, and ritual selectors.
- brand-voice-as-interface-director when CTAs, nav labels, cards, reviews, states, or microcopy must carry brand voice without losing clarity.

Blockers to flag: raw/jittery scroll, media used as generic background when object staging is required, prop text clipping, default modal where a designed reveal is required, and generic SaaS/hotel/template copy on a playful or brand-led site.

## Media/Text Protected Zone Requirement

For any scroll-heavy page where video/image/media objects move, pin, scale, rotate, transform, or become interface objects:

Required before implementation:

- docs/design/protected-zone-map.md
- docs/design/media-object-stage-plan.md
- docs/design/scroll-motion-spec.md

The protected-zone map must identify:

- critical text zones
- media lanes
- start rect for media object
- end rect for media object
- forbidden overlap zones
- responsive fallback
- reduced-motion fallback

Hard rule:
No moving media object may cover critical text.

Review requirement:
Scroll choreography review must inspect scroll states for media/text collision. Layout integrity review must inspect final and intermediate states where possible. Use `design-dna/media-text-protected-zone-rules.md` and the rejected Late Check FM case study at `visual-library/rejected/case-studies/late-check-fm-scroll-media-text-collision/` as the failure memory.

Score caps to apply:

- moving video/media covers critical text: max score 3
- scroll-transformed object crosses protected text zone: max score 3
- video-to-object transform has no protected-zone map: max score 5
- media object is above text by z-index without readable surface: max score 4
- screenshot shows media/text collision: max score 3
- no scroll-state screenshots for media-heavy choreography: max score 5

## Hero-Only Media Default

For video-led pages, the default is:

1. Use video as the hero/top-stage object.
2. Remove or dock video after the hero unless a later state has an explicit role.
3. Never allow persistent media overlay to cover content.
4. Never thin content containers to fit media.
5. If media stays visible during scroll, it must live in a reserved media lane.

## Media Must Yield To Content

If media and text compete:

- text wins
- CTA wins
- navigation wins
- content card readability wins
- media moves, docks, shrinks, or exits

The agent must not preserve a media gimmick by damaging readability.

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

## Final UI Integrity Gate v3

For visual/frontend work, final UI integrity v3 is mandatory before handoff. Screenshot evidence at only one width is insufficient.

Required v3 proof:
- Test viewport matrix: 390, 430, 640, 768, 900, 1024, 1180, 1280, 1366, 1440, 1536, 1728, 1920.
- Sample scroll positions: 0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, 1.00.
- Include applicable states: default, nav active states, selected/open detail panel, sticky/pinned active section, compact nav, and reduced motion when practical.
- Report passed and failed sampled viewport states.

Floating labels, stickers, cards, badges, props, and containers require responsive anchoring and overlap checks. Final response must not claim success if the v3 gate fails, is blocked, has blockers, has cut text, has floating overlap, has media/text collision, has nav overflow, or lacks matrix evidence.

## Final UI Integrity Gate v3

Final UI Integrity Gate v3 is mandatory. Fixed breakpoint-only evidence is insufficient. Width sweep evidence is required. Horizontal scroll must prove readable resting states. Floating objects must prove safe across resizing. Final response is forbidden unless the gate passes or clearly reports blocked/failed.

## WebGL / Shader Motion

If motion uses WebGL, shaders, ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo effects, animated premium gradients, or shader atmospheres, route `skills/webgl-shader-primitives/SKILL.md`.

Motion craft must define:

- product purpose
- exact section/component
- intensity and frequency
- static fallback
- reduced-motion fallback
- mobile behavior
- performance budget
- bounded canvas/GPU area
- pointer-event strategy
- screenshot proof

Do not use shader motion as generic atmosphere, fake live/status behavior, or a way to make ordinary layout feel premium.

## Anime.js Motion

If motion proposes Anime.js, JavaScript timeline choreography, staggered DOM/SVG/object motion, CSS variable animation, weather/terrarium particles, selected-state transitions, rail/detail continuity, or tactile JavaScript feedback, route `skills/animejs-motion-director/SKILL.md`.

Motion craft must define:

- why CSS is not enough
- exact components using Anime.js
- which states remain CSS-only
- signature motion moment
- scoped React/Next pattern
- cleanup plan
- reduced-motion fallback
- mobile behavior
- screenshot proof plan

Do not use Anime.js for generic fade-and-rise, fake live/status pulsing, scroll hijacking, or motion that exists only because the dependency is available.
