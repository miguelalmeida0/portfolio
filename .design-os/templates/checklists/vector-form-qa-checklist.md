# Vector Form QA Checklist

## Shape Model

- Every visible shape has role, layer, bounds, anchors, responsive behavior, and accessibility/decorative status.
- No roleless decorative circles, blobs, lenses, or orbit/HUD marks.
- No generic background blob, ghost ellipse, radial glow, translucent oval, or dot/star field unless reference-justified and named in the shape inventory.

## Annotation Protected Zone

- Every annotation has anchor point, leader path, label box, protected label zone, collision fallback, and responsive fallback.
- No leader line, stem, connector, or decorative rule crosses label text.
- Annotation labels do not collide with art or other labels.

## SVG Accessibility

- Top-level meaningful SVG has `<title>` and `<desc>`.
- Child shapes do not expose native browser tooltips.
- Decorative groups are `aria-hidden="true"` and `pointer-events="none"` unless interactive.
