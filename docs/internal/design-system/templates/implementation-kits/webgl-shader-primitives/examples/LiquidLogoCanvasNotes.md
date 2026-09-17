# Liquid Logo Canvas Notes

Liquid Logo reference: https://github.com/collidingScopes/liquid-logo

Use as an adaptation reference, not an npm dependency.

## Adaptation Shape

1. Start with a clean high-contrast logo mask.
2. Render the mask into an offscreen canvas or texture.
3. Use a fragment shader to detect or sample logo edges.
4. Generate a subtle vector/noise field around the edge.
5. Apply a metallic material palette only where it supports brand identity.
6. Export a static poster fallback.

## Production Guardrails

- Use a bounded logo container.
- Disable animation for `prefers-reduced-motion`.
- Keep readable brand text available in DOM.
- Do not use the effect as fake live/status feedback.
- Do not copy source code without preserving MIT license and source URL.
- Capture desktop, mobile, reduced-motion, and static fallback screenshots.
