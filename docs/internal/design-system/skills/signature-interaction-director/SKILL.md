# Signature Interaction Director

## Purpose
Plan, implement, and review one memorable signature interaction for artistic, landing, brand, portfolio, editorial, playful product, and image-led sites.

## Use When
- Migi asks for elite, award-level, original, million-dollar website feel.
- A landing page feels generic.
- A brand site needs a memorable mechanic.
- References include playful gates, portal stages, scroll-assembled cards, horizontal scroll, mascot motion, cinematic work grids, or custom modal systems.
- A site should feel crafted rather than section-stacked.

## Do Not Use When
- Normal dashboard.
- Utility admin panel.
- Settings or form-heavy product where ceremony slows the task.
- High-frequency productivity app.
- Accessibility-critical workflow where interaction ceremony blocks access.

## Required Files To Read
- `design-intelligence/signature-interaction-patterns.md`
- Relevant reference folder under `visual-library/approved/inspiration/signature-interactions/`
- Relevant mode benchmark if present.

## Required Output Before Coding
- selected signature mechanic;
- source inspiration;
- what is extracted;
- what must not be copied;
- interaction story;
- motion choreography;
- implementation strategy;
- accessibility fallback;
- reduced-motion fallback;
- success criteria.

## Hard Rule
Every artistic, brand, portfolio, experimental landing page must either choose one signature interaction or explicitly justify why no signature interaction is appropriate.

## Hard Bans
- Generic section stack after award references.
- Decorative animation with no interaction story.
- Random scroll effects.
- Copying reference branding.
- Playful gate on high-frequency utility flows.
- Signature interaction without fallback.
- Animation that blocks core content.
- Fake WebGL, portal, or morphing claims without implementation.

## Score Caps
- Award-level references provided but no signature interaction selected: max score 6.
- Generic section stack after signature references: max score 4.
- Copied reference style instead of extracting mechanics: max score 4.
- Playful interaction blocks access with no fallback: max score 5.
- Portal/morphing claim but only fade/slide delivered: max score 4.
- Review/testimonial section generic despite Review Theater pattern: max score 6.
- Modal/detail interaction uses default dialog styling: max score 6.
- No reduced-motion fallback for signature motion: max score 5.
- Static SVG illustration where signature interaction requires animated reveal: max score 5.

## Review Checks
- Is the mechanic visible and meaningful?
- Does it create memory without blocking access?
- Does it map to the brand/product concept?
- Is the extracted mechanic different from copying brand skin?
- Does reduced motion still preserve content and hierarchy?
- Does the final screenshot or motion evidence prove the mechanic exists?

## Illustration-First Gate

If the selected signature interaction depends on custom illustration, botanical plates, mascot art, character art, product object art, or an editorial SVG scene, require the Illustration-First Gate before full-page implementation. A signature mechanic cannot compensate for amateur hero art.

Score caps:

- signature interaction uses amateur illustration as its centerpiece: max score 4
- full page built before the signature asset passes isolated review: max score 4
- static SVG illustration delivered where the selected interaction requires animated reveal: max score 5

## No Ambient Background Blobs

Do not use large vague background blobs, ghost ellipses, generic radial glows, random translucent ovals, fake lens shapes, generic dot/star fields, decorative orbits/HUD lines, or abstract atmosphere as a substitute for a signature interaction. Background atmosphere must be the primary product object, part of the selected signature interaction, directly derived from an approved reference mechanic, or named in the shape inventory with role, layer, and purpose.

## Layout Integrity Gate

Signature interaction cannot excuse layout failure.

Block if the mechanic creates or hides:

- clipped critical text
- word overflow inside cards/stickers/badges/buttons/nav
- sticker/card/image/overlay covering headline text
- nav label overflow
- huge accidental blank space
- text-fit failure visible in screenshots

Every signature sticker/card/nav/object system needs protected text zones and a text-fit strategy before implementation.

## Elite Scroll Choreography Routing

When a landing, brand, portfolio, editorial, playful product, or video-first site depends on scroll as the experience, route to skills/elite-scroll-choreography-director/SKILL.md before implementation. The selected scroll pattern must appear in the visual spec, and skills/scroll-choreography-review/SKILL.md must run after implementation.

Block fade-only scroll when elite scroll was requested, pinned blank frames, moving objects covering critical text, horizontal routes without mobile fallback, scroll-to-assemble claims where objects do not visibly assemble, and scroll navigation that does not sync to chapters. Run layout-integrity review after scroll-choreography review.

## Audit Upgrade: Self-Correction Contract

Audit fix: Prototype the mechanic and prove it exists.

Required evidence:
- mechanic spec, state diagram, prototype notes, screenshots or motion capture, fallback plan.

Repair routing:
- motion-craft-director and review-animations own motion repairs; layout-integrity-review owns collisions.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "signature-interaction-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

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

## Mobile Bottom Navigation Requirement

For mobile route/app experiences, navigation must be persistent and bottom-positioned by default. Signature mechanics do not excuse losing route access after scroll.

If a playful or cinematic route controller replaces standard bottom nav, it must still be bottom-accessible, safe-area aware, readable, and accessible.

## Detail Reveal Spatial Context Requirement

Every signature detail reveal must preserve spatial context. The selected trigger and detail panel must be connected by layout, animation, placement, or explicit selected state.

Review must check selected card detail placement, mobile nav visibility after scroll, bottom nav safe area, active state, and accessible labels. If no meaningful trigger/detail connection appears, the final verdict cannot be "masterpiece."

## No Fake Live Affordances

Reject fake `LIVE`, fake live feed, fake realtime, fake presence, fake activity indicators, and pulsing live badges unless real realtime functionality exists. Signature mechanics must create real interaction value, not fake status theater.

## Offset Container Alignment

Every layered container, media backplate, offset card, and framed object must have clean corner geometry and intentional offset alignment. Physical/prop-like signature mechanics fail if their exposed corners look accidental.

## Navigation Active State Correctness

Every nav item must be clickable and must activate itself, not an adjacent item. Signature route mechanics must preserve correct active mapping across desktop, tablet, and mobile.
