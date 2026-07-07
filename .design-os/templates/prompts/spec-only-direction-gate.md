# Spec-Only Direction Gate Prompt

Default to No-Image Fast Direction Gate unless Migi explicitly asks for deep exploration, full strategy, research, benchmark, reference decomposition, or full spec. In fast mode, keep this short and stop after direction cards, layout maps, and risk checks.

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Goal:
Create design directions only. Do not implement code.

Read:

- `design-dna/FAST_DIRECTION_GATE_CONTEXT.md`
- `design-dna/NO_IMAGE_DIRECTION_GATE_CONTEXT.md`
- `AGENTS.md` only if routing is unclear

Create:

- `docs/design/direction-options.md`
- `docs/design/direction-layout-maps.md`
- `docs/design/direction-risk-check.md`

Directions:

## Direction A - Safe Refined

A polished, controlled, lower-risk direction.

## Direction B - Artistic Expressive

A stronger art-directed direction with more personality.

## Direction C - Unexpected High-Character

The boldest direction. Memorable, original, readable, and usable.

For each direction include only:

- direction name
- product thesis
- domain palette rationale
- layout structure
- ASCII/block layout map
- navigation model
- primary product object
- interaction model
- what it avoids
- likely failure risk
- implementation complexity
- recommendation score

Maximum 200 words per direction. Do not create visual specs, navigation plans, motion plans, asset manifests, QA docs, build/lint reports, screenshots, or frontend code before selection.

The three directions must not all use the same navigation structure. If all three use the same top bar, the direction gate fails.

Hard bans for every direction:

- no unreadable navigation over images/giant type/changing backgrounds
- no forced app-name/logo/initials chrome
- no decorative circular/orbital/radar/HUD line overlays
- no fake sonar rings or generic orbit graphics
- no decorative hairline/separator ornaments
- no red divider lines as fake editorial detail
- no section-label-plus-line filler

If advanced motion is part of the ask, the three directions must describe different motion theses. Do not make all options "fade in on scroll."

## No Paid Image Generation

Do not call paid image APIs for this gate. Paid image generation may only run when Migi explicitly writes:

`I approve paid API image generation for this run.`

The command must also include `--paid-ok`. Otherwise, no-image direction cards and layout maps are the successful default.

This prompt is the first direction pass, so it stops after directions. For the follow-up selection turn, use `templates/prompts/implementation-after-selected-direction.md` automatically unless Migi explicitly requested planning-only/spec-only/no-code.

Follow-up selection rule: When Migi chooses A, B, C, or a hybrid, proceed immediately to implementation. Do not stop after selected-direction.md. Do not ask for another confirmation unless Migi explicitly requested planning-only/spec-only/no-code.

Stop and ask Migi to choose A, B, C, or a hybrid. No implementation.
