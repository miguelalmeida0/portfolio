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
- Original case-study behavior and motion tests: 35 passed.
- All four case-study heading sets and heading bounds match Friday's deployment
  at 390, 1440 and 2560 pixels; desktop zoom is 0.8; no horizontal overflow.
- Browser evidence is generated under `artifacts/case-recovery` by
  `node scripts/verify-case-recovery.mjs`.

The handoff README/status files are historical source documents, not current
release status. See `DEPLOYMENT.md` for the current production target.
