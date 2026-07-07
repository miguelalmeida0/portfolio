# Signature Interaction Director Prompt

Project path: <path>
Protected folders: source-projects/, captures/, raw-chat-input/

## Inputs
- project type:
- brand personality:
- references:
- desired user emotion:
- task criticality:
- is a playful gate acceptable? yes/no:
- is scroll choreography acceptable? yes/no:
- can motion be cinematic? yes/no:
- fallback requirements:

## Required Reading
- `skills/signature-interaction-director/SKILL.md`
- `design-intelligence/signature-interaction-patterns.md`
- relevant reference folder under `visual-library/approved/inspiration/signature-interactions/`

## Output
- selected signature interaction:
- rejected interactions and why:
- mechanics extracted:
- what must not be copied:
- implementation plan:
- motion plan:
- accessibility fallback:
- reduced-motion fallback:
- QA checklist:

Do not implement until the selected mechanic is documented in the visual spec or direction plan.

## Required Layout Integrity Final Checks

The signature mechanic must not create layout failure.

Before final handoff, verify:

- no text clipping
- no words cut
- no nav label overflow
- no sticker/card covering headline words
- no accidental blank viewport area
- required breakpoint screenshots at 1440, 1280, 1024, 768, and 390 when possible

Run `skills/layout-integrity-review/SKILL.md` after screenshots exist.
