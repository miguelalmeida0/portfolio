# Design-System-First Rules

Before significant UI implementation, define the design system direction.

## Hard Rule

No significant UI implementation before design-system direction exists.

Define:

- semantic color tokens
- OKLCH/APCA contrast targets for foreground/background pairs
- state contrast matrix for default, hover, focus-visible, active/pressed, selected, selected+hover, selected+focus, and disabled foreground/background pairs
- domain palette fit: product domain, user environment, task pressure, emotional state, and state color semantics
- palette exploration for artistic, cinematic, landing, portfolio, creative, editorial, and experimental modes
- typography roles
- spacing scale
- radius logic
- shadow/elevation logic
- border/divider logic
- chart colors
- visualization/diagram color encodings and non-color fallbacks
- state colors
- component variants
- image treatment
- motion rules
- copy/state language roles for CTAs, empty states, loading states, errors, success, and destructive actions
- production resilience rules for long text, missing data, translations, focus, reduced motion, and small viewports

## Forbidden

- ad-hoc random colors
- one-off Tailwind chaos
- color names as component logic
- unplanned gradient usage
- every component inventing its own radius
- arbitrary shadows
- chart colors disconnected from state colors
- buttons, chips, inputs, and cards with unrelated proportions
- visible UI generated before tokens exist
- trial-and-error hex tweaks without OKLCH/APCA contrast reasoning
- contrast repairs made by changing chroma/saturation instead of OKLCH lightness
- interactive labels that become unreadable in hover, focus-visible, active/pressed, selected, selected+hover, or selected+focus states
- safe AI-default muddy palettes in expressive modes without documented exploration
- random "looks cool" palettes that do not fit the product domain
- design systems that only work for perfect demo copy or perfect mock data
- component variants with no empty, loading, error, disabled, focused, selected, hover, active/pressed, selected+hover, selected+focus, or overflow behavior

## Required Token Roles

Colors:

- `bg`
- `surface`
- `surface-raised`
- `surface-muted`
- `text`
- `text-muted`
- `border`
- `accent`
- `accent-contrast`
- `success`
- `warning`
- `danger`
- `focus`

For each major foreground/background pair, document:

- APCA target
- WCAG 2 target when formal compliance is claimed
- OKLCH lightness relationship
- repair plan if it fails

For expressive visual modes, document:

- safe refined palette option
- artistic expressive palette option
- unexpected high-character palette option
- selected palette and why
- AI-default palette avoided

For every product UI, document:

- product domain
- user environment
- task pressure
- emotional state
- state color semantics
- palette choices rejected because they are random, imported, or domain-mismatched

Typography:

- display
- title
- section heading
- body
- caption
- label
- button
- data numeral

Components:

- primary button
- secondary button
- tertiary/icon button
- input/search
- card/panel
- chip/tag
- nav item
- tab/segmented control
- chart container
- diagram/canvas container
- legend
- tooltip
- selected spatial object
- inspector/details panel
- image/media frame

States and copy:

- loading
- success
- empty
- error with retry
- permission denied
- disabled
- focused
- selected
- destructive confirmation
- long label / truncated label
- translated label

## Post-Build Review Hooks

Before calling a product UI final or production-ready, route to the appropriate post-build layers:

- `skills/text-clarity-review/SKILL.md` when visible copy, CTAs, forms, state messages, errors, empty states, onboarding, settings, dashboards, or product flows need clarity.
- `skills/production-hardening-review/SKILL.md` when the UI must survive long text, missing data, async states, translation expansion, accessibility, large datasets, or responsive stress.
- `skills/evidence-backed-critique/SKILL.md` when a finished UI needs a full evidence-backed critique with heuristic scoring, cognitive load, persona red flags, and a persisted snapshot.

These are post-build review layers. Do not run them during Fast Direction Gate.

## Chart Color Rules

Chart colors must be:

- distinct from action colors unless intentionally linked
- accessible beyond color alone
- labeled or patterned where needed
- bounded by chart role and state meaning

## Visualization / Diagram System Rules

For any chart, graph, diagram, map, timeline, spatial canvas, or product object surface, define:

- visualization intent and user question
- data contract with fields, types, units, ranges, missing/null behavior, and mock-data truth
- chart/diagram tool choice from `design-intelligence/visualization-tool-routing.md`
- axis, scale, label, legend, tooltip, and state color tokens
- empty, loading, error, stale, and no-permission states when async
- color-independent encoding for important states
- responsive behavior at 1440, 1280, 1024, 768, and 390 when relevant
- accessible text summary or table fallback where needed

For spatial/canvas systems, also define:

- coordinate system
- canvas bounds
- layer model
- object model
- label safe zones
- collision strategy
- selection/inspector state
- zoom/pan/reset controls if needed
- mobile fallback when the canvas cannot remain useful
- `data-diagram-*` hooks or equivalent QA affordances when diagram integrity checks are practical

## Image Treatment Rules

Define:

- image role
- crop ratio
- focal object protection
- text safe zone
- scrim/plate/mask usage
- production asset hygiene

## Motion Rules

Motion must clarify:

- hover
- selection
- navigation
- loading
- success/error
- progress
- live/fresh state

Decorative motion does not count.

## Output

For visual-heavy work, include a design-system section in `docs/design/visual-spec.md` or create `docs/design/design-system-direction.md`.

## Semantic Token Template

Use this as the minimum token contract before significant UI:

```md
## Design System Direction

### Semantic Colors
- `bg`:
- `surface`:
- `surface-raised`:
- `surface-muted`:
- `surface-active`:
- `text`:
- `text-muted`:
- `text-subtle`:
- `border`:
- `divider`:
- `accent`:
- `accent-muted`:
- `accent-contrast`:
- `success`:
- `warning`:
- `danger`:
- `focus`:

### Palette Exploration
- product domain:
- user environment:
- task pressure:
- emotional state:
- state color semantics:
- safe refined palette:
- artistic expressive palette:
- unexpected high-character palette:
- selected palette:
- why selected:
- why this palette fits the domain:
- AI-default palette avoided:
- random/cool palette rejected:

### Typography Roles
- display:
- title:
- section heading:
- body:
- compact body:
- caption:
- label:
- button:
- data numeral:

### Layout Tokens
- spacing scale:
- page margin:
- section gap:
- panel padding:
- card gap:
- control height:
- touch target:

### Shape / Surface
- radius small:
- radius medium:
- radius large:
- radius pill:
- shadow/elevation:
- border/divider logic:

### Components
- primary button:
- secondary button:
- tertiary/icon button:
- input/search:
- card/panel:
- chip/tag:
- nav item:
- tab/segmented control:
- chart container:
- image/media frame:

### Image / Motion
- image treatment:
- crop/focal protection:
- text-over-image protection:
- motion duration/easing:
- reduced-motion fallback:

### OKLCH / Contrast
- APCA normal text target:
- APCA large text target:
- APCA UI component target:
- WCAG target if formal compliance is claimed:
- numeric palette scale:
- dark-mode token mapping:
- hue drift risk:
- lightness repair rule:
```

## Dashboard Token Template

Dashboard tokens must support density, graph richness, and mixed materials:

```md
## Dashboard Tokens
- base surface:
- quiet utility surface:
- raised panel:
- active/selected panel:
- media/object panel:
- data panel:
- major chart colors:
- supporting chart colors:
- microchart colors:
- state colors:
- anomaly/alert color:
- gridline/divider color:
- data numeral role:
- compact label role:
- panel radius:
- chart radius:
- dense spacing:
- toolbar/control height:
- nav selected state:
```

Rules:

- Do not use one accent everywhere.
- Do not let charts invent unrelated colors.
- Define data, state, and action colors separately.

## Landing Page Token Template

Landing/poster tokens must support image-led atmosphere without Blogspot structure:

```md
## Landing / Poster Tokens
- page background:
- image environment treatment:
- hero text role:
- supporting copy role:
- CTA primary:
- CTA secondary:
- text safe-zone treatment:
- scrim/plate/mask:
- section rhythm:
- editorial fragment treatment:
- atmospheric layer:
- navigation chrome:
- mobile hero crop:
```

Rules:

- Sparse copy still needs contrast protection.
- Image role must be defined before layout.
- Large type must be calibrated, not inflated.

## Mobile Token Template

Mobile tokens must feel native and usable at 390:

```md
## Mobile Tokens
- platform mode:
- safe-area padding:
- screen background:
- surface:
- bottom nav height:
- selected nav item:
- primary thumb action:
- secondary action:
- touch target:
- card radius:
- list row height:
- modal/sheet radius:
- swipe/gesture feedback:
- haptic/motion fallback:
- 390 typography scale:
```

Rules:

- Do not shrink desktop tokens onto a phone.
- Bottom/compact nav needs its own selected-state and spacing model.
- Touch targets must remain comfortable.

## Chart Token Template

Chart tokens must encode meaning and accessibility:

```md
## Chart Tokens
- chart background:
- plot area:
- gridline:
- axis text:
- label text:
- primary series:
- secondary series:
- comparison series:
- target marker:
- threshold band:
- anomaly marker:
- forecast style:
- confidence band:
- categorical palette:
- sequential palette:
- divergent palette:
- hover/focus style:
- table fallback:
```

Rules:

- Use line style, shape, label, or pattern in addition to color when needed.
- Every complex chart needs a fallback/table strategy.
- Decorative chart wallpaper is rejected.
