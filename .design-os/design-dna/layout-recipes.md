# Layout Recipes

Choose one recipe before arranging components. Do not mix recipes because a source screenshot looked good.

## Art-Directed Visual Shell

Use when: the task is a new app, major screen, redesign, gallery, roster, selection-first flow, visual-heavy interface, or uses inspiration images.

Before building:

- create `docs/design/direction-options.md` with Direction A Safe Refined, Direction B Artistic Expressive, and Direction C Unexpected High-Character when no visual direction is already approved
- stop for Migi to choose A, B, C, or a hybrid
- create `docs/design/selected-direction.md` after Migi chooses
- run Visual Concept Gate v2
- produce 3 radically different rendered concept prototypes when visual tooling exists, or concrete direction cards when it does not
- screenshot each rendered concept at 1440 / 768 / 390 when capture is available
- wait for Migi to approve one visual direction
- analyze references by composition, focal object, hidden information, emotional hook, material, texture, interaction model, and what is absent

Build:

- visual shell/poster first
- one focal object or focal composition before component depth
- enough interaction to prove hover/selection/state behavior
- only the minimum product logic needed to test the visual direction

Do not:

- start with reusable app components
- code before Migi selects a direction unless the direction is already approved
- ask Migi to approve a text-only art direction
- make the three directions small variations of the same layout or palette
- turn cinematic references into dashboards
- replace one dominant reference object with a grid
- expose stats when the reference hides information
- add feature depth before the visual shell works

## Image-First Website Translation

Use when: the task is a premium website, landing page, hero section, marketing site, product page, editorial brand page, portfolio site, or visually important website redesign.

Before building:

- route `skills/image-first-website-to-code/SKILL.md`
- create `docs/design/image-first-website-analysis.md`
- generate or select large section-specific references when available
- use one reference per section when multiple sections are requested
- create fresh detail/extraction references when text, buttons, spacing, or cards are unclear
- analyze typography, spacing, buttons, colors, image treatment, component logic, and section rhythm before code

Build:

- implement the visual references as the design source of truth
- preserve section-specific composition and rhythm
- keep the hero clean, short, readable, and visible on a small laptop
- use image roles intentionally
- remove fake pills, micro-label clutter, and nested-card container prisons
- screenshot compare the coded result to the reference/analysis

Do not:

- compress the entire website into one tiny unreadable board
- crop old images for section extraction when a fresh section reference is needed
- start from generic landing-page components when visual quality is the task
- replace distinctive sections with repeated left/right blocks or card grids
- let the coded site drift away from the generated/selected references

## Reference Folder Mode Selector

Use this selector before choosing a recipe when Migi points to a visual-library folder.

If Migi asks to use the folder as the basis for a design, activate Reference-Locked Build Mode before choosing a recipe:

- select 3-5 exact reference anchors
- assign each anchor a role: composition, palette/material, graph/component, image/object/media, or responsive/layout
- create `docs/design/reference-decomposition.md`
- create `docs/design/design-transfer-spec.md`
- use the transfer spec to choose and adapt the recipe
- build by segments: shell/nav, attraction zone, chart/data system, queue/list system, action/output system, responsive adaptation
- finish with `docs/qa/reference-match-report.md`

Do not choose a recipe from a folder vibe alone.

| Folder signal | Mode | Recipe bias |
| --- | --- | --- |
| `01-command-centers-dashboards`, dashboard folder, command center references | Command Center / Dashboard Mode | Image-Aware Command Dashboard, Dense Control Workspace, or Research Terminal |
| `02-creative-experimental-ui`, creative folder, experimental/editorial references | Artistic / Creative Mode | Art-Directed Visual Shell or Editorial Presence |
| `05-landing-hero-pages`, landing page folder, hero page references | Landing Page / Poster Mode | Image-Led Artistic Landing Page |
| `03-mobile-consumer-apps`, `mobile-apps`, mobile app references | Mobile Product Flow Mode | Consumer Coordination, Focused Creation, or a mobile-first adaptation of the product archetype |
| `04-selection-gallery-browse`, selection/gallery folder, roster/browse references | Selection / Gallery / Browse Mode | Selection Roster or Detail With Inspector |

The selected mode must be recorded in `docs/design/reference-usage-report.md` before visual-heavy implementation.

Every mode requires Scale Calibration before coding: compare headline size, body text, container/card density, image roles, spacing, visible content objects, and meaningful information above the fold against the selected reference screenshots. Match scale relationships, not just mood.

Every mode requires Award-Level Contrast Discipline before coding: identify text backgrounds, classify image/gradient/texture risk, choose protection for text over imagery, protect focal objects, and verify legibility at 1440 / 768 / 390.

Every artistic, cinematic, landing, portfolio, creative, editorial, or experimental mode requires Art-Directed Palette Exploration before locking tokens: propose Safe Refined, Artistic Expressive, and Unexpected High-Character palettes; document base colors, accent logic, image compatibility, contrast risks, concept fit, and AI-default palette avoided; then select one with OKLCH/APCA or equivalent contrast reasoning. Do not default to muddy brown, sepia/espresso/umber archive wash, generic charcoal/orange, AI purple glow, beige premium, terminal green, neon lime, or dull blue-grey SaaS color.

Every visual-heavy or dashboard mode requires a craft pass before coding: navigation labels are understandable, responsive nav behavior is designed, mobile apps with 3+ primary destinations default to bottom navigation, toolbars align inputs/buttons, panels stay scan-first, buttons are proportionate, 1440 / 1280 / 1024 / 768 / 390 collision risks are named, palette direction feels human/reference-driven, and fake live/session/status theater is removed unless it has real product meaning.

Every mode requires P0 Layout Integrity before taste scoring: text stays inside containers, charts stay inside plot/card bounds, card titles are not clipped, cards do not collapse below readable width, labels remain semantic, chips/badges do not collide, forms/buttons stay readable, and the layout is proven at 1440 / 1280 / 1024 / 768 / 390.

Mode-specific scale rules:

- Command Center / Dashboard Mode: dense but readable, graph-rich, image-aware when references support it; avoid giant widgets, same-weight cards, and text-and-metrics-only admin layouts; desktop should show multiple useful panels plus one memorable attraction zone.
- Artistic / Creative Mode: dramatic scale is allowed only with intent; balance large type/images with smaller details, visual tension, or layered composition; no giant empty slabs.
- Landing Page / Poster Mode: large hero type is allowed only when image scene and composition justify it; never reduce the page to one huge headline plus one huge image.
- Mobile Product Flow Mode: do not blow mobile screenshot proportions up on desktop; use richer desktop composition or multiple visible frames.
- Selection / Gallery / Browse Mode: do not make one selected object so huge that browsing disappears; keep preview, options, comparison, and selected state visible together.

Mode-specific contrast rules:

- Command Center / Dashboard Mode: dense UI requires strong text/background separation; do not use weak grey labels everywhere.
- Artistic / Creative Mode: unusual composition is allowed, but readability cannot be accidental.
- Landing Page / Poster Mode: image-led pages must protect sparse copy; CTAs and small labels need stable contrast zones.
- Mobile Product Flow Mode: mobile crops make text-on-image riskier; avoid important text over uncontrolled image areas.
- Selection / Gallery / Browse Mode: image cards must keep title, selected state, and key metadata readable.

## Image-Aware Command Dashboard

Use when: Migi points to `01-command-centers-dashboards`, asks for a dashboard/command center, or the product needs a dense tool that should feel premium, memorable, and designed rather than like an admin template.

Before building:

- inspect the dashboard references and identify the strongest 3 to 5 patterns
- define the attraction zone: dominant chart, 3D/isometric scene, product object, media block, card stack, avatar/content cluster, map, selected object, or equivalent
- define the panel taxonomy: metrics, charts, queues/lists, activity, media/object content, actions, controls
- define chart forms and what each chart helps decide
- define image/object roles when imagery appears
- define palette strategy: neutral base, controlled accent, state colors, material range, and image/object color influence
- define graph system: one major chart or map plus supporting microcharts/scores when data supports it
- define live/motion strategy when the product represents monitoring, freshness, activity, or queue movement
- define navigation strategy with understandable labels and crafted responsive behavior
- define toolbar alignment strategy for search, filters, and actions
- define text density strategy so panels are scan-first instead of prose-heavy
- define button proportion strategy so actions do not become clumsy full-width bars
- define responsive collision risks and how 1440, 1280, 1024, 768, and 390 prevent them
- define minimum card/panel widths and what happens below those widths
- define chart bounds strategy: plot clipping, label margins, SVG/viewBox discipline, and fallback chart forms
- define semantic label strategy so compact labels never collapse into meaningless fragments
- calibrate scale so desktop shows useful volume quickly without tiny unreadable UI

Build:

1. Start with one major focal zone. It can be visual, data-driven, or object-led, but it must give the screen gravity.
2. Build a graph system with at least two visualization types when the data supports it: one major chart/map/matrix/timeline plus supporting bars, rings, progress tracks, sparklines, ranked scores, heat maps, or score meters.
3. Add information zones for current state, queue/list, comparison, activity/timeline, and output/action area.
4. Add one imagery/content zone when references or product context support it: product object, media cover, avatar cluster, scene block, map, document preview, card stack, live tile, or selected item.
5. Add one control/action zone close to the object or decision it affects.
6. Use material range: base surface, raised panels, active panels, image/media panels, quiet utility panels, primary action surface, and data panels.
7. Use palette strategy: neutral base, controlled accent, state colors, image/object color influence, and no monochrome mud.
8. Add live/state energy when relevant: live indicators, chart transitions, progress movement, timeline strips, hover/selection transitions, or optional live/animated tiles with a product role.
9. Vary panel size, density, color, and visual weight. Some panels should be dense, some calm, some visual, some operational.
10. Integrate charts as composition: annotated line/area charts, bars, rings, progress tracks, heatmaps, maps, funnels, timelines, sparklines, or score indicators.
11. Keep typography compact and controlled. Use large type only for primary numbers, selected objects, or critical labels.
12. Use soft premium surfaces where the references support them: refined radii, subtle shadows, translucent panels, quiet borders, polished chips, and segmented controls.
13. Keep navigation restrained and readable. The content surface, not the sidebar, should carry the dashboard identity, but labels must still be understandable.
14. Align top toolbars so search, filters, and actions share a clean height/baseline system.
15. Keep panels scan-first: structured labels, values, chips, short summaries, and progressive disclosure instead of prose boxes.
16. Keep buttons proportionate to their role; use full-width desktop actions only with clear layout justification.
17. Preserve chart bounds inside cards; bars, lines, points, axes, and labels must not leave the plotting area.
18. Adapt the dashboard structure at breakpoints instead of squeezing columns until cards become unreadable.
19. Balance calm and busy zones so the screen feels rich, not noisy.

Responsive map:

- 390 px: become prioritized command sections; preserve the focal object and primary action first; use polished bottom navigation by default for 3+ primary destinations unless a named exception applies; simplify charts or move details into accordions/lists without losing state or creating collisions.
- 768 px: reduce columns; show focal zone plus one supporting operational zone; avoid cramped desktop grids and nav/toolbars that wrap badly.
- 1024 px: reorganize multi-column cockpit layouts before panels become too thin.
- 1280 px: keep dense dashboard structure only if chart labels, cards, queues, and actions remain readable.
- 1440 px: show focal zone, utility zone, chart/stats zone, and at least one queue/list/content rail together with aligned toolbar controls.

Do not:

- build same-weight card soup
- use a generic SaaS/admin dashboard skeleton
- use murky monochrome or terminal-green palette by default
- overuse one accent color across every label, chart, border, and button
- make every panel a rectangle of the same importance
- use charts as decoration
- ship chart-lite dashboards when references are graph-rich
- make the major chart decorative or unclear
- ship text-and-metrics-only panels when references show visual anchors
- reduce image/object/media usage to tiny avatars when references show stronger anchors
- inflate cards, headings, charts, and padding
- use cryptic nav labels such as `CMD`, `SIG`, `CMP`, `BRF`, or vague labels such as `SD LOCAL`
- let desktop nav become giant cramped mobile pills
- misalign search inputs, filters, and action buttons
- stuff containers with long prose when scan-first state would work
- use oversized full-width buttons without layout justification
- allow pills, badges, panels, nav, or forms to collide on resize
- let text escape card boundaries or titles clip
- let chart bars/lines/points escape plot or card bounds
- squeeze dashboard cards until labels collapse into `C`, `U`, `?`, or other meaningless fragments
- keep a 3-column dashboard when tablet width makes columns unreadable
- use the same desktop composition at every viewport
- add fake `live`, `session-only`, or monitoring chips as decorative theater
- use a machine-generated palette instead of a reference-driven color system
- paste random imagery that does not create hierarchy, product clarity, or memorability
- leave live/monitoring products feeling static and dead
- rely on terminal-ish dark panel spam as the visual concept

## Focused Creation

Use when: the user creates one thing from a prompt, selection, upload, or short form.

Build:

- first viewport: primary input/object plus one create/generate action
- secondary controls: inline or adjacent, not a separate settings maze
- result/preview: visible immediately after action
- history/recent items: below mobile, side rail desktop

Responsive map:

- 390 px: input, controls, primary action, result stacked in that order
- 768 px: input and result can sit in two columns if each gets enough width
- 1440 px: add history, examples, or inspector instead of stretching the input

Do not: make a marketing hero or long wizard before the first result.

## Dense Control Workspace

Use when: users supervise operations, approvals, agents, incidents, or governance.

For Migi's dashboard references, prefer `Image-Aware Command Dashboard` when the surface should be visually memorable. Use this recipe only when the product is primarily operational and still preserve focal hierarchy, chart richness, and compact scale.

Build:

- persistent nav or command rail
- top context/status bar
- central queue, table, or work surface
- inspector/evidence rail for selected object
- action cluster near selected object

Responsive map:

- 390 px: nav collapses; selected object and action come before secondary metrics
- 768 px: list plus detail or collapsible inspector
- 1440 px: nav, work surface, and inspector can be visible together

Do not: replace operational state with generic KPI cards, same-weight widget fields, or text-and-metrics-only admin panels.

## Research Terminal

Use when: comparison, recency, and numeric scanning matter.

Build:

- search/entity selector
- primary entity header
- metric strip with recency/source
- table/feed/chart area
- watchlist/timeline/context rail when width allows

Responsive map:

- 390 px: preserve key metric and recency; allow documented horizontal scroll only for comparison tables
- 768 px: split entity summary and feed
- 1440 px: table/feed plus side context

Do not: show charts or "live" badges without source and timestamp.

## Composer Studio

Use when: users transform language, media, or structured output.

Build:

- input surface
- mode/tone controls
- primary generation/transformation action
- output preview
- copy/export/save actions
- variants/history as secondary

Responsive map:

- 390 px: input, controls, action, output stack; keep output close to action
- 768 px: input/output split if readable
- 1440 px: add playback/history rail, not extra decoration

Do not: hide the generated result in a toast or modal.

## Editorial Presence

Use when: presenting a person, practice, story, brand, or authored body of work.

Build:

- first viewport has the subject as the obvious signal
- subject-identifying media or typographic identity
- next section is hinted in the first viewport
- proof appears as selected narrative, not exhaustive grid

Responsive map:

- 390 px: subject, core claim, and primary path visible without awkward crop
- 768 px: preserve reading rhythm
- 1440 px: use width for media, margin notes, or editorial pacing

Do not: use a generic split card hero.

## Consumer Coordination

Use when: users coordinate people, time, places, invitations, or shared plans.

Build:

- current plan/intent as primary object
- participant/time/place state
- lightweight choices
- clear confirm/share/invite action
- privacy/safety language only where it affects trust

Responsive map:

- 390 px: thumb-safe action and no bottom-nav collision
- 768 px: plan plus participant/context panel
- 1440 px: schedule, map, or participant context can sit beside plan

Do not: apply this recipe to non-social products just because the case study liked warmth.

## Selection Roster

Use when: the core experience is choosing, browsing, collecting, comparing, or discovering objects.

Gate: this is visual-heavy by default. Run Visual Concept Gate v2 before implementation. The first screen needs 3 rendered roster/gallery concepts with screenshots so Migi can choose by seeing desire, scale, rhythm, and selection reward.

Build:

- first viewport: image-led roster or gallery with a strong "which one do I pick?" moment
- visual thesis: define a non-obvious metaphor before using the expected genre style
- cards: large enough to show object identity, silhouette, class, rarity, power, vibe, or personality without clutter
- card zones: visual, identity, metadata, and action stay readable and collision-free
- interaction: hover and selected states feel rewarding and visually different from passive cards
- selected object: committed preview, comparison tray, loadout panel, or "picked" state
- details: dense specs, technical analysis, and long descriptions hidden until after selection

Responsive map:

- 390 px: one dominant card or tight swipe/scroll roster plus clear selected state
- 768 px: gallery plus selected preview or comparison tray
- 1440 px: roster, selected preview/loadout, and optional inspector can coexist

Do not:

- open with explanation, brochure copy, or dense stat panels
- use beige catalog grids when the product needs energy
- default to the obvious genre aesthetic, such as dark cyber robots with neon/glow/badge soup
- create excitement mainly through badges, stats, glows, and overlays
- allow text, badges, stats, or controls to overlap accidentally
- make cards feel like product listings
- treat selection like SaaS settings

Robot Skill Forge evidence: the first screen should be a character-select moment, not an information page. It also must not become the obvious AI robot-app cliche.

Layout hard rule:

- Overlapping UI is a hard fail unless deliberately designed, readable, responsive-tested, and necessary. Test cards at 390 / 768 / 1440 before accepting them.

## Recipe: Image-Led Artistic Landing Page

Use when:

- user asks for landing page, creative, artistic, cinematic, editorial, visual-heavy, or image-led work
- references are landing pages, editorial, creative, atmospheric, cinematic, or image-led
- visual impression matters more than feature density

Recipe:

1. Start with one dominant image or scene.
2. Keep the first screen poster-like.
3. Use short copy blocks only.
4. Use 1-2 CTAs max.
5. Avoid repeated feature grids.
6. Avoid equal-width cards unless the reference clearly uses them.
7. Use floating or lightly anchored text where appropriate.
8. Let image composition drive layout.
9. Keep navigation minimal.
10. Preserve the artistic rhythm beyond the hero.
11. On mobile, preserve the emotional image-first experience, not just the text order.

Do not:

- turn landing-page inspiration into a Blogspot/content-template structure
- use dashboard furniture, stats blocks, boxed proof rows, or generic SaaS homepage rhythm
- make only the hero artistic and then fall back to normal cards and sections

## Recipe: Immersive Image-Led Landing Page

Use when:

- landing-page references are image-led
- creative folder uses full-scene imagery
- user asks for artistic, cinematic, or poster-like
- the image is the emotional hook

Recipe:

1. Pick one dominant image/scene.
2. Compose the page around that image first.
3. Decide the image role: environment, focal object, proof object, editorial fragment, or background atmosphere.
4. If the image is the environment, do not trap it in a card.
5. Use sparse text and place it in safe image zones.
6. Protect text with scrims, vignettes, masks, plates, or deliberate crops.
7. Let the image bleed, crop, or dominate where useful.
8. Keep UI chrome minimal.
9. Avoid repeating rectangular image cards unless the reference explicitly uses them.
10. Continue image-led rhythm beyond the hero.

## Recipe: Composed Navigation System

Use when:

- visual-heavy work includes primary navigation
- landing, portfolio, creative, editorial, cinematic, dashboard, or mobile work needs a non-generic shell
- references show nav as part of the composition
- the default navbar would weaken the visual thesis

Recipe:

1. Define how much navigation the page actually needs.
2. Inspect reference navigation separately from hero imagery and palette.
3. Choose 3 possible navigation concepts: Functional Refined, Art-Directed, and Unexpected High-Character.
4. Select a pattern from `design-intelligence/navigation-patterns.json`.
5. Decide wordmark behavior: quiet, centered, oversized, cornered, spatial, or contextual.
6. Decide CTA behavior: inline, floating anchor, bottom action, menu item, or contextual.
7. Plan desktop, tablet, and mobile behavior before coding.
8. Define active/focus states and keyboard order.
9. Make mobile app navigation bottom-first when there are 3+ primary destinations.
10. Verify nav supports the hero instead of competing with it.

Avoid:

- logo-left links-center CTA-right as an unexamined default
- sticky pill nav as a fake premium move
- overpopulated menus on visual landing pages
- nav labels that are cryptic or too clever to understand
- mobile top link dumps
- three direction options with identical nav

Do not:

- start with a rigid grid and paste the image into it later
- turn a full-scene reference into a square image asset
- add visible borders around the main image unless the reference clearly uses that treatment

## Detail With Inspector

Use when: selecting one object from a list and reviewing evidence, settings, or detail.

Build:

- source list with visible selection
- detail region named after selected object
- inspector/actions grouped by decision
- close/back path on mobile

Responsive map:

- 390 px: list routes to detail or opens full-screen drawer
- 768 px: list plus detail, inspector collapsed
- 1440 px: list, detail, and inspector can coexist

Do not: make row hover imply selection unless selection exists.
## Recipe: Tasteful Image-First Landing Page

Use when:

- landing, marketing, portfolio, or redesign page
- visual references or generated section references drive the work
- Migi wants a premium page that does not feel templated

Recipe:

1. Declare the design read.
2. Set active dials.
3. Choose one concept spine.
4. Define section jobs.
5. Generate or select one horizontal image/reference per section.
6. For each section, choose composition anchor, background mode, image role, CTA variation, and second-read moment.
7. Lock palette and typography across the page.
8. Vary section rhythm.
9. Keep hero stack disciplined.
10. Put trust/logo proof below hero, not inside it.
11. Avoid repeated layout families.
12. Run anti-AI-tell preflight.

Avoid:

- one unreadable full-page design board
- Blogspot structure
- repeated zigzag sections
- fake div screenshots
- plain text logo walls
- decorative scroll cues
- motion without purpose
