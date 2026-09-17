# Elite Scroll Choreography Director

## Purpose
Plan, implement, and review award-level scroll choreography systems where scrolling changes layout, object position, information depth, media scale, navigation state, section order, or interaction context.

This is scroll as spatial choreography, not scroll-triggered decoration.

## Use When
- Migi asks for elite, Awwwards, million-dollar, original, authored, or memorable website feel.
- A landing, portfolio, editorial, brand, agency, playful product, or video-first site needs memorable scroll.
- References include horizontal routes, scroll-to-assemble cards, sticky panels, media constellations, portal entry, staged reveals, pinned media, or directional transitions.
- The site currently feels like static stacked sections.
- Content needs to travel, assemble, open, dock, settle, unstack, transform, or reveal more depth while scrolling.

## Do Not Use When
- Normal dashboards.
- Dense productivity tools.
- Forms or settings pages.
- High-frequency utility flows.
- Mobile flows where scroll choreography slows task completion.
- Accessibility-critical paths where ceremony blocks usage.

## Relationship To Other Skills
- signature-interaction-director selects the memorable mechanic.
- elite-scroll-choreography-director designs the scroll route and timeline.
- scroll-morphing-experience-director, when present, handles cinematic shape, image, or WebGL morphing.
- motion-craft-director handles general motion quality.
- layout-integrity-review verifies the scroll system did not break text, nav, containers, or whitespace.
- vector-form-system-director handles custom shape objects used in scroll choreography.
- image-form-integration-director, when present, handles media/vector composition.

## Required Files To Read
- design-intelligence/elite-scroll-choreography-patterns.md
- templates/implementation-kits/elite-scroll-choreography/pattern-selection-guide.md
- Relevant visual-library/approved/inspiration/signature-interactions/ reference notes when the project cites those mechanics.
- evaluation/benchmarks/elite-scroll-choreography.benchmark.md when scoring a scroll-heavy site.

## Required Output Before Coding
- selected scroll pattern
- route map
- scroll chapter map
- pinned/sticky stage plan
- moving object inventory
- information reveal plan
- nav sync plan
- motion timeline
- responsive fallback
- reduced-motion fallback
- layout integrity risks
- implementation target
- QA checklist

## Hard Rule
No elite or award-level landing page may use generic fade-in section scrolling as its primary scroll mechanic.

If a visual-heavy site has no meaningful scroll choreography, explain why in the visual spec.

## Scroll Route Contract
Document the route before implementation:

| Chapter | Scroll Range | User Sees | Objects Move | Info Reveals | Nav State | Risk |
|---|---|---|---|---|---|---|

Also include:
- desktop route shape: vertical, horizontal, zig-zag, pinned, staged, or hybrid;
- mobile simplification;
- which elements are pinned;
- which elements travel;
- where objects settle;
- what becomes interactive at each chapter;
- how reduced motion preserves story order.

## Implementation Targets
Prefer the lightest tool that can honestly deliver the chosen route:

- CSS scroll-driven animations for simple progress-bound transforms.
- React + local scroll progress for controlled lightweight choreography.
- Motion useScroll, useTransform, useSpring for React scroll progress.
- GSAP ScrollTrigger for pin/scrub/snap/horizontal route choreography when CSS/React is insufficient.
- Lenis only when smooth-scroll coordination is needed and accessibility remains intact.

Do not require paid libraries. Do not claim WebGL, portal, physics, or scroll-scrub behavior unless implemented.

## Hard Bans
- Fade-only scroll when elite scroll was requested.
- Random scroll effects with no route map.
- Pinned sections with accidental blank frames.
- Moving objects covering critical text.
- Horizontal scroll routes without mobile fallback.
- Scroll-to-assemble claims where objects do not visibly assemble.
- Nav active state that does not sync with scroll chapters.
- Scroll-jacking traps that block normal reading or keyboard access.
- Reduced-motion users receiving broken or empty content.
- Video transformed into UI object without readable controls or fallback.

## Score Caps
- Elite scroll requested but only fade-in sections delivered: max score 4.
- Selected scroll pattern not visible: max score 4.
- Scroll-to-assemble claim but objects do not assemble: max score 4.
- Pinned/sticky stage has blank dead frame: max score 4.
- Horizontal scroll route has no mobile fallback: max score 5.
- Scroll movement covers critical text: max score 3.
- Scroll nav does not sync to chapters: max score 5.
- No reduced-motion fallback for scroll choreography: max score 5.
- Scroll implementation causes horizontal overflow: max score 4.
- No scroll-choreography review for scroll-heavy site: max score 6.

## Review Questions
- Can a viewer describe the scroll route in one sentence?
- Does scrolling change spatial relationship, information depth, media scale, or navigation context?
- Is there one authored scroll thesis rather than many unrelated effects?
- Do pinned stages always contain meaningful content?
- Does mobile preserve the identity without forcing desktop choreography?
- Does reduced motion preserve the sequence?
- Does scroll improve memory and comprehension, or merely decorate the page?

## Audit Upgrade: Self-Correction Contract

Audit fix: Rationalize with advanced motion and require capture-backed scroll proof.

Required evidence:
- scroll route map, chapter map, reduced-motion fallback, capture evidence or blocker.

Repair routing:
- scroll-choreography-review owns final scroll proof; advanced-motion-choreography owns broader motion layering.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "elite-scroll-choreography-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

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

## Mobile Bottom Navigation Requirement

For scroll-heavy mobile experiences with route or chapter navigation, primary navigation must remain accessible while scrolling and should use a persistent bottom route controller by default.

Do not place primary mobile route navigation only at the top unless the page is a simple document page and does not require persistent movement.

## Detail Reveal Spatial Context Requirement

Scroll choreography must not break trigger/detail context. If a card, scene object, media tile, or station opens details, the reveal must be anchored, inline, adjacent, transformed from the object, focused into view, or opened as an explicit mobile sheet/drawer.

Block if scroll movement causes the detail panel to feel disconnected from its trigger.
