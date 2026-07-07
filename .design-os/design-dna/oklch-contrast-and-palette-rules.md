# OKLCH Contrast And Palette Rules

Use this before finalizing color tokens, palette scales, dark mode, chart colors, or contrast repairs.

## APCA As Default

Use APCA as the preferred contrast model for Design OS palette decisions because it is perceptual and pairs naturally with OKLCH.

APCA `Lc` is signed. Use absolute value for threshold comparison.

Thresholds:

- normal text: `Lc 60` pass, `Lc 75` pass+
- large text: `Lc 45` pass, `Lc 60` pass+
- UI components: `Lc 30` pass

## WCAG 2 For Legal Compliance

WCAG 2.x is still required when claiming formal accessibility compliance.

Thresholds:

- normal text: AA `4.5:1`, AAA `7:1`
- large text: AA `3:1`, AAA `4.5:1`
- UI components: AA `3:1`

## OKLCH Contrast Repair

Contrast is controlled primarily by OKLCH `L`.

To fix contrast, adjust lightness, not chroma. Chroma has negligible effect on contrast.

Rules:

- light background `L > 0.85`: foreground `L` should generally be below `0.45`
- dark background `L < 0.25`: foreground `L` should generally be above `0.75`
- if background `L > 0.6`, use a dark foreground
- if background `L <= 0.6`, use a light foreground

## Stateful Contrast Matrix

Contrast checks must cover interaction states, not only the default screenshot.

For nav items, tabs, chips, segmented controls, buttons, menus, cards, and selectable objects, record foreground/background pairs for:

- default
- hover
- focus-visible
- active / pressed
- selected
- selected + hover
- selected + focus
- disabled

If selected + hover or selected + focus makes text disappear, repair the lightness relationship first. Do not hide the failure with opacity, blend modes, shadows, or animation.

## Hue Drift Detection

Convert HSL ramps to OKLCH before trusting them.

If hue spread across a ramp is greater than `10deg`, flag visible hue drift. Fix by rebuilding the ramp in OKLCH instead of tweaking hex values.

## Palette Generation

Numeric scales:

- 5 step: `100`, `300`, `500`, `700`, `900`
- 9 step: `50`, `100`, `200`, `300`, `500`, `700`, `800`, `900`, `950`
- 11 step: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `950`

Algorithm:

1. Start from base `L`, chroma percentage, and hue.
2. Use `delta = 0.4`.
3. `minL = max(0.05, baseL - delta)`.
4. `maxL = min(0.95, baseL + delta)`.
5. Distribute lightness evenly from `maxL` to `minL`.
6. Clamp chroma per step using the maximum chroma for that `L`, hue, and color space.
7. Accept that high-chroma colors lose chroma at very light and dark extremes.

## Multi-Hue Palettes

Use same `L` and same chroma percentage across hues.

Do not use the same absolute chroma for every hue. Different hues have different maximum chroma and will look uneven if forced into one absolute value.

## Dark Mode

Reverse palette mapping:

- light mode background = `50`, text = `950`
- dark mode background = `950`, text = `50`

Dark mode should map tokens, not invent random dark colors.

## Why Not HSL

HSL causes hue drift and perceived brightness inconsistency. OKLCH has stable hue and perceptual lightness, which makes it better for design-system scales and accessible contrast repair.

## Stop Condition

If an agent changes a palette through trial-and-error hex tweaks without checking OKLCH/APCA logic, stop and redo the palette from tokens, lightness targets, state contrast pairs, and contrast thresholds.

## Bold Palette Note

Bold color is allowed. Unreadable color is not.

For artistic, cinematic, landing, portfolio, creative, editorial, and experimental modes, OKLCH/APCA should support art direction rather than pushing every palette back to safe grey. Use lightness and token roles to preserve contrast while keeping the selected palette's character.
