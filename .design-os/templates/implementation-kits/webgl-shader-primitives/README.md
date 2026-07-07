# WebGL / Shader Visual Primitives Kit

Use this kit only when WebGL/shader motion strengthens the product concept.

WebGL is not taste by default.

For typography-led motion sites, also inspect `design-dna/typographic-motion-site-rules.md` and `skills/typographic-motion-art-director/SKILL.md`. WebGL/shaders are implementation primitives; Typographic Motion Site is art direction.

## When To Use

- premium animated atmospheric hero gradients
- product-specific visual identity moments
- isolated logo/material experiments
- bounded R3F object or scene previews
- stateful ambient transitions tied to selected route, product, room, theme, or mode

## When Not To Use

- weak layouts needing visual camouflage
- generic "cool advanced UI" background
- fake live/status/data effects
- text over unreadable motion
- scrolljacking or fragile pinned scenes
- full-page GPU effects across every section
- mobile experiences without fallback

## Required Dependencies

Install in the generated/dogfood project, not in Design OS, unless Design OS becomes a runtime package.

### npm

```bash
npm i @shadergradient/react @react-three/fiber three three-stdlib camera-controls
npm i -D @types/three
```

### pnpm

```bash
pnpm add @shadergradient/react @react-three/fiber three three-stdlib camera-controls
pnpm add -D @types/three
```

### yarn

```bash
yarn add @shadergradient/react @react-three/fiber three three-stdlib camera-controls
yarn add -D @types/three
```

## React Compatibility

- React 19 / Next 15 App Router: use React Three Fiber v9.
- React 18: use React Three Fiber v8-compatible versions unless the project already supports v9.
- Do not force a version that conflicts with the project's React version.

## Next.js App Router Notes

- Create client-only components with `"use client"`.
- Keep ShaderGradient/R3F imports out of server components.
- Use `next/dynamic` with `ssr: false` from a server boundary when needed.
- Provide a normal DOM/static fallback outside the canvas.
- Avoid hydration mismatch by deriving reduced-motion state after mount or by rendering a stable fallback first.

## ShaderGradient Usage Pattern

- Put `ShaderGradient` inside `ShaderGradientCanvas`.
- Keep the canvas bounded to a hero/backdrop container.
- Use `pointer-events: none` unless intentionally interactive.
- Keep pixel density modest on mobile.
- Turn animation off for reduced motion.
- Do not place critical text directly over high-motion/high-contrast regions without a stable plate, scrim, mask, or safe zone.

See `examples/ShaderGradientBackdrop.client.tsx`.

## React Three Fiber Usage Pattern

- Use R3F for actual 3D/WebGL scenes, object previews, and shader materials.
- Keep the `<Canvas>` inside a measured container.
- Limit geometry, shadows, post-processing, and device pixel ratio.
- Pause or simplify animation for reduced motion.
- Provide an accessible DOM equivalent for the meaning of the scene.

See `examples/R3FSceneShell.client.tsx`.

## Liquid Logo Adaptation Notes

Liquid Logo is a source/reference repo, not a package dependency.

Do not run `npm i liquid-logo`.

Use it to study liquid-metal logo aesthetics and edge-following shader behavior. If adapting code, preserve source URL and MIT license attribution.

See `examples/LiquidLogoCanvasNotes.md` and `visual-primitives/liquid-logo/`.

## Accessibility Requirements

- DOM content must remain readable without WebGL.
- Meaningful logo/text must exist as accessible text or fallback image alt text.
- Canvas must not trap focus or pointer events unless it is the actual interaction.
- Reduced motion must stop or heavily simplify animation.
- No hidden content should depend on shader timing.

## Performance Requirements

- Bound the canvas area.
- Avoid full-page GPU effects on every section.
- Cap DPR/pixel density on mobile.
- Avoid unnecessary post-processing.
- Lazy-load below-the-fold shaders.
- Document performance budget and fallback.

## QA Screenshot Requirements

Capture:

- desktop default
- desktop active/interactive state
- mobile default
- mobile active/interactive state
- reduced-motion/static fallback
- failed WebGL fallback if feasible

No project using these primitives can be approved without screenshots.
