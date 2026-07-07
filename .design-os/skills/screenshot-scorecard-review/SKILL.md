# screenshot-scorecard-review

## Name

screenshot-scorecard-review

## Description

Evidence-based screenshot review for responsive quality, overlap, readability, scorecard blockers, and final handoff readiness.

## Use When

- Screenshots exist.
- The UI can run.
- The task is frontend QA, final verification, review, or fix-until-elite.
- The user asks to prove responsiveness or quality.
- Visual Swarm v1 reaches the Visual QA Anti-Slop phase.

## Do Not Use When

- No UI surface exists.
- The task is documentation-only.
- The work is backend-only.

## Required Inputs

- Screenshots at `390`, `768`, and `1440`, or a runnable UI; include `1024` and `1280` for dashboard or visual-heavy work when practical.
- Route or screen under review.
- Product type.
- Design Intent Record.
- Approved rendered concept when relevant.
- Reference folder mode, reference usage report, and Scale Calibration when visual-library references are used.
- Reference-Locked Build Mode artifacts when a visual-library folder or screenshot set is the design basis: selected anchors, anchor roles, `docs/design/reference-decomposition.md`, `docs/design/design-transfer-spec.md`, and `docs/qa/reference-match-report.md`.
- Dashboard Command-Surface Strategy when Command Center / Dashboard Mode is used.
- Dashboard Palette Strategy, Graph System Strategy, and Image / Object / Media Strategy when Command Center / Dashboard Mode is used.
- Contrast / Legibility Strategy when image-led or visual-library references are used.
- Navigation Strategy, Toolbar Alignment Strategy, Text Density Strategy, Button Proportion Strategy, Responsive Collision Checks, and Palette Direction for dashboard or visual-heavy work.
- Domain Palette Fit for product UIs.
- Domain Content Contract for app/dashboard/product UI.
- Spatial Label Safe Zones for maps, floor plans, seating charts, timelines, and canvases.
- No Placebo Navigation contract when nav/tabs/segmented controls are present.
- Layout Integrity Contract and Responsive Breakpoint Proof at 1440, 1280, 1024, 768, and 390 for visual-heavy work.
- Visual Concept Gate artifact when visual-heavy work applies.
- Done report artifact before final handoff.
- Core loop proof when the product depends on upload, classification, generation, selection, or persistence.
- Persistence truth for user-generated data across route changes, refresh, and browser reopen.
- Dogfood target checklist when the app exists to test Miguel Design OS.
- Asset manifest for production image-led work.
- Unsplash search plan and asset manifest when real imagery or Unsplash assets are used.
- Navigation strategy when visual-heavy work includes navigation.
- Mobile product interaction strategy when mobile product work is involved: modal/sheet fit, icon+label bottom nav, selection state, control-indicator collision, and add/create action differentiation.
- Target-copy report when Literal Target Copy Mode applies.

## Files To Read

- `evaluation/ui-scorecard.md`
- `design-dna/00_COMPACT_AGENT_CONTEXT.md`
- `design-dna/responsive-rules.md`
- `design-dna/clickable-vs-static-rules.md`
- `design-dna/anti-ai-tell-preflight.md` for landing/portfolio/marketing screenshots
- `design-dna/unsplash-asset-sourcing-rules.md` when real imagery or Unsplash assets are visible
- `design-intelligence/navigation-pattern-guidance.md` when navigation is visually important
- `design-dna/motion-and-delight-rules.md` when screenshots are part of motion/polish review

## Workflow

1. Capture or inspect `390`, `768`, and `1440`; inspect or capture `1024` and `1280` for dashboard or visual-heavy work when practical.
2. Prefer local capture with `node tools/visual-qa.mjs --url <url> --name <name>` when the UI can run.
3. Run `node tools/object-swap-check.mjs --url <url> --objects "<objects>" --name <name>` for roster, gallery, configurator, and selection-first products.
4. For visual-heavy work, verify the Visual Concept Gate had exactly 3 rendered concepts with preview routes and concept screenshots before implementation.
5. For Reference-Locked Build Mode, verify:
   - exact reference anchors were selected
   - each anchor has a role
   - reference decomposition happened before coding
   - design transfer spec happened before coding
   - final output compares against anchors in `docs/qa/reference-match-report.md`
   - screenshot output does not copy vibe only
6. For Three-Direction Mockup Gate work, verify:
   - `docs/design/direction-options.md` exists when visual direction was not already approved
   - three directions are meaningfully different
   - Migi selected A, B, C, or a hybrid before coding
   - `docs/design/selected-direction.md` exists after selection
   - the agent proceeded to implementation after selection unless Migi explicitly requested planning-only/spec-only/no-code
   - the final response included the UI URL when a dev server was started
   - screenshots/implementation follow the selected direction
   - nav remains readable over images, giant type, and scroll-state backgrounds
   - visible app-name/logo/initials chrome is justified in the visual spec
   - decorative orbital/radar/HUD circles are absent unless functional
   - decorative separator hairlines and label rails are absent unless functional
7. Check mobile first for horizontal scroll, clipping, sticky collision, and unreadable UI.
   - If the app has 3+ primary destinations, confirm mobile uses bottom navigation or documents a valid exception.
   - Confirm the top of mobile screens is not wasting space on primary navigation when it should hold brand, title, search, context, or hero imagery.
   - Confirm bottom nav is premium, aligned, safe-area aware, readable, not cramped, and not oversized.
   - Confirm practical mobile product bottom nav uses semantic icons plus readable labels.
   - Confirm bottom nav badges/counters do not crowd icons or labels.
   - Confirm modals/bottom sheets fit the viewport, respect safe areas, and keep primary actions visible/reachable.
   - Confirm long sheets scroll internally instead of clipping.
   - Confirm active bars, progress strips, underlines, and selection indicators do not overlap labels/content.
   - Confirm selectable chips/items preserve selected state after tap.
   - Confirm add/create actions are visually distinct from content cards and use plus/create affordance.
8. Check tablet for cramped desktop or broken mobile layout.
9. Check desktop for stretched mobile, empty expanses, or inflated scale.
10. Check scale calibration:
   - Is the UI inflated?
   - Are text sizes calibrated to references?
   - Are containers larger than their content?
   - Is the desktop viewport used well?
   - Are at least 3 meaningful content objects visible above the fold, unless the reference strongly justifies fewer?
   - Does the layout feel like mobile blown up?
   - Did the agent mistake premium for giant?
11. For Command Center / Dashboard Mode, check dashboard composition:
   - Is there one memorable attraction zone or focal visual/data anchor?
   - Are panel weights varied?
   - Are charts useful and integrated into the composition?
   - Does the surface mix metrics, charts, queues/lists, imagery/content, controls, and actions?
   - Is imagery/object/media use deliberate when the references support it?
   - Does the dashboard avoid same-weight card soup, text-and-metrics-only layout, terminal-ish dark panel spam, and decorative charts?
   - Is there a clear rhythm between calm zones and busy zones?
   - Is the palette reference-driven rather than murky monochrome or terminal green?
   - Is accent color used selectively?
   - Are there at least two useful visualization types when graph-rich references apply?
   - Is the major chart readable and meaningful?
   - Is there an image/object/media anchor when references support one?
   - Does the dashboard feel alive when the product represents monitoring, freshness, or activity?
   - Are nav labels understandable?
   - Is responsive nav polished at 390 and 768?
   - Are toolbar inputs and buttons aligned?
   - Are panels scan-first rather than prose-heavy?
   - Are buttons proportionate to their role?
   - Is the palette reference-driven and human rather than robotic/generic?
   - Does the palette fit the product domain, user environment, task pressure, and emotional state?
   - Do state colors map to actual product state?
   - Are live/session/status indicators real and understandable instead of decorative?
   - Does each nav/tab/filter selected state change visible content, route, scope, filter, or product state?
   - If there is a map, floor plan, seating chart, timeline, or canvas, do labels stay protected from object/card/glow overlap?
   - Is the primary product object central, or has it been buried by cards?
   - Are metrics, sections, and routes domain-real rather than generic operational theater?
   - Do mock values have units, ranges, statuses, and source/freshness where needed?
   - Are `mission control`, `topology`, `traces`, and `system map` justified by product domain and data contract?
   - Are textures and illustrations free of ambient blobs, dotted filler, amateur vector forms, and paths crossing text?
   - Is the Native Tooltip Ban respected, with no browser-native tooltip over art-directed SVG?
   - Does every annotation obey the Annotation Protected Zone Rule?
12. Check palette exploration for artistic, cinematic, landing, portfolio, creative, editorial, or experimental work:
   - Did the agent explore multiple palette directions?
   - Does the palette feel authored or generated?
   - Is the palette tied to the concept?
   - Does the palette create identity?
   - Is it readable?
   - Does it avoid the same muddy AI backgrounds?
   - Is the accent overused?
   - Do image colors and UI colors work together?
   - Did OKLCH/APCA or contrast logic guide the final palette?
13. Check contrast and text-on-image discipline:
   - Is every important text layer readable?
   - Is text over image protected?
   - Are small labels readable?
   - Do interactive labels remain readable in default, hover, focus-visible, active/pressed, selected, selected+hover, selected+focus, and disabled states?
   - Does contrast survive 1440 / 768 / 390?
   - Are focal objects protected from overlays?
   - Is image treatment consistent?
   - Are gradients/scrims intentional, not emergency fixes?
   - Does any text rely on a lucky crop?
14. Check every viewport for overlap/collision, including nav, toolbars, chips, badges, forms, panels, and image overlays.
15. Check P0 layout integrity:
   - Does any text escape its card?
   - Are any card titles clipped?
   - Do charts stay inside chart containers?
   - Do bars, lines, points, axes, or labels overflow?
   - Do pills/chips overlap?
   - Do image badges collide?
   - Do containers become unreadable when resized?
   - Does the layout adapt or merely squeeze?
   - Are labels still semantic at small widths?
   - Does nav remain understandable at desktop/tablet/mobile?
   - Should this become bottom navigation?
   - Is valuable vertical space being wasted?
   - Does this feel like a premium mobile product?
   - Is the bottom navigation crafted or generic?
   - Does practical mobile bottom nav include icons plus labels?
   - Do modal sheets fit the viewport and safe area?
   - Do selectable controls preserve selected state?
   - Do control indicators overlap labels?
   - Is add/create visually distinct from content?
   - Does the UI survive 1440 / 1280 / 1024 / 768 / 390?
16. Manually verify the core loop when it is upload -> classify -> generate output, import -> analyze -> recommend, select -> configure -> output, or equivalent.
15. Verify persistence claims for user-generated data across route changes, refresh, and browser reopen.
16. For dogfood targets, map every target-app failure back to a Miguel Design OS rule/tool/prompt/checklist patch or explicit open gap.
17. Run `evaluation/ui-scorecard.md`.
18. For landing/portfolio/marketing screenshots, run anti-AI-tell checks: em-dashes, hero clutter, CTA wrap, duplicate CTA intent, fake screenshots, logo wall misuse, repeated section family, and scroll cues.
19. For real imagery or Unsplash assets, verify:
   - `docs/design/unsplash-search-plan.md` exists
   - `docs/design/unsplash-asset-manifest.md` exists
   - every meaningful image has source/photographer metadata and alt text
   - crop is robust at 1440 / 768 / 390
   - text overlays have safe zones, scrims, plates, or separation
   - stock imagery is not used as factual product proof
20. For navigation, verify:
   - `docs/design/navigation-strategy.md` exists for visual-heavy work
   - nav placement supports the hero/composition
   - selected pattern is documented
   - CTA/nav relationship is intentional
   - active/focus states are visible
   - mobile behavior is not a desktop link dump
21. For motion review, verify the screenshot evidence is paired with motion rationale or code review when animation changed.
22. Apply caps.
23. Validate `asset-manifest.local.json` when production image-led work is involved.
24. Validate `target-copy-report.local.json` when Literal Target Copy Mode applies.
25. Create or update `done-report.local.json`.
26. Run `node tools/design-os.mjs validate-done-report done-report.local.json`.
27. Patch blockers before completion when implementation is in scope.
28. Re-check changed screens.

## Stop Conditions

- Stop if a required viewport is missing and the UI can run.
- Stop if visual-heavy work asks for approval from text-only concepts or missing concept screenshots.
- Stop if Reference-Locked Build Mode has no exact anchors, no reference decomposition, no design transfer spec, or no final reference-match report.
- Stop if Three-Direction Mockup Gate applies but direction options, Migi selection, or selected-direction documentation is missing.
- Stop if Migi selected A, B, C, or a hybrid and the agent stopped after `docs/design/selected-direction.md` without explicit planning-only/no-code instructions.
- Stop if the agent asks for implementation confirmation after explicit direction selection.
- Stop if implementation ignores the selected direction.
- Stop if the screenshot output copies folder vibe but not anchor composition, density, chart behavior, image/object role, palette/material, and responsive mechanics.
- Stop if horizontal scroll appears in the primary mobile flow.
- Stop if unintended overlap or unreadable UI appears.
- Stop if dashboard references produce same-weight card soup, terminal-ish dark panel spam, murky monochrome panels, text-and-metrics-only admin layout, decorative charts, weak chart system, image-starved surfaces, or no attraction zone.
- Stop if dashboard mode produces lifeless same-color panels with weak charts and no visual anchor.
- Stop if navigation is cryptic or responsive nav overlaps content.
- Stop if navigation becomes unreadable over imagery, giant type, video, or changing scroll backgrounds.
- Stop if selected+hover, selected+focus, hover, focus-visible, active, or pressed state makes an interactive label unreadable.
- Stop if visible app-name/logo/initials chrome appears without visual-spec justification.
- Stop if decorative circular/orbital/radar/HUD overlays appear without explicit Migi approval and functional meaning.
- Stop if ambient light blob, foggy radial glow, spotlight haze, or dotted/star-field/micro-dot texture appears as generic atmosphere.
- Stop if vector illustration looks amateur, arbitrary, fake scientific/botanical, lacks shape roles, or lets paths/callouts/stems/arcs cross or clip readable text.
- Stop if Native Tooltip Ban is violated: browser-native tooltip appears over an art-directed SVG surface.
- Stop if Annotation Protected Zone Rule is violated: leader lines, stems, arcs, or annotation rules cross readable label text.
- Stop if Background Texture Quality Rule is violated: dot grid, star field, random noise, or vague glow reads as AI atmospheric texture.
- Stop if decorative hairline/separator filler appears without function.
- Stop if a mobile app with 3+ primary destinations uses desktop/top navigation without justification.
- Stop if bottom navigation is generic, cramped, oversized, poorly aligned, or lacks safe-area support.
- Stop if practical mobile product bottom nav has labels but no icons, unclear icons, inconsistent icon family, or badges crowding labels/icons.
- Stop if a modal or bottom sheet is cut off, opens awkwardly, hides primary actions, ignores safe areas, lacks internal scroll when long, or visually collides with bottom nav.
- Stop if active bars, progress strips, underlines, or selected indicators overlap control labels/content.
- Stop if selectable chips/items/tabs do not visibly preserve selected state.
- Stop if add/create action looks like a normal content item or lacks plus/create affordance.
- Stop if toolbar controls misalign or collide when wrapping.
- Stop if text-heavy containers kill scanability.
- Stop if buttons become oversized full-width bars without justification.
- Stop if any text escapes a container.
- Stop if primary headings or important UI text are clipped/cut off above, below, or sideways.
- Stop if any chart overflows its plot/card bounds.
- Stop if any core card becomes unreadable.
- Stop if labels collapse into meaningless fragments.
- Stop if layout only works at one viewport.
- Stop if fake live/session/status UI appears without real product meaning.
- Stop if palette feels robotic, generic, or template-generated.
- Stop if palette feels random for the product domain.
- Stop if navigation selected state changes without visible content or product-state change.
- Stop if spatial labels collide with map/floor-plan/timeline/canvas objects.
- Stop if a pattern canvas has catastrophic overlap between pieces, labels, badges, callouts, measurements, ruler text, or construction lines.
- Stop if a desktop command surface buries the primary object inside generic card soup.
- Stop if expressive mode uses a dull generated-app palette with no documented exploration.
- Stop if real imagery is required but source plan or Unsplash asset manifest is missing.
- Stop if a meaningful image has no alt text, broken remote URL, bad responsive crop, unsafe text overlay, or misleading product-proof claim.
- Stop if visual-heavy navigation has no documented navigation strategy.
- Stop if nav is pasted on top of the composition, competes with the hero, or repeats a generic top bar without justification.
- Stop if the screenshot feels like giant text, images, cards, or containers attacking the user.
- Stop if desktop layout feels like enlarged mobile without strong reference justification.
- Stop if any important text is hard to read.
- Stop if scorecard blockers remain but the task claims completion.
- Stop if an upload/classify/generate core loop is not manually verified and documented.
- Stop if user-generated data persistence is not specified across route changes, refresh, and browser reopen.
- Stop if UI count says `0` while uploaded or user-generated data exists.
- Stop if browser chrome, dock, desktop, or editor UI is used as screenshot proof.
- Stop if a dogfood target failure is not translated back into a Miguel Design OS patch or explicit open gap.
- Stop if work drifts into a parallel product, Studio feature, or control app while the active goal is dogfooding a target app.
- Stop if visual UI work has no validated done report before final handoff.
- Stop if visual UI work has no visual QA report when the UI can run.
- Stop if Literal Target Copy Mode has no validated target-copy report.
- Stop if production image-led work has no validated asset manifest.
- Stop if landing/portfolio/marketing screenshots fail Taste preflight.
- Stop if animation changed but no motion standards review was performed.

## Output Contract

```md
Screenshots inspected:
Concept screenshots inspected:
390 result:
768 result:
1440 result:
Reference-Locked Build Mode:
Reference anchors:
Reference decomposition:
Design transfer spec:
Reference match report:
Scale calibration:
Dashboard command-surface strategy:
Dashboard palette strategy:
Graph system:
Image/object/media strategy:
Contrast / legibility:
Navigation strategy:
Toolbar alignment:
Text density:
Button proportions:
Modal / sheet fit:
Mobile nav icons + labels:
Selection state persistence:
Control indicator collision:
Add/create action differentiation:
Responsive collision checks:
Layout integrity contract:
Responsive breakpoint proof:
Palette direction:
Domain palette fit:
Placebo navigation:
Spatial label safe zones:
Primary product object:
Scorecard result:
Done report:
Target-copy report:
Asset manifest:
Core loop proof:
Persistence truth:
Dogfood learning:
Caps applied:
Blockers:
Patch pass completed: yes/no
Remaining verification gaps:
```

## Scorecard Blockers

- No `390 / 768 / 1440` proof: max score 8.
- Text-only concepts for visual-heavy work: max score 5.
- Art direction approval requested without visual previews: max score 5.
- Missing concept screenshots: max score 6.
- Implementation before visual concept approval: max score 6.
- Visual-library folder used but no reference anchors selected: max score 5.
- No reference decomposition before coding: max score 5.
- No design transfer spec before coding: max score 5.
- Output uses generic mode instead of selected anchor mechanics: max score 5.
- Agent copies mood but not composition: max score 6.
- Agent copies colors but not structure: max score 6.
- Agent ignores image/object/chart behavior from anchors: max score 6.
- No final reference-match report: max score 6.
- Missing Dashboard Command-Surface Strategy for Command Center / Dashboard Mode: max score 6.
- Missing Dashboard Palette Strategy for Command Center / Dashboard Mode: max score 6.
- Missing Graph System Strategy for Command Center / Dashboard Mode: max score 6.
- Missing Image / Object / Media Strategy for Command Center / Dashboard Mode: max score 7.
- Dashboard feels like generic SaaS/admin template: max score 6.
- Dashboard has no meaningful attraction zone when references show one: max score 6.
- Murky monochrome / terminal-green palette without reference justification: max score 5.
- Single accent color overused everywhere: max score 6.
- Same-weight dashboard card/widget field: max score 6.
- Dashboard charts are decorative: max score 6.
- Major dashboard chart is decorative or unclear: max score 5.
- Too few meaningful charts despite graph-rich references: max score 6.
- Dashboard imagery/object/media absent despite relevant reference evidence: max score 6.
- Dashboard uses only text/metrics/panels with no image/object/media layer despite reference support: max score 6.
- Static dashboard feels dead despite live/monitoring product concept: max score 7.
- Terminal-ish dark panel spam as dashboard art direction: max score 6.
- AI scale inflation visible: max score 6.
- Giant headline/container attack: max score 6.
- Fewer than 3 meaningful desktop content objects without strong reference justification: max score 6.
- Oversized image used as filler: max score 7.
- Desktop layout feels like enlarged mobile: max score 6.
- Containers much larger than their content: max score 6.
- Dense controlled reference output becomes sparse/giant: max score 5.
- Hero consumes the screen and hides core product loop without justification: max score 6.
- Important text hard to read over image: max score 5.
- Small text over busy image without protection: max score 5.
- CTA/nav text weak contrast: max score 5.
- Selected + hover makes interactive text disappear: max score 3.
- Interactive text unreadable in hover/focus/active/selected combined states: max score 4.
- Text readable in one viewport but failing another: max score 6.
- Image-led UI without contrast strategy: max score 6.
- Focal object darkened/covered until emotional impact is lost: max score 7.
- Inconsistent image-card overlay treatments without reason: max score 7.
- Contrast depends on a lucky crop: max score 6.
- Unintended overlap/collision: max score 6.
- Mobile horizontal scroll: cap applies.
- Unreadable or clipped primary UI: prevents elite.
- Missing scorecard result: prevents elite.
- Missing validated done report for visual UI work: max score 6.
- Missing target-copy report during Literal Target Copy Mode: max score 6.
- Missing asset manifest for production image-led work: max score 6.
- Dead button in primary UI: max score 6.
- Watermark/editor/browser artifact: max score 4.
- UI count says 0 while uploaded/user data exists: max score 4.
- Upload/classify/generate core loop unverified: max score 6.
- User-generated persistence unspecified: max score 6.
- Browser chrome/dock/desktop/editor UI used as proof: max score 6.
- Dogfood target with no Design OS learning patch: max score 6.
- Parallel-product drift during target dogfood: max score 6.
- Cryptic primary navigation: max score 5.
- Nav abbreviations without obvious meaning: max score 6.
- Icon-only nav without labels/tooltips/context: max score 6.
- Broken responsive nav or nav overlap: max score 5.
- Mobile app using desktop navigation without justification: max score 5.
- Poor bottom navigation craftsmanship: max score 5.
- Top navigation stealing vertical space on mobile: max score 5.
- Bottom navigation with poor spacing/alignment: max score 5.
- Generic mobile navigation with no personality: max score 6.
- Mobile nav cryptic or cramped: max score 6.
- Misaligned search/action toolbar: max score 7.
- Toolbar controls collide or wrap badly: max score 6.
- Too much text inside dashboard containers: max score 6.
- Cards feel like prose boxes: max score 6.
- Oversized full-width button without justification: max score 7.
- Button proportions feel clumsy/amateur: max score 6.
- Overlapping containers, pills, or covered content on resize: max score 5.
- Horizontal overflow on core screens: max score 5.
- Fake live/session status UI: max score 5.
- Decorative telemetry/status chips: max score 6.
- Palette feels machine-generated/generic: max score 6.
- Random domain palette: max score 5.
- Placebo navigation: max score 3.
- Spatial label collision: max score 4.
- Ambient light blob or dotted background texture as generic atmosphere: max score 4.
- Amateur vector illustration or fake botanical/scientific plate: max score 4.
- Illustration path/callout/stem/arc crosses or clips readable text: max score 3.
- Native SVG tooltip over art-directed surface: max score 4.
- Leader line cuts a word: max score 3.
- Background reads as AI atmospheric texture: max score 5.
- Primary product object buried by support cards/panels: max score 5.
- Desktop command surface regresses into generic card soup: max score 5.
- Artistic/landing/portfolio page uses safe AI-default muddy palette without exploration: max score 6.
- Palette feels machine-generated/generic despite expressive mode: max score 5.
- No palette exploration documented for artistic/cinematic mode: max score 6.
- Color palette is readable but conceptually boring in an art-directed page: max score 7.
- Palette chosen without relation to imagery, references, or concept: max score 6.
- Bold palette used but contrast/readability fails: max score 5.
- Agent defaults to charcoal/brown/orange generated-app palette again: max score 5.
- Visual-heavy new app implemented without direction-options gate: max score 6.
- Agent provides only one direction when direction is not approved: max score 6.
- Three directions are minor variations of same layout/palette: max score 5.
- Agent codes before Migi selects direction: max score 5.
- Agent stops after selected-direction.md despite Migi choosing a direction: max workflow score 5.
- Agent asks for implementation confirmation after explicit direction selection: max workflow score 5.
- Direction gate requires redundant approval step: max workflow score 6.
- Direction options lack palette/image/layout/motion strategy: max score 6.
- Decorative circular/orbital line overlay used as atmosphere: max score 5.
- Nav unreadable over image/type/background: max score 4.
- Selected nav/tab/chip/button/card hover makes text disappear: max score 3.
- Forced app name/logo chrome without justification: max score 5.
- Decorative separator/hairline used without function: max score 5.
- Agent ignores selected direction during implementation: max score 5.
- No selected-direction.md after Migi chooses: max score 7.
- Text visibly escapes container: max score 2.
- Primary heading or important text clipped/cut off: max score 3.
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

## Safety/Scope Rules

- Do not claim "responsive" without viewport evidence.
- Do not rely on old Design OS captures as proof for the current UI.
- Do not accept browser chrome, dock, desktop, or editor UI screenshots as app QA evidence.
- Do not claim a product loop works until it has been manually verified from input through output.
- Do not claim persistence unless route changes, refresh, and browser reopen behavior are known and disclosed.
- Do not let dogfood target failures remain only in the target app; patch Miguel Design OS or name the open gap.
- Do not add external screenshot dependencies inside this skill.
- Do not claim done from build/lint alone; visual work needs screenshot evidence and a validated done report.
- Treat visual target screenshots as evidence only, never production assets.
- If the UI cannot run, report the run command, error, and best alternate evidence.

## Advanced Motion Evidence

When advanced/cinematic/artistic/portfolio motion is central, screenshot review must ask:

- Does `docs/design/motion-choreography-plan.md` exist?
- Is there a motion sequence report from `tools/capture-motion-sequence.mjs` or an honest capture blocker?
- Do static screenshots show distinct scroll states rather than the same page repeated?
- Did `skills/review-animations/SKILL.md` review the motion code?
- Was `evaluation/benchmarks/motion-cinematic.benchmark.md` used?

Hard stop: do not accept "advanced motion" from a single background animation or repeated fade-up.

## Post-Build Review Escalation

- Use `skills/evidence-backed-critique/SKILL.md` for finished-state critique when Migi asks for a critique, uploads review screenshots, or a dogfood UI needs a full score with Nielsen heuristics, cognitive load, persona red flags, and persisted snapshots.
- Use `skills/text-clarity-review/SKILL.md` before calling copy-heavy product UI final when CTAs, forms, states, errors, empty screens, settings, dashboards, or onboarding copy are visible.
- Use `skills/production-hardening-review/SKILL.md` before calling product UI production-ready, especially for dashboards, forms, modals, mobile flows, tables, maps, settings, async states, and real-world data stress.
- These reviews run after implementation or screenshot evidence, not during Fast Direction Gate.

## Visualization / Diagram Checks

- For charts, graphs, maps, diagrams, timelines, floor plans, pattern canvases, node graphs, or spatial product objects, require evidence that `skills/chart-system-director/SKILL.md` or `skills/diagram-canvas-system/SKILL.md` was used before implementation.
- Check whether labels, axes, legends, tooltips, values, units, pattern-piece names, section labels, and selected states stay readable and inside bounds.
- Check whether pattern-canvas label lanes, callout routes, badge safe zones, measurements, rulers, and construction lines remain readable without catastrophic overlap.
- Check whether selection updates inspector/details instead of acting as decoration.
- Check whether a runnable diagram/canvas used `tools/diagram-integrity-check.mjs` or documented why the detector was blocked.
- Route to `skills/data-viz-hardening-review/SKILL.md` when long labels, many objects, no data, async states, narrow widths, or accessibility stress could break the visualization.
- Stop if the chart/diagram is decorative, fake, clipped, label-colliding, color-only, or lacks a visible product question.
- Stop if the canvas feels janky, overdrawn, or performance-heavy and no rendering/performance budget is documented.

## Signature Interaction Gate

For artistic, brand, portfolio, experimental landing, playful product, and image-led sites, consult `skills/signature-interaction-director/SKILL.md` when references include memorable mechanics such as portal entry, scroll route choreography, mascot motion, scroll-assembled cards, editorial list modals, media constellations, directional page transitions, or playful entry gates.

Rules:
- Select one signature interaction before implementation, or explicitly justify why none is appropriate.
- Extract mechanics, not brand skin. Do not copy logos, mascots, names, colors, exact content, or proprietary media.
- Include the selected mechanic in the visual spec when chosen.
- Final review must check whether the signature mechanic is visible, meaningful, accessible, and supported by reduced motion.
- If no signature interaction appears after award-level references, final verdict cannot be "masterpiece."
- Generic section stack after signature references is a hard failure.

## Sepia Archive Brown Regression Check

During screenshot scoring, cap harshly if the muddy sepia/espresso/umber brown-black archive wash appears on page, stage, card, panel, note, command container, nav, sidebar, drawer, modal, framed object, or container surfaces. Visible sepia containers are a P0 blocker and cap the score at 2.

Evidence terms that do not excuse it:

- nocturne
- archive
- field guide
- botanical
- brass
- tobacco
- parchment
- vintage
- cinematic
- premium

Score rule: if visible screenshot evidence shows the banned surface family, apply the `evaluation/ui-scorecard.md` max 3 cap before taste scoring.

## Illustration-First Gate Screenshot Review

For illustration-heavy work, require screenshot or rendered proof of the isolated hero illustration before accepting full-page screenshots as final evidence.

Apply these caps:

- full page built before illustration asset passes: max score 4
- hero illustration looks amateur: max score 4
- botanical/character/object illustration uses primitive ellipses/blobs: max score 4
- no isolated illustration review before full page: max score 5
- illustration-heavy project has no style guide: max score 5

## No Ambient Background Blobs

During screenshot scoring, cap visible generic background blobs, ghost ellipses, radial glows, random translucent ovals, fake lens shapes, generic dot/star fields, decorative orbits/HUD lines, and abstract atmosphere shapes unless they are the primary product object, part of the selected signature interaction, directly derived from an approved reference mechanic, or named in the shape inventory with role, layer, and purpose.

## Native Tooltip Ban

No art-directed SVG may expose browser-native tooltips over the visual surface. If a browser-native tooltip appears in screenshot review, max score 4.

## Annotation Protected Zone

Leader lines, annotation rules, stems, connectors, and decorative lines may never cross through label text. If a leader line cuts through text, max score 3. If labels collide with art or other labels, max score 4.

## Layout Integrity Gate

Text/container integrity is mandatory. Run `skills/layout-integrity-review/SKILL.md` before final handoff when screenshots exist.

Screenshot contradiction beats agent self-report.

Hard blockers:

- any clipped text
- any word cut inside a card, sticker, nav pill, badge, button, tab, modal, or panel
- any nav label overflow
- any CTA/button label clipping
- any sticker/card/image/overlay covering headline, body, CTA, or navigation text
- huge accidental blank viewport area
- text overflow visible in screenshot

Score caps:

- critical text clipped: max score 2
- nav label overflows item: max score 3
- sticker/card covers headline word: max score 3
- button/CTA text clipped: max score 3
- unresolved text/container issue appears in screenshot: max score 3

## Elite Scroll Choreography Routing

When a landing, brand, portfolio, editorial, playful product, or video-first site depends on scroll as the experience, route to skills/elite-scroll-choreography-director/SKILL.md before implementation. The selected scroll pattern must appear in the visual spec, and skills/scroll-choreography-review/SKILL.md must run after implementation.

Block fade-only scroll when elite scroll was requested, pinned blank frames, moving objects covering critical text, horizontal routes without mobile fallback, scroll-to-assemble claims where objects do not visibly assemble, and scroll navigation that does not sync to chapters. Run layout-integrity review after scroll-choreography review.

## Audit Upgrade: Self-Correction Contract

Audit fix: Emit machine-readable verdicts and repair tasks, not only prose review.

Required evidence:
- screenshots at required breakpoints, score caps, blocker list, and `templates/skill-verdict.template.json`.

Repair routing:
- creative-orchestration-director routes every failed cap to owner skills.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "screenshot-scorecard-review"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.

## Media/Text Protected Zone Requirement

For any scroll-heavy page where video/image/media objects move, pin, scale, rotate, transform, or become interface objects:

Required before implementation:

- docs/design/protected-zone-map.md
- docs/design/media-object-stage-plan.md
- docs/design/scroll-motion-spec.md

The protected-zone map must identify:

- critical text zones
- media lanes
- start rect for media object
- end rect for media object
- forbidden overlap zones
- responsive fallback
- reduced-motion fallback

Hard rule:
No moving media object may cover critical text.

Review requirement:
Scroll choreography review must inspect scroll states for media/text collision. Layout integrity review must inspect final and intermediate states where possible. Use `design-dna/media-text-protected-zone-rules.md` and the rejected Late Check FM case study at `visual-library/rejected/case-studies/late-check-fm-scroll-media-text-collision/` as the failure memory.

Score caps to apply:

- moving video/media covers critical text: max score 3
- scroll-transformed object crosses protected text zone: max score 3
- video-to-object transform has no protected-zone map: max score 5
- media object is above text by z-index without readable surface: max score 4
- screenshot shows media/text collision: max score 3
- no scroll-state screenshots for media-heavy choreography: max score 5

## Hero-Only Media Default

For video-led pages, the default is:

1. Use video as the hero/top-stage object.
2. Remove or dock video after the hero unless a later state has an explicit role.
3. Never allow persistent media overlay to cover content.
4. Never thin content containers to fit media.
5. If media stays visible during scroll, it must live in a reserved media lane.

## Media Must Yield To Content

If media and text compete:

- text wins
- CTA wins
- navigation wins
- content card readability wins
- media moves, docks, shrinks, or exits

The agent must not preserve a media gimmick by damaging readability.

## Small-Screen Nav Clarity Requirement

For every visual/product/landing/mobile page with navigation, the agent must define:

- desktop nav variant
- tablet nav variant
- mobile/compact nav variant
- label/icon behavior
- active state behavior
- accessible labels
- hit target sizes
- overflow behavior

Compact nav must use icons or a real menu pattern. Two-letter abbreviations are not a design system.

Review requirement:

- screenshot-scorecard-review must inspect compact nav at 768 and 390
- layout-integrity-review must flag abbreviation fallback as a failure
- final-scorecard cannot pass if compact nav looks clipped, cryptic, or broken

## Final UI Integrity Gate Requirement

Before final handoff, run final-ui-integrity-gate.

The agent must not claim success if:

- clipped text remains
- overlap remains
- nav overflow remains
- media/text collision remains
- accidental blank space remains
- the user's original complaint remains true

The final review order must be:

1. build/lint
2. screenshot capture
3. scroll-choreography-review if scroll-heavy
4. layout-integrity-review
5. final-ui-integrity-gate
6. final-scorecard

## Final UI Integrity Gate v3

For visual/frontend work, final UI integrity v3 is mandatory before handoff. Screenshot evidence at only one width is insufficient.

Required v3 proof:
- Test viewport matrix: 390, 430, 640, 768, 900, 1024, 1180, 1280, 1366, 1440, 1536, 1728, 1920.
- Sample scroll positions: 0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, 1.00.
- Include applicable states: default, nav active states, selected/open detail panel, sticky/pinned active section, compact nav, and reduced motion when practical.
- Report passed and failed sampled viewport states.

Floating labels, stickers, cards, badges, props, and containers require responsive anchoring and overlap checks. Final response must not claim success if the v3 gate fails, is blocked, has blockers, has cut text, has floating overlap, has media/text collision, has nav overflow, or lacks matrix evidence.

## Final UI Integrity Gate v3

Final UI Integrity Gate v3 is mandatory. Fixed breakpoint-only evidence is insufficient. Width sweep evidence is required. Horizontal scroll must prove readable resting states. Floating objects must prove safe across resizing. Final response is forbidden unless the gate passes or clearly reports blocked/failed.

## Mobile Bottom Navigation Requirement

For mobile route/app experiences, navigation must be persistent and bottom-positioned by default. Do not accept primary mobile route navigation that appears only at the top and disappears on scroll.

Screenshot review must include:

- mobile nav after scrolling
- bottom nav safe-area handling
- active state
- icon/label readability
- accessible full-label strategy

Score caps:

- mobile route nav disappears on scroll: max score 3.
- mobile nav is top-only for app-like route experience: max score 4.
- compact nav has no bottom/persistent access: max score 4.

## Detail Reveal Spatial Context Requirement

Every selected card/item detail state must show a clear trigger/detail relationship. The selected trigger and detail panel must be connected by layout, animation, placement, or explicit selected state.

Screenshot review must include at least one open detail state when detail interactions exist. Block if the detail panel appears far from the clicked object or the user cannot tell what opened it.

## No Fake Live Affordances

Reject fake `LIVE`, fake live feed, fake realtime, fake presence, fake activity indicators, and pulsing live badges unless real realtime functionality exists.

Screenshot review must scan visible copy and status chips for fake live language.

## No AI Theater Chrome

Reject decorative `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Mission Room`, `Case File`, `CL-####`, dossier, operation, and fake severity/status chips unless they are real product objects with documented behavior.

Screenshot review must scan visible chips, nav labels, hero metadata, cards, and mobile panels for AI-theater chrome.

## Offset Container Alignment

Every layered container, media backplate, offset card, and framed object must have clean corner geometry and intentional offset alignment.

Screenshot review must inspect all four corners of layered media/containers and block messy exposed backplates, mismatched radii, and accidental leaks.

## Navigation Active State Correctness

Every nav item must be clickable and must activate itself, not an adjacent item. Active state must be keyed by stable nav id and verified by clicking every nav item.

Screenshot/review evidence must include active-state mapping, including mobile bottom nav after scroll where applicable.

First and last nav items must be included in click-through QA. Block if a trailing item such as Booking/Book never receives selected state.

## Brand Chrome Readability

App names, wordmarks, initials, logo text, and persistent brand chrome must remain readable over every background state.

Screenshot review must inspect brand chrome over dark bands, imagery, gradients, video, and scroll-changing backgrounds. Block if the app name struggles or contrast depends on a lucky crop.

## Human Dashboard Palette And Route Architecture

For dashboard and command-center screenshots, review must check whether the UI feels human-designed, not merely layout-safe.

Block or cap when:

- screenshot immediately reads as AI-created
- dashboard palette is dull robotic dark mode
- one-note blue-grey/cyan technical color does all visual identity work
- approved dashboard inspiration was available but material range, attraction zone, route focus, and panel hierarchy are missing
- too many operational processes are visible in one page
- navigation exists but does not divide work into focused route jobs

## WebGL / Shader Screenshot Evidence

When ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo effects, animated premium gradients, or shader atmospheres are used, screenshot review must require:

- desktop default
- desktop active/interactive state when applicable
- mobile default
- mobile active/interactive state when applicable
- reduced-motion/static fallback
- failed-WebGL fallback if feasible

Block or cap when the shader makes text unreadable, acts as generic filler, traps interaction, lacks bounded canvas containment, lacks fallback proof, or replaces actual product hierarchy.
