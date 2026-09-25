# /brag plan: Miguel Almeida's portfolio

Made with `/brag-slim` (the Opus 5.5 path of `/brag`). Everything in the video is built from this repository: the real copy, the real design tokens, the real product films and captures, the site's own motion gestures. The soundtrack and sound effects are original, synthesised for this edit.

## Inspection answers

| Question | Answer |
|---|---|
| What is it? | The portfolio of Miguel Almeida, a Berlin frontend engineer who built a business application's production frontend from scratch (F24) and builds independent AI and computer-vision products. |
| Who is it for, what does it do for them? | Recruiters and hiring managers. It shows, with evidence, that he can own a frontend from first mockups to production and build dependable interfaces around AI. |
| What sets it apart? | He builds *the systems around AI*: request ownership (Camera Harness rejects stale camera responses), spending controls (Second Voice reserves budget before generation), inspectable evidence (Mirror AI turns corrections into test cases). Design background plus engineering. |
| Most impressive claim | "Built from scratch. Used by hundreds of companies." (the site's own production-experience heading). |
| Visual hook | The red-lit portrait on pure black, read by his own Camera Harness vision UI. |
| Real UI / flow to show | The homepage hero, then a click on "Explore my work" into Selected work, then each product doing its job: Second Voice rewriting a passage as Tolkien word by word, Mirror AI outlining a giraffe and opening its inspector, Camera Harness describing a gesture and asking for confirmation, VIGIA's operational briefing over Portugal. |
| Tone | `polished` with `cinematic` scale ("Google level": precise, confident, generous type, one idea per shot). |
| Share caption | See `share-copy.txt`. |

## Angle

**The portfolio is the product, and every product lends the film its grammar.** The video is a guided flythrough of the real site, and each project's signature interaction becomes part of the edit:

- Camera Harness → the opening: its floating recognition labels identify Miguel (uncertain, then confirmed ✓, exactly like the product).
- The portfolio → the aperture that opens around media, the accent rule that draws, the arrow that steps, the hero's line-by-line settle, the tile-to-page frame transition.
- Camera Harness → an iris transition (its Blender iris follows the camera lifecycle).
- Second Voice / Mirror AI / VIGIA → their real recorded films and captures, pushed in so the interaction is legible.

## Hook (first 2.5 s)

Black. An aperture opens on the red portrait. Camera Harness chrome appears ("Camera on", "● LIVE", "Automatic vision active") and floating labels resolve on the beat: *Identifying…* → **Miguel Almeida ✓**, *Possible engineer* → **Frontend engineer ✓**, *Identifying…* → **React · TypeScript · Svelte ✓**.

## Highlights

1. Second Voice AI: "Rewrite anything with Tolkien as author." (its own headline), with the real word-level rewrite.
2. Mirror AI: "Point to what you want to understand." (its own thesis), with the real contour selection.
3. Camera Harness: "A live camera as an interactive companion.", with the real gesture result and confirmation panel.
4. VIGIA: "Incidents, routes, facilities: one usable picture.", with the real operational briefing.
5. Production at F24: "Built from scratch. Used by hundreds of companies."

## Punchline / outro

"I build the systems around AI." (the story page's own line), then the end card: his name set huge *behind* the portrait (depth matte), "Frontend Engineer · Berlin", and `miguelalmeida.is-a.dev`.

## Visual identity (from the source)

- Stage `#000` / `#050505`, cream `#f4eadc`, muted cream at 70 %, accent `#e8a878` (from `src/app.css` `.dark`).
- Libre Baskerville for display lines (hero `h1`, case-study titles), Roboto for UI, eyebrows and labels (`app.html`, `tailwind.css`).
- Motion: `cubic-bezier(0.22, 1, 0.36, 1)` settle, 520 ms section settle, 20 px heading shift, 65 ms line stagger, portrait settle from 1.035 scale (`src/lib/motion/tokens.ts`, `HeroSection.svelte`).
- Product colors sampled from the captures: Camera Harness green `#2c6854`, slate `#485064`, navy LIVE `#202848`; Second Voice blue `#a4c8f0`; Mirror AI cyan contour.
- 1920×1080, 60 fps (smoother UI motion than the 30 fps default), 25.0 s, H.264 High with AAC audio.

## Storyboard (96 BPM, one bar = 2.5 s, 10 bars = 25.0 s)

| # | Time | Bar | Scene | On screen | Motion / transition | Sound |
|---|---|---|---|---|---|---|
| 1 | 0.00–2.50 | 1 | **Hook: recognition** | Red portrait, Camera Harness chrome, three labels resolving to ✓ | Aperture opens from a slit; slow push-in; labels pop on the beat with the product's anchor dots | Filtered pad swell, three in-key "vision" blips, reverse riser into bar 2 |
| 2 | 2.50–6.25 | 2–3 | **Hero** | "I'm Miguel, a frontend engineer building multimodal and computer-vision systems." · "Frontend & design engineering for elite products." · pills: Explore my work / View résumé / Ask MiguelLLM · site nav | Portrait glides from centre to its hero position; headline settles line by line; rule draws; cursor arrives, portrait follows the pointer (pointer-depth); click on the "and" of beat 2 (5.94 s) | Drop: full groove, sub impact; soft click |
| 3 | 6.25–7.50 | 3 | **Selected work** | Page scrolls to "Selected work" and its five tiles | Smooth scroll on beat 3; accent rule draws along the section border; tiles open with the aperture reveal | Whoosh, soft ticks per tile |
| 4 | 7.50–10.00 | 4 | **Second Voice AI** (01) | Eyebrow "AI rewriting product", title, "Rewrite anything with Tolkien as author." · real film: Rewrite as Tolkien → live cuts and insertions | Tile frame carries into the project frame (the site's route transition); push-in on the live rewrite | Transition hit |
| 5 | 10.00–12.50 | 5 | **Mirror AI** (02) | "Visual selection interface", title, "Point to what you want to understand." · real film: giraffe outlined, inspector opens | Media pushes in from the right inside the shared frame; text on a shared vertical axis | Whoosh |
| 6 | 12.50–15.00 | 6 | **Camera Harness** (03) | "Browser media · applied AI", title, "A live camera as an interactive companion." · real capture: peace sign; the result card: "You raised your left hand and made a peace sign." | Circular iris opens on his face; the result card arrives on the "and" of beat 1 | Iris "shutter", confirmation chime |
| 7 | 15.00–17.50 | 7 | **VIGIA** (04) | "Crisis intelligence · Portugal", title, "Incidents, routes, facilities: one usable picture." · real capture: Operational Briefing over Portugal, then the event response console | Dip through black, then a settle from blur; hard cut on beat 3 to the second capture | Low whoosh, sub thump, soft ping on the cut |
| 8 | 17.50–20.00 | 8 | **Production at F24** (05) | "Production frontend · F24 · 2022 — now" · **"Built from scratch. Used by hundreds of companies."** · photo of F24's first shared AI service demo | Frame expands to full bleed; slow push; headline settles line by line | Lift: bigger hit, new layer |
| 9 | 20.00–22.50 | 9 | **Thesis** | "I build the systems around AI." with a recap strip of the five projects | Photo recedes; words arrive with Second Voice's insertion highlight; strip opens tile by tile | Breakdown, riser |
| 10 | 22.50–25.00 | 10 | **End card** | "Miguel Almeida" set huge behind the portrait · "Frontend Engineer · Berlin" · `miguelalmeida.is-a.dev ↗` | Portrait rises from black; name revealed behind him; arrow steps | Final D-major hit, reverb tail |

Durations sum to 25.0 s. Every line meant to be read is fully settled for at least ~0.3 s per word before it leaves.

## Readability budget

| Line | Words | Settled on screen |
|---|---|---|
| Miguel Almeida ✓ | 2 | 0.63 → 2.42 (1.8 s) |
| Frontend engineer ✓ | 2 | 1.09 → 2.42 (1.3 s) |
| React · TypeScript · Svelte ✓ | 3 | 1.56 → 2.42 (0.9 s), a label, read as texture |
| Hero headline | 10 | ~3.3 → ~6.4 (3.1 s) |
| Project title + claim | 2 + 6–7 | ~0.5 s after each cut → 0.15 s before the next (~1.85 s) |
| Built from scratch. Used by hundreds of companies. | 8 | line 1 from ~17.8, all lines ~18.1 → 19.96 (1.9–2.2 s) |
| I build the systems around AI. | 6 | ~20.4 → 22.32 (1.7–1.9 s) |
| End card | 6 | ~23.2 → 25.0 (1.8 s) |

Text always leaves before the cut and the next text arrives after it, so no two layouts ever cross-dissolve.

## Music cue guidance

No bundled track (brag-slim): an original cue composed for this cut.

- 96 BPM, D major. Bar lines land exactly on the scene cuts at 2.5 s intervals.
- Progression from bar 2: Dmaj9 · Bm11 · Gmaj9 · A(sus4→3), twice; bar 10 resolves on D.
- Bar 1 intro (pad, blips, riser) → bar 2 drop → bars 4–7 montage groove → bar 8 lift (F24) → bar 9 breakdown and riser → bar 10 final hit and tail.
- Sound effects are pitched to the key and share the music's reverb; they sit under the music.

## Claim hygiene

- Only portfolio copy or close, accurate trims of it. No invented numbers, metrics or testimonials.
- Adoption is stated exactly as the site states it ("Used by hundreds of companies"), about the application.
- VIGIA captures come from Miguel's public `vigia-crisis` repository (`data/validation/release/operator-console-screenshots/`), because the portfolio's own VIGIA media is served from an external host.
