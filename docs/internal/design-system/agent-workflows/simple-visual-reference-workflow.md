# Simple Visual Reference Workflow

Use this for future frontend/design work when Migi wants the Design OS to guide taste without running a frontend Studio app.

## Workflow

1. Read `AGENTS.md`.
2. Read `design-dna/00_COMPACT_AGENT_CONTEXT.md`.
3. Check `visual-library/approved/` for relevant approved references.
4. Check `visual-library/rejected/` for relevant anti-patterns.
5. If Migi points to a visual-library folder, select the correct Reference Folder Mode:
   - `01-command-centers-dashboards`: Command Center / Dashboard Mode
   - `02-creative-experimental-ui`: Artistic / Creative Mode
   - `03-mobile-consumer-apps` or `mobile-apps`: Mobile Product Flow Mode
   - `04-selection-gallery-browse`: Selection / Gallery / Browse Mode
   - `05-landing-hero-pages`: Landing Page / Poster Mode
6. If Migi asks to use the folder/screenshots as the design basis, activate Reference-Locked Build Mode:
   - select 3-5 exact reference anchors
   - assign each anchor a role: composition, palette/material, graph/component, image/object/media, or responsive/layout
   - create `docs/design/reference-decomposition.md`
   - create `docs/design/design-transfer-spec.md`
   - implement only from the transfer spec
   - create `docs/qa/reference-match-report.md` before final handoff
7. If this is a new visual-heavy app, landing page, portfolio, mobile app, dashboard redesign, or artistic interface and the visual direction is not already approved, create `docs/design/direction-options.md` before implementation and stop for Migi to choose:
   - Direction A - Safe Refined
   - Direction B - Artistic Expressive
   - Direction C - Unexpected High-Character
   Each direction must include visual thesis, mood, palette, typography, layout/composition, image/media strategy, motion strategy, mobile strategy, risks, and the AI default it avoids.
8. After Migi chooses A, B, C, or a hybrid, create `docs/design/selected-direction.md` before visual spec or implementation. If no selection exists, do not code.
9. For visual-heavy work using visual-library references, create `docs/design/reference-usage-report.md` before coding. Include references inspected, folder mode selected, selected reference anchors and roles when Reference-Locked Build Mode is active, extracted principles, what will not be copied, visual thesis, layout strategy, image role strategy, Image Environment Strategy, Scale Calibration, Contrast / Legibility Strategy, Navigation Strategy, Toolbar Alignment Strategy, Text Density Strategy, Button Proportion Strategy, Responsive Collision Checks, Layout Integrity Contract, Responsive Breakpoint Proof, Palette Direction, and anti-patterns avoided.
   - For `01-command-centers-dashboards`, also include Dashboard Command-Surface Strategy: attraction zone, panel mix, chart forms and purpose, image/object/media role, utility-heavy zone, queue/list/activity zone, control/action zone, calm zones, busy zones, and how the design avoids same-weight card soup.
   - Also include Dashboard Palette Strategy, Graph System Strategy, and Image / Object / Media Strategy. Name the palette failure to avoid, the major/supporting chart system, and the visual/object/media anchor.
10. For the current task, extract relevant principles:
   - composition
   - focal object
   - density
   - interaction model
   - what to avoid
11. Declare the role of every major image: hero scene, focal object, proof object, background atmosphere, editorial fragment, selection thumbnail, or texture/material layer.
12. If real imagery is needed, route `skills/unsplash-asset-sourcing/SKILL.md` and create `docs/design/unsplash-search-plan.md` plus `docs/design/unsplash-asset-manifest.md` before implementation:
   - define image roles
   - search by role, orientation, optional color filter, content filter, and order
   - reject generic stock filler
   - document source/photographer/download metadata
   - verify crop strategy, palette relationship, alt text, and text safe zones
   - do not use stock imagery as factual product proof
13. Run an Image Environment Pass for artistic, landing-page, cinematic, editorial, image-led, or visual-heavy references:
   - decide whether the reference uses image as environment or asset
   - if the image is environment, compose around the scene before choosing a grid
   - consider full-bleed, oversized, masked, layered, edge-to-edge, or backdrop treatment
   - state why the image should or should not be boxed
   - plan focal object protection and text safe zones
   - avoid image-trapped-in-grid unless the reference explicitly uses that structure
14. Run a Scale Calibration Pass against the selected references:
   - estimate visible content objects above the fold
   - compare largest text, medium text, and small labels
   - compare container/card density
   - compare image scale roles
   - avoid giant empty furniture and inflated desktop layouts
15. Run a Contrast / Legibility Pass:
   - identify every important text background
   - protect text over imagery with a safe zone, scrim, plate, mask, vignette, crop, or separation outside the image
   - keep small labels, nav, and CTAs readable
   - protect faces, eyes, hands, and focal objects from copy overlays
   - verify responsive crops at 1440 / 768 / 390
16. Run an Art-Directed Palette Exploration Pass for artistic, cinematic, landing, portfolio, creative, editorial, or experimental work:
   - propose Safe Refined, Artistic Expressive, and Unexpected High-Character palette directions
   - document base colors, accent logic, image compatibility, mood, contrast risk, concept fit, and AI-default palette avoided
   - select one palette deliberately instead of defaulting to muddy brown, generic charcoal/orange, AI purple glow, beige premium, terminal green, neon lime, or blue-grey SaaS
   - use OKLCH/APCA or equivalent contrast logic before locking tokens
17. Run a Navigation Art-Direction Pass:
   - create `docs/design/navigation-strategy.md`
   - inspect reference navigation placement, wordmark behavior, CTA behavior, and mobile implications
   - propose Functional Refined, Art-Directed, and Unexpected High-Character nav concepts
   - select a navigation pattern from `design-intelligence/navigation-patterns.json`
   - define desktop, tablet, and mobile behavior
   - make CTA/nav relationship intentional
   - define active and focus states
   - avoid default logo-left links-center CTA-right, sticky pill nav, sticky black bar, and mobile top link dumps unless justified
18. Run a Global UI Craft Pass:
   - navigation labels are understandable, not cryptic abbreviations
   - responsive nav behavior is designed for desktop, tablet, and mobile
   - search, filters, and action buttons align in one toolbar system
   - panels are scan-first and do not become prose boxes
   - buttons are proportionate; full-width desktop actions need justification
   - 1440 / 1280 / 1024 / 768 / 390 collision risks are named and prevented
   - palette feels human/reference-driven, not terminal-green, AI-purple, neon-lime, generic blue/grey, or one machine-generated wash
   - live/session/status chips are real, understandable, and decision-relevant, or removed
19. Run a P0 Layout Integrity Pass:
   - text stays inside containers
   - card titles are not clipped
   - charts stay inside plot/card bounds
   - cards do not shrink below readable width
   - chips, pills, and image badges do not overlap
   - labels stay semantic and do not collapse into meaningless fragments
   - forms and buttons remain readable
   - layout adapts instead of squeezing
   - 1440 / 1280 / 1024 / 768 / 390 are covered in the plan
20. If the task says landing page, creative, artistic, cinematic, editorial, visual-heavy, image-led, landing-page inspiration, or creative inspiration, activate Landing Page / Artistic Mode:
   - poster logic, not dashboard logic
   - image-first, not section-first
   - composition-led, not component-led
   - sparse copy, not explanatory blocks
   - no dashboard furniture, feature-card rows, boxed proof sections, or Blogspot/content-template structure
   - visual mood continues after the hero
21. If the task uses dashboard or command-center references, activate Image-Aware Dashboard Mode:
   - one attraction zone before arranging panels
   - graph-rich useful visualization, not decorative charts
   - at least two visualization types considered when data supports it
   - reference-driven palette, no murky monochrome / terminal-green default
   - accent color used selectively, not everywhere
   - mixed panel roles: metrics, charts, queues/lists, activity, imagery/content, controls, actions
   - deliberate image/object/media use when it improves hierarchy or memorability
   - mixed materials: base, raised, quiet, active, image/media, and data surfaces
   - live/state energy when the product represents monitoring, freshness, or activity
   - compact controlled type and container scale
   - varied panel weights with calm/busy rhythm
   - readable nav and crafted responsive navigation
   - aligned search/filter/action toolbar
   - scan-first panels, not text-heavy prose boxes
   - proportionate buttons
   - collision-free resizing
   - chart bounds discipline
   - tablet column reduction and mobile prioritized sections
   - no squeezed card garbage or semantic label collapse
   - no fake live/session/status theater
   - no generic admin template, same-weight card soup, murky same-color panels, terminal-ish dark panel spam, decorative charts, image-starved surfaces, or text-and-metrics-only dashboard
22. If the UI includes charts, analytics, BI, monitoring, forecasting, maps, funnels, networks, or graph-rich dashboard work, route `skills/data-visualization-selection/SKILL.md`:
   - create `docs/design/chart-selection-report.md`
   - choose chart type from data shape and user decision
   - define accessibility fallback and chart bounds
   - reject decorative chart wallpaper
23. If the task needs a style family or taxonomy-driven visual direction, route `skills/visual-style-selection/SKILL.md`:
   - create `docs/design/visual-style-selection-report.md`
   - select one primary style family and at most one supporting treatment
   - define tokens, effects, motion, accessibility, performance, and mobile fit
   - reject random style mixing
24. If the task is a premium website, landing page, hero, marketing site, product page, editorial/portfolio page, or website image-to-code task, route `skills/image-first-website-to-code/SKILL.md`:
   - create `docs/design/image-first-website-analysis.md`
   - generate or select section-specific references first when available
   - for generated landing references, use one horizontal image per section
   - reject unreadable compressed multi-section boards
   - define section job, composition anchor, background mode, CTA variation, and image role
   - analyze text, typography, spacing, buttons, colors, imagery, and rhythm
   - implement as a faithful translation
25. For landing, portfolio, marketing, and redesign work, route `skills/anti-ai-tell-preflight/SKILL.md` before final handoff:
   - zero visible em-dashes
   - no fake div screenshots
   - no duplicate CTA intent
   - no generic section repetition
   - no hero clutter
26. Produce a clear design direction before implementation.
27. Implement only after the direction is selected and documented.
28. Capture screenshot QA before claiming done.

## Literal Copy Exception

If Migi says `copy this exact UI`, `100% this design`, `literally what you see`, or `exact visual target`, use Literal Target Copy Mode. In that mode, copy the supplied target's visible composition and exclude browser chrome, editor UI, watermarks, and tooling artifacts.

## Principle Extraction

When Migi says a screenshot is inspiration, do not clone it exactly. Extract principles and apply them to the current product.

When Migi says a screenshot is rejected, do not preserve its layout with new paint. Name the failure and avoid it.
