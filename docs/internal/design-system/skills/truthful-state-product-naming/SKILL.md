# truthful-state-product-naming

## Name

truthful-state-product-naming

## Description

Product-state and copy guardrail for auth, onboarding, login, mock data, error boundaries, production readiness, and claims like live, validated, safe, or optimized.

## Use When

- Auth, login, onboarding, signup, account, or access state is involved.
- Mock data could look production-real.
- Mock data is random, generic, or not tied to the business domain.
- Production states, error boundaries, loading states, or empty states are involved.
- User-generated uploads, saved examples, Memory, history, or generated outputs are involved.
- Route, page, or feature names may misrepresent reality.
- Copy includes live, validated, safe, secure, optimized, accurate, real-time, or AI claims.

## Do Not Use When

- The task has no user-facing state, naming, claim, or auth surface.
- The task is visual-only and no product truth is implied.
- The user explicitly asks for placeholder copy in a throwaway mock and it is clearly labeled.

## Required Inputs

- Current route/page names.
- Domain Content Contract from `skills/domain-realism-mock-data-director/SKILL.md` when creating or reviewing an app/dashboard/product UI.
- Auth/onboarding state model.
- Data source truth: real, mock, sample, cached, pending, or unavailable.
- Persistence truth for user-generated data across route changes, refresh, and browser reopen.
- Error/loading/empty states.
- User-facing claims.

## Files To Read

- `design-dna/00_COMPACT_AGENT_CONTEXT.md`
- `design-dna/copy-rules.md`
- `evaluation/ui-scorecard.md`
- Current route/page/auth/error files relevant to the task

## Workflow

1. Classify each user-facing state as real, mock, sample, loading, error, empty, gated, or unavailable.
2. Ensure auth errors become controlled flows, not raw crashes.
3. Ensure onboarding is not named or designed as login unless it is actually authentication.
4. Ensure route/page names match the true product state.
5. Verify mock data, section labels, and route names match real business entities and workflows. Hostels need rooms/beds/bookings; restaurants need menu/orders/tables/kitchen/inventory; dashboards need real KPIs, queues, owners, SLAs, costs, segments, drilldowns, and actions.
6. Remove or qualify fake live, validated, safe, secure, optimized, real-time, accurate, production-ready, narrative, replay, mission, case-file, dossier, operation, or fake severity claims.
   - Do not use decorative `live`, `session-only`, monitoring, telemetry, or glowing status chips. These labels are allowed only when they describe real product state, are understandable to the user, and affect behavior or decisions.
   - Do not use decorative `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Mission Room`, `Case File`, `CL-####`, dossier, operation, or fake severity/status chips unless they map to real product behavior.
7. Add visible source, recency, scope, fallback, or sample labeling when needed.
7. For uploaded or user-generated data, state whether it persists across route changes, refresh, and browser reopen.
8. If data is local-only, session-only, mock-only, or not guaranteed, make the UI say so.
9. Check for state mismatch: counts, Memory, chips, summaries, and generated outputs must agree with uploaded/user data.
10. Manually verify the core loop when the promise is upload -> classify -> generate output.
11. Check empty/loading/error boundaries for core flows.
12. Score copy/data truth blockers before completion.

## Stop Conditions

- Stop if mock data is presented as production data.
- Stop if auth failure can crash the visible app.
- Stop if onboarding/login naming is false.
- Stop if claims imply validation or safety without evidence.
- Stop if fake live/session/status indicators appear as product theater.
- Stop if fake narrative/replay/mission/case-file labels appear as product theater.
- Stop if mock data uses random values, abstract metrics, or generic `mission control` / `topology` / `traces` labels without a real domain/data contract.
- Stop if UI count says `0` while uploaded or user-generated data exists.
- Stop if uploaded examples, Memory, or generated outputs disappear without a visible local/session-only explanation.
- Stop if user-generated persistence across route changes, refresh, and browser reopen is unknown.
- Stop if upload/classify/generate core loop is unverified but the UI implies it works.

## Output Contract

```md
State surfaces reviewed:
Mock/sample data labels:
Auth/onboarding naming:
Controlled error flows:
Claims removed or qualified:
Empty/loading/error states:
Core loop proof:
Persistence across route changes:
Persistence across refresh:
Persistence across browser reopen:
State mismatch findings:
Remaining truth risks:
```

## Scorecard Blockers

- Unsupported live/data/safety/AI claim: cap applies.
- Fake live/session/status UI with no user meaning: max score 5.
- Raw auth crash in user flow: prevents completion.
- Fake/mock production state: prevents completion.
- Onboarding mislabeled as login: prevents completion.
- Missing empty/error/loading copy in core flow: score loss.
- UI count says 0 while uploaded/user data exists: max score 4.
- User-generated persistence not disclosed: max score 6.
- Upload/classify/generate loop unverified: max score 6.
- Random mock values with no domain meaning, units, ranges, or source: max score 3.
- Generic app sections or route labels that do not map to real business tasks: max score 4.

## Safety/Scope Rules

- Do not fake proof, validation, safety, or live status.
- Do not add session/live/telemetry labels unless they explain real state in user language.
- Do not hide auth failures.
- Do not make production claims for sample data.
- Do not imply durable Memory for uploaded examples unless persistence is proven.
- Do not hide local-only or session-only behavior.
- Do not let counts, Memory, summaries, or generated outputs contradict each other.
- Do not change auth behavior beyond the requested scope unless needed to prevent a visible crash.

## Audit Upgrade: Self-Correction Contract

Audit fix: Move trust rules into central state/copy contracts.

Required evidence:
- state source, persistence scope, mock/local/session disclosure, claim audit, and UI copy targets.

Repair routing:
- text-clarity-review owns wording; production-hardening-review owns missing states.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "truthful-state-product-naming"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
