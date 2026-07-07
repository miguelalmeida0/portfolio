# oklch-skill External Skill Source Capsule

Status: install blocked.

Source repository: https://github.com/jakubkrehel/oklch-skill

Requested command:

```sh
npx skills add https://github.com/jakubkrehel/oklch-skill --skill oklch-skill
```

Observed result: failed with `ENOTFOUND registry.npmjs.org`.

Raw upstream skill archived: no. The installer could not fetch the package/repository in this sandbox.

Miguel-native integration target:

- Create `skills/oklch-contrast-palette/SKILL.md`.
- Create `design-dna/oklch-contrast-and-palette-rules.md`.
- Create OKLCH/APCA design-intelligence files from Migi's pasted rules.

Conflict risk: medium. Existing `design-intelligence/color-guidance.md` covers color generally; this adds perceptual color and contrast enforcement.

Recommendation: use as the color-science gate for design-system tokens, palette repair, dark mode, and final contrast review.
