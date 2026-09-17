# Codex Select Direction From Paid Images Prompt

Use only after paid image generation was explicitly approved and 3 generated direction images exist. For the default workflow, select from the no-image direction cards and layout maps instead.

## Inputs

- `generated/moodboards/<slug>/manifest.json`
- `docs/design/generated-direction-images.md`
- `docs/design/direction-options.md`

## Task

Help Migi choose:

- Direction A
- Direction B
- Direction C
- hybrid, e.g. A palette + C composition + B motion

## After Selection

Create:

```md
docs/design/selected-direction.md
```

Include:

- selected direction
- hybrid changes
- final visual thesis
- final palette
- final layout strategy
- final image/media strategy
- final navigation strategy
- final motion strategy
- risks
- what parts of generated images must not be copied literally

Only then proceed to visual spec and implementation.
