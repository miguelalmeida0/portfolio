# Screenshot Proof Unblocker

Visual work is not done until screenshot evidence exists or the blocker is documented honestly. Build and lint are useful checks, but they are not visual QA.

## Automated Mode

Prefer automated capture:

```sh
node tools/visual-qa.mjs --url http://localhost:5173 --name visual-taste-design-genome --browser auto
```

`--browser auto` tries Chromium first, then the installed Google Chrome channel, then WebKit. The report records `captureMode`, browser attempts, screenshots, blockers, console errors, and manual checklist fields.

## Playwright Doctor

Run the doctor before assuming screenshots are impossible:

```sh
node tools/playwright-doctor.mjs --url http://localhost:5173 --browser auto
```

It writes:

```txt
docs/qa-runs/playwright-doctor-latest.json
docs/qa-runs/playwright-doctor-latest.md
```

The doctor checks Node, platform, current directory, Playwright package availability, `@playwright/test`, browser binaries, Chromium launch, Google Chrome channel launch, WebKit launch, screenshot write, temp directory, `TMPDIR`, and the next command to try.

## Chrome Channel Fallback

If bundled Chromium fails but Google Chrome is installed:

```sh
node tools/visual-qa.mjs --url http://localhost:5173 --name visual-taste-design-genome --browser chrome
```

This uses Playwright's Chrome channel and does not require bundled Chromium to succeed.

## TMPDIR Fallback

If temp artifact creation fails, isolate temp files:

```sh
node tools/visual-qa.mjs --url http://localhost:5173 --name visual-taste-design-genome --browser auto --tmpdir .tmp/playwright
```

The report records whether the override was used. If macOS still blocks browser launch, the exact failure chain is written and the run remains blocked.

## Manual Import Fallback

Manual import is acceptable only for app-only screenshots captured at known viewport widths:

```sh
node tools/import-manual-screenshots.mjs \
  --name visual-taste-design-genome \
  --390 path/to/390.png \
  --768 path/to/768.png \
  --1440 path/to/1440.png
```

Then normalize the imported folder through visual QA manual mode if needed:

```sh
node tools/visual-qa.mjs --manual --input-dir docs/qa-runs/<run>/screenshots --name visual-taste-design-genome
```

Manual import writes `captureMode: manual-import` and `finalStatus: needs-human-review` unless the manual checklist is later filled honestly and all required checks pass.

## Valid Manual Screenshots

Valid fallback evidence:

- app-only screenshots
- captured at 390, 768, and 1440 viewport widths
- no browser chrome
- no editor UI
- no macOS dock or desktop
- no watermark or source-site artifact
- known route/screen and project name

Invalid evidence:

- macOS desktop screenshots
- browser chrome, tabs, URL bar, or bookmarks
- editor previews with surrounding UI
- dock/menu bar screenshots
- cropped random screenshots with unknown viewport
- screenshots with watermarks or source-site labels

## Done Report Rules

`finalStatus: done` fails when:

- visual QA status is `blocked`
- visual QA `captureMode` is missing
- `captureMode` is `blocked`
- `captureMode` is `manual-import` and manual checks are not all passing
- any required viewport screenshot is missing
- dead buttons exist
- score is below 80

`finalStatus: needs-work` may pass with blocked visual QA. That is intentional: the report is allowed to say the UI is not done. It must not be treated as complete.
