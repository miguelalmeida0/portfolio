## Change

Describe the user-facing or engineering change in plain language.

## Why

What problem does this solve? Link an issue or decision when one exists.

## Risk

- [ ] No behavior change
- [ ] UI / interaction change
- [ ] Routing / content model change
- [ ] Build / dependency / infrastructure change
- [ ] Large media or asset change

Call out anything that could affect deployment, performance, accessibility, reduced motion, responsive behavior, or existing project URLs.

## Verification

- [ ] `npm run verify`
- [ ] `npm run e2e` when browser behavior changed
- [ ] Tested the affected route at phone and desktop widths
- [ ] Checked keyboard/focus and reduced-motion behavior when relevant
- [ ] No private customer data, credentials, internal F24 screens, or accidental generated artifacts were added

## Release

Normal promotion path: **test → main**.

If this bypasses the normal path, explain why and how to roll it back.
