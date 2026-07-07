# Design Start Image Exploration

Strict 3-image direction gate for visual-heavy work.

## What It Does

Before coding a new visual-heavy app, landing page, portfolio, creative site, mobile app, dashboard redesign, or major UI redesign, Design OS requires 3 generated visual direction images:

- Direction A: Safe Refined
- Direction B: Artistic Expressive
- Direction C: Unexpected High-Character

The agent saves images locally, creates a manifest, writes direction docs, and stops for Migi to choose.

## Required Environment

- `OPENAI_API_KEY` is required for image generation.
- `DESIGN_OS_IMAGE_MODEL` is optional.
- Default model: `gpt-image-2` unless overridden.

Image generation may cost money. Do not call the API during validation unless Migi explicitly approves.

## Manual Script

```bash
node .agents/skills/design-start-image-exploration/scripts/generate-design-directions.mjs \
  --project "Project Name" \
  --brief "Brief text" \
  --slug project-name
```

Prompt-only dry run:

```bash
node tools/generate-design-direction-prompts.mjs \
  --product "Project Name" \
  --type "landing page" \
  --brief "Brief text"
```

## Output

```txt
generated/moodboards/<slug>/
  01-safe-refined.png
  02-artistic-expressive.png
  03-unexpected-high-character.png
  manifest.json
  prompts.md
  blocked-report.md if blocked
```

Docs:

- `docs/design/generated-direction-images.md`
- `docs/design/direction-options.md`

## Blocked Behavior

If the API key or SDK is missing, the script writes `blocked-report.md` and exits nonzero. Do not silently fall back to coding. Text-only directions are fallback evidence only and still require Migi approval.

## After Migi Selects

Create `docs/design/selected-direction.md`, then compile `docs/design/visual-spec.md`, define design-system tokens, and implement only the selected or hybridized direction.

## Asset Warning

Generated direction images are inspiration and design evidence, not production truth. Do not copy AI artifacts, broken text, fake logos, distorted objects, or random noise directly into production UI.

