# Browser screenshot baselines

The Chromium desktop Linux baselines were captured by GitHub Actions run
37192463767 at commit 9f9c2998048dcc67511b385be1d0adb725417903 (artifacts
`browser-evidence-2` and `browser-evidence-4`). All 15 images were individually
reviewed before adoption on 4 October 2026.

The same run supplied all 15 Firefox desktop Linux baselines (artifacts
`browser-evidence-6` and `browser-evidence-8`) and all 15 Chromium mobile Linux
baselines (artifacts `browser-evidence-14` and `browser-evidence-16`). Each image
was individually reviewed on the same date. Their dimensions match the desktop
Chromium images; browser text rasterization and device scale remain distinct.

They retain the recovered 80% desktop presentation, the five-project index,
“hundreds of companies” copy, native film posters, and the existing contact
section. The candidate and production source at dd4a0e9 also produced zero
pixel differences in 12 controlled local comparisons (six routes, desktop and
mobile) before the subsequent Needle case-study update on main.

After incorporating the interactive Needle page and its technology-stack
introduction from production commit `2f4083c897a2286848a9d51552d88954656418b8`,
repair candidate `907aa997bdb2365669cd1950ce2a591e9af51c2d` produced zero differing pixels on all 12 controlled
comparisons: homepage, Needle, F24, Second Voice, Flow and Leu at 1440px and
390px. Both sides used the same local Chromium build, decoded images and fonts,
reduced motion, a dismissed introduction and the initial page state. This is
source-parity evidence, not a replacement for the hosted cross-browser suite.

The subsequent contrast correction intentionally darkens inactive F24 architecture
labels and previous-event labels in Flow's case-study timeline. The subdued surfaces and borders use the existing palette;
diagram geometry is retained. These case-study diagrams are outside the
homepage screenshot baselines above; their accessibility rules remain enabled.

Baselines are browser, platform and device-scale specific. A screenshot from a
different local Chromium build must not overwrite a hosted Linux baseline.
Review missing or changed images together with the independent source-copy,
geometry and interaction assertions; do not approve snapshots solely to make
CI pass. Portrait snapshots retain zero-pixel tolerance.

The 30 WebKit desktop/mobile Linux baselines were captured at `907aa99` by
run `37195070352`, artifacts `browser-evidence-10`, `-12`, `-18` and `-20`.
Each portrait, hero and project state was visually reviewed before adoption.
These freeze the existing WebKit presentation, including its viewport-unit
resolution under desktop CSS zoom. Intro handoff assertions remain separate
and are not relaxed by accepting resting screenshots.

After incorporating production commit `d2c55d1e8da6dc4bf1f24fcd800fce9f3e51246e`
(the live Needle Monolith captures), the repair candidate again matched that
production source with zero differing pixels on the homepage and Needle case
study at both 1440px and 390px. The same controlled capture conditions described
above were used. The two intentional case-study diagram contrast changes remain
separately documented; the new Needle assets were preserved without alteration.
