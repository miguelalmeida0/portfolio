# New App Generation Rules

Use this file before coding a new app, feature, or screen.

## Task Classification

Classify before work:

- bug fix
- technical refactor
- visual-heavy UI
- new app
- redesign
- selection/gallery/roster/product-discovery experience
- literal target copy
- landing-page/artistic/creative/image-led experience
- reference-folder mode
- data visualization / chart system
- visual style selection
- image-first website / landing page
- Unsplash / real image asset sourcing
- navigation art direction
- frontend aha moment
- design-system-first implementation
- visual spec compilation
- dogfood target

Small bug fixes, security patches, copy edits, and purely technical refactors do not require the Visual Concept Gate unless they change a visually important UI direction.

## Mandatory Start

Default direction gate mode is No-Image Fast Direction Gate. For normal first-pass new app/design tests, read `design-dna/NO_IMAGE_DIRECTION_GATE_CONTEXT.md` and `design-dna/FAST_DIRECTION_GATE_CONTEXT.md` and avoid loading the full planning stack unless Migi asks for deep exploration, full strategy, research, benchmark, reference decomposition, or implementation after selection.

1. Read `design-dna/00_COMPACT_AGENT_CONTEXT.md`.
2. Read `system.md` and `design-system.json`.
3. Read relevant `rules/*.md`, `skills/*/SKILL.md`, and `design-dna/*.md`.
4. Classify the task.
5. Inspect the current project type, framework, routes, components, styling system, and existing tokens.
6. For every new app, dashboard, product UI, mobile flow, or dogfood project, route `skills/domain-realism-mock-data-director/SKILL.md` and create a Domain Content Contract before visual spec or implementation. Define business type, users, core entities, real pages/routes, route jobs, mock data schema, realistic sample records, metric units/ranges/statuses/source labels, and banned generic terms. Do not proceed with random values, abstract `mission control`, `topology`, `traces`, or fake command-center language unless the product domain and data contract justify them.
6. If Literal Target Copy Mode is active, skip the Visual Concept Gate and build only the target-parity shell.
7. If Migi points to a visual-library reference folder, select the matching Reference Folder Mode before choosing a layout.
8. If Migi asks to use a specific visual-library folder or screenshot set as the design basis, activate Reference-Locked Build Mode before choosing a layout.
9. If Migi asks for landing page, creative, artistic, cinematic, editorial, visual-heavy, image-led, landing-page inspiration, or creative inspiration, activate Landing Page / Artistic Mode before choosing a layout.
10. If visual-heavy work uses visual-library references, create `docs/design/reference-usage-report.md` before coding.
11. Declare active design dials from `design-dna/design-generation-dials.md`.
12. If this is a new visual-heavy app, landing page, portfolio, mobile app, dashboard redesign, or artistic interface with no approved direction, run Fast Direction Gate: create 3 distinct directions and stop for Migi to choose during the first pass.
13. Before direction approval for new visual-heavy work, create `docs/design/direction-options.md`, `docs/design/direction-layout-maps.md`, and `docs/design/direction-risk-check.md`. Do not call paid image APIs. Do not create visual spec, token docs, QA docs, build/lint reports, screenshots, or frontend code before selection unless Migi explicitly asked for Deep Direction Gate.
14. After Migi chooses A, B, C, or a hybrid, treat the selection as implementation approval unless the message explicitly says spec only, planning only, do not implement, wait, no code yet, direction selection only, just document it, or do not edit src.
15. Create/update `docs/design/selected-direction.md`, then continue immediately into `docs/design/visual-spec.md`, `docs/design/design-system-tokens.md`, `docs/design/color-and-contrast.md` or an equivalent palette doc, implementation, validation, and local URL handoff when a dev server starts.
16. If visual-heavy, route `skills/visual-spec-compiler/SKILL.md` and create `docs/design/visual-spec.md` before implementation.
17. Define design-system direction from `design-dna/design-system-first-rules.md` before significant UI implementation.
18. If artistic, cinematic, landing, portfolio, creative, editorial, or experimental mode is active, read `design-dna/art-directed-palette-exploration.md` and include 3 palette directions before locking tokens.
19. If color tokens, contrast repair, dark mode, chart colors, interactive state contrast, or color accessibility matter, route `skills/oklch-contrast-palette/SKILL.md` and check OKLCH/APCA before final palette approval.
20. If Figma work is requested, read `design-dna/figma-cost-safety-rules.md` first. Use only normal Figma Plugin API operations: pages, frames, vectors, shapes, text, variables if available, styles, components, node metadata, and storyboard frames. Do not use Figma AI, Figma Weave, Figma Make, paid generation, AI credits, Figma Motion, Figma Draw, Dev Mode-only operations, or paid-seat features. If the request requires one, stop and report exactly: `Blocked: this requires a paid or plan-gated Figma feature.`
21. Define Domain Palette Fit for every product UI: product domain, user environment, task pressure, emotional state, state-color semantics, and what random "looks cool" palette is rejected. Explicitly reject the muddy sepia/espresso/umber brown-black archive wash for page backgrounds, stages, containers, cards, panels, sidebars, navigation bars, operational notes, and command containers. Do not rationalize it as nocturne, archive, field guide, botanical, brass, tobacco, parchment, vintage, cinematic, commander, incident, operational, or premium.
22. If real imagery, Unsplash, or source-image roles are needed, route `skills/unsplash-asset-sourcing/SKILL.md`, create `docs/design/unsplash-search-plan.md`, and create `docs/design/unsplash-asset-manifest.md` before implementation.
23. For visual-heavy navigation, create `docs/design/navigation-strategy.md`, propose 3 distinct navigation concepts, select one pattern, and document desktop/tablet/mobile behavior before implementation.
24. For visual-heavy navigation over images, giant type, video, or changing backgrounds, define Navigation Readability Strategy before implementation.
25. Enforce No Placebo Navigation: clickable nav, tabs, filters, and segmented controls must change visible product state, route, content, scope, or filter. Their labels must also remain readable in default, hover, focus-visible, active, selected, selected+hover, and selected+focus states.
26. Decide whether visible logo/app-name chrome is justified; default is no forced app name, initials badge, or logo-left habit.
27. Define Decorative Geometry Strategy, Texture / Illustration Role Inventory, and Line / Divider Strategy; default is no decorative orbital overlays, no ambient blob haze, no dotted background texture, no amateur vector illustration, and no decorative hairline ornaments.
28. For charts, graphs, diagrams, maps, timelines, canvases, or visual encodings, route `skills/chart-system-director/SKILL.md`, define the data contract, choose the visualization/tool from `design-intelligence/visualization-tool-routing.md`, and document the question the visualization answers.
29. For spatial products such as maps, floor plans, seating charts, pattern canvases, node graphs, diagrams, and timelines, route `skills/diagram-canvas-system/SKILL.md` and define coordinate system, layer model, object model, label model, collision strategy, and selection/inspector behavior before implementation.
30. For desktop command surfaces, define the central primary product object before arranging support panels; panels must support the object, not replace it.
31. For new frontend MVPs, use `agent-workflows/frontend-aha-moment-workflow.md`: truthful, domain-specific mock data in data files, visible interactions working locally, no backend unless requested.
32. For landing, portfolio, marketing, or redesign work, read `design-dna/brief-inference-rules.md` and state the design read before coding.
33. Perform a Scale Calibration Pass against the selected reference folder before implementation.
34. If Command Center / Dashboard Mode is selected, define Dashboard Command-Surface Strategy, Human Dashboard Palette Strategy, and Dashboard Route Architecture before implementation.
35. If charts or meaningful data visualizations are involved, route chart skills and create a chart-selection report before chart implementation.
36. After implementing charts, diagrams, maps, timelines, floor plans, or canvas-like product objects, route `skills/data-viz-hardening-review/SKILL.md` before calling the UI final.
37. If a style family/taxonomy direction matters, route `skills/visual-style-selection/SKILL.md` and create a visual-style selection report before tokens are locked.
38. If building a premium website, landing page, hero, marketing page, product page, editorial/portfolio page, or website image-to-code output, use `agent-workflows/image-first-frontend-workflow.md`, route image-first skills, and create image-first website analysis before coding.
39. For landing, portfolio, marketing, and redesign work, route `skills/landing-page-craft-director/SKILL.md` and `skills/anti-ai-tell-preflight/SKILL.md`.
40. If motion is planned, route `skills/motion-craft-director/SKILL.md`; if motion code changes, route `skills/review-animations/SKILL.md`; if motion needs naming, route `skills/animation-vocabulary/SKILL.md`. If Migi asks for advanced animations, cinematic motion, artistic motion, Awwwards/Godly/Recent-level motion, scroll animation, appearing while scrolling, or portfolio motion, route `skills/advanced-motion-choreography/SKILL.md` and require `docs/design/motion-choreography-plan.md` before implementation.
41. If Anime.js, JavaScript timeline choreography, staggered DOM/SVG/object motion, CSS variable animation, weather/terrarium particles, selected-state transitions, rail/detail continuity, or tactile JavaScript feedback is proposed, route `skills/animejs-motion-director/SKILL.md`, read `design-dna/animejs-motion-primitive-rules.md`, and answer `prompts/dogfood/animejs-motion-gate.md` before implementation. Use CSS first for simple states, scope Anime.js with a root ref, clean up loops/timelines on unmount, define reduced-motion/mobile behavior, and plan screenshots.
42. If WebGL, shaders, ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo, animated premium gradient, or shader-based atmosphere is proposed, route `skills/webgl-shader-primitives/SKILL.md`, read `design-dna/webgl-shader-visual-primitives-rules.md`, and answer the WebGL Shader Primitive Gate before implementation. Define exact section, product reason, dependency/version plan, static fallback, reduced-motion behavior, mobile behavior, bounded canvas area, z-index containment, no pointer traps, fake-live avoidance, performance budget, and screenshot proof. Do not use WebGL as generic decoration or to hide weak layout.
43. If delight/personality is planned, route `skills/delight-opportunity-director/SKILL.md`.
44. If broad UI/UX craft, typography, pseudo-elements, audio feedback, predictive prefetching, UX laws, or visual design rules matter, route `skills/userinterface-wiki/SKILL.md`.
45. After the main layout exists, route `skills/make-interfaces-feel-better/SKILL.md` before final screenshot review when the UI feels stiff, dead, generic, or unresponsive.
46. After implementation, route `skills/text-clarity-review/SKILL.md` for copy-heavy product UI before calling copy final.
47. After implementation, route `skills/production-hardening-review/SKILL.md` before calling product UI production-ready.
48. After implementation or screenshots, route `skills/evidence-backed-critique/SKILL.md` when Migi asks for critique or the UI needs full post-build review.
49. When review finds blockers or score caps, route `skills/creative-orchestration-director/SKILL.md` to create a skill verdict, repair queue, owner skills, acceptance checks, and evidence rerun plan.
50. If mobile-first, read `design-dna/mobile-product-rules.md` and create or fill `docs/design/mobile-flow-spec.md` before implementation.
51. Define Image Environment Strategy before implementation when references are artistic, landing-page, cinematic, image-led, or visual-heavy.
52. Define a contrast and legibility strategy before implementation, especially for text over images, gradients, video, texture, canvas, or WebGL/shader surfaces. Define a State Contrast Matrix for interactive controls before styling nav, tabs, chips, segmented controls, cards, menus, or buttons.
53. Define a project-specific visual identity and a non-obvious visual thesis.
54. State which source project is relevant evidence and what will not be copied.
55. Plan fresh screenshots for the new UI; old captures are evidence, not templates.
56. Plan to run `evaluation/ui-scorecard.md` before finishing.
57. If the project is a Miguel Design OS dogfood target, state what rule/tool/prompt is being tested before coding and commit to translating every target-app failure back into a Design OS patch or named open gap.
58. State product purpose clarity before implementation: what this app is, what it tests in Miguel Design OS, which rules are being validated, and what success/failure teaches the master system.

## Direction Gate Modes

### Fast Direction Gate - Default

For new visual-heavy work, the first design step is quick concept selection, not full planning and not coding.

Create only:

- `docs/design/direction-options.md`
- `docs/design/direction-layout-maps.md`
- `docs/design/direction-risk-check.md`

Then stop for Migi selection.

Fast gate must not create visual specs, design-system token docs, color/contrast docs, navigation strategy, motion plans, Unsplash manifests, QA docs, build/lint output, screenshot QA, production assets, or frontend code.

Paid image generation is disabled by default. It may only run if Migi explicitly writes `I approve paid API image generation for this run.` and the command includes `--paid-ok`.

### Deep Direction Gate - Opt In

Use only when Migi asks for deep exploration, full strategy, full spec, research pass, benchmark pass, reference decomposition, or reference-locked planning. Deep mode may create design-read, active-dials, reference decomposition, navigation strategy, palette exploration, motion plans, and other planning docs.

## No Paid Image Generation By Default

Design OS must never call paid image APIs by default.

Forbidden by default:

- `OPENAI_API_KEY` image generation
- automatic `gpt-image` calls
- paid API moodboards
- hidden image generation during direction gate
- any script that spends API credits without explicit approval

Paid image generation may only run if Migi explicitly writes:

`I approve paid API image generation for this run.`

The command must also include `--paid-ok`.

## Figma Cost Safety Rule

Do not use Figma AI, Figma Weave, Figma Make, paid generation, AI credits, Figma Motion, Figma Draw, Dev Mode-only operations, or any paid-seat Figma feature by default.

Allowed normal Figma Plugin API operations:

- pages
- frames
- vectors
- shapes
- text
- variables if available
- styles
- components
- node metadata
- storyboard frames

If a requested operation requires a paid or plan-gated Figma feature, stop and report exactly:

`Blocked: this requires a paid or plan-gated Figma feature.`

## No-Image Direction Gate Requirements

For new visual-heavy work, the first design step is not coding and not paid image generation.

The first design step is:

1. create 3 differentiated direction cards
2. create compact layout maps
3. create risk/complexity/recommendation checks
4. stop for Migi selection

Required directions:

- Safe Refined
- Artistic Expressive
- Unexpected High-Character

The three directions must be visually distinct:

- different composition
- different palette
- different typography mood
- different image/media strategy
- different motion concept
- different navigation approach

Required artifacts:

- `docs/design/direction-options.md`
- `docs/design/direction-layout-maps.md`
- `docs/design/direction-risk-check.md`

Each card must name the primary product object, domain palette rationale, navigation model/state effect, interaction model, likely failure risk, implementation complexity, and recommendation score.

No no-image direction gate, no implementation.

Exceptions:

- bug fixes
- backend-only work
- copy-only edits
- already-approved direction
- Migi explicitly approves skipping direction selection

Paid/generated images, when explicitly approved, are visual north stars, not production assets. Do not copy AI artifacts, broken text, fake logos, distorted objects, or random visual noise into production UI.

## Advanced Motion Means Choreography

When Migi asks for advanced animations, cinematic motion, artistic motion, award-winning motion, Awwwards/Godly/Recent-level motion, scroll animation, appearing while scrolling, portfolio motion, or motion like Graffico/Manet/UXBert/Podium, do not implement a single animation and call it done.

Required before implementation:

- motion references named
- `docs/design/motion-choreography-plan.md`
- tool stack decision from `design-intelligence/motion-tool-stack-guidance.md`
- page/section choreography
- image/media choreography
- typography choreography
- navigation/menu choreography
- micro-feedback layer
- reduced-motion fallback
- motion evidence plan using `tools/capture-motion-sequence.mjs` when possible

Rejected:

- one background animation
- repeated fade-up across every section
- random hover scale
- motion without named technique
- motion without capture/review evidence
- motion that distracts from reading or content

## Design Intent Record

Write this before implementation:

```md
Project type:
Task classification:
Primary user:
Primary object:
Primary action:
Visual-heavy work?:
Inspiration/reference provided?:
Reference folder path:
Reference folder mode:
Reference usage report:
Reference-Locked Build Mode?:
Reference anchors:
Reference decomposition:
Design transfer spec:
Active design dials:
Direction options:
Selected direction:
Design read:
Visual spec:
Design-system direction:
Palette exploration:
Frontend aha moment:
Anti-AI-tell preflight:
Motion strategy:
Delight strategy:
Mock data path:
Visible interactions to verify:
Landing Page / Artistic Mode?:
Dashboard attraction zone:
Dashboard panel mix:
Dashboard chart forms:
Dashboard palette strategy:
Human dashboard palette strategy:
Dashboard route architecture:
Dashboard task inventory:
Dashboard route jobs:
Dashboard image/object strategy:
Dashboard live/motion strategy:
Dashboard calm/busy rhythm:
Chart selection report:
Chart data shape:
Chart accessibility fallback:
Visual style selection report:
Primary style family:
Style token plan:
Image-first website analysis:
Image-first workflow:
Unsplash search plan:
Unsplash asset manifest:
Image source truth:
Navigation strategy:
Navigation concept options:
Selected navigation pattern:
Section references:
Section extraction status:
Mobile product rules:
Mobile flow spec:
Selected skill/playbook:
Selection-first product?:
Archetype:
Layout recipe:
Visual identity words:
Image role strategy:
Image environment strategy:
Scale calibration:
Contrast / legibility strategy:
State contrast matrix:
Selected-hover contrast proof:
Navigation strategy:
Toolbar alignment strategy:
Text density strategy:
Button proportion strategy:
Responsive collision checks:
Layout integrity contract:
Responsive breakpoint proof:
Domain palette fit:
Placebo navigation avoided:
Spatial label safe zones:
Desktop command-surface primary object:
Palette direction:
OKLCH / APCA palette pass:
Interface feel pass:
Visual Concept Gate status:
Selected rendered concept:
Concept preview screenshots:
Non-obvious visual thesis:
Obvious genre route to avoid:
Density:
Token direction:
Components needed:
States needed:
Responsive risks:
Screenshots to capture:
Target score:
Dogfood target?:
Design OS rules under test:
What this app tests in Miguel Design OS:
Success/failure learning:
Core loop:
Core loop proof plan:
Persistence across route changes:
Persistence across refresh:
Persistence across browser reopen:
UI persistence disclosure:
```

## Real Imagery / Unsplash Rule

Use when a visual direction needs real photographic atmosphere, editorial imagery, or source-image roles.

Real images are not decoration by default. Every major image must have a job:

- hero scene
- focal object
- proof object
- editorial fragment
- background atmosphere
- selection thumbnail
- texture/material layer

Before implementation, create `docs/design/unsplash-search-plan.md` with the image roles, search queries, orientation, content filter, order, color filter when useful, and reason for each search. Use Unsplash query parameters as design controls, not random browsing.

After selecting images, create `docs/design/unsplash-asset-manifest.md` with source page, photographer, download metadata, alt text, crop strategy, palette relationship, text safe-zone notes, and product-truth notes.

Do not use stock imagery as factual proof of real customers, teams, labs, facilities, product operation, studies, fleets, or company evidence unless that is true. If real imagery cannot be sourced honestly, use a truthful placeholder or change the direction.

## Navigation As Art Direction Rule

Navigation is not a default sticky bar. Before implementing navigation in a visual-heavy app, landing page, portfolio, creative/editorial site, dashboard, mobile product, or redesign, create `docs/design/navigation-strategy.md`.

The navigation strategy must define:

- what navigation needs to accomplish
- how much navigation is actually needed
- primary and secondary destinations
- CTA role
- whether nav is always visible or contextual
- reference navigation lessons
- 3 distinct navigation concepts
- selected navigation pattern
- desktop, tablet, and mobile behavior
- active/focus/accessibility notes
- what generic nav default is avoided

Do not default to logo-left links-center CTA-right, rounded pill nav, sticky black bar, overpopulated SaaS top bar, or mobile top link dump unless the selected mode, references, and product type justify it.

## Mode-Specific Navigation Rules

### Landing / Portfolio / Creative / Editorial

Navigation should be explored creatively.

Acceptable approaches:

- sparse top strip
- split corners
- centered identity
- large typographic menu
- floating CTA
- image-integrated nav
- portfolio index nav
- hidden menu plus strong contact CTA
- contextual section nav
- spatial/canvas navigation around the hero object

Avoid:

- generic SaaS top bar
- sticky pill nav by default
- overpopulated menus
- nav that competes with the hero
- same link placement across every project

### Dashboard / Product App

Navigation can be clearer and more functional, but still must not be thoughtless.

Acceptable approaches:

- side rail
- top tabs
- contextual sidebar
- command palette
- workspace switcher
- bottom nav on mobile
- compact segmented navigation

Avoid:

- cryptic abbreviations
- fake status nav
- top nav copied into mobile
- same nav shape regardless of density

### Mobile

If 3+ primary destinations exist, bottom navigation is the default.

Mobile nav must:

- be crafted
- respect safe area
- have clear labels
- have good touch targets
- have clear active state
- avoid giant pills
- avoid cramped icons
- avoid desktop link dumps

## Dogfood Target Rule

Use when a project is created to test Miguel Design OS itself.

Every target-app failure must be translated back into one of:

- a Design OS rule update
- a CLI/tool validation update
- a prompt-template update
- a skill/agent instruction update
- a schema/checklist update
- an explicit open gap with owner and next test

Do not treat dogfood target bugs as isolated product bugs. The target app is the test rig for Miguel Design OS.

## Product Purpose Clarity

Before building a new project, state:

- what this app is
- what it tests in Miguel Design OS
- which Design OS rules are being validated
- what success teaches the master system
- what failure teaches the master system

If the user cannot tell why the target exists in relation to Miguel Design OS, stop and clarify the purpose before continuing.

## Core Loop Proof Rule

If the product's main loop is `upload -> classify -> generate output`, final handoff is blocked unless that loop is manually verified and documented.

The proof must name:

- input used
- classification result shown
- generated output shown
- route/screen where the output appears
- screenshots or blocked screenshot report
- remaining mismatch, if any

This also applies to equivalent loops such as import -> analyze -> recommend, select -> configure -> output, or capture -> summarize -> export.

## Persistence Truth Rule

If user-generated data is part of the product promise, specify whether it persists across:

- route changes
- refresh
- browser reopen

If persistence is local-only, session-only, mock-only, or not guaranteed, the UI must say so. Do not imply durable memory when the app stores only component state or temporary browser state.

State mismatch blocker: if the UI count says `0` while uploaded or user-generated data exists, max score is 40.

## No Parallel-Product Drift

When the current goal is dogfooding rules against a target app, do not build a second control app, Studio feature, dashboard, or surrounding tool instead of evaluating the target. Tooling patches are allowed only when they directly address a target-app failure.

## Three-Direction Mockup Gate

Applies to any new visual-heavy app, landing page, portfolio, mobile app, dashboard redesign, creative/artistic page, or visual redesign where the direction is not already approved.

Do not implement immediately.

First create `docs/design/direction-options.md` with three genuinely different directions:

1. Direction A - Safe Refined.
2. Direction B - Artistic Expressive.
3. Direction C - Unexpected High-Character.

Each direction must include:

- visual thesis
- mood/vibe
- palette direction
- typography direction
- layout/composition
- image/media strategy
- motion strategy
- mobile strategy
- why it works
- risks
- what AI default it avoids
- reference transfer when references exist

Acceptable outputs, in order of quality:

1. Real visual mockup images or screenshots if image/screenshot tooling exists.
2. Quick local static prototype previews if feasible.
3. Detailed direction cards with layout sketches, palette tokens, image strategy, motion plan, and section structure.
4. Text-only direction cards only if visual tooling is unavailable.

After creating `docs/design/direction-options.md`, stop and ask Migi to choose Direction A, Direction B, Direction C, or a hybrid such as `A palette + C composition + B motion`.

After Migi chooses, create `docs/design/selected-direction.md` with selected direction, hybrid changes, final visual thesis, final palette, final layout strategy, final motion strategy, and final risks. That selection is implementation approval unless Migi explicitly says spec only, planning only, do not implement, wait, no code yet, direction selection only, just document it, or do not edit src.

No implementation until Migi selects a direction and `docs/design/selected-direction.md` exists. After selection exists, do not ask "ready for implementation?" Proceed through `docs/design/visual-spec.md`, `docs/design/design-system-tokens.md`, `docs/design/color-and-contrast.md` or an equivalent palette doc, `docs/design/navigation-strategy.md` for visual-heavy work, `docs/design/motion-choreography-plan.md` when advanced motion is requested, `docs/qa/anti-ai-tell-preflight.md`, implementation, build/lint, screenshot/dev-server report if available, validation, and URL handoff when a dev server starts.

## Visual Concept Gate v2 - Visual Concepts Required

Applies to every new app, major screen, redesign, selection-first product, gallery, roster, visual-heavy interface, or project with inspiration images unless Migi explicitly requests Literal Target Copy Mode.

Do not implement immediately.

First produce exactly 3 visually distinct concept prototypes or direction cards:

1. Safe expected direction.
2. More original/art-directed direction.
3. Wild but controlled direction.

For each concept include:

- rendered preview route or prototype route
- screenshot files at 1440 / 768 / 390 for the gate to pass
- short explanation
- visual metaphor
- first-screen composition visible in the preview
- focal object
- interaction concept
- typography/scale direction
- color/material direction
- emotional hook
- hidden information
- absent elements
- why it avoids obvious app/theme cliches
- why it creates desire
- how it works at 1440 / 768 / 390
- what would make it fail

Then stop and wait for Migi to review the directions. Migi's choice of Direction A, B, C, or a hybrid is approval to begin implementation unless the choice explicitly says planning-only or no-code.

Rendered previews and screenshots are the quality bar when tooling exists. Text-only direction cards satisfy the first-run direction gate only when visual tooling is unavailable, and they must still be concrete enough to build from. If visual tooling exists and no screenshots/previews are produced, the gate fails.

Direction gate fails if:

- all directions use the same nav treatment
- navigation readability over image/type/scroll states is not discussed
- app-name/logo/initials chrome appears by default without justification
- decorative circular/orbital/radar/HUD overlays appear as atmosphere
- decorative separator lines or hairlines appear as filler

Each direction must include:

```md
## Navigation Readability
- does nav overlay image/type?
- protection strategy:
- scroll-state behavior:

## Identity Chrome
- visible logo/name? yes/no:
- why:
- what is removed:

## Decorative Geometry Strategy
- decorative circles/orbits/radar lines used? no by default:
- if yes, function/interaction/meaning:

## Line / Separator Strategy
- are decorative lines used?
- if yes, what function?
- if decorative only, remove:
```

## Visual Spec Gate

For visual-heavy work, create `docs/design/visual-spec.md` before implementation.

Before `docs/design/visual-spec.md`, require:

- `docs/design/direction-options.md`
- `docs/design/selected-direction.md`

The spec must include:

- Direction Gate Summary
- task mode
- active dials
- reference anchors
- visual thesis
- layout skeleton
- design-system tokens
- image roles
- texture / illustration role inventory
- text-safe zones for illustration and vector paths
- chart strategy when relevant
- mobile strategy when relevant
- interaction strategy
- state contrast matrix for interactive labels
- responsive strategy
- evidence plan
- forbidden drift

The spec must also include:

```md
## Decorative Geometry Strategy
- are decorative circles/orbits/radar lines used?
- if yes, are they functional?
- what do they represent?
- did Migi explicitly request them?
- if decorative only, remove them:
- alternative background/composition strategy:

Default: Decorative circular/orbital overlays are not used.

## Texture / Illustration Role Inventory
- ambient light blobs/glows used? no by default:
- dotted/star-field/micro-dot textures used? no by default:
- if any texture exists, what role does it serve?
- if any illustration exists, shape inventory path:
- shape roles:
- layer stack:
- bounds and anchors:
- responsive behavior:
- accessibility or decorative status:
- text-safe zones:
- label/callout routes:
- proof that paths do not cross words:
- proof that words are not clipped:
- if the answer is only "looks cool," remove it:

## Navigation Readability Strategy
- does nav overlap images/type?
- background states:
- contrast protection:
- scroll-state behavior:
- active/focus state:
- selected+hover state:
- selected+focus state:
- mobile behavior:
- readability risk:
- screenshot checks:

## State Contrast Matrix
- controls covered: nav / tabs / chips / buttons / cards / menus / segmented controls / selectable objects
- default text/background:
- hover text/background:
- focus-visible text/background:
- active/pressed text/background:
- selected text/background:
- selected+hover text/background:
- selected+focus text/background:
- disabled text/background:
- APCA/WCAG target:
- screenshot/proof plan:
- failure response if any label disappears:

## Identity / Brand Chrome Decision
- visible logo/name needed? yes/no:
- why:
- where identity appears:
- what identity chrome is removed:
- does nav need the app name?
- does hero already carry identity?
- Migi preference considered:

## Line / Divider Strategy
- are lines used?
- functional or decorative?
- what do they separate?
- do they align to real layout boundaries?
- are any decorative hairlines removed?
- alternative hierarchy method:

Default: No decorative hairline ornaments are used.
```

No visual spec = no visual-heavy implementation, unless Literal Target Copy Mode is active.

## Design-System-First Gate

Before significant UI implementation, define:

- semantic color tokens
- typography roles
- spacing scale
- radius logic
- shadow/elevation logic
- border/divider logic
- chart colors
- state colors
- state contrast matrix for default, hover, focus-visible, active, selected, selected+hover, selected+focus, disabled, and pressed states
- component variants
- image treatment
- motion rules

No ad-hoc random colors. No one-off Tailwind chaos. No visible UI generated before design-system direction exists.

## Frontend Aha Moment

For new frontend MVPs, build the local frontend loop before backend work unless Migi explicitly requests backend first.

Rules:

- local/mock data is allowed
- mock data must be domain-specific, plausible, and tied to real business entities
- mock data must live in dedicated data files, not inside components
- random values, abstract metrics, generic app sections, and unjustified `mission control` / `topology` / `traces` labels are blockers
- every visible interaction must work locally
- backend waits until the frontend loop is compelling
- generated/exported artifacts should be deterministic when possible
- final handoff must state what is mock and what backend would replace

## Inspiration Handling

Use when Migi provides inspiration images, screenshots, references, or a strong visual target.

1. Store files under `docs/inspiration/[project]/` when practical.
2. Create or update `docs/inspiration-analysis.md`.
3. Extract composition, focal object, hierarchy, hidden information, absent elements, emotional hook, material/texture, atmosphere, and interaction model.
4. List what to copy, what to avoid, and what to translate.
5. Explain in the final handoff how the implementation used the inspiration without copying it literally, unless Literal Target Copy Mode was explicitly requested.

Do not extract shallow traits only. Dark, neon, cards, glass, glow, gradients, rounded panels, and big text are not a design concept.

## Data Visualization Selection

Use when a project includes charts, analytics, BI, monitoring, forecasting, maps, funnels, networks, financial data, sentiment, or dashboard graph systems.

Before implementation:

- route `skills/chart-system-director/SKILL.md`
- route `skills/data-visualization-selection/SKILL.md`
- use `design-intelligence/visualization-tool-routing.md` to choose D3, Observable Plot, Vega-Lite, ECharts, Recharts, Chart.js, Nivo, React Flow, React Konva/Konva, Mermaid, D2, custom SVG, or CSS/HTML
- create `docs/design/chart-selection-report.md` from `templates/chart-selection-report.template.md`
- select chart types by data shape and user decision
- document a data contract before implementation
- define accessibility fallback and chart bounds
- reject decorative charts

## Diagram / Canvas Product Object Mode

Use when a project includes pattern drafting canvases, floor maps, seating charts, node graphs, workflow builders, architecture diagrams, timelines, route maps, spatial editors, or product object canvases.

Before implementation:

- route `skills/diagram-canvas-system/SKILL.md`
- name the primary product object
- define coordinate system, canvas bounds, layer model, object model, label model, collision strategy, selection model, and responsive fallback
- protect labels with safe zones
- define label lanes, callout routes, badge safe zones, measurement hierarchy, and construction-line semantics
- keep objects from overlapping critical labels
- keep badges, selected outlines, and callouts from covering piece names, measurements, axes, ruler labels, or construction lines
- make selection update details or inspector
- reject decorative grids unless functional
- define a rendering/performance budget for pan, zoom, drag, selection, hover, and dense label layers
- keep the product object central rather than buried under generic dashboard panels
- after implementation, route `skills/data-viz-hardening-review/SKILL.md`
- when a runnable diagram/canvas exists, run `tools/diagram-integrity-check.mjs` where practical or save a blocked report

## Visual Style Selection

Use when the product needs a deliberate style family, token/effect direction, or taxonomy-based visual direction.

Before implementation:

- route `skills/visual-style-selection/SKILL.md`
- create `docs/design/visual-style-selection-report.md` from `templates/visual-style-selection-report.template.md`
- choose one primary style family and at most one supporting treatment
- define token variables and effect limits
- reject styles that conflict with product purpose, references, accessibility, performance, or Migi's known anti-patterns

## Image-First Website To Code

Use for premium websites, landing pages, hero sections, marketing sites, product pages, portfolio/editorial pages, and visually important website redesigns.

Before implementation:

- route `skills/image-first-website-to-code/SKILL.md`
- create `docs/design/image-first-website-analysis.md` from `templates/image-first-website-analysis.template.md`
- generate or select section-specific visual references when available
- analyze each reference deeply before coding
- implement as a faithful translation, not a generic reinterpretation

Do not compress many sections into one tiny board, crop old images for section extraction, or start from generic website components when visual quality is the task.

## Reference-Locked Build Mode

Use when Migi says:

- use dashboard folder
- use creative folder
- use landing-page folder
- base it on these screenshots
- make it like these references
- follow the same approach as these apps

Do not proceed from folder vibes. Before implementation, select 3-5 specific reference anchors.

Each anchor must have one or more roles:

- composition anchor
- palette/material anchor
- graph/component anchor
- image/object/media anchor
- responsive/layout anchor

Create before coding:

- `docs/design/reference-decomposition.md` using `templates/reference-decomposition.template.md`
- `docs/design/design-transfer-spec.md` using `templates/design-transfer-spec.template.md`

The design transfer spec must translate reference mechanics into the target app:

- chosen visual mode
- primary composition strategy
- layout skeleton
- panel hierarchy
- graph system
- image/object/media strategy
- palette/material strategy
- typography scale
- navigation strategy
- responsive strategy
- forbidden drift
- acceptance criteria

Implementation must follow the transfer spec by segments:

1. shell/nav
2. attraction zone
3. chart/data system
4. queue/list system
5. action/output system
6. responsive adaptation

Create after implementation:

- `docs/qa/reference-match-report.md`

The report must include what matched, what missed, density comparison, composition comparison, palette comparison, chart comparison, image/object comparison, responsiveness comparison, and next patch required.

Stop if the agent cannot name the exact reference anchors and their transferred mechanics.

## Reference Folder Modes

When Migi points to a visual-library folder, the agent must activate the matching design mode. Do not treat all reference folders as equal moodboards.

Before coding any folder mode, perform a Scale Calibration Pass:

1. Look at selected reference screenshots.
2. Estimate how many meaningful content objects are visible above the fold.
3. Identify the largest text, medium text, and small UI labels.
4. Identify typical card/container density.
5. Identify whether images are hero scenes, thumbnails, proof objects, or background atmosphere.
6. Match the scale relationship, not just the vibe.

Before coding any folder mode, also define a Contrast / Legibility Strategy:

1. Identify every text layer and the background it sits on.
2. Classify the background as flat, image, gradient, video, texture, or mixed.
3. Check whether the local background changes behind the text.
4. Mark text as critical or decorative.
5. Choose contrast protection: safe zone, scrim, plate, blur/backdrop plate, local vignette, mask, deliberate crop, or text outside the image.
6. Plan 1440 / 768 / 390 contrast checks for responsive crops.

Before coding artistic, landing-page, cinematic, editorial, image-led, or visual-heavy work, define Image Environment Strategy:

1. Decide whether the reference uses image as environment or asset.
2. If the image is environment, compose around the image before choosing grid structure.
3. Consider full-bleed background, oversized scene, masked environment, edge-to-edge poster field, layered atmosphere, soft backdrop behind type, or composition-driving crop.
4. State why the image should or should not be boxed.
5. Plan focal object protection, text safe zones, and scrim/mask/plate support.
6. Avoid trapping immersive references inside rectangular card or grid slots.

### Command Center / Dashboard Mode

Use for:

- dashboard folder
- command center references
- dense data/productivity tools
- `visual-library/approved/inspiration/01-command-centers-dashboards/`

Must produce:

- clear hierarchy
- dense but readable surfaces
- meaningful metrics
- command/action clarity
- no random card soup
- one memorable attraction zone or focal visual/data anchor
- graph-rich composition with useful chart forms
- deliberate imagery, object, media, scene, avatar, map, or dominant chart use when references support it
- varied panel scale and function
- compact controlled typography and container sizing
- a clear rhythm between calm zones and busy zones
- visual energy without chaos
- palette discipline with material range
- live or animated state cues when the product represents monitoring, freshness, or activity

Dashboard content rules:

Consider mixing:

- metrics
- charts
- queues
- recent activity
- user/profile/avatar elements
- media/image blocks
- status chips
- object/scene/product visuals
- action modules
- cards with real contrast in function and visual weight
- tables, maps, timelines, or content previews when the product model supports them

Charts should help the dashboard feel alive and useful. Use line charts, bar charts, donut/ring charts, progress tracks, timeline patterns, mini trends, heatmaps, maps, funnels, score indicators, and sparklines only when they support a visible decision or state.

Dashboard visual energy rule:

Dashboard mode must not become lifeless operational furniture. Elite dashboards combine utility with visual energy: useful state, dense but readable information, a memorable attraction zone, graph/chart richness, purposeful imagery/object/media use, color discipline, varied panel weights, and lively but controlled composition.

Dashboard palette discipline:

Dashboard references must drive palette decisions. Do not default to murky dark green, terminal black, neon lime, purple AI dashboard palettes, or muddy sepia/espresso/umber brown-black archive backgrounds. Nocturne/archive/botanical language is not a valid excuse for that banned surface family.

Dashboard palettes can be:

- light premium
- dark premium
- mixed light/dark
- soft neutral with vivid accents
- black/white with one strong accent
- object/image-driven
- glass/soft material
- editorial color systems

Rules:

- Accent color must be used selectively.
- Do not use one accent everywhere.
- Do not let the whole dashboard become one monochrome wash.
- Neutral surfaces need material range: base, raised panel, quiet panel, active panel, image panel, and data panel.
- Color should clarify hierarchy and state, not decorate every surface.

Elite graph system rule:

Dashboard mode must include meaningful, well-designed visualizations when data is part of the product. At least two distinct chart or data-visualization types should be considered for dashboard mode. One major chart can be the visual anchor, but it must communicate clear state.

Preferred graph and visualization types:

- line trends
- bar charts
- stacked bars
- ring/donut charts
- progress tracks
- score meters
- timeline strips
- distribution charts
- comparison matrices
- heat/priority maps
- mini sparklines
- ranked lists with visual scores

Chart rules:

- Charts must map to product concepts.
- Charts must be readable.
- Charts must not be decorative wallpaper.
- Microcharts should support scanability.

Dashboard image and object anchor rule:

Dashboard mode should consider image/object/media elements when the reference folder shows them. Small avatars are not enough if references use stronger image/object systems.

Accepted roles:

- attraction zone
- proof object
- user/entity context
- media/content preview
- product object
- status visualization
- live/animated tile
- environment/scene mini-map

Image/object rules:

- Images/objects must have a role, not be decoration.
- A dashboard can include one strong visual/object anchor.
- Image panels should help hierarchy, memorability, or product comprehension.
- Visual anchors must not dominate like landing-page hero images unless dashboard references support it.

Dashboard live visual layer:

Many elite dashboards feel alive through subtle motion or animated visual regions: animated chart transitions, pulsing live indicators, moving timeline/state strips, animated media tiles, subtle looped image/video surfaces, progress movement, and hover/selection transitions.

Motion rules:

- Motion must communicate state, freshness, selection, progress, or live activity.
- Motion must not be random decoration.
- Animated images or loops can be used as atmosphere or energy only if they have a product role.
- Dashboard should not feel dead if the product represents live signals, activity, or monitoring.

Avoid:

- same-weight widgets
- fake metrics
- generic SaaS dashboards
- purple AI slop
- weak hierarchy
- terminal-ish dark panel spam
- murky monochrome or terminal-green panel systems
- one accent color applied everywhere
- text-and-metrics-only dashboards
- chart-lite dashboards despite graph-rich references
- charts as decoration
- major charts that are decorative or unclear
- no focal object or attraction zone
- image-starved dashboards when references show media/object anchors
- tiny-avatar-only image usage when a stronger visual anchor is needed
- static dead dashboards for live/monitoring products
- everything as a rectangle of the same importance
- oversized empty dashboard cards, headings, charts, action bars, or containers

Scale guidance:

Dashboard / Command Center Mode must be dense but readable. Avoid giant widgets and same-weight cards. Desktop should show multiple useful panels at once plus one memorable attraction zone. Dashboard scale must not inflate text, cards, padding, containers, charts, or action bars. The screen should deliver useful volume quickly.

Contrast guidance:

Dashboard / Command Center Mode requires strong text/background separation. Do not use low-contrast grey labels everywhere.

Image/object guidance:

Imagery in dashboards must be deliberate, not pasted in. It should create a focal anchor, communicate a product/object, enrich browsing, support hierarchy, add user/entity context, provide a media/content preview, or make the surface more memorable. Remove imagery that does not earn one of those roles.

Dashboard craft rule:

A dashboard is not done when it is merely functional. Dashboard mode needs readable navigation, aligned toolbars, scan-first panels, proportionate actions, collision-free responsive behavior, human palette direction, no fake live/session theater, and polish that makes the product feel designed rather than like a start product.

Global UI craft rules:

- No Cryptic Navigation: navigation must be immediately understandable. Do not use unexplained labels such as `CMD`, `SIG`, `CMP`, `BRF`, vague system labels such as `SD LOCAL`, or icon-only nav without labels, tooltips, or obvious context. Compact navigation must use icons or a real menu pattern, never arbitrary two-letter labels such as `IN`, `WL`, `BD`, `NW`, `RL`, or `BK`.
- Mobile Navigation Defaults: applications with 3+ primary destinations default to bottom navigation on mobile. Desktop may use top navigation or left sidebar; tablet adapts; mobile top navigation is acceptable only for documentation sites, desktop-first enterprise tools, editor software, or scrolling-first websites. Reserve the top of mobile app screens for branding, page title, search, context, or hero imagery.
- Crafted Responsive Navigation: desktop nav may be top, side, or hybrid; tablet nav must preserve spacing and readability; mobile bottom nav must have clear labels, premium spacing, generous touch targets, excellent icon/text alignment, intentional active state, safe-area support, and visible selected state. Nav must never overlap content, become cramped, become oversized, or look generic.
- Mobile Product Interaction Integrity: modal/detail sheets must fit the viewport and safe areas, scroll internally when long, keep primary actions visible or sticky, and avoid colliding with bottom nav. Practical mobile product bottom nav requires semantic icons plus readable labels. Selectable chips/items/tabs must preserve selected state until changed. Add/create actions must be visually distinct from content items. Active bars, underlines, and progress strips must not overlap labels.
- Toolbar Alignment Discipline: search inputs, filters, and action buttons in the same toolbar should share height or a clear intentional scale relationship, align baselines, use consistent gaps, and wrap gracefully.
- Container Text Weight Limit: panels should be scan-first. Use short labels, values, one-line summaries, metadata chips, and progressive disclosure. Long copy belongs in details, drawers, previews, or expanded states.
- Button Proportion Discipline: button width should usually follow content. Full-width actions are allowed only when layout and context justify them. Avoid long desktop pills that dominate more than the action deserves.
- No Responsive Collision: layouts must survive 1440, 1280, 1024, 768, and 390 checks with no overlapping containers, colliding chips, covered content, broken forms, or horizontal overflow.
- P0 Layout Integrity: a UI cannot be visually good if layout integrity fails. Text must stay inside containers, primary headings must not be clipped or cut off underneath, charts inside plotting/card areas, cards above readable width, nav understandable, chips/pills intentionally wrapped or truncated, image badges collision-free, buttons proportionate, forms readable, and containers adapted instead of squeezed into garbage.
- Responsive Adaptation, Not Squeezing: desktop may be dense, but tablet must reorganize and mobile must use a dedicated simplified structure. Do not keep the same desktop layout until columns, charts, nav, or cards become unreadable.
- Chart Bounds Discipline: bars, lines, points, axes, labels, and markers must remain inside plot/card bounds. Charts need explicit dimensions or responsive containers, controlled SVG overflow, label-aware padding, and simpler representations at smaller breakpoints when needed.
- Semantic Label Integrity: labels cannot collapse into meaningless fragments such as `C`, `U`, or `?` without an obvious legend. Abbreviations are allowed only when standard, explained, or paired with a visible legend.
- Human Palette Direction: palette must be derived from selected references or product mood. Do not default to terminal green, AI purple, neon lime, generic blue/grey, muddy sepia/espresso/umber brown-black archive wash, or one dull machine-generated color wash. Accent color should be limited and meaningful.
- Critical Sepia Container Ban: sepia/espresso/umber brown-black cards, panels, notes, containers, sidebars, nav, or stages cap score at 2 and require palette redesign before handoff.
- No AI Ambient Blob: do not use blurred light blobs, foggy radial glow, spotlight smears, or "cool advanced UI" haze as background atmosphere. If lighting exists, it needs a scene source, role, layer, and contrast proof.
- No Decorative Dot Texture: do not use dotted, star-field, micro-dot, matrix, or stipple backgrounds as generic texture. Dots are allowed only as explicit data, a functional grid, a documented brand pattern, or a real sourced material texture requested by Migi.
- No Amateur Illustration: vector illustrations require role, layer, bounds, anchors, responsive behavior, accessibility/decorative status, shape inventory, label-safe zones, and collision proof. Childish botanical plates, arbitrary stems/petals, and paths crossing words are hard failures.
- Native Tooltip Ban: no art-directed SVG may expose browser-native tooltips over the visual surface. Do not use `title` attributes on child shapes. If using `<title>`/`<desc>` for accessibility, scope them to the top-level meaningful SVG and avoid hoverable child titles. Decorative groups must be aria-hidden and pointer-events none unless interactive.
- Annotation Protected Zone Rule: leader lines, annotation rules, stems, and decorative marks may never cross through label text. Every annotation label needs a protected zone; every callout needs anchor, offset, label box, and collision strategy.
- Illustration Complexity Honesty Rule: do not claim professional illustration if the art is primitive ellipses, generic leaves, or simple blobs. Botanical, character, and object subjects require silhouette study, detail budget, linework strategy, motif library, material/texture strategy, and reference grammar.
- Background Texture Quality Rule: no generic dot grid, generic star field, random noise, or vague glow blob unless explicitly justified by reference mechanics. Texture must be material paper texture, photographic/grain texture, meaningful field marks, image-led atmospheric layer, or brand-specific pattern.
- No Fake Live / Session Status Slop: do not use live dots, session-only chips, glowing telemetry, or monitoring/status badges unless the product truly has that state, the label is understandable, and it changes user decision-making.
- No AI Theater Chrome: do not use decorative `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Mission Room`, `Case File`, fake `CL-####`, dossier, operation, or fake severity/status chips unless they are real product objects with documented behavior.

Dashboard-specific layout integrity:

- Dense desktop dashboards may use multi-column layouts, but tablet must reduce columns or reorganize panels.
- Mobile dashboards must become a stack of prioritized command sections.
- Charts must resize, simplify, or change representation instead of overflowing.
- Queues can become compact lists.
- Side rails must convert to bottom or compact nav.
- Cards must not become skinny unreadable columns.

Rejected dashboard layout failures:

- 3-column dashboard squeezed into tablet
- long text cards forced into narrow columns
- charts overflowing because panels got too small
- desktop rail turning into giant mobile pills
- same desktop composition used at every size

### Artistic / Creative Mode

Use for:

- creative folder
- experimental UI
- editorial references
- visual-heavy inspiration
- `visual-library/approved/inspiration/02-creative-experimental-ui/`

Must produce:

- art-directed composition
- memorable first impression
- asymmetry or unusual rhythm
- fewer elements with more impact
- image, type, and space as the main design material

Avoid:

- normal dashboard structure
- boring grids
- safe template layouts
- decorative chaos with no product clarity

Scale guidance:

Creative / Experimental Mode can use scale dramatically, but only with intent. Large type or image treatment must be balanced by visual tension, smaller details, or layered composition. No giant empty slabs.

Contrast guidance:

Creative / Experimental Mode can be unusual, but readability cannot be accidental. If the user cannot read it, it fails.

Image environment guidance:

Creative / Experimental Mode should treat immersive imagery as material for the whole composition, not a rectangular asset, when references use full-scene atmosphere.

### Landing Page / Poster Mode

Use for:

- landing page folder
- hero page references
- cinematic/product story pages
- `visual-library/approved/inspiration/05-landing-hero-pages/`

Must produce:

- image-led composition
- sparse copy
- poster-like hero
- emotional scene
- minimal UI chrome
- visual rhythm beyond the hero

Avoid:

- Blogspot/content-template structure
- repeated feature sections
- lots of cards
- image pasted into generic SaaS page
- text-heavy marketing page

Scale guidance:

Landing Page / Poster Mode allows large hero type only when the image scene and composition justify it. The page must not become one huge headline plus one huge image. Poster logic still needs calibrated supporting content.

Contrast guidance:

Landing Page / Poster Mode must protect sparse copy. Large type can sit near imagery, but small supporting labels and CTAs need stable contrast zones.

Image environment guidance:

Landing Page / Poster Mode should start from the scene when references use dominant imagery. Do not start from a grid and insert the image later.

### Mobile Product Flow Mode

Use for:

- mobile app references
- consumer app flows
- onboarding/profile/search/home screens
- `visual-library/approved/inspiration/03-mobile-consumer-apps/`
- `visual-library/approved/inspiration/mobile-apps/`

Must produce:

- strong mobile hierarchy
- real flow, not fake Dribbble stills
- clear thumb-friendly actions
- polished card/navigation systems
- bottom navigation by default for 3+ primary destinations
- readable mobile layouts
- `docs/design/mobile-flow-spec.md`

Before implementation:

- read `design-dna/mobile-product-rules.md`
- create or fill `docs/design/mobile-flow-spec.md`
- define platform mode, screen sequence, safe areas, thumb zones, bottom-nav default/exception, icon+label nav strategy, modal/sheet fit strategy, selection-state strategy, add/create action strategy, control-indicator collision checks, and 390 proof plan

Avoid:

- tiny unreadable mockups
- overdecorated fake app shots
- beautiful screens with no usable flow

Scale guidance:

Mobile Product Flow Mode must not take mobile screenshot proportions and blow them up on desktop. Desktop presentation needs richer composition, multiple visible frames, or a product context that uses the wider viewport.

Contrast guidance:

Mobile Product Flow Mode is especially vulnerable to responsive crop changes. Avoid important text over uncontrolled image areas.

### Selection / Gallery / Browse Mode

Use for:

- selection/gallery folder
- roster, browse, marketplace, media library, product configurator references
- `visual-library/approved/inspiration/04-selection-gallery-browse/`

Must produce:

- desire to click/select
- strong selected state
- preview/detail relationship
- browse rhythm
- object hierarchy

Avoid:

- boring equal grids
- no selected-state clarity
- cards that all feel equally important
- object/image swaps that break layout

Scale guidance:

Selection / Gallery / Browse Mode must not make one selected object so huge that browsing disappears. Selection-first UI needs preview, options, comparison, and clear selected state visible together.

Contrast guidance:

Selection / Gallery / Browse Mode must keep image-card title, selected state, and key metadata readable. Do not use unreadable overlay text.

## Reference Usage Report Rule

Before coding any visual-heavy task using visual-library references, create `docs/design/reference-usage-report.md`.

It must include:

- references inspected
- selected reference anchors when Reference-Locked Build Mode is active
- anchor roles when Reference-Locked Build Mode is active
- reference decomposition path when Reference-Locked Build Mode is active
- design transfer spec path when Reference-Locked Build Mode is active
- folder mode selected
- extracted principles
- what will not be copied
- visual thesis
- layout strategy
- image role strategy
- image environment strategy
- scale calibration
- contrast / legibility strategy
- navigation strategy for dashboard or visual-heavy work
- toolbar alignment strategy for dashboard or visual-heavy work
- text density strategy for dashboard or visual-heavy work
- button proportion strategy for dashboard or visual-heavy work
- responsive collision checks for dashboard or visual-heavy work
- layout integrity contract for visual-heavy work
- responsive breakpoint proof for visual-heavy work
- palette direction for dashboard or visual-heavy work
- dashboard command-surface strategy when Command Center / Dashboard Mode is selected
- dashboard palette strategy when Command Center / Dashboard Mode is selected
- graph system strategy when Command Center / Dashboard Mode is selected
- image / object / media strategy when Command Center / Dashboard Mode is selected
- anti-patterns being avoided

If this report is missing, the work is not ready for implementation.

Required when Command Center / Dashboard Mode is selected:

```md
## Navigation Strategy

- Primary nav labels:
- Why labels are understandable:
- Responsive nav behavior:
- Mobile/lower nav plan:
- Selected-state plan:
- What nav failure is avoided:
```

Required when dashboard or visual-heavy work includes search, filters, or action clusters:

```md
## Toolbar Alignment Strategy

- Input/button groups:
- Height relationship:
- Wrapping behavior:
- Primary action placement:
```

Required when dashboard or visual-heavy panels include descriptive content:

```md
## Text Density Strategy

- Where long copy appears:
- Where content is summarized:
- Scan-first panels:
- Expanded/details behavior:
```

Required when dashboard or visual-heavy work has visible CTAs or repeated actions:

```md
## Button Proportion Strategy

- Primary button sizing:
- Full-width buttons used? why/why not:
- Desktop vs mobile button behavior:
```

Required before visual-heavy implementation:

```md
## Responsive Collision Checks

- 1440:
- 1280:
- 1024:
- 768:
- 390:
- Known collision risks:
- How they are prevented:
```

Required before visual-heavy implementation:

```md
## Layout Integrity Contract

- Minimum desktop card width:
- Tablet layout behavior:
- Mobile layout behavior:
- Chart containment strategy:
- Text truncation / line-clamp strategy:
- Chip/pill wrapping strategy:
- Image/badge collision prevention:
- Nav responsive behavior:
- Form/control wrapping behavior:
- What happens when content is longer than expected:
```

Required before visual-heavy implementation:

```md
## Responsive Breakpoint Proof

Required checks:

- 1440:
- 1280:
- 1024:
- 768:
- 390:

For each:

- Nav readable:
- Toolbar aligned:
- Cards readable:
- Charts contained:
- No overlap:
- No horizontal overflow:
- Primary action reachable:
```

Required before visual-heavy implementation:

```md
## Palette Direction

- Reference palette observed:
- Chosen palette:
- Accent roles:
- Surface system:
- Why it avoids machine/generic color:
```

Required when Command Center / Dashboard Mode is selected:

```md
## Dashboard Command-Surface Strategy

- Attraction zone:
- Panel mix:
- Chart forms and purpose:
- Image/object/media role:
- Palette direction:
- Material range:
- Utility-heavy zone:
- Queue/list/activity zone:
- Control/action zone:
- Calm zones:
- Busy zones:
- How the design avoids same-weight card soup:
- How the design avoids terminal-ish dark panel spam:
```

Required when Command Center / Dashboard Mode is selected:

```md
## Dashboard Palette Strategy

- Reference palette observed:
- Neutral system:
- Accent use:
- State colors:
- Material range:
- What palette failure to avoid:
- Why the selected palette matches references:
```

Required when Command Center / Dashboard Mode is selected:

```md
## Graph System Strategy

- Major chart:
- Supporting charts:
- Microcharts:
- What each chart communicates:
- What would be decorative/fake:
- How chart styling supports composition:
```

Required when Command Center / Dashboard Mode is selected:

```md
## Image / Object / Media Strategy

- Visual anchor:
- Image/object role:
- Media/avatar/content role:
- Whether animation/live media is useful:
- How imagery avoids being pasted in:
- How it supports dashboard hierarchy:
```

Required section:

```md
## Image Environment Strategy

- Does the reference use image as environment or asset?
- Image role selected:
- Why the image should / should not be boxed:
- Crop strategy:
- Focal object protection:
- Text safe zones:
- Scrim/mask/plate strategy:
- How the layout avoids image-trapped-in-grid:
```

Required section:

```md
## Scale Calibration

- Reference density observed:
- Largest text role:
- Supporting text scale:
- Container/card density:
- Image scale role:
- What we will avoid:
- How this implementation prevents AI scale inflation:
```

Required section:

```md
## Contrast / Legibility Strategy

- Text over image? yes/no
- Protection method:
- Safe zones:
- Focal objects protected:
- Small text contrast plan:
- Responsive crop risk:
- What must be checked at 1440 / 768 / 390:
```

## Image Role Rules

Every major image must have one declared role:

- hero scene
- focal object
- proof object
- background atmosphere
- editorial fragment
- selection thumbnail
- texture/material layer

Images must not be used as random decoration. If an image does not clarify composition, identity, proof, mood, selection, or material, remove it or change its role.

## Texture And Illustration Rules

Textures and vector illustrations are not polish stickers. They are visual systems.

Forbidden by default:

- ambient light blobs
- foggy radial glow
- soft spotlight haze
- dotted/star-field/micro-dot background texture
- fake botanical/scientific plates
- childish line illustrations
- arbitrary petals, stems, arcs, or abstract shapes
- illustration paths crossing readable words
- words clipped by masks, overflow, viewport edges, or illustration layers

Any texture or illustration must define:

- role
- layer
- bounds
- anchors
- responsive behavior
- accessibility meaning or explicit decorative status
- text-safe zones
- collision/callout strategy

If the texture or illustration exists because it "looks cool," remove it.

## Image As Environment, Not Rectangular Asset

Definition:

In artistic, landing-page, cinematic, editorial, and visual-heavy references, imagery often defines the entire page atmosphere. The image is not merely content inside a card. It is the environment the UI lives inside.

Migi strongly prefers this when the reference folder supports it.

Rule:

When reference screenshots use large atmospheric imagery, agents must explore using the image as:

- full-bleed background
- oversized scene
- masked environment
- edge-to-edge poster field
- layered atmosphere
- soft backdrop behind type
- composition driver

Agents must not default to:

- square image card
- rectangular image block
- image beside text in a rigid two-column grid
- image pasted into a dashboard/card layout
- image trapped inside obvious borders
- image treated as decorative content

The image should feel like the page was composed around it.

## Hero Is Not Enough Rule

If the hero follows the reference but the rest of the page falls back to generic grids, cards, or sections, max score is 70.

For landing/poster, artistic/creative, and image-led work, the visual rhythm must continue beyond the first viewport.

## No AI Scale Inflation

Definition:

AI-generated frontend often makes everything too large: headlines, cards, sections, images, buttons, spacing, and containers. The result feels inflated, empty, childish, and low-information compared to real premium UI references.

Migi strongly rejects this.

Rule:

For every visual-heavy task, calibrate scale against the reference folder before implementation.

Compare:

- headline size
- body text size
- container size
- card density
- image size
- spacing
- number of visible content objects
- amount of meaningful information above the fold

The goal is not "make everything smaller." The goal is controlled scale, useful density, hierarchy with range, content richness, and no giant empty furniture.

Large typography is not banned. It must be justified by the reference and balanced by composition, imagery, and supporting content density.

## Award-Level Contrast Discipline

Migi strongly rejects UI where text is hard to read because it is placed over busy images, low-contrast gradients, washed-out panels, or weak grey-on-dark surfaces.

Every visual-heavy design must define a contrast strategy before implementation.

For every text layer, know:

- what background it sits on
- whether the background is flat, image, gradient, video, or texture
- whether the local background changes behind the text
- whether the text is critical or decorative
- what contrast protection is used

Hard rule:

Important text must never rely on hope. It needs a stable readable background.

## Stateful Text Contrast

Interactive text must remain readable in every state, not only in the resting screenshot.

Required states:

- default
- hover
- focus-visible
- active / pressed
- selected
- selected + hover
- selected + focus
- disabled

Hard rule:

If hovering a selected nav item, tab, chip, segmented control, card, menu item, or button makes its label disappear, the UI fails before taste scoring. Repair the foreground/background tokens, remove opacity/blend-mode tricks, or use a different selected/hover treatment.

## Text On Images Requires Protection

Text may sit over imagery only when at least one protection method is intentionally used:

- dark/light gradient scrim
- solid or translucent text plate
- blur/backdrop plate
- local vignette
- image mask
- safe empty image zone
- deliberate crop that leaves clean negative space
- strong text shadow only as support, not the only protection
- separating text outside the image

Forbidden:

- white/cream text directly on bright or busy photo areas
- small text over high-frequency image detail
- lime/accent labels over bright image areas without backing
- important product copy over faces, eyes, hands, or focal objects
- text whose readability depends on one lucky crop
- gradient overlays that protect one viewport but fail on another

If the image changes or crops responsively, contrast must still hold at 1440, 768, and 390.

## Image-Led Does Not Mean Text-On-Image Chaos

Image-led artistic design should use images as composition drivers, not uncontrolled backgrounds for text.

Correct:

- image as hero scene
- image as focal object
- image as proof object
- text placed in deliberate safe zones
- sparse copy with clear contrast
- image crop protects focal object and text area

Wrong:

- random text floating over noisy image areas
- image cards with unreadable overlays
- important text over dog/person faces
- inconsistent overlays across images
- image treatment changes from section to section without reason

## Landing Page / Artistic Mode

Use when Migi asks for:

- landing page
- creative
- artistic
- cinematic
- editorial
- visual-heavy
- image-led
- based on landing-page inspiration
- based on creative inspiration

This mode means:

- poster logic, not dashboard logic
- image-first, not section-first
- composition-led, not component-led
- sparse copy, not explanatory content blocks
- atmosphere before completeness
- fewer UI objects with stronger visual purpose
- weak or invisible grid when possible
- one dominant visual thesis
- emotional scene before feature explanation

Do not:

- use normal SaaS homepage rhythm
- stack text-heavy content sections
- repeat image-left/text-right blocks
- default to feature-card rows, stats blocks, boxed proof sections, or dashboard furniture
- use images as decoration inside a generic grid
- make only the hero artistic and then fall back to ordinary cards and sections

Required check:

Before implementation, name how the landing page will preserve image-led mood beyond the hero. If the answer is a normal section stack with prettier images, redesign before coding.

## Literal Target Copy Mode

Use when Migi says:

- `copy this exact UI`
- `100% this design`
- `literally what you see`
- `exact visual target`

This mode overrides product thinking.

Do not:

- run the 3-concept gate
- invent new art direction
- expand product features
- run a usefulness pass
- add extra panels
- add extra explanation
- improve the target
- reinterpret the target

The only goal is visual parity with the supplied target.

Required sequence:

1. Identify the target screens.
2. Reconstruct the visible composition.
3. Exclude browser chrome, editor UI, and watermark artifacts.
4. Build the static shell first.
5. Implement only minimum visible interactions.
6. Capture comparison screenshots.
7. Report exact differences.

Product logic waits until the pixel-parity shell is approved.

## Visual Target Reconstruction Mode

Use when Migi provides inspiration images, screenshots, or a strong visual target.

If Literal Target Copy Mode is active, do not translate the reference into new concepts. Copy the visible composition first and report differences.

First analyze:

- composition
- focal object
- information hierarchy
- what is hidden
- what is absent
- emotional hook
- material/texture
- atmosphere
- interaction model
- why the reference creates desire

Then produce:

1. reference analysis
2. 3 rendered art-direction concept prototypes with viewport screenshots
3. approval checkpoint
4. visual shell prototype
5. screenshots
6. comparison against the chosen concept/reference
7. patch loop
8. product logic only after the visual shell works

If a reference shows a cinematic stage, do not build a dashboard. If a reference shows one dominant object, do not build a grid. If a reference hides information, do not expose stats. If a reference is art-directed, do not answer with generic components.

For landing-page, creative, artistic, cinematic, editorial, or image-led references, extract composition before colors. Preserve image dominance, sparse copy, atmospheric rhythm, and poster/editorial behavior. Do not turn these references into a normal landing page with artistic images pasted into bordered cards or feature sections.

## Build Order

1. Implement only the approved rendered direction when the Visual Concept Gate applies, or only the supplied target when Literal Target Copy Mode applies.
2. Build a visual shell/poster composition before feature depth.
3. Implement or update semantic tokens.
4. Build the primary object and its primary action.
5. Add secondary context only after the primary object works.
6. Add component states: empty, loading, error, disabled, selected, focus-visible, hover, active/pressed, selected+hover, and selected+focus.
7. Add responsive behavior for 390, 768, and 1440 px.
8. Add copy that names actions, states, and consequences.
9. Add product logic only after the visual shell works.
10. Verify the core loop and persistence contract before final handoff.

For Landing Page / Artistic Mode, product completeness comes after the image-led visual thesis. Preserve artistic rhythm beyond the first viewport before adding extra sections.

## Selection-First Gate

Use this gate when the product's core loop is selection, browsing, collecting, gallery exploration, roster choice, or object discovery.

Before building:

- set `Selection-first product?: yes` in the Design Intent Record
- choose the Selection Roster archetype or explain why another archetype fits better
- define what makes each selectable object desirable and distinct
- name the obvious genre treatment you are rejecting
- define card zones for visual, identity, metadata, and action
- define hover and selected rewards before styling the card grid
- decide what details stay hidden until after selection

Build:

- first screen creates a "which one do I pick?" moment
- objects are image-led or visually dominant enough to carry desire
- cards expose class, tier, rarity, vibe, role, power, or personality only when those signals clarify desire
- cards avoid accidental overlap and prove clear zones at 390 / 768 / 1440
- selected state feels committed, not just bordered
- detail view feels like a loadout, forge, inspector, or comparison surface, not a product brochure

Do not:

- start with explanation
- start with dense stats, meters, tabs, or technical analysis
- ship clean but boring catalog grids
- use beige/product-listing styling when the product needs energy
- copy game UI universally; apply this only to selection-first products
- default to predictable dark cyber, neon, fighter, stat-badge, or genre-cliche styling
- create excitement through badge/glow/stat overload
- allow text, badges, stats, or controls to collide
- preserve a rejected layout with new paint

Robot Skill Forge evidence: see `design-dna/rejected-directions.md`.

## Visual Identity Rules

Do:

- derive palette, type scale, density, radius, shadows, and motion from the current product
- use semantic tokens
- write down why the identity fits

Do not:

- reuse a source project's palette
- copy a screenshot layout literally unless Migi explicitly requested Literal Target Copy Mode for that supplied target
- use In The Loop warmth unless the product is a social coordination tool
- use generic AI/SaaS gradients or dashboard cards as default
- use Blogspot/content-template landing structure when Migi asked for landing-page, creative, artistic, cinematic, editorial, visual-heavy, or image-led work
- make a selection-first product feel like a beige catalog, product brochure, dense terminal, or obvious genre cliche before the user chooses
- take the obvious aesthetic route just because the app concept suggests it
- implement visually important UI before the Visual Concept Gate is approved with rendered concepts and screenshots, unless Literal Target Copy Mode is active


## Obvious Theme Gate

Use for any app with a strong noun/theme, such as robotics, finance, medicine, gaming, music, sports, luxury, security, or AI.

Before styling:

- name the obvious genre route
- reject at least one predictable treatment
- define a non-obvious design thesis
- choose visuals that express the product concept, not just the theme noun

Do not:

- assume robotics means dark cyber UI, neon cards, stat badges, grids, and fighter language
- assume AI means glow, blobs, magic copy, or fake intelligence animation
- assume "advanced UI" means ambient blobs, dotted texture, fake technical patterns, or amateur vector decoration
- assume finance means a copied market terminal
- mistake theme decoration for product concept

## Verification Gate

Before final delivery:

1. Run available lint/build/tests.
2. Start the app if possible.
3. Capture 390, 768, and 1440 px screenshots.
4. Run lightweight scripts when practical: `scripts/check-horizontal-scroll.mjs`, `scripts/check-overlap.mjs`, `scripts/check-scale-inflation.mjs`, and `scripts/generate-design-report.mjs`.
5. Inspect screenshots for blockers in `responsive-rules.md`, `rules/*.md`, and `anti-patterns.md`.
6. Score with `evaluation/ui-scorecard.md`.
7. Fix blockers and recapture changed screens.
8. Verify and document core product loop proof when applicable.
9. Verify and document persistence truth for user-generated data.
10. For dogfood targets, document what target failures patch in Miguel Design OS.
11. Report score, screenshots, and known gaps.

If the app cannot run, document the command, error, and best alternative evidence.

## Required Handoff

```md
Approved rendered concept:
Reference folder mode:
Reference usage report:
Image roles:
Image environment strategy:
Scale calibration:
Contrast / legibility strategy:
Files changed:
Screenshots:
Scorecard result:
Core loop proof:
Persistence truth:
Dogfood learning:
Blockers fixed:
Remaining weaknesses:
Patched after review: yes/no
```

## Signature Interaction Gate

For artistic, brand, portfolio, experimental landing, playful product, and image-led sites, consult `skills/signature-interaction-director/SKILL.md` when references include memorable mechanics such as portal entry, scroll route choreography, mascot motion, scroll-assembled cards, editorial list modals, media constellations, directional page transitions, or playful entry gates.

Rules:
- Select one signature interaction before implementation, or explicitly justify why none is appropriate.
- Extract mechanics, not brand skin. Do not copy logos, mascots, names, colors, exact content, or proprietary media.
- Include the selected mechanic in the visual spec when chosen.
- Final review must check whether the signature mechanic is visible, meaningful, accessible, and supported by reduced motion.
- Generic section stack after signature references is a hard failure.

## Illustration-First Gate

For any illustration-heavy project, especially botanical illustration, character illustration, mascot illustration, product object illustration, editorial SVG illustration, hero illustration, or custom SVG scene, the agent must first create isolated illustration assets before building the full page.

Required gate outputs:

- `docs/design/illustration-art-direction.md`
- `docs/design/illustration-style-guide.md`
- `docs/design/illustration-asset-options.md`
- at least 1 isolated hero illustration component or SVG
- `docs/qa/illustration-gate-review.md`

The agent must stop after the illustration gate unless explicitly instructed to continue.

No full page implementation may begin if the illustration looks amateur, is made from primitive shapes with no detail system, has weak silhouette, poor linework, generic texture/material, missing reference grammar, or lacks Migi approval when approval is required.

Score caps:

- full page built before illustration asset passes: max score 4
- hero illustration looks amateur: max score 4
- botanical/character/object illustration uses primitive ellipses/blobs: max score 4
- no isolated illustration review before full page: max score 5
- illustration-heavy project has no style guide: max score 5

## No Ambient Background Blobs

Do not use large vague background blobs, ghost ellipses, generic radial glows, random translucent ovals, fake lens shapes, or abstract atmosphere shapes unless they are the primary product object, part of the selected signature interaction, directly derived from an approved reference mechanic, or explicitly named in the shape inventory with role, layer, and purpose.

Rejected: vague light blob in the corner, random huge transparent ellipse, generic star/dot field, abstract glow that exists only to make the page feel "premium", background shapes that compete with content, background shapes that do not interact with anything, and decorative orbits/HUD lines.

Allowed: subtle material-specific paper grain, real photographic grain, low-opacity scan texture, ink speckle, surface wear, texture tied to domain material, or a purposeful mask/object used by the signature interaction.

Score caps:

- visible generic background blob: max score 4
- generic dot/star field as atmosphere: max score 4
- atmosphere shape has no role/purpose: max score 4
- background decoration competes with primary content: max score 4
- "premium glow" with no reference justification: max score 5

## Botanical / Organic Illustration Minimum Bar

Botanical, animal, human, and organic illustrations are high-risk. Before coding, require reference grammar, silhouette study, linework strategy, detail budget, material/texture strategy, simplification strategy, and what makes the subject believable.

For botanical plates specifically, require stem structure, leaf/petal hierarchy, asymmetry, vein or line detail where appropriate, root/stem/petal relationship, botanical label/callout safe zones, and distinct species silhouettes.

Reject leaves made only from repeated ellipses, flowers made only from generic petals, flat doodle stems, childlike plant silhouettes, repeated copy-paste leaves, and generic "botanical" icons scaled up as hero art.

## Layout Integrity Gate

Text/container integrity is mandatory. Text must never be accidentally clipped, hidden, covered, or forced outside its intended container.

Hard blockers:

- word cut off inside a card, sticker, nav pill, badge, button, tab, modal, or panel
- text escaping a container
- overlay object covering important headline/body/navigation text
- heading hidden behind a card/sticker/image
- button label clipped
- nav label clipped or overflowing its item
- text visually present but unreadable because of shape/texture/background
- container too small for its text at any required breakpoint
- `overflow: hidden` used to hide text failure
- fixed-width container used for dynamic labels without responsive fallback
- huge accidental blank viewport area

Navigation must define desktop, tablet, and mobile variants. If labels collapse, accessible labels must remain. Active state must not clip text or create unpredictable width jumps. Compact nav must use icon fallback or a real menu pattern; arbitrary two-letter nav abbreviations are not acceptable.

Stickers, cards, badges, images, decorative shapes, and overlays require protected text zones. Screenshot contradiction beats agent self-report.

## Final UI Integrity Gate

No frontend/design task may be handed off until final UI integrity passes.

Build/lint is not visual proof. Component splitting is not visual proof. Reports are not visual proof. Screenshots and DOM geometry are required.

Hard blockers:

- clipped text
- cut words
- nav overflow
- button/CTA clipping
- card title/body clipping
- media over text
- container overlap over text
- fixed/sticky overlay covering content
- text hidden with overflow hidden
- accidental huge blank viewport areas
- unresolved user complaint

No overlap without permission: visual overlap is allowed only when intentional, documented, decorative/protected, not covering readable text, layer-defined, and proven by screenshot.

No hidden text fixes: do not use overflow hidden, clip, max-height, fixed height, or masking to hide a text-fit failure.

Text wins over visual objects: text, CTA, navigation, and readable card content beat media, shapes, cards, and animation.

If a blocker appears in any required screenshot, final verdict is failed.

Score caps:

- final UI integrity gate not run: max score 5
- final UI integrity gate blocked/failed: max score 4
- critical text clipped: max score 2
- word cut off in screenshot: max score 2
- nav label overflows item: max score 3
- sticker/card covers headline word: max score 3
- button/CTA text clipped: max score 3
- card title/body clipped: max score 3
- media/image/video over readable text: max score 3
- overlapping containers cover text: max score 3
- fixed/sticky overlay covers content: max score 3
- text hidden by `overflow: hidden`: max score 3
- unresolved text/container issue appears in screenshot: max score 3
- unresolved user complaint remains visible: max score 2
- screenshot contradicts final report: max score 2
- no text fit strategy for sticker/card/nav system: max score 5
- nav huge dead space at breakpoint: max score 4
- nav lacks responsive variant: max score 5
- compact nav uses arbitrary abbreviations: max score 4
- nav hides full labels without icons: max score 4
- active compact nav item is unclear: max score 5
- nav looks clipped/broken at small width: max score 3
- large accidental blank viewport area: max score 4

## Agent Skill Layer V2

For nontrivial new app/design work, the agent must not jump directly from brief to implementation.

Default route:

1. Create/update creative session state.
2. Retrieve relevant failure memory.
3. Create a skill orchestration plan.
4. Compile reference grammar when references are present.
5. Define responsive constraints and interaction state matrix before implementation when relevant.
6. Run creative prototype spikes for risky signature mechanics, illustration, scroll choreography, unusual nav, WebGL/canvas, or media staging.
7. Implement.
8. Review with screenshot evidence.
9. Convert evidence to repair tasks.
10. Validate artifact contract before final handoff.

This layer is mandatory when the task is visual-heavy, reference-led, multi-skill, high-risk, or follows a recent failure pattern.

## Final UI Integrity Gate v3

No final product may be returned to Migi unless Final UI Integrity Gate v3 passed or the agent explicitly reports blocked/failed.

The gate must test a width sweep from 360 to 1920 in 40px steps or smaller when practical; height samples 720, 844, 900, and 1080; scroll samples 0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, and 1.00; and applicable states including default, nav active states, selected card/detail open, sticky/pinned active section, compact nav state, and reduced motion when practical.

If a layout failure appears at any sampled width, height, scroll point, or state, final handoff is blocked.

Score caps:

- final gate v3 not run on visual frontend work: max score 4
- final gate v3 failed but handoff claimed success: max score 2
- fixed breakpoint-only evidence for final handoff: max score 4
- width sweep evidence missing: max score 4
- layout failure appears at any sampled width: max score 3
- viewport-edge clipping remains: max score 2
- horizontal scroll shows partial critical content at rest: max score 3
- floating container overlaps another container: max score 3
- cut text remains after gate: max score 2
- final report lacks screenshot matrix evidence: max score 4
- final report does not include failed/passed viewport list: max score 4

## Anchored Detail Reveal And Mobile Bottom Nav

For any card/item/container that opens details, the reveal must stay spatially connected to the selected trigger or use an explicit full-screen/drawer/sheet pattern with selected-item context.

Required:

- `data-detail-trigger`
- `data-detail-panel`
- `data-detail-for`
- `data-selected-item`
- selected trigger state
- close/focus/keyboard strategy
- mobile behavior

Mobile route/app experiences, scroll-heavy chapter sites, and interactive station/section pages must use persistent bottom navigation / bottom route controller by default.

Required:

- desktop/tablet/mobile nav variants
- mobile bottom nav or bottom-accessible alternative
- nav remains available after scroll
- icon or icon + active label strategy
- accessible full labels
- safe-area handling
- proof at 390, 430, 640, and 768

Score caps:

- detail panel disconnected from trigger: max score 4
- selected item not visibly connected to detail: max score 5
- detail opens below fold without focus/scroll: max score 4
- mobile route nav disappears on scroll: max score 3
- mobile nav is top-only for app-like route experience: max score 4
- compact nav has no bottom/persistent access: max score 4

## No Fake Live, Clean Backplates, Correct Nav State

Do not use `LIVE`, `live feed`, pulsing live dots, fake activity labels, fake realtime copy, or fake online/presence states unless real live functionality exists.

Do not use decorative `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Mission Room`, `Case File`, `CL-####`, dossier, operation, or fake severity/status chips as generic product drama. Use plain task/route labels unless the word maps to a real domain object and behavior.

When placing a container behind another container, align the backplate/offset layer precisely. Messy exposed corners, mismatched radii, and accidental backing-layer leaks are blockers.

Navigation active state must be correct. When the user clicks a nav item, that exact item must become active. Adjacent/right-side active-state bugs are critical blockers.

App names, wordmarks, and brand chrome must remain readable over every background state. Dark bands, imagery, video, gradients, and scroll-changing backgrounds require a stable contrast strategy or the brand chrome must move/remove.

Score caps:

- fake LIVE badge: max score 4
- fake live feed label: max score 3
- fake live icon/dot: max score 3
- fake narrative/fictional incident chip: max score 4
- replay/mission chrome used as default identity: max score 4
- oversized replay metadata strip: max score 4
- fake case-file or dossier identifier: max score 3
- messy exposed backing corner: max score 4
- misaligned media backplate: max score 3
- clicked nav item does not become selected: max score 2
- adjacent/right-side item becomes selected: max score 2
- nav item never receives selected state: max score 2
- app name unreadable over dark/variable background: max score 3
- brand chrome over image/background without contrast strategy: max score 4

## Elite Scroll Choreography Rule

For award-level landing, portfolio, editorial, brand, playful product, and video-first work, scrolling must be authored when scroll is central. Generic fade-in sections are not enough. Select a named pattern from design-intelligence/elite-scroll-choreography-patterns.md, document route map, chapter map, pinned/sticky stage plan, moving object inventory, nav sync, mobile fallback, reduced-motion fallback, and layout risks before implementation.

After implementation, run skills/scroll-choreography-review/SKILL.md and then layout integrity review. Block blank pinned frames, scroll movement covering critical text, media/video objects covering protected text, horizontal routes without mobile fallback, fake card assembly, unsynced chapter nav, and accidental horizontal overflow.

Media/text protected-zone rule: for video-first, media-led, sticky media, pinned media, portal, card assembly, or video-to-object scroll work, read `design-dna/media-text-protected-zone-rules.md`, `design-dna/video-media-placement-rules.md`, and `design-dna/text-container-integrity-rules.md`. Create `docs/design/protected-zone-map.md`, `docs/design/media-object-stage-plan.md`, and `docs/design/scroll-motion-spec.md` before implementation. Use the rejected Late Check FM case studies at `visual-library/rejected/case-studies/late-check-fm-scroll-media-text-collision/` and `visual-library/rejected/case-studies/late-check-fm-persistent-video-overlay-container-thinning/` as canonical failure memory.

Hero-only media default: video belongs in the top/hero stage by default. After the hero, remove it, dock it into a reserved component, replace it with a static poster/thumb, or keep it only inside a reserved media lane with protected text zones. No persistent video overlay, media-over-text, or container thinning to fit media may ship.

## Elite Experience Specialist Layer

For award-level brand, portfolio, editorial, playful product, media-led, and scroll-heavy work, broad signature and scroll planning can route into five focused craft specialists:

- scroll-physics-smoothing-director for scroll engine feel, smoothing, scrub, snap, settle, touch, mobile fallback, reduced motion, and performance.
- media-object-stage-director for video/image/media as a primary object with protected text zones, reserved media lanes, crop strategy, poster fallback, and media-state map.
- physical-interface-props-director for tactile props with role, material, text-fit strategy, protected zones, responsive behavior, and no clipping.
- designed-detail-reveal-director for non-default drawers, sleeves, split views, object pull-outs, station boards, and ritual selectors with state, focus, close, keyboard, and text overflow handling.
- brand-voice-as-interface-director for CTAs, nav labels, cards, detail copy, reviews, states, and microcopy that feel authored rather than generic SaaS/hotel/template language.
