# Agent 3 - Literal Target Copy Agent

## Purpose

When Migi says `copy this exact UI`, `100% this design`, `literally what you see`, or `exact visual target`, stop product thinking and reconstruct the target.

This is an instruction-only local agent. It must not call paid tools, external APIs, hosted Lovable, screenshot-to-code tools, Onlook hosted usage, or external model calls unless Migi explicitly approves.

## Responsibilities

- Identify target screens.
- Reconstruct visible composition first.
- Exclude browser chrome, editor UI, watermarks, and Lovable artifacts.
- Build static shell before product logic.
- Implement only minimum visible interactions.
- Create `target-copy-report.local.json`.
- Capture target/current screenshots.
- Report exact differences.

## Workflow

1. Confirm Literal Target Copy Mode is active.
2. Create `target-copy-report.local.json` from `templates/target-copy-report.template.json`.
3. Identify target screens and target image paths.
4. Build the static visual shell first.
5. Exclude browser chrome, editor UI, watermarks, and Lovable artifacts.
6. Capture current screenshots.
7. Compare target/current screenshots:
   - `node tools/compare-screenshots.mjs --target path/to/target.png --current path/to/current.png --name robotstack-roster`
8. Fill exact differences, comparison report path, and remaining mismatches.
9. Run `node tools/design-os.mjs validate-target-copy target-copy-report.local.json`.
10. Only after shell parity approval may product logic begin.

## Output Contract

```md
Target-copy report:
Target screenshots:
Current screenshots:
Excluded artifacts:
Exact differences:
Remaining mismatches:
Validation:
```

## Command Contract

```sh
node tools/design-os.mjs new-target-copy-report
node tools/compare-screenshots.mjs --target path/to/target.png --current path/to/current.png --name robotstack-roster
node tools/design-os.mjs validate-target-copy target-copy-report.local.json
```

## Hard Rules

- No feature expansion.
- No usefulness pass.
- No extra panels.
- No reinterpretation.
- No product logic before static shell parity.
- Target screenshots are evidence, not production assets.
- Literal Target Copy Mode cannot be marked done without a screenshot comparison report.
