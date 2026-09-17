# Skill Routing Map

Use the smallest useful skill set. Skills are specialists, not a pile of prompt text to load every time.

## Orchestration / Self-Correction

Use `creative-orchestration-director` when the task spans multiple skills, a critique must become fixes, a dogfood finding needs Design OS repair, or Migi asks to improve the skill system.

Required loop:

1. Route the smallest specialist chain.
2. Create/update creative state.
3. Require evidence or a blocked-evidence note.
4. Normalize results into `templates/skill-verdict.template.json`.
5. Convert failures into `templates/reports/repair-task-queue.template.md`.
6. Assign an owner skill and acceptance check for each repair.
7. Re-run the evidence gate that found the issue.

## New Visual-Heavy App

1. No-Image Fast Direction Gate by default: read `design-dna/NO_IMAGE_DIRECTION_GATE_CONTEXT.md` and `design-dna/FAST_DIRECTION_GATE_CONTEXT.md`, create `docs/design/direction-options.md`, `docs/design/direction-layout-maps.md`, and `docs/design/direction-risk-check.md`, then stop.
2. After Migi selects A/B/C/hybrid, selection means build approval: create `docs/design/selected-direction.md` and continue.
3. `domain-realism-mock-data-director` for every app/dashboard/product UI before visual spec.
4. `visual-spec-compiler`
4. `design-dna/design-system-first-rules.md`
5. `oklch-contrast-palette`
6. `unsplash-asset-sourcing` when real imagery is required
7. mode-specific skill
8. implementation
9. `screenshot-scorecard-review`
10. `anti-ai-slop-review` / `anti-ai-tell-preflight`
11. `text-clarity-review` when copy-heavy product UI exists
12. `production-hardening-review` before calling product UI production-ready
13. `final-ui-integrity-gate` before final handoff
14. `evidence-backed-critique` for full post-build critique
15. `make-interfaces-feel-better`
16. `review-animations` if motion code exists

Deep Direction Gate is opt-in only for deep exploration, full strategy, full spec, research, benchmark, or reference decomposition.

## Landing / Portfolio / Marketing

1. `image-first-frontend`
2. `landing-page-craft-director`
3. `unsplash-asset-sourcing` when real photography or Unsplash assets are needed
4. `anti-ai-tell-preflight`
5. `oklch-contrast-palette`
6. `motion-craft-director` if motion is planned
7. `screenshot-scorecard-review`

## Real Imagery / Unsplash

1. `unsplash-asset-sourcing`
2. `image-first-frontend`
3. `oklch-contrast-palette` for image/palette compatibility
4. `screenshot-scorecard-review` for crop, safe-zone, and broken image checks

Use when real imagery is needed, image-first frontend is active, landing pages depend on photography, Migi asks for Unsplash, or a visual spec includes image roles but no assets.

## Dashboard / Data Product

1. `domain-realism-mock-data-director`
2. `agent-workflows/reference-locked-build-mode.md`
3. `dashboard-graph-system`
3. `chart-system-director`
4. `data-visualization-selection`
5. `diagram-canvas-system` when maps, floor plans, timelines, canvases, or node graphs are present
6. layout-integrity rules from `design-dna/new-app-generation-rules.md`
7. `data-viz-hardening-review` after implementation
8. `screenshot-scorecard-review`

## Charts / Diagrams / Spatial Canvas

1. `chart-system-director` for charts, graphs, analytics, comparisons, rankings, distributions, timelines, gauges, maps, heatmaps, and data-encoding visuals.
2. `diagram-canvas-system` for pattern canvases, floor maps, seating charts, node graphs, workflow builders, spatial maps, architecture diagrams, and object-based product surfaces.
3. `data-visualization-selection` when chart type selection needs data-shape guidance.
4. `design-intelligence/visualization-tool-routing.md` for D3, Observable Plot, Vega-Lite, ECharts, Recharts, Chart.js, Nivo, React Flow, React Konva/Konva, Mermaid, D2, custom SVG, or CSS/HTML routing.
5. `design-dna/diagram-canvas-elite-quality-bar.md` for pattern canvases and dense diagram quality.
6. `data-viz-hardening-review` after implementation.
7. `tools/diagram-integrity-check.mjs` for runnable spatial UIs with `data-diagram-*` markup.
8. `screenshot-scorecard-review` for visible label, bounds, tooltip, legend, overlap, and responsive evidence.

## Domain Realism / Mock Data

Use `domain-realism-mock-data-director` before visual spec for every new app, dashboard, product UI, mobile flow, and dogfood project.

Required:

- Domain Content Contract
- business type and primary users
- core entities
- real pages/routes
- route jobs
- mock data schema and sample records
- metric definitions
- units, ranges, statuses, timestamps, and source/freshness labels
- banned generic terms and domain replacements

Hard blockers:

- random mock values
- generic `mission control`, `control room`, `command center`, `topology`, `traces`, or `system map` labels without product-domain justification
- dashboard panels with no real business entity or user decision
- one-page pileups where real routes/pages should separate workflows

## Mobile Product

1. `mobile-product-flow`
2. bottom navigation rules from `design-dna/mobile-navigation-defaults.md`
3. mobile product rules from `design-dna/mobile-product-rules.md`
4. safe-area, modal/sheet fit, icon+label bottom nav, selection persistence, add-action differentiation, and control-indicator collision checks
5. `screenshot-scorecard-review`

## Color / Contrast

1. `oklch-contrast-palette`
2. `design-intelligence/color-guidance.md`
3. `screenshot-scorecard-review`

## Vector / Illustration / Texture

1. Global `vector-form-system-director` for SVG, vector forms, abstract shapes, masks, clipping, illustration systems, callouts, shape-heavy landing pages, and texture-heavy visual stages.
2. `visual-spec-compiler` must require Texture / Illustration Role Inventory, shape inventory, layer stack, bounds, anchors, responsive behavior, accessibility/decorative status, and text-safe zones.
3. `screenshot-scorecard-review` must reject ambient light blobs, foggy radial glows, dotted/star-field/micro-dot texture, amateur vector illustration, fake botanical/scientific plates, and any illustration path crossing or clipping readable text.

## Figma Work

1. Read `design-dna/figma-cost-safety-rules.md`.
2. Use only normal Figma Plugin API operations: pages, frames, vectors, shapes, text, variables if available, styles, components, node metadata, and storyboard frames.
3. Stop before any Figma AI, Figma Weave, Figma Make, paid generation, AI credits, Figma Motion, Figma Draw, Dev Mode-only operation, or paid-seat feature.
4. Required blocked response: `Blocked: this requires a paid or plan-gated Figma feature.`

## Motion

1. `animation-vocabulary` for naming.
2. `advanced-motion-choreography` when Migi asks for advanced animations, cinematic motion, artistic motion, award-winning motion, Awwwards/Godly/Recent-level motion, scroll animations, appearing while scrolling, portfolio motion, or motion like Graffico/Manet/UXBert/Podium.
3. `motion-craft-director` for product motion planning.
4. Implementation.
5. `tools/capture-motion-sequence.mjs` if the UI can run and motion is central.
6. `review-animations` for code review.
7. `make-interfaces-feel-better` for final feel polish.
8. `screenshot-scorecard-review` for evidence.
9. `emil-design-engineering` for craft polish when component details need review.

Advanced motion requires `docs/design/motion-choreography-plan.md`, at least page/section, image/media, typography, navigation/menu, and micro-feedback layers, reduced-motion behavior, and `evaluation/benchmarks/motion-cinematic.benchmark.md` scoring.

## Anime.js Motion Primitive

Use `animejs-motion-director` when a project proposes Anime.js, JavaScript timeline choreography, staggered DOM/SVG/object motion, CSS variable animation, weather/terrarium particles, selected-state transitions, rail/detail continuity, or tactile JavaScript feedback.

Required order:

1. Use CSS for simple hover/focus/active states when sufficient.
2. Read `design-dna/animejs-motion-primitive-rules.md`.
3. Answer `prompts/dogfood/animejs-motion-gate.md`.
4. Use `implementation-kits/animejs-motion/README.md` for React/Next scoping and cleanup.
5. Define reduced-motion fallback, static fallback, mobile behavior, cleanup, and screenshot proof before coding.
6. Run `review-animations`, `screenshot-scorecard-review`, and `final-ui-integrity-gate` before handoff when Anime.js code ships.

Do not route Anime.js for generic fade-and-rise, fake live/status pulsing, scroll hijacking, full-page animation takeover, or motion that exists only because the dependency was installed.

## WebGL / Shader Visual Primitives

Use `webgl-shader-primitives` when a project proposes WebGL, shaders, ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo effects, animated premium gradients, or shader-based visual identity.

Required order:

1. Read `design-dna/webgl-shader-visual-primitives-rules.md`.
2. Run the WebGL Shader Primitive Gate from `templates/prompts/webgl-shader-primitives-gate.md`.
3. Decide whether the effect is concept-critical or generic decoration.
4. If approved, use `templates/implementation-kits/webgl-shader-primitives/README.md`.
5. For Next/React projects, document React 18 vs React 19 / R3F compatibility before installing dependencies.
6. Treat `visual-primitives/liquid-logo/README.md` as source inspiration only, not an npm package dependency.
7. Require static fallback, reduced-motion fallback, mobile behavior, bounded canvas/GPU area, z-index containment, no pointer traps, no fake live affordance, performance note, and screenshot proof.
8. Run `final-ui-integrity-gate`, `production-hardening-review`, and `screenshot-scorecard-review` before handoff.

Do not route this skill for normal product UI where shaders do not materially improve the product concept.

## Typographic Motion Site Art Direction

Use `typographic-motion-art-director` when a project proposes dark-canvas, huge-type, ghost-pill controls, category-color taxonomy, organic foreground motion objects, bracket annotations, or animation-library style references.

Required order:

1. Read `design-intelligence/style-references/gsap-typographic-motion-reference.md`.
2. Read `design-dna/typographic-motion-site-rules.md`.
3. Run the gate in `prompts/dogfood/typographic-motion-reference-gate.md`.
4. Use `implementation-kits/typographic-motion-site/README.md` for token, type, control, taxonomy, object, motion, and mobile strategy.
5. If Anime.js or WebGL is proposed, route the relevant implementation primitive after the art direction is justified.
6. Require token mapping, mobile proof, contrast review, reduced-motion fallback, and screenshot evidence.

Do not route this skill for serious dashboards, dense admin products, regulated workflows, data-clarity-first apps, generic dark themes, or exact GSAP brand cloning.

## Final Polish

1. `make-interfaces-feel-better`
2. `frontend-art-director-review`
3. `screenshot-scorecard-review`
4. `text-clarity-review` when copy clarity matters
5. `production-hardening-review` when production readiness is claimed
6. `evidence-backed-critique` when Migi asks for critique or a finished dogfood UI needs full review

## Evidence-Backed Critique

Use `evidence-backed-critique` when Migi asks "critique this", uploads screenshots for review, a dogfood app reaches final state, a UI feels wrong but the exact issue is unclear, or post-build quality scoring is needed.

Do not use it when creating first direction options, doing Fast Direction Gate, writing implementation code, or doing quick small fixes.

## Overlap Clusters

Do not merge these yet. Route them intentionally.

### Image-First / Website-To-Code / Landing Craft

- `image-first-frontend` handles image/reference-first implementation.
- `image-first-website-to-code` handles premium website section translation.
- `landing-page-craft-director` handles landing rhythm, section jobs, and anti-Blogspot discipline.

### Landing Pattern / Landing Craft / Anti-AI Preflight

- `landing-page-pattern-director` selects the landing pattern.
- `landing-page-craft-director` directs composition and section rhythm.
- `anti-ai-tell-preflight` blocks generated-page tells before handoff.

### Anti-Slop / Art Director / Screenshot Scorecard

- `anti-ai-slop-review` catches generic AI-builder failure modes.
- `frontend-art-director-review` critiques visual thesis and composition quality.
- `screenshot-scorecard-review` enforces evidence, responsiveness, and hard caps.

### Motion-Craft / Review-Animations / Emil Polish / Delight

- `advanced-motion-choreography` plans award-level page motion.
- `motion-craft-director` plans product motion.
- `review-animations` approves or blocks motion code.
- `emil-design-engineering` checks invisible component craft.
- `delight-opportunity-director` finds earned personality moments.

### Dashboard-Graph-System / Data-Visualization-Selection

- `dashboard-graph-system` defines the command surface and graph system.
- `chart-system-director` defines the visualization intent, data contract, chart/tool choice, states, responsiveness, and accessibility.
- `data-visualization-selection` chooses chart types from data shape and user decision.
- `diagram-canvas-system` defines spatial canvas coordinate/layer/object/label/collision/selection models.
- `data-viz-hardening-review` stress-tests implemented charts, diagrams, labels, legends, tooltips, axes, and canvases.

## Signature Interaction Gate

For artistic, brand, portfolio, experimental landing, playful product, and image-led sites, consult `skills/signature-interaction-director/SKILL.md` when references include memorable mechanics such as portal entry, scroll route choreography, mascot motion, scroll-assembled cards, editorial list modals, media constellations, directional page transitions, or playful entry gates.

Rules:
- Select one signature interaction before implementation, or explicitly justify why none is appropriate.
- Extract mechanics, not brand skin. Do not copy logos, mascots, names, colors, exact content, or proprietary media.
- Include the selected mechanic in the visual spec when chosen.
- Final review must check whether the signature mechanic is visible, meaningful, accessible, and supported by reduced motion.
- Generic section stack after signature references is a hard failure.

## Illustration-First Gate

For illustration-heavy work, route in this order:
1. `skills/illustration-art-director/SKILL.md`
2. `skills/svg-illustration-system/SKILL.md` when SVG/vector implementation is planned
3. isolated asset review through `skills/illustration-quality-review/SKILL.md`
4. Migi approval or explicit pass when required
5. full page build

Do not route directly from brief to full page if custom illustration is the visual hero.

Use `templates/prompts/illustration-first-gate.md` or `templates/prompts/asset-first-illustration-test.md` before implementation.

## Background Atmosphere Routing

When a design includes background atmosphere, blobs, glows, ellipses, dot fields, grain, or material texture, consult `design-dna/background-atmosphere-rules.md`. Generic ambient background blobs are rejected unless they are primary objects, selected signature-interaction objects, approved reference-derived mechanics, or named shape-inventory items with role, layer, and purpose.

## Layout Integrity Gate

For all implemented visual-heavy pages, landing pages, product UIs, mobile flows, pages with custom nav, sticker/card/badge/overlay systems, large display type, and scroll/sticky/pinned experiences, route `skills/layout-integrity-review/SKILL.md` before final handoff.

Use after screenshot evidence exists. If a runnable URL exists, run `tools/layout-integrity-check.mjs --url <url> --out docs/qa/layout-integrity/ --width-sweep 360:1920:40 --heights 720,844,900,1080` or document why blocked.

Required post-build order:
1. screenshot-scorecard-review
2. layout-integrity-review
3. interaction-verification
4. text-clarity-review
5. production-hardening-review
6. anti-ai-slop-review
7. final-ui-integrity-gate
8. final-scorecard

## Final UI Integrity Gate

For every frontend implementation, landing page, app redesign, visual-heavy page, scroll/motion-heavy page, mobile/product UI, custom navigation page, or page with media/cards/stickers/labels/overlays/custom typography, route `skills/final-ui-integrity-gate/SKILL.md` before final handoff.

Final UI Integrity Gate v3 must sample a width sweep from `360` to `1920` in `40px` steps or smaller when practical, height samples `720, 844, 900, 1080`, scroll samples `0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, 1.00`, and applicable interaction states. Fixed breakpoint-only screenshots cannot pass the final gate.

Relationship:

- `screenshot-scorecard-review` reviews screenshot quality and score caps.
- `layout-integrity-review` reviews layout/text/container risk.
- `final-ui-integrity-gate` is the fail-closed final gate after screenshots and layout review.

If final UI integrity is failed or blocked, the agent must fix the UI and rerun validation before responding. A failed gate forbids a passed final verdict. Viewport-edge clipping, horizontal partial content, floating-object drift, and blank scroll states are blockers. Follow `agent-workflows/fail-closed-final-handoff-contract.md` for final response fields and blocked/failed handoff behavior.

## Agent Skill Layer V2 Routing

For nontrivial design/frontend work, route in this order:

1. `creative-session-state-manager` to establish live context and artifact graph.
2. `failure-memory-retrieval-router` to retrieve rejected evidence and active score caps.
3. `skill-orchestration-planner` to choose the smallest sufficient skill DAG.
4. `reference-grammar-compiler` if references guide the work.
5. `preference-model-migi-taste-learner` after explicit Migi feedback or postmortem signals.
6. `responsive-constraint-solver` before implementation when layout/nav/text/container risk exists.
7. `interaction-state-matrix-director` before implementation for stateful controls.
8. `creative-prototype-spike-director` before full-page build when a risky creative mechanic must be proven.
9. Existing specialist implementation/review skills.
10. `evidence-to-repair-planner` after findings.
11. `artifact-contract-validator` before final handoff.

Do not use the new layer to add paperwork. Use it to preserve memory, select skills, prevent known failures earlier, repair from evidence, and block false completion.

## Elite Scroll Choreography

Use elite-scroll-choreography-director when Migi asks for elite, Awwwards, million-dollar, original, authored, or memorable scroll experiences; when references include Stiff-like routes, Bucks-like card assembly, Wembi-like list/detail reveals, Podium-like portal/media stages, Don’t Board Me-like directional transitions, or Bunk Radio-like video-first interfaces; or when a page feels like static sections but should travel, assemble, open, dock, settle, or transform.

Routing order:
1. signature-interaction-director selects the memorable mechanic when needed.
2. elite-scroll-choreography-director creates the route/chapter/timeline/fallback plan.
3. implementation with data hooks when runnable.
4. scroll-choreography-review after implementation.
5. layout-integrity-review after scroll review.
6. benchmark with evaluation/benchmarks/elite-scroll-choreography.benchmark.md when scroll is central.

Do not accept fade-only scrolling, blank pinned stages, moving objects covering text, media/video objects covering protected text, persistent video overlays without reserved lanes, content containers thinned to fit media, horizontal routes without mobile fallback, unsynced chapter nav, or missing reduced-motion fallback. Use `visual-library/rejected/case-studies/late-check-fm-scroll-media-text-collision/` as the rejected reference for media/text collision and `visual-library/rejected/case-studies/late-check-fm-persistent-video-overlay-container-thinning/` as the rejected reference for persistent video overlay and container-thinning failures.

## Elite Experience Specialists

Use these after signature-interaction-director or elite-scroll-choreography-director identifies a richer craft need:

1. scroll-physics-smoothing-director: scroll engine, smoothing, scrub, lerp, snap, settle, velocity, touch behavior, mobile fallback, reduced motion, and performance budget.
2. media-object-stage-director: media as hero, crop, mask, sticky object, poster, portal, card, broadcast tile, or detail view with crop/safe-zone/fallback/state map, protected text zones, reserved media lanes, and forbidden overlap zones.

For scroll/media-heavy UI, required artifacts are `docs/design/protected-zone-map.md`, `docs/design/media-object-stage-plan.md`, and `docs/design/scroll-motion-spec.md`. Read `design-dna/media-text-protected-zone-rules.md`, `design-dna/video-media-placement-rules.md`, and `design-dna/text-container-integrity-rules.md`. Run scroll choreography review and then layout integrity review with scroll-state screenshots.

Hero-only media default: use video in the top stage unless a later state has an explicit role. If media stays visible after hero, it must be docked, reserved in a media lane, or converted to a static poster/thumb. Content wins over media; never preserve a media gimmick by making cards narrow or text unreadable.
3. physical-interface-props-director: tactile stickers, labels, tickets, stamps, keycards, rails, tabs, pins, and cards with role, material, text-fit, and protected zones.
4. designed-detail-reveal-director: non-default drawers, panels, sleeves, split views, object pull-outs, station boards, and ritual selectors with state, focus, close, keyboard, and responsive fallback.
5. brand-voice-as-interface-director: CTAs, nav labels, cards, reviews, detail panels, empty/loading/error states, and microcopy as authored interface voice.

## Anchored Detail Reveal Routing

Route `skills/designed-detail-reveal-director/SKILL.md` when cards, rows, objects, stations, media tiles, service items, work items, or route rooms open detail panels.

Use `design-dna/anchored-detail-reveal-rules.md`, `templates/checklists/anchored-detail-reveal-checklist.md`, and `templates/reports/anchored-detail-reveal-report.md`.

Final review must block when the detail panel is disconnected from the clicked trigger, selected state is unclear, the panel opens below the fold without focus/scroll, or a default modal appears where a designed reveal was required.

## Mobile Bottom Navigation Routing

Route `skills/mobile-product-flow/SKILL.md`, `skills/layout-integrity-review/SKILL.md`, and `skills/final-ui-integrity-gate/SKILL.md` for mobile route/app experiences, scroll-heavy chapter sites, interactive landing pages with stations/sections, and pages with 3+ primary destinations.

Use `design-dna/mobile-navigation-defaults.md`, `design-dna/navigation-responsiveness-rules.md`, `templates/checklists/mobile-bottom-nav-checklist.md`, and `templates/reports/mobile-bottom-nav-report.md`.

Final review must block when mobile route navigation appears only at the top, disappears on scroll, lacks bottom-accessible route control, lacks safe-area handling, or loses full accessible labels.

Do not use all five by default. Route only the specialist that matches the selected mechanic or observed failure.
