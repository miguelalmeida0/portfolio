# Weekend Visual Engine Sprint v1

This historical sprint turned Visual Swarm v1 into a local build workflow. The current primary workflow is simpler: rules + `visual-library/` + prompts + screenshot QA.

It does not use paid tools, API keys, hosted Lovable, screenshot-to-code generation, Onlook hosted usage, or external model calls.

## Flow

1. Route the agents.
2. Scout inspiration and validate the queue/manifest.
3. Render 3 concepts as project-local routes, static previews, or screenshot-backed reference notes.
4. Capture concept screenshots at `390 / 768 / 1440`.
5. Approve one concept.
6. Use Literal Target Copy Mode when an exact target exists.
7. Compare target/current screenshots.
8. Validate assets.
9. Run visual QA.
10. Validate done report.
11. Productionize only after the visual shell passes.

## Commands

```sh
node tools/design-os.mjs route-agent --task "Build cinematic robot selection app from award-winning inspiration and target screenshots"
node tools/new-inspiration-queue.mjs
node tools/validate-inspiration-queue.mjs inspiration-library/queues/weekend-visual-corpus.queue.json
node tools/playwright-doctor.mjs --url http://localhost:5173 --browser auto
node tools/visual-qa.mjs --url http://localhost:5173 --name concept-preview --browser auto --tmpdir .tmp/playwright
node tools/compare-screenshots.mjs --target path/to/target.png --current path/to/current.png --name robotstack-roster
node tools/visual-qa.mjs --url http://localhost:5173 --name robotstack-roster
node tools/object-swap-check.mjs --url http://localhost:5173 --objects "Atlas,Neo,Phoenix,Digit,Figure" --name robotstack-roster
node tools/design-os.mjs validate-done-report done-report.local.json
```

## Evidence Outputs

- `inspiration-queue.local.json`
- `inspiration-manifest.local.json`
- `docs/concept-runs/<run>/visual-concepts.local.json`
- `docs/comparisons/<run>/comparison-report.json`
- `docs/qa-runs/<run>/visual-qa-report.json`
- `docs/object-swap/<run>/object-swap-report.json`
- `done-report.local.json`

Generated screenshot/run folders are gitignored.

## Playwright

The browser scripts use local Playwright only when available. This sprint did not install Playwright. If it is missing, capture scripts produce a clear setup error or blocked report.
