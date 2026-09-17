---
name: layout-integrity-review
description: Review implemented UI for text clipping, word overflow, container collisions, nav responsiveness, whitespace density, breakpoint survival, and obvious screenshot layout failures. Use after implementation for visual-heavy pages, landing pages, product UIs, mobile flows, custom nav, stickers/cards/badges/overlays, large display type, and scroll/sticky/pinned experiences.
---

# Layout Integrity Review

Use this skill after implementation and before final handoff.

## Required Reading

- `design-dna/text-container-integrity-rules.md`
- `design-dna/navigation-responsiveness-rules.md`
- `design-dna/whitespace-density-rules.md`
- `evaluation/ui-scorecard.md`

## Required Checks

- text clipping
- word overflow
- button/CTA label clipping
- card/sticker text fit
- nav label fit
- nav responsive behavior
- overlay vs protected text
- horizontal overflow
- vertical dead space
- fixed-height text containers
- breakpoint screenshots
- reduced viewport stress

## Required Output

| Issue | Evidence | Why It Fails | Required Fix | Severity |
|---|---|---|---|---|

## Verdict

- Block
- Partial
- Pass

## Block If

- any critical text is clipped
- nav text overflows item
- card/sticker covers headline text
- huge blank area is accidental
- text overflow appears in screenshot
- CTA text is clipped
- user complaint remains visible

## Evidence Rules

Screenshot contradiction beats agent self-report. If screenshot evidence shows clipped text, word overflow, nav overflow, or accidental dead whitespace, the review must block even when the implementation notes claim the issue is fixed.

## Score Caps

- critical text clipped: max score 2
- nav label overflows item: max score 3
- sticker/card covers headline word: max score 3
- button/CTA text clipped: max score 3
- text hidden by `overflow: hidden`: max score 3
- unresolved text/container issue appears in screenshot: max score 3
- no text fit strategy for sticker/card/nav system: max score 5
- nav huge dead space at breakpoint: max score 4
- nav lacks responsive variant: max score 5
- large accidental blank viewport area: max score 4

## Elite Scroll Choreography Routing

When a landing, brand, portfolio, editorial, playful product, or video-first site depends on scroll as the experience, route to skills/elite-scroll-choreography-director/SKILL.md before implementation. The selected scroll pattern must appear in the visual spec, and skills/scroll-choreography-review/SKILL.md must run after implementation.

Block fade-only scroll when elite scroll was requested, pinned blank frames, moving objects covering critical text, horizontal routes without mobile fallback, scroll-to-assemble claims where objects do not visibly assemble, and scroll navigation that does not sync to chapters. Run layout-integrity review after scroll-choreography review.

## Audit Upgrade: Self-Correction Contract

Audit fix: Become detector-backed, not just checklist-backed.

Required evidence:
- layout-integrity-check output or blocked reason plus 390/768/1440 screenshots.

Repair routing:
- implementation owner fixes collisions; screenshot-scorecard-review verifies closure.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "layout-integrity-review"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

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

For mobile route/app experiences, navigation must be persistent and bottom-positioned by default. Primary mobile route navigation must not live only at the top when users need it while scrolling.

Review must verify:

- mobile nav remains accessible after scroll
- bottom placement or approved bottom-accessible alternative exists
- safe-area inset is respected
- active state and accessible labels are clear

Block if mobile route navigation disappears on scroll or compact route access is unavailable.

## Detail Reveal Spatial Context Requirement

Every card/item/detail interaction must preserve spatial context. The selected trigger and detail panel must be connected by layout, animation, placement, or explicit selected state.

Review must verify:

- selected card detail placement
- `data-detail-trigger`, `data-detail-panel`, and `data-detail-for` relationships where practical
- detail panel is not far from the trigger unless detached behavior is intentional and focus/scroll-linked
- mobile detail uses inline expansion, adjacent panel, or named sheet/drawer behavior

Block if the detail panel feels disconnected from the clicked object.

## No Fake Live Affordances

Reject fake `LIVE`, fake live feed, fake realtime, fake presence, fake activity indicators, and pulsing live badges unless real realtime functionality exists.

Block static UI that uses live terminology as visual garnish.

## No AI Theater Chrome

Reject decorative `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Mission Room`, `Case File`, `CL-####`, dossier, operation, and fake severity/status chips unless they are real product objects with documented behavior.

Block oversized replay/status strips and repeated theater chips that take layout space away from real task content.

## Offset Container Alignment

Every layered container, media backplate, offset card, and framed object must have clean corner geometry and intentional offset alignment.

Review all four corners, radius alignment, exposed offset sides, backplate/frontplate geometry, and resize behavior.

## Navigation Active State Correctness

Every nav item must be clickable and must activate itself, not an adjacent item.

Block if the clicked nav item does not become selected, if the right/adjacent item becomes active, if a nav item never receives selected state, or if visual active state disagrees with `aria-current`/`aria-selected`.

First and last nav items must be included in click-through QA. Block if a trailing item such as Booking/Book never receives selected state.

## Brand Chrome Readability

App names, wordmarks, initials, logo text, and persistent brand chrome must remain readable over every background state.

Block if brand chrome struggles over dark bands, imagery, gradients, video, or scroll-changing backgrounds without a plate, scrim, adaptive token, safe zone, relocation, or removal.
