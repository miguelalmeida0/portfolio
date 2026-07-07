---
name: webgl-shader-primitives
description: Plan, implement, and review experimental WebGL, ShaderGradient, React Three Fiber, and Liquid Logo-style visual primitives for premium motion/atmosphere, with strict fallbacks, accessibility, performance, screenshot proof, and anti-decoration guardrails.
---

# WebGL Shader Primitives

Use this skill when a project proposes ShaderGradient, React Three Fiber, Three.js, GLSL shaders, WebGL backgrounds, liquid-metal logo effects, animated premium gradients, or shader-based visual identity.

Do not use WebGL as default taste.

## Required Reading

- `design-dna/webgl-shader-visual-primitives-rules.md`
- `templates/implementation-kits/webgl-shader-primitives/README.md`
- `visual-primitives/liquid-logo/README.md` when liquid-metal logo effects are considered

For typography-led motion sites, also inspect `design-dna/typographic-motion-site-rules.md` and `skills/typographic-motion-art-director/SKILL.md`. WebGL/shaders are implementation primitives; Typographic Motion Site is art direction.

## Decision Gate

Before coding, answer:

- Why does this project need WebGL/shaders?
- Which exact section uses it?
- What product concept does it support?
- What is the static fallback?
- What is the reduced-motion behavior?
- What is the mobile behavior?
- What screenshots will prove it works?
- How does this avoid fake live affordances?
- How does this avoid unsafe scroll?
- How does this avoid becoming generic decoration?

If the answers are weak, use CSS, SVG, static imagery, or normal motion instead.

## Dependency Guidance

Install dependencies in the target generated/dogfood project, not Design OS, unless Design OS itself is a runtime package.

Recommended packages:

- `@shadergradient/react`
- `@react-three/fiber`
- `three`
- `three-stdlib`
- `camera-controls`
- `@types/three` as dev dependency

Compatibility:

- React 19 / Next 15 App Router: React Three Fiber v9.
- React 18: React Three Fiber v8-compatible versions unless the project already supports v9.

Do not install Liquid Logo as a package. Treat it as a source/reference repo.

## Implementation Rules

- Build isolated client-only components.
- In Next.js App Router, add `"use client"` at the component boundary.
- Use dynamic import with `ssr: false` when crossing from server components.
- Keep canvas/WebGL inside a bounded container.
- Use `pointer-events: none` unless the canvas is intentionally interactive.
- Provide static fallback and reduced-motion fallback.
- Keep DOM content readable without WebGL.
- Avoid hiding content behind shader timing.
- Avoid fake live, telemetry, weather, presence, or production status effects.
- Use modest DPR/pixel density and mobile simplification.

## Planning Checklist

- concept reason:
- section/container:
- dependency install plan:
- React version / R3F version:
- Next client boundary:
- fallback:
- reduced motion:
- mobile simplification:
- text safe zone:
- pointer behavior:
- performance budget:
- screenshots:

## QA Checklist

- desktop default screenshot
- desktop active/interactive screenshot
- mobile default screenshot
- mobile active/interactive screenshot
- reduced-motion/static fallback screenshot
- failed WebGL fallback screenshot if feasible
- text remains readable
- primary content accessible without WebGL
- no pointer traps
- no fake live/status meaning
- performance note recorded

## Stop Conditions

- WebGL is used only because it looks cool.
- The shader hides weak layout or weak typography.
- Text becomes unreadable over animation.
- No static fallback exists.
- No reduced-motion fallback exists.
- Mobile breaks or becomes too slow.
- No screenshot proof exists.
- Liquid Logo code is copied without source/license attribution.
