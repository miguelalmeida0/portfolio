# Phase 7 remediation verification — 3 November 2026

The canonical source is `miguelalmeida0/portfolio`. Clean `main` ba6046d built a homepage byte-identical to https://miguelalmeida.is-a.dev/ (SHA256 b884cf40c6595744b3e1bf5aa99c42ef58879d8e6d59fe1a195038f084cf4ab7); the live CV metadata also identified ba6046d. The historical nested checkout instruction is superseded by DEPLOYMENT.md's current main-push pipeline.

## New defects reproduced and repaired

- Landing copy still faded from zero opacity in CSS after earlier GSAP contrast repairs. Native axe caught ratios 2.93–3.91 on the mobile hero. Sampled real CSS keyframes reproduced changing opacity; readable copy now stays opaque while retaining the authored translation, timing and name reveal.
- Native macOS WebKit skipped dialog buttons and escaped the boundary-only focus trap on its first Tab. Every Tab/Shift+Tab now advances through the current enabled visible controls, including after Next-case rendering. A new three-engine regression proves order, wrapping and Escape return.
- `/cv/pdf` and the other worker routes lacked CSP despite the static homepage having one. SvelteKit now assigns per-response nonces, including the app.html bootstrap. Only the exact Svelte SSR `this.__e=event` replay-handler hash is allowed in attributes. PDF workers/Wasm remain supported; arbitrary inline scripts/eval are not authorized. Existing styles/media remain unchanged.
- The CV scale popup ended at y407 in a 390px viewport. It now measures available viewport height on open/resize and scrolls internally. Native tests verify all fit buttons and Escape, including shrinking to 320px height; final 844×390 bounds are y76–378.

- Approved CV journeys found transient low contrast in the popup entrance and fit-selection transition. Copy now remains opaque and selection text/background change together; translation and scale motion remain. Fifteen three-engine CV journeys passed135/135 assertions with zero confirmed contrast observations. Raw PDF target-size observations remain unresolved by the engine gate.
- Pointer regression exposed PDF annotation links intercepting fit controls at1280×720. The toolbar and reader body now form ordered stacking contexts so PDF annotations cannot cover the toolbar popup.

- A delayed-PDF regression reproduced a90.7px toolbar shift when the links menu appeared, enough to lose an early zoom click. The menu now reserves its intrinsic space while hidden until annotations load; the completed layout is unchanged.

## Regression maintenance

The automatic-preview test now matches the current Morrow accessible name and still verifies the exact destination. Actual live playback passed12/12 Chromium/WebKit checks without interception; a local WebKit preview-server media limitation is recorded separately.

Three route tests expected old copy/project inventory. Updated assertions retain the current headline, Morrow, route identities and actual posters. The motion bootstrap unit extractor accepts the new nonce attribute. macOS WebKit's skip-link test uses native Option-Tab, as documented by Apple, instead of treating the system's default field-only Tab policy as a missing link. Chromium/Firefox and Linux WebKit still use Tab.

Reference: https://support.apple.com/guide/safari/keyboard-shortcuts-and-gestures-cpsh003/mac

## Evidence boundaries

Original audit: `/Users/malmeida/Projects/trueform/stress-lab/.lab/runs/run-7417d76f-5291-4468-8735-4d9e9265d171/report.json`, SHA256 6feedfa7fb2278af94241053ecec1dd94c020b0d802718483c90fa18ea651e8f. It contains 300 cases and 9,378 repeated observations, grouped into 255 rule/confidence/selector combinations. It is preserved unchanged.

A fresh pre-change live rerun, `run-f6ec5444-9310-42f9-a457-98edc77b0ca3`, completed all 300 cases but remains limited. Baseline confirmed contrast observations fell from117 to2 following previously deployed fixes; baseline name mismatches fell from85 to0. The remaining contrast was the entrance defect fixed here. These are occurrence counts, not unique bugs or a conformance verdict. Both unconfigured matrices correctly lack interaction/history proof. Long-text mutation creates separate stress-induced name mismatches; PDF/animation geometry and incomplete contrast remain review evidence.

The homepage remains heavy: one 390px live navigation transferred3,584,830 bytes for5,244,044 decoded HTML bytes; the largest embedded image string was3,029,894 characters. Initial subresources measured2.26MB phone/3.64MB desktop, dominated by the unchanged2.07MB footer portrait and desktop-only1.40MB pointing hand. All intended animations and image bytes are retained. The five public app URLs returned200.

Fresh local validation includes TypeScript/lint,493 unit tests,56 route tests, the three-engine Phase7 matrix (90 passed,9 authored-layout skips), three native focus-cycle tests, and30 affected CV/CSP/landscape/contrast/loading checks after the final loading fix. A prior87-case regression run had86 passes and the macOS skip-link test failure described above; the corrected full suite passed all 87 cases before promotion. No stale-header or interrupted runs count as acceptance.

Screenshots and final execution/deployment ledger are preserved outside the source checkout at `/Users/malmeida/Downloads/portfolio-phase7-evidence-20261103/`. Its final report records exact source commit, pipeline outcome and public verification. The Stress Lab repository and its fail-closed release verdict remain separate; passing UI assertions do not clear capped or missing coverage.

## Final audit-driven corrections

The exact original 300-case matrix completed on deployed1d650c9 as `run-cfe768f9-5320-4485-b182-c89839f49853`, with0 execution errors and0 confirmed findings in all30 baseline cases. It still remains limited; its configuration has no approved interaction/history journey. The original audit had202 baseline confirmed observations; the immediate pre-change rerun had2.

The remaining stress results exposed two independently reproduced product defects. At320px, doubled skip-link text exceeded its fixed100px offscreen offset and covered29.375px of the header. The skip link now hides by its own intrinsic height, with2px clearance for WebKit fractional transform rounding, and reveals fully on native keyboard focus. The fixed assertion still requires its unfocused bottom to be outside the viewport.

Under native reduced motion, the controller revealed the existing Needle preview and changed heading size/padding after first paint, producing CLS0.297 at844×390 and0.478 at768×1024. The under-section was pushed below the viewport, not removed. Initial CSS now matches the existing final reading layout, including preview space and the tablet/landscape typography and padding. A controlled controller-delay regression compares actual geometry before/after initialization across five sizes and three engines, including the separate mobile layout.

These two corrections are a subsequent source snapshot. The completed300-case audit remains attributed to1d650c9; affected public baseline, large-type and reduced-motion cases are rerun separately after promotion. Synthetic long-text name mismatches, raw PDF target findings and reported offline import failures remain unsuppressed. Exact final scope and pipeline identity are recorded in the external final ledger.
