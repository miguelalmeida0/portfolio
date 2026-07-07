# Motion Storyboards

Figma is the storyboard and handoff layer. Runtime animation happens in code.

## Storyboard A: Curtain Reveals The Bottle

| Frame | State | Layers | Notes |
|---|---|---|---|
| `01 start` | Curtains nearly closed; moon lens dim behind seam. | background, curtain masks, moon lens | Bottle not visible. |
| `02 anticipation` | Curtain seam compresses 8 px, brass rail brightens. | curtain masks, brass marks | Gives physical tension. |
| `03 transformation` | Curtains open; moon lens expands; bottle silhouette enters. | curtain masks, moon lens, bottle | Primary reveal. |
| `04 settle` | Curtains overshoot then settle; smoke mark appears near shoulder. | curtain masks, smoke, bottle | No text covered. |
| `05 final state` | Bottle is centered; lens becomes halo; CTA is readable. | bottle, lens, callouts, chrome | Final composition. |

- Trigger: first hero scroll chapter or page load after safe idle.
- Duration: 1400 ms.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` with curtain anticipation using `cubic-bezier(0.65, 0, 0.35, 1)`.
- Implementation target: GSAP or Motion with SVG/CSS masks.
- Reduced-motion fallback: show frame `05 final state` immediately with no curtain motion.

## Storyboard B: Moon Lens To Bottle Silhouette

| Frame | State | Layers | Notes |
|---|---|---|---|
| `01 start` | Round moon disc behind headline. | moon lens, headline | Headline safe zone protected. |
| `02 anticipation` | Disc compresses into lens and shifts behind bottle area. | moon lens | Text remains outside mask. |
| `03 transformation` | Lens becomes bottle mask through normalized bridge. | moon lens, bottle mask | Only if path is normalized. |
| `04 settle` | Bottle silhouette gains thin brass keyline. | bottle, brass keyline | Product object is now stable. |
| `05 final state` | Scent notes lock around bottle. | bottle, callouts | Ready for chapter interaction. |

- Trigger: scroll progress 0.18 to 0.42 on pinned hero.
- Duration: scroll-scrubbed or 900 ms if time-based.
- Easing: scroll-scrub uses linear progress with eased subranges.
- Implementation target: SVG + GSAP MorphSVG if available; otherwise staged CSS mask reveal.
- Reduced-motion fallback: static bottle silhouette and moon halo.

## Storyboard C: Smoke Mark Scent Note

| Frame | State | Layers | Notes |
|---|---|---|---|
| `01 start` | Small petal note sits near bottle shoulder. | petal, bottle | Petal is a scent-note marker. |
| `02 anticipation` | Petal rotates 4 degrees and thins. | petal | Small motion only. |
| `03 transformation` | Petal becomes smoke mark. | smoke | Decorative unless labeled. |
| `04 settle` | Smoke drifts into safe atmosphere zone. | smoke | Does not cover copy. |
| `05 final state` | Scent label appears in callout lane. | callout, smoke | Label remains HTML text. |

- Trigger: scent note selected.
- Duration: 650 ms.
- Easing: `cubic-bezier(0.33, 1, 0.68, 1)`.
- Implementation target: SVG path only if normalized; otherwise CSS opacity/scale with no fake morph claim.
- Reduced-motion fallback: selected scent label appears; smoke remains static.

