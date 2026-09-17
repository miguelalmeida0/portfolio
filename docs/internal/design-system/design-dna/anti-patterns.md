# Anti-Patterns

Use this file as a defect list. If one of these appears in screenshots or code, fix it before delivery or document the product constraint that requires it.

## Palette Cloning

Detect:

- New app uses a source project's palette without a product-specific reason.
- Tokens are named after colors instead of roles, such as `navyCard`, `creamBg`, or `purpleGlow`.

Fix:

- Define semantic tokens first.
- Choose colors from the current product's domain, audience, and risk level.
- State what source-project palette you are explicitly not copying.

## Anti-Pattern: Random Domain Palette

Detect:

- Palette feels cool in isolation but wrong for the product domain.
- Colors do not reflect the user environment, task pressure, emotional state, or state semantics.
- Hospitality, healthcare, finance, operations, education, or utility products receive a generic dark/cinematic/AI palette without domain reasoning.
- State colors are chosen for vibe rather than meaning.

Why it fails:

Palette is part of product comprehension. A restaurant service surface, for example, should feel like live hospitality operations, not a random dark dashboard skin.

Correction:

Define Domain Palette Fit before tokens: product domain, user environment, task pressure, emotional state, state colors, colors to avoid, and why the selected palette belongs to this product.

## Anti-Pattern: Placebo Navigation

Detect:

- A nav item, tab, segmented control, filter, or mode switch changes active visual state but visible content does not change.
- The URL, route, panel scope, data filter, selected mode, or visible product state remains the same after selection.
- Users can click a control that only performs a styling change.

Why it fails:

Navigation is a promise. If selected state changes but product state does not, the UI becomes theater and trust collapses.

Correction:

Every clickable nav/tab/filter must change visible content, route, scope, data, or interaction mode. If the target is not implemented, remove it, disable it, or label it as unavailable.

## Anti-Pattern: Domain-Generic Mock Data

Detect:

- App sections sound abstract instead of business-specific.
- Values appear without units, ranges, statuses, timestamps, source, or plausible domain meaning.
- A hostel app lacks rooms, beds, bookings, guests, housekeeping, locations, or rates.
- A restaurant app lacks menu items, ingredients, tables, orders, reservations, kitchen tickets, or inventory.
- A dashboard uses `mission control`, `topology`, `traces`, `system map`, or generic command labels without a native product domain and data contract.
- Multiple workflows are crammed into one page instead of real routes/pages.

Why it fails:

Real products are organized around the work users actually do. Random values and abstract labels make the UI read as AI-generated even when the layout is technically clean.

Correction:

Create a Domain Content Contract before visual spec: business type, users, entities, real pages/routes, route jobs, mock data schema, realistic sample records, metric definitions, units, statuses, ranges, timestamps, source/freshness labels, and banned generic terms.

## Anti-Pattern: Spatial Label Collision

Detect:

- Floor-plan, map, seating chart, route, timeline, or canvas objects overlap section labels.
- Cards, glows, badges, or controls cover room names, server names, map labels, axes, or timeline labels.
- The primary spatial model remains visible but its labels become unreadable or meaningless.

Why it fails:

Spatial labels define the mental model. Covering them breaks orientation and makes the product feel untested.

Correction:

Reserve label safe zones, define z-index rules, offset objects around labels, add collision detection for dynamic layouts, or move labels to a protected layer.

## Anti-Pattern: Primary Object Buried By Cards

Detect:

- A desktop product has a map, floor plan, timeline, canvas, roster, or operational object, but cards/panels visually replace it.
- The main object becomes one card among many.
- Support panels dominate while the object the user acts on is pushed down, clipped, or visually weak.

Why it fails:

Command surfaces need a central object. Panels support decisions about that object; they do not become the product.

Correction:

Name the primary product object first and design around it. Put support panels in inspector, queue, control, or metric roles around the object.

## Generic Dashboard

Detect:

- First viewport is a grid of generic stat cards.
- Page title is "Dashboard" or "Overview" but the user's next action is unclear.
- Charts exist without a decision they support.
- Dashboard references are image-aware and graph-rich, but the output becomes a plain admin panel.
- There is no memorable focal object, dominant chart, scene, media block, map, product visual, avatar/content cluster, or attraction zone.
- Every widget has nearly the same weight, size, radius, border, and internal rhythm.
- The screen is text-and-metrics only, with little visual gravity.
- The design uses terminal-ish dark rectangles or generic SaaS cards as the whole visual idea.

Fix:

- Replace the stat grid with an art-directed command surface.
- Define one focal attraction zone first.
- Mix metrics, charts, queues, tables/lists, status chips, avatars, media/image blocks, product/object visuals, action modules, and controls.
- Keep metrics only if they change prioritization, trust, or decision-making.
- Integrate charts as part of the composition and the decision model, not as decorative filler.
- Vary panel scale, density, and visual weight so the screen has hierarchy.

## Anti-Pattern: Cryptic Navigation

Detect:

- Primary navigation uses unexplained abbreviations such as `CMD`, `SIG`, `CMP`, or `BRF`.
- Brand/system labels such as `SD LOCAL` appear without user-facing meaning.
- Icon-only nav has no labels, tooltips, or obvious context.
- Compact nav sacrifices comprehension to look technical.

Why it fails:

Users should not have to decode navigation. Cryptic labels make a product feel internal, unfinished, and hostile to first use.

Correction:

Use clear labels such as Command, Signals, Compare, Brief, Intake, Memory, Genome, or Rulebook. If abbreviations are used for style, expose the full meaning through visible labels, tooltips, or unmistakable context.

## Anti-Pattern: Broken Responsive Navigation

Detect:

- Desktop rail simply turns into oversized mobile pills.
- Desktop navigation is copied directly onto mobile.
- Top navigation consumes valuable mobile space in an app with 3+ primary destinations.
- Top and bottom navigation are both present for the same primary destinations.
- Mobile nav is cramped, cryptic, or wraps awkwardly.
- Bottom nav uses tiny icon bars, oversized bars, generic Android-looking defaults, poor safe-area handling, or weak icon/text alignment.
- Nav overlaps content or blocks touch targets.
- Selected state becomes unclear at smaller widths.

Why it fails:

Responsive navigation is a product surface, not leftover chrome. It must feel crafted at every width.

Correction:

Design desktop, tablet, and mobile nav intentionally. For applications with 3+ primary destinations, default to a polished bottom nav on mobile with clear labels, comfortable touch targets, balanced spacing, safe-area support, excellent icon/text alignment, and visible selected state. Use mobile top nav only for documentation sites, desktop-first enterprise tools, editor software, or scrolling-first websites.

## Anti-Pattern: Default Navbar Gravity

Detect:

- visual-heavy page uses logo-left links-center CTA-right by default
- sticky pill nav appears because it looks safe
- nav is pasted over the hero without becoming part of the composition
- all three direction options use the same navigation structure
- mobile receives a top link dump instead of a crafted mobile nav model
- CTA placement is generic or visually disconnected from the page intent
- nav competes with the focal image, object, or hero type

Why it fails:

Navigation is part of the product's visual world. A default bar can flatten a strong concept into generated SaaS even when the hero, imagery, and palette are better.

Correction:

Create `docs/design/navigation-strategy.md`, inspect reference nav behavior, propose 3 distinct nav concepts, select a pattern from `design-intelligence/navigation-patterns.json`, and define desktop/tablet/mobile behavior before implementation.

## Anti-Pattern: Misaligned Toolbar

Detect:

- Search field and action buttons sit on different baselines.
- Buttons and inputs have unrelated heights without an intentional scale relationship.
- Filter/action groups collide or wrap badly.
- Primary action floats awkwardly away from the input group.

Why it fails:

Search, filters, and actions are high-use controls. Misalignment makes the whole interface feel uncrafted.

Correction:

Create a toolbar height system. Align baselines, normalize control height where appropriate, use consistent gaps, and define responsive wrapping before implementation.

## Anti-Pattern: Prose-Box Panels

Detect:

- Dashboard/product cards are filled with multi-line paragraphs.
- Every panel requires reading instead of scanning.
- Dense copy repeats across many containers.
- Long explanation sits inside compact operational UI.

Why it fails:

Containers become tiring when they hold prose instead of state. Dense tools need structured information, not paragraph weight.

Correction:

Use scan-first panels: title, value/status, one-line summary, a few meaningful chips, and a clear action. Move long copy into details, drawer, preview artifact, or expanded state.

## Anti-Pattern: Clumsy Full-Width Buttons

Detect:

- Desktop buttons stretch across large containers without a clear reason.
- Long action labels become massive pills.
- Button width dominates more than the action deserves.
- Repeated full-width actions make the page feel amateur.

Why it fails:

Button proportion is part of craft. Oversized actions often signal that layout spacing is doing the work hierarchy should do.

Correction:

Let button width usually follow content. Use full-width buttons only when the surrounding layout, mobile context, or single-action zone clearly supports it.

## Anti-Pattern: Responsive Collision

Detect:

- Containers overlap during resizing.
- Pills, chips, stat badges, or controls stack on top of each other.
- Form controls break out of containers.
- Nav, overlays, or image captions cover content.
- Horizontal overflow appears on core screens.

Why it fails:

Collision means the layout system failed. It is not a polish issue.

Correction:

Check 1440, 1280, 1024, 768, and 390. Use `minmax(0, 1fr)`, `flex-wrap`, `clamp`, sane min-widths, overflow protection, and breakpoint-specific grid changes. No accidental overlap is acceptable.

## Anti-Pattern: Content Escaping Containers

Detect:

- Text, charts, bars, chips, badges, or controls overflow outside their intended card/container.
- Chart bars run into adjacent cards.
- Card titles are cut off at the top or sides.
- Body text escapes card boundaries.
- Stat bars cross container borders.
- Pills overlap image badges.
- Input text is clipped by its field.
- Nav items overlap page content.

Why it fails:

Content escaping containers looks junior, breaks trust instantly, destroys scanability, and proves the layout was only checked at one viewport. It cannot be award-level.

Correction:

Use real responsive constraints: `minmax(0, 1fr)`, min-width rules, `flex-wrap`, max-width, line clamp, content-aware breakpoints, responsive grid collapse, container queries where useful, chart clipping/margins, SVG/viewBox discipline, explicit chart bounds, and intentional overflow only when paired with visible truncation or scroll behavior.

## Anti-Pattern: Clipped Primary Text

Description:
Important text, especially headings, titles, button labels, form labels, nav labels, or chart labels, is visibly cut off above, below, or at the sides.

Why bad:
It makes the UI look untested and unfinished. Partial clipping still destroys trust because the design is failing at its most basic job: preserving readable language.

Blockers:

- heading descenders or baseline area cut off
- title cropped by viewport or parent overflow
- text clipped by transform, mask, sticky container, line-height, or decorative frame
- labels cut by chart/canvas bounds
- button, form, or nav text clipped inside controls

Correction:
Fix line-height, padding, overflow, transform origin, clipping, and responsive height. If the text cannot fit, change the layout or text role instead of hiding the failure.

## Anti-Pattern: Squeezed Card Garbage

Detect:

- Cards or panels shrink until content becomes unreadable.
- Labels truncate to single letters without an obvious legend.
- Multi-word titles are cut off.
- Chart axes become unreadable.
- Buttons squeeze into awkward pills.
- Image thumbnails overlap metadata.
- A card technically fits but is too narrow for its content model.

Why it fails:

Responsive layout should adapt, not suffocate. Elite dashboards preserve readability at every breakpoint.

Correction:

If a card cannot preserve meaning at a width, change the layout: stack vertically, convert to a list row, collapse secondary details, move details into a drawer, hide noncritical metadata, use abbreviations only with visible legends, or change the chart type for smaller widths.

## Anti-Pattern: Chart Bounds Failure

Detect:

- Bars, lines, points, axes, or labels leave the plot area.
- Graph marks cross unrelated panels or card borders.
- Chart labels collide with neighboring content.
- A chart is visually attractive but structurally broken.
- SVG overflow or missing chart margins let data spill past its container.

Why it fails:

Charts are part of the UI structure. A chart that escapes its bounds makes the whole dashboard feel untested and fake.

Correction:

Use explicit chart dimensions, plot-area clipping, label-aware margins, controlled SVG `viewBox`, `overflow` discipline, and responsive chart variants. If a chart cannot fit, use a simpler chart at that breakpoint.

## Anti-Pattern: Semantic Label Collapse

Detect:

- Labels collapse into `C`, `U`, `?`, or other unexplained fragments.
- Operational UI uses cryptic initials without a visible legend.
- Chart labels are shortened beyond comprehension.
- Navigation abbreviations are unclear.
- Words are clipped until the meaning is gone.

Why it fails:

Compact UI is allowed; meaningless UI is not. Labels carry product meaning, and losing that meaning breaks trust and navigation.

Correction:

Use standard abbreviations only when obvious or explained. Add a visible legend, change the layout, hide noncritical metadata, or move detail into a secondary view before labels become meaningless.

## Anti-Pattern: Fake Live / Session Status Slop

Detect:

- Decorative `live`, `session-only`, monitoring, telemetry, or glowing status chips appear without real product meaning.
- Status indicators imply backend freshness, live monitoring, or active sessions in a local/static UI.
- The label does not help the user decide anything.

Why it fails:

It is product theater. It makes unfinished software look falsely intelligent and wastes attention.

Correction:

Remove fake live/session/status badges. If state is real, explain it in user language and connect it to behavior, timestamp, source, persistence, or decision-making.

## Anti-Pattern: Machine-Generated Palette

Detect:

- Palette feels dull, robotic, generic, or emitted by a template.
- Terminal green, neon lime, AI purple, or generic blue/grey appears by default.
- Muddy sepia, espresso, umber, brown-black, tobacco, or stale parchment appears as the default page, card, panel, note, command container, container, sidebar, drawer, modal, or navigation background.
- One accent color is used everywhere.
- Surfaces lack roles: base, raised, quiet, active, image/media, data, danger, and success.

Why it fails:

Color should communicate identity, hierarchy, mood, and state. Machine-default palettes make even good structure feel unfinished.

Correction:

Define a human palette direction from references or product mood. Limit accent roles, vary surface material, and use state colors only when they clarify behavior.

## Anti-Pattern: Sepia Espresso Surface Wash

Detect:

- Page background, panels, cards, notes, command containers, containers, nav bars, sidebars, drawers, modals, or large framed stages use a muddy sepia/espresso/umber brown-black wash by default.
- The palette reads like old coffee, tobacco, stale parchment, dirty bronze, dark olive-brown, or generated-app “nocturne” brown.
- The color appears repeatedly across unrelated projects, especially landing/editorial/portfolio screens.
- The UI tries to make the color feel premium by adding beige text, brass lines, muted purple, cream strokes, or botanical/vector decoration.
- The design cannot explain why that brown family belongs to the product domain, environment, task pressure, or reference anchors.
- The design tries to rename the same banned color as archive, nocturne, field guide, botanical, brass, tobacco, parchment, vintage, cinematic, commander, incident, operational, or premium.

Why it fails:

Migi has explicitly rejected this recurring generated palette. It makes unrelated products feel the same, flattens contrast, dirties the mood, and turns artistic layouts into AI-default sepia theater.

Correction:

Remove the sepia/espresso/umber wash from major surfaces. Choose a palette from the product domain, selected references, or a fresh art-direction thesis. If a warm dark palette is truly needed, use a distinct color strategy such as aubergine-black, ink blue, deep green-black, mineral grey, clean black/white, or a reference-specific palette with documented OKLCH/APCA contrast. Do not rescue the banned palette by giving it a poetic label.

Hard rule:

For Migi work, sepia/espresso/umber brown-black archive wash is not a default, not a safe refined option, not a high-character option, and not an acceptable "nocturne" shortcut. If it appears as a large background/stage/card/panel/note/container surface, stop and redesign the palette before continuing. Visible sepia containers cap score at 2.

## Anti-Pattern: Safe AI Palette Default

Detect:

- Artistic, landing, portfolio, cinematic, creative, or experimental page uses muddy brown, dull charcoal, beige, grey-blue, orange accent, purple glow, terminal green, neon lime, or one predictable safe accent.
- Artistic/editorial UI uses the banned sepia/espresso/umber brown-black wash as its main surface color.
- Palette exploration is missing.
- Palette feels readable but conceptually boring.
- Image colors and UI colors do not feel intentionally composed.
- Color is treated as background filler instead of identity.

Why it fails:

Creative modes need color as part of the concept. Safe generated-app palettes make original layouts feel like templates.

Correction:

Explore three palette directions before implementation: safe refined, artistic expressive, and unexpected high-character. Select one that fits the concept, imagery, and references, then validate OKLCH/APCA contrast.

## Anti-Pattern: Functional But Unfinished Dashboard

Detect:

- The dashboard has working controls but lacks polish.
- Navigation is cryptic.
- Toolbars are misaligned.
- Panels are text-heavy.
- Buttons feel clumsy.
- Responsiveness collides.
- Palette feels generic or robotic.
- Fake status theater appears.

Why it fails:

Working interactions do not equal a finished dashboard. Migi's dashboard direction requires utility plus visual craft.

Correction:

Before handoff, prove clear navigation, aligned toolbars, scan-first panels, proportionate actions, collision-free responsive behavior, human palette, and no fake live/session UI.

## Anti-Pattern: Same-Weight Dashboard Widget Field

Detect:

- Dashboard is made from many equal cards.
- Every panel appears equally important.
- There is no dominant visual/data stage.
- Density is solved by adding more boxes rather than clearer hierarchy.
- Calm and busy zones are not differentiated.

Why it fails:

Migi's dashboard references use varied panel roles and deliberate asymmetry. Same-weight repetition makes a dashboard feel like an admin template even when the colors are polished.

Correction:

Create a panel hierarchy: one major focal zone, one utility-heavy zone, one chart/stats zone, one queue/list zone, one imagery/content zone, and one control/action zone. Let some panels be dense, some calm, some visual, and some operational.

## Anti-Pattern: Dashboard Without Visual Gravity

Detect:

- The screen has no memorable attraction zone.
- Imagery, objects, avatars, media, maps, scenes, or dominant charts are absent even though dashboard references use them.
- The page is utility-only and forgettable.
- The first screen could belong to any SaaS admin product.

Why it fails:

The dashboard folder shows that dashboards can be useful and visually memorable. Without one visual anchor, the surface has no designed center of gravity.

Correction:

Choose one focal anchor: 3D object, isometric scene, media/image block, product visual, bold content object, dominant graph, map, account/card stack, selected item, or equivalent. Build the remaining panels around it.

## Anti-Pattern: Charts As Decoration

Detect:

- Charts appear because dashboards are expected to have charts.
- Chart types repeat without functional difference.
- Graphs do not support a visible decision, comparison, status, or trend.
- Chart styling is disconnected from the surrounding composition.

Why it fails:

The references use charts as useful visual instruments: line charts, bars, rings, progress tracks, heatmaps, maps, funnels, timelines, sparklines, and score indicators. Decorative charts create false richness.

Correction:

Name what each chart helps the user understand or decide. Use varied chart forms only when the data role differs, and integrate the chart's color, scale, annotation, and interaction with the surrounding hierarchy.

## Anti-Pattern: Murky Monochrome Dashboard

Detect:

- Dashboard is mostly one muddy dark color family.
- Lime, green, purple, or another accent appears everywhere.
- Panels, charts, buttons, labels, and statuses share the same color energy.
- Neutral surfaces lack material range.
- The result feels terminal-like, lifeless, or one-note.

Why it fails:

Dashboard references use palette and material to clarify hierarchy. One dark wash makes every panel feel the same and kills the visual energy Migi expects.

Correction:

Define Dashboard Palette Strategy before implementation. Use a reference-driven palette with base, raised panel, quiet panel, active panel, image/media panel, data panel, controlled accents, and clear state colors.

## Anti-Pattern: Single-Accent Overuse

Detect:

- One accent color is used for every active tab, chart, border, glow, icon, label, button, status, and highlight.
- The accent stops communicating priority or state.
- Dashboard hierarchy depends on color repetition instead of panel role and composition.

Why it fails:

Accent color is a signal. If everything is accented, nothing is.

Correction:

Reserve accent for active state, primary action, selected data, or critical status. Use separate state colors for success, warning, danger, freshness, and neutral metadata only when the product needs them.

## Anti-Pattern: Decorative Chart Wallpaper

Detect:

- A large graph-like shape looks impressive but does not communicate clear state.
- Axes, labels, legends, annotations, or comparisons are missing when needed.
- The user cannot explain what the chart changes about their next action.
- The chart occupies the attraction zone but acts like background art.

Why it fails:

It creates the illusion of intelligence while wasting the most important dashboard space.

Correction:

Tie the major chart to a product concept: trend, priority, risk, freshness, change, comparison, distribution, capacity, or progress. Add labels, annotations, selected states, and supporting microcharts only where they improve decision-making.

## Anti-Pattern: Chart-Lite Dashboard

Detect:

- Dashboard uses mostly text, metric cards, and lists despite graph-rich references.
- Only one basic chart type appears across the whole dashboard.
- Microcharts, score meters, progress tracks, maps, matrices, timelines, or sparklines are absent even where they would improve scanning.

Why it fails:

The dashboard folder's visual energy comes partly from graph variety. A chart-lite dashboard feels flat and under-designed.

Correction:

Consider at least two visualization types: one major chart/map/matrix/timeline plus supporting bars, rings, progress tracks, sparklines, ranked scores, heat maps, or timeline strips.

## Anti-Pattern: Image-Starved Dashboard

Detect:

- Dashboard uses only text, numbers, abstract panels, and charts.
- References show avatars, media, objects, scene previews, product visuals, or image-led panels, but the output reduces imagery to tiny avatars or omits it.
- The surface has no memorable visual object or media anchor.

Why it fails:

Without image/object/media layers, the dashboard can be functional but forgettable. Migi's dashboard references often use visual anchors to create memory and hierarchy.

Correction:

Define Image / Object / Media Strategy. Use a purposeful attraction zone, proof object, user/entity context, media/content preview, product object, status visualization, live tile, or environment mini-map when the product supports it.

## Anti-Pattern: Dead Dashboard Surface

Detect:

- Product represents live signals, activity, monitoring, queues, events, or freshness, but the dashboard feels frozen.
- No live indicators, progress movement, chart transitions, selected states, timeline motion, or active-state cues are present.
- Motion, if present, is decorative and unrelated to state.

Why it fails:

Elite dashboards feel alive when the product is alive. Static surfaces can make operational products feel fake or stale.

Correction:

Add a Dashboard Live Visual Layer: live indicators, progress movement, animated chart transitions, timeline/state strips, hover/selection transitions, or live media tiles. Motion must communicate state, freshness, selection, progress, or activity.

## Anti-Pattern: Terminal-Ish Dark Panel Spam

Detect:

- The dashboard is mostly dark rectangles with labels, numbers, and weak grey text.
- Visual contrast comes from neon accents instead of hierarchy.
- There is no soft premium surface treatment, image/object material, or graph richness.
- The result feels like a generic finance/dev terminal regardless of product type.

Why it fails:

Migi's dashboard references include dark surfaces, but they are polished, image-aware, graph-rich, and compositionally varied. Dark mode alone is not art direction.

Correction:

Use dark surfaces only when they support the product. Add crafted hierarchy through focal zones, expressive visualization, meaningful imagery/object use, controlled typography, soft depth, and varied panel roles.

## Anti-Pattern: Oversized Empty Dashboard

Detect:

- Dashboard cards, headings, charts, and padding are inflated.
- Desktop shows too few meaningful objects despite dense references.
- Large containers hold little content.
- The screen feels like a mobile dashboard blown up.

Why it fails:

Dashboard references deliver useful volume quickly. Oversized empty dashboards waste the viewport and hide the product's operational value.

Correction:

Run a dashboard Scale Calibration Pass. Tighten typography, card dimensions, chart shells, and spacing until the desktop viewport shows meaningful metrics, visualization, queues/lists, controls, and a focal visual/data object without feeling cramped.

## Anti-Pattern: Dashboard Furniture in Artistic Landing Pages

Detect:

- Migi asked for landing page, creative, artistic, cinematic, editorial, visual-heavy, image-led, or landing-page inspiration.
- The result uses repetitive card rows, visible grids, boxed content modules, stats blocks, feature grids, or product-dashboard structure.
- Images sit inside a normal marketing layout instead of driving the composition.
- The hero is artistic, but the rest of the page becomes generic.
- The page has too much explanatory copy for an image-led reference set.

Why it fails:

Artistic and creative landing pages should feel composed, not administrated. Dashboard furniture turns atmosphere into page-builder output.

Correction:

Use fewer elements, stronger image treatment, quieter UI chrome, larger visual moments, sparse copy, and a weak or invisible grid when possible. Preserve the image-led rhythm beyond the hero.

## Implementation Before Art Direction

Detect:

- The agent starts coding components before defining the visual concept.
- A visual-heavy screen begins as page shell, cards, nav, and reusable components before art direction is approved.
- The implementation plan describes components but not metaphor, focal object, emotional hook, hidden information, or what is absent.

Why it fails:

It locks the product into generic component structure before the emotional/product direction is solved.

Correction:

For visual-heavy work outside Literal Target Copy Mode, first create 3 rendered art-direction prototypes with preview routes and 1440 / 768 / 390 screenshot files. Wait for Migi to approve one visual direction, then implement only that approved direction.

## Text-Only Art Direction

Detect:

- The agent gives concept names or descriptions but no rendered visuals.
- Migi is asked to approve direction from text instead of seeing composition, scale, object treatment, and mood.
- A visual-heavy gate artifact has no preview route or missing concept screenshots.

Why it fails:

Migi cannot choose a visual direction from text. Visual design requires seeing composition, scale, rhythm, object treatment, and mood.

Correction:

Create 3 actual visual prototypes and screenshot them before approval. No visual screenshots = Visual Concept Gate failed.

## Reference Flattening

Detect:

- Inspiration is reduced to shallow styling traits: dark theme, neon, glass, cards, large text, glow, gradients, or rounded panels.
- The result copies surface tokens while changing the reference's composition, focal object, or information strategy.

Why it fails:

It copies the surface but misses the design mechanism.

Correction:

Extract composition, focal object, spatial hierarchy, hidden information, emotional hook, material/texture, interaction model, and what is intentionally absent.

## Wrong Reference Folder Mode

Detect:

- Migi points to a visual-library folder, but the output uses a different design mode.
- Command-center references become generic SaaS dashboards.
- Creative references become safe template grids.
- Landing references become text-heavy content pages.
- Mobile references become pretty but unusable stills.
- Gallery references become equal-card catalogs with weak selected state.
- All references are treated equally with no priority or stated thesis.

Why it fails:

The folder is part of the instruction. Ignoring it discards the design intent before implementation begins.

Correction:

Select the correct Reference Folder Mode, create `docs/design/reference-usage-report.md`, prioritize the strongest references, and name what will not be copied.

## Anti-Pattern: Folder Vibe Instead Of Reference Anchors

Detect:

- Migi asks to use a visual-library folder or screenshot set.
- The agent summarizes the folder as a vibe, such as dashboard energy, creative mood, premium dark, or landing-page feel.
- No exact reference files are selected.
- No anchor roles are assigned.
- The output uses a generic layout that could have been produced without the references.

Why it fails:

Folder-level inspiration is too vague. It lets agents copy mood, color, or category while ignoring composition, density, chart behavior, image/object roles, material systems, and responsive mechanics.

Correction:

Activate Reference-Locked Build Mode. Select 3-5 exact reference anchors, assign each a role, create `docs/design/reference-decomposition.md`, create `docs/design/design-transfer-spec.md`, build from the spec, and finish with `docs/qa/reference-match-report.md`.

## Anti-Pattern: Mood Copy Without Mechanics

Detect:

- The result copies dark/light mood, accent color, rounded surfaces, or general category.
- Composition, panel hierarchy, density, chart system, image/object behavior, and responsive structure do not match the selected anchors.
- The agent cannot explain what each reference contributed.

Why it fails:

Migi's visual references are not moodboards only. They are evidence of design mechanics.

Correction:

Decompose canvas, composition, density, typography, charts/data, image/object/media, palette/material, and interaction model before coding. Transfer mechanics, not vibes.

## Random Decorative Image Use

Detect:

- Images appear because the page needs visual interest, but they do not define composition, identity, proof, mood, selection, or material.
- Major images have no declared role.
- A hero image works, but later imagery becomes filler in generic cards or sections.

Why it fails:

Images are design material, not wallpaper. Random images make referenced work look assembled instead of directed.

Correction:

Declare one role for every major image: hero scene, focal object, proof object, background atmosphere, editorial fragment, selection thumbnail, or texture/material layer. Remove images that cannot earn a role.

## Anti-Pattern: Background Image Fear

Detect:

- The reference uses immersive image scenes, but the agent boxes the image into a safe rectangle.
- A dominant scene becomes a square card, bordered image block, or rigid two-column image/text layout.
- The page is component-led even though the reference is scene-led.
- Image potential as full-bleed, oversized, masked, or layered environment is ignored.

Why it fails:

Artistic references often work because image, typography, and space are fused. Boxing the image destroys the composition.

Correction:

Use image-as-environment techniques: full-bleed scene, oversized crop, masked image field, image bleeding beyond grid boundaries, scrim-protected text over image, text in clean negative-space zones, layered foreground/background, and image-driven section rhythm.

## Anti-Pattern: Hope-Based Contrast

Detect:

- Text sits over an image, gradient, video, texture, or noisy panel with no explicit protection.
- White or cream text appears directly on bright or busy photo areas.
- Small labels sit over high-frequency image detail.
- Accent labels sit over bright image areas without backing.
- Important product copy sits over faces, eyes, hands, or focal objects.
- Text is readable in one crop but fails in another.

Why it fails:

Readability changes across the image and across responsive crops. A text layer that looks okay in one area can fail completely on another.

Correction:

Use a defined contrast protection system: safe zone, plate, scrim, mask, local vignette, blur/backdrop plate, deliberate crop, or move the text outside the image. Verify at 1440 / 768 / 390.

## Anti-pattern: Product Thinking During Literal Copy

Detect:

- Migi asked for `copy this exact UI`, `100% this design`, `literally what you see`, or `exact visual target`.
- The agent adds product logic, data panels, useful features, explanatory UI, alternate layouts, or design improvements.
- The result changes the supplied target's composition instead of matching the visible shell.

Why it fails:

Literal Target Copy Mode is not a product-design exercise. The request is visual parity with the supplied target, not a better or more useful product.

Correction:

When Literal Target Copy Mode is active, product logic waits. Build the pixel-parity shell first, implement only minimum visible interactions, screenshot compare against the target, and report exact differences.

## Same Layout With New Paint

Detect:

- A rejected structure is preserved while colors, scale, spacing, glow, cards, motion, or borders change.
- The visual direction changes, but the composition and information hierarchy remain the same.

Why it fails:

If the composition is wrong, styling changes are not progress.

Correction:

When Migi rejects the direction, rethink the structure from first principles. Restart at the Visual Concept Gate instead of polishing the rejected layout.

## Obvious Theme Literalism

Detect:

- An app about robots becomes dark cyber cards, neon glows, stat badges, and "fighter" language by default.
- A finance product automatically becomes a Wall Street terminal, a health product automatically becomes clinical blue, or a game-adjacent product automatically becomes neon arcade.
- The visual system feels like the first generic app-builder result for the prompt.
- Obvious examples: robot app = dark cyber cards; AI app = glowing orb; finance app = dashboard grid; social app = pastel card feed; portfolio = generic hero sections; developer tool = terminal everywhere.

Fix:

- Before designing, define a non-obvious visual metaphor.
- Ask: what would a great designer do besides the expected theme treatment?
- Use theme signals only when they support the product concept, not because the noun suggests them.

## Motion Without Purpose

Detect:

- Animation exists only to make the app feel alive.
- Movement does not clarify selection, hover, state change, transition, hierarchy, progress, spatial relationship, or user feedback.

Why it fails:

Animation is not automatically polish. Decorative motion becomes noise.

Correction:

Motion is only acceptable when it clarifies selection, hover, state change, transition, hierarchy, progress, spatial relationship, or user feedback. If motion does not clarify something, remove it.

## AI Scale Inflation

Detect:

- Giant headlines, cards, sections, images, buttons, spacing, and containers are used to fake drama.
- Every object is large, so no object is actually dominant.
- First load feels physically overwhelming.
- Desktop shows fewer than 3 meaningful content objects without strong reference justification.
- The page has low content/data density above the fold.
- Containers are much larger than their content.
- The desktop layout feels like a mobile design blown up.

Why it fails:

The user feels attacked by scale. Big does not equal premium. Real premium references use proportion, density, rhythm, and content calibration; they do not simply enlarge everything.

Correction:

Perform a Scale Calibration Pass against the selected reference folder before implementation. Compare headline size, body text size, container size, card density, image size, spacing, visible content objects, and meaningful information above the fold. Use controlled type scale, useful density, hierarchy with range, content richness, and no giant empty furniture.

## Anti-Pattern: Giant Container Attack

Detect:

- Hero text is too large relative to the viewport.
- Oversized image/card has a weak content role.
- Low amount of visible information appears above the fold.
- Sections are giant and empty.
- Oversized containers repeat across the page.
- Desktop behaves like enlarged mobile layout.
- There is no scale contrast beyond "huge."

Why it fails:

The UI feels inflated rather than designed. Real premium references use proportion, density, rhythm, and content calibration.

Correction:

Reduce inflated elements, increase meaningful visible content, introduce smaller supporting type, tighten containers to content, and match the density/rhythm of the chosen reference folder.

## Excitement Through Clutter

Detect:

- Energy is created by adding badges, labels, stats, glows, borders, overlays, and micro-panels.
- The interface is visually busy before it is emotionally compelling.
- Decorative "cool" effects compete with the selectable object or primary action.

Fix:

- Create excitement through composition, scale, contrast, motion, selection reward, and object desire.
- Use fewer elements with more intent.
- Let one or two strong signals carry the card instead of badge soup.
- Prefer strong focal object, material, mood, pacing, progressive disclosure, and interaction reward over more labels/effects.

## Overlap / Collision

Detect:

- Badges, labels, stats, text, or controls sit on top of each other.
- Metadata and actions compete for the same zone.
- Image overlays reduce readability or collide at responsive sizes.
- A card only works at one viewport.

Fix:

- Every card needs clear zones: visual, identity, metadata, action.
- Include a state zone when status/selection/availability matters.
- Test at 390 / 768 / 1440.
- No accidental collision is acceptable.
- Only use deliberate overlap when it is readable, necessary, and proven responsive.

## Prompt-Generated Genre Default

Detect:

- The UI looks like the first output from a generic app builder after giving it the theme.
- The design follows genre cliches instead of a product thesis.
- It mistakes theme decoration for product concept.

Fix:

- Reject the first obvious genre treatment.
- Produce at least one design thesis that reframes the product.
- Name the obvious route you are avoiding before choosing palette, layout, language, or effects.

## Selection Catalog When Product Needs Desire

Detect:

- The product's core loop is selection, browsing, collecting, gallery exploration, roster choice, or object discovery.
- The first screen organizes objects cleanly but does not make users want to choose, click, compare, or collect.
- Cards look like product listings instead of selectable characters, tools, artifacts, places, or objects.
- Hover and selected states are flat, passive, or purely informational.
- Dense specs, tiny stat rows, product-brochure copy, or technical analysis appear before desire is established.

Fix:

- Turn the first screen into a selection moment, not an information page.
- Make selectable objects visually distinct through image scale, silhouette, rarity/class/tier/vibe labels, personality, role, power, or object-specific traits.
- Give hover and selected states a visible reward: scale, glow, reveal, animation, sound-safe visual feedback, loadout preview, comparison tray, or committed selected panel.
- Use progressive disclosure: excitement first, details second.
- Move dense specs and analysis behind selection, drawer, detail view, comparison mode, or loadout/inspector.

Robot Skill Forge evidence: see `design-dna/rejected-directions.md` for the rejected beige catalog direction.

## Terminal / Newspaper Overload For Selection Products

Detect:

- A selection-first product shows dense terminal panels, newspaper-like information blocks, stats, badges, meters, tabs, and labels before the user chooses an object.
- Dark robotics or AI-terminal styling is used as a generic mood instead of creating desire to pick an object.
- Background grid/cross-line texture reads as generic AI atmosphere.

Fix:

- Start with the selectable objects and the emotional reason to choose among them.
- Put stats, meters, tabs, and technical diagnostics after selection.
- Replace generic terminal mood with object-specific personality, class, rarity, role, or collection logic.

Robot Skill Forge evidence: see `design-dna/rejected-directions.md` for the rejected terminal/newspaper direction.

## Container Soup

Detect:

- Three or more nested rounded/bordered containers in a primary zone.
- Every section is a card, including page shell, hero, nav, and repeated items.
- Borders are doing the work that spacing and hierarchy should do.

Fix:

- Remove one wrapper layer.
- Convert page-level containers to bands, rails, split panes, or direct layout.
- Reserve cards for repeated objects, tools, and modals.

## CTA Soup

Detect:

- More than one same-weight filled button in a zone.
- A modal, card, or hero contains primary, secondary, and tertiary actions that look equal.

Fix:

- Keep one primary action.
- Move secondary actions to outline/ghost/text/icon/menu treatments.
- Put destructive actions in a separate confirmation zone.

## Chip Soup

Detect:

- Pills are used for filters, statuses, nav tabs, metrics, categories, and actions.
- Passive tags have pointer cursor or hover styles.

Fix:

- Assign role-specific components: `StatusTag`, `FilterChip`, `Tab`, `Button`, `MetadataLabel`.
- Give only interactive chips selected/hover/focus states.

## In-The-Loop Overfit

Detect:

- New apps inherit warm social copy, avatars, invite mechanics, bottom nav, or playful planning language when they are not social planning products.

Fix:

- Treat the case study as failure-mode evidence only.
- Keep consumer planning patterns only when the current project coordinates people, time, places, or invitations.

## App-Specific Evidence Used As Global Law

Detect:

- "Use terminal dark UI" because Equity did.
- "Use bottom nav" because Ontime did.
- "Use portrait media" because Portfolio did.
- "Use dense navy shell" because Agent Boss did.
- "Use cinematic AI gradients" because Ghostwritter did.

Fix:

- Translate the source project into a principle, such as "data products need source/recency and numeric alignment."
- Apply the principle with a new visual identity.

## Fake Form Energy

Detect:

- A fast creation flow starts with a long form before value is visible.
- Labels and helper text repeat obvious instructions.

Fix:

- Start with the minimum input needed to produce the first result.
- Use defaults, segmented controls, inline pickers, and progressive disclosure.
- Show preview/result as soon as possible.

## Data Theater

Detect:

- "Live", "validated", "safe", "optimized", confidence, or performance claims have no source, timestamp, or fallback.
- Empty states pretend data exists.

Fix:

- Add recency/source/status labels.
- Label mock/sample data.
- Provide loading, empty, and error states.

## Stretched Mobile Desktop

Detect:

- Desktop is a centered mobile column for a tool that needs comparison, inspection, or context.
- Buttons become very wide on desktop without adding value.

Fix:

- Add a side rail, inspector, preview, comparison column, or denser table where the product benefits from context.
- Keep editorial pages narrow only when reading is the primary task.

## Decorative Motion

Detect:

- Animation does not communicate route change, generated output, filter state, loading, selection, or feedback.

Fix:

- Remove it or tie it to state.
- Keep dense reading/data surfaces still.

## Final Blocker List

Do not finish while any are true:

- meaningful charts were implemented without chart-selection report
- chart choice does not match the data shape or user decision
- chart relies on color alone without an accessible fallback
- visual style was selected by vibe only with no style-selection report
- incompatible style systems are mashed together without a primary style spine
- premium website/landing work skips image-first analysis when references or generation are available
- website implementation drifts from section references into generic coded sections
- main object unclear
- primary action hidden or competing
- passive metadata looks clickable
- source-project palette copied literally
- Visual Concept Gate skipped for visual-heavy work when Literal Target Copy Mode was not requested
- visual-heavy work presents only text concepts
- Migi is asked to approve art direction without visual previews
- concept screenshots are missing
- implementation begins before visual concept approval
- inspiration flattened into shallow style traits
- Literal Target Copy Mode requested but the agent changes composition or adds unrelated product UI
- rejected layout preserved with new paint
- strong reference converted into generic components
- motion exists only as decoration
- AI scale inflation overwhelms the product
- giant container attack: huge type, huge empty containers, and low desktop density
- hope-based contrast: important text is hard to read or relies on a lucky image crop
- background image fear: immersive references are reduced to boxed rectangular image assets
- visible UI elements overlap or collide unintentionally
- app follows the obvious genre aesthetic without a fresh thesis
- selection-first product creates excitement mainly through badges/glows/stats instead of desire and interaction reward
- selection-first product opens as a beige catalog, brochure, dashboard, dense terminal, or obvious genre cliche before creating desire
- mobile screenshot has accidental horizontal scroll
- desktop screenshot is stretched mobile for a non-editorial app
- data claims are unsupported
- no scorecard result
## Anti-Pattern: AI Landing Page Tells

Description:
The agent builds a landing/portfolio/marketing page that exposes common AI defaults: centered dark hero, purple glow, three equal feature cards, fake product screenshots, generic names, fake metrics, section-number eyebrows, duplicate CTAs, and decorative status dots.

Why bad:
These patterns make the page feel generated even when the styling is polished.

Blockers:

- fake div screenshot used as product proof
- CTA wraps on desktop
- duplicate CTA intent
- em-dashes in visible UI copy
- repeated same-family sections
- logo wall is plain text wordmarks
- scroll cues or fake version labels in hero

Correction:
Run a design read, lock the design system, give every section a job, use real/generated images where needed, and run anti-AI-tell preflight before handoff.

## Anti-Pattern: Animation Fatigue

Description:
The UI animates too many frequent interactions, adding delay and noise.

Why bad:
Motion has a cost. High-frequency controls should feel instant. Delight becomes irritating when repeated.

Blockers:

- keyboard actions animated
- hover effects everywhere
- constant ambient motion in utility UI
- no reduced-motion behavior
- animation has no purpose

Correction:
Use the frequency table. Keep common actions instant, occasional interactions crisp, and delight for rare earned moments.

## Anti-Pattern: One-Animation Advanced Motion

Description:
The agent interprets advanced motion as one background animation, one parallax layer, one fade-up recipe, or hover scale sprinkled across a mostly static page.

Why bad:
Elite animated sites are choreographed experiences. They include page/section motion, image/media motion, typography rhythm, navigation/menu states, micro-feedback, and reduced-motion fallbacks. One animation is not an advanced motion system.

Blockers:

- no `docs/design/motion-choreography-plan.md`
- no section-by-section motion map
- no named techniques
- no image/media choreography
- no typography or navigation/menu choreography
- no reduced-motion behavior
- no motion evidence or documented capture blocker
- every section uses the same fade-up

Correction:
Route to `skills/advanced-motion-choreography/SKILL.md`, create the choreography plan, choose a tool stack, implement the required motion layers, and score against `evaluation/benchmarks/motion-cinematic.benchmark.md`.

## Anti-Pattern: Coding From Vague Direction Cards

Description:
The agent begins implementation for new visual-heavy work after vague mood notes or weak text-only direction cards that lack layout maps, primary product objects, domain palette rationale, interaction promises, and risk checks.

Why bad:
The no-image gate is only useful when it is concrete enough to build from. Vague direction cards let generic SaaS, default nav, safe palettes, card soup, and AI scale inflation leak into the first build.

Blockers:

- no `docs/design/direction-options.md`
- no `docs/design/direction-layout-maps.md`
- no `docs/design/direction-risk-check.md`
- no primary product object per direction
- no domain palette rationale per direction
- no nav state effect or interaction promises
- no Migi direction selection
- paid image generation runs without explicit approval

Correction:
Run the No-Image Fast Direction Gate, create 3 differentiated direction cards with compact layout maps, risk checks, and recommendation scores, then stop for selection.

## Anti-Pattern: Decorative Visualization Theater

Description:
A chart, graph, heatmap, timeline, gauge, or diagram is used to make a surface look intelligent, but it has no user question, data contract, readable labels, visible units, or decision value.

Why bad:
It creates fake usefulness. Users see visual complexity without a trustworthy answer, and the product feels generated rather than operational.

Blockers:

- no data contract
- no user question
- hidden or missing units
- unreadable axes or labels
- random donut/gauge/line chart
- color-only state
- decorative chart wallpaper

Correction:
Route `skills/chart-system-director/SKILL.md`, define the user question and data contract, choose a chart/tool from `design-intelligence/visualization-tool-routing.md`, and remove the chart if it cannot answer a real decision.

## Anti-Pattern: Hand-Placed Canvas Objects

Description:
A map, floor plan, pattern canvas, seating chart, timeline, node graph, or diagram appears as a set of manually positioned shapes without a coordinate system, layer model, object model, label safe zones, collision strategy, or selection behavior.

Why bad:
It breaks immediately when labels get longer, objects change, selections add outlines/glows, or the viewport changes. The canvas looks designed from one screenshot instead of built from a product model.

Blockers:

- labels collide with objects
- pattern pieces or map objects overlap unpredictably
- selected state obscures data
- object positions are arbitrary or undocumented
- inspector/details do not update from selection
- decorative grids or construction lines have no function
- no small-breakpoint fallback

Correction:
Route `skills/diagram-canvas-system/SKILL.md`, define coordinate system, bounds, layer model, object model, label model, collision rules, and selection-to-inspector behavior. After implementation, route `skills/data-viz-hardening-review/SKILL.md` and run `tools/diagram-integrity-check.mjs` where practical.

## Anti-Pattern: Catastrophic Diagram Overlap

Description:
A graph, diagram, pattern canvas, map, floor plan, or timeline lets labels, badges, callouts, measurement chips, selected outlines, ruler text, construction lines, and objects collide until the surface becomes unreadable.

Why bad:
This is worse than generic design. It damages the product object itself. The user cannot trust the spatial model, measurement system, or selected state because the drawing logic is visually broken.

Blockers:

- piece names covered by status badges or selected outlines
- measurement callouts overlap labels or objects
- construction lines run through important text without hierarchy
- labels pile into large unreadable clusters
- axes, rulers, or scale labels fight with object labels
- close-up/zoom state becomes more chaotic instead of clearer

Correction:
Create label lanes, callout routes, object safe zones, z-index rules, label priority, collision avoidance, zoom behavior, and fallback display modes. Reduce visual layers before adding polish.

## Anti-Pattern: Performance-Hostile Diagram Canvas

Description:
A canvas or diagram uses too many DOM layers, text shadows, blurs, glows, filters, oversized effects, or layout-bound interactions, making the surface feel slow, janky, or heavy.

Why bad:
Interactive spatial products must feel immediate. If pan, zoom, drag, selection, hover, or resize is sluggish, the visual system has failed product use.

Blockers:

- many shadow/filter/glow effects on repeated objects
- layout thrash during drag, pan, zoom, or selection
- huge DOM/SVG node count with no virtualization or canvas strategy
- animated or blurred construction layers that do not help comprehension
- no performance budget for dense labels and objects

Correction:
Choose the right rendering layer: custom SVG for small controlled diagrams, Canvas/Konva for dense interactive shape fields, D3 for bespoke geometry, or React Flow for node editors. Limit expensive effects, throttle interaction work, precompute layout where possible, and keep the diagram useful without animation.

## Anti-Pattern: Fake Orbit Atmosphere

Description:
A page adds circular orbit, sonar, radar, target, HUD, or concentric arc lines to make the design feel advanced, cinematic, or technical, but the lines do not represent real data, navigation, selection, sound, movement, or interaction.

Why bad:
It is a repeated AI-builder motif with no semantic value. It adds visual noise, competes with imagery and typography, and makes unrelated projects feel the same.

Blockers:

- circular arcs over backgrounds
- faint orbital rings
- fake sonar/radar circles
- large cropped circles as cinematic filler
- glassy circular outlines behind UI
- circular motion-path lines with no function

Correction:
Remove the circular overlay. Use image composition, object-led layout, full-canvas typography, clean negative space, material surface, photographic atmosphere, color field, motion reveal, or a functional diagram only when the circle has meaning.

## Anti-Pattern: AI Ambient Light Blob

Description:
A UI adds a blurred radial light blob, foggy glow, soft spotlight smear, or vague haze to make the page feel cool, advanced, textured, or cinematic.

Detect:

- a central or corner glow with no visible light source
- a muddy fog spot sitting behind typography or illustration
- a blurred blob used as the main background event
- "advanced" atmosphere created by haze instead of composition, object, image, material, or motion
- the blob appears across unrelated products with no domain reason

Why bad:
It is a default AI-builder move. It makes the page look generated, hides weak composition, dirties contrast, and usually has no relationship to the product or scene.

Correction:
Remove the blob. Build atmosphere through a real product object, image environment, authored color field, material surface, functional lighting, typography composition, or meaningful motion. If lighting exists, document the source, direction, layer, and text-safety impact.

## Anti-Pattern: Decorative Dotted Background Texture

Description:
A page uses dotted, star-field, micro-dot, stipple, perforated, matrix, or grid-like background texture as generic atmosphere.

Detect:

- evenly repeated dots across a dark or gradient background
- dots used to make an empty surface feel technical or premium
- dot field has no data, grid, navigation, measurement, brand, or material meaning
- texture repeats across unrelated designs
- background pattern competes with typography or lowers perceived polish

Why bad:
The dotted field is another generated-app default. It reads like placeholder texture, not art direction, and often makes the UI feel amateur or noisy.

Correction:
Remove the dot texture. Use clean negative space, a real material texture, an image environment, a domain-specific pattern requested by Migi, or a functional grid/data layer only when it has a declared role and proof.

## Anti-Pattern: Amateur Illustration Text Collision

Description:
An illustration or vector form system looks childish, arbitrary, or unmodeled, and its lines, stems, arcs, masks, callouts, or shapes cross through readable words or clip text.

Detect:

- fake botanical/scientific plates, arbitrary leaves, childish stems, or unstable curves
- oversized vector paths with no role, layer, bounds, anchors, or responsive behavior
- callout lines, stems, arcs, masks, or shape edges crossing words
- labels clipped by the viewport, parent overflow, masks, or illustration layer
- decorative illustration dominates without a shape inventory or layer model
- typography is treated as scenery instead of protected content

Why bad:
Premium editorial illustration requires discipline. Amateur vector work makes the product feel childish, and text collisions destroy the user's ability to read the page.

Correction:
Use `vector-form-system-director` before implementation. Produce a shape inventory, role map, layer stack, geometry model, label-safe zones, callout routes, and responsive fallback. If the illustration cannot protect text, remove it.

## Anti-Pattern: Unreadable Navigation Over Background

Description:
Navigation floats over changing images, giant type, video, or dark/light transitions without contrast protection.

Why bad:
Navigation is only premium when it is usable. If labels disappear in one scroll state, the composition has failed.

Correction:
Use a designed readability strategy: safe zone, subtle surface, blur, scrim, adaptive inverse text, position shift, contextual nav zone, menu collapse, or non-overlapping placement. Verify scroll states.

## Anti-Pattern: Selected Hover Contrast Collapse

Description:
An interactive control is readable at rest, but a combined state makes the label vanish. The common failure is a selected nav item, tab, chip, segmented control, card, menu item, or button whose hover state changes the surface, opacity, blend mode, or inherited color until the selected label disappears.

Detect:

- selected + hover text becomes the same lightness or color family as the selected surface
- selected item looks like an empty pill or blank highlighted region on hover
- focus-visible or keyboard state reduces label contrast
- active/pressed state hides text behind opacity, blur, mask, or blend mode
- CSS tokens only define default, hover, and selected separately, with no combined selected+hover or selected+focus proof
- screenshot QA captures the resting state only and misses pointer/keyboard states

Why bad:
The selected state is supposed to tell the user where they are. If hover or focus makes the selected label disappear, the UI stops being navigable and the state system cannot be trusted.

Correction:
Define a State Contrast Matrix for every interactive control: default, hover, focus-visible, active/pressed, selected, selected+hover, selected+focus, and disabled. Use foreground/background token pairs that preserve readable contrast in every combined state. If a visual reward conflicts with legibility, change the reward, not the text.

## Anti-Pattern: Forced Brand Chrome

Description:
The UI adds logo marks, initials badges, app-name chips, wordmarks, or repeated product names because a template expects brand furniture.

Why bad:
Migi often wants the screen composition to carry identity. Forced top chrome wastes space, makes the product feel generic, and repeats the obvious name.

Correction:
Default to no forced logo/app-name chrome. Add it only when Migi requested it, the selected direction needs brand identity, the site is brand/portfolio-oriented, navigation clarity requires it, or the visual spec justifies it.

## Anti-Pattern: Decorative Hairline Filler

Description:
Tiny separator lines, red rules, label rails, and ornamental ticks are added near headings to make a design look editorial or technical.

Why rejected:

- AI filler
- no semantic value
- repetitive
- weakens composition
- looks like fake sophistication

Correction:
Use real hierarchy: stronger type, spacing, image crop, color field, meaningful layout boundary, or an editorial rule that aligns to the content system.

## Anti-Pattern: Overlapping Control Indicator

Description:
A button, chip, tab, segmented control, or mobile nav item has an underline, progress strip, active bar, highlight, or selection indicator that overlaps or cuts through the label/content.

Why rejected:

- looks broken
- reduces readability
- feels like a UI glitch
- makes selected state ambiguous
- common generated-app mistake

Correction:
Move the indicator below or outside the label area. Use active background, border, icon, color shift, or a separate progress area when the control cannot safely contain a bar/underline.

## Anti-Pattern: Add Card Masquerading As Content

Description:
The add-new affordance is styled almost exactly like existing content/list/object cards.

Why rejected:

- users may think it is an item
- weakens scanability
- creates accidental clicks
- makes product logic unclear
- common mobile/generated UI mistake

Correction:
Give add actions a clearly different affordance: plus icon, dashed action surface, distinct action color, floating action button, separate CTA row, or a dedicated empty-state/create module.

## Anti-Pattern: Full Page Before Illustration Proof

Description:
An illustration-heavy site is implemented as a full page before the hero illustration or custom SVG asset has passed an isolated review.

Why rejected:

- hides amateur drawing inside layout polish
- turns visual quality into a late-stage cleanup problem
- creates "requirements fulfilled" success without art direction
- makes the signature interaction depend on weak assets

Correction:
Run the Illustration-First Gate, create 1 to 3 isolated illustration assets, write the style guide and QA review, and stop until the asset passes or Migi explicitly approves continuing.

## Anti-Pattern: Ambient Background Blob

Description:
Large vague background blobs, ghost ellipses, radial glows, translucent ovals, fake lenses, dot/star fields, or decorative orbits are used as generic atmosphere.

Why rejected:

- reads as AI decoration
- competes with primary content
- has no object role or interaction purpose
- makes weak composition look busy instead of better

Correction:
Remove the blob. Use material-specific texture, photographic grain, scan texture, ink speckle, surface wear, or a purposeful object tied to the selected signature interaction.

## Anti-Pattern: Primitive Botanical Hero Art

Description:
Botanical or organic hero illustration is made from repeated ellipses, generic petals, flat doodle stems, copy-paste leaves, or scaled-up icons.

Why rejected:

- looks childlike
- fails premium/editorial standards
- cannot carry a hero or signature interaction
- lacks species-specific silhouette and believable structure

Correction:
Extract reference grammar, define species silhouette, linework, detail budget, material/texture strategy, and botanical label safe zones before drawing.
