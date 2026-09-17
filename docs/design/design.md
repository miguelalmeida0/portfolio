# GSAP-Inspired Design System

Local style reference for the portfolio theme tokens.

## Design Read

Dark-canvas, type-led, animation-library energy: near-black stage, warm cream type, ghost-pill controls, kinetic display letters, and a small taxonomy of vivid accent colors. Color is used to identify categories and moments, not to decorate every surface.

## Core Tokens

- Canvas: `#0e100f` / `--color-just-black`
- Cream text: `#fffce1` / `--color-surface-cream`
- Muted text: `#7c7c6f` / `--color-surface-50`
- Hairline border: `#42433d` / `--color-surface-25`
- Nested dark surface: `#191919` / `--color-off-black`
- Green: `#0ae448` / `--color-shockingly-green`
- Light green: `#abff84` / `--color-light-green`
- Orange: `#ff8709` / `--color-orangey`
- Lilac: `#9d95ff` / `--color-lilac`
- Blue: `#00bae2` / `--color-blue`

Project override: the source GSAP palette's magenta family is not active in this portfolio.

## Typography

Use `--font-mori` as the primary family. Mori is preferred; local fallback is a humanist/system sans stack.

Display type is large, tight, and cream-on-dark:

- Display: `224px / 0.9 / -4.48px`
- Heading large: `101px / 1 / -1.11px`
- Heading: `66px / 1.2 / -0.66px`
- Body: `19px / 1.15`
- Caption: `14px / 1.4 / -0.14px`

## Component Rules

- Buttons and navigation controls are ghost pills: transparent fill, cream text, cream or muted hairline border, `100px` radius.
- The only chromatic action treatment is a green-to-light-green stroked pill.
- Use curly-brace annotations like `{ Selected work }` for section eyebrows when the full GSAP direction is active.
- Use category colors consistently:
  - GSAP/core: green
  - SVG: orange
  - Scroll/motion: light green
  - Text: lilac
  - UI: blue
- Hero motion uses split glyphs: letters rise in sequence, selected glyphs rotate on an idle cycle, and background text rings rotate behind the portrait.
- Reduced-motion mode must freeze decorative animation while preserving readable text.
- Avoid pure white and pure black. Use warm cream and just-black.

## Local Implementation

- Tailwind v4 theme tokens live in `tailwind.css`.
- `src/app.css` imports `tailwind.css` and maps the app font stack to `--font-mori`.
- Hero display letters use the category colors as a small visible proof of the system.
