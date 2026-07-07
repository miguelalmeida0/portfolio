# Visual Spec

## Project
- Name:
- Path:
- Task mode:
- Primary user:
- Primary object:
- Primary action:

## Active Dials
- DESIGN_VARIANCE:
- MOTION_INTENSITY:
- VISUAL_DENSITY:
- ART_DIRECTION:
- IMAGE_USAGE_PRIORITY:
- IMPLEMENTATION_CLARITY:
- MOBILE_NATIVE_FEEL:
- GRAPH_COMPLEXITY:

## References
- Reference folder:
- Reference anchors:
- Image-first sources:
- What will not be copied:

## Direction Gate Summary
- Generated images path:
- Generated image manifest:
- Direction options path:
- Selected direction path:
- Directions proposed:
- Selected direction:
- What was rejected:
- What was hybridized:
- Why this direction won:
- Primary visual north star image:
- What parts of generated images must not be copied literally:

## Visual Thesis
- One-sentence thesis:
- Emotional hook:
- Aha moment:
- Forbidden drift:

## Layout
- Layout recipe:
- Shell/nav:
- Focal zone:
- Supporting zones:
- Responsive strategy:

## Navigation Strategy
Required for visual-heavy work with navigation.

- Navigation strategy path:
- Primary destinations:
- Secondary destinations:
- Navigation concept options:
- Selected navigation pattern:
- Desktop behavior:
- Tablet behavior:
- Mobile behavior:
- CTA behavior:
- Active state:
- Focus state:
- Accessibility:
- What generic nav default is avoided:

## Navigation Readability Strategy
Required when navigation overlaps images, large type, video, gradients, or changing scroll backgrounds.

- Does nav overlap images/type?:
- Background states:
- Contrast protection:
- Scroll-state behavior:
- Active/focus state:
- Mobile behavior:
- Readability risk:
- Screenshot checks:

## Identity / Brand Chrome Decision
- Visible logo/name needed? yes/no:
- Why:
- Where identity appears:
- What identity chrome is removed:
- Does nav need the app name?:
- Does hero already carry identity?:
- Migi preference considered:

## Design System
- Color tokens:
- Typography roles:
- Spacing scale:
- Radius logic:
- Shadow/elevation:
- Border/divider logic:
- Component variants:
- Motion rules:

## Domain Content Contract
Required for every app, dashboard, product UI, mobile flow, and dogfood project.

- Business type:
- Primary users:
- User decisions:
- Core entities:
- Entity relationships:
- Real pages/routes:
- Route jobs:
- Mock data files or fixtures:
- Mock data schema:
- Sample records:
- Metric definitions:
- Units/ranges/time windows:
- Statuses and meanings:
- Source/freshness/sample labels:
- Banned generic terms:
- Replacement domain terms:
- Terms justified by domain/data contract:

## Domain Palette Fit
Required for every product UI.

- Product domain:
- User environment:
- Task pressure:
- Emotional state:
- Domain colors to use:
- Domain colors to avoid:
- State color semantics:
- Why the palette fits this product:
- What random/cool palette was rejected:

## No Placebo Navigation Contract
Required when navigation, tabs, filters, or segmented controls are present.

- Nav/tabs/segmented controls:
- Visible content change for each:
- Route/scope/filter/state change for each:
- Unimplemented destinations removed or disabled:
- Active state matches visible product state:

## Spatial Label Safe Zones
Required for maps, floor plans, seating charts, route boards, timelines, diagrams, pattern canvases, node graphs, and canvas-like product objects.

- Spatial surface type:
- Primary product object:
- Coordinate system:
- Canvas bounds:
- Layer model:
- Object model:
- Labels needing protection:
- Label lanes:
- Callout routes:
- Badge/status safe zones:
- Construction-line semantics:
- Object/card collision risks:
- Safe-zone rules:
- Z-index/layer rules:
- Dynamic collision strategy:
- Performance budget:
- Rendering layer:
- Diagram integrity QA:
- `data-diagram-*` hooks:
- Detector blocked reason if any:
- Selection/inspector behavior:
- Zoom/pan/reset behavior if needed:
- Responsive fallback:
- Screenshot checks:

## WebGL / Shader Primitive Plan
Required if using WebGL, shaders, ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo effects, animated premium gradients, or shader atmospheres.

- Primitive:
- Exact section/component:
- Product/concept reason:
- Non-WebGL alternative rejected:
- Dependency/version plan:
- Client-only boundary:
- Static fallback:
- Reduced-motion fallback:
- Mobile fallback/reduced complexity:
- Canvas/GPU bounds:
- Z-index containment:
- Pointer-event strategy:
- Fake-live/status avoidance:
- Performance budget:
- Screenshot proof:
- Liquid Logo reference/adaptation notes if relevant:

## Anime.js Motion Primitive Plan
Required if using Anime.js, timeline choreography, staggered DOM/SVG/object motion, CSS variable animation, weather/terrarium particles, selected-state transitions, rail/detail continuity, or tactile JavaScript feedback.

- Why CSS is not enough:
- Components using Anime.js:
- Animations staying CSS-only:
- Signature motion moment:
- Timeline/stagger/SVG/CSS-variable need:
- Scoped root refs:
- Client-only boundary:
- Cleanup plan:
- Reduced-motion fallback:
- Static fallback:
- Mobile behavior:
- Fake-live/status avoidance:
- Unsafe-scroll avoidance:
- Performance budget:
- Screenshot proof:

## Desktop Command Surface Primary Object
Required for desktop command surfaces and operational products.

- Primary product object:
- Why it owns the screen:
- Support panels:
- Inspector/queue/control roles:
- How panels avoid burying the object:
- Generic card-soup route avoided:

## Human Dashboard Palette Strategy
Required for dashboards, command centers, incident tools, and operational products.

- Approved dashboard palette references:
- Product domain fit:
- User environment / task pressure:
- Surface hierarchy:
- Accent roles:
- Status color semantics:
- OKLCH/APCA contrast logic:
- AI palette avoided:
- Sepia/espresso/umber container surfaces avoided:
- How this avoids robotic dark dashboard defaults:

## Dashboard Route Architecture
Required for complex dashboards and operational products.

- Task inventory:
- Route map:
- Route jobs:
- Primary job per route:

## No AI Theater Chrome
Required for incident, operations, dashboard, observability, investigation, and narrative-prone product UI.

- Any `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Case File`, `CL-####`, dossier, operation, or fake severity/status language?:
- Real product behavior/data source if yes:
- User task it supports:
- Replacement plain route/task labels:
- Oversized metadata strip avoided:
- Fake case-file identifier avoided:
- Overview vs analysis vs decision/action split:
- Mobile route/mode:
- How the design avoids one-page process pileup:
- How selected nav changes visible product scope:

## Decorative Geometry Strategy
- Are decorative circles/orbits/radar lines used?:
- If yes, are they functional?:
- What do they represent?:
- Did Migi explicitly request them?:
- If decorative only, remove them:
- Alternative background/composition strategy:
- Default for Migi projects: Decorative circular/orbital overlays are not used.

## Line / Divider Strategy
- Are lines used?:
- Functional or decorative?:
- What do they separate?:
- Do they align to real layout boundaries?:
- Are any decorative hairlines removed?:
- Alternative hierarchy method:
- Default for Migi projects: No decorative hairline ornaments are used.

## Palette Exploration
Required for artistic / cinematic / landing / portfolio / experimental work.

### Palette Direction A: Safe Refined
- colors:
- mood:
- image compatibility:
- contrast risks:
- why it works:

### Palette Direction B: Artistic Expressive
- colors:
- mood:
- image compatibility:
- contrast risks:
- why it works:

### Palette Direction C: Unexpected High-Character
- colors:
- mood:
- image compatibility:
- contrast risks:
- why it works:

### Selected Palette
- chosen direction:
- why selected:
- why not the others:
- semantic tokens:
- OKLCH/APCA contrast notes:
- what AI-default palette it avoids:

## Images / Media
- Major image roles:
- Environment vs asset:
- Crop strategy:
- Text safe zones:
- Asset hygiene notes:

## Unsplash Asset Sourcing
Required when real imagery, Unsplash, or source-image roles are needed.

- Real imagery required?:
- Image roles:
- Search plan path:
- Asset manifest path:
- Query/orientation/color/content_filter/order_by strategy:
- Local vs remote image policy:
- Source/photographer/download metadata:
- Alt text plan:
- Crop/responsive strategy:
- Text safe zones:
- Palette relationship:
- Product-truth constraints:
- Rejected generic/filler image types:

## Charts / Data
- Visualization intent / user question:
- Data contract:
- Chart data shapes:
- Major chart:
- Supporting charts:
- Visualization tool/library:
- Chart rationale:
- Axis/scale plan:
- Label/legend/tooltip plan:
- Empty/loading/error states:
- Accessibility fallback:
- Chart bounds:
- Diagram/canvas integrity check if relevant:
- Data-viz hardening risks:

## Mobile
- Mobile native feel:
- Bottom/compact nav:
- Thumb targets:
- Safe areas:
- 390 layout:

## Modal / Sheet Fit Strategy
Required for mobile modals, drawers, bottom sheets, or detail panels.

- Modal type:
- Viewport max-height:
- Internal scroll behavior:
- Action placement:
- Safe-area handling:
- Close/dismiss behavior:
- Relationship to bottom nav:
- 390px check:
- Failure risks:

## Mobile Navigation Icon Strategy
Required for practical mobile product bottom navigation.

- Nav destinations:
- Icon family:
- Icon per destination:
- Label per destination:
- Active state:
- Badge/counter behavior:
- Touch target:
- Safe-area handling:

## Selection State Strategy
Required for chips, tabs, filters, object selectors, category selectors, segmented controls, or selectable list/cards.

- Selectable controls:
- Selected state:
- Hover state:
- Pressed state:
- Focus state:
- Disabled state if any:
- Persistence behavior:
- Accessibility attributes:
- Local state source:

## Control Decoration Collision Check
- Active indicators:
- Underlines/progress strips:
- Label safe zones:
- Long-label behavior:
- Alternative state treatment if bars do not fit:

## Add / Create Action Strategy
- Where add action lives:
- Visual treatment:
- How it differs from content cards:
- Icon:
- Label:
- Interaction:
- Empty state:
- Risk of confusion:

## Interactions
- Local/mock data:
- Domain Content Contract path:
- Visible controls:
- Core loop:
- Export/copy/download:
- Empty/loading/error:

## Evidence Plan
- Build/lint:
- Screenshots:
- Visual QA:
- Scorecard:
- Done report:
