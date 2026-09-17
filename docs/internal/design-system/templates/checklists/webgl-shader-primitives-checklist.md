# WebGL / Shader Primitives Checklist

Use before implementing or approving ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo, animated premium gradient, or shader atmosphere work.

## Gate

- Project has a real product/concept reason for WebGL.
- Exact section/component using WebGL is named.
- Non-WebGL alternative was considered.
- Effect is not generic decoration or a way to hide weak layout.
- No fake live, realtime, activity, presence, telemetry, or status behavior is implied.

## Implementation

- Dependency plan matches React/Next version.
- Client-only boundary is defined for Next/App Router.
- Canvas/GPU area is bounded to a container.
- Z-index containment is documented.
- Pointer events are disabled unless the canvas is intentionally interactive.
- DOM content remains readable and accessible without WebGL.
- Liquid Logo is treated as source/reference, not an npm package dependency.

## Fallbacks

- Static fallback exists.
- Reduced-motion fallback exists.
- Mobile fallback or reduced complexity exists.
- Failed-WebGL fallback is documented where feasible.

## QA

- Desktop default screenshot captured.
- Desktop active/interactive screenshot captured.
- Mobile default screenshot captured.
- Mobile active/interactive screenshot captured.
- Reduced-motion/static fallback screenshot captured.
- Performance note recorded.
- Final UI Integrity Gate still passes.
