# Visual Taste Rule Test

## Purpose

`visual-taste` was the first live target app used to test whether Miguel Design OS actually improves frontend output. This dogfood audit treats the target app's failures as evidence about Design OS itself, not as isolated product bugs.

## Rules That Were Supposed To Guide visual-taste

- Visual Concept Gate: create rendered visual concepts before implementation for visual-heavy work.
- Selection/product clarity: make the primary object and primary action obvious.
- Truthful state: label mock/local/session-only behavior honestly.
- No fake AI claims: do not imply model intelligence, validation, live analysis, or durable memory without proof.
- No dead buttons: visible controls must work, navigate, or be clearly disabled.
- Screenshot QA: capture or honestly block `390 / 768 / 1440` evidence.
- Done report: final handoff must validate and cannot claim done without evidence.
- Asset manifest: image-led/reference-heavy work must document assets and distinguish evidence from production assets.
- No generic SaaS dashboard: the UI must serve the product loop rather than defaulting to panels and metrics.
- Evidence before done: build/lint/browser screenshots are not visual QA proof.

## What Actually Happened

- Uploaded examples disappeared or were not shown in Memory.
- State persistence was not guaranteed or explained.
- The done report validated only as `needs-work` with score `60`, which was correct.
- Visual QA screenshots were blocked.
- Browser/dock screenshots were used informally even though they were not valid app-only QA evidence.
- The app looked visually promising, but the core loop was not proven.
- Migi did not have a clear explanation of why `visual-taste` was being built in relation to `miguel-design-os`.
- The process drifted into building Design OS tools, Studio screens, and surrounding infrastructure before the target app proved the rules.

## Failure Map

| Failure | Failed rule | Missing rule/tool/prompt/gate | Missed stop condition |
| --- | --- | --- | --- |
| Uploaded examples disappeared or did not appear in Memory | Truthful state, primary object clarity | No core-loop proof gate for `upload -> classify -> generate output`; no state mismatch cap | Stop before handoff when user-uploaded data is not visible where the UI says it should be |
| Persistence was not guaranteed or explained | Truthful state | No persistence truth rule requiring route/refresh/browser-reopen disclosure | Stop if user-generated data is part of the promise and persistence scope is undocumented |
| Done report remained `needs-work` at score `60` | Evidence before done | Rule worked, but handoff language still risked implying progress was complete | Stop if score below 80 or visual QA blocked and treat the target as unfinished |
| Visual QA screenshots were blocked | Screenshot QA | Browser fallback and manual app-only import were added later, not enforced during visual-taste | Stop when automation fails and require doctor/manual-import report before further claims |
| Browser/dock screenshots were used informally | Evidence before done | Manual screenshot validity rule was not explicit enough | Stop if screenshots include browser chrome, dock, desktop, editor UI, or unknown viewport |
| App looked promising but core loop was unproven | Product clarity, no fake AI claims | No manual core-loop verification requirement | Stop if main loop output was not produced from uploaded input and documented |
| Migi did not understand why visual-taste existed | Product purpose clarity | No new-project dogfood purpose field | Stop before implementation when the app's Design OS test purpose is not stated |
| Process drifted into Studio/tooling | No parallel-product drift | No dogfood reset rule forcing target failures back into OS rules | Stop building side products when the active goal is testing a target app |

## Design OS Failures

1. Design OS had strong visual rules but weak dogfood accounting. It did not force every target-app failure to become a rule, prompt, validator, or checklist patch.
2. Design OS treated screenshot capture as a binary Playwright path. It needed a resilient doctor/fallback/manual-import loop sooner.
3. Design OS did not require proof of the product loop, only proof of visual shell and evidence artifacts.
4. Design OS had truthfulness rules for claims, but not enough specificity for user-generated persistence.
5. Design OS allowed purpose drift: the target app's reason for existing was not visible in the work loop.

## Patches Required In Miguel Design OS

- Add a dogfood target rule: target-app failures must patch Design OS.
- Add a core-loop proof rule for `upload -> classify -> generate output`.
- Add persistence truth rules for route changes, refresh, and browser reopen.
- Add scorecard cap: UI count says `0` while uploaded/user data exists = max score `40`.
- Add product purpose clarity to new app starts and handoff.
- Add no parallel-product drift as a stop condition.
- Add done-report product QA fields so final handoff can record core-loop, persistence, and dogfood proof.

## Target App Patches Required Later

- Show uploaded examples in Memory immediately after upload.
- Verify route-change, refresh, and browser-reopen behavior.
- Label local/session-only state in the UI if persistence is not durable.
- Manually verify `upload -> classify -> generate output`.
- Capture app-only `390 / 768 / 1440` screenshots through automated or manual-import proof.
- Keep final status `needs-work` until the loop and visual QA pass.

## Next visual-taste Test

The next visual-taste dogfood pass should test one narrow loop:

1. Upload three taste examples.
2. Confirm Memory count and visible Memory entries update.
3. Classify the examples into visible taste signals.
4. Generate one output from those signals.
5. Navigate away and back.
6. Refresh.
7. Reopen the browser.
8. Document exactly what persists and what is local/session-only.
9. Capture valid app-only screenshots or a blocked visual-QA report.
10. Patch Miguel Design OS again for every failure found.
