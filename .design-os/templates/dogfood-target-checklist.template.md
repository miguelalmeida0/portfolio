# Dogfood Target Checklist

## Target Project

- Name:
- Path:
- Owner:
- Date:
- Current status:

## Design OS Rules Under Test

- Rule:
- Rule:
- Rule:

## Core Loop

- Primary loop:
- Input:
- Processing/classification step:
- Output:
- Manual verification status:
- Evidence path:

## Expected Behavior

- Route changes:
- Refresh:
- Browser reopen:
- Empty state:
- Error state:
- Generated output:

## Observed Failures

| Failure | Screenshot/report | User impact | Severity |
| --- | --- | --- | --- |
|  |  |  |  |

## Design OS Patch Required

| Target failure | Rule/tool/prompt/schema patch | File to update | Status |
| --- | --- | --- | --- |
|  |  |  |  |

## Target App Patch Required

| Target failure | App patch | Validation command | Status |
| --- | --- | --- | --- |
|  |  |  |  |

## Validation Commands

```sh
node tools/playwright-doctor.mjs --url <target-url> --browser auto
node tools/visual-qa.mjs --url <target-url> --name <target-name> --browser auto --tmpdir .tmp/playwright
node tools/import-manual-screenshots.mjs --name <target-name> --390 path/to/390.png --768 path/to/768.png --1440 path/to/1440.png
node tools/design-os.mjs validate-done-report done-report.local.json
node tools/design-os.mjs doctor
git diff --check
```

## Final Learning

- What the target app proved:
- What Miguel Design OS failed to prevent:
- What Miguel Design OS now prevents:
- Remaining open risk:
