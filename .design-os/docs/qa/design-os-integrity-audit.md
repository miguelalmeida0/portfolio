# Design OS Integrity Audit

Date: 2026-07-02

Scope: audit-only pass for `/Users/malmeida/Desktop/miguel-design-os`.

No files were deleted, renamed, moved, or cleaned during this audit. Protected folders were inspected only through allowed repository-level commands and were not modified.

## Phase 1 - Baseline State

Commands run:

- `git status --short`
- `git branch --show-current`
- `node tools/design-os.mjs doctor`
- `node tools/design-os.mjs list-skills`

| Check | Result |
| --- | --- |
| Current branch | `main` |
| Git status summary before this report | 65 status rows: 16 modified, 48 untracked, 1 other, 0 deleted |
| Doctor | Passed |
| Skill list | Passed, 23 skills listed |

Immediate observations:

- The worktree is intentionally large after several ingestion passes. Most risk is from overlap and untracked artifacts, not from failing validation.
- `node tools/design-os.mjs doctor` passes, but the doctor does not currently validate every new Design OS artifact, such as all prompt markdown files and all `design-intelligence/*.json` files.
- `node tools/design-os.mjs list-skills` includes the new Taste, Emil, motion, delight, landing, image-first, mobile, chart, and style skills.

## Phase 2 - Directory Inventory

Commands run:

- `find . -maxdepth 3 -type d | sort`
- `find skills -maxdepth 3 -type d | sort`
- `find agent-workflows -maxdepth 2 -type f | sort`
- `find templates -maxdepth 3 -type f | sort`
- `find design-dna -maxdepth 2 -type f | sort`
- `find design-intelligence -maxdepth 2 -type f | sort`
- `find docs -maxdepth 4 -type f | sort`
- `find research-input -maxdepth 4 -type f | sort 2>/dev/null || true`

Major folders:

| Folder | Appears to contain | Audit note |
| --- | --- | --- |
| `agents/` | Visual Swarm instruction agents | Active instruction layer. Not a frontend app. |
| `agent-workflows/` | Markdown workflows for visual reference, reference-locking, image-first, app generation, implementation, review | Useful, but overlapping. Needs routing consolidation. |
| `design-dna/` | Core rules, modes, recipes, anti-patterns, compact context | Main rule memory. `new-app-generation-rules.md` is now very large and duplicates more focused files. |
| `design-intelligence/` | JSON/Markdown recommendation libraries for charts, color, style, landing, motion, delight, AI tells | JSON is valid. Some JSON files lack adjacent guidance docs. |
| `docs/` | Architecture, audits, QA reports, usage docs, research syntheses, roadmap | Useful but contains older roadmap/studio-era docs that may confuse future agents unless clearly marked. |
| `evaluation/` | UI scorecard | Active enforcement layer. |
| `examples/` | Valid/invalid evidence examples | Active validation examples. |
| `research-input/` | Raw source archives and manifests | Correct place for raw source material. Needs ignore policy decision. |
| `schemas/` | JSON schemas | Active validation layer. |
| `skills/` | Skill registry and skill folders | Registry is currently structurally clean. Several skills overlap by design. |
| `templates/` | Report templates and Codex prompt templates | Active generation layer. |
| `tools/` | CLI and local QA scripts | Active tooling layer. |
| `visual-library/` | Approved/rejected screenshots, manifests, notes, case studies | Active taste memory. Contains `.DS_Store` files. |
| `deprecated/` | Archived Studio and Studio Preview experiments | Correctly deprecated, but still contains frontend app files and a `dist` directory. |
| `source-projects/`, `captures/`, `raw-chat-input/` | Protected source evidence/input folders | Not modified. |

Temporary or suspicious folders:

- `research-input/ai-ui-builders/notes` is empty.
- `deprecated/studio/` and `deprecated/studio-preview/` are intentionally deprecated but still carry package files and source code.
- `docs/concept-runs/2026-07-01T17-13-59-231Z/` contains a generated local concept report and is ignored by `.gitignore`.
- `smoke-tests/` contains generated local smoke artifacts and is ignored by `.gitignore`.

Intentional placeholders:

- `skills/taste-skill/blocks/*` all contain `.gitkeep` and are intentional placeholders.
- `docs/qa-runs/.gitkeep`, `docs/comparisons/.gitkeep`, `docs/object-swap/.gitkeep`, and similar folders look intentional.
- `inspiration-library/screenshots/.gitkeep` is intentional because screenshots are local by default.

## Phase 3 - Empty Folders

Command run:

```sh
find . -type d -empty \
  -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  -not -path "./source-projects/*" \
  -not -path "./captures/*" \
  -not -path "./raw-chat-input/*" \
  | sort
```

Empty folder count: 1.

| Empty folder | Classification | Reason | Recommended action |
| --- | --- | --- | --- |
| `research-input/ai-ui-builders/notes` | Unsure | It looks like a planned notes area, but no README or `.gitkeep` explains it. | Either add `.gitkeep` plus purpose note, or delete after Migi confirms it is not needed. |

Not empty but placeholder-only:

- `skills/taste-skill/blocks/hero`
- `skills/taste-skill/blocks/feature`
- `skills/taste-skill/blocks/social-proof`
- `skills/taste-skill/blocks/pricing`
- `skills/taste-skill/blocks/cta`
- `skills/taste-skill/blocks/footer`
- `skills/taste-skill/blocks/navigation`
- `skills/taste-skill/blocks/portfolio`
- `skills/taste-skill/blocks/transition`

These should stay as intentional placeholders unless Migi decides not to build a Taste block library.

## Phase 4 - Conflict / Duplicate Skill Audit

Command run:

- `find skills -name "SKILL.md" -type f | sort`

23 skill files were found.

| Area | Files | Relationship | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| Image-first frontend | `skills/image-first-frontend/SKILL.md`, `skills/image-first-website-to-code/SKILL.md`, `skills/landing-page-craft-director/SKILL.md` | Complementary but close. `image-first-frontend` is general, `image-first-website-to-code` is website/landing implementation, `landing-page-craft-director` is section/craft direction. | Agents may load all three and duplicate work. | Keep separate, but document routing order: craft director -> image-first workflow -> website-to-code only when implementing a website/landing output. |
| Landing page direction | `skills/landing-page-pattern-director/SKILL.md`, `skills/landing-page-craft-director/SKILL.md`, `skills/anti-ai-tell-preflight/SKILL.md` | Complementary. Pattern chooses structure, craft defines section behavior, preflight blocks Taste failures. | Medium overlap in section rhythm and Blogspot prevention. | Keep separate. Preferred order: pattern director before spec, craft director during spec, anti-AI-tell preflight before final handoff. |
| General visual review | `skills/anti-ai-slop-review/SKILL.md`, `skills/frontend-art-director-review/SKILL.md`, `skills/screenshot-scorecard-review/SKILL.md` | Complementary review lenses. Anti-slop catches failure modes, art director critiques taste, screenshot review checks evidence. | Medium risk that a review task loads too much. | Keep separate. Preferred order: screenshot evidence first when runnable, anti-slop for blockers, art director for elite critique. |
| Target/reference reconstruction | `skills/visual-target-reconstruction/SKILL.md`, `agent-workflows/reference-locked-build-mode.md`, `templates/reference-decomposition.template.md`, `templates/design-transfer-spec.template.md` | Complementary. Skill routes and evaluates, workflow defines process, templates define artifacts. | Low structural risk, high repetition across docs. | Keep. Make `agent-workflows/reference-locked-build-mode.md` the source of truth. |
| Visual spec | `skills/visual-spec-compiler/SKILL.md`, `templates/visual-spec.template.md`, `design-dna/design-system-first-rules.md` | Complementary. Skill compiles, template captures, DNA sets prerequisites. | Low. | Keep. Doctor should eventually verify template exists when skill exists. |
| Dashboard charts | `skills/dashboard-graph-system/SKILL.md`, `skills/data-visualization-selection/SKILL.md`, `design-intelligence/chart-recommendation-matrix.json` | Complementary but overlapping. Dashboard graph system is mode-specific; data visualization selection is chart-type logic. | Medium routing ambiguity for "dashboard chart" tasks. | Preferred order: dashboard-graph-system for dashboard surface, data-visualization-selection for specific chart choice. |
| Style/color | `skills/visual-style-selection/SKILL.md`, `design-intelligence/style-taxonomy.json`, `design-intelligence/product-color-matrix.json` | Complementary. | Low. | Keep. Avoid treating style taxonomy as taste override. |
| Motion | `skills/motion-craft-director/SKILL.md`, `skills/review-animations/SKILL.md`, `skills/review-animations/STANDARDS.md`, `skills/animation-vocabulary/SKILL.md`, `skills/emil-design-engineering/SKILL.md` | Complementary but close. Motion craft plans; review-animations audits code; vocabulary names effects; Emil skill reviews overall craft. | Medium. Agents may use Emil when they need strict animation review. | Keep separate. Preferred order: vocabulary only when naming, motion-craft before implementation, review-animations after code changes, Emil for broader polish. |
| Delight | `skills/delight-opportunity-director/SKILL.md`, `skills/motion-craft-director/SKILL.md`, `design-intelligence/delight-opportunities.json` | Complementary. | Low. | Keep. Delight should never replace core UX fixes. |
| Mobile | `skills/mobile-product-flow/SKILL.md`, `design-dna/mobile-product-rules.md`, mobile reference folder rules | Complementary. | Low. | Keep. Route only for mobile-primary or mobile reference tasks. |

No direct skill contradictions were found. The bigger risk is agent over-selection and repeated gates.

## Phase 5 - Skill Registry Audit

Files checked:

- `skills/skill-registry.json`
- `schemas/skill-registry.schema.json`
- `tools/design-os.mjs`

JSON parse result: valid.

Registry structural check:

```json
{
  "skillFileCount": 23,
  "registryEntryCount": 23,
  "missing": [],
  "stale": [],
  "duplicateIds": [],
  "duplicatePaths": []
}
```

Findings:

- Every `skills/*/SKILL.md` appears in `skills/skill-registry.json`.
- Every registry path exists.
- No duplicate skill IDs.
- No duplicate skill paths.
- `tools/design-os.mjs route --task` uses registry `routeKeywords`.
- `tools/design-os.mjs route-agent --task` uses a separate hardcoded Visual Swarm agent list.

Risk:

- Registry is structurally clean, but routing can still be ambiguous for overlapping areas:
  - dashboard chart work can match both dashboard and data-visualization skills
  - landing/image-first tasks can match several landing-related skills
  - motion planning vs motion review needs clearer distinction

Recommendation:

- Do not modify registry immediately.
- Add a future route-priority field or explicit "primary/secondary skill" grouping if routing ambiguity becomes a real workflow problem.

## Phase 6 - Workflow Overlap Audit

Files inspected:

- `agent-workflows/simple-visual-reference-workflow.md`
- `agent-workflows/reference-locked-build-mode.md`
- `agent-workflows/image-first-frontend-workflow.md`
- `agent-workflows/frontend-aha-moment-workflow.md`
- `agent-workflows/efficient-agent-implementation-workflow.md`
- `agent-workflows/generate-new-app.md`
- `agent-workflows/fix-ui-until-elite.md`
- `agent-workflows/review-ui-like-miguel.md`
- `agent-workflows/visual-target-reconstruction-mode.md`
- `agent-workflows/ingest-new-project.md`

| Workflow | Purpose | Overlap | Conflict risk | Recommendation |
| --- | --- | --- | --- | --- |
| `simple-visual-reference-workflow.md` | Current high-level visual-library workflow | Overlaps with reference-locked and image-first workflows | Medium. It is now very long and contains many embedded rule sections. | Keep as router, but later trim to links and required order. |
| `reference-locked-build-mode.md` | Exact reference anchor/decomposition/transfer spec workflow | Overlaps with visual-target reconstruction and simple workflow | Low. Clear source of truth for reference-locked mode. | Keep as source of truth. |
| `image-first-frontend-workflow.md` | Reference/image-first build process | Overlaps with landing craft and image-first website skill | Low-medium. | Keep. Route after Reference-Locked decision when images/section references drive implementation. |
| `frontend-aha-moment-workflow.md` | Product loop before backend | Overlaps with generate-new-app | Low. | Keep as implementation phase after visual spec/design system. |
| `efficient-agent-implementation-workflow.md` | Engineering discipline while coding | Overlaps lightly with AGENTS developer habits | Low. | Keep as implementation hygiene workflow. |
| `generate-new-app.md` | Older full new app workflow | Overlaps heavily with newer visual spec, dials, design-system-first, reference-locked, and aha moment workflows | Medium-high. It may become stale. | Mark as legacy or update later to delegate to newer workflows. |
| `fix-ui-until-elite.md` | Iterative UI repair loop | Overlaps with screenshot scorecard, anti-slop, art director | Medium. | Keep as repair wrapper, but route to current skills explicitly. |
| `review-ui-like-miguel.md` | UI critique workflow | Overlaps with anti-slop, screenshot scorecard, art director | Medium. | Keep as review wrapper, but update later with Taste/motion/report gates. |
| `visual-target-reconstruction-mode.md` | Older target reconstruction workflow | Overlaps with Reference-Locked and Literal Target Copy rules | Medium. | Keep if still referenced, but consolidate later under visual-target skill/reference-locked workflow. |
| `ingest-new-project.md` | Ingest completed project into memory | Unique | Low. | Keep. |

Recommended routing order for future visual-heavy work:

1. Classify task mode.
2. Declare active dials.
3. Choose Reference-Locked Build Mode or image-first mode when references drive the work.
4. Create visual spec.
5. Define design-system tokens.
6. Implement frontend aha moment.
7. Capture screenshot QA.
8. Score with scorecard.
9. Run motion/polish review if motion or delight exists.

Potential contradiction:

- `generate-new-app.md` still centers Visual Concept Gate heavily and does not fully reflect the new dials/design-system/aha/motion flow. It is not wrong, but it is no longer the cleanest source of truth.

## Phase 7 - Doc Conflict Audit

Files inspected:

- `AGENTS.md`
- `README.md`
- `design-dna/00_COMPACT_AGENT_CONTEXT.md`
- `design-dna/new-app-generation-rules.md`
- `design-dna/design-generation-dials.md`
- `design-dna/design-system-first-rules.md`
- `design-dna/brief-inference-rules.md`
- `design-dna/anti-ai-tell-preflight.md`
- `design-dna/motion-and-delight-rules.md`
- `design-dna/landing-page-craft-rules.md`
- `design-dna/approved-directions.md`
- `design-dna/rejected-directions.md`
- `design-dna/anti-patterns.md`
- `design-dna/layout-recipes.md`
- `evaluation/ui-scorecard.md`

Line count risk:

| File | Lines | Audit note |
| --- | ---: | --- |
| `design-dna/new-app-generation-rules.md` | 1412 | Too large; contains many mode rules that now have dedicated files. |
| `design-dna/anti-patterns.md` | 1002 | Large but expected; anti-pattern catalog. |
| `design-dna/rejected-directions.md` | 759 | Large but expected; rejected direction catalog. |
| `evaluation/ui-scorecard.md` | 610 | Large but expected; enforcement catalog. |
| `design-dna/layout-recipes.md` | 461 | Large but manageable. |
| `design-dna/approved-directions.md` | 476 | Large but manageable. |

Duplicate clusters:

| Cluster | Appears in | Conflict? | Recommended source of truth |
| --- | --- | --- | --- |
| Reference-Locked Build Mode | `AGENTS.md`, compact context, new-app rules, simple workflow, reference-locked workflow, scorecard, several skills | Mostly consistent, but repeated many times | `agent-workflows/reference-locked-build-mode.md` plus templates; other files should summarize/link. |
| Landing/artistic/image-led rules | README, AGENTS, compact context, new-app rules, landing craft rules, anti-AI preflight, layout recipes, approved/rejected, anti-patterns, skills | Mostly consistent | `design-dna/landing-page-craft-rules.md` and `design-dna/anti-ai-tell-preflight.md`. |
| Dashboard mode | README, AGENTS, compact context, new-app rules, layout recipes, approved/rejected, anti-patterns, scorecard, dashboard extraction doc | Mostly consistent but very spread out | Keep dashboard taste in a future dedicated file or `docs/qa/dashboard-direction-extraction.md`; keep caps in scorecard. |
| Motion and delight | AGENTS, compact context, new-app rules, design-system-first, motion-and-delight, anti-patterns, skills, scorecard | Consistent but repeated | `design-dna/motion-and-delight-rules.md` and `skills/review-animations/STANDARDS.md`. |
| P0 layout integrity | compact context, new-app rules, layout recipes, approved/rejected/anti-patterns, scorecard, `docs/qa/layout-integrity-rules.md`, screenshot skill | Consistent | `docs/qa/layout-integrity-rules.md` for explanation, scorecard for caps, compact context for summary. |
| Design-system-first | AGENTS, README, compact context, new-app rules, visual spec skill, design-system-first rules | Consistent | `design-dna/design-system-first-rules.md`. |
| Evidence gates / done report | compact context, skills, scorecard, usage docs | Consistent | schemas/templates plus `docs/usage/p0-1-evidence-gates.md`. |

Contradictions found:

- No hard contradictions were found in active docs.
- The main risk is duplication and source-of-truth ambiguity.
- Dashboard-specific rules are mostly marked as dashboard mode, but because `new-app-generation-rules.md` is so large, future agents may over-read and apply dashboard requirements to landing/product tasks.
- Landing rules are repeated enough that agents may run pattern/craft/preflight redundantly unless routing is simplified.
- Motion rules are consistent with anti-animation-fatigue guidance: motion is allowed only with purpose, frequency fit, and reduced-motion support.

Broken or missing references in `README.md` / `AGENTS.md`:

- Several referenced artifacts are generated-per-project and do not currently exist in `docs/design/`, including:
  - `docs/design/visual-spec.md`
  - `docs/design/reference-usage-report.md`
  - `docs/design/reference-decomposition.md`
  - `docs/design/design-transfer-spec.md`
  - `docs/design/chart-selection-report.md`
  - `docs/design/visual-style-selection-report.md`
  - `docs/design/image-first-website-analysis.md`
  - `docs/qa/reference-match-report.md`
- Templates exist for most of these:
  - `templates/visual-spec.template.md`
  - `templates/reference-decomposition.template.md`
  - `templates/design-transfer-spec.template.md`
  - `templates/chart-selection-report.template.md`
  - `templates/visual-style-selection-report.template.md`
  - `templates/image-first-website-analysis.template.md`
- This is not a blocker if docs treat those paths as generated artifacts. Future cleanup should make that explicit.
- `.design-os/tools/design-os.mjs` appears in README embedded usage. It is not a missing repo file; it is the expected path after embedding this repo as `.design-os`.
- `live/validated/optimized` was detected as a false-positive path reference in compact context because it is a label set in backticks.

Studio status in docs:

- `AGENTS.md`, `README.md`, and compact context all correctly say the frontend Studio is deprecated/not part of the current workflow.
- Older roadmap/audit docs still discuss Studio-like or "Lovable inside repo" infrastructure. They are in docs/roadmap, docs/audits, or docs/strategy and should be treated as historical/planning docs, not current workflow.

## Phase 8 - Research Input / Raw File Audit

Commands run:

- `find research-input -maxdepth 5 -type f | sort`
- `du -sh research-input 2>/dev/null || true`
- `find research-input -name "*.zip" -type f -print`

Findings:

- `research-input` size: `652K`.
- Raw research files are stored under `research-input/*/raw/`.
- Manifests exist:
  - `research-input/ai-ui-builders/manifest.md`
  - `research-input/ai-ui-builders/manifest.json`
  - `research-input/taste-motion-skills/manifest.md`
  - `research-input/taste-motion-skills/manifest.json`
- One zip archive exists:
  - `research-input/taste-motion-skills/taste-motion-skill-pack.zip`
- `.DS_Store` files exist under `research-input/`.

Raw-source containment check:

- A search for obvious raw prompt signatures outside `research-input/`, `source-projects/`, `captures/`, and `raw-chat-input/` did not find evidence that huge raw prompts were pasted into normal rule docs.
- Main docs contain summaries and references to raw files, which is expected.

Gitignore status:

| Pattern / file | Current status |
| --- | --- |
| `.DS_Store` | Ignored globally by `.gitignore`, but files exist locally. |
| `*.local.json` | Ignored globally. |
| `research-input/taste-motion-skills/*.zip` | Ignored specifically. |
| `research-input/*/raw/` | Not ignored currently. |
| `research-input/**/*.zip` | Not generally ignored; only Taste zip path is covered. |

Recommendation:

- Decide whether raw research files should be committed as provenance or ignored as local/private source material.
- Zip archives should remain ignored and should not be committed.
- Manifests and synthesis docs should be committed if Migi wants the ingested research to be reproducible.

## Phase 9 - Generated / Temp / Build Artifact Audit

Commands run:

- Broad command from brief:
  - `find . -name ".DS_Store" -o -name "*.local.json" -o -name "*.zip" -o -name "dist" -o -name "build" -o -name ".tmp" -o -name "playwright-report" -o -name "test-results" | sort`
- Focused command excluding protected project trees:
  - `find . \( -path './source-projects' -o -path './captures' -o -path './raw-chat-input' -o -path './.git' \) -prune -o ...`

Focused findings:

| Artifact | Classification | Recommended action |
| --- | --- | --- |
| `./.DS_Store` and `.DS_Store` under `research-input/`, `visual-library/`, `skills/`, `inspiration-library/` | Should be deleted | Ignored by git, safe local cleanup later. |
| `asset-manifest.local.json` | Local generated report | Delete if no active QA run needs it. |
| `design-brief.local.json` | Local generated report | Delete if no active QA run needs it. |
| `done-report.local.json` | Local generated report | Delete if no active QA run needs it. |
| `inspiration-manifest.local.json` | Local generated report | Delete if no active QA run needs it. |
| `inspiration-queue.local.json` | Local generated report | Delete if no active QA run needs it. |
| `target-copy-report.local.json` | Local generated report | Delete if no active QA run needs it. |
| `docs/concept-runs/2026-07-01T17-13-59-231Z/visual-concepts.local.json` | Generated local concept run | Keep ignored or delete if no longer useful. |
| `smoke-tests/visual-concept-gate-v2/*.local.json` | Generated smoke artifacts | Keep ignored or delete if no longer useful. |
| `research-input/taste-motion-skills/taste-motion-skill-pack.zip` | Local handoff archive | Keep ignored locally or delete after Migi downloads. |
| `deprecated/studio/dist` | Old build output under deprecated frontend | Delete with approval if deprecated Studio source is kept. |

The broad scan also reported many `dist`, `build`, `.zip`, and `.local.json` files under protected `source-projects/node_modules` and app build folders. Those were not modified and are outside this cleanup scope.

## Phase 10 - Frontend / Studio Remnant Audit

Command run:

```sh
find . -maxdepth 3 \( -name "studio" -o -name "studio-preview" -o -name "package.json" -o -name "vite.config.*" -o -name "src" -o -name "app" \) -print
```

Findings:

- Active root-level frontend app folders were not found.
- Studio remnants exist only under:
  - `deprecated/studio/`
  - `deprecated/studio-preview/`
- Both deprecated folders include frontend app files such as `package.json`, `src`, and in the Studio case `vite.config.ts`.
- `deprecated/studio/dist` exists and is a build artifact.
- `README.md`, `AGENTS.md`, and compact context clearly state Studio is deprecated and not the primary workflow.

Recommendation:

- Do not revive Studio.
- Keep deprecated folders only if Migi wants historical source.
- If not, delete `deprecated/studio/`, `deprecated/studio-preview/`, and `deprecated/studio-docs/` in a cleanup pass after approval.

## Phase 11 - Design Intelligence Audit

Command run:

```sh
find design-intelligence -name "*.json" -type f -print0 | xargs -0 -I{} node -e "JSON.parse(require('fs').readFileSync('{}','utf8')); console.log('ok {}')"
```

JSON validity:

- `design-intelligence/frontend-ai-tells.json`: ok
- `design-intelligence/landing-patterns.json`: ok
- `design-intelligence/style-taxonomy.json`: ok
- `design-intelligence/chart-recommendation-matrix.json`: ok
- `design-intelligence/product-color-matrix.json`: ok
- `design-intelligence/motion-standards.json`: ok
- `design-intelligence/landing-section-composition-library.json`: ok
- `design-intelligence/delight-opportunities.json`: ok

Guidance docs beside matrices:

| JSON | Adjacent guidance? | Note |
| --- | --- | --- |
| `product-color-matrix.json` | `color-guidance.md` | Good. |
| `chart-recommendation-matrix.json` | `chart-guidance.md` | Good. |
| `style-taxonomy.json` | `style-taxonomy.md` | Good. |
| `landing-patterns.json` | `landing-pattern-guidance.md` | Good. |
| `frontend-ai-tells.json` | No adjacent markdown | Covered partly by `design-dna/anti-ai-tell-preflight.md`, but a short guidance doc would help. |
| `motion-standards.json` | No adjacent markdown | Covered by `design-dna/motion-and-delight-rules.md` and `skills/review-animations/STANDARDS.md`. |
| `delight-opportunities.json` | No adjacent markdown | Covered by `skills/delight-opportunity-director/SKILL.md`. |
| `landing-section-composition-library.json` | No adjacent markdown | Covered by `design-dna/landing-page-craft-rules.md`, but a short guidance doc would help. |

Overlap:

- `landing-patterns.json` and `landing-section-composition-library.json` complement each other. The first is page pattern; the second is section composition ingredients.
- `motion-standards.json` and `skills/review-animations/STANDARDS.md` overlap. The markdown should be the review source of truth; JSON is useful for programmatic lookup later.
- `frontend-ai-tells.json` and `design-dna/anti-ai-tell-preflight.md` overlap. The DNA file should be human routing; JSON can power future tooling.

## Overall Findings

Highest-confidence issues:

1. The repo is structurally valid but too duplicated across docs.
2. `design-dna/new-app-generation-rules.md` has become a mega-file and should not keep absorbing every new rule.
3. Several workflows are wrappers around the same sequence and need a clear router/source-of-truth relationship.
4. Raw research is well-contained, but raw folders are not ignored generally.
5. `.DS_Store` files and local JSON reports exist and should be cleaned later.
6. The deprecated Studio code is isolated correctly but still present.
7. Missing `docs/design/*.md` and `docs/qa/reference-match-report.md` artifacts are expected generated outputs, but docs should label them as generated to avoid false missing-file alarms.
8. Skill registry is clean.

Recommended next action:

Review `docs/qa/design-os-cleanup-plan.md` before running cleanup. Do not clean immediately if Migi wants to preserve raw research files, deprecated Studio history, or local evidence reports.
