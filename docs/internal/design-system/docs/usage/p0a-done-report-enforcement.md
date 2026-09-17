# P0A Done Report Enforcement

P0A prevents agents from claiming `done` when visual evidence is missing or the UI is visibly broken.

This layer is local-only:

- no paid tools
- no API keys
- no hosted AI tools
- no external model calls

## Create A Done Report

From the project root:

```sh
node tools/design-os.mjs new-done-report
```

When Miguel Design OS is embedded as `docs/internal/design-system`:

```sh
node docs/internal/design-system/tools/design-os.mjs new-done-report
```

This creates `done-report.local.json` from `templates/done-report.template.json`.

## Fill It After Screenshots

For visual UI work, fill:

- `projectName`
- `taskType`
- `mode`
- `filesChanged`
- `commandsRun`
- `screenshots.390`
- `screenshots.768`
- `screenshots.1440`
- `screenshotReportPath`
- `visualQa`
- `interactionQa.deadButtons`
- `score.current`
- `score.target`
- `remainingWeaknesses`
- `blockers`
- `finalStatus`

The done report should reference the screenshot report created from `templates/screenshot-report.template.json`. The screenshot report is the evidence packet; the done report is the completion gate.

## Validate It

```sh
node tools/design-os.mjs validate-done-report done-report.local.json
```

Embedded:

```sh
node docs/internal/design-system/tools/design-os.mjs validate-done-report done-report.local.json
```

## What Blocks Done

Validation fails for visual work when:

- `390`, `768`, or `1440` screenshot slots are missing
- `visualQa.noOverlap` is false
- `visualQa.noTextOnButtons` is false
- `visualQa.noWatermark` is false
- `visualQa.noHorizontalOverflow` is false
- `visualQa.noCutHeroObject` is false without an explicit justification
- `interactionQa.deadButtons` is non-empty
- `blockers` is non-empty while `finalStatus` is `done`
- `remainingWeaknesses` is empty while `score.current` is below `score.target`
- `screenshotReportPath` is missing for visual work

Build and lint commands are useful, but they are not visual QA. A passing build does not make a visually broken UI done.

## Mode Values

Use one of:

- `visual-concept`
- `literal-target-copy`
- `visual-repair`
- `implementation`
- `review`

For non-visual work, set `isVisualWork` to `false`. For visual UI work, keep it `true`.

## Required Agent Habit

Before final handoff on visual UI work:

1. Capture or inspect screenshots at `390`, `768`, and `1440`.
2. Fill the screenshot report.
3. Fill the done report from that evidence.
4. Run `validate-done-report`.
5. Do not claim `done` unless it passes.

