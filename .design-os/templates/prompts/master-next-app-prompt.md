# Master Next App Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:

- `source-projects/`
- `captures/`
- `raw-chat-input/`

Design OS requirement:
Use Miguel Design OS from `.design-os` if embedded in the project, otherwise use `/Users/malmeida/Desktop/miguel-design-os`.

Critical domain realism requirement:
Before visual spec or implementation, create a Domain Content Contract. Define business type, real users, core entities, real pages/routes, route jobs, realistic mock data schema and sample records, metric units/ranges/statuses/source labels, and banned generic terms. No random values, no generic `mission control`, no unjustified `topology` / `traces`, and no one-page pileups where real business pages are needed.

## Reading List

1. `AGENTS.md`
2. `design-dna/00_COMPACT_AGENT_CONTEXT.md`
3. `docs/architecture/design-os-operating-model.md`
4. `docs/routing/skill-routing-map.md`
5. `visual-library/README.md`
6. relevant benchmark from `evaluation/benchmarks/`
7. relevant visual-library approved/rejected references

## Mandatory First Step: No-Image Fast Direction Gate

Default to No-Image Fast Direction Gate unless Migi explicitly asks for deep exploration, full strategy, research, benchmark, reference decomposition, or full spec before selection. Read `design-dna/NO_IMAGE_DIRECTION_GATE_CONTEXT.md` and `design-dna/FAST_DIRECTION_GATE_CONTEXT.md` first.

Before implementation, create no-image direction artifacts for:

- Direction A - Safe Refined
- Direction B - Artistic Expressive
- Direction C - Unexpected High-Character

Required:

- `docs/design/direction-options.md`
- `docs/design/direction-layout-maps.md`
- `docs/design/direction-risk-check.md`

Each direction must be concise: name, product thesis, domain palette rationale, layout structure, ASCII/block layout map, navigation model, primary product object, interaction model, what it avoids, likely failure risk, implementation complexity, and recommendation score. Maximum 200 words per direction.

Do not create `docs/design/visual-spec.md`, design-system token docs, color/contrast docs, navigation strategy, motion plan, Unsplash manifest, QA docs, build/lint reports, screenshots, or frontend code before selection unless this prompt is explicitly running Deep Direction Gate.

If all three directions use the same navigation structure, the direction gate fails.

Hard bans:

- no unreadable navigation over images/giant type/changing backgrounds
- no forced app-name/logo/initials chrome
- no decorative circular/orbital/radar/HUD line overlays
- no fake sonar rings or generic orbit graphics
- no ambient light blobs, foggy radial glow, soft spotlight haze, or "cool advanced UI" background smears
- no dotted/star-field/micro-dot background textures as generic atmosphere
- no amateur vector illustration, fake botanical/scientific plates, arbitrary petals/stems, or illustration paths crossing text
- no decorative hairline/separator ornaments
- no red divider lines as fake editorial detail
- no section-label-plus-line filler
- no cut-off mobile sheets or hidden modal actions
- no active/underline/progress bars overlapping labels
- no selectable chips/items with missing selected state
- no selected nav/tab/chip/card/button state whose hover or focus makes text disappear
- no text-only bottom nav in practical mobile product flows unless justified
- no add-new cards styled like content cards
- no badges/counters overlapping nav labels/icons
- no random domain palettes chosen just because they look cool
- no muddy sepia/espresso/umber brown-black archive wash as page, stage, container, card, panel, sidebar, or nav background
- no sepia/espresso/umber brown-black operational note, command container, detail panel, drawer, modal, or framed-object surface
- no "nocturne/archive/field-guide/botanical/brass/tobacco/parchment/vintage/premium" rationale for that same banned brown-black surface family
- no placebo navigation where selected tabs/nav do not change visible product state
- no map/floor-plan/timeline/canvas label collisions
- chart/diagram/canvas system present when charts, maps, timelines, diagrams, or spatial product objects exist
- no desktop command surface that buries the primary product object in card soup
- no random mock values, generic app sections, fake command labels, or domain-free dashboard panels
- no `mission control`, `topology`, `traces`, or `system map` unless the product domain and data contract justify them
- no visual spec or implementation without a Domain Content Contract for app/dashboard/product UI
- no Anime.js motion unless CSS is insufficient, scoped cleanup is planned, reduced-motion fallback exists, and screenshot proof is planned
- no WebGL/shader/ShaderGradient/R3F effect as generic decoration, fake live/status theater, or a substitute for layout, typography, hierarchy, accessibility, responsiveness, or product clarity

No paid API calls during the default direction gate. Paid image generation may only run if Migi explicitly writes `I approve paid API image generation for this run.` and the command includes `--paid-ok`. Do not code before selection.

## Figma Cost Safety

If Figma work is requested, use only normal Figma Plugin API operations: pages, frames, vectors, shapes, text, variables if available, styles, components, node metadata, and storyboard frames.

Do not use Figma AI, Figma Weave, Figma Make, paid generation, AI credits, Figma Motion, Figma Draw, Dev Mode-only operations, or paid-seat Figma features. If the requested operation requires one, stop and report exactly:

`Blocked: this requires a paid or plan-gated Figma feature.`

After selection, create `docs/design/selected-direction.md`.

Before visual spec, route `skills/domain-realism-mock-data-director/SKILL.md` and record the Domain Content Contract in `docs/design/visual-spec.md` or `docs/design/domain-content-contract.md`.

## Direction Selection Behavior

- First pass: generate directions and stop.
- User selection: treated as approval to build.
- After selection: create `docs/design/selected-direction.md`, `docs/design/visual-spec.md`, `docs/design/design-system-tokens.md`, `docs/design/color-and-contrast.md` or equivalent palette doc, navigation/motion/preflight docs as applicable, then implement.
- Do not ask again unless user says planning-only.

When Migi chooses A, B, C, or a hybrid, proceed immediately to implementation. Do not stop after selected-direction.md. Do not ask for another confirmation unless Migi explicitly requested planning-only/spec-only/no-code.

## Active Dials

Declare:

- DESIGN_VARIANCE
- MOTION_INTENSITY
- VISUAL_DENSITY
- ART_DIRECTION
- IMAGE_USAGE_PRIORITY
- IMPLEMENTATION_CLARITY
- MOBILE_NATIVE_FEEL when mobile matters
- GRAPH_COMPLEXITY when charts/data matter

## Reference / Image-First Lock

If references are used:

- select exact anchors
- create `docs/design/reference-decomposition.md`
- create `docs/design/design-transfer-spec.md`
- declare image roles
- do not copy screenshots as production assets

## Signature Interaction Gate

For artistic, brand, portfolio, experimental, image-led, or award-reference work, route `skills/signature-interaction-director/SKILL.md` before implementation.

- Choose one signature interaction, or explicitly justify why none fits.
- Extract mechanics from references, not logos, characters, names, copy, or brand styling.
- Document the interaction story, motion choreography, accessibility fallback, and reduced-motion fallback in the visual spec.
- Do not ship a generic section stack after references with portal entries, playful gates, mascot motion, scroll-assembled cards, kinetic poster boards, cinematic media constellations, or custom detail modals.
- Do not use a playful gate for high-frequency utility work where it slows the task.

## Unsplash Asset Sourcing

If real imagery is required:

- create `docs/design/unsplash-search-plan.md`
- define image roles
- search with query, orientation, optional color, `content_filter`, and `order_by`
- select images based on art direction, crop quality, palette fit, and source truth
- download locally when possible or document remote URLs explicitly
- create `docs/design/unsplash-asset-manifest.md`
- include photographer, source page, download metadata, alt text, crop strategy, and product-truth notes
- verify responsive crops and text safe zones
- do not use placeholder, fake, or generic filler imagery

## Visual Spec

Create `docs/design/visual-spec.md` with:

- Direction Gate Summary
- selected mode
- selected direction
- reference mechanics
- navigation readability strategy
- state contrast matrix for default, hover, focus-visible, active/pressed, selected, selected+hover, selected+focus, and disabled states
- texture / illustration role inventory
- text-safe zones for illustration and vector paths
- domain palette fit
- no placebo navigation contract
- spatial label safe zones when maps/floor plans/timelines/canvases exist
- visualization tool routing, data contract, chart-system plan, and data-viz hardening plan when charts/graphs/data visuals exist
- diagram/canvas coordinate system, layer model, object model, label model, collision strategy, selection/inspector behavior, and responsive fallback when spatial product objects exist
- label lanes, callout routes, badge safe zones, construction-line semantics, and performance budget when pattern canvases or dense diagrams exist
- diagram integrity detector plan or blocked reason when runnable spatial UI exists
- desktop command-surface primary object strategy
- identity chrome decision
- decorative geometry strategy
- no ambient blob / dotted texture / amateur illustration proof
- line/divider strategy
- modal/sheet fit strategy when mobile overlays exist
- mobile nav icon+label strategy for practical product apps
- selection state strategy for chips/tabs/filters/object selectors
- selected+hover and selected+focus contrast proof for chips/tabs/filters/object selectors
- control decoration collision check
- add/create action differentiation
- palette exploration when expressive mode applies
- banned sepia/espresso/umber surface wash check
- layout strategy
- responsive strategy
- motion strategy
- benchmark target

## Navigation Exploration

Before implementation:

1. Create `docs/design/navigation-strategy.md`.
2. Propose at least 3 navigation concepts.
3. Select one based on the chosen design direction.
4. Document desktop, tablet, and mobile behavior.
5. Define CTA/nav relationship, active state, focus state, and accessibility notes.
6. Implement only the selected navigation system.

## Design-System Tokens

Define semantic tokens before UI code:

- colors
- typography
- spacing
- radius
- shadow/elevation
- borders/dividers
- chart/state colors
- state contrast pairs for default, hover, focus-visible, active/pressed, selected, selected+hover, selected+focus, and disabled
- component variants
- image treatment
- motion rules

## OKLCH/APCA Contrast

Run a palette pass before final palette approval. Repair contrast by changing OKLCH lightness, not random hex guessing.

## Implementation

Build the frontend aha moment first:

- truthful mock data in data files
- visual shell
- core local loop
- visible interactions working locally
- no backend unless requested

## QA

Run build/lint when available. Capture screenshot evidence at required breakpoints. Run the relevant benchmark, scorecard, specialist reviews, and done report.

For post-build review, route:

- `evidence-backed-critique` when Migi asks for critique, screenshots are uploaded for review, or a dogfood UI reaches final state
- `text-clarity-review` before calling copy-heavy product UI final
- `production-hardening-review` before calling product UI production-ready

## Advanced Motion Gate

If the task asks for advanced animations, cinematic motion, artistic motion, Awwwards/Godly/Recent-level motion, scroll animation, appearing while scrolling, or portfolio motion:

1. Read `skills/advanced-motion-choreography/SKILL.md`.
2. Name exact motion references.
3. Create `docs/design/motion-choreography-plan.md`.
4. Choose a tool stack from `design-intelligence/motion-tool-stack-guidance.md`.
5. Implement at least page/section, image/media, typography, navigation/menu, and micro-feedback layers when feasible.
6. Capture a motion sequence with `tools/capture-motion-sequence.mjs` or document the blocker.
7. Run `skills/review-animations/SKILL.md`.
8. Score against `evaluation/benchmarks/motion-cinematic.benchmark.md`.

## Anime.js Motion Gate

If the selected direction proposes Anime.js, timeline choreography, staggered DOM/SVG/object motion, CSS variable animation, weather/terrarium particles, selected-state transitions, rail/detail continuity, or tactile JavaScript feedback:

1. Read `design-dna/animejs-motion-primitive-rules.md`.
2. Route `skills/animejs-motion-director/SKILL.md`.
3. Answer `prompts/dogfood/animejs-motion-gate.md` before coding.
4. Document why CSS is not enough, exact components, signature motion moment, scoped root refs, cleanup plan, reduced-motion fallback, mobile behavior, fake-live avoidance, unsafe-scroll avoidance, and screenshot proof.

## WebGL / Shader Primitive Gate

If the selected direction proposes WebGL, shaders, ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo effects, animated premium gradients, or shader atmospheres:

1. Read `design-dna/webgl-shader-visual-primitives-rules.md`.
2. Route `skills/webgl-shader-primitives/SKILL.md`.
3. Answer `templates/prompts/webgl-shader-primitives-gate.md` before coding.
4. Document exact section, product reason, dependency/version plan, static fallback, reduced-motion behavior, mobile behavior, bounded canvas/GPU area, pointer-event strategy, fake-live avoidance, performance note, and screenshot proof plan.
5. Treat Liquid Logo as source/reference only, not a normal npm dependency.

## Final Response Contract

- skills used
- benchmark used
- direction options / selected direction
- implemented selected direction
- visual spec
- design-system tokens
- texture / illustration role inventory
- OKLCH/APCA palette pass
- state contrast matrix / selected-hover proof
- interactions verified
- build/lint result
- local dev server URL if running
- Unsplash search plan / asset manifest when applicable
- navigation strategy / selected navigation pattern
- motion-choreography plan / motion evidence when applicable
- screenshots or blocker
- benchmark score
- scorecard caps
- evidence-backed critique / text clarity / production hardening status when relevant
- files changed
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
- no fake `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Case File`, `CL-####`, dossier, operation, or severity/status theater unless backed by real product behavior
- no sepia/espresso/umber card/panel/container surface; visible sepia containers cap final score at 2
- inspect layered media/container corners
- offset/backplate must be geometrically clean
- app name/brand chrome must remain readable over dark or variable backgrounds
- dashboard/command-center palette must not read as dull robotic AI dark mode
- dashboard routes must carry distinct product jobs instead of one-page process pileup
- approved elite dashboard references must be visibly transferred into palette, material range, attraction zone, route focus, and panel hierarchy
- click every nav item and verify the clicked item becomes active
- verify first and last nav items become active
- no adjacent/right-side active-state mismatch
- final UI integrity v3 width sweep checked from 360 to 1920 at 40px steps or smaller when practical
- height matrix checked at 720, 844, 900, and 1080
- scroll samples checked at 0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, and 1.00 when scroll/sticky/pinned content exists

Run `skills/layout-integrity-review/SKILL.md` after screenshots exist. If a runnable URL exists, run `tools/layout-integrity-check.mjs --url <url> --out docs/qa/layout-integrity/ --width-sweep 360:1920:40 --heights 720,844,900,1080` or document why blocked.

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
