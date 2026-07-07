# Scroll Choreography Review

## Purpose
Post-build review for scroll choreography quality and integrity.

Use this after implementation for any scroll-heavy landing, portfolio, editorial, brand, playful product, video-first, or award-level site.

## Required Inputs
- URL or screenshot sequence if available.
- Selected scroll pattern.
- Scroll route map.
- Scroll chapter map.
- Motion timeline.
- Mobile fallback plan.
- Reduced-motion fallback plan.
- Relevant screenshots or tools/scroll-choreography-check.mjs output when runnable.

## Required Checks
- selected scroll pattern is visible
- scroll route matches spec
- pinned/sticky sections have no blank dead frames
- scroll-to-assemble objects actually assemble
- more information appears at intended moments
- nav syncs to scroll chapters
- text/container integrity survives scroll states
- no horizontal overflow unless intentional and controlled
- mobile fallback exists
- reduced-motion fallback exists
- no scroll-jacking traps
- no fake fade-only implementation
- no moving object covers critical text
- video/media transformations remain readable and controllable

## Required Output Table

| Issue | Evidence | Why It Fails | Required Fix | Severity |
|---|---|---|---|---|

## Verdict
- Block: selected pattern is missing, fake, inaccessible, or breaks layout.
- Partial: pattern exists but has integrity, timing, fallback, or evidence gaps.
- Pass: pattern is visible, useful, accessible, responsive, and evidenced.

## Stop Conditions
- Elite scroll requested but the build only uses fade-in sections.
- A pinned stage creates blank dead frames.
- Scroll movement covers critical text or nav.
- Horizontal scroll route has no mobile fallback.
- Reduced motion removes content instead of motion.
- Scroll navigation does not reflect chapter state.

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

## Audit Upgrade: Self-Correction Contract

Audit fix: Pair review with automated or manual scroll capture.

Required evidence:
- scroll-choreography-check output or blocked reason, chapter screenshots, mobile fallback, reduced-motion check.

Repair routing:
- elite-scroll-choreography-director owns route fixes; layout-integrity-review owns scroll collisions.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "scroll-choreography-review"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

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

## Mobile Bottom Navigation Requirement

For mobile route/app or scroll-heavy chapter experiences, route navigation must remain accessible while scrolling and should be persistent bottom navigation by default.

Review must scroll mobile states and block top-only route nav that disappears from view.

## Detail Reveal Spatial Context Requirement

Every scroll-driven card/item/detail reveal must preserve spatial context. Selected triggers and detail panels must remain connected by placement, animation, selected state, or focus/scroll behavior.

Block if the detail panel opens far from the selected object or reads as an unrelated page section.

## No Fake Live Affordances

Reject fake `LIVE`, fake live feed, fake realtime, fake presence, fake activity indicators, and pulsing live badges unless real realtime functionality exists.

## Offset Container Alignment

Every layered container, media backplate, offset card, and framed object used in scroll choreography must have clean corner geometry and intentional offset alignment at all sampled scroll states and viewport sizes.

## Navigation Active State Correctness

Every scroll/chapter nav item must be clickable and must activate itself, not an adjacent item. Active state must match clicked item, scroll target, and `aria-current`/`aria-selected`.
