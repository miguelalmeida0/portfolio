# make-interfaces-feel-better External Skill Source Capsule

Status: install blocked.

Source repository: https://github.com/jakubkrehel/make-interfaces-feel-better

Requested command:

```sh
npx skills add https://github.com/jakubkrehel/make-interfaces-feel-better --skill make-interfaces-feel-better
```

Observed result: failed with `ENOTFOUND registry.npmjs.org`.

Raw upstream skill archived: no. The installer could not fetch the package/repository in this sandbox.

Miguel-native integration target:

- Create `skills/make-interfaces-feel-better/SKILL.md`.
- Create `design-dna/interface-feel-rules.md`.
- Create `design-intelligence/interface-feel-checklist.json`.

Conflict risk: medium. It overlaps with Emil design-engineering, anti-slop review, and motion craft, but has a distinct role as a post-implementation polish pass.

Recommendation: route after visual spec, design-system tokens, and main layout exist; before screenshot scorecard review.
