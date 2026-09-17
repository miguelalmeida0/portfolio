# Scroll Physics Smoothing Director

## Purpose
Plan and review the scroll engine feel for scroll-heavy, award-level, editorial, portfolio, brand, playful, and cinematic sites.

This skill turns scroll from raw page movement into controlled physical travel: smooth enough to feel authored, responsive enough to remain usable, and disciplined enough to avoid jitter, blank dead frames, text collisions, and motion sickness.

## Use When
- Migi asks for elite, Awwwards, million-dollar, original, authored, or cinematic scrolling.
- A page uses pinned stages, horizontal routes, card assembly, portal entry, media constellations, video-to-object transforms, or sticky chapter navigation.
- The scroll feels raw, jittery, linear, abrupt, floaty, laggy, sticky, or hard to control.
- Scroll movement covers text, causes blank frames, or loses the user's place.
- Mobile/touch scroll needs a simpler fallback.

## Do Not Use When
- The task is a normal dashboard, settings page, form, or high-frequency utility flow.
- There is no scroll choreography or scroll-linked motion.
- The best experience is plain document scrolling.
- The user explicitly asks for no motion.

## Required Output Before Coding
- scroll engine decision: native, CSS scroll timeline, Motion, GSAP ScrollTrigger, Lenis, or custom local scroll state
- smoothing model: none, lerp, spring, eased scrub, snap, settle, or hybrid
- scrub plan: what is tied directly to scroll progress and what is time-based
- velocity plan: how fast scroll changes affect object motion
- snap/settle behavior: where stages land and how they stop
- touch behavior: wheel, trackpad, touch, keyboard, and reduced precision handling
- mobile fallback: simplified route, fewer pins, no horizontal trap
- reduced-motion fallback: static storyboard, instant state changes, or minimal fades
- performance budget: transform/opacity first, no per-frame layout thrash, bounded observers
- blank-frame prevention plan
- text-overlap and viewport-boundary risk plan

## Scroll Physics Contract
Use this table before implementation:

| Segment | Scroll Range | Engine | Scrub/Smooth | Snap/Settle | Velocity Rule | Touch Rule | Risk |
|---|---|---|---|---|---|---|---|

## Hard Rules
- No raw linear scroll for a scroll-heavy elite site unless explicitly justified.
- No scroll smoothing that breaks keyboard navigation, touch momentum, focus order, or browser history.
- No blank pinned dead frames.
- No moving object may cover critical text, controls, or navigation.
- No scroll-jacking trap that prevents normal reading or escape.
- No per-frame layout reads/writes that cause jank.
- No horizontal route without mobile fallback.
- Reduced-motion users must receive a complete story, not empty space.

## Implementation Guidance
- Prefer native scroll for normal content.
- Use CSS scroll-driven animations for simple progress-bound transforms when supported.
- Use Motion useScroll/useTransform/useSpring for React scroll progress when local component control is enough.
- Use GSAP ScrollTrigger when pinning, scrub, snap, and horizontal route choreography require mature sequencing.
- Use Lenis only when smooth-scroll coordination is central and accessibility remains intact.
- Use requestAnimationFrame carefully; batch reads and writes.
- Animate transform and opacity by default. Avoid layout properties during scroll.
- Debounce expensive measurements and observe resize safely.

## Review Checks
- Does scroll feel authored instead of raw browser drift?
- Does the page settle cleanly after each major chapter?
- Are transitions smooth on trackpad, wheel, touch, and keyboard?
- Are there any blank frames inside pinned or sticky stages?
- Does moving content ever cover readable text?
- Does mobile avoid forced desktop choreography?
- Is reduced motion a coherent static sequence?
- Are there data hooks for QA when implemented?

## Stop Conditions
- Scroll feels jittery, sticky, laggy, or raw.
- A pinned section produces a blank dead frame.
- Scroll movement covers critical text or controls.
- Mobile scroll is trapped or unusable.
- Reduced-motion mode removes essential content.

## Score Caps
- scroll feels jittery or raw: max score 5.
- no scroll smoothing spec for scroll-heavy site: max score 6.
- scroll movement covers critical text: max score 3.
- pinned/sticky stage has blank dead frame: max score 4.
- horizontal scroll route has no mobile fallback: max score 5.
- no reduced-motion fallback for scroll choreography: max score 5.

## Audit Upgrade: Self-Correction Contract

Audit fix: Tune scroll feel without hiding accessibility or layout problems.

Required evidence:
- scroll model, easing/friction/snap plan, device constraints, reduced-motion behavior, and capture proof.

Repair routing:
- scroll-choreography-review owns final scroll evidence.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "scroll-physics-smoothing-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.

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
