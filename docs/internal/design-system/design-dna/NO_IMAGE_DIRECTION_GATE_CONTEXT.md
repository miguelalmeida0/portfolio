# No-Image Direction Gate Context

Use this compact context for the default first pass on new visual-heavy work.

## Rule

No paid image generation is used by default. A direction gate succeeds when it creates strong differentiated direction cards, compact layout maps, and risk checks without API calls.

Paid image generation may run only when Migi explicitly writes:

`I approve paid API image generation for this run.`

The paid command must also include `--paid-ok`. Missing either condition means fail closed and write a blocked report.

## Outputs

Create only:

- `docs/design/direction-options.md`
- `docs/design/direction-layout-maps.md`
- `docs/design/direction-risk-check.md`

Do not create visual specs, design-system docs, palette docs, navigation plans, motion plans, QA docs, build/lint reports, screenshots, production assets, or frontend code before Migi chooses.

## Directions

Create three genuinely different options:

- Direction A - Safe Refined
- Direction B - Artistic Expressive
- Direction C - Unexpected High-Character

Each direction must include:

- name
- product thesis
- domain palette rationale
- layout structure
- simple ASCII/block layout map
- navigation model
- primary product object
- interaction model
- what it avoids
- likely failure risk
- implementation complexity
- recommendation score

Maximum: 200 words per direction plus one compact recommendation paragraph.

## Required Layout Maps

Desktop command surface:

```txt
[Workspace / context toolbar]
[Primary canvas / product object          ][Inspector]
[Queue / timeline / secondary controls    ]
```

Mobile product:

```txt
[Header / current state]
[Primary control]
[Content list]
[Action zone]
[Bottom nav]
```

Landing / artistic:

```txt
[Nav integrated with scene]
[Dominant image / type composition]
[Curated secondary moment]
[CTA / proof / next step]
```

## Required Checks

- Primary product object is named.
- Domain palette fit is documented.
- Navigation state effect is documented.
- Interaction promises are concrete.
- Decorative-only controls are rejected.
- Service Floor failure modes are checked when relevant: random palette, placebo nav, spatial label collision, and primary object buried by cards.

## Stop

Stop after the three direction artifacts. Ask Migi to choose A, B, C, or a hybrid. Selection means build approval unless Migi explicitly says planning-only, spec-only, wait, or no-code.
