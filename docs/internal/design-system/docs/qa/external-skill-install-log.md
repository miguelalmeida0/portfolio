# External Skill Install Log

Date: 2026-07-02

Scope: safe installation attempt for external UI skills and Miguel-native ingestion.

## Summary

All four requested `npx skills add ...` commands were attempted. None installed successfully because the sandboxed environment could not resolve `registry.npmjs.org`.

The installer did not create or modify any Design OS skill folders. Existing Miguel-native skills were preserved.

## Commands

| Command | Result | Created / modified files | Conflict | Recommended action |
| --- | --- | --- | --- | --- |
| `npx skills add https://github.com/emilkowalski/skills --skill animation-vocabulary` | Failed: `ENOTFOUND registry.npmjs.org` | npm logs under `.tmp/external-skill-install/npm-cache/_logs/` | `skills/animation-vocabulary/` already exists; high conflict risk | Keep Miguel version as source of truth. If network is later available, archive external source separately before merging examples. |
| `npx skills add https://github.com/raphaelsalaja/userinterface-wiki --skill userinterface-wiki` | Failed: `ENOTFOUND registry.npmjs.org` | npm logs under `.tmp/external-skill-install/npm-cache/_logs/` | No local skill existed before this pass | Use Miguel-native `skills/userinterface-wiki/` created from distilled mechanisms and Migi's brief. |
| `npx skills add https://github.com/jakubkrehel/oklch-skill --skill oklch-skill` | Failed: `ENOTFOUND registry.npmjs.org` | npm logs under `.tmp/external-skill-install/npm-cache/_logs/` | Local color guidance exists, but no OKLCH/APCA skill existed before this pass | Use Miguel-native `skills/oklch-contrast-palette/` and rerun install later only to compare. |
| `npx skills add https://github.com/jakubkrehel/make-interfaces-feel-better --skill make-interfaces-feel-better` | Failed: `ENOTFOUND registry.npmjs.org` | npm logs under `.tmp/external-skill-install/npm-cache/_logs/` | Overlaps with Emil/motion/anti-slop skills | Use Miguel-native polish skill as a post-implementation gate. |

## Raw Archive Status

The true upstream raw skill contents were not installed by `npx` and could not be fully archived from the installer output.

To preserve traceability, `research-input/external-ui-skills/raw/` contains install-blocked source capsules. These capsules record the source URL, requested skill, failure, and distilled integration target. They are not a substitute for a full upstream raw archive.

## Safety Notes

- Existing `skills/animation-vocabulary/` was not overwritten.
- No protected folders were modified.
- No frontend app was built or revived.
- Local `.tmp/` npm cache/log artifacts are ignored operational evidence, not Design OS source.
