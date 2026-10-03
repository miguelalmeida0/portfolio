## Change

Describe the problem, the change, and the resulting behavior.

## Verification

List the checks actually run and any limits. For visual changes, include desktop and mobile captures.

## Release

- Development targets `dev`; release validation targets `test`; production promotion targets `main`.
- Preserve long-lived branch ancestry with merge commits. Do not force-push or delete `main`, `dev`, or `test`.
- Preserve unique commits before retiring a temporary branch.

## Post-Deploy Monitoring & Validation

Describe the expected result and rollback trigger. For changes with no runtime impact, state why no additional operational monitoring is required.
