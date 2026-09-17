# visual-concept-gate

## Name

visual-concept-gate

## Description

Pre-implementation gate for visual-heavy frontend work. It forces a clear direction choice before components so the agent does not lock the product into a generic layout.

No-Image Fast Direction Gate is the default. For normal new visual-heavy work, visual-concept-gate creates concise direction cards, layout maps, risk checks, and then stops for Migi selection. It does not call paid image APIs by default.

Deep Direction Gate is opt-in only when Migi asks for deep exploration, full strategy, full spec, research pass, benchmark pass, reference decomposition, or reference-locked planning.

## Use When

- New app.
- Major screen.
- Major redesign.
- Visual-heavy interface.
- Inspiration-image driven work.
- Gallery, roster, character-select, product-discovery, or selection-first experience.
- Migi asks for a stronger visual direction.
- Visual Swarm v1 art-direction work.

## Do Not Use When

- Small bug fix.
- Security patch.
- Copy-only edit.
- Pure technical refactor.
- Tailwind migration where visual parity is the goal.
- Existing approved concept only needs implementation cleanup.

## Required Inputs

- Product type.
- Primary user.
- Primary object.
- Primary action.
- Existing UI state, if any.
- Inspiration or references, if any.
- Inspiration manifest for visual-heavy work when references are used.
- Reference folder mode, especially Command Center / Dashboard Mode when dashboard references are used.
- Reference-Locked Build Mode plan when a visual-library folder or screenshot set is the design basis: exact anchors, anchor roles, reference decomposition, and design transfer spec.
- Three-Direction Mockup Gate artifact when no visual direction is approved: `docs/design/direction-options.md`.
- No-Image Fast Direction Gate artifacts when no visual direction is approved: `docs/design/direction-options.md`, `docs/design/direction-layout-maps.md`, and `docs/design/direction-risk-check.md`.
- Global UI craft plan for dashboard or visual-heavy concepts: navigation clarity, responsive nav, toolbar alignment, text density, button proportions, collision checks, and palette direction.
- Navigation exploration plan: 3 distinct nav concepts, selected pattern candidate, desktop/tablet/mobile behavior, and CTA/nav relationship.
- Mobile product interaction plan when mobile product flow applies: modal/sheet fit, icon+label bottom nav, selected-state persistence, add/create differentiation, and control-indicator collision avoidance.
- Palette exploration plan for artistic, cinematic, landing, portfolio, creative, editorial, or experimental modes.
- Layout Integrity Contract and Responsive Breakpoint Proof plan for 1440, 1280, 1024, 768, and 390.
- Known rejected directions, if any.

## Files To Read

- `design-dna/NO_IMAGE_DIRECTION_GATE_CONTEXT.md` for normal no-image fast direction gates
- `design-dna/FAST_DIRECTION_GATE_CONTEXT.md` for shared fast-gate rules
- `design-dna/00_COMPACT_AGENT_CONTEXT.md`
- `design-dna/new-app-generation-rules.md`
- `design-dna/anti-patterns.md`
- `design-dna/rejected-directions.md` when the product has prior rejection evidence
- `evaluation/ui-scorecard.md`

## Workflow

### No-Image Fast Direction Gate - Default

Use this path unless Migi explicitly asked for a deep gate or reference-locked planning.

1. Stop before implementation.
2. Read `design-dna/NO_IMAGE_DIRECTION_GATE_CONTEXT.md` and `design-dna/FAST_DIRECTION_GATE_CONTEXT.md`.
3. Produce exactly 3 no-image direction cards:
   - Direction A - Safe Refined.
   - Direction B - Artistic Expressive.
   - Direction C - Unexpected High-Character.
4. Create `docs/design/direction-options.md`.
5. Create `docs/design/direction-layout-maps.md` with compact ASCII/block maps.
6. Create `docs/design/direction-risk-check.md`.
7. Each direction card must include name, product thesis, domain palette rationale, layout structure, navigation model, primary product object, interaction model, what it avoids, likely failure risk, implementation complexity, and recommendation score.
8. Keep each direction under 200 words.
9. Stop and ask Migi to choose A, B, C, or a hybrid.

Fast Direction Gate must not:

- create `docs/design/visual-spec.md`
- create `docs/design/design-system-tokens.md`
- create `docs/design/color-and-contrast.md`
- create `docs/design/navigation-strategy.md`
- create `docs/design/motion-choreography-plan.md`
- create an Unsplash asset manifest
- run build/lint
- edit `src`
- download production assets
- run screenshot QA

Fast Direction Gate must not call paid image APIs by default. Paid image generation may only run when Migi explicitly writes `I approve paid API image generation for this run.` and the command includes `--paid-ok`; otherwise the paid script must write `blocked-report.md` and exit nonzero.

After Migi selects A/B/C/hybrid, selection equals build approval unless Migi explicitly says planning-only/no-code/spec-only. Create `docs/design/selected-direction.md`, then continue into the full implementation pipeline.

### Deep Direction Gate - Opt In

Use this legacy/deep path only when Migi asks for deep exploration, full strategy, full spec, research pass, benchmark pass, reference decomposition, or reference-locked planning.

### Phase 1 - Direction Options

1. Stop before implementation.
2. Classify the task and record the Design Intent Record.
3. If inspiration is used, create or validate `inspiration-manifest.local.json`.
4. Name the obvious genre cliche the design must avoid.
   - For dashboard/command-center references, explicitly avoid generic admin template, same-weight card soup, text-and-metrics-only dashboard, murky monochrome / terminal-green palette, single-accent overuse, terminal-ish dark panel spam, decorative charts, chart-lite systems, image-starved surfaces, and no focal attraction zone.
   - Also avoid cryptic nav, misaligned toolbar controls, prose-heavy panels, clumsy full-width buttons, responsive collisions, fake live/session/status theater, and machine-generated palettes.
5. If Reference-Locked Build Mode is active, select 3-5 exact anchors, assign anchor roles, create `docs/design/reference-decomposition.md`, and create `docs/design/design-transfer-spec.md` before concepts are rendered.
6. Run the No-Image Fast Direction Gate before implementation when this is new visual-heavy work with no approved direction.
7. Produce exactly 3 radically different visual directions and save them in `docs/design/direction-options.md`:
   - Direction A - Safe Refined.
   - Direction B - Artistic Expressive.
   - Direction C - Unexpected High-Character.
8. Each direction must include a no-image direction card and layout map. Generated images or rendered previews are optional evidence only when explicitly approved/available; they are not required for a successful no-image gate.
9. For each concept include:
   - image path or rendered preview path
   - manifest path
   - preview route
   - screenshot files at `1440 / 768 / 390`
   - short explanation
   - visual metaphor
   - composition
   - focal object
   - emotional hook
   - hidden information
   - absent elements
   - cliche avoidance
   - desire mechanism
   - responsive strategy for `1440 / 768 / 390`
   - layout integrity strategy for `1440 / 1280 / 1024 / 768 / 390`
   - navigation concept, desktop nav behavior, mobile nav behavior, CTA/nav relationship, and default nav pattern avoided
   - Navigation Readability: whether nav overlays image/type, protection strategy, and scroll-state behavior
   - Identity Chrome: visible logo/name yes/no, why, and what is removed
   - Rejected Decorative Motifs: no decorative orbital/circular overlays, no fake HUD/radar/sonar atmosphere, no circular line filler
   - Line / Separator Strategy: whether lines are used, what they separate, and removal of decorative-only hairlines
   - Mobile Product Interaction Strategy when mobile product flow applies: modal/sheet fit, bottom-nav icons + labels, selection-state persistence, add/create action differentiation, and control-indicator collision avoidance
   - what would make it fail
   - palette direction, foreground/background contrast plan, image compatibility, and AI-default palette avoided
   - for dashboard concepts: attraction zone, panel mix, chart forms, palette strategy, image/object/media role, live/motion strategy, material range, and calm/busy rhythm
   - for dashboard or visual-heavy concepts: navigation strategy, toolbar alignment, text density, button proportions, responsive collision risks, and human palette direction
10. Save rendered-concept artifacts only when the user explicitly asked for rendered previews.
11. If a local preview is created, use a project-local preview route, static HTML, or another lightweight local render to support the direction cards. The archived `deprecated/studio-preview/` experiment is not the default workflow.
12. Capture rendered concepts with available screenshot QA only when preview artifacts were created; otherwise the no-image direction gate is complete through the direction cards and layout maps.
13. Validate generated direction manifests with `node tools/design-os.mjs validate-direction-images generated/moodboards/<slug>/manifest.json` only when paid image generation was explicitly approved and succeeds.
14. Validate rendered concepts with `node tools/design-os.mjs validate-concepts visual-concepts.local.json` or the captured run artifact when the CLI is available.
15. Stop and show Migi the directions.

### Phase 2 - Selection Received

When Migi chooses Direction A, B, C, says use/go with a direction, or selects a hybrid such as `B palette + C navigation`, that selection is approval to build unless Migi explicitly says spec only, planning only, do not implement, wait, no code yet, direction selection only, just document it, or do not edit src.

16. Create or update `docs/design/selected-direction.md`.
17. If rendered concepts were produced, set `approvalStatus: "approved"` and `selectedConceptId`.
18. Check the gate with `node tools/design-os.mjs check-visual-gate design-brief.local.json visual-concepts.local.json` when visual-concepts artifacts exist.
19. Continue immediately into `docs/design/visual-spec.md`.
20. Create `docs/design/design-system-tokens.md`.
21. Create `docs/design/color-and-contrast.md` or an equivalent project palette doc.
22. Create `docs/design/navigation-strategy.md` for visual-heavy work.
23. Create `docs/design/motion-choreography-plan.md` when advanced motion is requested.
24. Create `docs/qa/anti-ai-tell-preflight.md` for landing, portfolio, marketing, or redesign work.
25. Implement only the selected direction.
26. Run build/lint, screenshot QA when available, scorecard/done report, and return the local UI URL if a dev server is started.

## Stop Conditions

- Stop before UI implementation if no concept has been approved.
- Stop before UI implementation if `docs/design/direction-options.md` is missing when the Three-Direction Mockup Gate applies.
- Stop before UI implementation if `docs/design/direction-options.md`, `docs/design/direction-layout-maps.md`, or `docs/design/direction-risk-check.md` are missing when No-Image Fast Direction Gate applies.
- Stop if Fast Direction Gate creates visual specs, token docs, navigation plans, motion plans, QA docs, build/lint reports, screenshots, production assets, or frontend code before selection.
- Stop if paid image generation runs without Migi's exact written approval and `--paid-ok`.
- Stop if the no-image direction gate lacks layout maps.
- Stop if no-image directions are vague vibes instead of concrete buildable cards.
- Stop if no-image directions do not identify the primary product object.
- Stop before UI implementation if Migi has not selected a direction.
- Stop before UI implementation if `docs/design/selected-direction.md` is missing after Migi chooses.
- Stop if Reference-Locked Build Mode is active but exact anchors, reference decomposition, or design transfer spec are missing.
- Stop if concepts are generated from folder vibe instead of selected anchor mechanics.
- Stop if direction cards are vague and not concrete enough to build from.
- Stop if artistic/landing/portfolio/cinematic/experimental concepts lack safe refined, artistic expressive, and unexpected high-character palette exploration.
- Stop if dashboard concepts are only dark cards, metrics, and generic charts with no attraction zone, panel-role variation, palette strategy, graph system, or image/object/media strategy.
- Stop if dashboard concepts use lifeless same-color panels with weak charts and no visual anchor.
- Stop if dashboard concepts rely on cryptic navigation, fake status theater, misaligned toolbars, prose-heavy cards, clumsy full-width buttons, or robotic palette direction.
- Stop if concepts do not explain how cards, charts, labels, nav, badges, forms, and buttons preserve layout integrity across 1440 / 1280 / 1024 / 768 / 390.
- Stop if a concept depends on squeezing the desktop layout until cards, charts, labels, or nav become unreadable.
- Stop if all three direction options use the same navigation structure.
- Stop if nav readability over image/type/scroll states is not discussed.
- Stop if app-name/logo/initials chrome appears by default without justification.
- Stop if decorative circular/orbital/radar/HUD overlays appear without explicit Migi approval and functional meaning.
- Stop if decorative separator lines, red hairlines, label rails, or ornamental ticks appear as filler.
- Stop if mobile product concepts omit modal/sheet fit, bottom-nav icon+label strategy, selection-state persistence, add/create differentiation, or control-indicator collision prevention.
- Stop if visual-heavy concepts use generic top navigation without a documented navigation strategy.
- Stop if no-image direction cards are missing compact layout maps, primary product object, domain palette rationale, nav state effect, interaction promises, risk, complexity, and recommendation.
- Stop if rendered preview artifacts were promised but preview routes or screenshot paths are missing.
- Stop if `tools/capture-concepts.mjs` cannot produce screenshots for rendered previews and no blocker is documented.
- Stop if visual-heavy inspiration work has no inspiration manifest.
- Stop and ask for approval only after presenting the 3 rendered concepts in Phase 1.
- Stop and mark a workflow failure if the agent asks for implementation permission after Migi already selected A, B, C, or a hybrid, unless Migi explicitly requested planning-only/spec-only/no-code.
- Stop polishing if Migi rejects the visual direction; return to concept generation.

## Output Contract

```md
Design Intent Record:
Obvious cliche to avoid:
Reference-Locked Build Mode:
Reference anchors:
Reference decomposition:
Design transfer spec:
Dashboard command-surface strategy when applicable:
Dashboard palette / graph / media strategy when applicable:
Navigation / toolbar / text density / button / collision / palette craft strategy when applicable:
Navigation concepts:
Selected navigation pattern:
Navigation readability:
Identity chrome:
Decorative geometry:
Line / separator strategy:
Modal / sheet fit:
Mobile bottom nav icons + labels:
Selection state persistence:
Add/create action differentiation:
Control indicator collision avoidance:
Layout integrity contract:
Responsive breakpoint proof:
Concept artifact:
- concept count: 3
- strict 3-image direction gate:
- no-image direction gate:
- direction layout maps path:
- direction risk check path:
- generated direction images path: only if paid image generation was explicitly approved
- generated image manifest: only if paid image generation was explicitly approved
- direction options path:
- selected direction path:
- preview routes:
- screenshots at 1440 / 768 / 390:
Concept 1 - Safe expected direction preview:
Concept 2 - More original/art-directed direction preview:
Concept 3 - Wild but controlled direction preview:
Recommended concept:
Approval needed before implementation: yes during Phase 1 only
Direction selection means build:
Selected direction becomes implementation source of truth:
Implementation continuation started:
```

## Scorecard Blockers

- Visual Concept Gate skipped for visual-heavy work: max score 6.
- Fast Direction Gate skipped for new visual-heavy work: max score 5.
- Paid API image generation runs without explicit Migi approval: max score 2.
- Paid API key required for default workflow: max score 4.
- Direction gate fails because image API is unavailable: max score 5.
- No-image direction gate lacks layout maps: max score 6.
- No-image direction gate produces vague vibes only: max score 5.
- No-image direction gate has no primary product object: max score 6.
- Visual-heavy new app implemented without direction-options gate: max score 6.
- Agent provides only one direction when direction is not approved: max score 6.
- Three directions are minor variations of same layout/palette: max score 5.
- Agent codes before Migi selects direction: max score 5.
- Agent stops after selected-direction.md despite Migi choosing a direction: max score 5.
- Agent asks for implementation confirmation after explicit direction selection: max score 5.
- Direction gate requires a redundant approval step: max score 6.
- Direction options lack palette/image/layout/motion strategy: max score 6.
- Direction options lack navigation concept, desktop/mobile behavior, or CTA/nav relationship: max score 6.
- Direction options omit navigation readability, identity chrome, decorative geometry, or line/divider strategy: max score 6.
- Mobile product direction options omit modal fit, bottom-nav icon+label strategy, selection persistence, add-action differentiation, or control-indicator collision checks: max score 6.
- Direction uses decorative orbital/circular/HUD motif without function: max score 5.
- Direction uses forced app-name/logo chrome by default: max score 5.
- Direction uses decorative separator hairlines as filler: max score 5.
- Three direction options all use the same navigation structure: max score 5.
- Agent ignores selected direction during implementation: max score 5.
- No selected-direction.md after Migi chooses: max score 7.
- Text-only concepts for visual-heavy work: max score 5.
- Text-only concepts used while image/prototype generation was available: max score 5.
- Migi asked to approve art direction without visual previews: max score 5.
- Concept screenshots missing: max score 6.
- Implementation started before visual concept approval: max score 6.
- All 3 concepts share basically the same layout: max score 6.
- Visual-library folder used but no reference anchors selected: max score 5.
- No reference decomposition before concept/build work: max score 5.
- No design transfer spec before concept/build work: max score 5.
- Concept copies mood but not anchor composition/mechanics: max score 6.
- Same rejected layout with new paint: max score 6.
- Obvious genre cliche without a fresh thesis: max score 7.
- Dashboard concept is generic admin/card soup: max score 6.
- Dashboard concept has no attraction zone: max score 6.
- Dashboard concept uses decorative charts instead of useful visualization: max score 6.
- Dashboard concept uses murky monochrome / terminal-green palette: max score 5.
- Dashboard concept has too few meaningful chart forms despite graph-rich references: max score 6.
- Dashboard concept is image-starved despite reference evidence: max score 6.
- Dashboard concept has cryptic nav, fake status theater, or machine-generated palette: max score 6.
- Artistic/landing/portfolio concept uses safe AI-default muddy palette without exploration: max score 6.
- Palette feels machine-generated/generic despite expressive mode: max score 5.
- No palette exploration documented for artistic/cinematic mode: max score 6.
- Bold palette used but contrast/readability fails: max score 5.
- Dashboard concept has misaligned toolbar, prose-heavy panels, clumsy full-width buttons, or responsive collision risks with no plan: max score 6.
- Concept has no layout integrity strategy for cards/charts/nav/labels across breakpoints: max score 6.
- Concept relies on squeezed cards, clipped labels, or one-viewport responsiveness: max score 5.
- No project-specific visual identity: cap applies.
- No inspiration manifest for visual-heavy inspiration work: max score 7.

## Safety/Scope Rules

- Do not code major UI before Phase 1 direction approval.
- Do not stop after `docs/design/selected-direction.md` once Migi has selected a direction unless Migi explicitly requested planning-only/spec-only/no-code.
- Do not turn one rejected app direction into a universal style ban.
- Do not force every future app to be dark, cinematic, game-like, glassy, or playful.
- Do not copy a source project or inspiration reference literally.
- Do not use inspiration screenshots as production assets.
- Do not build or revive a frontend Studio app just to satisfy this gate. A project-local static preview or screenshot-backed reference note is enough when it proves the visual direction.

## Audit Upgrade: Self-Correction Contract

Audit fix: Tie direction cards to downstream proof, not just selection.

Required evidence:
- direction-options, layout maps, risk check, selected-direction when chosen, and next proof gates named.

Repair routing:
- visual-spec-compiler owns missing build spec; screenshot-scorecard-review owns missing proof; creative-orchestration-director owns unresolved gate gaps.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "visual-concept-gate"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
