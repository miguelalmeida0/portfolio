# P0-1 Evidence Gates

P0-1 adds three local evidence gates:

1. Done Report
2. Target Copy Report
3. Asset Hygiene Manifest

These gates prevent false `done` claims when visual evidence is missing, target-copy work was reinterpreted, or production assets contain watermarks, browser chrome, editor UI, placeholders, repeated primary imagery, or unapproved generated material.

No paid tools, API keys, hosted AI tools, external model calls, or installs are required.

## Done Report

Use a done report for all visual UI work before final handoff.

Create:

```sh
node tools/design-os.mjs new-done-report
```

Validate:

```sh
node tools/design-os.mjs validate-done-report done-report.local.json
```

Embedded:

```sh
node docs/internal/design-system/tools/design-os.mjs new-done-report
node docs/internal/design-system/tools/design-os.mjs validate-done-report done-report.local.json
```

Blocks done when:

- `390`, `768`, or `1440` screenshots are missing
- overlap remains
- text appears on top of buttons or controls
- watermark/editor/browser artifacts remain
- horizontal overflow remains
- the hero object is cut without justification
- dead buttons exist
- blockers exist while `finalStatus` is `done`
- score is below target and `remainingWeaknesses` is empty

Build and lint do not count as visual QA.

## Target Copy Report

Use a target-copy report whenever Literal Target Copy Mode is active.

Validate:

```sh
node tools/design-os.mjs validate-target-copy target-copy-report.local.json
```

Blocks approval when:

- target screens are missing
- target image paths are missing
- current screenshot paths are missing
- `exactDifferences` is empty
- excluded artifacts do not mention watermarks, editor UI, and browser chrome
- product features were added before shell parity approval
- `approvalStatus` is `approved` while blocking mismatches remain

Target screenshots are evidence, not production assets.

## Asset Hygiene Manifest

Use an asset manifest for production image-led work, especially target reconstruction, roster/gallery work, and any visual UI that depends on product, character, object, or hero imagery.

Validate:

```sh
node tools/design-os.mjs validate-assets asset-manifest.local.json
```

Blocks production assets when:

- `watermarkFree` is false
- `browserChromeFree` is false
- `editorUiFree` is false
- `sourceType` is `generated` without an explicit generated approval note
- a primary/hero object is marked `repeatedAsset: true`
- `approvedForProduction` is true but `source` is missing
- a target screenshot is marked as a production asset

## Expected Pass/Fail Behavior

Valid examples should pass:

```sh
node tools/design-os.mjs validate-done-report examples/robot-skill-forge.done-report.example.json
node tools/design-os.mjs validate-target-copy examples/robot-skill-forge.target-copy-report.example.json
node tools/design-os.mjs validate-assets examples/robot-skill-forge.asset-manifest.example.json
```

Invalid examples should fail:

```sh
node tools/design-os.mjs validate-done-report examples/robot-skill-forge.done-report.invalid.example.json
node tools/design-os.mjs validate-target-copy examples/robot-skill-forge.target-copy-report.invalid.example.json
node tools/design-os.mjs validate-assets examples/robot-skill-forge.asset-manifest.invalid.example.json
```

## Final Handoff Rule

For visual UI work, final handoff must name:

- screenshot evidence
- done report validation
- target-copy report validation when Literal Target Copy Mode applies
- asset manifest validation when production imagery is used
- remaining weaknesses
- blockers fixed or still open

No done without evidence.

