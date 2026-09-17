# Color Guidance

Use `product-color-matrix.json` as a recommendation engine, not as taste law.

## Rules

- Start from selected references and product mood.
- Define semantic tokens before choosing hex values.
- Use accent color selectively.
- Keep state colors distinct from brand accent unless intentionally linked.
- Avoid terminal green, AI purple, neon lime, generic blue/grey, and muddy sepia/espresso/umber brown-black defaults.
- Do not use muddy sepia/espresso/umber brown-black archive wash as a page, stage, container, card, panel, sidebar, or navigation background.
- Do not excuse this banned palette with labels like nocturne, archive, field guide, botanical, brass, tobacco, parchment, vintage, cinematic, or premium.
- Treat contrast as a state matrix, not a static token check. Interactive text must remain readable in default, hover, focus-visible, active/pressed, selected, selected+hover, selected+focus, and disabled states.
- Do not use color alone to communicate chart or status meaning.
- If image-led, extract palette from image atmosphere and protect legibility.
- For artistic, cinematic, landing, portfolio, creative, editorial, or experimental work, explore three palette directions before locking tokens: safe refined, artistic expressive, and unexpected high-character.
- Do not choose the safe option automatically when the concept can support stronger color.
- Bold color is allowed when OKLCH/APCA contrast and readability hold.

## Required Output

In `docs/design/visual-spec.md`, include:

- palette family
- token roles
- reference/product reasoning
- accent role
- state-color role
- chart color relationship
- known palette failure avoided
- palette exploration options for expressive modes
- selected palette and why it beat the other options
- state contrast matrix for nav, tabs, chips, segmented controls, buttons, menus, cards, and selectable objects when present
- selected+hover contrast proof for any selected control

## Blockers

- palette selected with no reasoning
- accent used everywhere
- text contrast fails
- interactive text disappears or falls below readable contrast in hover, focus-visible, active, selected, selected+hover, or selected+focus
- state contrast matrix is missing for interactive controls
- chart colors conflict with state/action meaning
- palette feels machine-generated
- expressive mode uses muddy/generated-app defaults without palette exploration
- sepia/espresso/umber brown-black archive wash used as the main UI surface, stage, container, nav, sidebar, panel, or card background
