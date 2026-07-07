# UI Scorecard

Use this before finishing any generated app, UI review, source-project ingestion, or fix-until-elite loop.

## Required Inputs

Before scoring, record:

- project type
- task classification
- skills used
- primary user
- primary object
- primary action
- intended visual identity
- design read for visual-heavy landing, portfolio, marketing, or redesign work
- active design dials
- `docs/design/visual-spec.md` for visual-heavy work
- `docs/design/direction-options.md` before visual-heavy implementation when visual direction is not already approved
- `generated/moodboards/<slug>/manifest.json` and `generated/moodboards/<slug>/prompts.md` when image generation succeeds for Fast Direction Gate
- `generated/moodboards/<slug>/blocked-report.md` when image generation is blocked for Fast Direction Gate
- explicit Migi approval when image/prototype generation is blocked and text-only fallback is used
- `docs/design/selected-direction.md` after Migi chooses or hybridizes a direction
- Direction Gate Summary inside visual spec
- `docs/design/navigation-strategy.md` for visual-heavy work with navigation
- navigation concept options, selected navigation pattern, desktop/tablet/mobile behavior, CTA/nav relationship, active/focus states, and generic nav default avoided
- Palette Exploration section for artistic, cinematic, landing, portfolio, creative, editorial, or experimental work
- design-system direction for significant UI work
- Domain Content Contract for every new app/dashboard/product UI: business type, users, core entities, real pages/routes, route jobs, mock data schema, realistic records, metric definitions, units/ranges/statuses/source labels, and banned generic terms
- frontend aha moment and local/mock data location for new frontend MVPs
- visible interactions verified locally
- reference folder mode when visual-library references are used
- `docs/design/reference-usage-report.md` when visual-heavy work uses visual-library references
- Reference-Locked Build Mode status when a visual-library folder or screenshot set is the requested basis
- 3-5 selected reference anchors and their roles when Reference-Locked Build Mode is active
- `docs/design/reference-decomposition.md` before coding when Reference-Locked Build Mode is active
- `docs/design/design-transfer-spec.md` before coding when Reference-Locked Build Mode is active
- `docs/qa/reference-match-report.md` before final handoff when Reference-Locked Build Mode is active
- Dashboard Command-Surface Strategy when Command Center / Dashboard Mode is used
- dashboard attraction zone, panel mix, chart forms, image/object strategy, and calm/busy rhythm when dashboard references are used
- Dashboard Palette Strategy when Command Center / Dashboard Mode is used
- Human Dashboard Palette Strategy when dashboard or command-center work is used
- Dashboard Route Architecture, task inventory, and route jobs when complex operational dashboards are used
- Graph System Strategy when Command Center / Dashboard Mode is used
- Image / Object / Media Strategy when Command Center / Dashboard Mode is used
- Dashboard live/motion strategy when the product represents monitoring, freshness, activity, or queues
- chart-selection report when meaningful charts, analytics, BI, monitoring, forecasts, maps, funnels, networks, or graph-rich dashboard systems are used
- chart data shape, user decision, accessibility fallback, rendering strategy, and chart bounds strategy
- visual-style selection report when a style family/taxonomy direction is used
- selected primary style family, rejected styles, token plan, effect limits, accessibility/performance/mobile risks
- image-first website analysis when building premium websites, landing pages, hero sections, marketing sites, product pages, editorial/portfolio pages, or website image-to-code outputs
- section references and extraction notes before website implementation when image-first workflow applies
- anti-AI-tell preflight for landing, portfolio, marketing, and redesign work
- motion strategy when animation exists or motion is planned
- Anime.js Motion Gate when Anime.js, JavaScript timeline choreography, staggered DOM/SVG/object motion, CSS variable animation, weather/terrarium particles, selected-state transitions, rail/detail continuity, or tactile JavaScript feedback is proposed
- Anime.js motion plan: CSS-vs-Anime rationale, components using Anime.js, signature motion moment, scoped root refs, cleanup, reduced-motion fallback, static fallback, mobile behavior, and screenshot proof
- `docs/design/motion-choreography-plan.md` when advanced/cinematic/artistic/portfolio/scroll motion is requested
- motion tool stack decision, five-layer motion plan, section-by-section motion map, and reduced-motion fallback when advanced motion is requested
- motion sequence report or documented capture blocker when motion is central
- motion benchmark review from `evaluation/benchmarks/motion-cinematic.benchmark.md` when advanced motion is central
- animation review when motion code changed
- WebGL / Shader Primitive Gate when WebGL, shaders, ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo effects, animated premium gradients, or shader atmospheres are proposed
- shader primitive plan: exact section, concept reason, dependency/version plan, static fallback, reduced-motion behavior, mobile behavior, bounded canvas/GPU area, z-index containment, pointer-event strategy, fake-live avoidance, performance note, and screenshot proof plan
- delight strategy when personality/delight is added
- Scale Calibration section from `docs/design/reference-usage-report.md` when visual-library references are used
- Image Environment Strategy from `docs/design/reference-usage-report.md` when image-led, artistic, landing-page, cinematic, or visual-heavy references are used
- Contrast / Legibility Strategy from `docs/design/reference-usage-report.md` when image-led or visual-library references are used
- Texture / Illustration Role Inventory when textures, SVG, vector forms, abstract forms, masks, callouts, or illustration are present
- Text-safe zones for illustration and vector paths when text and drawing share a scene
- State Contrast Matrix for interactive controls, including default, hover, focus-visible, active/pressed, selected, selected+hover, selected+focus, and disabled
- selected+hover contrast proof for nav, tabs, chips, segmented controls, menus, buttons, cards, and selectable objects when present
- Navigation Strategy for dashboard or visual-heavy work
- Toolbar Alignment Strategy for dashboard or visual-heavy work with search, filters, or action clusters
- Text Density Strategy for dashboard or visual-heavy panels
- Button Proportion Strategy for visible CTAs and repeated actions
- Responsive Collision Checks at 1440, 1280, 1024, 768, and 390
- Layout Integrity Contract for visual-heavy work
- Responsive Breakpoint Proof at 1440, 1280, 1024, 768, and 390
- Palette Direction explaining why the color system avoids machine/default color
- design-system token quality: semantic colors, type roles, spacing, radius, shadow/elevation, borders, chart colors, state colors, component variants, image treatment, and motion rules
- OKLCH/APCA palette pass for significant UI: APCA targets, WCAG targets when formal compliance is claimed, lightness repairs, numeric scale, dark-mode mapping, and hue-drift risk
- palette intelligence from references/product reasoning or `design-intelligence/product-color-matrix.json`
- UI Wiki review when broad interaction, typography, pseudo-element, audio, UX-law, or perceived-performance rules apply
- Interface Feel Pass after main layout exists and before final screenshot review
- chart intelligence from data shape/user decision or `design-intelligence/chart-recommendation-matrix.json`
- style intelligence from selected style family or `design-intelligence/style-taxonomy.json`
- landing pattern when landing pages are built or reviewed
- mobile platform fit when mobile work is involved
- mobile navigation default/exception when the app has 3+ primary destinations
- mobile product interaction integrity when mobile product work is involved: modal/sheet fit, safe-area behavior, icon+label bottom nav, selection persistence, add/create action differentiation, and control-indicator collision checks
- implementation workflow/tool discipline when code is changed
- brief inference quality: page kind, audience, vibe, reference signals, mode/system, quiet constraints
- landing/portfolio craft: section jobs, composition anchors, background modes, CTA variation, and section rhythm
- motion craft: purpose, frequency, duration, easing, reduced motion, performance
- delight appropriateness: earned moment, domain register, no task delay
- image role strategy for every major image
- Unsplash search plan when real imagery or Unsplash assets are used
- Unsplash asset manifest when Unsplash images are selected: source page, download metadata, photographer, alt text, crop strategy, palette relationship, safe-zone notes, and product-truth note
- product purpose: what the app is, what it tests in Miguel Design OS, which rules are being validated, and what success/failure teaches the system
- core loop proof when the product depends on upload, classification, generation, selection, or persistence
- persistence truth for user-generated data across route changes, refresh, and browser reopen
- dogfood learning when the app is a Miguel Design OS test target
- approved rendered concept when visual-heavy work applies
- inspiration manifest when visual-heavy work uses inspiration
- Visual Concept Gate status, preview routes, concept screenshots, and Migi approval when visual-heavy work applies
- Literal Target Copy Mode status and target-difference report when exact visual copying is requested
- screenshot evidence at 390, 768, and 1440 px, or a documented blocker
- validated done report for visual UI work
- validated target-copy report when Literal Target Copy Mode applies
- validated asset manifest for image-led target reconstruction or production image-led work
- screenshot comparison report when Literal Target Copy Mode applies
- visual QA report from local capture when the app can run

Score the current UI against its own product identity. Do not score higher because it resembles a golden project.

## Score Caps

Apply caps before final score.

Caps are written as 100-point score with 10-point shorthand in parentheses.

Large typography is not banned. It must be justified by the reference and balanced by composition, imagery, and supporting content density.

Artistic style never excuses poor readability. Award-level UI protects legibility while preserving mood.

Layout integrity caps apply before taste scoring. A broken layout cannot be award-level.

Asset sourcing caps do not apply to purely typographic or minimal pages where image use is explicitly not part of the chosen direction.

Functional circular charts, progress rings, orbital selectors, diagrams, or maps are allowed only when they carry meaning and are documented. Decorative orbit/radar/sonar/HUD atmosphere is rejected by default.

- no screenshots and no documented blocker: max 60
- multi-skill work skips `creative-orchestration-director`: max workflow score 60 (6/10)
- critique, audit, or scorecard produces prose but no repair queue: max workflow score 50 (5/10)
- specialist review has no machine-readable skill verdict: max workflow score 60 (6/10)
- P0/P1 repair has no owner skill, target, action, and acceptance check: max workflow score 50 (5/10)
- final handoff claims done while skill verdicts still have open P0 repairs: max workflow score 40 (4/10)
- visual-heavy new app implemented without direction-options gate: max 60 (6/10)
- paid API generation runs without explicit approval: max workflow score 20 (2/10)
- paid API key required for default workflow: max workflow score 40 (4/10)
- Figma AI, Figma Weave, Figma Make, paid generation, AI credits, Figma Motion, Figma Draw, Dev Mode-only operations, or paid-seat Figma feature used automatically: max workflow score 20 (2/10)
- Figma request requires paid/plan-gated feature but agent does not stop with `Blocked: this requires a paid or plan-gated Figma feature.`: max workflow score 30 (3/10)
- Design OS workflow depends on paid or credit-based Figma features by default: max workflow score 40 (4/10)
- direction gate fails because image API is unavailable: max workflow score 50 (5/10)
- no-image direction gate lacks layout maps: max workflow score 60 (6/10)
- no-image direction gate produces vague vibes only: max workflow score 50 (5/10)
- no-image direction gate has no primary product object: max workflow score 60 (6/10)
- visual-heavy new app coded without 3 no-image direction cards or approved rendered directions: max 50 (5/10)
- 3 direction options are minor variations of same design: max 50 (5/10)
- Fast direction gate creates full visual spec before selection: max workflow score 60 (6/10)
- Fast direction gate runs build/lint before selection: max workflow score 60 (6/10)
- Fast direction gate edits src before selection: max workflow score 40 (4/10)
- Fast direction gate produces direction essays longer than needed: max workflow score 70 (7/10)
- Direction gate takes full implementation-level planning time without deep mode: max workflow score 60 (6/10)
- agent ignores selected direction: max 50 (5/10)
- generated image artifacts copied literally into production UI when paid image generation was explicitly approved: max 60 (6/10)
- no Migi selection before implementation: max 50 (5/10)
- agent provides only one direction when direction is not approved: max 60 (6/10)
- three directions are minor variations of same layout or palette: max 50 (5/10)
- agent codes before Migi selects direction: max 50 (5/10)
- agent stops after selected-direction.md despite Migi choosing a direction: max workflow score 50 (5/10)
- agent asks for implementation confirmation after explicit direction selection: max workflow score 50 (5/10)
- direction gate requires redundant approval step: max workflow score 60 (6/10)
- direction options lack palette, image, layout, or motion strategy: max 60 (6/10)
- agent ignores selected direction during implementation: max 50 (5/10)
- selected direction is not carried into implementation: max 50 (5/10)
- no `docs/design/selected-direction.md` after Migi chooses: max 70 (7/10)
- critique silently degrades from dual assessment to single context: max workflow score 50 (5/10)
- full critique has no heuristic scoring: max review score 70 (7/10)
- full critique has no persona red flags: max review score 70 (7/10)
- critique gives vague issues without concrete fixes: max review score 60 (6/10)
- critique ignores screenshot/browser evidence: max review score 60 (6/10)
- critique finds placebo navigation but does not mark it P1/P0: max review score 50 (5/10)
- critique finds layout collision but does not mark it P1/P0: max review score 50 (5/10)
- vague primary CTA: max copy score 60 (6/10)
- generic destructive confirmation: max copy score 50 (5/10)
- unclear error message with no fix: max copy score 50 (5/10)
- placeholder-only form labels: max copy score 50 (5/10)
- inconsistent terminology: max copy score 60 (6/10)
- copy assumes technical knowledge without context: max copy score 60 (6/10)
- loading state longer than 3 seconds with only `Loading...`: max copy score 60 (6/10)
- empty state has no next action: max copy score 60 (6/10)
- long translation breaks layout: max hardening score 50 (5/10)
- no empty state for primary list: max hardening score 60 (6/10)
- no error recovery for async action: max hardening score 50 (5/10)
- double-submit possible on destructive action: max hardening score 50 (5/10)
- icon-only controls lack accessible labels: max hardening score 50 (5/10)
- color-only status indicators: max hardening score 50 (5/10)
- large dataset has no pagination/search/virtualization plan: max hardening score 60 (6/10)
- no reduced-motion support for animated interface: max hardening score 60 (6/10)
- Anime.js used without `animejs-motion-director` gate: max 50 (5/10)
- Anime.js used where CSS transitions were sufficient: max 60 (6/10)
- Anime.js used for generic fade-and-rise everywhere: max 40 (4/10)
- Anime.js motion hides content until timing finishes: max 30 (3/10)
- Anime.js motion blocks interaction, reading, or navigation: max 30 (3/10)
- Anime.js creates fake live/status/pulse theater: max 30 (3/10)
- Anime.js motion lacks reduced-motion fallback: max 40 (4/10)
- Anime.js selectors are global/unscoped in React/Next: max 50 (5/10)
- Anime.js loops/timelines/draggables are not cleaned up on unmount: max 40 (4/10)
- Anime.js motion breaks mobile or low-power states: max 40 (4/10)
- Anime.js screenshot proof is missing: max 50 (5/10)
- WebGL/shader effect used without `webgl-shader-primitives` gate: max 50 (5/10)
- shader/WebGL effect is generic cool-background decoration with no product role: max 40 (4/10)
- shader/WebGL effect hides weak layout, typography, hierarchy, or product clarity: max 30 (3/10)
- WebGL/canvas layer makes text unreadable or competes with primary content: max 30 (3/10)
- WebGL/canvas layer traps pointer events or blocks controls: max 30 (3/10)
- WebGL/shader effect lacks static fallback: max 40 (4/10)
- WebGL/shader effect lacks reduced-motion fallback: max 40 (4/10)
- WebGL/shader effect lacks mobile fallback or reduced complexity plan: max 50 (5/10)
- WebGL/shader effect uses fake live/status/realtime affordance: max 30 (3/10)
- WebGL/shader project lacks performance budget: max 50 (5/10)
- WebGL/shader project lacks desktop/mobile/reduced-motion screenshot proof: max 50 (5/10)
- Liquid Logo copied as ungoverned third-party code or installed as a fake package dependency: max workflow score 40 (4/10)
- artistic/landing/portfolio page uses safe AI-default muddy palette without exploration: max 60 (6/10)
- palette feels machine-generated/generic despite expressive mode: max 50 (5/10)
- no palette exploration documented for artistic/cinematic mode: max 60 (6/10)
- color palette is readable but conceptually boring in an art-directed page: max 70 (7/10)
- palette chosen without relation to imagery, references, or concept: max 60 (6/10)
- random domain palette that does not fit product domain, user environment, task pressure, or emotional state: max 50 (5/10)
- bold palette used but contrast/readability fails: max 50 (5/10)
- agent defaults to charcoal/brown/orange generated-app palette again: max 50 (5/10)
- sepia/espresso/umber brown-black archive wash used as main page, stage, or app background: max 20 (2/10)
- sepia/espresso/umber brown-black archive wash used for navigation, sidebar, card, panel, note, command-container, or container backgrounds: max 20 (2/10)
- repeated sepia/espresso/umber palette appears across unrelated generated UIs: max 20 (2/10)
- "nocturne", "archive", "field guide", "botanical", "brass", "tobacco", "parchment", "vintage", "cinematic", "commander", "incident", "operational", or "premium" used to justify the same muddy brown-black surface family: max 20 (2/10)
- decorative circular/orbital line overlay used as background atmosphere: max 50 (5/10)
- fake radar/sonar/HUD circles used without function: max 50 (5/10)
- circular line motif appears as generic tech decoration: max 50 (5/10)
- orbital/circular overlay competes with imagery or typography: max 60 (6/10)
- circular line system not documented as functional in visual spec: max 60 (6/10)
- agent repeats decorative circular overlay across unrelated projects: max 50 (5/10)
- Migi explicitly rejects the circular/orbital motif and it still appears: max 30 (3/10)
- unmotivated ambient light blob, foggy radial glow, spotlight smear, or AI haze used as background atmosphere: max 40 (4/10)
- decorative dotted/star-field/micro-dot background texture used as fake advanced UI atmosphere: max 40 (4/10)
- texture exists only because it looks cool and has no role/layer/bounds/anchors: max 50 (5/10)
- amateur/childlike vector illustration in premium, editorial, landing, or visual-heavy UI: max 40 (4/10)
- fake botanical/scientific plate or arbitrary petals/stems used as roleless decoration: max 40 (4/10)
- illustration line, stem, arc, callout, mask, or path crosses readable words: max 30 (3/10)
- words are clipped/cut by illustration, viewport edge, mask, parent overflow, or vector layer: max 30 (3/10)
- shape/vector/illustration system lacks role, layer, bounds, anchors, responsive behavior, and text-safe zones: max 50 (5/10)
- Native Tooltip Ban violation: browser-native tooltip appears over art-directed SVG: max 40 (4/10)
- Annotation Protected Zone Rule violation: leader line cuts a word or crosses label text: max 30 (3/10)
- Illustration Complexity Honesty Rule violation: primitive ellipses, generic leaves, simple blobs, or childlike drawing claimed as professional illustration: max 40 (4/10)
- Background Texture Quality Rule violation: background reads as AI atmospheric texture: max 50 (5/10)
- nav unreadable over image/type/background: max 40 (4/10)
- nav contrast depends on lucky scroll position: max 50 (5/10)
- nav has no scroll-state readability strategy: max 60 (6/10)
- nav overlaps giant typography without protection: max 50 (5/10)
- nav protection is generic and damages art direction: max 70 (7/10)
- nav unreadability appears above the fold: max 40 (4/10)
- forced app name/logo chrome without justification: max 50 (5/10)
- initials badge used by default: max 50 (5/10)
- app name repeated in nav and hero without need: max 60 (6/10)
- brand chrome appears because of template habit: max 50 (5/10)
- no-logo rule ignored after being documented: max 40 (4/10)
- decorative separator/hairline used without function: max 50 (5/10)
- small red section line used as AI filler: max 50 (5/10)
- repeated label + hairline motif across sections: max 50 (5/10)
- separator line not aligned to real content boundary: max 60 (6/10)
- visual spec does not justify decorative line system: max 60 (6/10)
- no APCA/WCAG contrast check for final palette: max 70 (7/10)
- normal text below APCA `Lc 60` without reason: max 60 (6/10)
- UI component contrast below APCA `Lc 30`: max 60 (6/10)
- palette repaired by changing chroma instead of lightness: max 70 (7/10)
- HSL ramp shows hue drift greater than `10deg` and remains uncorrected: max 60 (6/10)
- palette feels robotic because no perceptual color system was used: max 60 (6/10)
- dashboard immediately reads as AI-created because of dull robotic palette: max 50 (5/10)
- command-center/dashboard palette is one-note dark surface plus blue/cyan accent: max 50 (5/10)
- dashboard palette has no reference or domain rationale: max 60 (6/10)
- approved dashboard references provided but palette/material/routing lessons are ignored: max 50 (5/10)
- all dashboard surfaces share the same dark material weight: max 60 (6/10)
- complex dashboard crams multiple workflows into one page: max 50 (5/10)
- navigation exists but does not create distinct route jobs: max 50 (5/10)
- side nav is decorative anchor navigation for a single process pileup: max 50 (5/10)
- information architecture forces every investigation/decision/action process into one view: max 50 (5/10)
- mobile flow appears as a desktop dashboard card instead of a real mobile route/mode: max 60 (6/10)
- no numeric palette scale for a design system: max 70 (7/10)
- dark mode created by random color picking instead of mapped tokens: max 60 (6/10)
- multi-hue palette has uneven perceived brightness: max 60 (6/10)
- foreground/background token lacks documented contrast target: max 70 (7/10)
- pressable elements have no active feedback: max 70 (7/10)
- interactive target below comfortable size without compensation: max 60 (6/10)
- typography lacks tabular numbers where data aligns: max 70 (7/10)
- user-initiated UI animation exceeds 300ms without reason: max 60 (6/10)
- keyboard or high-frequency interaction is slowed by animation: max 50 (5/10)
- motion ignores frequency-of-use: max 60 (6/10)
- pseudo-elements used without correct layering/content: max 70 (7/10)
- audio feedback has no visual equivalent or mute control: max 50 (5/10)
- UI works but feels dead or unresponsive: max 60 (6/10)
- loading/empty/error states are generic or missing: max 60 (6/10)
- spacing scale feels arbitrary: max 60 (6/10)
- pure black shadows make elevation feel harsh or fake: max 70 (7/10)
- visual hierarchy violates proximity, similarity, or common-region principles: max 60 (6/10)
- micro-polish pass missing before final visual review: max 70 (7/10)
- visual-heavy task has no design read: max 60 (6/10)
- no visual spec for visual-heavy work: max 60 (6/10)
- no active dials declared for visual-heavy or new frontend work: max 70 (7/10)
- no design-system tokens for significant UI: max 70 (7/10)
- visible UI generated before design-system direction exists: max 70 (7/10)
- no frontend aha moment proof for new frontend MVP: max 60 (6/10)
- landing/portfolio page violates major Taste preflight checks: max 60 (6/10)
- visible UI copy contains em-dashes after preflight: max 70 (7/10)
- repeated generic sections or same layout family overused: max 60 (6/10)
- hero overstuffed with micro-labels, trust, pricing, features, or prose: max 60 (6/10)
- CTA wraps on desktop: max 60 (6/10)
- duplicate CTA intent: max 70 (7/10)
- fake div-based screenshot used as product visual: max 50 (5/10)
- generated landing references compress multiple sections into one unreadable image: max 50 (5/10)
- image-first page uses no real images or documented image source when images are part of the chosen direction: max 60 (6/10)
- Unsplash images used without source/photographer manifest: max 60 (6/10)
- major image has no defined role: max 60 (6/10)
- image feels generic/filler stock: max 60 (6/10)
- image crop breaks responsive layout: max 50 (5/10)
- text overlays busy image without safe-zone/scrim: max 50 (5/10)
- image is used as factual product proof without truth basis: max 50 (5/10)
- broken remote image URL: max 40 (4/10)
- missing alt text for meaningful image: max 60 (6/10)
- stock imagery fights selected palette: max 60 (6/10)
- plain text logo wall used as social proof when logos are required: max 60 (6/10)
- generic AI names, fake-perfect numbers, or generic avatar eggs are visible: max 70 (7/10)
- section-number eyebrows, decorative scroll cues, or hero version labels used without real purpose: max 70 (7/10)
- animation has no purpose: max 60 (6/10)
- advanced motion requested but no `docs/design/motion-choreography-plan.md`: max 60 (6/10)
- advanced motion requested but only one animation exists: max 50 (5/10)
- advanced motion has no page/section choreography: max 60 (6/10)
- advanced motion has no image/media motion: max 70 (7/10)
- advanced motion has no typography or navigation motion: max 70 (7/10)
- all sections use the same fade-up: max 60 (6/10)
- motion has no named technique: max 60 (6/10)
- no motion evidence/screenshots/sequence when motion is central: max 60 (6/10)
- motion copied from reference without adapting to concept: max 60 (6/10)
- motion distracts from reading/content: max 60 (6/10)
- ease-in on UI motion: max 50 (5/10)
- scale(0) entrance animation: max 50 (5/10)
- missing prefers-reduced-motion on movement: max 50 (5/10)
- high-frequency action animated: max 40 (4/10)
- `transition: all` in production UI: max 50 (5/10)
- scroll animation causes jank or layout shift: max 50 (5/10)
- delight delays or blocks core task: max 40 (4/10)
- delight mismatches domain seriousness: max 60 (6/10)
- no local core-loop interaction in frontend MVP: max 60 (6/10)
- mock data buried in components: max 70 (7/10)
- code is monolithic/spaghetti: max 60 (6/10)
- implementation ignores efficient-agent workflow and makes broad uninspected edits: max 70 (7/10)
- no inspiration manifest for visual-heavy work that uses inspiration: max 70 (7/10)
- no reference usage report for visual-heavy work using visual-library references: max 60 (6/10)
- missing Scale Calibration for visual-library reference work: max 60 (6/10)
- image-led UI without a contrast strategy: max 60 (6/10)
- image-led/artistic/landing reference work missing Image Environment Strategy: max 60 (6/10)
- wrong reference folder mode used: max 60 (6/10)
- visual-library folder used but no reference anchors selected: max 50 (5/10)
- no reference decomposition before coding: max 50 (5/10)
- no design transfer spec before coding: max 50 (5/10)
- output uses generic mode instead of selected anchor mechanics: max 50 (5/10)
- agent copies mood but not composition: max 60 (6/10)
- agent copies colors but not structure: max 60 (6/10)
- agent ignores image/object/chart behavior from anchors: max 60 (6/10)
- no final reference-match report: max 60 (6/10)
- Command Center / Dashboard Mode used without Dashboard Command-Surface Strategy: max 60 (6/10)
- dashboard feels like generic SaaS/admin template: max 60 (6/10)
- dashboard has no meaningful visual anchor or attraction zone when references show one: max 60 (6/10)
- Dashboard uses murky monochrome / terminal-green palette without reference justification: max 50 (5/10)
- Dashboard overuses one accent color everywhere: max 60 (6/10)
- Dashboard lacks palette strategy in reference report: max 60 (6/10)
- Dashboard lacks graph system strategy: max 60 (6/10)
- Dashboard lacks image/object/media strategy: max 70 (7/10)
- dashboard is a same-weight widget/card field: max 60 (6/10)
- dashboard is text-and-metrics only despite image-aware or graph-rich references: max 60 (6/10)
- dashboard has too few meaningful charts despite graph-rich references: max 60 (6/10)
- dashboard has too few useful chart forms for the product state: max 60 (6/10)
- dashboard charts are decorative or do not support visible decisions: max 60 (6/10)
- meaningful chart implemented with no chart-selection report: max 60 (6/10)
- no chart rationale for dashboard charts: max 60 (6/10)
- chart type does not match data shape: max 50 (5/10)
- chart relies on color alone without value labels, patterns, line styles, or table fallback: max 50 (5/10)
- inaccessible chart type used as primary representation with no fallback: max 50 (5/10)
- real-time chart has motion without pause/reduced-motion behavior: max 60 (6/10)
- major dashboard chart is decorative or unclear: max 50 (5/10)
- decorative/fake chart: max 40 (4/10)
- chart has no clear user question or product decision: max 50 (5/10)
- chart has no documented data contract: max 50 (5/10)
- chart type mismatches the data task: max 50 (5/10)
- axes/labels unreadable: max 50 (5/10)
- chart clips labels, values, units, or tooltips: max 40 (4/10)
- chart lacks empty/error/loading state when needed: max 60 (6/10)
- chart relies only on color for important meaning: max 50 (5/10)
- hidden units or unexplained abbreviations in chart labels: max 50 (5/10)
- visualization library/tool chosen with no rationale: max 60 (6/10)
- chart/diagram review skipped for a UI containing charts, graphs, diagrams, maps, timelines, or canvases: max 60 (6/10)
- diagram/canvas UI lacks diagram-integrity QA evidence or a blocked report when detector markup is practical: max 60 (6/10)
- diagram-integrity detector finds label/object collision and the issue is ignored: max 40 (4/10)
- dashboard imagery/object/media is absent despite relevant reference evidence: max 60 (6/10)
- dashboard uses only text/metrics/panels with no image/object/media layer despite reference support: max 60 (6/10)
- no visual/object/media attraction zone despite reference evidence: max 60 (6/10)
- dashboard imagery is random/pasted-in instead of supporting hierarchy or memorability: max 70 (7/10)
- dashboard density is low because text, cards, charts, padding, or containers are oversized: max 60 (6/10)
- dashboard lacks compositional rhythm between calm and busy zones: max 70 (7/10)
- dashboard is functional but visually forgettable: max 60 (6/10)
- functional but visually unfinished dashboard: max 60 (6/10)
- dashboard lacks polish despite working interactions: max 60 (6/10)
- dashboard feels like a start product, not a designed product: max 60 (6/10)
- dashboard uses many boxes but little crafted hierarchy: max 60 (6/10)
- static dashboard feels dead despite live/monitoring product concept: max 70 (7/10)
- terminal-ish dark panel spam used as dashboard art direction: max 60 (6/10)
- visual-heavy page uses generic top navbar without navigation exploration: max 60 (6/10)
- creative, portfolio, or landing page defaults to logo-left links-center CTA-right without justification: max 50 (5/10)
- three direction options all use the same navigation structure: max 50 (5/10)
- navigation feels pasted on top of the composition: max 60 (6/10)
- navigation competes with the hero instead of supporting it: max 60 (6/10)
- CTA placement in navigation is generic or visually disconnected: max 70 (7/10)
- navigation has no documented responsive behavior: max 60 (6/10)
- navigation lacks clear active/focus states: max 70 (7/10)
- placebo navigation: selected nav/tab/control state changes but visible content, route, scope, filter, or product state does not change: max 30 (3/10)
- cryptic primary navigation: max 50 (5/10)
- navigation abbreviations without obvious meaning: max 60 (6/10)
- icon-only nav without labels, tooltips, or obvious context: max 60 (6/10)
- broken responsive nav: max 50 (5/10)
- nav overlaps content on resize: max 50 (5/10)
- mobile app using desktop navigation without justification: max 50 (5/10)
- top navigation stealing vertical space on mobile: max 50 (5/10)
- poor bottom navigation craftsmanship: max 50 (5/10)
- bottom navigation with poor spacing/alignment: max 50 (5/10)
- duplicated top and bottom navigation for the same primary destinations: max 50 (5/10)
- generic mobile navigation with no personality: max 60 (6/10)
- mobile nav is cryptic or cramped: max 60 (6/10)
- desktop rail simply becomes giant mobile pills: max 60 (6/10)
- mobile modal/sheet is cut off: max 30 (3/10)
- primary modal action below viewport or not reachable: max 40 (4/10)
- modal ignores safe-area bottom: max 50 (5/10)
- modal content cannot scroll when needed: max 40 (4/10)
- modal opens at awkward vertical position: max 60 (6/10)
- bottom nav and modal visually collide: max 50 (5/10)
- active/progress/underline bar overlaps button or tab label: max 40 (4/10)
- selection indicator makes text harder to read: max 50 (5/10)
- selected + hover state makes text disappear: max 30 (3/10)
- interactive text unreadable in hover, focus-visible, active, selected, selected+hover, or selected+focus state: max 40 (4/10)
- hover/focus/selected styling drops label contrast below readable threshold: max 50 (5/10)
- no state contrast matrix for interactive nav, tabs, chips, segmented controls, buttons, cards, menus, or selectable objects: max 60 (6/10)
- control decoration collides with content: max 50 (5/10)
- segmented control active state is unclear or glitchy: max 50 (5/10)
- selectable chip/item does not retain selected state: max 40 (4/10)
- selected state flickers or glitches: max 40 (4/10)
- hover/active/selected states are visually confused: max 50 (5/10)
- selected state is color-only with no secondary cue: max 60 (6/10)
- selectable controls do not affect UI behavior: max 60 (6/10)
- mobile product bottom nav has labels but no icons: max 60 (6/10)
- bottom nav icons are missing or semantically unclear: max 60 (6/10)
- nav badges overlap labels/icons: max 50 (5/10)
- bottom nav active state crowds adjacent items: max 50 (5/10)
- inconsistent icon family in nav: max 60 (6/10)
- add/new action looks like a normal content item: max 50 (5/10)
- add tile lacks plus/icon/action affordance: max 60 (6/10)
- add action placement causes confusion with list content: max 50 (5/10)
- add action uses same styling as content cards without clear distinction: max 50 (5/10)
- primary create action is hidden or ambiguous: max 60 (6/10)
- mobile safe area ignored: max 50 (5/10)
- click/tap feedback is missing or misleading: max 60 (6/10)
- visibly misaligned search/action toolbar: max 70 (7/10)
- toolbar controls collide or wrap badly: max 60 (6/10)
- primary action misaligned from input group: max 70 (7/10)
- too much text inside dashboard containers: max 60 (6/10)
- cards feel like prose boxes: max 60 (6/10)
- scanability weak because every panel is text-heavy: max 60 (6/10)
- oversized full-width button without justification: max 70 (7/10)
- button visually dominates more than its action deserves: max 70 (7/10)
- button proportions feel clumsy/amateur: max 60 (6/10)
- text visibly escapes container: max 20 (2/10)
- primary heading or important text is clipped/cut off: max 30 (3/10)
- chart bars/lines escape chart/card bounds: max 20 (2/10)
- containers overlap on resize: max 30 (3/10)
- card content is clipped/cut off: max 40 (4/10)
- dashboard cards become too narrow to read: max 40 (4/10)
- labels collapse into meaningless fragments: max 50 (5/10)
- responsive design only works at one viewport: max 50 (5/10)
- nav breaks, overlaps, or becomes unreadable on resize: max 50 (5/10)
- image badges/pills overlap unintentionally: max 40 (4/10)
- form fields/buttons become clipped or unreadable: max 40 (4/10)
- any core screen has horizontal overflow: max 50 (5/10)
- chart is visually attractive but structurally broken: max 40 (4/10)
- spatial map/floor-plan/timeline labels collide with objects, cards, glows, or badges: max 40 (4/10)
- pattern canvas labels collide with pieces, badges, callouts, construction lines, ruler labels, or measurement chips: max 30 (3/10)
- catastrophic diagram overlap makes the canvas/graph/map unreadable: max 20 (2/10)
- primary product object is buried by support cards/panels in a desktop command surface: max 50 (5/10)
- desktop command surface collapses into generic card soup instead of preserving the primary product object: max 50 (5/10)
- floor map, seating chart, route map, timeline, or canvas is treated as a generic dashboard card: max 50 (5/10)
- diagram labels collide with objects: max 40 (4/10)
- object layout is arbitrary and undocumented: max 50 (5/10)
- selected object obscures critical labels/data: max 50 (5/10)
- badge, selected outline, or callout obscures core diagram data: max 40 (4/10)
- canvas/diagram has no layer model: max 60 (6/10)
- canvas/diagram has no collision model for labels, badges, callouts, and measurement layers: max 40 (4/10)
- diagram/canvas feels janky, slow, or performance-heavy without mitigation: max 50 (5/10)
- primary product object is buried by support panels/cards: max 60 (6/10)
- diagram is decorative rather than operational: max 50 (5/10)
- inspector/details does not update from selection: max 40 (4/10)
- chart/diagram labels fail long-label, CJK, RTL, or German expansion stress: max 50 (5/10)
- chart/diagram tooltip escapes viewport: max 50 (5/10)
- legend breaks, hides meaning, or cannot wrap/collapse: max 50 (5/10)
- values lack units in quantitative visualizations: max 50 (5/10)
- many series/items make the visualization unreadable with no fallback: max 50 (5/10)
- stat pills/badges collide: max 40 (4/10)
- responsive layout hides or covers content: max 50 (5/10)
- fake live/session status UI: max 50 (5/10)
- fake narrative/fictional incident chip: max 40 (4/10)
- replay/mission chrome used as default app identity: max 40 (4/10)
- fake case-file or dossier identifier: max 30 (3/10)
- oversized replay/status metadata strip: max 40 (4/10)
- status indicator with no user meaning: max 60 (6/10)
- decorative telemetry/status chips: max 60 (6/10)
- palette feels machine-generated/generic: max 60 (6/10)
- banned sepia/espresso/umber archive surface wash appears in a screenshot: max 20 (2/10)
- no Domain Content Contract before app/dashboard/product UI implementation: max 40 (4/10)
- random mock values with no units, ranges, source, or domain meaning: max 30 (3/10)
- generic `mission control`, `control room`, or `command center` label with no real user job: max 30 (3/10)
- `topology`, `traces`, or `system map` used outside a justified observability/network/distributed-systems domain: max 40 (4/10)
- multi-workflow app has no real pages/routes: max 40 (4/10)
- dashboard has abstract metrics but no real entities or user decisions: max 30 (3/10)
- mock data lacks units, statuses, ranges, timestamps, or source/freshness where needed: max 50 (5/10)
- route/page labels do not correspond to real business tasks: max 40 (4/10)
- UI sections are generic AI theater instead of business-specific sections: max 30 (3/10)
- visual style chosen by vibe only with no style-selection report: max 60 (6/10)
- palette selected without reference/product reasoning: max 60 (6/10)
- incompatible visual style systems mashed together without hierarchy: max 60 (6/10)
- style family conflicts with product purpose or reference mode: max 60 (6/10)
- style effects damage accessibility or performance without mitigation: max 60 (6/10)
- dull robotic palette despite expressive references: max 50 (5/10)
- palette not explained in reference report: max 60 (6/10)
- all references treated equally without prioritization: max 70 (7/10)
- no validated done report for visual UI work: max 60 (6/10)
- no done report for visual UI work: max 60 (6/10)
- no visual QA evidence for visual work: max 60 (6/10)
- missing visual screenshots for visual work: max 60 (6/10)
- missing target-copy report during Literal Target Copy Mode: max 60 (6/10)
- missing asset manifest for image-led target reconstruction or production image-led work: max 60 (6/10)
- missing screenshot comparison report during Literal Target Copy Mode: max 60 (6/10)
- build/lint is presented as visual QA without screenshot evidence and done-report validation: max 60 (6/10)
- no 390/768/1440 proof for significant frontend work: max 80 (8/10)
- dogfood target with no back-propagated Design OS rule/tool/prompt/checklist learning: max 60 (6/10)
- new project missing product purpose clarity: max 70 (7/10)
- upload/classify/generate core loop not manually verified: max 60 (6/10)
- user-generated data persistence not specified across route changes, refresh, and browser reopen: max 60 (6/10)
- UI count says 0 while uploaded or user-generated data exists: max 40 (4/10)
- browser chrome, dock, desktop, or editor UI used as informal screenshot proof: max 60 (6/10)
- parallel product, Studio feature, or control app built instead of dogfooding the active target: max 60 (6/10)
- required routed skill skipped for applicable task: max 80
- screenshots missing for one viewport: max 80
- no project-specific visual identity: max 82
- copied source-project palette/layout literally: max 74
- 3-concept Visual Concept Gate skipped for visual-heavy work when Literal Target Copy Mode was not requested: max 60 (6/10)
- visual-heavy task produced only text concepts: max 50 (5/10)
- no rendered visual concepts for visual-heavy concept work: max 50 (5/10)
- Migi was asked to approve art direction without visual previews: max 50 (5/10)
- concept screenshots are missing: max 60 (6/10)
- all 3 concepts share basically the same layout: max 60 (6/10)
- implementation starts before visual concept approval: max 60 (6/10)
- inspiration flattened into shallow styling traits: max 60 (6/10)
- rejected layout kept with new paint: max 60 (6/10)
- strong visual reference provided but result preserves only surface styling: max 60 (6/10)
- output uses generic app layout instead of reference composition: max 60 (6/10)
- primary object in reference is replaced by grid/cards/dashboard: max 60 (6/10)
- Literal Target Copy Mode requested but the result changes composition or adds unrelated product UI: max 50 (5/10)
- landing-page / artistic / creative / image-led request becomes a generic SaaS, blog, or grid page: max 60 (6/10)
- premium website/landing task skips image-first analysis when visual references or image generation are available: max 60 (6/10)
- multi-section website reference compressed into one unreadable board: max 60 (6/10)
- implementation drifts from section references into generic coded layout: max 60 (6/10)
- hero cluttered with fake pills, system labels, or micro-UI during website image-to-code work: max 60 (6/10)
- artistic hero followed by generic cards, stacked sections, or normal content blocks: max 70 (7/10)
- imagery is used as filler instead of the composition driver: max 70 (7/10)
- image used as decoration only: max 70 (7/10)
- page is text-heavy despite image-led references: max 60 (6/10)
- strong grids or cards dominate an artistic landing direction without reference support: max 60 (6/10)
- result feels like Blogspot or content-template structure: max 50 (5/10)
- hero is good but the rest becomes generic: max 70 (7/10)
- AI scale inflation visible: max 60 (6/10)
- giant headline/container attack: max 60 (6/10)
- desktop viewport shows fewer than 3 meaningful content objects without strong reference justification: max 60 (6/10)
- oversized image used as filler: max 70 (7/10)
- desktop layout feels like enlarged mobile layout: max 60 (6/10)
- mobile app looks like scaled-down website: max 50 (5/10)
- mobile flow lacks native-feeling nav, safe areas, or thumb-safe actions: max 60 (6/10)
- containers much larger than their content: max 60 (6/10)
- reference folder has dense controlled UI but output is sparse/giant: max 50 (5/10)
- hero consumes the screen and hides core product loop without justification: max 60 (6/10)
- important text hard to read over image: max 50 (5/10)
- small text over busy image without protection: max 50 (5/10)
- CTA text or navigation text has weak contrast: max 50 (5/10)
- text readable in one viewport but failing in another: max 60 (6/10)
- focal image/object is darkened or covered until emotional impact is lost: max 70 (7/10)
- multiple image cards use inconsistent overlay treatments without reason: max 70 (7/10)
- contrast depends on a lucky crop: max 60 (6/10)
- image-led reference implemented as boxed/card image without justification: max 60 (6/10)
- artistic landing page uses rigid two-column image/text grid despite immersive references: max 60 (6/10)
- strong image treated as decoration instead of composition driver: max 60 (6/10)
- full-scene reference reduced to square image asset: max 50 (5/10)
- image is trapped in visible grid/card structure and loses emotional impact: max 60 (6/10)
- text is readable but image is over-darkened until focal object loses emotion: max 70 (7/10)
- page has good image but layout still feels component-led: max 70 (7/10)
- main object unclear: max 64
- primary action unclear: max 64
- clickable/passive ambiguity in primary flow: max 70 (7/10)
- unsupported live/data/safety/AI claims: max 79
- mobile accidental horizontal scroll in primary flow: max 79
- visible UI elements overlap or collide unintentionally: max 60 (6/10)
- dead button in the primary UI: max 60 (6/10)
- external watermark, editor artifact, browser chrome, or copied tooling artifact visible in production UI: max 40 (4/10)
- target screenshots used as production assets: max 40 (4/10)
- product logic added before visual shell parity approval: max 60 (6/10)
- text on button or unintended button/control overlap: max 50 (5/10)
- animation exists only for decoration and does not clarify state/interaction/hierarchy: max 70 (7/10)
- oversized AI-app typography or containers overwhelm the product: max 60 (6/10)
- user feels attacked by scale on first load: max 60 (6/10)
- design follows the most obvious genre cliche without a fresh thesis: max 70 (7/10)
- first-screen information wall before the user has a reason to care: max 70 (7/10)
- excitement is created mainly through badges/glows/stats instead of composition and interaction: max 70 (7/10)
- selection-first product does not make objects desirable to click: max 70 (7/10)

## Categories

Total: 100.

Elite: 90 to 100. Pass: 80 to 89. Needs work: 65 to 79. Fail: below 65.

### 1. Product Fit And Identity - 15

- 5: visual identity is named and fits current project type
- identity check: strong themes have a non-obvious visual thesis and avoid the first genre cliche
- 4: palette/tokens are project-specific, not copied
- domain palette fit: colors match product domain, user environment, task pressure, emotional state, and state semantics
- 3: density matches task complexity
- 3: source-project influence is marked as evidence, not template

### 2. Primary Object And Action - 15

- 5: primary object is visible in the first viewport
- 4: primary action is attached to that object
- 3: secondary content supports the object
- 3: page title/nav does not replace the actual object

### 3. Interaction Grammar - 15

- 4: clickable and passive roles are visually distinct
- 3: one primary action per zone
- 3: hover/focus/active/selected states exist where relevant
- 3: disabled/loading states are implemented without layout shift
- 2: component choice matches role

### 4. Layout And Composition - 15

- 4: no container soup in primary regions
- 3: desktop adds actionable context for non-editorial tools: inspector, preview, comparison, table density, or source rail
- dashboard check: command-center work has one attraction zone, varied panel weights, useful chart forms, and calm/busy rhythm
- desktop command-surface check: the primary product object stays central and support panels do not bury it
- spatial UI check: labels on maps, floor plans, seating charts, timelines, and canvases have protected zones
- 3: spacing/alignment supports scanning without extra wrappers
- overlap check: text, badges, controls, stats, and imagery do not collide at tested viewports
- 3: layout recipe matches archetype
- 2: visual hierarchy works without reading all labels

### 5. Responsive Evidence - 15

- 5: 390 px mobile has no clipping, accidental horizontal scroll, or sticky collision
- 4: 768 px tablet is not broken mobile or cramped desktop
- 2: 1024/1280 intermediate widths do not squeeze cards, labels, charts, nav, or forms into unreadable states
- 2: 1440 px desktop uses width appropriately
- 2: screenshots prove the above

### 6. Copy And Data Truth - 10

- 3: action labels are specific verbs
- 2: helper copy changes a decision or explains state
- 2: status/data claims include source, recency, scope, or fallback
- 2: empty/error/loading copy is present where needed
- 1: tone matches product type

### 7. Component Completeness - 10

- 2: button variants and states complete
- 2: tags/chips/tabs have distinct roles
- 2: rows/cards/drawers match the object model
- 2: async states preserve layout
- 2: focus-visible and accessible names are present for key controls

### 8. Asset And Motion Use - 5

- 2: imagery/assets identify the subject, show the product/object, explain state, or help inspection
- 2: motion communicates state or feedback
- 1: no generic AI/SaaS decoration

## Additional Required Lenses

These do not change the 100-point total, but they can trigger caps and blockers.

### Design System Quality

- semantic color tokens exist before implementation
- typography roles are defined
- spacing/radius/shadow/border logic is coherent
- chart colors and state colors are intentional
- component variants are consistent
- image treatment and motion rules are named

### Visual Spec Completeness

- active dials are declared
- references and selected mode are named
- layout skeleton and visual thesis exist
- interaction and responsive strategy are buildable
- evidence plan is explicit

### Palette Intelligence

- palette is reference/product-driven
- accent has a defined role
- state colors are not confused with brand color
- contrast risks are named and mitigated

### Chart Intelligence

- chart type matches data shape
- chart answers a user decision
- accessibility fallback exists
- chart bounds and responsive behavior are planned

### Mobile Platform Fit

- mobile is not a scaled-down website
- nav is thumb-safe and readable
- safe areas and touch targets are planned
- 390 px proof exists or blocker is documented

### Mobile Product Interaction Integrity

- mobile modal/sheet fits the viewport, respects safe areas, scrolls internally when needed, and keeps primary actions reachable
- bottom nav uses semantic icons plus readable labels for practical product apps
- selected chips, tabs, filters, object selectors, and segmented controls visibly persist selected state until changed
- hover, pressed, focused, selected, and disabled states are distinct where relevant
- active bars, progress strips, underlines, and selection indicators do not overlap labels or content
- add/create actions are visually distinct from content cards and use clear plus/create affordance
- 390 px proof checks sheet fit, bottom nav safety, selection persistence, add/create affordance, and control indicator collision

### Frontend Aha Moment

- local/mock data is truthful and isolated in data files
- core loop works locally
- visible controls are not dead
- backend is not added unless requested or contract is approved

### Tool Discipline

- useful context was read first
- edits are scoped
- components are not monolithic
- logs/screenshots/errors guide debugging
- final proof is concise and concrete

### Brief Inference Quality

- design read names page kind/product type
- audience is specific
- vibe language is explicit
- selected mode/system/aesthetic fits the brief
- quiet constraints are named

### No-Image Direction Gate

- `docs/design/direction-options.md` exists
- `docs/design/direction-layout-maps.md` exists
- `docs/design/direction-risk-check.md` exists
- Safe Refined, Artistic Expressive, and Unexpected High-Character are meaningfully distinct
- no paid image API was called unless Migi explicitly approved it and the command used `--paid-ok`
- no Figma AI, Figma Weave, Figma Make, paid generation, AI credits, Figma Motion, Figma Draw, Dev Mode-only operation, or paid-seat feature was used automatically
- each direction names primary product object, domain palette rationale, nav state effect, interaction promises, risk, complexity, and recommendation score
- once Migi selects A, B, C, or a hybrid, selected-direction.md leads directly into implementation unless Migi explicitly requested planning-only/no-code

### Evidence-Backed Critique

- report states dual-assessment method or degraded single-context reason
- Nielsen heuristic scoring is present
- cognitive load is assessed
- persona red flags are selected by mode
- priority issues are capped at 3-5 and include concrete fixes
- screenshot/browser evidence is used when available
- critique snapshot is saved when possible

### Text Clarity

- primary CTAs are specific
- error states include recovery
- empty states include next action
- destructive confirmations name object and consequence
- terminology is consistent
- placeholders are not the only labels

### Production Hardening

- long text and translation expansion do not break layout
- empty/loading/error/retry states exist for async UI
- destructive/concurrent actions prevent double-submit
- icon-only controls have accessible labels
- color is not the only status signal
- large datasets have pagination/search/virtualization plan
- modals/sheets survive small viewport and long content

### Anti-AI-Tell Compliance

- visible UI copy has zero em-dashes
- no generic names, fake-perfect numbers, or generic avatars
- no fake div screenshots
- no decorative fake status/session/live chips
- no scroll cues, section-number eyebrows, or hero version labels without purpose
- CTA intent and label system are clean

### Landing / Portfolio Craft

- every section has a job
- generated references are one horizontal image per section
- section rhythm varies
- palette and typography stay locked
- hero stack is disciplined
- image usage is structural, not decorative

### Motion Craft

- each animation has a purpose
- frequency profile matches the control
- duration/easing follows motion standards
- reduced-motion behavior exists
- performance avoids layout animation and `transition: all`

### Advanced Motion / Choreography

- `docs/design/motion-choreography-plan.md` exists when advanced motion is requested
- motion references and named techniques are documented
- at least page/section, image/media, typography, navigation/menu, and micro-feedback layers are planned
- section-by-section motion map exists
- signature motion moment supports the concept
- tool stack is selected deliberately
- reduced-motion fallback preserves meaning
- motion evidence or capture blocker is documented
- result is scored against `evaluation/benchmarks/motion-cinematic.benchmark.md` when motion is central

### Delight Appropriateness

- delight is earned by user moment
- personality register fits domain seriousness
- delight never blocks or delays core task
- errors and high-stakes flows stay clear before charming

## Blockers

Any blocker prevents elite:

- main object unclear
- primary action unclear
- passive metadata looks clickable in the primary flow
- first screen is an information wall before desire, action, or object clarity
- source-project palette/layout copied literally
- In The Loop social patterns applied to a non-social product
- text overlap or clipping in primary flow
- ambient light blob, dotted texture, or amateur vector illustration appears as generic advanced UI atmosphere
- illustration lines, stems, arcs, callouts, masks, or paths cross/cut readable text
- browser-native tooltip appears over art-directed SVG
- important text hard to read over image, gradient, video, texture, or washed-out panel
- text over image has no deliberate protection method
- CTA or navigation text has weak contrast
- text contrast passes one viewport but fails another
- text on button or unintended button/control overlap
- accidental mobile horizontal scroll
- build/lint used as visual QA proof without screenshots and done-report validation
- dogfood target failure not translated back into a Miguel Design OS patch or explicit open gap
- product purpose is unclear for a new app or dogfood target
- upload/classify/generate core loop is unverified in an app whose product promise depends on that loop
- user-generated data persistence is unstated or contradicted by the UI
- UI count says 0 while uploaded or user-generated data exists
- browser chrome, dock, desktop, or editor UI is used as screenshot proof
- a parallel product, Studio feature, or control app is built while the active goal is dogfooding a target app
- no done without evidence: visual UI work is missing a validated done report
- visual-heavy inspiration work is missing an inspiration manifest
- visual-heavy work using visual-library references is missing `docs/design/reference-usage-report.md`
- visual-library folder or screenshot set is used as the basis, but Reference-Locked Build Mode did not select 3-5 exact anchors
- Reference-Locked Build Mode is active, but `docs/design/reference-decomposition.md` is missing before coding
- Reference-Locked Build Mode is active, but `docs/design/design-transfer-spec.md` is missing before coding
- implementation ignores the design transfer spec and falls back to generic mode
- final handoff in Reference-Locked Build Mode lacks `docs/qa/reference-match-report.md`
- Command Center / Dashboard Mode is missing Dashboard Command-Surface Strategy
- Command Center / Dashboard Mode is missing Dashboard Palette Strategy or Graph System Strategy
- dashboard reference work has no attraction zone, focal object, dominant chart, media/object block, scene, map, or equivalent visual gravity
- dashboard reference work becomes generic SaaS/admin template or same-weight card soup
- dashboard charts are decorative filler instead of supporting decisions, status, comparison, or trend
- dashboard major chart is decorative or unclear
- dashboard uses murky monochrome / terminal-green palette without reference justification
- dashboard uses sepia/espresso/umber brown-black archive wash on panels, cards, sidebars, or nav backgrounds
- dashboard overuses one accent color everywhere
- dashboard uses only text, metrics, and panels despite image/object/media reference support
- dashboard lacks live/state energy when the product represents monitoring, activity, or freshness
- dashboard density is low because scale, cards, charts, or padding are inflated
- cryptic primary navigation or unexplained nav abbreviations
- responsive navigation overlaps content, becomes cramped, or loses label clarity
- search/filter/action toolbar is visibly misaligned or collides on wrap
- text, charts, bars, chips, badges, controls, or card titles escape/cut off their containers
- chart bars, lines, points, axes, or labels escape plot/card bounds
- labels collapse into meaningless fragments without a legend
- dashboard cards become too narrow to read instead of reorganizing
- responsive design only works at one viewport
- dashboard panels are prose-heavy enough to kill scanability
- primary actions are oversized full-width buttons without layout justification
- fake live/session/telemetry/status UI appears with no real product meaning
- palette feels machine-generated, robotic, or generic despite reference evidence
- dashboard is only functional and still visually unfinished
- visual-library reference work is missing Scale Calibration
- image-led or visual-library reference work is missing Contrast / Legibility Strategy
- image-led/artistic/landing reference work is missing Image Environment Strategy
- wrong reference folder mode used
- major images have no declared role or are decoration only
- all references treated equally with no prioritization
- visual work is missing visual QA evidence
- Literal Target Copy Mode is missing a validated target-copy report
- image-led target reconstruction or production image-led work is missing a validated asset manifest
- Literal Target Copy Mode is missing a screenshot comparison report
- target screenshots are used as production assets
- product logic was added before visual shell parity approval
- dead button in the primary UI
- external watermark, editor artifact, browser artifact, or copied tooling artifact visible in production UI
- unsupported live/data/safety/AI claim
- visible UI elements overlap or collide unintentionally
- responsive resize causes overlapping containers, colliding pills, covered content, or horizontal overflow on a core screen
- content escapes containers or chart bounds on any tested core viewport
- card titles, form fields, or primary controls are clipped/cut off
- labels lose semantic meaning due to responsive squeezing
- obvious genre cliche without a fresh thesis
- Visual Concept Gate skipped when required
- text-only art direction for visual-heavy work
- art direction approval requested without visual previews
- missing concept screenshots
- all 3 visual concepts use basically the same layout
- implementation started before visual concept approval
- reference flattened into shallow traits
- same rejected layout with new paint
- landing-page / artistic / creative / image-led request turned into generic SaaS, blog, grid, or dashboard furniture
- artistic hero followed by generic cards or section stacking
- hero follows the reference but the rest of the page becomes generic
- image-led reference used as decoration instead of composition driver
- Literal Target Copy Mode requested but composition changes or unrelated product UI is added
- decorative motion that clarifies nothing
- AI scale inflation overwhelms the product
- giant headline/container attack overwhelms the product
- desktop viewport has fewer than 3 meaningful content objects without strong reference justification
- desktop layout feels like enlarged mobile
- hero consumes the screen and hides the core product loop without justification
- hope-based contrast: important text relies on a lucky crop or noisy background
- focal image/object is covered or darkened until emotional impact is lost
- immersive image-led reference reduced to boxed/card/grid image treatment
- strong image is present but the page still feels component-led
- selection-first product lacks object desire or relies on badge/glow/stat clutter for excitement
- missing scorecard result
- required routed skill skipped for the task

## Required Report

Always report:

- skills used
- approved rendered concept
- reference folder mode and reference usage report when visual-library references are used
- Reference-Locked Build Mode status, selected anchors, anchor roles, reference decomposition, design transfer spec, and reference-match report when a folder or screenshot set is the requested basis
- Image Environment Strategy when image-led/artistic/landing references are used
- Scale Calibration summary when visual-library references are used
- Contrast / Legibility Strategy when image-led or visual-library references are used
- image role strategy for major images
- Navigation Strategy for dashboard or visual-heavy work
- Toolbar Alignment Strategy for visible search/filter/action groups
- Text Density Strategy for dense panels
- Button Proportion Strategy for CTAs and repeated actions
- Responsive Collision Checks at 1440, 1280, 1024, 768, and 390
- Layout Integrity Contract for visual-heavy work
- Responsive Breakpoint Proof at 1440, 1280, 1024, 768, and 390
- Palette Direction and why it avoids machine/default color
- total score after caps
- category scores
- concept screenshots used when visual-heavy work applies
- screenshots used
- core loop proof and persistence truth when applicable
- dogfood target learning and Design OS patches when applicable
- done report path and validation result for visual UI work
- target-copy report path and validation result when Literal Target Copy Mode applies
- asset manifest path and validation result for image-led target reconstruction or production image-led work
- exact target differences when Literal Target Copy Mode applies
- dashboard attraction zone, panel mix, chart forms, image/object strategy, and calm/busy rhythm when dashboard references are used
- top 3 fixes
- blockers
- verification gaps
- whether the UI was patched after review

## Signature Interaction Score Caps

- Award-level/signature references provided but no signature interaction selected or justified: max score 6.
- Generic section stack after signature interaction references: max score 4.
- Copied reference branding instead of extracted mechanics: max score 4.
- Playful interaction blocks access with no fallback: max score 5.
- Portal/morphing claim but only fade/slide delivered: max score 4.
- Review/testimonial section generic despite Review Theater pattern: max score 6.
- Modal/detail interaction uses default dialog styling despite Editorial List Detail Modal pattern: max score 6.
- No reduced-motion fallback for signature motion: max score 5.
- Signature interaction is not visible in screenshot or motion evidence: max score 6.
- Static SVG illustration delivered where the selected signature interaction requires animated reveal: max score 5.
- If no signature interaction appears after award-level references, the final verdict cannot be "masterpiece."

## Illustration-First Gate Score Caps

- Full page built before illustration asset passes: max score 4.
- Hero illustration looks amateur: max score 4.
- Botanical/character/object illustration uses primitive ellipses/blobs: max score 4.
- No isolated illustration review before full page: max score 5.
- Illustration-heavy project has no style guide: max score 5.

## No Ambient Background Blobs Score Caps

- Visible generic background blob: max score 4.
- Generic dot/star field as atmosphere: max score 4.
- Atmosphere shape has no role/purpose: max score 4.
- Background decoration competes with primary content: max score 4.
- "Premium glow" with no reference justification: max score 5.

## Botanical / Organic Illustration Score Caps

- Primitive botanical illustration: max score 4.
- Repeated ellipse leaves as hero art: max score 4.
- No species-specific silhouette: max score 5.
- No reference grammar: max score 5.

## Native Tooltip Ban

No art-directed SVG may expose browser-native tooltips over the visual surface. Do not put `title` attributes on child SVG elements. Do not create child `<title>` elements that appear as browser hover tooltips in art-directed surfaces. Use top-level SVG `<title>` and `<desc>` only for accessibility. Decorative inner groups must be `aria-hidden="true"` and `pointer-events="none"` unless intentionally interactive.

If a browser-native tooltip appears in screenshot review: max score 4.

## Annotation Protected Zone

Leader lines, annotation rules, stems, connectors, and decorative lines may never cross through label text. Every annotation must define anchor point, leader path, label box, protected label zone, collision fallback, and responsive fallback.

- If a leader line cuts through text: max score 3.
- If annotation labels collide with art or other labels: max score 4.

## Layout Integrity Score Caps

- Final UI integrity gate not run: max score 50 (5/10).
- Final UI integrity gate blocked/failed: max score 40 (4/10).
- Critical text clipped: max score 2.
- Clipped critical text visible: max score 2.
- Word cut off in screenshot: max score 2.
- Nav label overflows item: max score 3.
- Nav label overflow visible: max score 3.
- Sticker/card covers headline word: max score 3.
- Button/CTA text clipped: max score 3.
- CTA/button text clipped: max score 3.
- Card title/body clipped: max score 3.
- Media/image/video over readable text: max score 3.
- Overlapping containers cover text: max score 3.
- Fixed/sticky overlay covers content: max score 3.
- Text hidden by `overflow: hidden`: max score 3.
- Accidental huge blank viewport area: max score 4.
- Unresolved user complaint remains visible: max score 2.
- Screenshot contradicts final report: max score 2.
- Unresolved text/container issue appears in screenshot: max score 3.
- No text fit strategy for sticker/card/nav system: max score 5.
- Nav label outside item: max score 3.
- Nav huge dead space at breakpoint: max score 4.
- Nav active state clips text: max score 3.
- Nav lacks responsive variant: max score 5.
- Nav inaccessible after label hiding: max score 5.
- Compact nav uses arbitrary abbreviations: max score 4.
- Nav hides full labels without icons: max score 4.
- Nav icons lack accessible labels: max score 5.
- Active compact nav item is unclear: max score 5.
- Nav looks clipped/broken at small width: max score 3.
- No small-screen nav variant: max score 5.
- Large accidental blank viewport area: max score 4.
- Empty space from layout bug: max score 3.
- Scroll/pinned stage has blank dead frame: max score 4.
- Whitespace has no stated purpose in visual spec: max score 6.

## Final UI Integrity Gate v2 Score Caps

- Final gate v2 not run on visual frontend work: max score 4.
- Final gate v2 failed but handoff claimed success: max score 2.
- Layout failure appears at any sampled width: max score 3.
- Floating container overlaps another container: max score 3.
- Cut text remains after gate: max score 2.
- Final report lacks screenshot matrix evidence: max score 4.
- Final report does not include failed/passed viewport list: max score 4.
- Floating object overlaps important container: max score 3.
- Floating object covers readable text: max score 3.
- Floating object has no responsive placement strategy: max score 5.
- Free-floating absolute object causes failure at intermediate width: max score 3.

## Final UI Integrity Gate v3 Score Caps

- Final gate v3 not run on visual frontend work: max score 4.
- Final gate v3 failed but handoff claimed success: max score 2.
- Fixed breakpoint-only evidence for final handoff: max score 4.
- Width sweep evidence missing: max score 4.
- Critical text clipped by viewport edge: max score 2.
- Viewport-edge clipping remains after gate: max score 2.
- Active card/panel partially unreadable: max score 3.
- CTA/nav clipped by viewport edge: max score 3.
- Horizontal scroll shows partial critical content at rest: max score 3.
- Horizontal route has unreadable partial content: max score 3.
- Active content cut during horizontal scroll: max score 3.
- Horizontal scroll creates accidental blank area: max score 4.
- Floating object overlaps content after resize: max score 3.
- Floating object becomes compositionally lost: max score 4.
- Arbitrary free-floating absolute object causes failure: max score 3.
- Scroll choreography damages readability: max score 3.
- Scroll route creates partial unreadable content: max score 3.
- Agent preserves scroll gimmick despite readability failure: max score 2.
- Detail panel disconnected from clicked trigger: max score 4.
- Selected item not visibly connected to detail: max score 5.
- Detail opens below fold without focus/scroll: max score 4.
- Default modal used where designed reveal required: max score 5.
- No selected state on detail trigger: max score 5.
- Mobile route nav disappears on scroll: max score 3.
- Mobile nav is top-only for app-like route experience: max score 4.
- Compact route nav has no bottom/persistent access: max score 4.
- Mobile nav lacks icons or clear labels: max score 4.
- Mobile nav lacks accessible labels: max score 5.
- Mobile nav blocks content or ignores safe area: max score 4.
- Fake LIVE badge: max score 4.
- Fake live feed label: max score 3.
- Fake live icon/dot: max score 3.
- Fake realtime/presence status: max score 3.
- No justification for live terminology: max score 5.
- Repeated fake activity language: max score 3.
- Fake narrative/fictional incident chip: max score 4.
- Fake severity/status badge used as theater: max score 4.
- Replay/mission chrome used as default identity: max score 4.
- Oversized replay metadata strip: max score 4.
- Fake case-file or dossier identifier: max score 3.
- Repeated AI-theater chips across pages: max score 3.
- UI relies on AI-theater labels instead of real IA: max score 5.
- Messy exposed backing corner: max score 4.
- Misaligned media backplate: max score 3.
- Mismatched radius causing broken corner: max score 3.
- Offset layer looks accidental: max score 4.
- No corner inspection for layered media: max score 5.
- Clicked nav item does not become selected: max score 2.
- Adjacent/right-side item becomes selected: max score 2.
- Nav item never receives selected state: max score 2.
- First/last nav item never receives selected state: max score 2.
- Visual active state and route target disagree: max score 3.
- Active state is inaccessible/no aria-current: max score 5.
- No click-through QA of every nav item: max score 5.
- Duplicate mobile/desktop nav state mismatch: max score 4.
- App name unreadable over dark/variable background: max score 3.
- Brand chrome over image/background without contrast strategy: max score 4.
- Wordmark contrast depends on lucky crop/scroll position: max score 4.
- No brand chrome contrast proof: max score 5.
- Forced app-name chrome remains despite readability failure: max score 3.

## Elite Scroll Choreography Caps

These caps apply when a site claims elite, award-level, Awwwards, original, authored, million-dollar, video-first, portal, horizontal route, pinned media, card assembly, media constellation, or other scroll-heavy choreography.

- elite scroll requested but only fade-in sections delivered: max score 40 (4/10)
- selected scroll pattern not visible: max score 40 (4/10)
- scroll-to-assemble claim but objects do not assemble: max score 40 (4/10)
- pinned/sticky stage has blank dead frame: max score 40 (4/10)
- horizontal scroll route has no mobile fallback: max score 50 (5/10)
- scroll movement covers critical text: max score 30 (3/10)
- moving video/media covers critical text: max score 30 (3/10)
- video/image covers critical text: max score 30 (3/10)
- scroll-transformed object crosses protected text zone: max score 30 (3/10)
- video-to-object transform has no protected-zone map: max score 50 (5/10)
- media object is above text by z-index without readable surface: max score 40 (4/10)
- screenshot shows media/text collision: max score 30 (3/10)
- persistent video overlay without reserved lane: max score 40 (4/10)
- content containers thinned to fit media: max score 30 (3/10)
- cards become unreadable because of media placement: max score 30 (3/10)
- video remains after hero with no defined role: max score 50 (5/10)
- media placement forces awkward text wrapping: max score 40 (4/10)
- media object wins over content integrity: max score 30 (3/10)
- no scroll-state screenshots for media-heavy choreography: max score 50 (5/10)
- scroll nav does not sync to chapters: max score 50 (5/10)
- no reduced-motion fallback for scroll choreography: max score 50 (5/10)
- scroll implementation causes horizontal overflow: max score 40 (4/10)
- no scroll-choreography review for scroll-heavy site: max score 60 (6/10)

## Elite Experience Specialist Caps

- scroll feels jittery or raw: max score 5.
- no scroll smoothing spec for scroll-heavy site: max score 6.
- video/media used only as background when media-object stage was required: max score 5.
- media crop breaks subject or text readability: max score 4.
- physical prop clips text: max score 3.
- physical prop has no role/text-fit strategy: max score 5.
- default modal used where designed detail reveal was required: max score 5.
- detail panel overflows or lacks close/focus behavior: max score 4.
- playful/brand site uses generic SaaS copy: max score 5.
- CTAs do not match brand voice: max score 6.
