# Navigation Pattern Guidance

Navigation is part of art direction. It should be chosen from the product mode, references, information architecture, and composition instead of defaulting to a generic top bar.

## How To Use

1. Define what navigation must accomplish.
2. Inspect reference navigation, not only colors or hero layout.
3. Select 3 navigation concepts before implementation for visual-heavy work.
4. Choose one pattern or a deliberate hybrid.
5. Document desktop, tablet, and mobile behavior in `docs/design/navigation-strategy.md`.
6. Define Navigation Readability Strategy when nav overlaps images, giant type, video, gradients, or scroll-state background changes.
7. Verify labels, active state, focus state, safe areas, contrast, scroll-state readability, and responsive behavior.

## Selection Notes

- Landing, portfolio, creative, and editorial pages can use sparse, spatial, typographic, or contextual navigation when it supports the concept.
- Dashboards and product apps can be clearer and more functional, but still need intentional placement, readable labels, and crafted responsive behavior.
- Mobile apps with 3+ primary destinations default to bottom navigation unless a documented exception applies.
- A CTA can be part of the composition, but it still needs to be reachable, understandable, and visually connected to the page intent.
- Floating, spatial, or image-integrated nav must survive the background. Use safe placement, subtle surface, backdrop blur, scrim, adaptive inverse text, position shift, contextual collapse, or non-overlapping placement when needed.
- Visible wordmarks, app names, and logo marks are not automatic. Use them only when the selected direction needs identity, the site is brand/portfolio-oriented, navigation clarity requires it, or the visual spec justifies it.

## Failure Modes

- default logo-left / links-center / CTA-right structure reused across unrelated concepts
- sticky pill nav added because it feels "premium"
- nav pasted on top of an image-led composition instead of integrated with it
- mobile receives a desktop link dump
- all three direction options use the same navbar
- CTA floats as generic decoration instead of a meaningful action anchor
- active and focus states are missing
- nav text becomes unreadable over photography, giant type, video, or scroll-state background changes
- nav contrast depends on a lucky crop or scroll position
- forced app-name/logo/initials chrome appears from template habit
- decorative circular/orbital/HUD lines are used to make nav feel technical
- tiny separator hairlines or label rails are used as fake editorial nav detail
