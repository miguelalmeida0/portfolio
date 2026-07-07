---
name: visual-spec-compiler
description: Convert a product brief, visual references, active design dials, design-system rules, chart/color/style/landing intelligence, and Miguel Design OS constraints into a buildable visual specification before coding. Use for visual-heavy tasks, new frontend apps, redesigns, dashboards, landing pages, mobile flows, reference-locked builds, or any work where no visual spec should mean no implementation.
---

# Visual Spec Compiler

Use this before significant visual UI implementation.

## Files To Read

- `design-dna/design-generation-dials.md`
- `design-dna/design-system-first-rules.md`
- `design-dna/domain-realism-and-mock-data-rules.md`
- `design-dna/brief-inference-rules.md`
- `design-dna/anti-ai-tell-preflight.md` for landing, portfolio, marketing, or redesign work
- `design-dna/motion-and-delight-rules.md` when motion or delight is involved
- `design-dna/landing-page-craft-rules.md` when landing pages are involved
- `design-dna/mobile-product-rules.md` when mobile product flow is involved
- `design-dna/art-directed-palette-exploration.md` when artistic, cinematic, landing, portfolio, creative, editorial, or experimental mode is active
- `design-dna/unsplash-asset-sourcing-rules.md` when real imagery, Unsplash, or source-image roles are needed
- `design-intelligence/navigation-pattern-guidance.md`
- `design-intelligence/navigation-patterns.json`
- `design-intelligence/composition-originality-guidance.md`
- `design-intelligence/color-guidance.md`
- `design-intelligence/domain-palette-fit-guidance.md`
- `design-intelligence/desktop-command-surface-guidance.md` for desktop command surfaces
- `design-intelligence/visualization-tool-routing.md` when charts, diagrams, maps, canvases, timelines, node graphs, or spatial product objects are involved
- `design-intelligence/spatial-map-ui-patterns.json` when maps, floor plans, seating charts, canvases, or timelines are involved
- `design-intelligence/chart-guidance.md` when charts/data are involved
- `design-intelligence/style-taxonomy.md` when style direction is open
- `design-intelligence/landing-pattern-guidance.md` when landing pages are involved
- `design-intelligence/mobile-product-guidance.md` when mobile product flow is involved
- `templates/visual-spec.template.md`

## Hard Rule

No visual spec = no implementation for visual-heavy tasks.

Literal Target Copy Mode is the exception; it uses a target-copy report and comparison report instead of a new art-direction spec.

Direction selection means build: when Migi chooses A, B, C, says use/go with a direction, or selects a hybrid, that choice is implementation approval unless Migi explicitly says spec only, planning only, do not implement, wait, no code yet, direction selection only, just document it, or do not edit src. The visual spec must treat `docs/design/selected-direction.md` as the implementation source of truth, not as another permission checkpoint.

## Workflow

1. Classify task mode.
2. Declare active design dials.
3. Verify `docs/design/direction-options.md`, `docs/design/direction-layout-maps.md`, `docs/design/direction-risk-check.md`, and `docs/design/selected-direction.md` exist when the No-Image Fast Direction Gate applies.
4. Select references or image-first source.
5. Choose visual mode and layout recipe.
6. Route `skills/domain-realism-mock-data-director/SKILL.md` for app, dashboard, product UI, mobile flow, or dogfood work. Define the Domain Content Contract before layout: business type, users, entities, real pages/routes, route jobs, mock data schema, realistic records, units/ranges/statuses/source labels, and banned generic terms.
7. Define visual thesis.
7. Define design-system token direction.
8. For expressive modes, include safe refined, artistic expressive, and unexpected high-character palette directions.
9. If real imagery is needed, define Unsplash asset sourcing strategy, image roles, search plan, manifest path, crop strategy, alt text, and product-truth notes.
10. If navigation is present in visual-heavy work, require `docs/design/navigation-strategy.md`, 3 navigation concepts, selected pattern, desktop/tablet/mobile behavior, CTA behavior, active state, focus state, selected+hover state, selected+focus state, and generic nav default avoided.
11. Define Domain Palette Fit: product domain, user environment, task pressure, emotional state, state color semantics, and random palette avoided.
12. Define No Placebo Navigation: every nav/tab/filter/segmented control must change visible product state, route, content, scope, or filter.
13. For charts, graphs, maps, diagrams, timelines, canvases, or visual encodings, route `skills/chart-system-director/SKILL.md` and define visualization intent, data contract, chart/tool choice, labels, legends, states, responsiveness, and accessibility.
14. For maps, floor plans, seating charts, timelines, diagrams, pattern canvases, node graphs, or canvas-like product objects, route `skills/diagram-canvas-system/SKILL.md` and define coordinate system, bounds, layer model, object model, label model, collision rules, selection-to-inspector behavior, and whether `tools/diagram-integrity-check.mjs` can run after implementation.
15. For desktop command surfaces, define the primary product object and how support panels stay subordinate.
16. Define image, texture, illustration, chart, motion, mobile, contrast, and responsive strategies.
17. For mobile product work, define modal/sheet fit, bottom nav icon+label strategy, selection-state persistence, control-indicator collision prevention, add/create action differentiation, safe-area behavior, and 390 px proof.
18. Name forbidden drift and scorecard risks.
19. Write `docs/design/visual-spec.md`.
20. If Migi has already selected a direction, continue into `docs/design/design-system-tokens.md`, `docs/design/color-and-contrast.md` or equivalent palette doc, navigation/motion/preflight docs as applicable, and implementation after writing the spec unless the request was explicitly planning-only/no-code.

## Output Contract

Create `docs/design/visual-spec.md` with:

- task mode
- active dials
- Direction Gate Summary
- reference anchors
- visual thesis
- layout skeleton
- design-system tokens
- domain content contract
- real pages/routes and route jobs
- mock data schema, sample records, units/ranges/statuses/source labels
- palette exploration when required
- image role strategy
- texture / illustration role inventory
- text-safe zones for illustration, vector paths, callouts, stems, arcs, and masks
- Unsplash asset sourcing strategy when real imagery is needed
- navigation strategy and selected navigation pattern
- navigation readability strategy when nav overlaps image/type/changing backgrounds
- state contrast matrix for default, hover, focus-visible, active/pressed, selected, selected+hover, selected+focus, and disabled states
- domain palette fit
- no placebo navigation contract
- spatial label safe zones when maps/floor plans/timelines/canvases exist
- desktop command-surface primary object strategy
- identity / brand chrome decision
- decorative geometry strategy
- no ambient blob / dotted texture / amateur vector illustration proof
- line / divider strategy
- chart strategy
- visualization tool routing / library recommendation when charts, diagrams, maps, timelines, canvases, or spatial product objects exist
- data contract for every chart or data-encoding diagram
- diagram/canvas coordinate, layer, object, label lane, callout route, badge-safe-zone, collision, performance, and selection model when spatial UI exists
- diagram integrity QA plan or blocked reason when runnable spatial UI exists
- mobile strategy
- modal / sheet fit strategy for mobile overlays
- mobile navigation icon strategy for practical mobile product bottom nav
- selection state strategy for chips/tabs/filters/object selectors
- control decoration collision check
- add / create action strategy
- interaction strategy
- responsive strategy
- QA/evidence plan
- forbidden drift
- no random mock values, generic app sections, unjustified `mission control`, `topology`, `traces`, or domain-free dashboard panels

For visual-heavy landing, portfolio, marketing, and redesign work, also include:

```md
## Design Read
- page kind:
- audience:
- vibe:
- reference signals:
- selected mode/system:
- quiet constraints:

## Active Dials
- DESIGN_VARIANCE:
- MOTION_INTENSITY:
- VISUAL_DENSITY:
- ART_DIRECTION:
- IMAGE_USAGE_PRIORITY:
- IMPLEMENTATION_CLARITY:

## Direction Gate Summary
- directions proposed:
- selected direction:
- what was rejected:
- what was hybridized:
- why this direction won:

## Palette Exploration
- Palette Direction A: Safe Refined:
- Palette Direction B: Artistic Expressive:
- Palette Direction C: Unexpected High-Character:
- Selected Palette:
- OKLCH/APCA contrast notes:
- what AI-default palette it avoids:

## Anti-AI-Tell Plan
- likely AI defaults for this task:
- banned patterns:
- how the spec avoids them:

## Motion Strategy
- should motion exist?
- frequency profile:
- motion purpose:
- hero/signature moment:
- feedback layer:
- transition layer:
- reduced-motion behavior:

## Delight Strategy
- earned delight moments:
- personality register:
- what delight is avoided:

## Preflight Checklist
- top hard checks before implementation:

## Unsplash Asset Sourcing
- real imagery required?:
- image roles:
- search plan path:
- asset manifest path:
- local/remote image policy:
- crop strategy:
- text safe zones:
- alt text plan:
- source/photographer metadata plan:
- product-truth constraints:

## Texture / Illustration Role Inventory
- ambient light blobs/glows used? no by default:
- dotted/star-field/micro-dot background textures used? no by default:
- if any texture exists, role:
- if any illustration exists, shape inventory:
- shape roles:
- layer stack:
- bounds and anchors:
- responsive behavior:
- accessibility or decorative status:
- text-safe zones:
- label/callout routes:
- proof that paths do not cross readable words:
- proof that words are not clipped:
- Native Tooltip Ban plan:
- Annotation Protected Zone Rule plan:
- Illustration Complexity Honesty Rule plan:
- Background Texture Quality Rule plan:
- rejected AI-default atmosphere:

## Navigation Strategy
- primary destinations:
- secondary destinations:
- navigation concept options:
- selected navigation pattern:
- desktop behavior:
- tablet behavior:
- mobile behavior:
- CTA behavior:
- active state:
- focus state:
- accessibility:
- what generic nav default is avoided:

## Navigation Readability Strategy
- does nav overlap images/type?:
- background states:
- contrast protection:
- scroll-state behavior:
- active/focus state:
- selected+hover state:
- selected+focus state:
- mobile behavior:
- readability risk:
- screenshot checks:

## Domain Palette Fit
- product domain:
- user environment:
- task pressure:
- emotional state:
- domain colors to use:
- domain colors to avoid:
- state color semantics:
- why the palette fits this product:
- what random/cool palette was rejected:

## No Placebo Navigation Contract
- nav/tabs/segmented controls:
- visible content change for each:
- route/scope/filter/state change for each:
- unimplemented destinations removed or disabled:
- active state matches visible product state:

## Spatial Label Safe Zones
- spatial surface type:
- labels needing protection:
- object/card collision risks:
- safe-zone rules:
- z-index/layer rules:
- dynamic collision strategy:
- screenshot checks:

## Desktop Command Surface Primary Object
- primary product object:
- why it owns the screen:
- support panels:
- inspector/queue/control roles:
- how panels avoid burying the object:
- generic card-soup route avoided:

## Identity / Brand Chrome Decision
- visible logo/name needed? yes/no:
- why:
- where identity appears:
- what identity chrome is removed:
- does nav need the app name?:
- does hero already carry identity?:
- Migi preference considered:

## Decorative Geometry Strategy
- are decorative circles/orbits/radar lines used?:
- if yes, are they functional?:
- what do they represent?:
- did Migi explicitly request them?:
- if decorative only, remove them:
- alternative background/composition strategy:

Default answer for Migi projects: Decorative circular/orbital overlays are not used.

## Line / Divider Strategy
- are lines used?:
- functional or decorative?:
- what do they separate?:
- do they align to real layout boundaries?:
- are any decorative hairlines removed?:
- alternative hierarchy method:

Default answer: No decorative hairline ornaments are used.

## Modal / Sheet Fit Strategy
- modal type:
- viewport max-height:
- internal scroll behavior:
- action placement:
- safe-area handling:
- close/dismiss behavior:
- relationship to bottom nav:
- 390px check:
- failure risks:

## Mobile Navigation Icon Strategy
- nav destinations:
- icon family:
- icon per destination:
- label per destination:
- active state:
- badge/counter behavior:
- touch target:
- safe-area handling:

## Selection State Strategy
- selectable controls:
- selected state:
- hover state:
- selected+hover state:
- selected+focus state:
- pressed state:
- focus state:
- disabled state if any:
- persistence behavior:
- accessibility attributes:
- local state source:

## Control Decoration Collision Check
- active indicators:
- underlines/progress strips:
- label safe zones:
- long-label behavior:
- alternative state treatment if bars do not fit:

## Add / Create Action Strategy
- where add action lives:
- visual treatment:
- how it differs from content cards:
- icon:
- label:
- interaction:
- empty state:
- risk of confusion:
```

## Stop Conditions

Stop before coding when:

- active dials are missing
- Three-Direction Mockup Gate applies but `docs/design/direction-options.md` is missing
- Strict 3-Image Direction Gate applies but generated direction images, rendered previews, or explicit Migi-approved blocked fallback are missing
- visual-heavy work has no generated image manifest when image generation succeeded
- Migi has not selected a direction before implementation
- `docs/design/selected-direction.md` is missing after selection or hybrid direction
- Migi selected a direction but the agent treats the spec as awaiting another implementation approval
- design-system direction is missing
- artistic/landing/portfolio/cinematic/experimental work lacks palette exploration
- real imagery is required but Unsplash/search/source plan is missing
- visual spec includes major image roles but no asset manifest/source-truth plan
- references are vague when a folder was specified
- charts lack rationale
- mobile behavior is unspecified for mobile work
- visual-heavy implementation starts without `docs/design/visual-spec.md`
- visual spec starts before the no-image direction gate has produced `docs/design/direction-options.md`, `docs/design/direction-layout-maps.md`, and `docs/design/direction-risk-check.md`
- visual spec treats paid generated images as required for the default workflow
- landing/portfolio/redesign work lacks a design read
- motion is planned without purpose, frequency profile, or reduced-motion behavior
- advanced/cinematic/artistic/portfolio motion is requested but `docs/design/motion-choreography-plan.md` is not required
- advanced motion lacks at least page/section, image/media, typography, navigation/menu, and micro-feedback layers
- motion is central but no motion benchmark/evidence plan exists
- anti-AI-tell preflight is skipped for landing/portfolio/marketing work
- navigation overlaps images, giant type, video, or changing backgrounds without a readability strategy
- domain palette fit is missing for a product UI
- random domain palette is selected because it looks cool
- navigation/tabs/filters change active style without changing visible product state
- chart, graph, map, timeline, or diagram has no data contract
- chart or diagram has no library/tool routing rationale
- chart/diagram state plan lacks empty, loading, or error states when async
- diagram/canvas has no coordinate system, layer model, label model, or collision strategy
- canvas object positions are arbitrary or undocumented
- selectable spatial objects do not update inspector/details
- spatial labels collide with objects/cards/glows or have no safe-zone strategy
- desktop command surface has no central primary product object
- primary product object is buried by support panels/cards
- forced app-name/logo chrome appears without visual-spec justification
- decorative orbital/circular/radar/HUD overlays appear without explicit Migi approval and functional meaning
- ambient light blob, foggy radial glow, soft spotlight haze, or dotted/star-field texture appears as generic atmosphere
- vector illustration has no shape inventory, role map, layer model, bounds, anchors, responsive behavior, or text-safe zones
- illustration lines, stems, arcs, callouts, masks, or paths cross readable words or clip/cut text
- illustration quality reads as amateur, childish, arbitrary, or fake scientific/botanical decoration
- Native Tooltip Ban, Annotation Protected Zone Rule, Illustration Complexity Honesty Rule, or Background Texture Quality Rule is missing when SVG/illustration/texture exists
- decorative separator hairlines or label rails appear without functional line/divider strategy
- mobile modal or bottom sheet fit strategy is missing when mobile overlays exist
- practical mobile product bottom nav lacks an icon+label strategy
- selectable controls lack selected-state persistence strategy
- interactive labels lack readable default/hover/focus-visible/active/selected/selected+hover/selected+focus state plan
- selected+hover or selected+focus makes control text disappear
- add/create action differentiation is missing when creating content is part of the product
- control indicators, active bars, or progress strips have no collision-prevention plan

## Advanced Motion Addendum

When advanced motion is requested, the visual spec must point to `docs/design/motion-choreography-plan.md` and summarize:

- exact motion references
- selected motion tool stack
- signature motion moment
- five motion layers
- section-by-section motion map
- reduced-motion behavior
- motion sequence evidence plan
- `evaluation/benchmarks/motion-cinematic.benchmark.md` review plan

## Direction Gate Summary

The visual spec must include:

```md
## Direction Gate Summary
- direction options:
- direction layout maps:
- direction risk check:
- selected direction:
- what was rejected:
- what was hybridized:
- why selected:
- selected layout map / direction card as source of truth:
- paid/generated images used? yes/no:
- if paid images were used, approval and `--paid-ok` evidence:
- what parts of generated images, if any, must not be copied literally:
```

If no no-image direction options, layout maps, risk check, or selected direction exists, the visual spec is blocked unless Migi explicitly approved skipping the gate. Paid image generation is never required for a valid direction gate.

## Post-Build Review Plan

For product UI or finished-state review, the visual spec should identify whether these post-build layers are required after implementation:

- Evidence-Backed Critique: yes/no and why.
- Text Clarity Review: yes/no and copy-heavy surfaces.
- Production Hardening Review: yes/no and likely edge-case risks.

Do not run these reviews during Fast Direction Gate. They belong after implementation, screenshots, or browser review.

## Signature Interaction Gate

For artistic, brand, portfolio, experimental landing, playful product, and image-led sites, consult `skills/signature-interaction-director/SKILL.md` when references include memorable mechanics such as portal entry, scroll route choreography, mascot motion, scroll-assembled cards, editorial list modals, media constellations, directional page transitions, or playful entry gates.

Rules:
- Select one signature interaction before implementation, or explicitly justify why none is appropriate.
- Extract mechanics, not brand skin. Do not copy logos, mascots, names, colors, exact content, or proprietary media.
- Include the selected mechanic in the visual spec when chosen.
- Final review must check whether the signature mechanic is visible, meaningful, accessible, and supported by reduced motion.
- If no signature interaction appears after award-level references, final verdict cannot be "masterpiece."
- Generic section stack after signature references is a hard failure.

## Sepia Archive Brown Ban

The visual spec must explicitly reject the muddy sepia/espresso/umber brown-black archive wash for Migi projects.

Add to palette notes when expressive/artistic work is involved:

```md
## Sepia Archive Brown Ban
- sepia/espresso/umber brown-black archive wash used? no:
- major surfaces checked: page / stage / cards / panels / notes / command containers / nav / sidebar / drawers / modals / containers:
- rejected aliases: nocturne / archive / field guide / botanical / brass / tobacco / parchment / vintage / cinematic / commander / incident / operational / premium:
- replacement palette strategy:
```

If the selected direction uses the banned surface family, the visual spec is blocked until the palette is redesigned.

## Illustration-First Gate

For illustration-heavy work, the visual spec is blocked until the agent has created isolated illustration assets before full-page implementation.

Required gate outputs:

- `docs/design/illustration-art-direction.md`
- `docs/design/illustration-style-guide.md`
- `docs/design/illustration-asset-options.md`
- at least 1 isolated hero illustration component or SVG
- `docs/qa/illustration-gate-review.md`

Stop after the illustration gate unless explicitly instructed to continue.

The visual spec must not greenlight full-page implementation if the illustration looks amateur, uses primitive shapes with no detail system, has weak silhouette, poor linework, generic texture/material, missing reference grammar, or needs but lacks Migi approval.

## No Ambient Background Blobs

The visual spec must reject large vague background blobs, ghost ellipses, generic radial glows, random translucent ovals, fake lens shapes, generic dot/star fields, decorative orbits/HUD lines, and abstract atmosphere shapes unless they are the primary product object, part of the selected signature interaction, directly derived from an approved reference mechanic, or explicitly named in the shape inventory with role, layer, and purpose.

## Botanical / Organic Illustration Minimum Bar

For botanical, animal, human, mascot, character, and organic illustration, the visual spec must include reference grammar, silhouette study, linework strategy, detail budget, material/texture strategy, simplification strategy, and what makes the subject believable. Botanical plates must include stem structure, leaf/petal hierarchy, asymmetry, vein/detail strategy, root/stem/petal relationship, botanical label/callout safe zones, and distinct species silhouettes.

## Layout Integrity Gate

The visual spec must include text/container integrity, nav responsiveness, and whitespace density plans before visual-heavy implementation.

Required:

- text-fit strategy for stickers, cards, badges, buttons, tabs, nav, modals, and panels
- protected text zones for any overlay, sticker, card, image, or decorative object near critical text
- desktop/tablet/mobile nav variants
- label-to-icon/collapse/wrap/scroll behavior when nav space is constrained
- purposeful whitespace rationale for large empty areas
- breakpoint proof plan for 1440, 1280, 1024, 768, and 390

The visual spec is blocked if it permits clipping text to preserve composition, fixed-width dynamic nav pills, labels inside circles without tested lengths, or huge blank regions with no compositional purpose.

## Elite Scroll Choreography Routing

When a landing, brand, portfolio, editorial, playful product, or video-first site depends on scroll as the experience, route to skills/elite-scroll-choreography-director/SKILL.md before implementation. The selected scroll pattern must appear in the visual spec, and skills/scroll-choreography-review/SKILL.md must run after implementation.

Block fade-only scroll when elite scroll was requested, pinned blank frames, moving objects covering critical text, horizontal routes without mobile fallback, scroll-to-assemble claims where objects do not visibly assemble, and scroll navigation that does not sync to chapters. Run layout-integrity review after scroll-choreography review.

## Audit Upgrade: Self-Correction Contract

Audit fix: Stop acting as a mega-skill; delegate specialist sections explicitly.

Required evidence:
- specialist route table, skipped-specialist rationale, artifact checklist, and evidence plan.

Repair routing:
- missing chart, motion, illustration, mobile, layout, copy, or hardening sections route to the relevant specialist skill.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "visual-spec-compiler"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

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

For mobile route/app experiences, the visual spec must define persistent bottom navigation / bottom route controller behavior by default.

The spec must include:

- desktop, tablet, and mobile nav variants
- bottom nav or approved bottom-accessible alternative
- icon strategy
- active label strategy
- safe-area handling
- aria-label/full label strategy
- scroll behavior
- screenshot proof requirements at 390, 430, 640, and 768

## Detail Reveal Spatial Context Requirement

For any card/item/detail interaction, the visual spec must define how the selected trigger remains connected to the revealed content.

The spec must include:

- trigger type
- reveal pattern
- spatial relationship
- selected state
- detail position
- close behavior
- focus behavior
- mobile behavior
- accessibility labels
- data hooks

Do not greenlight implementation when detail placement is undefined.

## No Fake Live Affordances

The visual spec must not include `LIVE`, live feed, realtime, presence, online, activity feed, pulsing dots, or recording badges unless real live behavior is part of the product requirement and data/update cadence is documented.

## No AI Theater Chrome

The visual spec must not include decorative `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Mission Room`, `Case File`, `CL-####`, dossier, operation, or fake severity/status chips unless they are real product objects with documented behavior.

Use clear route/task labels instead of generated incident drama.

## Offset Container Alignment

The visual spec must define offset direction, offset amount, radius tokens, clipping behavior, and corner inspection requirements for layered containers, media backplates, offset cards, and framed objects.

## Navigation Active State Correctness

The visual spec must define nav item ids, nav targets, active source-of-truth, active visual state, `aria-current`/`aria-selected` behavior, and click-through QA for every nav item. Prefer `activeNavId` over `activeIndex`.

First and last nav items must be included in active-state QA. No trailing item such as Booking/Book may be skipped.

## Brand Chrome Readability

If visible app name, wordmark, logo text, initials, or brand chrome is used, the visual spec must define its background/readability strategy.

Dark bands, imagery, video, gradients, and scroll-changing backgrounds require a stable surface, plate, scrim, adaptive token, image safe zone, or explicit decision to move/remove brand chrome.

## Human Dashboard Palette And Route Architecture

For dashboard, command-center, incident, observability, monitoring, analytics, and operational products, the visual spec must include:

- Human Dashboard Palette Strategy
- Dashboard Route Architecture
- task inventory
- route map
- route jobs
- approved dashboard reference anchors
- material range
- attraction zone
- calm/busy rhythm
- why the palette avoids robotic AI dark-mode defaults
- why the information architecture avoids one-page process pileup

Do not greenlight dashboard implementation when palette and route architecture are undefined.

## WebGL / Shader Primitive Spec Requirement

If the design proposes WebGL, shaders, ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo effects, animated premium gradients, or shader-based atmosphere, the visual spec must read `design-dna/webgl-shader-visual-primitives-rules.md` and route `skills/webgl-shader-primitives/SKILL.md`.

The spec must include:

- exact section/component using the primitive
- product/concept reason
- rejected non-WebGL alternative
- dependency/version plan
- client-only boundary for React/Next
- static fallback
- reduced-motion fallback
- mobile behavior
- bounded canvas/GPU area
- z-index containment
- pointer-event strategy
- fake-live avoidance
- performance note
- screenshot proof requirements

Do not greenlight WebGL if it is generic decoration, hides weak hierarchy, owns layout, makes text depend on motion timing, ignores reduced motion, or lacks static/mobile fallback.
