# Repository governance

This repository intentionally keeps a small operating model. The goal is a clean release path, not branch ceremony.

## Long-lived branches

| Branch | Purpose | Mutation policy |
| --- | --- | --- |
| `main` | Production source of truth. Every commit must be deployable. | Promote from `test` after the quality gate passes. No force pushes. |
| `test` | Integration and staging line for the next release. | Normal development lands here and runs the same quality gate as `main`. |

No other branch is long-lived. Temporary branches are acceptable only while a review is active and should be removed immediately after merge.

## Promotion flow

1. Start from the latest `test`.
2. Make the smallest coherent change.
3. Run `npm run verify`.
4. Run `npm run e2e` for interaction, route, responsive, motion or infrastructure changes.
5. Push to `test`; GitHub Actions must pass.
6. Open one PR from `test` to `main`.
7. Review the diff, screenshots/video changes and deployment risk.
8. Merge the `test → main` PR with a merge commit only when the required checks are green.
9. Fast-forward `test` to the resulting `main` merge commit after release so the two long-lived branches share ancestry.

## Repository settings

Configure GitHub with these rules:

### General

- Default branch: `main`
- Use a merge commit for the long-lived `test → main` release PR so `test` remains an ancestor of `main` and can fast-forward after release.
- Squash temporary review branches when they merge into `test`.
- Keep the repository public and never store secrets or private customer material in Git history.

### `main` ruleset

- Require a pull request before merge.
- Require the `Static, unit and build` and `Cross-browser E2E` status checks.
- Require branches to be up to date before merge.
- Require conversation resolution.
- Block force pushes.
- Block branch deletion.

For a solo repository, do **not** require another human approval unless a reviewer is actually available; a permanently impossible approval rule is not a quality control.

### `test` ruleset

- Block force pushes.
- Block branch deletion.
- Allow direct pushes so it can act as the integration branch.
- Let CI report failures immediately after every push.

## Commit and PR discipline

- One commit should describe one coherent change.
- Use concise conventional prefixes where useful: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.
- Do not mix generated media, dependency churn and unrelated UI changes in the same commit.
- Never commit `.env`, browser reports, test results, caches or local tooling output.
- Large product media belongs under `static/projects/<project>/` and should have an explicit reason for existing.

## Rollback

Production rollback is commit-based. Revert the release commit on `main`, run the quality gate, and redeploy. Do not rewrite `main` history to remove a bad release.

## Source of truth

Code and tests are authoritative. Portfolio copy must not claim capabilities that the corresponding project does not implement or verify.
