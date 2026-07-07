# WebGL / Shader Visual Primitive Rules

ShaderGradient, React Three Fiber, and Liquid Logo-style effects are experimental elite visual primitives.

WebGL is not taste by default.

Shader effects must never replace layout, typography, hierarchy, accessibility, responsiveness, product clarity, or real content.

## Purpose

ShaderGradient, React Three Fiber, and Liquid Logo-style effects are allowed only when they strengthen the concept.

They are not default decoration.

For typography-led motion sites, also inspect `design-dna/typographic-motion-site-rules.md` and `skills/typographic-motion-art-director/SKILL.md`. WebGL/shaders are implementation primitives; Typographic Motion Site is art direction.

## Allowed Use Cases

- atmospheric hero backgrounds
- premium animated gradients
- product-specific visual identity moments
- object or scene previews
- logo identity experiments
- ambient state transitions
- concept-driven visual storytelling

## Forbidden Use Cases

- hiding weak layout behind shaders
- generic "cool background" decoration
- fake live/data effects
- unreadable text over motion
- scrolljacking
- fragile pinned scenes
- full-page GPU effects on every section
- effects that break mobile
- effects that ignore reduced motion
- effects without static fallback
- effects that make the UI feel like a tech demo instead of a product

## Design OS Constraints

Every shader/WebGL component must have:

- static fallback
- reduced-motion fallback
- mobile fallback or reduced complexity
- clear z-index containment
- no pointer-event traps
- bounded GPU/canvas area
- no blocking of primary content
- no hidden content dependent on shader timing
- no fake live affordance
- screenshot proof
- performance note

## Interaction Constraints

Shader effects can respond to:

- selected state
- hover/focus state
- route/section state
- theme/room/product state
- static local replay state

Shader effects must not pretend to be:

- live system status
- live weather
- real-time telemetry
- online presence
- production connection state

Unless the app truly implements that behavior.

## Layout Constraints

Canvas/WebGL layers are supporting surfaces.

They must not own layout.

DOM content must remain readable and accessible without WebGL.

Canvas layers must sit inside a bounded container with explicit dimensions, overflow strategy, z-index role, and `pointer-events: none` unless the canvas is intentionally interactive.

## Dependency Constraints

Install WebGL visual dependencies in the target generated/dogfood project, not in Miguel Design OS, unless Design OS itself becomes a runtime package.

React compatibility must be checked before install:

- React 19 / Next 15 App Router: use React Three Fiber v9.
- React 18: use React Three Fiber v8-compatible versions unless the project already supports v9.

Liquid Logo is a source/reference kit, not a normal package dependency.

Do not run `npm i liquid-logo`.

## QA Constraints

Every project using these primitives must capture screenshots for:

- desktop default
- desktop active/interactive state
- mobile default
- mobile active/interactive state
- reduced-motion/static fallback
- failed WebGL fallback if feasible

No project using these effects can be approved without screenshots.

## Score Caps

- WebGL/shader effect used as generic decoration: max score 5
- WebGL/shader effect hides weak layout or hierarchy: max score 4
- text is unreadable over shader/motion: max score 3
- no static fallback: max score 5
- no reduced-motion fallback: max score 5
- canvas traps pointer or blocks content: max score 4
- full-page GPU effect appears on every section without concept reason: max score 5
- WebGL claim without actual implementation or screenshot proof: max score 4
- Liquid Logo code copied without license/source attribution: max score 3
