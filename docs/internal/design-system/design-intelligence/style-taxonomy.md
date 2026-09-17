# Style Taxonomy Guidance

Use `style-taxonomy.json` as an ingredient library.

## Rules

- Choose one primary family.
- Choose at most one supporting treatment.
- Define token effects before implementation.
- Reject mismatched styles explicitly.
- Check accessibility and performance.
- Migi references override generic taxonomy defaults.
- For artistic, cinematic, landing, portfolio, creative, editorial, and experimental modes, style selection must include palette exploration and cannot settle for generic generated-app neutrals by default.

## Visual Spec Requirements

- selected style family
- supporting treatment
- rejected styles
- token bias
- motion/effect limits
- accessibility risk
- performance risk
- mobile behavior
- palette exploration fit when expressive modes apply

## Blockers

- style selected by vibe only
- incompatible systems mashed together
- style conflicts with product mode
- style causes contrast, motion, or layout integrity failure
- expressive style direction uses safe AI-default palette with no exploration
