# Case-study motion

Apply approved Figma scenes 05–09 to the current Compact index case studies: Morrow survey assembly, Second Voice word masks, Leu source return, Needle artwork discovery, and F24 request recovery. Keep every existing homepage element, case-study paragraph, preview, navigation behavior, and other route unchanged.

Add one scoped motion figure after each case's existing preview. Use native Web Animations and semantic HTML rather than video exports so the figures respond to screen size, pause, keyboard actions, and reduced motion. Reuse existing Needle artwork assets. Existing release chunks remain byte-identical; the release installer adds external same-origin assets without changing CSP or inline script hashes.

Each figure plays once when visible, can pause/replay, suspends offscreen and in a hidden tab, and cleans up when the case closes or switches. Reduced motion shows the completed composition without spatial movement. Controls use at least 44px targets. Illustrative product examples must not imply new product features or F24 metrics.

The user approved the visual designs in Figma and requested their implementation. A second design approval is unnecessary. The current source is `release/optical-index/*.txt`, installed by `scripts/install-portfolio-home.mjs`; `src/routes/+page.svelte` is not the published homepage.
