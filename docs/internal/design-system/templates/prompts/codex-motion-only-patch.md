# Codex Motion-Only Patch Prompt

Use when layout/content is approved and only the motion system should be added or repaired.

## Guardrails

- Do not redesign the layout.
- Do not change copy, palette, or information architecture unless motion cannot work without a tiny structural fix.
- Preserve approved visual shell.
- Add or repair motion according to `docs/design/motion-choreography-plan.md`.
- Reduced motion is required.

## Required Flow

1. Read `docs/design/motion-choreography-plan.md`.
2. Read `design-intelligence/motion-tool-stack-guidance.md`.
3. Inspect current motion code.
4. Implement only the named motion layers.
5. Capture motion sequence if possible.
6. Run `skills/review-animations/SKILL.md`.
7. Update `docs/qa/motion-review.md`.

## Final Response Contract

- files changed
- motion layers changed
- reduced-motion behavior
- commands run
- capture evidence or blocker
- remaining weaknesses

