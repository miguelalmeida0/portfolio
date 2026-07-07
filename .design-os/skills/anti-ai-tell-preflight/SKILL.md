---
name: anti-ai-tell-preflight
description: Run a Taste-style final preflight for landing pages, portfolios, marketing sites, and visual redesigns. Use before handoff to catch AI tells such as generic purple, three equal cards, em-dashes, fake screenshots, generic names, CTA wrapping, duplicate CTA intent, hero clutter, repeated sections, fake live chips, and weak image discipline.
---

# Anti-AI-Tell Preflight

Use for landing, portfolio, marketing, and redesign work. Do not apply blindly to dashboards or dense product tools.

## Files To Read

- `design-dna/brief-inference-rules.md`
- `design-dna/anti-ai-tell-preflight.md`
- `design-dna/landing-page-craft-rules.md` when landing/portfolio
- `design-dna/unsplash-asset-sourcing-rules.md` when real imagery or Unsplash assets are used
- `evaluation/ui-scorecard.md`

## Checklist

- brief inference declared
- dials declared
- design system or aesthetic chosen
- zero em-dashes in visible UI copy
- page theme lock
- color consistency lock
- sepia/espresso/umber archive wash ban
- no nocturne/archive/field-guide/botanical/brass/tobacco/parchment/vintage/premium rationale for the banned brown-black surface family
- shape consistency lock
- button contrast
- CTA wrap check
- duplicate CTA intent check
- hero fits viewport
- hero stack max
- eyebrow count cap
- split-header ban
- zigzag cap
- logo wall rules
- real image requirement
- real image source/manifest requirement when photography is needed
- image role, crop, alt text, and text safe-zone check
- no div fake screenshots
- no generic stock filler or stock imagery used as product proof
- no fake numbers
- no generic names/copy
- motion motivated
- reduced motion
- mobile collapse explicit

## Output

```md
Preflight result: pass/fail
Failed checks:
Score caps:
Required fixes before handoff:
```

## Stop Condition

If any hard preflight check fails, do not claim done.

## Audit Upgrade: Self-Correction Contract

Audit fix: Fold narrow tells into the broader evidence layer without losing the sharp checks.

Required evidence:
- tell checklist, screenshot proof, affected sections, score caps, and repair owners.

Repair routing:
- landing-page-craft-director owns structure; text-clarity-review owns wording tells.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "anti-ai-tell-preflight"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
