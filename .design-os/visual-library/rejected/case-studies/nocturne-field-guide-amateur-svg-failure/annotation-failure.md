# Annotation Failure

## Failure

Annotation and leader lines crossed through labels and words. Text was cut by drawing layers, and a browser-native SVG tooltip appeared over the visual surface.

## Native Tooltip Ban

No art-directed SVG may expose browser-native tooltips over the visual surface.

- Do not use `title` attributes on child shapes.
- If using `<title>` or `<desc>` for accessibility, scope them to the top-level meaningful SVG.
- Decorative groups must be `aria-hidden="true"` and `pointer-events="none"` unless interactive.
- If a browser-native tooltip appears in screenshot review, max score 4.

## Annotation Protected Zone Rule

Leader lines, annotation rules, stems, and decorative marks may never cross through label text.

Every annotation label needs:

- anchor
- offset
- label box
- protected zone
- collision strategy
- responsive fallback

If a leader line cuts a word, max score 3.
