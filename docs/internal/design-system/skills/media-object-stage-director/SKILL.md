# Media Object Stage Director

## Purpose
Plan and review how video, image, animation, or mixed media behaves as a primary interface object rather than generic background decoration.

A media object can be a hero, crop, mask, sticky object, poster, portal, card, broadcast tile, detail view, proof window, or spatial artifact. This skill makes that role explicit before implementation.

## Use When
- A site is video-first, image-led, cinematic, editorial, portfolio, brand, or product-story driven.
- References include media constellations, portals, broadcast tiles, video windows, masked media, sticky media stages, or media cards.
- A video/image should transform, dock, open, reveal details, or act as the page's primary object.
- Current work uses media only as vague background atmosphere.

## Do Not Use When
- Images are small static thumbnails with no major role.
- The UI is a dense utility product where media is incidental.
- The task is copy-only, backend-only, or a small bug fix.

## Required Output Before Coding
- media role: hero, stage, portal, card, tile, mask, poster, detail view, or proof object
- media state map: idle, hover, focus, playing, paused, loading, error, selected, expanded, reduced motion
- crop strategy: subject, safe zone, aspect ratio, focal point, viewport behavior
- text safe-zone strategy: where copy may and may not sit
- poster fallback: still image, color field, skeleton, or text fallback
- loading/error strategy
- controls and captions strategy
- sticky/pinned behavior if any
- responsive behavior
- reduced-motion behavior
- performance budget

## Media State Map
Use this table before implementation:

| State | Visual Behavior | Controls | Text Safe Zone | Fallback | Risk |
|---|---|---|---|---|---|

## Hard Rules
- Do not use media only as a background when the selected direction requires a media object stage.
- Media crops must preserve the subject and must not destroy text readability.
- Every important video needs poster/fallback behavior.
- Text over media requires a safe zone, plate, scrim, mask, or separate placement.
- Do not autoplay audio.
- Do not hide controls when playback matters.
- Do not claim portal, broadcast, proof, or object behavior unless implemented.
- Loading, error, and reduced-motion states must still look designed.

## Review Checks
- Is the media a named object in the composition?
- Does the crop preserve the subject at desktop, tablet, and mobile?
- Does media support the story instead of filling space?
- Are captions, controls, and focus states accessible?
- Does the media state change when the user interacts?
- Does the fallback preserve the composition?

## Stop Conditions
- Media crop breaks subject or text readability.
- Video/image is used as a generic dark background when it should be the product object.
- Important video has no poster fallback.
- Media covers controls or navigation.

## Score Caps
- video/media used only as background when media-object stage was required: max score 5.
- media crop breaks subject or text readability: max score 4.
- media state map missing for a media-led page: max score 6.
- important video has no poster or loading fallback: max score 6.
- media controls or captions are inaccessible: max score 5.

## Audit Upgrade: Self-Correction Contract

Audit fix: Treat media as product object or environment with declared stage behavior.

Required evidence:
- media role, crop, safe zones, object/stage relationship, responsive behavior, and evidence.

Repair routing:
- image-first-frontend owns implementation; screenshot-scorecard-review owns crop/readability proof.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "media-object-stage-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

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

## No Fake Live Affordances

Reject fake `LIVE`, fake live feed, fake realtime, fake presence, fake activity indicators, and pulsing live badges unless real realtime functionality exists.

## Offset Container Alignment

Every media frame, layered container, media backplate, offset card, and framed object must have clean corner geometry and intentional offset alignment. Inspect all four corners and block messy exposed backing layers.

## Navigation Active State Correctness

If media-stage navigation or route navigation exists, every nav item must be clickable and must activate itself, not an adjacent item. Active state must be keyed by stable nav id and verified by clicking every nav item.
