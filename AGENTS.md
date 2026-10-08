# Portfolio typography

Use the portfolio's clean, professional typography. Do not add handwritten,
scribble, marker, or note-style typography or arrows with handwritten labels.

# Production deployments

Read `DEPLOYMENT.md` before building or deploying production. The production
checkout is `.cache/leu-flow-pages` in the outer portfolio workspace, including
its uncommitted work. The outer repository is an older checkout and must not
overwrite the reviewed production layout. Compare against live before publishing.

Keep the Claude case studies, desktop density, intro welcome, and Needle together
when merging or publishing. These files must remain tracked in the release branch.

<!-- BEGIN: owner-branch-policy -->
## Mandatory repository branch and attribution policy

These instructions apply to coding agents, local automation, and repository maintenance.

- Only `main` and `test` are permitted development branches. Only the existing `portfolio/dev` branch is additionally permitted; do not create any other branches.
- `test` is the working/integration branch; `main` is for reviewed, verified production changes.
- Do not create or push other branches (including feature, fix, release, PR, bot or deployment branches). Work using the permitted refs. If branch protection makes this impossible, stop and request a compliant plan rather than inventing another branch.
- Do not promote unrelated, unverified work from `test` into `main`. Verify and ship a focused change only.
- Never rewrite shared history, reset, force-push, or delete a ref without explicit owner approval and verified preservation of unique work.
- For locally authored changes, set both Git author and committer to `Miguel Almeida <94702822+miguelalmeida0@users.noreply.github.com>`. Do not add automated-agent co-author trailers.
- Preserve real contributor provenance when it differs from this single-owner assumption; stop for review rather than silently misattributing another human's work.
<!-- END: owner-branch-policy -->
