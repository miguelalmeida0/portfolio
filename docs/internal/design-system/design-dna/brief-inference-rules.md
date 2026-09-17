# Brief Inference Rules

Before coding visual-heavy work, infer the design read. Bad AI frontend starts from a default aesthetic; good frontend reads the room.

## Required One-Liner

For visual-heavy work, state:

```txt
Reading this as: <page kind/product type> for <audience>, with a <vibe> language, leaning toward <mode/system/aesthetic>.
```

## Read These Signals First

- page kind: landing, portfolio, redesign, dashboard, mobile flow, product UI, editorial, tool, workbench
- audience: technical buyer, consumer, recruiter, operator, creator, shopper, executive, regulated user
- vibe language: calm, premium, playful, editorial, trust-first, Awwwards, Linear-clean, Apple-y, brutalist, dark tech
- reference signals: visual-library folder, screenshots, named brands, URLs, products, competitors
- brand assets: logo, color, type, photography, existing product surface
- quiet constraints: accessibility, public-sector, regulated, trust-first commerce, kids, medical/legal/financial risk

## When To Ask One Question

Ask exactly one clarifying question when the design read genuinely diverges:

- preserve existing brand or overhaul?
- Linear-clean or Awwwards-experimental?
- product utility or artistic statement?
- native mobile app or responsive web?

Do not ask a multi-question dump. If a strong interpretation is possible, declare the design read and proceed.

## When To Proceed Confidently

Proceed when:

- Migi points to a specific reference folder
- task mode is obvious from the product
- visual examples clearly share a direction
- the risk of asking is slower than making a reversible first visual spec

## Output

Include the design read in:

- `docs/design/visual-spec.md`
- `docs/design/reference-usage-report.md` when references are used
- final handoff for visual-heavy work

## Stop Condition

If the agent cannot state the design read in one sentence, it is not ready to code.
