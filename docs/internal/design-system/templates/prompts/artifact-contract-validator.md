# Artifact Contract Validator Prompt

Project path: `<path>`
Mode: `<mode>`

## Task

Validate that required Design OS artifacts and proof agree with the claimed status.

## Required Reading

- `skills/artifact-contract-validator/SKILL.md`
- `docs/design/creative-session-state.md` if present
- relevant specs, reports, screenshots, and manifests

## Output

- `docs/qa/artifact-contract-report.md`
- `docs/qa/artifact-contract-report.json`

Run `node tools/artifact-contract-validator.mjs --mode <mode> --out docs/qa/artifact-contract-report.json` when practical.
