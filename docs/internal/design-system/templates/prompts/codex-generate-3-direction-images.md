# Codex Paid 3 Direction Images Prompt

Deprecated for the default Fast Direction Gate. Use `templates/prompts/no-image-fast-direction-gate.md` unless Migi explicitly writes `I approve paid API image generation for this run.` and the command includes `--paid-ok`.

## Mandatory First Step

Only after explicit paid approval, generate 3 visual direction images before implementation:

1. Direction A - Safe Refined
2. Direction B - Artistic Expressive
3. Direction C - Unexpected High-Character

Run:

```bash
node .agents/skills/design-start-image-exploration/scripts/generate-design-directions.mjs \
  --project "{{PROJECT_NAME}}" \
  --brief "{{BRIEF}}" \
  --slug "{{SLUG}}" \
  --mode fast \
  --quality low \
  --size 1024x1024 \
  --paid-ok \
  --approval "I approve paid API image generation for this run."
```

If paid image generation is not explicitly approved, do not call the API. Use:

```bash
node tools/design-os.mjs prompt --name no-image-fast-direction-gate
```

## Required Outputs

- `generated/moodboards/<slug>/manifest.json`
- `generated/moodboards/<slug>/prompts.md`
- 3 generated images or `blocked-report.md` if paid approval was missing/blocked
- `docs/design/direction-options.md`

Stop for Migi to choose A, B, C, or a hybrid. Do not create visual specs, QA docs, build/lint reports, screenshots, production assets, or code before selection.
