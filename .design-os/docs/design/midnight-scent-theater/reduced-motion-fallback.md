# Reduced-Motion Fallback

## Rule

Reduced motion keeps the editorial scene and product hierarchy, but removes scroll-scrubbed morphing, curtain movement, smoke drift, and draw-on stroke animation.

## Behavior

| Motion | Fallback |
|---|---|
| Curtain reveal | Render final open-curtain composition immediately. |
| Moon/lens to bottle morph | Render final bottle silhouette with moon halo. |
| Smoke mark drift | Render static smoke marks outside text-safe zones. |
| Draw-on brass stroke | Show the complete stroke immediately. |
| Selection snap | Change selected state instantly with focus outline. |
| Editorial scroll chapter | Use normal document scroll with static chapter states. |

## Code Notes

Use `prefers-reduced-motion: reduce`.

```css
@media (prefers-reduced-motion: reduce) {
  [data-motion="curtain-reveal"],
  [data-motion="lens-morph"],
  [data-motion="smoke-drift"],
  [data-motion="draw-on"] {
    animation: none !important;
    transition-duration: 1ms !important;
  }

  [data-scene-state="final"] {
    opacity: 1;
    transform: none;
    clip-path: none;
  }
}
```

## QA

- Bottle visible without waiting for animation.
- CTA and labels readable in final state.
- No essential content depends on a morph.
- Focus states remain visible.

