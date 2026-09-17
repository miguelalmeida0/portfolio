# Implementation After Selected Direction Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Preconditions:

- `docs/design/direction-options.md` exists.
- `docs/design/direction-layout-maps.md` exists.
- `docs/design/direction-risk-check.md` exists.
- Migi selected A, B, C, or a hybrid.
- `docs/design/selected-direction.md` exists or must be created before implementation.

When Migi chooses A, B, C, or a hybrid, proceed immediately to implementation. Do not stop after selected-direction.md. Do not ask for another confirmation unless Migi explicitly requested planning-only/spec-only/no-code.

Required reading:

- `AGENTS.md`
- `design-dna/00_COMPACT_AGENT_CONTEXT.md`
- `docs/architecture/design-os-operating-model.md`
- `docs/routing/skill-routing-map.md`
- relevant benchmark from `evaluation/benchmarks/`
- relevant skills for the selected mode

Before coding:

1. Confirm selected direction.
2. Create or update `docs/design/selected-direction.md`.
3. Confirm the no-image direction gate artifacts exist and identify the selected layout map as the implementation north star.
4. Route `skills/domain-realism-mock-data-director/SKILL.md` and create a Domain Content Contract: business type, users, entities, real pages/routes, route jobs, mock data schema, realistic records, units/ranges/statuses/source labels, and banned generic terms.
5. Create `docs/design/visual-spec.md` with the Domain Content Contract included.
6. Create `docs/design/design-system-tokens.md`.
7. Create `docs/design/color-and-contrast.md` or an equivalent palette doc with OKLCH/APCA reasoning.
7. If real imagery is required, create `docs/design/unsplash-search-plan.md` and `docs/design/unsplash-asset-manifest.md` before implementation.
8. Create `docs/design/navigation-strategy.md` when navigation is present; implement only the selected navigation system.
9. If advanced/cinematic/scroll/portfolio motion is requested, create `docs/design/motion-choreography-plan.md`, choose a tool stack, and define reduced-motion behavior before implementation.
10. If Anime.js, timeline choreography, staggered DOM/SVG/object motion, CSS variable animation, weather/terrarium particles, selected-state transitions, rail/detail continuity, or tactile JavaScript feedback is proposed, read `design-dna/animejs-motion-primitive-rules.md`, route `skills/animejs-motion-director/SKILL.md`, and answer `prompts/dogfood/animejs-motion-gate.md` before implementation.
11. If WebGL, shaders, ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo effects, animated premium gradients, or shader atmospheres are proposed, read `design-dna/webgl-shader-visual-primitives-rules.md`, route `skills/webgl-shader-primitives/SKILL.md`, and answer `templates/prompts/webgl-shader-primitives-gate.md` before implementation.
12. Create `docs/qa/anti-ai-tell-preflight.md` for landing, portfolio, marketing, or redesign work.
13. Document navigation readability, identity chrome, decorative geometry, and line/divider decisions in the visual spec or related docs.
14. Document domain palette fit, no-placebo navigation behavior, chart/diagram data contracts, visualization tool routing, spatial canvas coordinate/layer/object/label/collision models, diagram-integrity detector plan, and desktop command-surface primary object strategy when applicable.
15. Define screenshot QA targets.

Hard bans:

- no unreadable navigation over images/giant type/changing backgrounds
- no forced app-name/logo/initials chrome
- no decorative circular/orbital/radar/HUD line overlays
- no fake sonar rings or generic orbit graphics
- no decorative hairline/separator ornaments
- no red divider lines as fake editorial detail
- no section-label-plus-line filler
- no cut-off mobile sheets or hidden modal actions
- no active/underline/progress bars overlapping labels
- no selectable chips/items with missing selected state
- no text-only bottom nav in practical mobile product flows unless justified
- no add-new cards styled like content cards
- no badges/counters overlapping nav labels/icons
- no random domain palettes chosen just because they look cool
- no placebo navigation where selected tabs/nav do not change visible product state
- no map/floor-plan/timeline/canvas label collisions
- no decorative/fake charts, arbitrary canvas object placement, missing data contracts, missing layer models, or missing data-viz hardening review
- no desktop command surface that buries the primary product object in card soup
- no random mock values, generic app sections, fake command labels, or domain-free dashboard panels
- no `mission control`, `topology`, `traces`, or `system map` unless the product domain and data contract justify them
- no app/dashboard/product UI implementation without a Domain Content Contract
- no Anime.js motion unless CSS is insufficient, selectors are scoped, cleanup is planned, reduced-motion fallback exists, and screenshot proof is planned
- no WebGL/shader effect as generic decoration, fake live/status theater, pointer trap, or substitute for layout, typography, hierarchy, accessibility, responsiveness, or product clarity

Implementation:

1. visual shell
2. core local aha moment
3. visible interactions
4. mobile/product integrity when applicable: sheet fit, icon+label bottom nav, persistent selection, distinct add/create affordance, no control indicator overlap
5. responsive adaptation
6. polish pass

QA:

- build/lint when available
- screenshots at benchmark-required breakpoints
- motion sequence capture or blocker when motion is central
- specialist review
- text clarity review when copy-heavy product UI exists
- production hardening review before production-ready claims
- evidence-backed critique when Migi asks for critique or the UI is a dogfood/final state
- benchmark scoring
- done report

Final response:

- selected direction
- direction layout maps / risk check
- Unsplash search plan / asset manifest when applicable
- navigation strategy / selected navigation pattern
- motion-choreography plan / motion evidence when applicable
- files changed
- build/lint result
- local dev server URL if running
- interactions verified
- screenshots or blocker
- benchmark score
- scorecard caps
- evidence-backed critique / text clarity / production hardening status when relevant
- remaining weaknesses

## Required Layout Integrity Final Checks

Before final handoff, verify:

- no text clipping
- no words cut
- no nav label overflow
- no sticker/card covering headline words
- no accidental blank viewport area
- no floating label/card/sticker drift or overlap at intermediate widths
- no detail panel disconnected from clicked/selected trigger
- no mobile route/app navigation that disappears on scroll
- mobile route/app navigation uses persistent bottom nav or bottom-accessible controller by default
- no fake live labels/icons/dots unless real live behavior exists
- inspect layered media/container corners
- offset/backplate must be geometrically clean
- app name/brand chrome must remain readable over dark or variable backgrounds
- dashboard/command-center palette must not read as dull robotic AI dark mode
- real business sections and pages/routes exist; mock data uses domain entities, plausible records, units, statuses, and source/freshness labels
- dashboard routes must carry distinct product jobs instead of one-page process pileup
- approved elite dashboard references must be visibly transferred into palette, material range, attraction zone, route focus, and panel hierarchy
- click every nav item and verify the clicked item becomes active
- verify first and last nav items become active
- no adjacent/right-side active-state mismatch
- final UI integrity v3 width sweep checked from 360 to 1920 at 40px steps or smaller when practical
- height matrix checked at 720, 844, 900, and 1080
- scroll samples checked at 0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, and 1.00 when scroll/sticky/pinned content exists

Run `skills/layout-integrity-review/SKILL.md` after screenshots exist. Screenshot contradiction beats agent self-report.

## Late Check FM Media Placement Guardrails

- Apply the hero-only media default: video belongs in the top stage unless a later role is explicit.
- Enforce media never over text: media cannot cover headline, body, CTA, nav, labels, captions, or card content.
- Enforce no container thinning to fit media: content cards keep readable minimum widths.
- Content wins over media: text, CTAs, nav, and card readability beat any media object or scroll gimmick.
- Persistent video overlay is a hard blocker unless a reserved media lane, protected-zone map, and screenshot proof exist.

## Compact Navigation Icon Fallback

- compact nav must use icon fallback or a real menu pattern
- no arbitrary two-letter nav abbreviations
- active compact nav item must be understandable
- accessible labels are required for icon-only or visually-shortened items
- small-screen screenshots are required at 768 and 390

## Anchored Detail Reveal

- detail reveal must be anchored to clicked item or use an explicit sheet/drawer/full-screen pattern with selected-item context
- use `data-detail-trigger`, `data-detail-panel`, `data-detail-for`, and `data-selected-item` where practical
- final handoff is blocked if the detail panel is spatially lost

## Persistent Mobile Bottom Navigation

- mobile app/route nav must be persistent bottom by default
- mobile nav must remain accessible after scroll
- bottom nav must respect safe area and preserve accessible full labels
- final handoff is blocked if mobile route nav disappears on scroll

## Fake Live / Offset Containers / Nav Active State

- no fake live labels unless real live behavior exists
- no fake live icons/dots
- no decorative realtime/status copy
- no decorative narrative/replay/mission/case-file chrome
- no oversized replay/status metadata strip
- no fake case-file or dossier identifier
- no sepia/espresso/umber card, panel, note, nav, sidebar, stage, or command-container surface
- inspect layered media/container corners
- offset/backplate must be geometrically clean
- app name/wordmark needs a stable contrast strategy over image/dark/variable backgrounds
- click every nav item and verify the clicked item becomes active
- first and last nav items must be included
- final handoff is blocked if adjacent/right-side nav active-state mismatch remains

## Human Dashboard Palette And Route Architecture

- dashboard palette must be reference-driven and domain-specific, not one-note navy/blue-grey/cyan technical furniture
- command centers need material range, attraction zone, panel hierarchy, and calm/busy rhythm
- complex operational workflows need route decomposition before layout
- every nav route must have a distinct task job and visible scope change
- final handoff is blocked if dashboard work looks AI-created even without overlap/clipping bugs

## Final UI Integrity Gate

Before final handoff:

1. Run build/lint.
2. Capture screenshots/checks across the final UI integrity v3 width sweep, height matrix, and required scroll samples.
3. Run scroll-choreography-review if scroll-heavy.
4. Run layout-integrity-review.
5. Run final-ui-integrity-gate.
6. Run final scorecard.

Do not claim success if clipped text, viewport-edge clipping, partially visible active panels, horizontal scroll partial content, overlap, floating object drift, nav overflow, media/text collision, accidental blank space, fixed overlay collision, or the user's original complaint remains visible at any sampled width, height, scroll position, or state. If the final UI integrity gate is failed or blocked, fix the UI and rerun validation before responding.
