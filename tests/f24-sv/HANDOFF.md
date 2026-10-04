# Handoff: F24 and Second Voice case-study pages, plus legal pages

**For:** Codex, in the portfolio repo (SvelteKit, `portfolio` branch, live at miguelalmeida.is-a.dev).
**Goal:** implement `/work/f24` and `/work/second-voice` so they match the reference pages in this bundle at every breakpoint and in every interactive state. Also add `/impressum`, `/privacy` and the global footer note from `legal/`.
**Done means:**
- `tests/parity` passes all 55 parity tests and all 14 behaviour and motion tests;
- the legal pages are live with every `[BRACKET]` filled in by the site owner;
- nothing is pushed or deployed.

This bundle follows the same method as the Leu and Flow handoff. If that work landed first, reuse its harness, fonts, CSS scoping and wrapper pattern.

---

## 0. Ground rules

1. **The reference HTML is the source of truth.** If this document and `reference/*.html` disagree, the reference wins, and you report the disagreement.
2. **Port, don't reinterpret.** Keep the same:
   - DOM tree, tag names, ids, classes, ARIA and text, including whitespace between inline elements;
   - CSS, in the same cascade order;
   - script timings.

   Svelte hash classes are the only allowed addition.
3. **No redesign or "improvement" before parity is green.** Afterwards, refactor freely, as long as the suite stays green.
4. **Don't touch unrelated portfolio areas.** The global header and footer stay. The only footer change is the legal note from `legal/FOOTER-NOTE.md`. The `.top` header in the reference is a stand-in: do not port it.
5. **Confidentiality is a hard requirement on F24.** Every name and number on that page is fictional. Do not add real F24 screenshots, feature names, terms, data or claims. `f24.behaviour.spec.ts` enforces this on the visible text *and* the page source.
6. **Don't push or deploy.** Stop at a green local run and report.

---

## 1. Bundle contents

```
f24-sv-handoff/
  HANDOFF.md             this document
  MEASUREMENTS.md        measured post-cascade styles, desktop 1440 and mobile 390
  reference/
    f24.html  second-voice.html     source of truth, self-contained, no network
    fonts/                          self-hosted fonts + fonts.css (see 3.3)
    measurements/*.json             ~95 F24 and ~70 Second Voice elements x 5 viewports x 25 properties
    screenshots/{f24,sv}/{desktop-1440,mobile-390}/*.png   visual atlas of every tested state
  tests/parity/
    playwright.parity.config.ts  harness.ts  motion.ts
    f24.parity.spec.ts            6 sequences x 5 viewports
    sv.parity.spec.ts             5 sequences x 5 viewports
    f24.behaviour.spec.ts         notice, tabs, lesson 1, testing widget, confidentiality, autoplay timing, motion
    sv.behaviour.spec.ts          submission snapshot, diff parity, failure recovery, idempotency, sharing, honesty, motion
    measure.capture.spec.ts       regenerates measurements (CAPTURE=1)
  legal/
    README.md  IMPRESSUM.md  PRIVACY-POLICY.md  SECOND-VOICE-PRIVACY.md  FOOTER-NOTE.md
```

Self-test result: run against the reference itself (reference vs reference), all 55 parity tests and 14 behaviour and motion tests pass. Every state in the suite is deterministic.

---

## 2. How parity is judged (read this; it differs slightly from Leu/Flow)

**Pairing:** each test opens the reference and the implementation in identical Chromium contexts:
- the viewport;
- `deviceScaleFactor 1`, light colour scheme, `reducedMotion: reduce`.

Both sides run the same interactions and are screenshotted region by region.

**Viewports:** 1440x900, 1280x800, 1100x800, 820x1180, 390x844.

**Comparison** uses pixelmatch with `threshold: 0.03` and `includeAA: false`. Pixels that differ only by anti-aliasing are ignored. Any other pixel whose colour differs by more than about 3% fails. Size differences fail.

> **Why not threshold 0 here?** On these two pages, Chromium's GPU rasteriser produced single-pixel noise on curved edges (rounded pills, shadow corners) even with the reference compared against itself, for example (101,19,66) against (101,20,66). 0.03 is just above that noise floor and far below anything a person can see. Every real colour, layout, text or state difference still fails.

**Capture stylesheet,** applied identically to both sides:
- the global chrome is hidden: `.top` on the reference, `PARITY_IMPL_HIDE` on the implementation;
- `.pnav` is static and its divider transparent;
- carets are hidden;
- `animation: none` is applied. Every animation on these pages ends on the element's normal style. Removing finished `fill-mode` animations prevents Chromium from rasterising text differently depending on layer promotion. Motion itself is verified separately (section 9).

**Running it:**

```bash
npm i -D pngjs@7 pixelmatch@5
npm run build && npm run preview -- --port 4173 &
PARITY_IMPL_BASE=http://localhost:4173 \
PARITY_IMPL_HIDE='<global header, footer and floating site UI selectors>' \
npx playwright test -c tests/parity/playwright.parity.config.ts
```

`PARITY_IMPL_F24_URL` and `PARITY_IMPL_SV_URL` override the routes. On failure, `test-results/parity/<page>/<viewport>/` holds `*.ref.png`, `*.impl.png` and `*.diff.png`.

**Never** edit the reference, the thresholds, the viewports or the states to get green.

---

## 3. Integration

### 3.1 Files

```
src/routes/work/f24/+page.svelte                 imports f24.css, composes sections
src/routes/work/second-voice/+page.svelte        imports second-voice.css
src/routes/impressum/+page.svelte                from legal/IMPRESSUM.md (German first, English below)
src/routes/privacy/+page.svelte                  from legal/PRIVACY-POLICY.md
src/lib/case-studies/shared/
  ProductNav.svelte        .pnav + #sentinel; stuck border; aria-current by IntersectionObserver (-35% 0px -60% 0px)
  RadioGroup.svelte        role=radiogroup|tablist, roving tabindex, arrow keys (the reference's radios())
  StageRail.svelte         .rail (Second Voice gates)
src/lib/case-studies/f24/
  data.ts                  SITS, LOG, STATES, QP, FOUND/SVF/RXF, ESTAGES, DEC, NETS, ASSERTS
  LegalBar.svelte          .legal-bar (role=note) + #notice section (NoticeFull.svelte)
  SituationStory.svelte    #try: tabs, play/pause, example screen (.mock), panel, arrows, hint
  StatesExplorer.svelte    #states: state radios, search, status filter, sort, clear, rows, row detail
  LessonCompare.svelte     #parity: two screens, five question parts, compare, verdict, reset
  LessonFoundation.svelte  #evolve: step tabs, FLIP diagram, panel, arrows
  Decisions.svelte         #decisions: layer diagram + 7 tabs + context/decision/consequence
  TestingWidget.svelte     #testing: name input, network radios, Save, double click, assertions cascade
  TeamSection.svelte  F24Specs.svelte
src/lib/case-studies/second-voice/
  content.ts               ORIGINAL, VOICES, STRENGTHS, REWRITES (authored text, copy verbatim)
  diff.ts                  tok, isPunct, diff (LCS), stats, renderOps (pure; unit-test them)
  workspace.svelte.ts      S state: controls, submitted, result, pending, failed, runs, view
  Workspace.svelte  StateTruths.svelte  VoiceRows.svelte  Gates.svelte  ShareCard.svelte  ReleaseLog.svelte  SvSpecs.svelte
```

Imperative rendering in the reference (innerHTML) becomes Svelte templates that emit the same markup. Two things must stay imperative:
- **F24 Lesson 2 chips:** they move between containers (FLIP), so keep stable keyed elements and move them.
- **F24 example screen:** its height tween uses the Web Animations API on `.mock` (section 9).

### 3.2 DOM contract (do not rename)

The tests and anchors depend on these.

**F24**
- Ids:
  - page: `main#main`, `#sentinel`, `#pnav`, `#overview`, `#notice`
  - opening story: `#try`, `#play`, `#sits`, `#asmStage`, `#hint`, `#mock`, `#sitPanel`, `#sitK`, `#sitT`, `#sitSee`, `#sitBuilt`, `#prev`, `#next`
  - states explorer: `#states`, `#histState`, `#histSearch`, `#histStatus`, `#histSort`, `#histClear`, `#hist`
  - lesson 1: `#migration`, `#parity`, `#qparts`, `#compare`, `#resetCmp`, `#scrNew`, `#newCount`, `#newChips`, `#newList`, `#verdict`
  - lesson 2: `#evolve`, `#evoTabs`, `#evo`, `#svFeat`, `#svFound`, `#fdFound`, `#rxFeat`, `#svNote`, `#evoPanel`, `#evoK`, `#evoTitle`, `#evoText`, `#evoPrev`, `#evoNext`
  - decisions: `#decisions`, `#layersD`, `#decTabs`, `#dt0..6`, `#decPanel`
  - testing: `#testing`, `#cfgName`, `#net`, `#tSave`, `#tDouble`, `#tReqs`, `#tRes`, `#asserts`
  - team: `#team`
- State hooks: `#mock[data-on]`, `.hot`, `.hot-all`, `.stab[aria-selected]`, `.seen`, `.sit-tabs.playing`, `.hint.show`, `.qrow[data-s]`, `.hit`, `#evo[data-stage]`, `.ld.on`, `.layers-d.focus`, `.asserts li[data-s]`, `.show`, `.hist-row[aria-expanded]`.

**Second Voice**
- Ids:
  - page: `main#main`, `#sentinel`, `#pnav`, `#overview`
  - workspace: `#try`, `#draftText`, `#voiceCtl`, `#voiceDesc`, `#strCtl`, `#submit`, `#failSw`, `#resultTag`, `#runTag`, `#viewCtl`, `#mvWrap`, `#mv`, `#stats`, `#notice`, `#retry`, `#dismiss`
  - state section: `#state`, `#naiveCard`, `#naiveLabel`, `#naiveWhy`, `#snapLabel`, `#snapWhy`, `#miniVoice`, `#truths`
  - voices: `#voices`, `#vStr`, `#vSrc`, `#vrows`
  - gates: `#gates`, `#scen`, `#gateRail`, `#mCalls`, `#mDay`, `#ops`
  - privacy: `#privacy`, `#visPill`, `#shareText`, `#shareActions`, `#share`, `#confirm`, `#doShare`, `#cancelShare`, `#unshare`, `#linkline`
  - release: `#release`
- State hooks: `#mv[data-mode=original|marked|rewrite]`, `.reveal`, `.mv-wrap.pending`, `.done`, span classes `k|i|d` with `j`, `o0`, `r0` and `--n`, `.lab-card.wrong`, `.truths .diff`, `.rail li[data-s]`, `.meter-card.bump`.

### 3.3 Fonts: self-hosted (decision point, and a GDPR requirement)

`reference/fonts/fonts.css` declares:
- **Figtree:** variable, weight 300 to 900, normal and italic.
- **Source Serif 4:** variable with the opsz axis, weight 200 to 900, normal and italic.

Both are latin and latin-ext, from `@fontsource-variable/*@5.3.0`, with the family names `Figtree` and `Source Serif 4`.

The published prototypes loaded Google Fonts from Google's servers. **The implementation must not.** Under GDPR that sends visitors' IP addresses to Google (see `legal/README.md`).

- **If the site already self-hosts the same files:** reuse them.
- **If it loads static weights or Google Fonts:** stop and report. Moving the whole site to these self-hosted files is the recommended fix, for legal reasons as well as parity.

### 3.4 CSS scoping

Same pattern as the Leu/Flow handoff:
- **Copy verbatim:** each page's `<style>` goes into `f24.css` or `second-voice.css` verbatim, in the same order. The shared base comes first, then the page layers.
- **Root wrapper and prefix:** wrap each page in `.cs-f24` or `.cs-sv` and prefix every selector (for example with `postcss-prefix-selector`).
- **`:root` tokens** move to the wrapper.
- **`body` rules move onto the wrapper,** and `overflow-x:hidden` becomes `overflow-x:clip`, so `position:sticky` keeps working.
- **`html` rules** go in `:global(html:has(.cs-f24))` (and the Second Voice equivalent).
- **`@keyframes`** get the page prefix.
- **Global base rules:** neutralise any base rule from `app.css` that reaches inside the wrapper. The diff will show where.

**Two reduced-motion fixes are already in the reference. Keep them:**
- The base rule sets `animation-delay:0s!important` as well as durations.
- F24 ends with a reduced-motion block that resets the class-level `!important` transitions: the 0.7s width glide on `.mock`, `.stab`, `.m-sel` and others.

Without these, staggered content stays invisible and the example screen still animates for reduced-motion users. Both were found and fixed while building this suite.

---

## 4. Tokens

These are the portfolio's real tokens. Map them to the existing `app.css` variables; don't duplicate them.

| Token | Hex | Role |
|---|---|---|
| Paper | `#EFF3E3` | page, tracks, inset panels |
| Ink | `#0B2B22` | text |
| Forest | `#12372D` | dark panels, done states, protected or "foundation" blocks |
| Plum | `#610D3D` | buttons, focus, selection, current step, highlights that need attention |
| Sage | `#E4EAD3` | frames, legal bar, notice, chips |
| Ivory | `#FAF7ED` | windows, cards, text on dark |
| Rule | `#9FAE9B` | lines (often at 0.55 alpha) |
| Muted | `#506353` | secondary text |
| Highlight | `#E2EDBA` | "added", "compared", "kept", success pills |

Page-scoped supporting colours, with these exact values: Plum tint `#F1E3E8`, Plum wash `#F6EEF0`, Fail `#8F2D2D`, Fail tint `#F2DEDB`, Amber `#7A5410`, Amber tint `#F0E6C8`.

- Shadow: `0 1px 2px rgba(11,43,34,.06), 0 14px 34px -14px rgba(11,43,34,.22)`.
- Easing: `--ease: cubic-bezier(.2,0,0,1)`. Calm transitions use `cubic-bezier(.22,1,.36,1)`.
- Theme: light only, `color-scheme: light`.

## 5. Type and layout

- **Type:**
  - Figtree everywhere.
  - Source Serif 4 only for Second Voice's draft and rewrite text.
  - Monospace only for small technical tags.
- **Scale:**

  | Element | Size / line-height | Weight | Tracking |
  |---|---|---|---|
  | h1 | `clamp(44px,5.8vw,84px)` / 1 | 800 | -0.045em |
  | h2 | `clamp(32px,3.6vw,52px)` | 800 | -0.045em |
  | F24 panel titles | `clamp(30px,3.2vw,46px)` | 800 | n/a |
  | Lesson titles | `clamp(24px,2.4vw,34px)` | 800 | n/a |
  | Body | 17px / 1.6 | 400 | n/a |
  | Hero sub | `clamp(18px,1.6vw,21px)` | 400 | n/a |

  `MEASUREMENTS.md` has every resolved value.
- **Container:** `width:min(1312px, 100% - clamp(32px,6vw,96px))`.
- **Radii:**

  | Element | Radius |
  |---|---|
  | frames | `clamp(20px,3vw,36px)` |
  | windows | `clamp(16px,2vw,24px)` |
  | cards | 20 to 28px |
  | pills | 999px |

- **Breakpoints:**
  - **F24:** 1020 (product-nav links hidden), 1000 (lesson 1 becomes 2+1, lesson 2 stacks), 960 (story body stacks), 860, 760 (states rows drop two columns), 560 (lesson 1 single column), 520.
  - **Second Voice:** 1060 / 700 (gates), 1020, 900 (workspace and state grid stack), 860, 720.

---

## 6. F24 page, section by section

Section order:
1. Legal bar
2. Product nav
3. Hero
4. Situation story
5. States explorer
6. Migration (two lessons)
7. Decisions
8. Testing
9. Team
10. Specs
11. Notice
12. Next project

1. **Legal bar** (`aside.legal-bar`, `role=note`): sits under the global header and above the product nav. Sage background, radius 14, 14px text, a Forest "i" disc, and a link to `#notice`. It is not dismissible.
2. **Product nav:** sticky, 64px tall. Links: Overview, States, Migration, Decisions, Testing; plus a "Try it" pill linking to `#try`.
3. **Hero:**
   - kicker "F24, frontend architecture and product delivery, 2022-now";
   - h1 "From mockup to production system.";
   - sub with no first person ("Built …");
   - CTAs: "Try it" and the text link "Architecture decisions".
4. **Situation story (`#try`).**
   - **Header row:** title, sub, and a Play/Pause pill. The pill is a Plum disc with a CSS triangle or pause bars and `aria-pressed`.
   - **Tablist `#sits`:** 9 tabs (Start, then 1 of 8 to 8 of 8). Each tab is 14px radius with a 3px progress bar at the bottom. The selected tab has a 2px Plum ring; visited tabs get "✓".
   - **Body:** a 1.15fr/.85fr grid, aligned to the top. On the left, the example screen: a Sage stage with a minimum height of 540px, an "Example screen" pill, and `pointer-events:none` on the mock. On the right, the panel: k-label, h4, "What you see" and "What had to be built", and the round prev/next arrows.
   - **Situations:** one state at a time via `#mock[data-on]`: '' (mockup), loading, validation, permissions, api, testrun, recovery, responsive, tests. The changed region gets `.hot` (a 3px Plum ring); responsive gets `.hot-all`.
   - **Autoplay:**
     - 2400 ms per situation, while `#try` is at least 45% in view;
     - pressing Play advances immediately;
     - any tab or arrow use pauses it;
     - off under reduced motion.
   - **Clicking the stage** shows the hint "This is a picture of the screen. Pick a tab above to change it." for 2600 ms, and the tab row dims briefly (opacity 1 → .55 → 1 over 900ms).
5. **States explorer (`#states`):**
   - a radiogroup of 7 states;
   - search across scenario and contact;
   - status filter (All, Delivered, Failed), a sort toggle, and "Clear filters";
   - rows that expand to a detail grid (Scenario, Contact, Channel, Outcome or Root cause).
   - **Partial state:** the first 5 rows, a banner, and contacts shown as "Contact n" placeholders.
   - **Stale state:** a banner with Refresh.
   - Footer: "n of 24 entries". Every failure reason reads "Example reason, invented for this page."
6. **Migration (`#migration`):** h2, then two framed lessons.
   - **Lesson 1 (`#parity`): A copy can look perfect and still be wrong.**
     - Layout: original screen | the question | rebuilt screen.
     - The question has five parts: Where it asks; Whose data; How much, in what order; The shape of the answer; What it remembers. Each part is a button whose status goes Not compared → Comparing → Compared.
     - "Compare the questions" checks each part for 750 ms. Parts not yet compared are highlighted on both screens via `[data-dep]` (count, contacts, list) with `.hit`.
     - When all five are done, the rebuilt screen fills in (24 entries, Teams A to C, three rows, fading in with stagger), the Forest verdict "Same question. Same answer." appears, and "Start over" resets.
     - Individual parts can also be clicked.
   - **Lesson 2 (`#evolve`): Share the foundation. Keep shipping.**
     - Three step tabs: Single source of truth; A shared foundation; Two stacks, one product.
     - Grid areas per stage: 1 = `sv`; 2 = `fd` over `sv`; 3 = `fd` over `sv rx`. The nine foundation chips move between `#svFound` and `#fdFound` with an 800ms FLIP.
     - Panel with title, text and arrows; arrows are disabled at the ends, at 0.35 opacity.
7. **Decisions (`#decisions`):**
   - layer diagram: shell, route, feature, components, API, services, tests;
   - 7 pill tabs (`#dt0..6`); the selected decision lights its layers (`.layers-d.focus .ld.on` → Forest);
   - a three-card panel: Context, Decision (on Highlight), Consequence.
8. **Testing (`#testing`):**
   - name input, network radios (Normal 600ms, Slow 1600ms, Offline), Save, and "Double-click Save";
   - the button is disabled while pending, so a double click sends one request;
   - the assertions tick in one by one, 140ms apart;
   - the request counter flashes Plum;
   - focus returns to Save;
   - offline shows "Couldn't save. You're offline. The name you typed is kept."
9. **Team (`#team`):** a photo slot (keep it a placeholder until a photo is approved), "Used by hundreds of companies.", "Contributions included:" with generic capability chips, and the merge sentence.
10. **Specs:** the Forest "At a glance" panel and three facts.
11. **Notice (`#notice`):** a Sage panel with six numbered points, verbatim.
12. **Next project:** Second Voice.

---

## 7. Second Voice page, section by section

Section order:
1. Product nav
2. Hero
3. Workspace
4. State
5. Voices
6. Behind Rewrite
7. Privacy
8. Release
9. Specs
10. Next project

1. **Product nav:** Overview, State, Voices, Behind submit, Privacy, Release, plus "Try it".
2. **Hero:** "Choose a literary voice. See exactly what changes.", with a sub of 18 words or fewer.
3. **Workspace (`#try`):**
   - **Layout:** .92fr/1.25fr. Left:
     - the draft on Paper, in Source Serif 4;
     - Voice radios (Spare, Lyrical, Noir) with a description line;
     - Strength radios (Light, Strong);
     - the Rewrite button and the "Make the next request fail" switch.

     Right: the result header (Highlight-less label, a Forest settings pill, "Run n" in mono), the View radios (Original, Changes, Rewrite), the text, the stats line and key, and the notice.
   - **Initial result:** Lyrical, strong, run 1, Changes view.
   - **Rewrite:**
     - takes a snapshot of the controls (`S.submitted`);
     - shows pending for 900ms (a progress line on top, text at 0.45 opacity, button "Rewriting…");
     - then sets the result to the snapshot;
     - new text inks in: inserted and deleted tokens use `inkIn` .5s, staggered `--n × 30ms`; the panel flashes `okFlash` 1.1s.
   - **Controls that differ from the result's settings:** the Plum-wash notice "The controls now say X. This rewrite is still Y."
   - **Failure (switch on):**
     - the run number still increments;
     - the Fail-tint notice lists what was kept (Draft, Submitted settings, Last rewrite, Retry available);
     - "Retry {settings}" retries the failed snapshot; "Dismiss" clears the notice.
   - **Diff (must match exactly):**
     - Tokens: `/[A-Za-z0-9’']+|[^\sA-Za-z0-9]/g`.
     - LCS on exact token equality. Backtrack preference: delete before insert on ties.
     - Ops are `=`, `-` and `+`.
     - Leading space: the first op has none, and punctuation has none; every other token gets `<i class="sp"> </i>`.
     - Classes: `k`, `i` or `d`; `j` when the previous op has the same non-`=` type; `o0` and `r0` for the first token of the original and of the rewrite.
     - Stats count words only. Kept = `=` words out of the original's words. Runs: a run with both deletes and inserts is "replaced", inserts only is "added", deletes only is "removed".
   - **Modes:** inserted and deleted spans collapse with `max-width:0` and opacity 0 (.45s) in the opposite modes. In Changes mode, inserts are Highlight with a 2px Forest underline, and deletes are Plum strikethrough at .75 opacity.
4. **State (`#state`):**
   - a naive label card (gets a Plum ring and strikethrough when wrong) and a snapshot label card;
   - a mini voice radiogroup bound to the same state;
   - a Forest panel listing the seven truths live, with the mismatching row in Highlight and "differs".
5. **Voices (`#voices`):** a strength radio and the source quote, then three rows. Each row has the voice, the marked text, "% of the original's words kept" and a two-colour meter.
6. **Behind Rewrite (`#gates`):**
   - **Layout:** scenario buttons | 9-gate rail | counters (model calls, daily allowance of 3, operations list).
   - **Gate timing:** 240ms each; the provider gate takes 420ms.
   - **Scenarios:**

     | Scenario | What happens |
     |---|---|
     | New | Passes every gate; uses one allowance and one model call. |
     | Replay | The key is seen, the reuse state shows in Plum, the provider is skipped, and no model call happens. |
     | Timeout | The provider fails, the operation is "reserved as ambiguous", and nothing is retried automatically. |
     | Schema | The output is rejected and nothing is stored. |
     | Allowance at 0 | Blocked at the allowance gate; nothing is sent. |
     | Reset | Clears counters and operations. |

   - Changed counters "bump" to Plum for 900ms.
7. **Privacy (`#privacy`):**
   - the share card: "Private" pill → Share → inline confirmation → "Public" + "Public link created /r/7f3a9c" → "Make private again", with focus managed at each step;
   - the "kept apart" chips and the incident card;
   - "What debugging can see" and "What it avoids collecting".
8. **Release (`#release`):** a three-entry timeline (136 tests; CI at 81 of 82, repaired; 29 September 2026 "Request blocked", live generation unverified). The honesty text is verbatim and required.
9. **Specs:** a Forest limits panel (8 figures) and four facts.
10. **Next project:** F24.

---

## 8. Legal pages and footer (from `legal/`)

1. **`/impressum`:** render `IMPRESSUM.md`, with the German first and the English translation below. Keep the HTML comment at the end out of the page.
2. **`/privacy`:** render `PRIVACY-POLICY.md`.
3. **Footer:** add the note and the two links from `FOOTER-NOTE.md` to the global footer on every page.
4. **Second Voice app:** `SECOND-VOICE-PRIVACY.md` belongs in the Second Voice app repo, not the portfolio. Leave it for the owner.
5. **Placeholders:** do not invent values for `[BRACKETS]`. Render them as-is and list every one in the PR description, so the owner can fill them in before deploying. The pages must not ship to production with brackets in them.
6. **Styling:** the legal pages use the site's normal page layout and type: an h1, h2 per section, 17px body, max 72ch.

---

## 9. Motion spec

Everything is disabled under `prefers-reduced-motion: reduce`: durations, delays and iteration counts, *including the class-level overrides noted in 3.4*. JS waits become 0.

| What | Property | Duration | Easing / delay |
|---|---|---|---|
| F24 autoplay (JS) | situation index | 2400 ms per step | Play jumps forward at once |
| F24 tab progress | `scaleX` 0→1 | `--dur` 2400ms | linear |
| F24 tab colours | background, box-shadow, colour | .4s | ease |
| F24 example screen height (JS, WAAPI) | height h0→h1 | 520ms | `cubic-bezier(.22,1,.36,1)`, overflow hidden while running |
| F24 example screen width (phone situation) | max-width | .7s | `cubic-bezier(.22,1,.36,1)` |
| F24 changed-region ring | box-shadow fade-in | .6s | ease |
| F24 new parts in the mock | opacity | .5s | ease |
| F24 panel title / lines | opacity + 3px rise | .55s | `cubic-bezier(.22,1,.36,1)`; second line +.07s |
| F24 hint | opacity, translateY 6px | .25s | shows 2600ms |
| F24 states rows | opacity, translateX -8px | .35s | stagger 40ms |
| F24 lesson 1 part check (JS) | status | 750ms per part | n/a |
| F24 lesson 1 fill-in | opacity | .5s | chips +90ms, rows +110ms stagger |
| F24 verdict | opacity + 3px rise | .6s | `cubic-bezier(.22,1,.36,1)` |
| F24 lesson 2 chips (JS FLIP) | transform | 800ms | `cubic-bezier(.22,1,.36,1)` |
| F24 testing assertions | rowIn | .35s | revealed 140ms apart |
| SV pending (JS) | n/a | 900ms | progress line `.9s` |
| SV mode switch | max-width, opacity, colour | .45s / .3s | `--ease` |
| SV new rewrite | `inkIn` (opacity, 5px rise, 2px blur) | .5s | `--n × 30ms` stagger; removed after 2400ms |
| SV result flash | `okFlash` box-shadow | 1.1s | `--ease` |
| SV gates (JS) | gate states | 240ms, provider 420ms | n/a |
| SV counter bump | colour | 900ms | n/a |
| Buttons | transform, box-shadow | .2s | `:active` scale .98 |

`motion.ts` compares the computed transition and animation of 24 F24 and 16 Second Voice elements with the reference. `f24.behaviour.spec.ts` drives the autoplay with a fake clock.

---

## 10. Accessibility

- **Navigation:** a skip link to `#main`; a labelled product nav.
- **Tabs and radios:** every tab set and radio group uses a roving tabindex with arrow keys:
  - situation story: Left/Right plus Home and End;
  - lesson 2 steps: Left/Right;
  - decisions: Left/Right;
  - all radiogroups: Left/Right/Up/Down with wrap.
- **Focus:** the 2px Plum `:focus-visible` ring everywhere.
- **Live regions:**
  - F24: `#hint`, the states list, `#scrNew`, `#verdict`, `#tRes`;
  - Second Voice: `#notice`, `#gateRail`.
- **F24 example screen:** `aria-hidden` (it's decorative). The panel text describes each situation.
- **Second Voice focus moves:** to the share controls after each sharing step, and to Retry after a failure.
- **Contrast:** all text pairs meet WCAG AA. Don't lighten Muted.
- **Audit:** axe-core and Lighthouse accessibility must both score 100.

---

## 11. Definition of done

1. Both pages are implemented as Svelte components (3.1), with the same DOM contract (3.2).
2. **55 parity tests pass** at all 5 viewports.
3. **14 behaviour and motion tests pass,** including F24 confidentiality and Second Voice honesty.
4. Unit tests for Second Voice's `diff.ts` (tokens, LCS, spacing classes, stats) and F24's data invariants (24 entries, five parts, seven decisions).
5. Fonts are self-hosted on these pages, and on the whole site if that was the chosen fix. **No requests to fonts.googleapis.com or fonts.gstatic.com.** Add a Playwright check that records network requests and asserts this.
6. `/impressum`, `/privacy` and the footer note are present on every route. Placeholders are listed for the owner.
7. No style leaks: other routes are pixel-identical before and after (one full-page screenshot comparison per existing route).
8. No console errors. The only network requests are the page's own assets.
9. Nothing is pushed or deployed. The PR lists the fonts and scoping decisions, the placeholders, and the parity summary.

## 12. Deliberate choices to preserve

- **Light theme only;** no em or en dashes; no first person on F24; only one small label above a heading per page (the hero kicker).
- **F24 stays fictional and generic.** No real feature names, data, screens or vocabulary; "hundreds of companies" is a team outcome.
- **The legal bar and full notice stay visible** and are never collapsed.
- **Second Voice keeps its honesty labels:** prepared examples, and live generation unverified.
- **Calm motion:** fixed layout heights in the F24 story so nothing jumps; fades instead of drops; the tab row only scrolls when needed.
