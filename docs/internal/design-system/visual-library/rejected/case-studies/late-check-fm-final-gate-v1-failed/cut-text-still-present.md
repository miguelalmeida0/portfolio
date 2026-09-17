# Cut Text Still Present

The UI still displayed cut/clipped text after the integrity gate.

This is a hard blocker. A final report cannot pass when visible text is clipped by a parent, overflow rule, mask, viewport, media stage, sticky overlay, or fixed-height container.

Future detection must inspect all visible text elements, not only data-hooked elements, and flag:

- `scrollWidth > clientWidth`
- `scrollHeight > clientHeight`
- parent clipping under `overflow: hidden` or `overflow: clip`
- critical text partially outside parent or viewport
- text clipped after scroll/sticky state changes
