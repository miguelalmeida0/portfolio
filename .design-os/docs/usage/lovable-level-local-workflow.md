# Lovable-Level Local Workflow

Miguel Design OS gets closer to Lovable-level visual output by forcing visual work to happen before production code.

## Local Loop

1. Scout inspiration with source policy and attribution.
2. Render 3 distinct visual concepts locally.
3. Capture concept screenshots.
4. Get Migi approval.
5. Copy exact targets only when Literal Target Copy Mode is active.
6. Compare target/current screenshots.
7. Run asset hygiene.
8. Run visual QA.
9. Validate done report.
10. Productionize only after the visual shell passes.

## Screenshot Proof Fallback Loop

When Playwright or Chromium fails, do not claim visual QA passed. Run:

```sh
node tools/playwright-doctor.mjs --url http://localhost:5173 --browser auto
node tools/visual-qa.mjs --url http://localhost:5173 --name <project-name> --browser auto --tmpdir .tmp/playwright
```

If every automated browser path fails, import app-only screenshots:

```sh
node tools/import-manual-screenshots.mjs --name <project-name> --390 path/to/390.png --768 path/to/768.png --1440 path/to/1440.png
node tools/visual-qa.mjs --manual --input-dir docs/qa-runs/<run>/screenshots --name <project-name>
```

Manual import is fallback evidence, not automation success. Browser chrome, desktop, dock, editor UI, and watermarks are invalid screenshot proof.

## What This Blocks

- Text-only concept approval.
- Product logic before visual shell parity.
- Target screenshots used as production assets.
- Watermark/editor/browser artifacts in production UI.
- Build/lint being used as visual QA.
- Dead buttons and fake done reports.

## Local Tools

- `tools/new-inspiration-queue.mjs`
- `tools/validate-inspiration-queue.mjs`
- `tools/capture-concepts.mjs`
- `tools/compare-screenshots.mjs`
- `tools/visual-qa.mjs`
- `tools/playwright-doctor.mjs`
- `tools/import-manual-screenshots.mjs`
- `tools/object-swap-check.mjs`
- `tools/design-os.mjs`

No hosted visual builder is required.
