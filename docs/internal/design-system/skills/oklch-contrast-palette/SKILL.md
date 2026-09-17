---
name: oklch-contrast-palette
description: Use when defining color tokens, generating palette scales, repairing contrast, auditing dark mode, chart colors, or reviewing color accessibility. Applies OKLCH lightness logic, APCA contrast targets, WCAG 2 compliance thresholds, and hue-drift checks.
---

# OKLCH Contrast Palette

This skill is the Miguel Design OS color-science gate.

## Use When

- defining semantic color tokens
- generating palette scales
- repairing contrast
- auditing dark mode
- reviewing color accessibility
- building dashboard palettes, chart colors, or UI state colors
- a palette feels robotic, muddy, arbitrary, or machine-generated
- artistic, cinematic, landing, portfolio, creative, editorial, or experimental work needs bold but readable palette exploration

## Files To Read

- `design-dna/oklch-contrast-and-palette-rules.md`
- `design-dna/design-system-first-rules.md`
- `design-intelligence/contrast-thresholds.json`
- `design-intelligence/oklch-palette-generation.json`
- `design-intelligence/oklch-guidance.md`
- `evaluation/ui-scorecard.md`

## Output Contract

Create or fill a palette/contrast note in the relevant design artifact:

```md
## OKLCH / APCA Palette Pass
- semantic tokens reviewed:
- APCA targets:
- WCAG 2 targets when formal compliance is claimed:
- foreground/background pairs checked:
- lightness repairs made:
- hue drift risk:
- numeric scale:
- dark mode mapping:
- unresolved contrast risks:
- expressive palette options if relevant:
```

## Rules

- APCA is the default perceptual contrast model.
- Use absolute APCA `Lc` for threshold comparison.
- WCAG 2.x is still required for formal compliance claims.
- Repair contrast by changing OKLCH `L`, not chroma.
- Do not rely on chroma to fix text contrast.
- If background `L > 0.6`, use dark foreground.
- If background `L <= 0.6`, use light foreground.
- Convert HSL ramps to OKLCH and flag hue drift above `10deg`.
- Generate numeric palette scales instead of one-off hex values.
- Dark mode should reverse/match token mapping, not random-pick colors.
- For expressive modes, evaluate safe refined, artistic expressive, and unexpected high-character palette options before final token lock.
- Bold color is allowed; unreadable color is not.

## Review Questions

- Are semantic color tokens named by role, not color mood?
- Do foreground/background pairs name their APCA target?
- Does normal text meet `Lc 60` or have a documented reason?
- Do UI components meet `Lc 30`?
- Are WCAG ratios checked when compliance is claimed?
- Was contrast repaired through lightness?
- Does any HSL ramp visibly drift in hue?
- Does dark mode map tokens cleanly?
- Do chart/state colors preserve contrast and meaning?
- Did the agent explore multiple palette directions when the mode required it?
- Does the selected palette feel authored and tied to concept, imagery, or references?
- Does it avoid muddy generated-app defaults?
- Are image colors and UI colors compatible?

## Sepia Archive Brown Ban

Do not approve palettes that use muddy sepia/espresso/umber brown-black archive wash on page, stage, card, panel, note, command container, sidebar, nav, drawer, modal, framed object, or container surfaces. This remains rejected even when described as nocturne, archive, field guide, botanical, brass, tobacco, parchment, vintage, cinematic, commander, incident, operational, or premium. Visible sepia containers cap final score at 2.

If this palette appears, the palette pass fails before contrast repair. Replace the surface family with an authored palette and then run contrast checks.

## Stop Conditions

- Palette was repaired by random hex tweaks.
- Contrast was "fixed" by increasing saturation/chroma instead of lightness.
- A final palette has no APCA/WCAG check.
- Dark mode uses unrelated ad hoc colors.
- The palette feels machine-generated because no perceptual system was used.
- Expressive mode uses safe AI-default muddy palette without documented exploration.
- Sepia/espresso/umber brown-black archive wash is used on major surfaces.

## Audit Upgrade: Self-Correction Contract

Audit fix: Keep color science concrete through token-level repair.

Required evidence:
- OKLCH/APCA or WCAG matrix, token deltas, state contrast matrix, and repaired values.

Repair routing:
- visual-spec-compiler updates tokens; screenshot-scorecard-review verifies rendered contrast.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "oklch-contrast-palette"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
