# External UI Skills Manifest

Date: 2026-07-02

Important: the requested installs failed because `npx` could not resolve `registry.npmjs.org`. The raw upstream skill files were not fully archived. The `raw/` folder contains install-blocked source capsules for traceability, not full upstream source.

| Source repo | Skill | Installed path | Archived path | Content type | Confidence | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| https://github.com/emilkowalski/skills | animation-vocabulary | Existing Miguel skill preserved at `skills/animation-vocabulary/` | `research-input/external-ui-skills/raw/animation-vocabulary.install-blocked.md` | install-blocked source capsule | medium | Merge only examples/mechanisms; keep Miguel skill as source of truth. |
| https://github.com/raphaelsalaja/userinterface-wiki | userinterface-wiki | `skills/userinterface-wiki/` created as Miguel-native distillation | `research-input/external-ui-skills/raw/userinterface-wiki.install-blocked.md` | install-blocked source capsule | medium | Keep as routeable broad UI craft skill. |
| https://github.com/jakubkrehel/oklch-skill | oklch-skill | `skills/oklch-contrast-palette/` created as Miguel-native gate | `research-input/external-ui-skills/raw/oklch-skill.install-blocked.md` | install-blocked source capsule | high for Migi-provided OKLCH/APCA rules, low for upstream raw | Keep as color-science source of truth. |
| https://github.com/jakubkrehel/make-interfaces-feel-better | make-interfaces-feel-better | `skills/make-interfaces-feel-better/` created as Miguel-native polish skill | `research-input/external-ui-skills/raw/make-interfaces-feel-better.install-blocked.md` | install-blocked source capsule | medium | Use after implementation and before screenshot review. |

## Why This Matters

- OKLCH/APCA gives Miguel Design OS a real contrast and palette repair model instead of hex trial and error.
- User Interface Wiki gives a routeable broad UI craft layer for interaction, typography, UX laws, pseudo-elements, audio feedback, and perceived performance.
- Make Interfaces Feel Better becomes a post-build polish pass for dead, stiff, generic, or unresponsive interfaces.
- Animation Vocabulary remains a naming/specification helper, not a motion implementation skill.
