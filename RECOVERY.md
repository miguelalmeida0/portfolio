# Case-study recovery, 4 October 2026

## Cause

The Needle release (`6ffe791`, deployment `52a1008d`) was built from `main`,
which still contained the older case studies. The Thursday/Friday case studies
had been deployed from an uncommitted production worktree and were absent from
the release branch. That worktree was subsequently missing from disk.

## Recovered source

This checkout starts from that Needle release. The four case studies were
recovered from the original `leu-flow-handoff.zip` and `f24-sv-handoff.zip`, plus
the source edits recorded in the 1 October integration session. Their reference
HTML, pinned fonts, and original interaction/pixel tests are under
`tests/case-studies` and `tests/f24-sv`.

The subsequent Needle palette release (`1a32264`) was merged into this recovery
before publishing. Its project background change is preserved.

The reviewed comparison deployment is `1ed04fb5`. The recovered pages retain
their original copy, interactive models, scoped styles, and motion. Leu's
unfinished native recording section remains omitted, as in the reviewed version.
Existing `/work/second-voice-ai` and `/work/ghostwriter` links redirect to the
restored `/work/second-voice` page.

The same release also restores the previously approved 80% desktop presentation,
the “Straight to the point.” scroll welcome, and “hundreds of companies” copy.
Needle remains the first homepage project; its case study, images and app links
are retained from `6ffe791`.

## Validation

- Svelte check: zero errors and warnings; production build passes.
- Existing unit suite: 77 passed.
- Restored data and diff tests: 11 passed.
- Original case-study behavior and motion tests: 35 passed.
- Needle and intro welcome: 20 browser checks passed on desktop and mobile.
- Complete case-study captures at 390 and 1440 pixels match Friday's deployed
  pages with zero differing pixels, for all four projects. Reproduce with
  `node scripts/compare-friday-case-studies.mjs`.
- All four case-study heading sets and heading bounds match Friday's deployment
  at 390, 1440 and 2560 pixels; desktop zoom is 0.8; no horizontal overflow.
- Browser evidence is generated under `artifacts/case-recovery` by
  `node scripts/verify-case-recovery.mjs`.

The older handoff-draft visual suite is not fully green: Flow's mobile latency
marker differs by 32 pixels and the pending Tomorrow event by 1014 pixels.
The same two differences reproduce against Friday's deployed page. The handoff
also still includes the Leu native-recording section removed in the reviewed
deployment. The recovery target is the reviewed deployment; draft assertions
and their thresholds have not been weakened.

The handoff README/status files are historical source documents, not current
release status. See `DEPLOYMENT.md` for the current production target.
