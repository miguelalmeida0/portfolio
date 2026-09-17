# animation-vocabulary External Skill Source Capsule

Status: install blocked.

Source repository: https://github.com/emilkowalski/skills

Requested command:

```sh
npx skills add https://github.com/emilkowalski/skills --skill animation-vocabulary
```

Observed result: failed with `ENOTFOUND registry.npmjs.org`.

Raw upstream skill archived: no. The installer could not fetch the package/repository in this sandbox.

Miguel-native integration target:

- Preserve existing `skills/animation-vocabulary/SKILL.md`.
- Add the requested example mappings.
- Add `design-intelligence/animation-vocabulary.json`.

Conflict risk: high. Miguel Design OS already had `skills/animation-vocabulary/`.

Recommendation: keep Miguel's existing skill as source of truth, then compare against the external upstream only after a successful networked install.
