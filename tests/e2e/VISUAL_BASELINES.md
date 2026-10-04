# Browser screenshot baselines

The Chromium desktop Linux baselines were captured by GitHub Actions run
37192463767 at commit 9f9c2998048dcc67511b385be1d0adb725417903 (artifacts
`browser-evidence-2` and `browser-evidence-4`). All 15 images were individually
reviewed before adoption on 4 October 2026.

They retain the recovered 80% desktop presentation, the five-project index,
“hundreds of companies” copy, native film posters, and the existing contact
section. The candidate and production source at dd4a0e9 also produced zero
pixel differences in 12 controlled local comparisons (six routes, desktop and
mobile) before the subsequent Needle case-study update on main.

Baselines are browser, platform and device-scale specific. A screenshot from a
different local Chromium build must not overwrite a hosted Linux baseline.
Review missing or changed images together with the independent source-copy,
geometry and interaction assertions; do not approve snapshots solely to make
CI pass. Portrait snapshots retain zero-pixel tolerance.
