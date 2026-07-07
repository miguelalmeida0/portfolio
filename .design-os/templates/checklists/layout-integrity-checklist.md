# Layout Integrity Checklist

## Text / Container Integrity

- No critical text is clipped.
- No words are cut inside cards, stickers, nav pills, badges, buttons, tabs, modals, or panels.
- No text escapes its intended container.
- No sticker/card/image/shape/overlay covers headline, body, CTA, or nav text.
- No `overflow: hidden` hides a text-fit failure.
- Text-heavy containers avoid fixed heights unless proven safe.
- Flex/grid children that contain text use `min-width: 0` where needed.
- Every sticker/card/badge/nav system has a text-fit strategy.

## Navigation Responsiveness

- Nav has desktop, tablet, and mobile variants.
- Nav labels do not overflow chips, pills, circles, buttons, or hit targets.
- Nav active state does not clip text or create layout jump.
- Nav bar does not create huge empty space at narrower widths.
- Label hiding preserves accessible labels.
- Nav survives 1440, 1280, 1024, 768, and 390.

## Whitespace / Density

- No huge accidental blank viewport area exists.
- Empty space has a stated compositional purpose.
- Sticky/pinned sections do not create dead blank frames.
- Hero/section content is not accidentally pushed offscreen.

## Evidence

- Breakpoint screenshots captured or blocker documented.
- Screenshot contradiction beats agent self-report.
