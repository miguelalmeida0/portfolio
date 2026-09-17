# Codex Visual Review Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Selected mode:
Visual Review / Anti-Slop

Required files to read:

- `AGENTS.md`
- `evaluation/ui-scorecard.md`
- `skills/screenshot-scorecard-review/SKILL.md`
- `skills/anti-ai-slop-review/SKILL.md`
- `skills/frontend-art-director-review/SKILL.md`
- `skills/oklch-contrast-palette/SKILL.md` when palette/contrast/dark mode/color accessibility matters
- `skills/userinterface-wiki/SKILL.md` for broad UI craft, typography, pseudo-elements, audio, UX laws, or perceived performance
- `skills/make-interfaces-feel-better/SKILL.md` when the UI works but feels stiff, dead, generic, or unresponsive
- `skills/anti-ai-tell-preflight/SKILL.md` for landing, portfolio, marketing, or redesign UI
- `skills/review-animations/SKILL.md` and `skills/review-animations/STANDARDS.md` when motion code changed
- `skills/emil-design-engineering/SKILL.md` for component craft and invisible polish review
- `design-dna/brief-inference-rules.md`
- `design-dna/anti-ai-tell-preflight.md`
- `design-dna/motion-and-delight-rules.md`
- `design-dna/design-system-first-rules.md`
- `design-dna/art-directed-palette-exploration.md`
- `design-dna/unsplash-asset-sourcing-rules.md` when real imagery or Unsplash assets are visible

Review against:

- active dials
- reference anchors
- direction options and selected direction when the Three-Direction Mockup Gate applies
- visual spec completeness
- design-system tokens
- layout integrity
- interaction completeness
- mobile fit
- chart intelligence
- chart/diagram/canvas system integrity
- diagram integrity detector evidence or blocked report when runnable spatial UI exists
- clipped primary text, catastrophic diagram overlap, and canvas performance budget
- palette intelligence
- palette exploration for artistic/cinematic/landing/portfolio/experimental work
- strict rejection of sepia/espresso/umber brown-black archive wash and any nocturne/archive/field-guide rationale for it
- Unsplash search plan and asset manifest when real imagery or Unsplash assets are used
- image source truth, alt text, crop quality, palette relationship, and text safe zones
- navigation strategy, selected navigation pattern, CTA/nav relationship, active/focus states, and whether nav supports the visual thesis
- navigation readability over images, giant type, video, gradients, and scroll-state backgrounds
- identity chrome decision: no forced app-name/logo/initials chrome without justification
- decorative geometry: no circular/orbital/radar/HUD line overlays unless functional and approved
- line/divider strategy: no decorative hairline, red divider, label rail, or section-label-plus-line filler
- modal/sheet fit, safe-area behavior, and visible/reachable actions for mobile overlays
- bottom nav icon + label strategy for practical mobile product apps
- selection state persistence for chips/tabs/items/object selectors
- control decoration collision: no active/progress/underline bars overlapping labels
- add/create action differentiation from content cards
- OKLCH/APCA contrast targets and lightness repair
- active feedback, focus states, loading/empty/error states, and interface feel
- brief inference quality
- anti-AI-tell compliance
- motion purpose, duration, easing, reduced-motion behavior
- advanced motion choreography plan, five motion layers, section map, and motion evidence when advanced/cinematic/portfolio motion is central
- delight appropriateness
- screenshot evidence

Evidence requirements:

- inspect screenshots at available breakpoints
- name score caps
- do not count build/lint as visual QA

Final response contract:

- findings first
- score caps applied
- design read / preflight status
- direction gate status
- no-image fast direction gate status for new visual-heavy work
- direction layout maps / risk check status
- paid image generation status
- Figma cost safety status: no Figma AI, Weave, Make, paid generation, AI credits, Motion, Draw, Dev Mode-only, or paid-seat feature used automatically
- palette exploration status
- Unsplash asset sourcing status if applicable
- navigation art-direction status
- navigation readability status
- identity chrome status
- decorative geometry / line-divider blockers
- mobile product blockers: sheet fit, nav icons+labels, selected state, control indicator collision, add action differentiation
- motion review verdict if applicable
- advanced motion benchmark status if applicable
- OKLCH/APCA issues if applicable
- interface-feel blockers if applicable
- files or screenshots referenced
- fixes required before done
- remaining manual checks
