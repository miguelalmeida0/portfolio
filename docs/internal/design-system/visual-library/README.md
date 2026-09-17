# Visual Library

This folder is Migi's lightweight visual memory.

It exists so future frontend agents can quickly inspect what Migi likes, what Migi rejects, and what principles should guide a new interface.

## Folders

- `approved/`: UI references Migi likes. These teach composition, taste, interaction feel, hierarchy, and restraint.
- `rejected/`: UI references Migi dislikes. These teach anti-patterns and failure modes.
- `inspiration/`: useful references that are not yet approved as global taste.
- `case-studies/`: short writeups about specific wins, failures, and dogfood lessons.
- `templates/`: note templates for documenting screenshots.

## Rules

- Screenshots are design evidence, not production assets.
- Approved references teach composition and taste; they are not palettes or brands to clone blindly.
- `approved/case-studies/tempo-loom-mobile-product-success/` is the approved mobile product case study for functional control UI, icon+label bottom nav, persistent selected states, compact density, product-specific copy, and useful dark mobile craft.
- `approved/case-studies/hostel-radio-first-passed-project/` is the current canonical alias for the first passed Design OS random project. It preserves the supplied recovery context that Hostel Radio was originally called Late Check FM.
- `approved/case-studies/late-check-fm-first-passed-project/` is the repo-verified first passed Design OS random project case study. It validates the Gen-Z hostel concept, video-first hero, bold broadcast typography, physical room/event cards, fun brand voice, hero-only video rule, readable cards, mobile layout quality, and Final UI Integrity Gate v3 after unsafe scroll was removed or simplified.
- Rejected references are valuable because they name what future agents must avoid.
- `rejected/case-studies/shelf-circle-mobile-product-failures/` is the rejected mobile product UI case study for cut-off sheets, overlapping control indicators, nonpersistent selection, text-only bottom nav, and add cards that masquerade as content.
- `rejected/case-studies/service-floor-desktop-product-failure/` is the rejected desktop product case study for random domain palettes, placebo navigation, floor-map label collisions, and command surfaces that collapse into generic dashboard/card soup.
- `rejected/case-studies/cutline-studio-pattern-canvas-failures/` is the rejected diagram/canvas case study for clipped primary text, catastrophic pattern-canvas overlap, weak construction-line semantics, unreadable labels, and performance-hostile canvas layering.
- `rejected/case-studies/ai-texture-illustration-failures/` is the rejected visual-heavy/UI atmosphere case study for AI ambient light blobs, weird dotted background textures, amateur vector illustration, clipped words, and illustration lines crossing text.
- `rejected/case-studies/nocturne-field-guide-amateur-svg-failure/` is the rejected artistic landing case study for amateur SVG illustration, native SVG tooltip leakage, annotation collisions, generic dot/light texture, and missing signature interaction.
- `rejected/case-studies/nocturne-field-guide-plate-drawer-failure/` is the rejected Plate Drawer rebuild case study for visible mechanics with amateur illustration, weak field-guide plates, ambient background blobs, and full-page implementation before illustration proof.
- `rejected/case-studies/sepia-espresso-surface-wash-regression/` is the canonical rejected evidence for the muddy sepia/espresso/umber brown-black archive wash. It now includes the Cascade Lab commander-note container regression and caps visible sepia containers at 2/10.
- `rejected/case-studies/bunk-radio-text-container-nav-failures/` is the rejected execution case study for a promising Bunk Radio concept that failed due to clipped text, card/sticker/headline collisions, nav label overflow, responsive nav dead space, and huge accidental whitespace.
- `rejected/case-studies/cascade-lab-robotic-dashboard-information-architecture-failure/` is the rejected dashboard case study for UI that has no obvious layout bug but still reads as AI-created because of a dull robotic palette, one-note technical dark surfaces, too much information on one page, underused routes, and failure to absorb approved elite dashboard inspiration.
- `rejected/case-studies/cascade-lab-ai-theater-labels-replay-case-file-failure/` is the rejected Cascade Lab case study for decorative narrative/status chips, replay/mission chrome, oversized metadata strips, fake `Case File CL-####` identifiers, and bottom viewport cutoff.
- `rejected/bad-practices/text-overflow-and-clipping/` and `rejected/bad-practices/navigation-responsiveness-failures/` are canonical bad-practice folders for text/container integrity and nav responsiveness failures.
- Each reference folder activates a design mode. Select the folder mode before choosing layout.
- If Migi asks to use a folder or screenshot set as the basis for a design, activate Reference-Locked Build Mode. Select 3-5 exact reference anchors, decompose them, create a design transfer spec, and compare the result back to those anchors.
- Do not proceed from folder vibe. Future agents must name the exact reference files and what each one contributes: composition, palette/material, graph/component, image/object/media, or responsive/layout mechanics.
- The dashboard folder activates an image-aware command-surface mode, not a generic admin template. Extract attraction zone, panel mix, chart forms, palette strategy, image/object/media roles, material range, density, live/state energy, and calm/busy rhythm.
- Visual references also teach craft details: readable navigation, responsive nav behavior, toolbar rhythm, text density, button proportions, collision-free layout, and human palette direction. Do not copy only color/mood and miss these systems.
- Visual references also teach navigation art direction. Inspect nav placement, wordmark behavior, CTA placement, spatial link systems, menu treatment, mobile implications, and whether navigation is always visible or contextual.
- `approved/inspiration/navigation-art-direction/` is the canonical navigation-art-direction inspiration folder. It contains examples of navigation treated as part of the brand world rather than a default component.
- `approved/inspiration/advanced-motion-sites/` is the canonical advanced-motion inspiration folder. It teaches motion mechanics such as reel states, pinned sections, scroll progression, media reveals, typography rhythm, menu states, and section handoffs. Do not copy brand/content/visuals.
- Visual references also teach layout integrity: containment, minimum card widths, chart bounds, label semantics, badge spacing, and how the design adapts across desktop, tablet, and mobile. Do not squeeze layouts until content breaks.
- Do not use cryptic navigation, fake live/session/status chips, decorative telemetry, misaligned toolbars, prose-heavy panels, clumsy full-width desktop buttons, or machine-generated palettes as substitutes for polish.
- Do not use fake narrative/replay/mission/case-file chrome as product theater. `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Case File`, fake `CL-####` IDs, and fake severity chips are banned unless backed by real product behavior.
- Do not accept random mock data or generic app structure. Every app needs real business entities, real pages/routes, route jobs, and realistic sample records before UI implementation. Hostels need rooms, beds, bookings, guests, rates, locations, housekeeping, events, and maintenance. Restaurants need menus, products, ingredients, tables, reservations, orders, kitchen tickets, inventory, and suppliers. Dashboards need real KPIs, queues, owners, SLAs, costs, segments, drilldowns, and actions. `Mission control`, `topology`, `traces`, and abstract command labels are banned unless the actual domain and data contract justify them.
- Do not accept random "looks cool" palettes. Palette must fit product domain, user environment, task pressure, and emotional state.
- Do not accept dashboards that merely avoid overlap while still feeling AI-created. Human dashboard palette, route architecture, material range, attraction zone, and focused command surfaces matter before taste scoring.
- Complex operational dashboards must not dump every process into one page. Navigation routes must carry distinct task jobs and smaller organized workflows.
- Do not accept placebo navigation: selected nav/tab state must change visible product state, route, scope, filter, or content.
- Maps, floor plans, seating charts, canvases, and timelines need label safe zones. Objects, cards, and glows must not cover spatial labels.
- Pattern canvases and diagram surfaces need label lanes, callout routes, badge safe zones, measurement hierarchy, and performance budgets. Badges, selected outlines, and callouts must not obscure piece names, measurements, axes, ruler labels, or construction lines.
- Text escaping containers, chart overflow, clipped titles, overlapping badges, squeezed unreadable cards, and labels collapsing into nonsense are P0 failures before taste is evaluated.
- Primary headings and important text cannot be cut off underneath. Partial clipping is still a hard failure.
- Production-quality tests should prefer simple, readable, stable scroll unless advanced scroll passes Final UI Integrity Gate v3 across width sweep, height matrix, scroll samples, and readable resting states. Late Check FM passed only after unsafe experimental scroll/media movement was removed or simplified.
- For visual-heavy work using visual-library references, create `docs/design/reference-usage-report.md` before coding.
- When using any folder, extract scale and density, not just color or mood. Many approved desktop references show more meaningful information at once than AI-generated apps usually produce.
- Avoid inflated type, huge empty containers, oversized filler images, and low desktop density unless the reference clearly supports that scale relationship.
- When using image-led references, extract contrast strategy too. Text over images must use safe zones, scrims, plates, masks, deliberate crops, or be separated outside the image.
- Award-level UI never makes users fight to read. Artistic mood does not excuse weak contrast, washed-out labels, or text over noisy image detail.
- Every major image needs a declared role: hero scene, focal object, proof object, background atmosphere, editorial fragment, selection thumbnail, or texture/material layer.
- Every texture and illustration needs a role, layer, bounds, anchors, responsive behavior, and text-safe zones. Do not use ambient light blobs, dotted background texture, or amateur vector drawings as a shortcut to "advanced" UI.
- For artistic, landing-page, cinematic, editorial, or image-led references, decide whether the image is environment or asset. Do not trap immersive scenes in rectangular cards by default.
- If the reference uses a dominant background scene, compose around the image first: full-bleed, oversized, masked, layered, edge-to-edge, soft backdrop, or composition-driving crop.
- Every screenshot should have a matching `.md` note using `templates/reference-note.template.md`.
- Do not copy colors, brands, logos, proprietary assets, or product layouts blindly.
- Extract principles unless Migi explicitly says Literal Target Copy Mode is active.
- If Migi says `copy this exact UI`, `100% this design`, `literally what you see`, or `exact visual target`, use Literal Target Copy Mode and copy only the supplied visual target while excluding browser/editor/watermark artifacts.

## Reference Folder Modes

| Folder | Mode | Use For | Must Produce | Avoid |
| --- | --- | --- | --- | --- |
| `approved/inspiration/01-command-centers-dashboards/` | Command Center / Dashboard Mode | dashboard folders, command centers, dense data/productivity tools | image-aware graph-rich command surface, one attraction zone, varied panel hierarchy, meaningful metrics, useful charts, palette/material range, deliberate image/object/media use, live/state energy when relevant, command/action clarity | random card soup, murky monochrome or terminal-green palettes, overused accent color, same-weight widgets, text-and-metrics-only admin panels, decorative charts, chart-lite systems, image-starved surfaces, no focal anchor, generic SaaS dashboards, terminal-ish dark panel spam |
| `approved/inspiration/02-creative-experimental-ui/` | Artistic / Creative Mode | creative folders, experimental UI, editorial references, visual-heavy inspiration | art-directed composition, memorable first impression, unusual rhythm, fewer elements with more impact | normal dashboard structure, boring grids, safe template layouts, decorative chaos with no product clarity |
| `approved/inspiration/05-landing-hero-pages/` | Landing Page / Poster Mode | landing page folders, hero page references, cinematic/product story pages | image-led composition, sparse copy, poster-like hero, emotional scene, minimal chrome, visual rhythm beyond the hero | Blogspot/content-template structure, repeated feature sections, lots of cards, image pasted into generic SaaS page |
| `approved/inspiration/navigation-art-direction/` | Navigation Art-Direction Mode | visual-heavy navigation, portfolios, landing pages, creative/editorial sites, cinematic pages, app shells that need a stronger nav concept | `docs/design/navigation-strategy.md`, 3 distinct nav concepts, selected pattern, wordmark behavior, CTA/nav relationship, desktop/tablet/mobile behavior, active/focus states | default navbar gravity, logo-left links-center CTA-right by default, sticky pill nav, mobile top link dumps, nav pasted onto a hero |
| `approved/inspiration/advanced-motion-sites/` | Advanced Motion Choreography Mode | advanced animations, cinematic motion, artistic motion, scroll animation, portfolio motion, Awwwards/Godly/Recent-level motion | `docs/design/motion-choreography-plan.md`, exact motion references, named techniques, page/section choreography, image/media choreography, typography choreography, navigation/menu choreography, micro-feedback, reduced-motion fallback, motion evidence or blocker | one background animation, fade-up everywhere, random hover scale, motion without named technique, no section map, no reduced-motion plan, no evidence |
| `approved/inspiration/03-mobile-consumer-apps/` and `approved/inspiration/mobile-apps/` | Mobile Product Flow Mode | mobile app references, consumer flows, onboarding/profile/search/home screens | strong mobile hierarchy, real flow, thumb-friendly actions, polished card/navigation systems | tiny unreadable mockups, overdecorated fake app shots, beautiful screens with no usable flow |
| `approved/inspiration/04-selection-gallery-browse/` | Selection / Gallery / Browse Mode | selection/gallery folders, rosters, browse, marketplace, media library, configurators | desire to click/select, strong selected state, preview/detail relationship, browse rhythm, object hierarchy | boring equal grids, unclear selected state, equally important cards, swaps that break layout |

## What To Extract

- exact reference anchors selected
- role of each anchor
- reference mechanics transferred into the target product
- composition
- focal object
- dashboard attraction zone when using command-center references
- dashboard panel mix, palette strategy, chart forms, graph system, image/object/media roles, material range, live/state layer, and calm/busy rhythm
- navigation clarity and responsive nav behavior
- navigation pattern, wordmark behavior, CTA/nav relationship, active/focus states, and desktop/tablet/mobile behavior
- toolbar alignment and action/input rhythm
- panel text density and scanability
- button proportion rules
- responsive collision risks
- layout integrity and responsive breakpoint proof
- chart bounds and fallback chart forms
- semantic label strategy
- palette direction and accent discipline
- density
- scale relationships
- number of meaningful content objects above the fold
- largest text, supporting text, and small label roles
- card/container density
- image scale role
- image environment vs asset strategy
- crop strategy and why the image should or should not be boxed
- contrast and legibility strategy
- text-over-image protection method
- safe zones and focal-object protection
- visual hierarchy
- interaction model
- what is hidden or delayed
- what makes the screen desirable
- what future agents should not repeat

## Reference-Locked Build Mode Outputs

When active, the project must include:

- `docs/design/reference-decomposition.md`
- `docs/design/design-transfer-spec.md`
- `docs/qa/reference-match-report.md`

The final UI must be compared against the selected anchors for density, composition, palette, chart behavior, image/object/media behavior, and responsiveness.

The goal is not to make a museum. The goal is to make future work faster, sharper, and less generic.

## Signature Interactions Inspiration

`visual-library/approved/inspiration/signature-interactions/` is the canonical folder for elite interaction mechanics such as portal entry, scroll route choreography, mascot hero motion, editorial list modals, scroll-to-assemble cards, review theater cards, and playful entry gates. Extract mechanics, not brand skin.

## Rejected Palette Regression: Sepia Archive Brown

`visual-library/rejected/case-studies/sepia-espresso-surface-wash-regression/` is the canonical rejected evidence for the muddy sepia/espresso/umber brown-black archive wash. Do not use this surface family for pages, stages, cards, panels, sidebars, nav, framed objects, operational notes, or command containers. Do not justify it with nocturne, archive, field-guide, botanical, brass, tobacco, parchment, vintage, cinematic, commander, incident, operational, or premium language.
