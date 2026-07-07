# Codex Motion Review Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Selected mode:
Motion / Animation Review

Required files to read:

- `skills/review-animations/SKILL.md`
- `skills/review-animations/STANDARDS.md`
- `skills/advanced-motion-choreography/SKILL.md` when advanced/cinematic/portfolio motion was requested
- `skills/motion-craft-director/SKILL.md`
- `skills/animation-vocabulary/SKILL.md` when motion names are ambiguous
- `evaluation/benchmarks/motion-cinematic.benchmark.md` when motion is central
- `design-dna/motion-and-delight-rules.md`
- `evaluation/ui-scorecard.md`

Review scope:
`{{FILES_OR_COMPONENTS}}`

Motion strategy:

- frequency profile: `{{FREQUENCY_PROFILE}}`
- motion purpose: `{{MOTION_PURPOSE}}`
- hero/signature moment: `{{SIGNATURE_MOMENT}}`
- feedback layer: `{{FEEDBACK_LAYER}}`
- transition layer: `{{TRANSITION_LAYER}}`
- reduced-motion behavior: `{{REDUCED_MOTION_BEHAVIOR}}`

Review rules:

1. Default to flagging; approval is earned.
2. Check durations, easing, transform origin, interruptibility, performance, pointer/hover gating, and `prefers-reduced-motion`.
3. Block ease-in UI motion, `scale(0)` entrances, `transition: all`, animated high-frequency actions, and delight that delays the core task.
4. Confirm motion names are precise when specs or handoff use vague language.
5. If advanced motion was requested, block one-animation implementations, repeated fade-up everywhere, missing section maps, missing media/type/nav motion, missing reduced motion, and missing sequence evidence.
6. Use file:line references where possible.

Final response contract:

- verdict: `APPROVE`, `APPROVE WITH NOTES`, or `BLOCK`
- findings table
- score caps triggered
- exact fixes required
- residual motion risk
