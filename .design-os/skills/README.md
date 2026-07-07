# Miguel Design OS Skills

Skills are narrow, trigger-specific instruction files. They keep `AGENTS.md` small and prevent future agents from loading the whole Design OS into every task.

## How Routing Works

Start with `AGENTS.md`. It routes the task to the smallest relevant skill set.

Do not load all skills. Load only the skill whose trigger matches the current task, plus any second skill that is directly required by the evidence. For example, a selection-first redesign with screenshots may load:

- `skills/visual-concept-gate/SKILL.md`
- `skills/selection-first-products/SKILL.md`
- `skills/screenshot-scorecard-review/SKILL.md`

Do not load unrelated skills for context padding.

## Active Skills

- `visual-concept-gate`: concept approval before visual-heavy implementation.
- `visual-target-reconstruction`: inspiration image, screenshot, Lovable prototype, Pinterest reference, or mockup reconstruction.
- `selection-first-products`: gallery, roster, marketplace, card deck, character-select, discovery, and object-browsing products.
- `anti-ai-slop-review`: review existing UI for generic AI-builder failures.
- `screenshot-scorecard-review`: screenshot-based responsive and scorecard review.
- `frontend-art-director-review`: ruthless elite redesign critique.
- `tailwind-migration-zero-regression`: Tailwind/global CSS migration without visual regression.
- `truthful-state-product-naming`: auth, onboarding, mock data, product-state naming, and truthful claims.

## Skill Rules

- Skills are instruction-only.
- Skills do not contain scripts.
- Skills do not require external dependencies.
- Skills do not authorize unsafe execution.
- No third-party skills should be added or used without review.
- A skill must have a clear trigger, workflow, stop condition, and output contract.

## Cost and external-service policy

All skills in this folder are local instruction files only.

They are free to use and must not require:

- paid APIs
- model provider keys
- hosted AI tools
- external SaaS services
- paid visual builders
- cloud deployment

If a skill would benefit from a paid or external tool, the agent must stop and ask Migi before using it.

Miguel Design OS uses skills to prevent context bloat, same-layout-with-new-paint failures, reference flattening, and generic AI-slop UI.
