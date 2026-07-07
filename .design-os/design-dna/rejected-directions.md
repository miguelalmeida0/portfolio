# Rejected Directions

Use this file as negative evidence. These directions were rejected for specific products and should prevent future agents from repeating the same mistakes. Do not globalize a rejected direction beyond its stated scope.

## Robot Skill Forge Meta-Lesson: Same Layout With New Paint

Robot Skill Forge showed that Codex agents tend to preserve existing structure and make "same layout with new paint" unless explicitly forced into art-direction mode. Future agents must not mistake implementation progress for design progress.

If Migi says a UI is realities away from the inspiration, stop polishing and rethink the visual concept. Do not keep the same structure and adjust color, glow, spacing, cards, borders, or motion.

Lovable-style visual output can beat Codex when the task is art direction first. Codex must compensate by doing a visual-concept phase before implementation. Text-only concepts are not enough. Do not build the app first. Build and screenshot the poster/composition first.

Correction:

- run Visual Concept Gate v2
- produce 3 radically different rendered art-direction prototypes
- screenshot each concept at 1440 / 768 / 390 for the gate to pass
- wait for Migi to approve one visual direction after seeing the previews
- build the visual shell before feature depth
- compare screenshots against the approved concept/reference
- add product logic only after the visual shell works

## System Rejected Direction: Text-Only Visual Concept Gate

Context:

The first Visual Concept Gate allowed agents to submit 3 written theses without showing rendered concepts. That made the workflow sound disciplined while still forcing Migi to choose art direction from words.

Rejected because:

- text does not show composition, scale, rhythm, object treatment, density, or mood
- agents can describe "art direction" while preserving a generic layout
- Migi cannot approve a visual direction he cannot see
- implementation can start before the visual idea has been proven on screen

New rule:

For visual-heavy work, exactly 3 rendered concept prototypes are required before implementation. Each concept needs a preview route and screenshots at 1440 / 768 / 390 for the gate to pass. No visual screenshots = Visual Concept Gate failed.

## System Rejected Direction: Product Thinking During Literal Copy

Context:

When Migi says `copy this exact UI`, `100% this design`, `literally what you see`, or `exact visual target`, the request is visual parity with the supplied target.

Rejected because:

- agents keep adding product logic, data panels, useful features, or design improvements
- agents reinterpret the visual target into a new product direction
- agents run the 3-concept gate even though Migi asked for exact copying
- agents explain or expand instead of reconstructing what is visible
- product usefulness overrides pixel-parity shell work

Correction:

- enter Literal Target Copy Mode immediately
- identify target screens
- reconstruct the visible composition
- exclude browser chrome, editor UI, and watermark artifacts
- build the static shell first
- implement only minimum visible interactions
- screenshot compare against the target
- report exact differences
- delay product logic until the pixel-parity shell is approved

Scope:

This overrides normal visual-heavy product thinking only when Migi explicitly asks for exact target copying. It does not permit copying old golden projects as a default design strategy.

## System Rejected Direction: Blogspot Landing Page

Context:

Migi's landing-page, creative, artistic, cinematic, editorial, and image-led references are visual statements. They are not requests for a normal content-template page with a prettier hero.

Rejected because:

- feels assembled instead of art-directed
- looks like a template, blog, or page-builder output
- becomes too explanatory
- is too grid-driven
- loses visual emotion after the hero
- ignores the artistic landing-page references
- uses images as decoration instead of the composition driver

Signs:

- repeated image-left/text-right blocks
- feature-card rows
- boxed proof sections
- heavy section stacking
- many equal cards
- normal SaaS homepage rhythm
- lots of copy explaining the product instead of making the product desirable
- hero feels artistic, but everything after it becomes generic

Correction:

- activate Landing Page / Artistic Mode
- use poster logic, not dashboard logic
- start from one dominant image or scene
- keep copy sparse and sharp
- use weaker or invisible grids when possible
- make image and typography carry identity
- continue the visual rhythm beyond the hero
- remove dashboard furniture, stats blocks, and repeated card rows unless the reference clearly earns them

Scope:

This applies when Migi asks for landing page, creative, artistic, cinematic, editorial, visual-heavy, image-led, landing-page inspiration, or creative inspiration. It does not ban structured product pages when the user explicitly asks for a conventional SaaS homepage or functional product surface.

## System Rejected Direction: Wrong Reference Folder Mode

Context:

Migi's visual-library folders are not interchangeable piles of nice screenshots. Each folder carries a different design mode.

Rejected because:

- command-center references become random card dashboards
- creative references become safe grids
- landing references become Blogspot/content-template pages
- mobile references become unusable Dribbble stills
- gallery references become boring equal-card catalogs
- all references are blended equally with no prioritization
- images are used as decoration instead of having a role

Correction:

- select the correct Reference Folder Mode before layout
- write `docs/design/reference-usage-report.md` before coding visual-heavy referenced work
- identify the strongest references and the weaker/irrelevant references
- declare every major image role
- name what will not be copied
- choose a layout recipe that matches the selected mode

Scope:

This applies whenever Migi points to a folder in `visual-library/approved/` or `visual-library/rejected/`. It does not override Literal Target Copy Mode when Migi explicitly requests exact visual parity.

## System Rejected Direction: Desktop Navigation Copied Onto Mobile

Context:

For applications with 3+ primary destinations, mobile navigation defaults to bottom navigation. Migi's preferred mobile interaction model reserves the top of the screen for branding, current page title, search, context, or hero imagery.

Rejected because:

- desktop navigation copied directly onto mobile wastes valuable vertical space
- top navigation fights thumb reach in app-like mobile products
- duplicated top and bottom navigation creates hierarchy confusion
- tiny icon bars, oversized bars, and generic Android-looking navigation feel unfinished
- poor safe-area handling breaks gesture navigation and premium feel

Signs:

- desktop top nav remains the primary mobile nav without justification
- top nav consumes the first mobile viewport in an app with multiple destinations
- bottom nav is cramped, oversized, poorly aligned, or generic
- labels are unreadable or icons carry too much unexplained meaning
- active state looks accidental
- top and bottom nav duplicate the same primary destinations

Correction:

- default to bottom navigation for mobile apps with 3+ primary destinations
- use generous touch targets, readable labels, excellent icon/text alignment, and safe-area support
- choose floating or integrated treatment based on the design direction
- reserve top mobile space for brand, page title, search, context, or hero imagery
- allow top navigation only for documentation sites, desktop-first enterprise tools, editor software, or scrolling-first websites

Scope:

This applies to mobile apps, mobile web apps, app-like dashboards, consumer product flows, onboarding/profile/search/home screens, and any responsive application with 3+ primary destinations. It does not ban top navigation for the listed exceptions.

## System Rejected Direction: Default Navbar Gravity

Description:

The agent keeps defaulting to the same safe top navigation structure regardless of concept: logo left, links center, CTA right, often inside a rounded pill, sticky black bar, or generic SaaS header.

Rejected because:

- makes every app feel the same
- breaks art direction
- looks like generated SaaS
- wastes the potential of creative, portfolio, landing, and image-led layouts
- ignores modern reference behavior
- makes even good pages feel templated
- turns navigation into pasted chrome instead of composition

Signs:

- same centered top nav appears across unrelated projects
- same rounded pill nav with different colors
- same logo-left links-center CTA-right structure
- sticky black bar used as a default
- nav competes with the hero instead of supporting it
- CTA placement feels generic or visually disconnected
- all 3 direction options use the same nav structure

Correction:

- create `docs/design/navigation-strategy.md`
- inspect reference navigation behavior
- propose 3 distinct navigation concepts before implementation
- select a pattern from `design-intelligence/navigation-patterns.json`
- document desktop, tablet, and mobile behavior
- design CTA/nav relationship, active states, focus states, and accessibility

Scope:

This applies to visual-heavy apps, landing pages, portfolios, creative/editorial sites, dashboards, mobile products, and redesigns. Functional top bars are allowed when justified by the product, but they are never the default art direction.

## System Rejected Direction: Generic Admin Dashboard

Context:

Migi's command-center/dashboard references are dense, expressive, image-aware, and composed. They are not requests for a normal admin template with darker paint.

Rejected because:

- feels like software default instead of a designed command surface
- treats the dashboard as a grid of interchangeable cards
- lacks a memorable focal object, scene, dominant chart, media block, or attraction zone
- uses metrics and labels without enough chart richness or operational context
- makes every panel the same visual weight
- has too much copy inside panels and not enough crafted hierarchy
- turns charts into decoration instead of decision support
- uses terminal-ish dark rectangles without premium visual material
- wastes desktop space with oversized empty cards, headings, padding, and chart shells

Signs:

- generic SaaS/admin layout with nav, title, metric cards, and a table
- same-weight widget field
- text-and-metrics-only dashboard
- oversized empty dashboard with low information density
- terminal-like dark panel spam
- no image, object, media, scene, avatar, map, or dominant chart anchor when references show one
- many boxes but little hierarchy
- chart widgets that do not support a visible decision
- all panels share the same size, radius, border, and internal rhythm
- no contrast between calm zones and busy zones

Correction:

- activate Command Center / Dashboard Mode
- define one attraction zone before arranging panels
- mix panel functions: metrics, charts, queues, lists/tables, status chips, avatars, media/image blocks, product/object visuals, action modules, and controls
- include useful chart forms such as lines, bars, rings, progress tracks, heatmaps, maps, funnels, timelines, sparklines, or score indicators
- vary panel scale, density, and visual weight
- use imagery or product/object visuals deliberately when the reference language supports it
- keep typography compact and controlled
- make charts part of the composition and the decision model

Scope:

This applies to dashboard folders, command-center references, dense data/productivity tools, Signal Desk-style command surfaces, and any future dashboard task using `visual-library/approved/inspiration/01-command-centers-dashboards/`. It does not ban simple dashboards when the user explicitly asks for a plain internal admin tool, but Migi's dashboard references require the stronger direction by default.

## System Rejected Direction: Service Floor Generic Card-Soup Regression

Context:

Service Floor was meant to be a desktop hospitality operations product. The floor map should have been the central command object. Instead, the result used random dark dashboard palette logic, generic cards, and navigation that changed active styling without changing visible content.

Rejected because:

- palette felt arbitrary for restaurant/service operations
- floor-plan cards overlapped spatial labels and server names
- nav/tabs changed selected state but not visible content
- support panels competed with or buried the floor map
- the product regressed into dark dashboard/card soup instead of premium hospitality command surface

Signs:

- map/floor plan is treated as one generic panel
- section labels are covered by table cards or glows
- tabs like Kitchen/Reservations/Sections do not change content
- colors feel like imported dashboard theme rather than domain-fit hospitality operations
- panels support visual filling more than service decisions

Correction:

- define Domain Palette Fit before tokens
- make the floor map or spatial command object central
- create spatial label safe zones before placing objects
- make navigation change route, content, data scope, or mode
- use panels as inspector, queue, control, and metric surfaces around the primary object

Scope:

This applies to desktop product surfaces, command centers, maps, floor plans, seating charts, timelines, route boards, operational canvases, and any product where a central object should drive the UI.

## System Rejected Direction: Murky Monochrome Dashboard

Description:

A dashboard where the entire interface is one dark muddy color system with one overused neon/accent color.

Rejected because:

- feels lifeless
- feels terminal-generated
- lacks product identity
- makes every panel feel the same
- loses the richness of reference dashboards
- makes the accent color meaningless

Correction:

Use reference-based palette range, material contrast, controlled accents, state colors, and surfaces with distinct roles: base, raised panel, quiet panel, active panel, image/media panel, and data panel.

## System Rejected Direction: Terminal Green Panel Spam

Description:

Dark cockpit UI where everything becomes green/black panels and neon accents.

Rejected because:

- mistakes terminal styling for dashboard sophistication
- makes the surface feel murky and lifeless
- flattens chart, action, and media hierarchy into the same color language
- overuses lime/green until state and emphasis disappear

Correction:

Use dark palettes only when the references and product justify them. Add material range, controlled accent use, chart variety, and image/object/media anchors.

## System Rejected Direction: Lifeless Dashboard

Description:

A technically functional dashboard with no visual energy, no attraction zone, weak charts, no image/object/media use, and no memorable composition.

Rejected because:

- may be usable but is not award-level
- feels like operational furniture
- fails Migi's dashboard-reference taste test
- lacks a designed reason to remember the screen

Correction:

Add a clear attraction zone, graph-rich data layer, palette discipline, mixed material system, and live/state energy when the product represents activity or monitoring.

## System Rejected Direction: Single-Accent Overuse

Description:

The same accent color is applied to labels, borders, charts, buttons, icons, statuses, glows, and active surfaces until hierarchy disappears.

Rejected because:

- makes the accent meaningless
- weakens state communication
- creates a one-note dashboard
- often causes the murky neon cockpit failure

Correction:

Use accent color selectively for active state, primary action, selected data, or critical status. Support other states with a disciplined state-color system.

## System Rejected Direction: Safe AI Palette Default

Description:

A generated UI palette that uses the same muddy dark brown, charcoal, beige, grey-blue, orange accent, or purple-glow defaults seen in countless AI-generated apps.

Rejected because:

- feels machine-made
- lacks identity
- weakens art direction
- makes creative pages feel generic
- hides behind "premium" while actually being dull
- wastes the opportunity for memorable color

Signs:

- muddy brown/black generated-app background
- generic charcoal plus orange
- generic blue-grey SaaS
- AI purple/blue glow
- washed-out beige premium cliche
- green terminal palette
- neon lime tech palette
- safe neutral surfaces with one predictable accent
- dull gradients that feel like AI filler

## Rejected: Sepia Archive Brown Surface Wash

Description:
A design uses muddy sepia, espresso, umber, tobacco, parchment, or brown-black archive surfaces for pages, hero stages, cards, panels, containers, sidebars, nav, or framed objects.

Why rejected:

- Migi explicitly rejected this exact generated-app palette family
- it keeps returning across unrelated projects
- it makes the UI feel stale, dirty, and machine-generated
- it hides behind "archive", "nocturne", "field guide", "botanical", "brass", "vintage", or "premium" language
- it weakens otherwise strong typography, composition, and interaction ideas

Correction:
Remove the brown-black archive wash entirely from major surfaces. Replace it with a concept-specific palette such as ink blue, aubergine-black, deep green-black, mineral grey, true black/cream, cold moonlit blue, oxidized red, chrome blue, or another reference-driven contrast-tested system.

Correction:

Create a palette from the concept, imagery, references, and mood. Explore bolder and more specific color systems while preserving readability and contrast.

Scope:

This applies especially to artistic, cinematic, landing, portfolio, creative, editorial, and experimental interfaces. It does not require every UI to become loud; it requires color to be deliberate when the mode supports it.

## System Rejected Direction: Decorative Chart Wallpaper

Description:

A large chart-like visual that looks cool but does not clearly help the user understand state, priority, comparison, or change.

Rejected because:

- wastes dashboard space
- feels fake
- creates the illusion of intelligence
- does not support action

Correction:

Use charts that clearly encode product state and help the operator decide what to do next. If a chart cannot explain its job, replace it with a useful visualization.

## System Rejected Direction: Chart-Lite Dashboard

Description:

Dashboard mode with too few meaningful charts or visualizations despite graph-rich references.

Rejected because:

- underuses the dashboard folder's strongest visual language
- makes dense tools feel flat and text-heavy
- misses the opportunity to show change, comparison, priority, freshness, and progress

Correction:

Consider at least two distinct chart or data-visualization types, including one major chart/map/matrix/timeline and supporting microcharts or score visuals.

## System Rejected Direction: Image-Starved Dashboard

Description:

A dashboard that uses only text, metrics, and abstract panels even though the reference folder shows meaningful imagery, object visuals, media tiles, avatar/content systems, or scene previews.

Rejected because:

- feels dry
- lacks visual memory
- underuses reference evidence
- becomes functional but forgettable

Correction:

Add purposeful image/object/media use when product context supports it: attraction zone, proof object, user/entity context, media/content preview, product object, status visualization, live tile, or scene mini-map.

## System Rejected Direction: Fake Live / Session Status Slop

Description:

Random `live`, `session-only`, glowing dots, fake monitoring chips, or system-status badges that exist only to make the UI look technical.

Migi strongly rejects this.

Rejected because:

- pure AI slop
- creates a fake sense of intelligence
- wastes attention
- often has no clear user meaning
- looks like generated product theater
- implies backend, telemetry, freshness, or monitoring that may not exist

Forbidden examples:

- `SESSION-ONLY` chips with no user value
- random green live dots
- fake `10 live`
- status pills that imply backend/live monitoring when the app is local/static
- decorative telemetry indicators
- vague local/session labels that do not explain behavior

Allowed only if:

- the product truly has live state
- the label is understandable
- the user knows why it matters
- it changes behavior or decision-making

Correction:

Remove fake status theater. If state matters, label it truthfully in user language and tie it to a visible behavior, timestamp, source, freshness rule, persistence rule, or decision.

Scope:

This applies globally, but it is especially important in dashboards and command centers where fake telemetry can make unfinished work look falsely intelligent.

## System Rejected Direction: Layout Integrity Failure

Description:

A UI where content visibly breaks out of its intended structure: text escapes containers, chart bars run into neighboring cards, titles are clipped, badges overlap, labels collapse into nonsense, or the layout only works at one default viewport.

Rejected because:

- looks junior before taste is even discussed
- breaks trust instantly
- proves the screen was not tested at real viewport sizes
- destroys scanability and dashboard usefulness
- cannot be award-level

Signs:

- body text escaping card boundaries
- card titles cut off at the top or sides
- chart bars, lines, points, axes, or labels running outside their plot/card area
- stat bars crossing borders
- image badges or pills overlapping
- containers becoming too thin to read
- labels collapsing into `C`, `U`, `?`, or other meaningless fragments
- nav becoming oversized, cryptic, or overlapping on resize
- form fields or buttons clipped by their container

Correction:

- define a Layout Integrity Contract before implementation
- test 1440, 1280, 1024, 768, and 390
- use `minmax(0, 1fr)`, min-width rules, `flex-wrap`, max-widths, line clamps, container-aware breakpoints, and responsive grid collapse
- clip charts to explicit plot bounds with label-aware margins
- change chart type, panel presentation, or metadata visibility at smaller widths
- stack, collapse, or convert cards to rows/lists/accordions when width is insufficient

Scope:

This applies globally to every app type. It is P0 for dashboards because dense surfaces expose layout failure faster.

## System Rejected Direction: AI Scale Inflation

Description:

A UI where everything is oversized: huge text, huge image blocks, huge cards, huge empty containers, and low information density.

Rejected because:

- feels like generic AI builder output
- lacks refinement
- wastes the desktop viewport
- hides useful content below the fold
- makes the user feel attacked by giant objects
- mistakes "premium" for "oversized"
- fails to match real reference density

Signs:

- one headline consumes half the screen without enough visual payoff
- only 1-2 meaningful things visible on desktop
- giant cards with little content inside
- huge image blocks used as filler
- excessive vertical spacing
- buttons and labels scaled like hero elements
- below-the-fold content starts too late
- desktop page feels like a mobile layout blown up

Correction:

- perform a Scale Calibration Pass against the selected reference folder
- reduce inflated elements
- increase meaningful visible content
- introduce smaller supporting type
- tighten containers to content
- match the density and rhythm of the chosen reference folder

Scope:

This applies globally to every visual-library folder and every design mode. Large type is allowed only when justified by the reference and balanced by composition, imagery, and supporting content density.

## System Rejected Direction: Unreadable Artistic Overlay

Description:

A visual-heavy UI where text is placed over images without enough contrast protection.

Rejected because:

- looks amateur despite good imagery
- fails accessibility and polish
- makes the page feel uncontrolled
- breaks trust immediately
- elite apps do not make users fight to read

Signs:

- white text over pale image areas
- small labels over photo texture
- body copy over gradients with uneven contrast
- focal object and text competing in the same area
- text readable on desktop but failing on tablet/mobile crop
- image overlays inconsistent between cards or sections

Correction:

- define a Contrast / Legibility Strategy before implementation
- place text in a safe zone or outside the image
- use a deliberate scrim, plate, vignette, mask, or crop
- protect focal objects from overlays
- verify text over images at 1440 / 768 / 390

Scope:

This applies globally to every visual-library folder and every design mode. Artistic style never excuses unreadable text.

## System Rejected Direction: Image Trapped In The Grid

Description:

The agent uses powerful image references but implements the image as a square or rectangular block inside a conventional layout.

Rejected because:

- loses the emotional power of the reference
- makes the page feel assembled
- turns art direction into content placement
- creates generic two-column or card-grid structure
- fails to produce a poster/editorial feeling
- makes imagery feel decorative instead of structural

Signs:

- image appears as a bordered rectangle
- image sits beside text in a normal grid
- image cards repeat with equal weight
- hero image is large but still boxed
- background image potential is ignored
- page feels like components placed on top of black background

Correction:

- define Image Environment Strategy before layout
- start from the scene when the reference uses one
- use full-bleed, oversized, masked, layered, or composition-driving image treatment
- place text in safe zones with contrast protection
- remove obvious borders/card wrappers unless the reference explicitly earns them

Scope:

This applies when artistic, landing-page, cinematic, editorial, or image-led references use dominant background scenes or immersive imagery. It does not ban image cards when the reference is explicitly card/gallery/product-listing based.

## Robot Skill Forge v4: Obvious AI Robot App / Overlapping Character Cards

Context:

Robot Skill Forge was redesigned into a dark "choose your fighter" robot roster. The direction improved energy compared to the beige catalog version, but it still failed because it used the obvious robot-app visual route and introduced unacceptable overlapping/clutter.

Rejected because:

- UI elements overlap or sit on top of each other
- overlapping text, badges, stats, or controls is absolutely unacceptable
- the card system feels cluttered
- the design feels like an obvious AI-generated "cool robot app"
- it looks like a first Lovable/Emergent result after prompting "make a cool robot app"
- it follows the predictable robot theme route: dark background, glowing cards, badges, stats, fighter language
- it feels like generic AI slop dressed as excitement
- it lacks true out-of-the-box product/design thinking
- it mistakes theme decoration for product concept
- the interface is visually busy before it is emotionally compelling
- the cards try to create excitement through cliches instead of desire

Durable design lesson:

When the product has an obvious theme, future agents must not choose the most predictable visual language for that theme. Robotics does not automatically mean dark cyber UI, neon glows, badge soup, grids, stats, and "fighter" language. A strong frontend agent must reinterpret the theme through a fresh visual metaphor.

New global rule:

Do not take the obvious aesthetic route just because the app concept suggests it. First define a non-obvious design thesis.

New selection-first rule:

For gallery/roster/selection products, excitement must come from desire, composition, personality, and interaction reward -- not from badge overload, dark theme cliches, or decorative "cool" effects.

New layout rule:

Overlapping UI is a hard fail unless deliberately designed, readable, responsive-tested, and necessary. Text, badges, controls, and stats must not collide. Every card needs clear content zones and responsive proof.

Future agents must:

- define a non-obvious visual thesis before picking palette, language, or effects
- reject the first predictable genre treatment for strong themes
- make selection objects desirable through composition, personality, and interaction reward
- use fewer card elements with stronger intent
- reserve badges/stats for clear information architecture, not excitement filler
- test cards at 390 / 768 / 1440 before accepting the layout
- treat accidental overlap as a blocker, not a polish issue

Avoid:

- obvious robot-app cyber styling
- neon/glow/badge/stat overload
- "fighter" language unless the product concept truly earns it
- dark cards as the default robotics answer
- prompt-generated genre defaults
- clutter presented as energy
- overlapping labels, controls, text, or stats

Scope:

This applies globally as an anti-obvious-theme rule, and specifically to selection-first products where excitement must come from object desire rather than cliche decoration. It does not mean every app must avoid dark palettes or badges; it means those choices must be earned by a non-obvious design thesis and clean layout proof.

## Robot Skill Forge v2: Beige Catalog / No Character-Select Energy

Context:

Robot Skill Forge should feel like a premium robot character-selection experience: Pinterest robot gallery plus collectible card roster plus game character select. The rejected redesign became clean but boring.

Rejected because:

- too calm
- too beige
- too polite
- feels like a catalog, not a game roster
- robot cards do not feel collectible
- zero excitement
- zero "choose your character" energy
- detail page feels like a product brochure
- skill cards are clean but boring
- the app does not create desire to click robots
- there is no visual reward when selecting a robot
- no sense of rarity, class, power, or personality
- no playful interaction layer
- no dramatic selected state
- no game page energy
- too much whitespace without emotional payoff
- cards feel like product listings instead of characters
- the first screen does not create a "which one do I pick?" moment

Design lesson:

For apps where the core experience is selection, discovery, gallery, roster, browsing, or collecting, the first screen must create desire. It should not merely organize information cleanly.

New rule:

A selection-first app must make the selectable objects feel desirable, distinct, and rewarding to choose.

For Robot Skill Forge specifically:

The first screen is not an information page. It is a character-select moment.

Future agents must:

- make the first screen feel like choosing a character
- use collectible card energy
- make robot cards visually distinct
- create stronger robot personality per card
- use class, tier, rarity, vibe, power, or role labels
- use bigger image-led cards
- make hover and selected states feel rewarding
- use progressive disclosure: excitement first, details second
- hide dense technical analysis until after selection
- make the selected robot feel like "I picked this one"
- make the detail view feel like a forge/loadout screen, not a brochure
- create playful but premium interaction, not childish UI

Avoid:

- beige catalog pages
- product brochure detail pages
- boring clean card grids
- tiny stat rows as the main excitement
- passive cards with no emotional reward
- flat selected states
- over-politeness
- excessive calmness when the product needs energy
- treating character/robot selection like a SaaS settings page

Scope:

This is not a universal rule that every app must look like a game. It applies when the app's core experience is selection, browsing, collecting, gallery exploration, character choice, or object discovery.

## Robot Skill Forge v1: Terminal / Newspaper / AI-Slop Direction

Context:

Robot Skill Forge also rejected an earlier dense robotics-terminal/newsprint direction.

Rejected because:

- too much information visible immediately
- looks like a newspaper or dense terminal
- too many panels and containers
- top header has too many tags
- crossed-line or grid background texture feels like AI slop
- dark robotics terminal palette feels ugly and generic
- too many stats, badges, meters, tabs, and labels before the user chooses anything
- no emotional "choose your robot" moment
- concept became a dashboard instead of a fun robot-card experience

Design lesson:

When selection is the core loop, do not front-load analysis, stats, meters, dense labels, or terminal atmosphere before the user wants to pick something. Desire comes before diagnostics.

Avoid for selection-first products:

- newspaper layouts
- dense terminal panels
- generic dark robotics palettes
- crossed grid textures as atmosphere
- dashboards before selection
- stats/badges/tabs as the first emotional hook

## Rejected: Token Advanced Motion

Description:
The user asks for advanced, cinematic, artistic, Awwwards/Godly/Recent-level, scroll, or portfolio motion, but the agent ships one animation: a drifting background, a repeated fade-up, a hover scale, or a generic reveal.

Why rejected:

- fails the reference quality bar
- treats motion as decoration instead of choreography
- has no story arc or section handoff
- ignores image/media, typography, navigation/menu, and micro-feedback layers
- cannot be benchmarked against elite animated sites

Correction:
Create `docs/design/motion-choreography-plan.md`, name the techniques, map every section, define tool stack and reduced motion, then capture a scroll-state sequence or document the blocker.

## Rejected: Text-Only Direction Gate

Description:
The agent offers three vague written design directions for a new visual-heavy app, landing page, portfolio, mobile app, dashboard redesign, or creative interface, then starts coding without layout maps, product-object decisions, interaction promises, or risk checks.

Why rejected:

- does not behave like a serious direction selection process
- leaves too much room for generic UI defaults
- makes Migi approve vibes instead of buildable art direction
- fails to expose palette, composition, typography, imagery, nav, and motion tradeoffs early

Correction:
Create 3 no-image direction cards with compact layout maps, primary product object, domain palette rationale, navigation model, interaction promises, implementation complexity, and recommendation score. Stop for Migi selection before implementation.

## Rejected: Decorative Orbital HUD Overlay

Description:
A design uses large faint circular arcs, radar rings, sonar circles, orbit paths, target graphics, or HUD-style circle overlays as visual atmosphere.

Why rejected:

- generic AI design tell
- fake technical depth
- no semantic value
- repeated across unrelated projects
- competes with real imagery
- makes the design feel templated

Correction:
Remove the circular overlay. Replace it with a stronger image crop, typography composition, color field, material texture, motion reveal, or functional diagram only if needed. Functional circular charts, progress rings, orbital selectors, diagrams, or maps are allowed only when they carry meaning and are documented in the visual spec.

## Rejected: Unreadable Floating Navigation

Description:
Navigation sits over large typography, image backgrounds, video, or changing scroll states without a readability strategy.

Why rejected:

- users cannot reliably read or use the nav
- contrast depends on a lucky scroll position or image crop
- nav fights with hero typography or photography
- creative placement becomes visual failure instead of art direction

Correction:
Give navigation a designed protection strategy: safe placement, subtle scrim, translucent surface, backdrop blur, adaptive inverse text, position shift, contextual collapse, or non-overlapping zone. Check it at multiple scroll positions.

## Rejected: Forced App Name / Logo Chrome

Description:
The UI adds initials bubbles, fake logo marks, app-name chips, wordmarks, startup lockups, or repeated product names at the top because the template expects brand chrome.

Why rejected:

- Migi rarely wants visible app-name chrome by default
- identity can live in the main composition instead of persistent UI furniture
- logo-left nav is a habit, not a design decision
- repeated app names waste premium screen space

Correction:
Remove default app-name/logo chrome unless Migi explicitly requested it, the selected direction requires brand identity, it is a portfolio/agency/brand site, it is needed for navigation clarity, or the visual spec justifies it.

## Rejected: Decorative Separator Ornaments

Description:
Tiny separator lines, red hairlines, label rails, corner ticks, and ornamental horizontal rules appear above or near headings to make a design feel editorial, technical, or premium.

Why rejected:

- common AI-generated UI tell
- fake sophistication
- no semantic value
- repetitive across pages
- weakens composition and hierarchy

Correction:
Use typography hierarchy, spacing, image crop, color field, real layout boundaries, section rhythm, or a meaningful editorial rule. Decorative line fragments must be removed unless they separate real content and align to a documented system.
