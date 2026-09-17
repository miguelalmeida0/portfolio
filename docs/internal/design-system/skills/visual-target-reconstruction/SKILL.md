# visual-target-reconstruction

## Name

visual-target-reconstruction

## Description

Use a screenshot, Lovable prototype, Pinterest image, mockup, or strong visual reference as art-direction evidence without flattening it into shallow style tokens.

If Migi asks for an exact copy, this skill enters Literal Target Copy Mode instead of art-direction translation.

## Use When

- Migi provides a screenshot, mockup, prototype, Pinterest image, Lovable output, inspiration image, or strong visual target.
- A design must be compared against a reference.
- The current UI is described as far from the inspiration.
- Migi points to a visual-library reference folder.
- Migi asks for landing-page, creative, artistic, cinematic, editorial, visual-heavy, or image-led work from visual references.
- Migi says `copy this exact UI`, `100% this design`, `literally what you see`, or `exact visual target`.

## Do Not Use When

- No visual reference exists.
- The task is backend-only or copy-only.
- The reference is only a loose mood note and Migi asks not to follow it closely.

## Required Inputs

- Reference image, screenshot, URL, or description.
- Reference folder path and selected Reference Folder Mode when using visual-library folders.
- `docs/design/reference-usage-report.md` for visual-heavy work using visual-library references.
- `docs/design/direction-options.md` and `docs/design/selected-direction.md` for new visual-heavy work when Literal Target Copy Mode is not active and no visual direction is already approved.
- Reference-Locked Build Mode artifacts when a visual-library folder or screenshot set is the design basis: selected anchors, anchor roles, `docs/design/reference-decomposition.md`, `docs/design/design-transfer-spec.md`, and final `docs/qa/reference-match-report.md`.
- Dashboard Command-Surface Strategy when Command Center / Dashboard Mode is selected.
- Dashboard Palette Strategy, Graph System Strategy, and Image / Object / Media Strategy when Command Center / Dashboard Mode is selected.
- Image Environment Strategy when image-led, artistic, landing-page, cinematic, or visual-heavy references are used.
- Unsplash search plan and asset manifest when real imagery or Unsplash assets are selected for reconstruction/translation.
- Scale Calibration section when visual-library references are used.
- Contrast / Legibility Strategy when image-led or visual-library references are used.
- Palette Exploration for artistic, cinematic, landing, portfolio, creative, editorial, or experimental reference work.
- Navigation Strategy, Toolbar Alignment Strategy, Text Density Strategy, Button Proportion Strategy, Responsive Collision Checks, and Palette Direction for dashboard or visual-heavy work.
- Navigation Readability Strategy when nav overlays images, giant type, video, or changing backgrounds.
- Identity / Brand Chrome Decision for visible logo, app name, initials, or wordmark chrome.
- Decorative Geometry Strategy and Line / Divider Strategy for orbital/radar/HUD circles and hairline/separator systems.
- Layout Integrity Contract and Responsive Breakpoint Proof at 1440, 1280, 1024, 768, and 390 for visual-heavy work.
- Current product type.
- Primary object and primary action.
- Current UI screenshots, if available.
- Implementation constraints.
- Inspiration manifest when target/inspiration research is used.
- Done report artifact before final handoff.
- Target-copy report for Literal Target Copy Mode.
- Asset manifest for production image-led reconstruction.
- Product purpose clarity for new/dogfood apps.
- Core loop proof when the visual target supports an upload/classify/generate or equivalent product promise.
- Persistence truth when uploaded or user-generated data is shown.

## Files To Read

- `design-dna/00_COMPACT_AGENT_CONTEXT.md`
- `design-dna/new-app-generation-rules.md`
- `agent-workflows/visual-target-reconstruction-mode.md`
- `agent-workflows/image-first-frontend-workflow.md` for image-led landing/portfolio/marketing work
- `design-dna/art-directed-palette-exploration.md` for artistic, cinematic, landing, portfolio, creative, editorial, or experimental reference work
- `design-dna/unsplash-asset-sourcing-rules.md` when real imagery or Unsplash assets are needed
- `design-dna/landing-page-craft-rules.md` for landing/portfolio/marketing references
- `design-dna/anti-ai-tell-preflight.md` for landing/portfolio/marketing references
- `evaluation/ui-scorecard.md`
- `docs/inspiration-analysis.md` if it exists for the project

## Workflow

### Literal Target Copy Mode Override

When Migi says `copy this exact UI`, `100% this design`, `literally what you see`, or `exact visual target`, stop all product reasoning. Do not run the 3-concept gate, invent new art direction, expand features, run a usefulness pass, add panels, add explanations, improve, or reinterpret.

The only goal is visual parity with the supplied target.

Required sequence:

1. Identify the target screens.
2. Reconstruct the visible composition.
3. Exclude browser chrome, editor UI, and watermark artifacts.
4. Build the static shell first.
5. Implement only minimum visible interactions.
6. Capture comparison screenshots.
7. Validate `target-copy-report.local.json`.
8. Validate `asset-manifest.local.json` when production imagery is used.
9. Report exact differences.

Product logic waits until the pixel-parity shell is approved.

### Standard Visual Target Reconstruction

1. Analyze the reference before implementation.
2. If Migi points to a visual-library folder, select the correct Reference Folder Mode:
   - `01-command-centers-dashboards`: Command Center / Dashboard Mode
   - `02-creative-experimental-ui`: Artistic / Creative Mode
   - `03-mobile-consumer-apps` or `mobile-apps`: Mobile Product Flow Mode
   - `04-selection-gallery-browse`: Selection / Gallery / Browse Mode
   - `05-landing-hero-pages`: Landing Page / Poster Mode
3. If visual-heavy work uses visual-library references, create `docs/design/reference-usage-report.md` before coding.
4. If Migi asks to use a visual-library folder or screenshot set as the design basis, activate Reference-Locked Build Mode:
   - select 3-5 exact reference anchors
   - assign anchor roles: composition, palette/material, graph/component, image/object/media, responsive/layout
   - create `docs/design/reference-decomposition.md`
   - create `docs/design/design-transfer-spec.md`
   - build from the spec by segments: shell/nav, attraction zone, chart/data system, queue/list system, action/output system, responsive adaptation
   - create `docs/qa/reference-match-report.md` before final handoff
5. If visual-library references are used, complete Scale Calibration in `docs/design/reference-usage-report.md`:
   - reference density observed
   - largest text role
   - supporting text scale
   - container/card density
   - image scale role
   - what will be avoided
   - how the implementation prevents AI scale inflation
6. If image-led, artistic, landing-page, cinematic, or visual-heavy references are used, complete Image Environment Strategy in `docs/design/reference-usage-report.md`:
   - whether the reference uses image as environment or asset
   - image role selected
   - why the image should or should not be boxed
   - crop strategy
   - focal object protection
   - text safe zones
   - scrim/mask/plate strategy
   - how the layout avoids image-trapped-in-grid
7. If image-led or visual-library references are used, complete Contrast / Legibility Strategy in `docs/design/reference-usage-report.md`:
   - whether text sits over images
   - protection method
   - safe zones
   - focal objects protected
   - small text contrast plan
   - responsive crop risk
   - what must be checked at 1440 / 768 / 390
8. If Command Center / Dashboard Mode is selected, complete Dashboard Command-Surface Strategy in `docs/design/reference-usage-report.md`:
   - attraction zone or focal visual/data anchor
   - panel mix across metrics, charts, queues/lists, activity, imagery/content, controls, and actions
   - chart forms and what each chart helps decide
   - image/object/media role when references support one
   - utility-heavy zone
   - queue/list/activity zone
   - control/action zone
   - calm zones and busy zones
   - how the design avoids same-weight card soup
   - how the design avoids terminal-ish dark panel spam
9. If Command Center / Dashboard Mode is selected, complete dashboard visual-energy strategies:
   - Dashboard Palette Strategy: reference palette observed, neutral system, accent use, state colors, material range, palette failure to avoid, and why the palette matches references
   - Graph System Strategy: major chart, supporting charts, microcharts, what each chart communicates, what would be decorative/fake, and how chart styling supports composition
   - Image / Object / Media Strategy: visual anchor, image/object role, media/avatar/content role, whether animation/live media is useful, how imagery avoids being pasted in, and how it supports dashboard hierarchy
10. For dashboard or visual-heavy work, complete global UI craft strategy:
   - Navigation Strategy: primary labels, why they are understandable, responsive behavior, mobile/lower nav plan, selected state, and avoided nav failure
   - Toolbar Alignment Strategy: input/button groups, height relationship, wrapping behavior, and primary action placement
   - Text Density Strategy: long-copy location, summarized content, scan-first panels, and expanded/details behavior
   - Button Proportion Strategy: primary button sizing, full-width button justification, and desktop/mobile behavior
   - Responsive Collision Checks: 1440, 1280, 1024, 768, 390, known collision risks, and prevention plan
   - Layout Integrity Contract: minimum card widths, tablet/mobile behavior, chart containment, truncation/line-clamp, chip wrapping, badge collision prevention, nav behavior, form/control wrapping, and long-content behavior
   - Responsive Breakpoint Proof: 1440, 1280, 1024, 768, and 390 checks for nav readability, toolbar alignment, card readability, chart containment, overlap, horizontal overflow, and primary-action reachability
   - Palette Direction: reference palette, chosen palette, accent roles, surface system, and why it avoids machine/default color
11. If artistic, cinematic, landing, portfolio, creative, editorial, or experimental references are used, complete Art-Directed Palette Exploration:
   - Safe Refined palette
   - Artistic Expressive palette
   - Unexpected High-Character palette
   - base colors, accent logic, image compatibility, mood, contrast risks, concept fit, and AI-default palette avoided for each
   - selected palette and OKLCH/APCA or equivalent contrast reasoning
12. If references come from discovery work, create or validate `inspiration-manifest.local.json`.
13. Extract:
   - composition
   - focal object
   - material
   - atmosphere
   - hidden information
   - absent elements
   - information hierarchy
   - interaction model
   - desire mechanism
14. Declare the role of every major image: hero scene, focal object, proof object, background atmosphere, editorial fragment, selection thumbnail, or texture/material layer.
15. Decide whether major imagery should be environment or asset. If the reference uses a strong background scene, start from the scene before grid/layout.
16. Reject shallow traits as the concept: dark, neon, cards, glow, gradients, glass, rounded panels, or large text.
17. Reject folder-vibe design: do not copy mood, color, or category without transferring anchor composition, density, chart behavior, image/object role, palette/material, and responsive mechanics.
18. Reject dashboard flattening: command-center references must not become generic admin panels, same-weight card fields, text-and-metrics-only dashboards, terminal-ish dark panel spam, murky monochrome palettes, decorative chart collections, image-starved surfaces, cryptic nav, misaligned toolbars, fake live/session status theater, or machine-generated palettes.
19. Reject scale-only drama: giant headlines, giant images, huge empty containers, and low desktop density are not premium.
20. Reject hope-based contrast: important text over imagery needs a safe zone, scrim, plate, mask, vignette, crop, or separation outside the image.
21. Reject background image fear: immersive references should not be reduced to boxed rectangular assets.
22. Reject safe AI palette defaults: artistic, landing, portfolio, cinematic, creative, editorial, and experimental reference work must not default to muddy brown/black, sepia/espresso/umber archive wash, generic charcoal/orange, AI purple glow, beige premium, terminal green, neon lime, blue-grey SaaS, or safe neutral with one predictable accent.
23. Reject decorative orbital/circular/radar/HUD overlays unless Migi explicitly requested them or they are functional components such as circular charts, selectors, maps, progress rings, or labeled diagrams.
24. Reject navigation that becomes unreadable over reference imagery, giant type, video, gradients, or scroll-state background changes.
25. Reject forced app-name/logo/initials chrome unless the selected direction or visual spec justifies it.
26. Reject decorative separator hairlines, red ticks, label rails, and ornamental rules unless they align to real content boundaries.
27. For landing-page, creative, artistic, cinematic, editorial, or image-led references, explicitly check:
   - composition was extracted, not just colors
   - image dominance is preserved
   - image is used as environment when the reference supports it
   - text stays sparse
   - dashboard furniture is absent
   - generic section stacking is absent
   - visual mood continues after the hero
   - the screen behaves like a poster/editorial spread
28. Define what to copy, avoid, and translate.
29. For landing, portfolio, marketing, and imagegen reference work:
   - use one horizontal image/reference per section
   - never compress multiple sections into one unreadable board
   - define section job, composition anchor, background mode, CTA variation, and second-read moment
   - run anti-AI-tell preflight before implementation
30. If real imagery is needed, create `docs/design/unsplash-search-plan.md` and `docs/design/unsplash-asset-manifest.md`; document roles, crop strategy, palette relationship, alt text, source metadata, and product-truth notes.
31. If this is new visual-heavy work and Literal Target Copy Mode is not active, run the Three-Direction Mockup Gate before implementation: create `docs/design/direction-options.md`, stop for Migi to choose A, B, C, or a hybrid, then create `docs/design/selected-direction.md`.
32. Run Visual Concept Gate v2 if the work is visual-heavy: exactly 3 rendered concepts, preview routes, and `1440 / 768 / 390` screenshot files when tooling exists.
33. Stop for Migi approval after showing the directions or rendered concepts.
34. Build a static visual shell from the approved direction/concept before product logic.
35. Capture or inspect implementation screenshots at `390 / 768 / 1440`.
36. Compare target/current screenshots with `node tools/compare-screenshots.mjs --target <target.png> --current <current.png> --name <name>` when exact target copy applies.
37. Compare the shell against the reference and approved concept by selected anchors, transferred mechanics, composition, focal object, hidden information, emotional hook, image environment, scale/density, contrast strategy, navigation clarity, navigation readability, brand chrome, decorative geometry, line/divider strategy, toolbar alignment, text density, button proportions, layout integrity, responsive breakpoint proof, responsive collision behavior, palette direction, dashboard command-surface strategy, dashboard palette strategy, graph system, and image/object/media strategy when applicable.
38. Validate `asset-manifest.local.json` when production imagery is used.
39. Verify the core loop before claiming the visual shell supports the product promise.
40. Verify persistence truth for uploaded or user-generated data.
41. Create or update `done-report.local.json` from screenshot evidence.
42. Run `node tools/design-os.mjs validate-done-report done-report.local.json`.
43. Patch the shell before adding feature depth.

## Stop Conditions

- Stop if the reference has not been analyzed.
- Stop if a visual-library folder was provided and no Reference Folder Mode was selected.
- Stop if visual-heavy work uses visual-library references but `docs/design/reference-usage-report.md` is missing.
- Stop if Migi asked to use a folder/screenshot set as the design basis and exact reference anchors are not selected.
- Stop if Reference-Locked Build Mode is active but `docs/design/reference-decomposition.md` or `docs/design/design-transfer-spec.md` is missing before coding.
- Stop if the agent cannot name each anchor role and transferred mechanic.
- Stop if Image Environment Strategy is missing for image-led/artistic/landing references.
- Stop if Scale Calibration is missing for visual-library reference work.
- Stop if Contrast / Legibility Strategy is missing for image-led or visual-library reference work.
- Stop if Command Center / Dashboard Mode has no Dashboard Command-Surface Strategy.
- Stop if Command Center / Dashboard Mode has no Dashboard Palette Strategy or Graph System Strategy.
- Stop if dashboard or visual-heavy work has no Navigation Strategy, Toolbar Alignment Strategy, Text Density Strategy, Button Proportion Strategy, Responsive Collision Checks, or Palette Direction.
- Stop if navigation overlays images, giant type, video, or changing backgrounds without Navigation Readability Strategy.
- Stop if visible app-name/logo/initials chrome appears without Identity / Brand Chrome Decision justification.
- Stop if decorative circular/orbital/radar/HUD overlays appear without explicit Migi approval and functional meaning.
- Stop if decorative separator hairlines, red lines, label rails, or ticks appear without functional Line / Divider Strategy.
- Stop if visual-heavy work has no Layout Integrity Contract or Responsive Breakpoint Proof.
- Stop if new visual-heavy work is not Literal Target Copy Mode, no visual direction is already approved, and `docs/design/direction-options.md` is missing.
- Stop if implementation starts before Migi chooses Direction A, B, C, or a hybrid.
- Stop if Migi chooses a direction but `docs/design/selected-direction.md` is missing.
- Stop if artistic, landing, portfolio, cinematic, creative, editorial, or experimental reference work has no Safe Refined, Artistic Expressive, and Unexpected High-Character palette exploration.
- Stop if command-center references become generic SaaS/admin, same-weight card soup, terminal-ish dark panel spam, murky monochrome panels, text-and-metrics-only panels, decorative charts, image-starved surfaces, or no focal attraction zone.
- Stop if dashboard mode produces lifeless same-color panels with weak charts and no visual anchor.
- Stop if nav is cryptic, responsive layout collides, fake session/live status appears, text-heavy containers kill scanability, toolbar controls misalign, or palette feels robotic/generic.
- Stop if final Reference-Locked handoff has no `docs/qa/reference-match-report.md`.
- Stop if any text escapes a container.
- Stop if any chart overflows its plot/card bounds.
- Stop if any core card becomes unreadable.
- Stop if nav breaks on resize.
- Stop if layout only works at one viewport.
- Stop if discovered inspiration has no validated inspiration manifest.
- Stop if the output preserves only surface styling.
- Stop if the screenshot feels like giant text, images, cards, or containers attacking the user.
- Stop if any important text is hard to read.
- Stop if the reference is immersive/image-led but the result uses a boxed rectangular image layout.
- Stop if major images are used as decoration with no declared role.
- Stop if real imagery is needed but Unsplash/source search plan or asset manifest is missing.
- Stop if sourced imagery is generic filler, missing source metadata/alt text, has unsafe text overlays, breaks responsive crop, or implies false product proof.
- Stop if the chosen layout contradicts the reference composition.
- Stop if landing-page, creative, artistic, or image-led output looks like a normal landing page with artistic images pasted into cards or sections.
- Stop if the visual-heavy concept gate is text-only or missing screenshots when Literal Target Copy Mode is not active.
- Stop before product logic if the visual shell does not match the approved direction.
- Stop if Literal Target Copy Mode is active and the implementation changes composition, adds unrelated product UI, or explains instead of copying the visible shell.
- Stop if visual target work has no validated done report before final handoff.
- Stop if the app's purpose in Miguel Design OS is unclear for a dogfood target.
- Stop if upload/classify/generate or equivalent core loop proof is missing.
- Stop if uploaded/user-generated data appears in one area but counts, Memory, or summaries contradict it.
- Stop if persistence for uploaded/user-generated data is not labeled across route changes, refresh, and browser reopen.
- Stop if dogfood target failures do not produce Design OS rule/tool/prompt/checklist updates or explicit open gaps.
- Stop if Literal Target Copy Mode has no validated target-copy report.
- Stop if Literal Target Copy Mode has no screenshot comparison report.
- Stop if a target screenshot is used as a production asset.
- Stop if production image-led reconstruction has no validated asset manifest.

## Output Contract

```md
Reference analyzed:
Composition:
Focal object:
Material/atmosphere:
Hidden information:
Absent elements:
Interaction model:
Copy:
Avoid:
Translate:
Reference folder mode:
Reference usage report:
Reference-Locked Build Mode:
Reference anchors:
Reference decomposition:
Design transfer spec:
Direction options:
Selected direction:
Reference match report:
Dashboard command-surface strategy:
Dashboard palette strategy:
Graph system:
Image/object/media strategy:
Image role strategy:
Image environment strategy:
Scale calibration:
Contrast / legibility:
Navigation strategy:
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
Palette direction:
Palette exploration:
Rendered concepts:
Approved concept:
Literal Target Copy Mode:
Visual shell comparison:
Exact differences:
Screenshots:
Done report:
Target-copy report:
Asset manifest:
Core loop proof:
Persistence truth:
Dogfood learning:
Patch needed:
```

## Scorecard Blockers

- Inspiration flattened into shallow traits: max score 6.
- Wrong reference folder mode used: max score 6.
- No reference usage report for visual-heavy visual-library work: max score 6.
- Visual-library folder used but no reference anchors selected: max score 5.
- No reference decomposition before coding: max score 5.
- No design transfer spec before coding: max score 5.
- Output uses generic mode instead of selected anchor mechanics: max score 5.
- Agent copies mood but not composition: max score 6.
- Agent copies colors but not structure: max score 6.
- Agent ignores image/object/chart behavior from anchors: max score 6.
- No final reference-match report: max score 6.
- Visual-heavy new app implemented without direction-options gate: max score 6.
- Agent provides only one direction when direction is not approved: max score 6.
- Three directions are minor variations of same layout/palette: max score 5.
- Agent codes before Migi selects direction: max score 5.
- Direction options lack palette/image/layout/motion strategy: max score 6.
- Agent ignores selected direction during implementation: max score 5.
- No selected-direction.md after Migi chooses: max score 7.
- Decorative circular/orbital/HUD overlay used as atmosphere: max score 5.
- Nav unreadable over image/type/background: max score 4.
- Forced app-name/logo chrome without justification: max score 5.
- Decorative separator/hairline used without function: max score 5.
- Missing Dashboard Command-Surface Strategy for Command Center / Dashboard Mode: max score 6.
- Missing Dashboard Palette Strategy for Command Center / Dashboard Mode: max score 6.
- Missing Graph System Strategy for Command Center / Dashboard Mode: max score 6.
- Missing Image / Object / Media Strategy for Command Center / Dashboard Mode: max score 7.
- Dashboard feels like generic SaaS/admin template: max score 6.
- Dashboard has no meaningful attraction zone when references show one: max score 6.
- Murky monochrome / terminal-green palette without reference justification: max score 5.
- Single accent color overused everywhere: max score 6.
- Same-weight dashboard widget field: max score 6.
- Dashboard charts are decorative: max score 6.
- Major dashboard chart is decorative or unclear: max score 5.
- Too few meaningful charts despite graph-rich references: max score 6.
- Dashboard imagery/object/media absent despite relevant reference evidence: max score 6.
- Dashboard uses only text/metrics/panels with no image/object/media layer despite reference support: max score 6.
- Static dashboard feels dead despite live/monitoring product concept: max score 7.
- Terminal-ish dark panel spam as dashboard art direction: max score 6.
- Missing Scale Calibration for visual-library reference work: max score 6.
- All references treated equally without prioritization: max score 7.
- Image used as decoration only: max score 7.
- AI scale inflation visible: max score 6.
- Giant headline/container attack: max score 6.
- Desktop layout feels like enlarged mobile: max score 6.
- Dense controlled reference output becomes sparse/giant: max score 5.
- Important text hard to read over image: max score 5.
- Small text over busy image without protection: max score 5.
- CTA/nav text weak contrast: max score 5.
- Text readable in one viewport but failing another: max score 6.
- Image-led UI without contrast strategy: max score 6.
- Focal object darkened/covered until emotional impact is lost: max score 7.
- Inconsistent image-card overlay treatments without reason: max score 7.
- Contrast depends on a lucky crop: max score 6.
- Image-led reference implemented as boxed/card image without justification: max score 6.
- Artistic landing page uses rigid two-column image/text grid despite immersive references: max score 6.
- Strong image treated as decoration instead of composition driver: max score 6.
- Full-scene reference reduced to square image asset: max score 5.
- Image trapped in visible grid/card structure loses emotional impact: max score 6.
- Page has good image but layout still feels component-led: max score 7.
- Strong reference provided but result preserves only surface styling: max score 6.
- Generic app layout used instead of reference composition: max score 6.
- Primary reference object replaced by grid/cards/dashboard: max score 6.
- Landing-page/artistic request becomes generic SaaS, blog, or grid structure: max score 6.
- Artistic hero followed by generic cards/sections: max score 7.
- Hero follows reference but the rest becomes generic: max score 7.
- Blogspot/content-template structure: max score 5.
- Text-only concepts for visual-heavy reference work: max score 5.
- Concept screenshots missing before approval: max score 6.
- Literal Target Copy Mode requested but composition changes or unrelated product UI is added: max score 5.
- Missing validated done report for visual target work: max score 6.
- Missing target-copy report during Literal Target Copy Mode: max score 6.
- Missing screenshot comparison report during Literal Target Copy Mode: max score 6.
- Missing asset manifest for image-led target reconstruction: max score 6.
- Watermark/editor/browser artifact in reconstructed UI: max score 4.
- UI count says 0 while uploaded/user data exists: max score 4.
- Cryptic primary navigation: max score 5.
- Nav abbreviations without obvious meaning: max score 6.
- Broken responsive nav or nav overlap: max score 5.
- Misaligned search/action toolbar: max score 7.
- Toolbar controls collide or wrap badly: max score 6.
- Too much text inside dashboard containers: max score 6.
- Oversized full-width button without justification: max score 7.
- Overlapping containers, pills, or covered content on resize: max score 5.
- Fake live/session status UI: max score 5.
- Decorative telemetry/status chips: max score 6.
- Palette feels machine-generated/generic: max score 6.
- Artistic/landing/portfolio/cinematic/experimental reference work uses safe AI-default muddy palette without exploration: max score 6.
- Palette feels machine-generated/generic despite expressive mode: max score 5.
- No palette exploration documented for artistic/cinematic mode: max score 6.
- Color palette is readable but conceptually boring in an art-directed page: max score 7.
- Palette chosen without relation to imagery, references, or concept: max score 6.
- Bold palette used but contrast/readability fails: max score 5.
- Agent defaults to charcoal/brown/orange generated-app palette again: max score 5.
- Sepia/espresso/umber brown-black archive wash appears as a page, stage, card, panel, note, command container, nav, sidebar, drawer, modal, framed object, or container surface: max score 2.
- Nocturne/archive/field-guide/botanical/brass/tobacco/parchment/vintage/cinematic/commander/incident/operational/premium language is used to justify the banned brown-black surface family: max score 2.
- Text visibly escapes container: max score 2.
- Chart bars/lines escape chart/card bounds: max score 2.
- Containers overlap on resize: max score 3.
- Card content clipped/cut off: max score 4.
- Dashboard cards become too narrow to read: max score 4.
- Labels collapse into meaningless fragments: max score 5.
- Responsive design only works at one viewport: max score 5.
- Nav breaks/overlaps/becomes unreadable on resize: max score 5.
- Image badges/pills overlap unintentionally: max score 4.
- Form fields/buttons become clipped or unreadable: max score 4.
- Core screen has horizontal overflow: max score 5.
- Chart is attractive but structurally broken: max score 4.
- Core upload/classify/generate loop unverified: max score 6.
- Persistence truth missing for uploaded/user data: max score 6.
- Dogfood target without Design OS learning patch: max score 6.

## Safety/Scope Rules

- Do not copy proprietary assets, logos, or code.
- Only use Literal Target Copy Mode for a target Migi supplies or explicitly approves.
- Do not add external dependencies as part of this skill.
- Do not expose private inspiration files outside the repo.
- Do not treat inspiration as a universal rule for unrelated projects.
- Do not treat all visual-library folders as the same moodboard.
- Do not reduce command-center/dashboard references to dark mode, cards, charts, and rounded corners.
- Do not default command-center/dashboard references to murky green, terminal black, overused lime, or purple AI palettes without reference justification.
- Do not let dashboard charts or media anchors become decorative proof of effort.
- Do not use major images without a declared role.
- Do not mistake premium, cinematic, or artistic direction for making everything huge.
- Do not place important text over imagery without deliberate contrast protection.
- Do not reduce immersive image references to boxed rectangular assets by default.
- Do not convert landing-page, creative, artistic, cinematic, editorial, or image-led references into dashboard furniture or Blogspot-style section stacks.
- Do not claim visual parity from build/lint alone; screenshot evidence and a validated done report are required.
- Do not claim a target-inspired product works until the core product loop has been verified.
- Do not imply durable Memory or persistence for uploaded examples unless route, refresh, and browser-reopen behavior is known and disclosed.
- Do not let dogfood work drift into building adjacent tools instead of evaluating the target app.
- Visual target screenshots are evidence, not production assets.
- Run `tools/compare-screenshots.mjs` for target/current parity evidence.

## Audit Upgrade: Self-Correction Contract

Audit fix: Turn visual matching into a measurable reconstruction loop.

Required evidence:
- target/current screenshots, excluded artifacts, pixel/composition differences, and repair list.

Repair routing:
- visual-target-reconstruction owns reconstruction fixes; screenshot-scorecard-review owns evidence gaps.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "visual-target-reconstruction"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
