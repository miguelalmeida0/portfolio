# OKLCH Guidance

OKLCH is the preferred Miguel Design OS palette model because it keeps hue stable and lightness perceptual.

## Use OKLCH To

- generate numeric design-system scales
- align perceived brightness across hue families
- repair contrast by changing lightness
- make dark mode token mapping deliberate
- avoid HSL hue drift

## Do Not Use OKLCH As An Excuse To

- ignore APCA/WCAG thresholds
- create random vivid palettes
- overuse one accent color everywhere
- skip semantic tokens
- claim accessibility without checking actual foreground/background pairs

## Practical Rule

When a color pair fails contrast, move the foreground and background farther apart in OKLCH `L`. Do not try to fix the pair by adding chroma.
