# Annotation Ritual

Use when a specimen, object, or product anatomy should be revealed through annotations rather than static labels.

## Required Pieces

- specimen/object anchor map
- protected label boxes
- leader-line route map
- collector notes or stamps
- collision fallback
- ordered annotation list fallback

## Rules

- Do not use child SVG `title` attributes.
- Do not let leader lines, stems, arcs, or decorative marks cross text.
- Keep labels in protected zones.
- Disable draw-on animation under `prefers-reduced-motion`.

## Optional Tools

CSS/SVG line drawing is enough for simple cases. GSAP ScrollTrigger is optional when annotation reveal is tied to scrubbed scroll.
