# Design OS Cleanup Plan

This is a plan only. No cleanup commands were run during the integrity audit.

## Immediate Safe Cleanup

Likely low-risk cleanup after Migi approval:

1. Delete `.DS_Store` files under the repo.
2. Delete ignored local report files if no active QA run depends on them:
   - `asset-manifest.local.json`
   - `design-brief.local.json`
   - `done-report.local.json`
   - `inspiration-manifest.local.json`
   - `inspiration-queue.local.json`
   - `target-copy-report.local.json`
   - `docs/concept-runs/2026-07-01T17-13-59-231Z/visual-concepts.local.json`
   - `smoke-tests/visual-concept-gate-v2/*.local.json`
3. Delete or keep local-only archive:
   - `research-input/taste-motion-skills/taste-motion-skill-pack.zip`
4. Decide whether `research-input/ai-ui-builders/notes` should get `.gitkeep` or be deleted.
5. Delete `deprecated/studio/dist` if Studio source is retained but build output is not needed.

## Needs Migi Approval

These are not safe to remove without a choice from Migi:

1. Raw research files under:
   - `research-input/ai-ui-builders/raw/`
   - `research-input/taste-motion-skills/raw/`
2. Deprecated Studio source:
   - `deprecated/studio/`
   - `deprecated/studio-preview/`
   - `deprecated/studio-docs/`
3. Historical roadmap/audit docs that discuss Studio or "Lovable inside the repo":
   - `docs/audits/design-os-current-state-audit.md`
   - `docs/audits/lovable-gap-audit.md`
   - `docs/strategy/design-os-extreme-power-roadmap.md`
   - `docs/roadmap/lovable-inside-repo-roadmap.md`
4. Older wrapper workflows:
   - `agent-workflows/generate-new-app.md`
   - `agent-workflows/fix-ui-until-elite.md`
   - `agent-workflows/review-ui-like-miguel.md`
   - `agent-workflows/visual-target-reconstruction-mode.md`

## Keep As Intentional Placeholders

Keep these unless the related feature is abandoned:

- `skills/taste-skill/blocks/*/.gitkeep`
- `inspiration-library/screenshots/.gitkeep`
- `docs/qa-runs/.gitkeep`
- `docs/comparisons/.gitkeep`
- `docs/object-swap/.gitkeep`
- `docs/concept-runs/.gitkeep`
- `visual-library/case-studies/.gitkeep`
- `visual-library/inspiration/.gitkeep`
- `visual-library/rejected/.gitkeep`

## Merge / Deprecate Candidates

Do not merge yet. Recommended consolidation sequence:

1. Make `agent-workflows/reference-locked-build-mode.md` the single source of truth for Reference-Locked Build Mode.
2. Make `design-dna/landing-page-craft-rules.md` and `design-dna/anti-ai-tell-preflight.md` the single source of truth for Taste/landing craft.
3. Make `design-dna/motion-and-delight-rules.md` and `skills/review-animations/STANDARDS.md` the single source of truth for motion and animation standards.
4. Make `docs/qa/layout-integrity-rules.md` plus `evaluation/ui-scorecard.md` the single source of truth for P0 layout integrity.
5. Trim `design-dna/new-app-generation-rules.md` into a router/index that links to focused rule files instead of repeating every rule.
6. Clarify skill routing:
   - dashboard surface: `dashboard-graph-system`
   - chart type choice: `data-visualization-selection`
   - landing pattern: `landing-page-pattern-director`
   - landing craft: `landing-page-craft-director`
   - landing final QA: `anti-ai-tell-preflight`
   - motion plan: `motion-craft-director`
   - motion code review: `review-animations`
   - broad polish: `emil-design-engineering`

## Registry Fixes

No immediate registry fixes are required.

Current registry status:

- 23 `SKILL.md` files.
- 23 registry entries.
- No missing entries.
- No stale paths.
- No duplicate IDs.
- No duplicate paths.

Future improvements:

1. Add route priority or primary/secondary skill grouping.
2. Add a `node tools/design-os.mjs doctor` check that validates:
   - every `skills/*/SKILL.md` is registered
   - every registry path exists
   - every `design-intelligence/*.json` parses
   - every prompt template referenced by docs exists
3. Add a registry schema validation step if not already wired into doctor.

## Gitignore Recommendations

Current `.gitignore` already covers:

- `source-projects/`
- `.DS_Store`
- `node_modules/`
- `dist/`
- `build/`
- `.tmp/`
- `playwright-report/`
- `test-results/`
- `raw-chat-input/`
- `*.local.json`
- local QA run directories
- `smoke-tests/`
- `research-input/taste-motion-skills/*.zip`

Consider adding after Migi decides raw research policy:

```gitignore
research-input/*/raw/
research-input/**/*.zip
```

Alternative if raw files should be committed as provenance:

```gitignore
research-input/**/*.zip
```

Do not ignore manifests or synthesis docs if they are part of the reproducible Design OS memory:

- `research-input/**/manifest.md`
- `research-input/**/manifest.json`
- `docs/research/*.md`

## Suggested Cleanup Command List

Do not run these until Migi approves.

```sh
# Remove Finder metadata.
find . -name ".DS_Store" \
  -not -path "./source-projects/*" \
  -not -path "./captures/*" \
  -not -path "./raw-chat-input/*" \
  -delete

# Remove local generated report files at repo root.
rm -f asset-manifest.local.json \
  design-brief.local.json \
  done-report.local.json \
  inspiration-manifest.local.json \
  inspiration-queue.local.json \
  target-copy-report.local.json

# Remove ignored local concept/smoke artifacts if no longer useful.
rm -rf docs/concept-runs/2026-07-01T17-13-59-231Z
rm -rf smoke-tests/visual-concept-gate-v2

# Remove local zip after download/handoff if Migi no longer needs it.
rm -f research-input/taste-motion-skills/taste-motion-skill-pack.zip

# Remove deprecated Studio build output only, keeping source history.
rm -rf deprecated/studio/dist
```

Possible consolidation commands should be done as manual edits, not blind shell deletion:

```sh
# Review before editing.
sed -n '1,220p' design-dna/new-app-generation-rules.md
sed -n '1,220p' agent-workflows/generate-new-app.md
sed -n '1,220p' agent-workflows/review-ui-like-miguel.md
```

## Suggested Follow-Up Prompt

```md
CLEANUP PASS FOR MIGUEL DESIGN OS AFTER INTEGRITY AUDIT.

Work only inside:
/Users/malmeida/Desktop/miguel-design-os

Do not modify:
- source-projects/
- captures/
- raw-chat-input/
- /Users/malmeida/Desktop/design-os-random-test
- /Users/malmeida/Desktop/visual-taste
- /Users/malmeida/Desktop/robotstack-os

Use:
- docs/qa/design-os-integrity-audit.md
- docs/qa/design-os-cleanup-plan.md

Perform only the approved cleanup:
1. remove .DS_Store files
2. remove ignored local reports
3. keep raw manifests and synthesis docs
4. do not delete raw research unless explicitly approved
5. do not delete deprecated Studio source unless explicitly approved
6. update .gitignore based on selected raw research policy
7. do not change design rules except to mark generated artifacts clearly

Run:
node tools/design-os.mjs doctor
node tools/design-os.mjs list-skills
git diff --check

Final response:
- files deleted
- files updated
- what was intentionally preserved
- validation results
- confirmation protected folders untouched
```
