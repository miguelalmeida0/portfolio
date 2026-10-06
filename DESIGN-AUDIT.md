# Portfolio audit implementation · test design branch

This is an isolated candidate based on production commit
`f2f503fa2d5d4fbfe83900598bda57f6224434c2`. No production branch is changed.
The original `.cache/leu-flow-pages` checkout and its dirty files remain intact.

## Design direction

Recruiter-first refinement using Impeccable and Taste: preserve Figtree, the
pistachio/forest/plum identity, professional typography, authentic product media,
and factual ownership. Prioritize readable evidence and native navigation over
additional visual effects. Taste dials: variance 6, motion 4, density 4.

## Audit coverage

- Mobile hero: role, proof and CV/work actions precede the smaller portrait.
- Case studies: persistent mobile section menu with current section and Work exit.
- Every case opens with an artifact, problem, contribution and inspection guide.
- Independent products expose source-backed design decisions, tradeoffs and limits.
- Supporting typography compensates for the existing 80% desktop presentation.
- Prepared examples are labeled “Explore demo”; real apps remain separate links.
- Ask retains site navigation and puts supporting answer detail in a disclosure.
- Contact separates email composition and clipboard actions with live feedback.
- Open Graph and Twitter metadata identify each route and use its product media.
- Two-column desktop previews make the actual interfaces readable; proportions
  follow desktop screens and the native Leu portrait.
- CV summary covers scope; metrics retain their equal tracks and state attribution.
- Story starts with the short version; PDF reader offers the responsive web CV.

## Evidence boundaries

The PDF binary, PDF annotation geometry, authored case-study simulations, legal
notice and product footage are preserved. The F24 hero image is a capture of the
existing fictional recovery demo, explicitly labeled; it is not an internal screen.
No research participants, experiments, conversion gains or performance timings
have been invented. Mobile browser emulation is not physical-device validation.

## Local review

Run `npm ci`, then `npm run dev -- --port 4186`.
Preview: <http://127.0.0.1:4186/>.

Checks: `npm run check`, `npm run test:unit`, `npm run build`, and
`node --test tests/f24-sv/data-diff.test.mjs`.
The CI browser-smoke job includes the new audit regressions and the existing
CV alignment and route smoke tests. Local headless Chromium cannot launch under
this macOS sandbox; connected Chrome is used for visual/interaction verification.
