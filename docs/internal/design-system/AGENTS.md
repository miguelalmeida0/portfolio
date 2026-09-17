# Agent Instructions

Miguel Design OS is a simple design memory and frontend-agent instruction system. It is not a product app and does not require a frontend Studio UI.

## Start Here

For Design OS dogfood projects and any continuation/hand-off work, read `HANDOVER_START_HERE.md` before application planning. Do not start application UI until Design OS ingestion proof exists in the dogfood project.

No-image fast direction gate default: for normal new visual-heavy app/design tests, read `design-dna/NO_IMAGE_DIRECTION_GATE_CONTEXT.md` and `design-dna/FAST_DIRECTION_GATE_CONTEXT.md` first. Paid image generation is disabled by default. Use the full Design OS planning stack only when Migi asks for deep exploration, full strategy, research, benchmark, reference decomposition, or implementation after selection.

For any frontend/design task:

1. Read `design-dna/00_COMPACT_AGENT_CONTEXT.md`.
2. Inspect `visual-library/README.md`.
3. Check `visual-library/approved/` for relevant references.
4. Check `visual-library/rejected/` for relevant anti-patterns.
5. Classify task mode.
6. Declare active design dials from `design-dna/design-generation-dials.md`.
7. Use `agent-workflows/simple-visual-reference-workflow.md` when visual references matter.
8. Use `agent-workflows/reference-locked-build-mode.md` when Migi asks to base work on a specific visual-library folder or screenshot set.
9. Use `agent-workflows/image-first-frontend-workflow.md` for image/reference-first website or visual-heavy work.
10. For new visual-heavy work with no approved direction, first run the No-Image Fast Direction Gate: create `docs/design/direction-options.md`, `docs/design/direction-layout-maps.md`, and `docs/design/direction-risk-check.md`. Do not create visual specs, QA docs, build/lint reports, or frontend code before selection.
11. Stop for Migi to choose A, B, C, or a hybrid during the first direction pass.
12. When Migi chooses, treat that as implementation approval unless Migi explicitly says spec only, planning only, do not implement, wait, no code yet, direction selection only, just document it, or do not edit src.
13. After selection, create `docs/design/selected-direction.md` and continue immediately into visual spec, design-system tokens, implementation, validation, and URL handoff when a dev server starts.
14. Create `docs/design/visual-spec.md` from `templates/visual-spec.template.md` before visual-heavy implementation.
15. Define design-system tokens from `design-dna/design-system-first-rules.md` before significant UI implementation.
16. Run an OKLCH/APCA palette pass for significant UI, palette repair, dark mode, chart colors, or contrast-sensitive work.
17. Use `skills/unsplash-asset-sourcing/SKILL.md` when real imagery, Unsplash, or source-image roles are needed.
18. Create `docs/design/navigation-strategy.md` before visual-heavy navigation implementation.
19. Use `agent-workflows/efficient-agent-implementation-workflow.md` for nontrivial implementation.
20. Apply an interface-feel polish pass after the main layout works and before final screenshot review.
21. Use routed skills only when relevant; do not load the whole repo.
22. Run benchmark scoring from `evaluation/benchmarks/` when a mode benchmark exists.
23. For dogfood targets, create a postmortem from `docs/qa/dogfood-postmortem.template.md`.
24. Run `node tools/design-os.mjs route --task "<task>"` when the CLI is useful.
25. Route `skills/creative-orchestration-director/SKILL.md` when a task spans multiple skills, critique must become repairs, or Design OS itself is being improved.
26. Run `evaluation/ui-scorecard.md` before finishing significant frontend work.

## Core Rules

- Never build a generic SaaS dashboard unless Migi explicitly asks for one.
- Miguel Design OS operating model: classify mode, direction gate, selected direction, visual spec, design-system tokens, OKLCH/APCA palette, implementation, screenshot QA, specialist review, benchmark scoring, dogfood postmortem, then Design OS patch only if justified.
- Self-correction is mandatory for multi-skill work: every critique, audit, scorecard, and dogfood finding must become a machine-readable skill verdict plus repair queue with owner skill, target, action, acceptance check, and evidence to close.
- `visual-library/` is the screenshot source of truth. `evaluation/benchmarks/` is the scoring/test layer that references visual-library assets. Do not create duplicate benchmark screenshot folders or copy images out of visual-library.
- Prompt templates in `templates/prompts/` are the standard way to start new app work, direction-only work, post-selection implementation, benchmark review, and postmortem ingestion.
- Chart-rich/dashboard work must route through chart selection: pick chart types from data shape and user decision, not from dashboard decoration.
- Any chart, graph, diagram, map, timeline, floor plan, pattern canvas, node graph, or canvas-like product object must route through the visualization system. Charts need user question, data contract, tool/library rationale, labels, states, responsive behavior, and accessibility. Spatial canvases need coordinate system, layer model, object model, label safe zones, collision strategy, selection/inspector behavior, and responsive fallback. When runnable diagram markup exists, use `tools/diagram-integrity-check.mjs` or record why it is blocked. Broken diagrams cannot be hidden under visual polish.
- Pattern canvases and dense diagrams must meet `design-dna/diagram-canvas-elite-quality-bar.md`: no clipped primary text, no catastrophic overlap, label lanes, callout routes, badge safe zones, measurement hierarchy, construction-line semantics, detector QA, and rendering/performance budget.
- Visual style must be selected deliberately from product fit, reference mode, accessibility, performance, and Migi's rejected directions. Do not use random style roulette.
- Premium website / landing page work should be image-first when generation or strong references are available: section references, deep analysis, implementation, screenshot QA.
- Landing, portfolio, marketing, and redesign work needs a design read before coding: `Reading this as: <page kind/product type> for <audience>, with a <vibe> language, leaning toward <mode/system/aesthetic>.`
- Landing/portfolio/marketing work must run Taste-style anti-AI-tell preflight before handoff: no visible em-dashes, fake screenshots, generic names, fake numbers, CTA wrap, duplicate CTA intent, scroll cues, hero clutter, plain text logo walls, or repeated generic sections.
- Motion must have a product purpose, frequency profile, duration/easing plan, performance budget, and reduced-motion behavior. Do not animate high-frequency actions.
- Anime.js is a controlled motion primitive, not permission to animate everything. Use `skills/animejs-motion-director/SKILL.md` before adding Anime.js, JavaScript timeline choreography, staggered DOM/SVG/object motion, weather particles, selected-state transitions, rail/detail continuity, or tactile JavaScript feedback. CSS remains first choice for simple states. Anime.js must be scoped, cleaned up on unmount, reduced-motion safe, mobile-safe, screenshot-proven, and free of fake live/status theater.
- Advanced/cinematic/artistic/portfolio motion is choreography, not one animation. When Migi asks for advanced animations, cinematic motion, artistic motion, Awwwards/Godly/Recent-level motion, scroll animation, appearing while scrolling, portfolio motion, or motion like Graffico/Manet/UXBert/Podium, route `skills/advanced-motion-choreography/SKILL.md`, create `docs/design/motion-choreography-plan.md`, implement multiple motion layers, capture motion sequence evidence or a blocker, and score `evaluation/benchmarks/motion-cinematic.benchmark.md`.
- WebGL/shader visual primitives are experimental by default. Use `skills/webgl-shader-primitives/SKILL.md` before adding ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logos, animated premium gradients, or shader atmospheres. WebGL is not taste by default: it must support the product concept, stay bounded, keep DOM content readable without WebGL, include static/reduced-motion/mobile fallbacks, avoid pointer traps and fake live affordances, and provide screenshot proof.
- Typographic Motion Site is optional art direction, not a global theme. Use `skills/typographic-motion-art-director/SKILL.md` when a project truly needs dark-canvas, huge-type, ghost-pill controls, category-color taxonomy, organic foreground motion objects, and animation-library energy. Do not apply it to serious dashboards, dense admin products, or data-clarity-first apps, and never blindly clone GSAP.
- Media/text protected zones are mandatory for scroll/media-heavy UI. Moving video, image, media, portal, sticky, pinned, card, or scroll-transformed objects may never cover critical text. Read `design-dna/media-text-protected-zone-rules.md`, `design-dna/video-media-placement-rules.md`, and `design-dna/text-container-integrity-rules.md`, create `docs/design/protected-zone-map.md`, `docs/design/media-object-stage-plan.md`, and `docs/design/scroll-motion-spec.md`, then run scroll choreography review and layout integrity review. Late Check FM is the rejected case study family for this failure.
- Hero-only media default: video belongs in the top/hero stage by default. After hero, media exits, docks into a reserved component, becomes a static poster/thumb, or stays only inside a reserved media lane. Content wins over media: no persistent video overlay, media-over-text, or container thinning to fit media.
- New visual-heavy work requires the No-Image Fast Direction Gate by default: create only `docs/design/direction-options.md`, `docs/design/direction-layout-maps.md`, and `docs/design/direction-risk-check.md`; then stop for Migi to choose before coding.
- No paid image generation by default. Do not call `OPENAI_API_KEY`, `gpt-image`, or paid image APIs during the direction gate unless Migi explicitly writes `I approve paid API image generation for this run.` and the command includes `--paid-ok`.
- Figma cost safety is strict. Do not use Figma AI, Figma Weave, Figma Make, paid generation, AI credits, Figma Motion, Figma Draw, Dev Mode-only operations, or paid-seat Figma features. Use only normal Figma Plugin API operations: pages, frames, vectors, shapes, text, variables if available, styles, components, node metadata, and storyboard frames. If a Figma request requires a paid or plan-gated feature, stop and report exactly: `Blocked: this requires a paid or plan-gated Figma feature.`
- No-image direction cards must include layout maps, domain palette rationale, primary product object, nav state effect, interaction promises, risk, complexity, and recommendation score. Vague vibe cards fail the gate.
- Deep Direction Gate is opt-in only for deep exploration, full strategy, research pass, benchmark pass, reference decomposition, or reference-locked planning.
- Direction selection means build. When Migi chooses Direction A, B, C, says use/go with a direction, or selects a hybrid like `B palette + C navigation`, the agent must create/update `docs/design/selected-direction.md` and proceed through visual spec, design-system tokens, implementation, validation, and final URL handoff without asking for another implementation confirmation. Stop only when Migi explicitly says spec only, planning only, do not implement, wait, no code yet, direction selection only, just document it, or do not edit src.
- Required flow after direction selection: `docs/design/selected-direction.md`, `docs/design/visual-spec.md`, `docs/design/design-system-tokens.md`, `docs/design/color-and-contrast.md` or equivalent palette doc, `docs/design/navigation-strategy.md` for visual-heavy work, `docs/design/motion-choreography-plan.md` when advanced motion is requested, `docs/qa/anti-ai-tell-preflight.md`, implementation, build/lint, screenshot/dev-server report if available, final response with URL when a dev server starts.
- Visual-heavy work requires active dials and a visual spec before implementation.
- Significant UI work requires design-system direction before components: semantic colors, typography, spacing, radius, shadow/elevation, borders, chart/state colors, component variants, image treatment, and motion.
- Significant UI work requires OKLCH/APCA contrast logic before final palette approval. Repair contrast by changing OKLCH lightness, not random hex/chroma tweaks.
- Artistic, landing, portfolio, cinematic, creative, editorial, and experimental work requires palette exploration: safe refined, artistic expressive, and unexpected high-character palette directions before locking tokens. Do not default to muddy brown/charcoal/orange, generic blue-grey, AI purple glow, beige premium cliche, terminal green, neon lime, or safe neutrals with one predictable accent. Strict ban: do not use the muddy sepia/espresso/umber brown-black archive wash as a page, stage, card, container, panel, sidebar, or navigation background. Do not rationalize it as nocturne, archive, field guide, botanical, brass, tobacco, parchment, premium, cinematic, or vintage.
- Critical sepia container ban: the muddy sepia/espresso/umber brown-black surface family is a P0 blocker on cards, panels, containers, notes, sidebars, nav, stages, and app backgrounds. If it appears in a screenshot, redesign the palette before continuing; max score 2.
- Frontend MVPs must create a local aha moment first: truthful mock data in data files, all visible interactions working locally, and no backend unless requested.
- Domain realism is mandatory for every generated app. Before visual spec or implementation, define a Domain Content Contract: business type, real users, core entities, real pages/routes, route jobs, mock data schema, realistic sample records, units/ranges/statuses/source labels, and banned generic terms. Hostels need rooms, beds, bookings, guests, rates, locations, housekeeping, events, and maintenance. Restaurants need menu items, ingredients, orders, tables, reservations, kitchen tickets, inventory, and suppliers. Dashboards need real KPIs, queues, owners, SLAs, costs, segments, drilldowns, and route jobs. Do not use random values, `mission control`, `topology`, `traces`, `system map`, or abstract command labels unless the product domain truly requires them and the data contract proves it.
- For `01-command-centers-dashboards` or dashboard-folder references, build an image-aware, graph-rich, composed command surface: one attraction zone, varied panel weights, useful chart forms, reference-driven human palette, deliberate image/object/media roles, compact scale, mixed materials, optional live/state energy, route architecture, and calm/busy rhythm. Do not ship same-weight card soup, murky monochrome / terminal-green dashboards, single-accent overuse, text-and-metrics-only dashboards, terminal-ish dark panel spam, decorative charts, image-starved surfaces, robotic AI dark palettes, or one-page process pileups.
- Dashboard information architecture must split complex operational work into focused routes or modes. Every nav item must carry a distinct product job. Overview, timeline, services, traces, hypotheses, blast radius, decision log, rollback, postmortem, and mobile flows should not all compete on one giant page.
- Global UI craft matters as much as art direction: navigation labels must be understandable, responsive nav must be deliberately designed, search/actions must align, panels must be scan-first instead of prose-heavy, buttons must be proportionate, layouts must not collide at 1440/768/390, and palettes must feel human/reference-driven rather than machine-generated.
- Product palettes must fit the domain, environment, task pressure, and emotional state. The sepia/espresso/umber brown-black archive wash is forbidden for backgrounds, panels, cards, containers, sidebars, and nav bars. Nav/tabs/filters must not be placebo controls: selected state must change visible content, route, scope, filter, or product state. Maps, floor plans, seating charts, timelines, and canvases need protected label zones. Desktop command surfaces must keep the primary product object central instead of burying it in card soup.
- Navigation is art direction, not a default sticky bar. For visual-heavy apps, landing pages, portfolios, creative/editorial sites, dashboards, and redesigns, create `docs/design/navigation-strategy.md`, explore at least 3 navigation concepts, select a pattern from `design-intelligence/navigation-patterns.json`, and document desktop/tablet/mobile behavior before implementation. Do not default to the same logo-left links-center CTA-right navbar, rounded pill nav, sticky black bar, or mobile top link dump.
- Navigation must survive its background. If nav overlays images, giant typography, video, gradients, or changing scroll states, it needs a designed readability strategy; unreadable floating nav is a hard failure.
- Compact navigation must use icons or a real menu pattern, not arbitrary two-letter labels. Never use cryptic initials like `IN`, `WL`, `BD`, `NW`, `RL`, or `BK` as the primary small-screen fallback; preserve full accessible labels and show the active full label when possible.
- Do not force app name/logo/initials chrome. Migi often wants identity to live in the composition, not in a persistent logo/app-name chip or logo-left habit. Add visible brand chrome only when requested or justified in the visual spec.
- Do not use decorative circular/orbital/radar/HUD line overlays as atmosphere. Fake sonar, orbit, target, and circular arc graphics are rejected unless explicitly requested and functional.
- Do not use ambient light blobs, foggy radial glows, soft spotlight smears, or blurred "cool advanced UI" haze as background texture. These are banned AI defaults unless Migi explicitly requests that exact motif and the visual spec proves a functional scene/light role.
- Do not use dotted/star-field/micro-dot background texture as atmosphere. Dot fields are banned as generic texture unless they are explicit data, a functional grid, a documented brand pattern, or a real sourced material texture requested by Migi.
- Do not ship amateur vector illustrations. Any SVG/shape/illustration must have role, layer, bounds, anchors, responsive behavior, accessibility/decorative status, and text-safe zones. Childlike linework, fake botanical/scientific plates, arbitrary petals/stems, and roleless decorative forms fail.
- Illustration lines, stems, arcs, callouts, masks, and vector paths must never cross readable words or clip/cut text. Text-safe zones beat decorative drawing every time.
- Native Tooltip Ban: no art-directed SVG may expose browser-native tooltips over the visual surface. Do not use `title` attributes on child shapes. If using `<title>`/`<desc>` for accessibility, scope them to the top-level meaningful SVG; decorative groups are `aria-hidden` and `pointer-events: none` unless interactive.
- Annotation Protected Zone Rule: leader lines, annotation rules, stems, and decorative marks may never cross through label text. Every annotation label needs anchor, offset, label box, protected zone, and collision strategy.
- Illustration Complexity Honesty Rule: do not claim professional illustration if the art is primitive ellipses, generic leaves, or simple blobs. Botanical, character, and object subjects require silhouette study, detail budget, linework strategy, motif library, material/texture strategy, and reference grammar.
- Background Texture Quality Rule: no generic dot grid, star field, random noise, or vague glow blob unless explicitly justified by reference mechanics. Texture must be material paper, photographic/grain, meaningful field marks, image-led atmosphere, or brand-specific pattern.
- Do not use decorative separator ornaments: tiny hairlines, red dividers, label rails, corner ticks, or section-label-plus-line filler. Lines must separate real content or be removed.
- Mobile navigation default: apps with 3+ primary destinations use bottom navigation on mobile unless the task is a documentation site, desktop-first enterprise tool, editor software, or scrolling-first website. The top of mobile app screens is for branding, page title, search, context, or hero imagery.
- Persistent mobile bottom navigation: for mobile route/app experiences, scroll-heavy chapter sites, interactive landing stations, and pages with 3+ primary destinations, primary route navigation must stay accessible while scrolling and default to a bottom navigation / bottom route controller. Top-only mobile route navigation that disappears on scroll is a hard failure.
- Anchored detail reveal: when a card, item, station, media tile, or container opens a detail panel, the detail must stay visually/programmatically connected to the selected trigger through inline expansion, adjacent panel, anchored popover, connected drawer, split view, object pull-out, or explicit mobile sheet. A detail panel opening far away from the clicked object is a blocker.
- No fake live affordances: do not use `LIVE`, `live feed`, pulsing live dots, fake activity labels, fake realtime copy, or fake online/presence states unless real live functionality exists. Static content should use honest board/current-state language.
- No AI-theater chrome: do not use decorative `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Mission Room`, `Case File`, `CL-####`, dossier, operation, or fake severity/status chips unless they are real product objects with documented behavior. These labels are banned as generic AI app drama.
- Offset container alignment: when placing a container behind another container, align the backplate/offset layer precisely. Messy exposed corners, mismatched radii, and accidental backing-layer leaks are blockers.
- Navigation active state correctness: when the user clicks a nav item, that exact item must become active. Adjacent/right-side active-state bugs are critical blockers; active state must be keyed by stable nav id.
- Brand chrome readability: app names, wordmarks, initials, and logo text must remain readable over every background state. Dark bands, imagery, video, gradients, and scroll-changing backgrounds require a stable contrast strategy or the brand chrome must move/remove.
- Mobile product interaction integrity is mandatory: modals/sheets must fit the viewport and safe areas, bottom nav uses icons plus readable labels, selectable chips/items preserve selected state, add/create actions look distinct from content, and control decorations never overlap labels.
- P0 layout integrity comes before taste: text, charts, nav, cards, badges, buttons, forms, and containers must stay inside their intended bounds and remain readable at real viewport sizes. Responsive design must adapt, not squeeze desktop UI until labels collapse or content escapes.
- Do not use fake live/session/status theater. Only show live, monitoring, session, telemetry, or glowing status indicators when they have real product meaning, are understandable to the user, and affect a decision.
- Do not use fake narrative/replay/mission/case-file theater. Labels must name real routes, tasks, states, filters, or data, not decorate the app with generated incident fiction.
- Never claim visual quality without screenshot evidence when the UI can run.
- Screenshots are design evidence, not production assets.
- If Migi says `copy this exact UI`, `100% this design`, `literally what you see`, or `exact visual target`, use Literal Target Copy Mode.
- If Migi points to a visual-library folder, select the correct Reference Folder Mode before layout and create `docs/design/reference-usage-report.md` before visual-heavy coding.
- If Migi says to use a specific visual-library folder or make it like a set of screenshots, activate Reference-Locked Build Mode: select 3-5 exact reference anchors, create `docs/design/reference-decomposition.md`, create `docs/design/design-transfer-spec.md`, build from that spec, and finish with `docs/qa/reference-match-report.md`.
- If Migi says landing page, creative, artistic, cinematic, editorial, visual-heavy, or image-led, use Landing Page / Artistic Mode: poster logic, image-led composition, sparse copy, no Blogspot structure, and no dashboard furniture.
- Every major image needs a declared role; images are not random decoration.
- When real imagery is needed, use Unsplash Asset Sourcing: create `docs/design/unsplash-search-plan.md`, select images by role/query/orientation/color/content_filter/order_by, and create `docs/design/unsplash-asset-manifest.md` with source, photographer, download metadata, alt text, crop strategy, palette relationship, safe-zone notes, and product-truth notes.
- Unsplash images are mood/atmosphere/source material, not proof of real product operation. Do not use stock photos as real labs, customers, facilities, products, teams, or evidence unless true.
- For artistic, landing-page, cinematic, editorial, or image-led references, decide whether the image is environment or asset. Do not trap immersive scenes in rectangular cards by default.
- Avoid AI scale inflation globally: calibrate text, containers, cards, images, spacing, and above-the-fold density against the selected references. Premium does not mean gigantic.
- Protect contrast globally: important text needs a stable readable background. Text over images requires a deliberate safe zone, scrim, plate, mask, crop, or separation outside the image.
- Interactive text contrast is stateful. Buttons, nav items, tabs, segmented controls, chips, cards, menus, and selectable objects must keep readable labels in default, hover, focus-visible, active, selected, disabled, pressed, selected+hover, and selected+focus states. If hover on a selected item makes text disappear, it is a hard failure before taste scoring.
- Interface feel matters: before final visual review, check active/focus states, loading/empty/error states, perceived performance, spacing rhythm, numeric alignment, and dead/stiff surfaces.
- Post-build review layers exist and should not run during Fast Direction Gate: Evidence-Backed Critique for finished UI states, Text Clarity Review for unclear/generic interface copy, Production Hardening Review for long text, empty/error/loading states, i18n, accessibility, slow networks, and responsive stress.
- If Migi says a reference is inspiration, extract principles instead of cloning it exactly.
- If Migi rejects a reference, treat it as an anti-pattern and do not preserve it with new paint.
- Do not build or improve a frontend Studio app unless Migi explicitly reactivates that direction.

## Skill Routing

Use the smallest relevant set.

- Multi-skill work, skill audits, dogfood feedback, or critique that must become fixes: `skills/creative-orchestration-director/SKILL.md`, then the smallest specialist chain. Use `templates/skill-verdict.template.json`, `templates/reports/creative-state-ledger.template.md`, and `templates/reports/repair-task-queue.template.md`.
- Visual-heavy new app, redesign, gallery, roster, character-select, product-discovery, or selection-first work: `skills/visual-concept-gate/SKILL.md`.
- New visual-heavy app, landing page, portfolio, creative/artistic page, mobile product flow, dashboard redesign, or major UI redesign with no approved direction: `skills/design-start-image-exploration/SKILL.md`.
- Screenshot, mockup, Lovable prototype, Pinterest image, or strong visual reference: `skills/visual-target-reconstruction/SKILL.md`.
- Selection-first, gallery, roster, marketplace, card deck, character selection, or object browsing: `skills/selection-first-products/SKILL.md`.
- Existing UI review: `skills/anti-ai-slop-review/SKILL.md`.
- Finished UI critique with screenshot/browser evidence, Nielsen scoring, cognitive load, persona red flags, and persisted snapshots: `skills/evidence-backed-critique/SKILL.md`.
- Unclear, vague, generic, inconsistent, or confusing interface copy after implementation: `skills/text-clarity-review/SKILL.md`.
- Product UI hardening against real-world data, long text, empty/error/loading states, i18n, accessibility, and responsive stress after implementation: `skills/production-hardening-review/SKILL.md`.
- Runnable UI or screenshots: `skills/screenshot-scorecard-review/SKILL.md`.
- Before final handoff for frontend/design work: `skills/final-ui-integrity-gate/SKILL.md`. This is mandatory after screenshots/layout review and blocks success when clipped text, overlaps, floating container drift, nav overflow, media/text collision, fixed overlay collision, accidental blank space, or the original user complaint remains visible at any sampled viewport, scroll position, or state.
- Elite redesign critique: `skills/frontend-art-director-review/SKILL.md`.
- Visual spec before coding for visual-heavy tasks: `skills/visual-spec-compiler/SKILL.md`.
- SVG, vector, abstract form, illustration, mask, clipping, shape-heavy, callout, or texture-heavy work: use global `vector-form-system-director` before implementation or review. Require shape inventory, layer model, bounds, anchors, responsive behavior, accessibility/decorative status, and text-safe zones. Reject ambient blobs, dotted background texture, amateur illustration, and paths crossing words.
- Color tokens, contrast repair, palette scales, dark mode, or color accessibility: `skills/oklch-contrast-palette/SKILL.md`.
- Broad UI/UX craft review, typography, pseudo-elements, audio feedback, predictive prefetching, UX laws, or visual design rules: `skills/userinterface-wiki/SKILL.md`.
- Functionally done UI that feels stiff, dead, generic, unresponsive, or under-polished after implementation and before screenshot review: `skills/make-interfaces-feel-better/SKILL.md`.
- Dashboard graph systems, BI charts, analytics, forecasts, maps, funnels, or monitoring: `skills/dashboard-graph-system/SKILL.md`.
- Data visualization, charts, graphs, analytics, BI, monitoring, forecasting, maps, funnels, or graph-rich dashboards: start with `skills/chart-system-director/SKILL.md`, then use `skills/data-visualization-selection/SKILL.md` when chart type selection needs data-shape guidance.
- Pattern canvases, floor maps, seating charts, node graphs, workflow builders, architecture diagrams, timelines, spatial maps, editors with selectable objects, or canvas-like product surfaces: `skills/diagram-canvas-system/SKILL.md`.
- Implemented charts, diagrams, maps, timelines, legends, axes, labels, tooltips, or canvases needing edge-case stress: `skills/data-viz-hardening-review/SKILL.md`.
- Visual style selection, token/effect direction, style-family fit, or taxonomy-driven art direction: `skills/visual-style-selection/SKILL.md`.
- Landing pages, hero pages, product marketing pages, and poster/image-led pages: `skills/landing-page-pattern-director/SKILL.md`.
- Landing, portfolio, marketing, and redesign craft direction: `skills/landing-page-craft-director/SKILL.md`.
- Final Taste-style preflight for landing/portfolio/marketing UI: `skills/anti-ai-tell-preflight/SKILL.md`.
- Image-first visual implementation from references/screenshots/generated sections: `skills/image-first-frontend/SKILL.md`.
- Unsplash or real photographic asset sourcing: `skills/unsplash-asset-sourcing/SKILL.md`.
- Generating or selecting landing-page visual references: use imagegen-frontend-web logic through `agent-workflows/image-first-frontend-workflow.md` and `skills/landing-page-craft-director/SKILL.md`.
- Motion planning for product/brand UI: `skills/motion-craft-director/SKILL.md`.
- Anime.js, JavaScript timeline choreography, staggered DOM/SVG/object motion, CSS variable animation, weather/terrarium particles, selected-state transitions, rail/detail continuity, or tactile JavaScript feedback: `skills/animejs-motion-director/SKILL.md`.
- Advanced/cinematic/artistic/award-winning/scroll/portfolio motion: `skills/animation-vocabulary/SKILL.md`, then `skills/advanced-motion-choreography/SKILL.md`, then `skills/motion-craft-director/SKILL.md`, then `tools/capture-motion-sequence.mjs` if possible, then `skills/review-animations/SKILL.md`, `skills/make-interfaces-feel-better/SKILL.md`, and `skills/screenshot-scorecard-review/SKILL.md`.
- WebGL, shader, ShaderGradient, React Three Fiber, Three.js, GLSL, animated premium gradient, liquid-metal logo, or shader-based visual identity: `skills/webgl-shader-primitives/SKILL.md`. Use only after the effect has a product reason, fallback plan, mobile/performance budget, and screenshot proof plan.
- Dark-canvas, huge-type, ghost-pill, category-color, organic foreground object, or animation-library style references: `skills/typographic-motion-art-director/SKILL.md`. Use only for motion/typography-led product pages and require token mapping, mobile proof, contrast review, and reduced-motion fallback.
- Motion code review: `skills/review-animations/SKILL.md`.
- Component polish and invisible UI craft: `skills/emil-design-engineering/SKILL.md`.
- Delight/personality pass for success, empty, loading, milestone, or error states: `skills/delight-opportunity-director/SKILL.md`.
- Naming or specifying motion effects: `skills/animation-vocabulary/SKILL.md`.
- Premium website, landing page, hero, marketing site, product page, editorial/portfolio site, or website image-to-code work: `skills/image-first-website-to-code/SKILL.md`.
- Mobile apps, mobile web flows, onboarding/profile/search/home screens, or mobile reference folders: `skills/mobile-product-flow/SKILL.md`.
- Tailwind/global CSS migration: `skills/tailwind-migration-zero-regression/SKILL.md`.
- Domain realism, realistic mock data, real business sections, route/page jobs, dashboards with meaningful entities, or complaints about random values / `mission control` / `topology` / `traces`: `skills/domain-realism-mock-data-director/SKILL.md` before visual spec and implementation.
- Auth, onboarding/login naming, mock data truth, production states, persistence, or truthful claims: `skills/truthful-state-product-naming/SKILL.md`.
- Figma design/file operations: read `design-dna/figma-cost-safety-rules.md` before using Figma tools. Normal Plugin API operations are allowed; paid/plan-gated Figma features must block with the required message.

## Tool Discipline

- Read useful context first, not the whole repo.
- Do not reread files already available in the current context.
- Batch file reads and searches when possible.
- Inspect before editing.
- Prefer focused search/replace for small changes.
- Use bulk scaffolding only when creating coherent multi-file systems.
- Debug with logs, screenshots, and exact command output before guessing.
- Do not broaden scope mid-task.
- Avoid monolithic files and keep components focused.
- Report concise proof: files changed, commands run, evidence, remaining weaknesses.

## Reference Folder Modes

When Migi points to a visual-library folder, activate the matching mode:

- `01-command-centers-dashboards`: Command Center / Dashboard Mode.
  - Must mean image-aware command surface, not generic admin panel.
  - Define dashboard attraction zone, panel mix, chart forms, palette strategy, graph system, image/object/media strategy, material range, live/motion strategy, and calm/busy rhythm before coding.
- `02-creative-experimental-ui`: Artistic / Creative Mode.
- `03-mobile-consumer-apps` or `mobile-apps`: Mobile Product Flow Mode.
  - For 3+ primary destinations, mobile defaults to bottom navigation with premium spacing, safe-area support, generous touch targets, readable labels, and intentional active state.
- `04-selection-gallery-browse`: Selection / Gallery / Browse Mode.
- `05-landing-hero-pages`: Landing Page / Poster Mode.

For visual-heavy work using these references, create `docs/design/reference-usage-report.md` before coding and declare the role of every major image.

## Reference-Locked Build Mode

When Migi says to use a folder or specific screenshots as the basis for a design, do not proceed from folder vibe. Select 3-5 exact reference anchors and assign each one a role: composition, palette/material, graph/component, image/object/media, or responsive/layout.

Required before coding:

- `docs/design/reference-decomposition.md`
- `docs/design/design-transfer-spec.md`

Required after implementation:

- `docs/qa/reference-match-report.md`

## Protected Folders

- Do not modify `source-projects/` unless explicitly asked.
- Do not delete or modify `captures/` unless explicitly asked.
- Do not modify `raw-chat-input/` unless explicitly asked.

## Required Handoff

```md
Skills used:
Visual references checked:
Reference folder mode:
Reference usage report:
Active dials:
Visual spec:
Design-system direction:
OKLCH / APCA palette pass:
Interface feel pass:
Evidence-backed critique:
Text clarity review:
Production hardening review:
Reference-Locked Build Mode:
Reference anchors:
Reference decomposition:
Design transfer spec:
Image roles:
Texture / illustration role inventory:
Text-safe zones for illustration:
Unsplash search plan:
Unsplash asset manifest:
Image environment strategy:
Scale calibration:
Contrast / legibility strategy:
Navigation strategy:
Navigation strategy path:
Navigation concepts:
Selected navigation pattern:
Navigation readability:
Identity / brand chrome:
Decorative geometry:
Line / divider strategy:
Toolbar alignment:
Text density:
Button proportions:
Responsive collision checks:
Layout integrity contract:
Responsive breakpoint proof:
State contrast matrix:
Selected-hover contrast proof:
Design read:
Anti-AI-tell preflight:
Motion strategy:
Motion choreography plan:
Motion sequence evidence:
Motion benchmark:
Delight strategy:
Palette direction:
Palette exploration:
Domain palette fit:
Placebo navigation avoided:
Spatial label safe zones:
Desktop command-surface primary object:
Visual style selection report:
Chart selection report:
Image-first website analysis:
Direction options:
Direction layout maps:
Direction risk check:
Paid image generation:
Selected direction:
Implemented selected direction:
Frontend aha moment:
Interactions verified:
Reference match report:
Benchmark used:
Benchmark score:
Dogfood postmortem:
Approved/rejected principles used:
Files changed:
Build/lint result:
Local dev server URL:
Screenshots:
Scorecard result:
Done report:
Remaining weaknesses:
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

For illustration-heavy work, route in this order:
1. Illustration-First Gate.
2. Isolated asset review.
3. Migi approval or explicit pass when required.
4. Full page build.

Do not route directly from brief to full page if custom illustration is the visual hero.

Applies especially to botanical illustration, character illustration, mascot illustration, product object illustration, editorial SVG illustration, hero illustration, and custom SVG scenes.

Required gate outputs:
- `docs/design/illustration-art-direction.md`
- `docs/design/illustration-style-guide.md`
- `docs/design/illustration-asset-options.md`
- at least 1 isolated hero illustration component or SVG
- `docs/qa/illustration-gate-review.md`

Stop after the illustration gate unless Migi explicitly instructs the agent to continue.

No full page implementation may begin if the illustration looks amateur, is made from primitive shapes with no detail system, has weak silhouette, poor linework, generic texture/material, missing reference grammar, or lacks Migi approval when approval is required.

## No Ambient Background Blobs

Do not use large vague background blobs, ghost ellipses, generic radial glows, random translucent ovals, fake lens shapes, or abstract atmosphere shapes unless they are the primary product object, part of the selected signature interaction, directly derived from an approved reference mechanic, or explicitly named in the shape inventory with role, layer, and purpose.

Rejected: vague light blob in the corner, random huge transparent ellipse, generic star/dot field, abstract glow that exists only to make the page feel "premium", background shapes that compete with content, background shapes that do not interact with anything, and decorative orbits/HUD lines.

Allowed: subtle material-specific paper grain, real photographic grain, low-opacity scan texture, ink speckle, surface wear, texture tied to domain material, or a purposeful mask/object used by the signature interaction.

## Botanical / Organic Illustration Minimum Bar

Botanical, animal, human, and organic illustrations require reference grammar, silhouette study, linework strategy, detail budget, material/texture strategy, simplification strategy, and a clear explanation of what makes the subject believable before coding.

Botanical plates specifically require stem structure, leaf/petal hierarchy, asymmetry, vein or line detail where appropriate, root/stem/petal relationship, botanical label/callout safe zones, and distinct species silhouettes. Reject repeated ellipse leaves, generic petal flowers, flat doodle stems, childlike plant silhouettes, repeated copy-paste leaves, and generic botanical icons scaled up as hero art.

## Layout Integrity Gate

Text/container integrity is mandatory. Any clipped text is a hard blocker. Any nav overflow is a hard blocker. Stickers, cards, badges, images, decorative shapes, and overlays require protected text zones before implementation.

Run `skills/layout-integrity-review/SKILL.md` before final handoff for all visual-heavy pages, landing pages, product UIs, mobile flows, custom nav, sticker/card/badge systems, large display type, and scroll/sticky/pinned experiences.

Screenshot contradiction beats agent self-report. If screenshots show clipped words, text escaping containers, nav labels outside items, cryptic small-screen nav abbreviations, card/sticker/headline collision, CTA clipping, or accidental blank space, the UI is blocked until fixed.

Post-build review order:
1. `skills/screenshot-scorecard-review/SKILL.md`
2. `skills/layout-integrity-review/SKILL.md`
3. interaction verification
4. `skills/text-clarity-review/SKILL.md`
5. `skills/production-hardening-review/SKILL.md`
6. `skills/anti-ai-slop-review/SKILL.md`
7. `skills/final-ui-integrity-gate/SKILL.md`

## Final UI Integrity Gate

No frontend/design task may be handed off until Final UI Integrity Gate v3 passes. Build/lint is not visual proof. Run `tools/final-ui-integrity-check.mjs` when a local URL exists, or document a blocked gate. A blocked or failed gate cannot be reported as passed.

Final UI Integrity Gate v3 requires:
- width sweep: `360:1920:40` or smaller step when practical
- height samples: `720, 844, 900, 1080`
- scroll samples: `0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, 1.00`
- applicable states: default, nav active states, selected/open detail panel, sticky/pinned active section, compact nav, reduced motion when practical
- passed and failed sampled viewport states in the final report
- blocker detection for viewport-edge clipping, horizontal scroll partial content, floating-object resize drift, blank scroll states, clipped text, overlap, nav overflow, and media/text collision

Follow `agent-workflows/fail-closed-final-handoff-contract.md`: final responses must report the v3 verdict, width sweep tested, height matrix tested, scroll samples tested, blocker count, screenshot evidence directory, and whether the user complaint remains visible.

7. final scorecard

## Agent Skill Layer V2

For nontrivial design/frontend work, Design OS must behave like a stateful creative partner, not a collection of isolated checklists.

Default orchestration:
1. `skills/creative-session-state-manager/SKILL.md` records the live brief, Migi feedback, approvals, rejected patterns, artifact graph, risks, and next action.
2. `skills/failure-memory-retrieval-router/SKILL.md` retrieves relevant rejected case studies and bad-practice evidence before planning.
3. `skills/skill-orchestration-planner/SKILL.md` chooses the smallest sufficient skill DAG with gates, stop conditions, and evidence requirements.
4. Foundation/spec skills run before implementation.
5. `skills/creative-prototype-spike-director/SKILL.md` proves risky visual mechanics before full-page build.
6. Post-build reviews run with screenshot evidence.
7. `skills/evidence-to-repair-planner/SKILL.md` converts findings into ordered repair tasks.
8. `skills/artifact-contract-validator/SKILL.md` blocks false completion before final handoff.

Use `skills/responsive-constraint-solver/SKILL.md` before implementation when layouts, nav, cards, stickers, overlays, large type, charts, canvases, or media-heavy compositions must survive multiple widths.

Use `skills/reference-grammar-compiler/SKILL.md` when references guide the work. Extract transferable grammar, not brand skin.

Use `skills/preference-model-migi-taste-learner/SKILL.md` after explicit Migi feedback, approvals, rejections, or postmortems.

Use `skills/interaction-state-matrix-director/SKILL.md` when nav, buttons, chips, cards, tabs, modals, or selectable objects have state.

## Elite Scroll Choreography

For elite/Awwwards/million-dollar/original landing, portfolio, editorial, brand, playful product, or video-first sites where scroll matters, route skills/elite-scroll-choreography-director/SKILL.md before implementation. Required artifacts: selected scroll pattern, route map, scroll chapter map, pinned/sticky stage plan, moving object inventory, information reveal plan, nav sync plan, motion timeline, responsive fallback, reduced-motion fallback, layout-integrity risks, implementation target, and QA checklist.

After implementation, run skills/scroll-choreography-review/SKILL.md and then skills/layout-integrity-review/SKILL.md. Do not accept fade-only scroll, blank pinned frames, moving objects covering critical text, media/video objects covering protected text, horizontal routes without mobile fallback, fake card assembly, unsynced chapter nav, or missing reduced-motion fallback.

## Elite Experience Specialist Layer

For elite brand, portfolio, editorial, playful product, media-led, and scroll-heavy work, route these only when the selected mechanic needs them:

- scroll-physics-smoothing-director: smoothing, scrub, lerp, snap, settle, velocity, touch, mobile fallback, reduced motion, performance budget.
- media-object-stage-director: video/image/media as hero, mask, sticky object, poster, portal, card, broadcast tile, or detail view with protected text zones, reserved media lanes, and forbidden overlap zones.
- physical-interface-props-director: stickers, labels, tickets, stamps, keycards, rails, tabs, pins, and tactile cards with role and text-safe zones.
- designed-detail-reveal-director: drawers, panels, sleeves, split views, object pull-outs, station boards, and ritual selectors with state/focus/close/keyboard behavior.
- brand-voice-as-interface-director: CTAs, nav labels, cards, reviews, empty/loading/error states, and microcopy as product-specific interface voice.

Hard failures: jittery/raw scroll, media as vague background when object staging is required, prop text clipping, default modal where designed reveal is required, and generic SaaS/hotel/template copy on a playful or brand-led site.
