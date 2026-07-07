# WebGL / Shader Primitives Gate Prompt

Use this before coding any ShaderGradient, React Three Fiber, Three.js, GLSL, WebGL, animated gradient, or liquid-metal logo effect.

Do not create UI until this gate is answered.

## Required Questions

- Why does this project need WebGL/shaders?
- Which exact section uses the effect?
- Which primitive is proposed: ShaderGradient, React Three Fiber, custom Three.js/R3F scene, or Liquid Logo-style adaptation?
- What product concept does it support?
- What is the static fallback?
- What is the reduced-motion behavior?
- What is the mobile behavior?
- What screenshots will prove it works?
- How does this avoid fake live affordances?
- How does this avoid unsafe scroll?
- How does this support the product concept instead of decorating it?
- What is the performance budget?
- What is the React/Next version and matching R3F version?

## Required Output

```md
## WebGL / Shader Primitive Gate

- verdict: proceed / revise / reject
- primitive:
- concept reason:
- exact section:
- dependency plan:
- React/R3F compatibility:
- client-only boundary:
- static fallback:
- reduced-motion fallback:
- mobile behavior:
- text/readability protection:
- pointer-event strategy:
- fake-live avoidance:
- unsafe-scroll avoidance:
- performance budget:
- screenshot proof plan:
```

Hard rule:

WebGL is not taste by default. If the effect is generic decoration, reject it.
