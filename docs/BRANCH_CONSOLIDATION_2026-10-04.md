# Branch consolidation ledger — 4 October 2026

The current product baseline is `9926626dc096d3b13d067b6f8a4287a1a4536641`. Consolidation joins the original main, dev, test and contact-footer histories while retaining that exact product tree. The accompanying governance change touches only GitHub metadata and these documents.

## Preservation contract

All 91 original commits must remain reachable from the retained branches. The original heads below are immutable recovery checkpoints even after their branch names are retired. A complete Git bundle was created and verified before remote changes.

Retaining old commits is an explicit history-preservation decision. It does not activate their old product trees. In particular, the current footer, intro, Flow case study, Ask MiguelLLM, media and project order remain those of the product baseline.

## Original branch heads

| Branch | Original tip | Ahead / behind main |
| --- | --- | --- |
| `audit/typography-responsive-polish` | `26aee9c624244e4a8512f69a9ec5e5a5c4be20d0` | 0 / 13 |
| `backup/portfolio-before-redesign` | `bccb8f1819203e54a84270c077dbb60eef2600f9` | 1 / 3 |
| `backup/pre-v6-2026-09-27` | `26aee9c624244e4a8512f69a9ec5e5a5c4be20d0` | 0 / 13 |
| `chatgpt/vigia-ghostwriter-portfolio-2026-09-15` | `c7d2d7cbd49dac37a3fae3bc462793d3433c94e7` | 4 / 41 |
| `claude/jolly-dirac-vv68fm` | `6e1db7102648d80673ec978b1356d9355b3be142` | 0 / 25 |
| `contact-footer-portrait-ui` | `5dfd71456584802e7f2563ddcf694becbd27cab2` | 2 / 3 |
| `dev` | `5c2ab7f7426b88f4635ad1e16868fcee2cc67ac1` | 32 / 4 |
| `diagnostics/intro-entry-proof` | `c6def383a183582f4ed507ae9ae9783e3f31e099` | 7 / 9 |
| `feat/portfolio-shadergradient` | `88b0ae4e2534713a266ef2c58e7e2e89a466d305` | 1 / 13 |
| `fix/intro-startup-20260927` | `dd01cf8cbad812366e813cbf36929a514c1ac877` | 2 / 11 |
| `fix/intro-visible-entry-20260927` | `8b7aea59f941944901c945b17bc15aadc606750d` | 5 / 9 |
| `homepage-living-mosaic-redesign` | `9926626dc096d3b13d067b6f8a4287a1a4536641` | 0 / 0 |
| `main` | `9926626dc096d3b13d067b6f8a4287a1a4536641` | 0 / 0 |
| `portfolio` | `9926626dc096d3b13d067b6f8a4287a1a4536641` | 0 / 0 |
| `release/portfolio-vigia-ghostwriter-2026-09-15` | `479404808c69d5f805e5f86214c05c6cf31a91b0` | 15 / 41 |
| `test` | `6348bdbd350b3279ee7b5d5e088a0ed156fe014d` | 8 / 3 |
| `test-animation` | `91e13388d7344c6995940e410d51977304fb3832` | 1 / 13 |

## Content decisions

- The older VIGIA/Ghostwriter feature and release histories stay recoverable; their UI, links and historical deployment claims are not reinstated.
- The ShaderGradient and launch-film experiments remain historical.
- The intro-startup tip `dd01cf8` exactly matches the tree of main ancestor `b61da50`; visible-entry tip `8b7aea5` exactly matches main ancestor `0a4a58f`. Neither overwrites the newer intro.
- The footer alternative `5dfd714` is retained as ancestry. Its old Contact component does not replace the current LineMFooter.
- The earlier Flow expansion `bccb8f1` remains recoverable; the later investigation-style Flow page stays active.

## PR #4 disposition

The old test-to-main proposal uses a two-branch model and must be closed without merging its old tree. All eight original commits remain reachable through the consolidation.

| Commit | Disposition |
| --- | --- |
| `bccb8f1` | Preserve older Flow page; retain current product. |
| `1fcf579` | Reuse CODEOWNERS and a concise PR template; write fresh three-branch governance and change CI branch filters only. |
| `41cf8dd` | Replace two-branch ancestry guidance with dev → test → main and no force resets. |
| `df009f4` | Replace old release guidance with the same three-branch policy. |
| `2603a9d` | Preserve history; do not import repository-migration.yml, formatter attributes or asset-budget checks into the current product during cleanup. The migration workflow deletes dev. |
| `909bed3` | Keep existing per-ref concurrency so pushes and PR merge validation remain separate. |
| `fbd442e` | Keep current browser coverage unchanged; do not import responsive-cv exclusions. |
| `6348bdb` | Preserve history; retain current media tests and assertions unchanged. |

The current CI job, dependency versions, scripts, unit checks, build and browser matrix are unchanged. Broader CI refactoring is outside this consolidation.

## Original commits outside main

The following 41 commits are deduplicated across all branch histories.

| Commit | Subject |
| --- | --- |
| `fd560c84966000dfca861d948eebbc0f15f569a8` | Feature current VIGIA and Ghostwriter portfolio work |
| `3a562966de35c32c2b6ea36a68b40f285ebfd1e5` | Rename Ghostwriter portfolio project to Second Voice AI |
| `bbc2d53cfad6d42b7a7eb911aa8b9c333c9f0211` | Refine Second Voice AI naming and typography |
| `c7d2d7cbd49dac37a3fae3bc462793d3433c94e7` | Point Second Voice AI portfolio links at new production domain |
| `a5a3917f860a273cda74049ad95c6866de6d1e8c` | test: diagnose live portfolio entry before follow-up fix |
| `8552fdd53cff8ed5eef82a27d10ce62fc11d9bf8` | test: observe native background tabs without Playwright visibility overrides |
| `4063bedc5533ce7370a8790ba4e06444c82eb8ab` | fix: preserve intro until visible and revalidate entry documents |
| `e03512ff2260216886c6fa01b8f09e3a846875bf` | chore: keep temporary live diagnostics out of the production change |
| `81b761c53c65f93b9e29493d90635e914529acfc` | test: compare deployed entry lifecycle and collect screenshots outside production branch |
| `4dacd79276771c8105b3734de964ce1e35e3f352` | test: isolate deployed visibility regressions for faster failure diagnostics |
| `c6def383a183582f4ed507ae9ae9783e3f31e099` | test: run complete deployed release suite with current project-navigation fixtures |
| `88b0ae4e2534713a266ef2c58e7e2e89a466d305` | feat: add palette-matched ShaderGradient hero animation |
| `f91925a92cd70eaffb68705b4937555351abb600` | fix: prevent automatic intro dismissal on first visit |
| `dd01cf8cbad812366e813cbf36929a514c1ac877` | test: observe introduction from document creation |
| `8b7aea59f941944901c945b17bc15aadc606750d` | test: reach Second Voice explicitly after the existing Leu-first homepage change |
| `a7bdef26487bf6329db6df62ff1e6b2e8056469c` | feat: add VIGIA and Second Voice release studies |
| `1e6214eb17edb99c4d983e86f4ebf00179a078aa` | feat: route VIGIA and Second Voice case studies |
| `3a85b0dc4f21573dc240964e11d07d21322f9688` | feat: feature VIGIA and Second Voice in selected work |
| `45a221f3c4891d9bae3500b3e73ac141e25d33ad` | feat: render project demo links |
| `2f82354be62a33d5c8c3d9979ffccab124078b9e` | fix: restore complete case study page |
| `8c6a73f3c615393dca495b13ddf5006005312a65` | feat: add VIGIA to the real homepage project grid |
| `eadba831a21a5d102e981d178136ff7a8dffc826` | fix: render VIGIA in the actual homepage grid |
| `e2bfbe99799e1da91edec517353c54ae445d0a83` | fix: lead with Second Voice and use VIGIA screenshot |
| `e5aa929442b08b01d93bac5a41631166d6c079ef` | fix: use published VIGIA interface capture |
| `ed39c2a77c78c082f5639fbd695f05648f24e38b` | feat: add VIGIA visual case study |
| `d04bfd8c6ad03b74d652f0e04f9bb539fd143043` | feat: add direct project actions to homepage cards |
| `61e0bbd52374e70ea35bb8b8d09cf00efd5457a0` | fix: link Second Voice AI live app from homepage |
| `f1d3bd0bdf86c5a363d8bdcd9f5515264cf1b00d` | fix: point portfolio CTAs at live VIGIA backend |
| `213bf217663ec375ae50e94a4664b2b8f760382c` | fix: describe VIGIA as backend-powered live system |
| `479404808c69d5f805e5f86214c05c6cf31a91b0` | feat: present VIGIA as backend-powered live deployment |
| `91e13388d7344c6995940e410d51977304fb3832` | feat: add portfolio launch film made with /brag |
| `5c2ab7f7426b88f4635ad1e16868fcee2cc67ac1` | ops: consolidate legacy branch history without changing files |
| `bccb8f1819203e54a84270c077dbb60eef2600f9` | feat: deepen Flow case study |
| `1fcf579dd1e220a6b6af46cc783aac5c8816d95c` | chore: establish repository governance |
| `41cf8dd8caa343d97a95098768ba4fd18cc9d4cb` | docs: correct release branch ancestry |
| `df009f4ffd3cf7609fb70f53dc8cfdf32449d695` | docs: align release PR guidance |
| `2603a9d339df036a04d9c54c9d295fbd726581cc` | chore: harden repository infrastructure |
| `909bed3cdb94315889ec660a76d25162ad61b80c` | ci: deduplicate quality runs by head sha |
| `fbd442e621d7c1138270138c0e9ceddb4cf99789` | ci: remove redundant responsive matrix work |
| `6348bdbd350b3279ee7b5d5e088a0ed156fe014d` | test: align media checks with runtime policy |
| `5dfd71456584802e7f2563ddcf694becbd27cab2` | feat: redesign contact around existing footer portrait |

## Recovery

Create a new branch at the recorded full SHA to inspect an old implementation. Never reset or overwrite a retained branch to restore an experiment. Cherry-pick or port only specifically selected changes after comparing them with the current product.

## Operational status

This ledger records preservation and content decisions. It does not claim that branch deletion, default-branch settings, protection rules or external hosting configuration have been changed. Verify those live settings independently before retiring the old portfolio default branch.
