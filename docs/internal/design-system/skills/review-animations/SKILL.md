---
name: review-animations
description: Review animation and motion code only. Use when motion implementation changed, Migi asks for animation review, UI motion feels off, or a frontend needs exact animation quality gates. Load STANDARDS.md for exact durations, easing, physicality, performance, gestures, stagger, and accessibility rules.
---

# Review Animations

Default to flagging. Approval is earned.

## Required File

Read `skills/review-animations/STANDARDS.md` before reviewing motion.

## Scope

Review only:

- transitions
- keyframes
- motion libraries
- gestures
- scroll animation
- hover/press feedback
- reduced-motion behavior
- performance implications

Do not redesign the whole UI unless motion cannot be evaluated without layout context.

## Required Findings Table

| Severity | File:Line | Issue | Fix | Standard |
| --- | --- | --- | --- | --- |

Use file/line references where possible.

## Verdict

End with one:

- `APPROVE`
- `BLOCK`
- `APPROVE WITH NOTES`

Block if:

- high-frequency actions animate
- UI uses ease-in
- elements animate from scale(0)
- `transition: all` is used in production UI
- motion lacks purpose
- reduced motion is missing
- animation causes jank or layout work
- delight blocks the task
- advanced motion was requested but `docs/design/motion-choreography-plan.md` is missing
- advanced motion was requested but only one animation layer exists
- every section uses the same fade-up or reveal pattern
- section-by-section motion map is missing
- no motion benchmark review or capture blocker exists when motion is central

## Advanced Motion Review

When reviewing advanced/cinematic/artistic/portfolio motion, compare the implementation against:

- `docs/design/motion-choreography-plan.md`
- `design-intelligence/motion-tool-stack-guidance.md`
- `evaluation/benchmarks/motion-cinematic.benchmark.md`

Approval requires named techniques, at least page/section, image/media, typography, navigation/menu, and micro-feedback layers where the plan calls for them, plus reduced-motion behavior.

## Elite Scroll Choreography Routing

When a landing, brand, portfolio, editorial, playful product, or video-first site depends on scroll as the experience, route to skills/elite-scroll-choreography-director/SKILL.md before implementation. The selected scroll pattern must appear in the visual spec, and skills/scroll-choreography-review/SKILL.md must run after implementation.

Block fade-only scroll when elite scroll was requested, pinned blank frames, moving objects covering critical text, horizontal routes without mobile fallback, scroll-to-assemble claims where objects do not visibly assemble, and scroll navigation that does not sync to chapters. Run layout-integrity review after scroll-choreography review.

## Audit Upgrade: Self-Correction Contract

Audit fix: Score motion from capture or code evidence, not prose.

Required evidence:
- motion capture, code selectors, timing/easing findings, reduced-motion proof, performance notes.

Repair routing:
- motion-craft-director owns spec gaps; implementation owner fixes code.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "review-animations"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.

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

## Anime.js Code Review

When animation code uses Anime.js, verify:

- `skills/animejs-motion-director/SKILL.md` was routed or its gate was answered
- CSS was used for simple hover/focus/active states when enough
- Anime.js runs only in client components
- animations are scoped under a root ref
- `createScope` or an equivalent scoped pattern prevents global selector leakage
- cleanup calls `scope.current.revert()` or otherwise cancels timelines/loops/draggables
- no loop/timer continues after unmount
- reduced-motion fallback exists
- mobile behavior is tested
- motion does not imply fake live/status behavior
- motion does not block reading, navigation, selection, or focus

Reject generic fade-and-rise everywhere, unscoped selectors, content hidden until animation completes, and Anime.js code with no screenshot proof.

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
