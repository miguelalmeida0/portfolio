# Repository governance

## Long-lived branches

| Branch | Purpose |
| --- | --- |
| `main` | Current production source and intended GitHub default. |
| `dev` | Development and integration. |
| `test` | Validation of the next release candidate. |

The release path is `dev → test → main`. Use merge commits between these branches so original commits remain reachable. After promotion, fast-forward the lower branches when possible; otherwise reconcile their newer work explicitly. Never force-reset a long-lived branch to make counters match.

## Verification

CI runs for pushes and pull requests on all three long-lived branches. Push and pull-request runs retain separate concurrency groups. The existing type checks, unit tests, production build, and browser matrix remain unchanged by branch consolidation.

Development and preview branches are not permission to change the production hosting target. Hosting configuration must be checked separately before changing or removing a production branch.

## Repository settings

The target configuration is default branch `main`, with force pushes and deletion blocked on `main`, `dev`, and `test`. Require review and verified status checks for production promotion using checks that have actually run successfully. This document describes the intended settings; it does not enforce them by itself.

## Retiring branches

Before removing a branch, record its full tip SHA and prove that every commit remains reachable through a retained branch or a verified archive tag. Recheck the remote tip immediately before deletion. Do not delete a moved tip using a stale audit.

There is no automatic branch-pruning workflow. The former two-branch migration workflow must not be restored: it explicitly deletes `dev`.

See [the consolidation ledger](BRANCH_CONSOLIDATION_2026-10-04.md) for original branch tips and the disposition of older work. Historical reachability does not mean an old experiment is active in the current product.

## Product preservation

The October 2026 consolidation uses the product tree at `9926626dc096d3b13d067b6f8a4287a1a4536641`. Its source, styles, assets, dependency manifests, lockfile, application tests, and build/deployment configuration are retained exactly. Only GitHub CI and repository governance files change.
