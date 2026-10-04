# Handoff: Leu and Flow case-study pages (pixel-exact port)

**For:** Codex, working in the portfolio repo (`~/Documents/ChatGPT/flow-portfolio-integration/portfolio`, SvelteKit, live at miguelalmeida.is-a.dev).
**Goal:** implement `/work/flow` and `/work/leu` so they are visually and behaviourally identical to the two reference pages in this bundle, at every breakpoint and in every interactive state.
**Definition of identical:** the parity suite in `tests/parity/` reports **0 differing pixels** for all 75 parity tests, and all 21 behaviour and motion tests pass. Nothing else counts as done.

---

## 0. Ground rules

1. **The reference HTML is the source of truth.** `reference/flow.html` and `reference/leu.html` contain every token, every string, every breakpoint, every state and every timing. If this document and the reference disagree, the reference wins, and you report the disagreement.
2. **Do not redesign, "clean up" or improve anything** before parity is green. No copy edits, no token renames that change values, no spacing tweaks, no new animations, no dark mode. After parity is green you may refactor freely; the suite must stay green.
3. **Port, don't reinterpret.** The fastest route to zero difference is a faithful structural port:
   - identical DOM tree;
   - identical tag names, ids, class names, attributes, ARIA and text nodes, including whitespace between inline elements;
   - identical CSS in the identical cascade order;
   - identical script behaviour and timings.

   Svelte may add its hash classes; nothing else may differ.
4. **Do not touch unrelated portfolio areas.** The global header, footer and homepage stay as they are. The `.top` header inside the reference is a stand-in for the real global header: do not port it.
5. **Do not push or deploy.** Open a branch and stop at a green local run.
6. **Report blockers instead of guessing.** Section 3.3 (fonts) and section 3.4 (global CSS leakage) are the two places where the repo may force a decision. Stop and report if you hit one.

---

## 1. What is in this bundle

```
leu-flow-handoff/
  HANDOFF.md                      this document
  MEASUREMENTS.md                 measured, post-cascade styles (desktop 1440 and mobile 390)
  reference/
    flow.html  leu.html           source of truth (self-contained, no network)
    fonts/                        pinned font files + fonts.css (see 3.3)
    measurements/*.json           every key element, 5 viewports, 26 computed properties
    screenshots/{flow,leu}/{desktop-1440,mobile-390}/*.png   visual atlas of every tested state
  tests/parity/
    playwright.parity.config.ts
    harness.ts                    pair runner + pixel diff (pixelmatch threshold 0)
    flow.parity.spec.ts           9 sequences x 5 viewports
    leu.parity.spec.ts            6 sequences x 5 viewports
    flow.behaviour.spec.ts        engine, keyboard, a11y, timing (fake clock), motion parity
    leu.behaviour.spec.ts         reading loop, keyboard, a11y, timing, motion parity
    motion.ts                     computed transition/animation comparison
    measure.capture.spec.ts       regenerates measurements (CAPTURE=1)
```

The screenshots are an atlas for humans: they were rendered on Linux Chromium 1194. They are **not** test baselines. The parity tests always render the reference and the implementation live, in the same browser, side by side. Machine-specific font rasterisation therefore cannot cause false failures.

All 75 parity tests and 21 behaviour tests were run against the reference itself (reference vs reference) and pass. Every state and selector in the suite is proven deterministic.

---

## 2. How parity is judged

- **Pairing:** each test opens the reference (`file://…/reference/*.html`) and the implementation (`http://localhost:4173/work/{flow,leu}`). Both run in identical browser contexts:
  - viewport, `deviceScaleFactor 1`, light colour scheme, `reducedMotion: reduce`;
  - the same interactions, in the same order.
- **Comparison:** after each step it screenshots the same region on both and runs pixelmatch with `threshold: 0`. Any differing pixel, or any size difference, fails. On failure it writes `*.ref.png`, `*.impl.png` and `*.diff.png` into `test-results/parity/<page>/<viewport>/`.
- **Viewports:** 1440x900, 1280x800, 1100x800, 820x1180, 390x844. Together these cover every breakpoint band in the reference CSS.
- **Chrome hidden during comparison:**
  - the reference stand-in header (`.top`) and the implementation's global chrome (`PARITY_IMPL_HIDE`, a selector list you set for the real header, footer and any floating site UI) are hidden with `display:none`;
  - `.pnav` is made `position:static` during captures, so sticky overlap cannot pollute element screenshots;
  - carets are transparent.
- **Motion:** compared separately.
  - `motion.ts` compares the computed `transition` and `animation` of 23 Flow and 20 Leu elements with no reduced-motion preference.
  - The behaviour specs drive the JS timers with Playwright's fake clock: hero steps, pipeline stage timing, trace unfold stagger.

### Running it

```bash
# once
npm i -D pngjs@7 pixelmatch@5          # pixelmatch 5 is CommonJS; v6+ is ESM-only
npx playwright install chromium         # or reuse the repo's Playwright browsers

# each run
npm run build && npm run preview -- --port 4173 &
PARITY_IMPL_BASE=http://localhost:4173 \
PARITY_IMPL_HIDE='<selector list for global header, footer, floating UI>' \
npx playwright test -c tests/parity/playwright.parity.config.ts
```

Useful variables:
- `PARITY_IMPL_FLOW_URL` and `PARITY_IMPL_LEU_URL` override the routes.
- `PARITY_REF_DIR` points at the reference folder if you move it.
- `CAPTURE=1` re-writes the atlas and measurements from the reference. Only do this if the reference changes.

Put `tests/parity/` and `reference/` in the repo under `tests/case-studies/` (or similar) and add an npm script `test:parity`. Do not let the repo's existing Playwright config pick these specs up with different `use` options.

---

## 3. Integration architecture

### 3.1 Routes and files

Use the repo's existing Svelte version and conventions (runes if Svelte 5). Proposed layout; keep components small, no 2,000-line page files:

```
src/routes/work/flow/+page.svelte        composes Flow sections; imports flow.css
src/routes/work/leu/+page.svelte         composes Leu sections; imports leu.css
src/lib/case-studies/shared/
  ProductNav.svelte                      sub-nav (.pnav), sentinel, stuck + aria-current logic
src/lib/case-studies/flow/
  flow.css                               the reference <style>, scoped (see 3.4)
  data.ts                                SEED, SCENARIOS, COMPOUND_OPS, LAT, DAYS, view constants
  engine.ts                              pure: matches, lookup, refName, resolve, transform, validate, describe, prettyOp
  demo.svelte.ts                         demo state + orchestration (run, correct, confirm, cancel, undo, redo, rewind, whatChanged, resetDay, setActive)
  CommandHero.svelte                     #cmd: sentence, ops, checks, timeline, replay
  CapabilityBento.svelte                 5 tiles with data-run
  FlowDemo.svelte                        #demoStage > .window > #demo
    Conversation.svelte                  chips, fail toggle, #log, #replies, tools
    CalendarBoard.svelte                 #days, #hours, #track0/#track1, events, ghosts, trails, now line
    PipelineRail.svelte                  #stages
    AmbiguityLines.svelte                #lines
  LatencyCompare.svelte                  stats, segmented control, #lat, #ticks
  PipelineStrip.svelte                   .early + .pipe + .quote
  InvestigationStory.svelte              .story
  FlowSpecs.svelte                       .specs2
src/lib/case-studies/leu/
  leu.css
  data.ts                                CONCEPTS, PASSAGES, VERDICT, STATE_LABEL, XV, STAGES, INV, graph layout (GN, GE, NW, NH)
  learner.svelte.ts                      model, passageResult, current passage
  graph.ts                               pure layout: edges (path, label centre, pill width), nodes (sub-label)
  LeuReader.svelte                       #try: Paper (passages, table) + trace sheet
  TraceNode.svelte
  ExtractionCompare.svelte               #source
  DependencyChain.svelte                 #architecture: steps, sticky diagram, mobile strip
  ConceptGraph.svelte                    svg.graph (used 3x: chain, mobile inline, closing)
  VersionCompare.svelte                  tabs + panels + .flowline
  ResultsBento.svelte                    #perf
  NativeRecordings.svelte                #native
  EngineeringDetail.svelte               #invs master-detail
  ClosingState.svelte                    closing paper + graph + summary
```

The reference scripts are written as sections with banner comments (`/* ---------- engine ---------- */` and so on). Port them function by function into the modules above.

**Imperative rendering (innerHTML in the reference)** becomes Svelte templates that output the same markup:
- calendar events, ghosts and trails;
- pipeline stage outputs and the transcript;
- the trace, extraction views, graph SVG and engineering panels.

**Keep these imperative-DOM behaviours exact:**
- **Calendar events are persistent elements keyed by id.** They move by updating `--t` and `--h` custom properties, never by remounting; this is what makes them animate and rewind. In Svelte, use a keyed `{#each}` and set the style properties. New events get class `new` for two animation frames, then drop it. Removed events get class `gone` and are removed after 380 ms (0 ms under reduced motion).
- **Trails** (undo/redo): a `.trail` element at the old `--t` and `--h` position, removed after 700 ms. Not created under reduced motion.
- **Ambiguity lines:** the SVG paths are recomputed from `getBoundingClientRect` on candidate change, on `ResizeObserver(#demo)` and on window resize. Section 6.4 gives the formula.
- **Leu trace nodes:** the opening sequence uses timeouts (section 8). Under reduced motion every node opens synchronously.

### 3.2 DOM contract (do not rename)

The parity suite, the anchors and the motion comparison depend on these.

**Flow, ids:**
- `main#main`, `#sentinel`, `#pnav`
- `#overview`, `#cmd`, `#replay`, `#tl`, `#tlList`
- `#try`, `#demoStage`, `#demo`, `#chips`, `#failToggle`, `#log`, `#emptyLog`, `#replies`
- `#undo`, `#redo`, `#what`, `#reset`
- `#days`, `#hours`, `#track0`, `#track1`, `#stages`, `#lines`
- `#latency`, `#latWin`, `#lat`, `#ticks`
- `#engineering`, `#specs`
- section `[aria-labelledby="cap-h"]`

**Flow, classes:** all classes present in `reference/flow.html` and its script, including the state classes:
- calendar: `pending`, `pending-del`, `cand`, `flash`, `gone`, `new`, `short`, `prot`, `rewinding`;
- proposal ghosts: `ghost`, `trail`;
- page: `stuck`, `in`.

**Flow, state attributes:**
- `#cmd[data-step=1..4]`
- `.stage[data-s=idle|active|done|blocked|failed]`
- `#days[data-active=0|1]`
- `aria-pressed` on chips and day heads.

**Leu, ids:**
- `main#main`, `#sentinel`, `#pnav`
- `#overview`, `#try`, `#reader`, `#passages`, `psg-p1..p3`, `#trace`, `#trace-h`, `#clearTrace`, `#traceNote`
- `#source`, `#xview`, `#xnotes`
- `#architecture`, `#steps`, `#dstages`, `#chainGraph`, `#stripLabel`, `#stripBars`
- tabs `#t-early`, `#t-v36`, `#t-v37` with panels `#p-early`, `#p-v36`, `#p-v37`
- `#results`, `#perf`, `#native`
- `#engineering`, `#invs`, `#mt0..5`, `#mp0..5`
- `#closePaper`, `#summary`, `#closeGraph`
- sections `[aria-labelledby="who-h"]` and `[aria-labelledby="close-h"]`

**Leu, state hooks:**
- `.node.on`, `.dst.on`, `.dst.cur`, `.graph.drawn`, `.graph.focus`, `.hl`, `#perf.on`, `.psg.flash`
- `[aria-pressed]`, `[aria-checked]`, `[aria-selected]`, `hidden` on panels
- `--prog` on `#dstages`, `--p` on perf bars

### 3.3 Fonts (decision point)

The reference loads `reference/fonts/fonts.css`. It declares:
- **Figtree:** variable, weight 300 to 900, normal and italic, latin and latin-ext.
- **Source Serif 4:** variable with the opsz axis, weight 200 to 900, normal, latin and latin-ext.

Both come from `@fontsource-variable/figtree@5.3.0` and `@fontsource-variable/source-serif-4@5.3.0`, using the family names `Figtree` and `Source Serif 4`.

Check how the site loads Figtree today (`src/app.html`, `src/app.css`, `package.json`):
- **The same variable files are already in use:** reuse them and add Source Serif 4 the same way.
- **Static weights or Google Fonts are in use:** glyph rendering will differ and parity will fail. **Stop and report.** Offer two options:
  - (a) move the site to the pinned variable files (preferred: one font source);
  - (b) give the case-study pages their own family name (for example `Figtree CS`), changed identically in `reference/*.html` and the implementation.

  Do not silently change site-wide font loading.

Characters outside the pinned latin ranges fall back to system fonts in both pages, so parity is unaffected: `→`, `✓`, `✕`, `²`, `°`, `¶`. Do not "fix" this.

### 3.4 CSS port and scoping (decision point)

Copy each reference `<style>` block into `flow.css` and `leu.css` **verbatim and in the same order**. It has several deliberate layers that override earlier rules, some with `!important`:
- base;
- `/* portfolio identity */`;
- `/* flow on portfolio palette */` or `/* leu on portfolio palette */`;
- `/* taste audit */`;
- (Leu) `/* diagrams v2 */`.

Do not merge or reorder these layers until parity is green.

Scope it so nothing leaks into other routes:
- **Root wrapper:** wrap each page in a root element: `<div class="cs-flow">` and `<div class="cs-leu">`. Prefix every selector with it, for example with `postcss-prefix-selector`.
- **`:root` token blocks** become `.cs-flow` and `.cs-leu`.
- **`body` rules move onto the wrapper:**
  - `margin`, `background`, `color`, `font`, `-webkit-font-smoothing`;
  - `overflow-x:hidden` becomes **`overflow-x:clip`** on the wrapper. `hidden` on a non-body ancestor creates a scroll container, and that breaks `position:sticky` for `.pnav`, `.diagram`, `.md-panel` and `.strip`.
- **`html` rules** apply only while the page is mounted, via `:global(html:has(.cs-flow))` (or the Leu equivalent):
  - `scroll-padding-top:calc(env(safe-area-inset-top,0px) + 72px)`;
  - `scroll-behavior:smooth`;
  - background Paper.
- **`@keyframes`** (`ghostIn`, `trail`, `wv`, `flash`): prefix the names (`cs-flow-ghostIn`, etc.) and update their uses.
- **Global base styles:** check the site's base styles (`a`, `button`, `h1`-`h3`, `p`, `dl`, `ol`, `table` margins, `box-sizing`, focus outlines). The reference assumes browser defaults plus its own rules. Any base rule from `app.css` that reaches these pages must be neutralised inside the wrapper; the parity diff will show you where.
- **`:focus-visible` and `::selection`** rules are part of the design. Keep them, scoped.

### 3.5 Tokens

These are the site's real tokens (from `src/app.css`, portfolio branch). Map to the existing CSS variables; do not create duplicates with different values.

| Token | Hex | Role on these pages |
|---|---|---|
| Paper | `#EFF3E3` | page background, track backgrounds, label pill fill, Leu sheet |
| Ink | `#0B2B22` | primary text, headlines |
| Forest | `#12372D` | user bubbles, done steps, protected events, dark tiles, body copy in stories |
| Plum | `#610D3D` | buttons, focus ring, selection, current step, ambiguity lines, "does not drive" edge, decider node |
| Sage | `#E4EAD3` | frames (`.frame`), assistant bubbles, active nav pill, Leu diagram panel |
| Ivory | `#FAF7ED` | windows, cards, document paper, text on Plum and Forest |
| Rule | `#9FAE9B` | dividers (often at 0.55 alpha), graph edges, rails |
| Muted | `#506353` | secondary text |
| Highlight | `#E2EDBA` | target highlights, check pills, active day, Leu judgement card, "passes on" chips |

**Supporting colours, page-scoped:** they exist only on these two pages, with exactly these values:

| Name | Value | Use |
|---|---|---|
| Plum tint | `#F1E3E8` | waiting-on-you states, constraint highlight, negative edge label |
| Plum wash | `#F6EEF0` | Leu nav and hover washes |
| Fail | `#8F2D2D` | failure text and borders |
| Fail tint | `#F2DEDB` | failure backgrounds |
| Amber | `#7A5410` | weak reasoning (Leu) |
| Amber tint | `#F0E6C8` | weak reasoning fill |
| Anchor tint | `#D5E0C6` | Flow time-anchor token highlight |
| Credit green | `#24603A` | credited state (Leu) |
| Peach tint | `#F3F6E1` | selected passage fill (Leu) |

**Shadows** are always tinted Ink:
- `--shadow: 0 1px 2px rgba(11,43,34,.06), 0 14px 34px -14px rgba(11,43,34,.22)`;
- graph nodes use `drop-shadow(0 6px 10px rgba(11,43,34,.08))`.

**Easing:**
- `--ease: cubic-bezier(.2,0,0,1)`;
- `--rewind: cubic-bezier(.65,0,.35,1)`.

**Theme:** light only. `color-scheme: light`, and no `prefers-color-scheme` rules. This is the owner's explicit requirement.

### 3.6 Type

There is one family for UI and headings: **Figtree**. The document text inside Leu's paper is **Source Serif 4**, because it represents a PDF page. Monospace (`ui-monospace, "SF Mono", Menlo, Consolas, monospace`) is used only for:
- Flow stage outputs, verb tags and proposal ids;
- Leu document running heads, passage ids, raw extraction and block ids.

Key scale (desktop 1440; the clamps in the CSS produce the other sizes):

| Element | Size / line-height | Weight | Tracking |
|---|---|---|---|
| Hero h1 | `clamp(44px,5.8vw,84px)` / 1 (83.52px at 1440) | 800 | -0.045em |
| Section h2 (`.head h2`) | `clamp(32px,3.6vw,52px)` | 800 | -0.045em |
| Flow command sentence | `clamp(26px,3.6vw,52px)` / 1.18 | 700 | -0.035em |
| Tile h3 | `clamp(26px,2.4vw,34px)` / 1.08 | 800 | -0.045em |
| Story h3 | `clamp(26px,2.6vw,36px)` / 1.08 | 800 | -0.04em |
| Stat number (Flow) | `clamp(44px,5.2vw,76px)` | 800 | -0.045em |
| Leu tile number `.hn` | `clamp(36px,3.8vw,56px)` | 800 | -0.045em |
| Hero sub | `clamp(18px,1.6vw,21px)` / 1.5 | 400 | 0 |
| Body | 17px / 1.6 | 400 | 0 |
| Kicker | 15px | 600, Plum | 0 |

`MEASUREMENTS.md` lists every measured element. Headings use `text-wrap:balance`; `p`, `dd` and `li` use `text-wrap:pretty`. Keep both: they change line breaks.

### 3.7 Layout

- **Container (`.wrap`):** `width:min(1312px, 100% - clamp(32px,6vw,96px))`, centred.
- **Shape scale:**

  | Element | Radius |
  |---|---|
  | frames | `clamp(20px,3vw,36px)` |
  | windows | `clamp(16px,2vw,24px)` |
  | tiles | 28px |
  | cards and panels | 24px or 28px (as in the CSS) |
  | events | 10px |
  | stage pre | 10px |
  | buttons and pills | 999px |

- **Breakpoints:**
  - **Flow:** 1180 (demo becomes 2 columns, rail becomes a horizontal stage strip), 960 (bento 2 columns), 900 (sub-nav links hidden; ops stack), 860, 760, 720 (demo single column, single day with day tabs, idle stages hidden, `--calh` 600px), 640 (timeline becomes a list), 600 (bento 1 column).
  - **Leu:** 960 (reader stacks), 900 (chain becomes a sticky strip with inline graph; versions stack), 860 (engineering stacks), 760, 700, 600.

---

## 4. Flow page, section by section

The reference is authoritative for copy; it is not repeated here. Section order:
1. Product nav
2. Hero
3. Command frame
4. Capability bento
5. Walkthrough
6. Latency
7. Engineering
8. Specs
9. Next project

### 4.1 Product nav (`.pnav`)

- **Layout:** sticky at `top: env(safe-area-inset-top)`, height 64px. Order: product name (`.pname`, 24px 800), links, then the "Try it" pill on the right.
- **Links:** Overview, Latency, Engineering, Specs.
  - Current section: `aria-current="true"`, set by an IntersectionObserver with `rootMargin:-35% 0px -60% 0px`.
  - Current pill: Sage background.
- **Stuck state:** `.stuck` adds a 1px bottom border once `#sentinel` leaves the viewport.
- **Below 900px:** links hidden.

### 4.2 Hero

- **Alignment:** left-aligned. Kicker, then h1 (max 19ch, two lines at desktop), sub (max 44ch), then CTAs.
- **CTAs:** a Plum "Try it" pill plus an underlined Plum text link, "How it's built" (`.tlink`, 1.5px underline, offset 4px, thickening to 2.5px on hover).
- **Padding:** top `clamp(40px,6vw,88px)`, bottom `clamp(28px,3vw,44px)`.

### 4.3 Command frame (`#cmd`)

- **Containers:** Sage frame, Ivory window. Header row: tag text plus a Replay pill (Sage).
- **Sentence:** five token spans with highlight sweeps:
  - targets: Highlight `#E2EDBA`;
  - anchors: `#D5E0C6`;
  - the keep constraint: Plum tint.

  Each sweep is `background-size 0%→100%`, 0.7s `--ease`. Anchor and keep sweeps are delayed by 0.18s and 0.36s.
- **Operations:** three operation cards (`.op`), each with:
  - a mono verb tag (Highlight/Forest, keep in Plum tint/Plum);
  - name, 24px 700;
  - relation line in Muted;
  - result in 600 tabular figures. The results are computed by the engine from the seed: `10:00-11:00 → 13:15-14:15` and `14:30-15:30 → 15:00-16:00`.
- **Checks:** three pills.
- **Timeline (`#tl`):** 8:00-21:00, labels every 2 hours.
  - Bars: Sage-backed with a Rule left inset.
  - The protected Gym bar is Forest with Ivory text.
  - Ghost bars sit below in Highlight with a 1.5px Forest outline and slide in from -16px.
  - Below 640px the timeline becomes `#tlList`.
- **Sequence** (`playHero`): `data-step` is set to 1, 2, 3, 4 at 350, 1100, 1850 and 2600 ms.
  - step ≥1: token sweeps;
  - step ≥2: operation cards fade and rise 10px, staggered 0.1s;
  - step ≥3: checks fade;
  - step 4: ghosts slide in and the original bars fade to 0.35.
- **Replay** restarts from no step. Under reduced motion `data-step="4"` is set immediately.

### 4.4 Capability bento

- **Grid:** six columns, 16px gap. Tiles in this order:

  | Tile | Span | Fill |
  |---|---|---|
  | It asks which one | 4 | Sage |
  | Protected stays protected | 2 | Forest, Ivory text, Ivory button with Plum text |
  | It catches conflicts | 2 | Plum tint |
  | All or nothing | 4 | Highlight |
  | "Yes" means the latest yes | 6 (horizontal: h3, text, button on the right) | Ivory, inset Rule line |

- **Tile buttons:** carry `data-run`. They scroll to `#try`, then start that scenario after 500 ms (0 ms reduced motion), unless the demo is busy.
- **Below breakpoints:** 2 columns below 960px, 1 column below 600px.

### 4.5 Walkthrough (`#try` > `#demoStage`)

The frame has no padding and the window fills it. The demo is a three-column grid:
- **Desktop:** `minmax(260px,.95fr) minmax(0,1.45fr) minmax(250px,.9fr)` for talk, calendar and rail.
- **Below 1180px:** talk and calendar, with the rail as a full-width horizontal 9-column strip (min 150px each, scrolls).
- **Below 720px:** a single column. Only the active day is shown; the day heads act as tabs. Idle stages are hidden.

**Conversation:**
- **Chips:** Compound, Clean, Ambiguous, Conflict, Protected, Exclusion, Correction. Accessible name is `"<Label>: <utterance>"`. The pressed chip is Plum.
- **Fail toggle:** a switch (34x20; a 16px knob moves 14px; checked is Plum).
- **Log:** user bubbles are Forest/Ivory with radius 18/18/6/18; assistant bubbles are Sage with radius 18/18/18/6. Proposal ids are mono pills (Highlight/Forest). Stale proposals are struck through at 0.55 opacity.
- **Replies:** pills. Primary is Plum; destructive is outlined in Plum.
- **Tools:** Undo, Redo, What changed?, Reset day.

**Calendar:**
- **Columns:** 40px hours column plus two day columns.
- **Day heads:** buttons; the active head is Highlight with "Active context" text.
- **Tracks:** Paper background, radius 14, hour lines.
- **Events:** absolutely positioned at `top:0`, with `height: calc(var(--h) * var(--calh) - 2px)` and `transform: translateY(calc(var(--t) * var(--calh)))`, where:
  - `--t = (start − 480) / 780`;
  - `--h = duration / 780`;
  - `--calh` is 720px, or 600px at ≤720px.
- **Event styles:**
  - events of 30 minutes or less get `short` (single line, 12px);
  - protected events are Forest with Ivory text and an inline "Protected" label;
  - pending events sit at 0.4 opacity;
  - pending deletes get a 1.5px Fail outline, struck-through Fail title and a `P#` prefix.
- **Ghosts** (proposals): Highlight fill, 1.5px dashed Forest border, text `P# · Title`.
- **Now line:** Plum, at 09:10 on Today.

**Pipeline rail:**
- **Stages:** 1 Normalize, 2 Interpret, 3 Actions, selectors, constraints, 4 Resolve references, 5 Transform draft, 6 Validate invariants, then the gate (diamond) "Proposal and confirmation", 7 Atomic commit, 8 Render, persist, verify.
- **Number circle (24px) colours:**

  | State | Circle |
  |---|---|
  | idle | Paper |
  | active | Highlight with a 4px halo |
  | done | Forest with Ivory number |
  | blocked | Plum tint with Plum number |
  | failed | Fail tint with Fail number |

- **Output:** a mono `pre` on Paper (blocked: Plum tint/Plum; failed: Fail tint/Fail).
- **Note below:** "Illustrative model of Flow's pipeline." Keep it.

### 4.6 Latency (`#latency`)

- **Stat tiles:** two tiles side by side:
  - Highlight, number in Forest: `42.1 ms`;
  - Forest, number in Ivory: `1.578 s`.
- **Window:** a segmented control ("What the screen does" / "What the conversation does"), then rows.

| Row | Value | Statistic | Group |
|---|---|---|---|
| Wake handler to Chromium paint | 42.1 ms | median, p95 65.7 ms marker | ui |
| Earlier wake first-paint | 227.1 ms | single observation | ui |
| STT decoder initialisation | 841 ms | approx. | talk |
| STT drain | 1578 ms | approx. | talk |
| Final transcript to response | 223 ms | approx. | talk |
| TTS scheduling | 1049 ms | p50 | talk |

- **Scales:** "screen" mode shows ui rows on 0-250 ms (ticks every 50). "conversation" mode shows all rows on 0-1700 ms (ticks every 400).
- **Bars:** `transform: scaleX(p/100)` from the left over 0.8s `--ease`. UI bars are Forest; talk bars are Plum.
- **Value labels:** positioned with container units, `translateX(calc(p * 1cqw + 10px))`. Above 70% they sit inside the bar (`.in`, Ivory).
- **Markers:** the p95 marker is a 2px dotted line. The 100 ms target is a 1.5px dashed Plum line, labelled.

Do not add rows together anywhere. The caption under the chart states this.

### 4.7 Engineering (`#engineering`)

- **Early path:** muted, struck through, left-aligned.
- **Pipeline strip:** eight columns; each has a 2px Rule top border, a 26px Muted number and a 14.5px 600 label. "Atomic commit" uses a Plum border, number and label. Four columns below 1000px, two below 520px.
- **Quote:** left-aligned, `clamp(19px,1.6vw,23px)` 500.
- **One story** (the scheduling investigation only):
  - two columns, `minmax(0,1fr) minmax(0,1.35fr)`;
  - left: h3 plus an italic Muted utterance;
  - right: a `dl` grid of 110px labels (Plum, 700, 14.5px) and Forest text;
  - stacks below 860px.

### 4.8 Specs (`#specs`)

- **Layout:** two columns, `1.1fr / 1fr`.
- **Left:** a Forest panel (radius 28) with a 2-column grid of verification figures (800 weight `clamp(30px,3vw,44px)`, labels in Ivory at 78%).
- **Right:** grouped facts (h3 16px 700 plus Forest paragraph).
- Stacks below 860px.

### 4.9 Next project

A top rule, the label "Next project" and a link "Leu" (800, `clamp(34px,4vw,56px)`), Plum on hover.

---

## 5. Flow behaviour contract

Port `engine.ts` as pure functions with unit tests (Vitest), then wire the orchestration exactly.

### 5.1 Data

**Seed** (minutes from midnight; day 0 = Today, 1 = Tomorrow):

| id | Title | Day | Start-end | Kind | Protected |
|---|---|---|---|---|---|
| standup | Standup | 0 | 09:30-09:45 | meeting | |
| review | Design review | 0 | 10:00-11:00 | meeting | |
| sarah | 1:1 with Sarah | 0 | 11:15-11:45 | meeting | |
| lunch0 | Lunch | 0 | 12:30-13:15 | meal | |
| planning | Q3 planning | 0 | 14:30-15:30 | meeting | |
| dentist | Dentist | 0 | 16:30-17:15 | appointment | |
| gym | Gym | 0 | 18:00-19:00 | personal | yes |
| flight | Flight BER → LIS | 1 | 08:10-10:40 | travel | yes |
| lunch1 | Lunch | 1 | 13:00-13:45 | meal | |
| dinner | Dinner with Ana | 1 | 19:30-21:00 | personal | |

**View:** 08:00 to 21:00. Day bounds for validation are 07:00 to 22:00. Times render as `HH:MM-HH:MM` with a hyphen; there are no en dashes anywhere.

**Scenarios:** copy them verbatim from the reference: `key`, `label`, `say`, `norm`, `intent`, `ops`, plus `phrase` for Ambiguous and `correction` for Correction. Interpretation (normalize, interpret, actions) is scripted per scenario. Everything after that is computed.

### 5.2 Resolution rules (`lookup`)

1. A bound id (from a clarification) wins.
2. If a same-day anchor is required, search that day only ("same day as target").
3. If a correction set `dayOverride`, search that day ("Tomorrow, from correction").
4. Otherwise search the active day ("Today, active day"). If nothing is found there, search all days ("not on active day, searched all days").

- Zero matches: "I can't find anything matching …".
- More than one match: clarification. Draw candidate lines; the replies are candidates plus "Never mind".

### 5.3 Transform and validate

- **Transform:**
  - Clone the document and apply operations in order: move keeps duration; shift by minutes; resize sets end; delete. Keep constraints are skipped.
  - With the fail toggle on, the **second mutating operation** throws `Operation 2 (<kind> <title>) failed`. The draft is discarded and nothing changes.
  - Changes are merged per id.
- **Validate, in this order:**
  1. a kept event changed → reject;
  2. protected events changed without approval → `protected`;
  3. outside the day bounds → reject;
  4. overlap with another event on the same day (strict inequality) → `conflict`;
  5. otherwise `ok`, with checks (`no overlaps`, `<kept> unchanged`, `<protected> approved`).
- **Conflict replies:**
  - "Shorten to HH:MM-HH:MM" is offered only when the clash starts after the change starts and the gap is at least 15 minutes. It appends a resize to the clash start.
  - "Leave it" is always offered.
- **Protected replies:**
  - When the request has other changes: "Leave <name> in place" (primary) plus "Approve changing <name>" (destructive).
  - Otherwise: "Approve deleting <name>" plus "Cancel".

### 5.4 Proposal, confirmation and history

- **Proposals:** each successful validation creates proposal `P<n>`, with `n` incrementing for the life of the page until reset. The rail gate shows `P<n> · k change(s)` and "awaiting confirmation".
- **Replies:** "Yes" and "Cancel", plus "No, I meant tomorrow" (or "today") for the Correction scenario before a correction.
- **Correction:**
  - marks the old `P` messages stale and logs `P<n> superseded. A “yes” now binds to the next proposal only`;
  - adds `+ date:tomorrow (correction)` to stage 3;
  - re-runs from stage 4.
- **Confirm:**
  - only applies the current `pid`, otherwise logs "That approval belonged to a proposal that no longer exists. Nothing changed.";
  - then: commit (stage 7), render, then verify that every change matches the document (stage 8: `revision N · verified against proposal`).
- **Undo/redo:** move whole history entries, with the rewind visual (`.cal.rewinding` for 650 ms, plus trails). "What changed?" lists the last three entries, newest first.
- **Shortcut:** Ctrl/Cmd+Z undoes and Shift+Ctrl/Cmd+Z redoes, only while focus is inside `#demo`.
- **New command while a proposal is pending:** logs `P<n> dropped. A new request replaced it.`
- **Reset day:** restores the seed, clears history, sets pid to 0 and resets the log.
- **Active day:** clicking a day head sets the active context, which changes how references resolve. On mobile it is also the visible day.

---

## 6. Diagrams and visuals, exact construction

### 6.1 Flow hero timeline

`left = (start − 480) / 780 · 100%`, `width = duration / 780 · 100%`. Ghost bars use the post-change times. Hour labels sit at 08, 10 … 20.

### 6.2 Flow calendar

See 4.5. The hours column labels are 08-21 at `topPct(h)`, translated −50% vertically. Hour lines are at the same positions.

### 6.3 Flow pipeline strip

Eight equal columns, 16px column gap, no fills except the Plum commit.

### 6.4 Flow ambiguity lines (`#lines`)

The SVG covers `#demo`. Let `mark` be the `<mark>` in the latest user bubble and `bub` its bubble.

- Start point: `x1 = max(mark.right, bub.right) − demo.left`, `y1 = mark.centreY − demo.top`.
- For each visible candidate event: `x2 = ev.left − demo.left`, `y2 = ev.centreY − demo.top`.
- If `x2 < x1 + 20` (stacked layout, mobile):
  `M markCentreX,markBottom C markCentreX,(y1+y2)/2 ev.left+20,(y1+y2)/2 ev.left+20,ev.top`.
- Otherwise:
  `M x1+4,y1 C (x1+x2)/2,y1 (x1+x2)/2,y2 x2−2,y2`.
- Stroke: 1.5px Plum, dash 4 4, no fill. Candidates also get `.cand` (2px Plum inset).

### 6.5 Flow latency chart

See 4.6.

### 6.6 Leu document paper

- **Paper:** Ivory, radius `clamp(16px,2vw,24px)`, padding `clamp(24px,3.6vw,52px)`.
- **Running head:** mono 12px, "Earth Science Notes" / "p. 12".
- **h3:** Figtree 700 `clamp(26px,2.4vw,34px)`, −0.035em.
- **Passages:** buttons in Source Serif 4, `clamp(17px,1.3vw,19.5px)` / 1.62, with a mono `¶n` id above.
  - hover: Plum wash;
  - selected (`aria-pressed`): Peach tint fill, 1.5px Rule ring, lift `translateY(-2px)` over 0.35s.
- **Table:** "Earth to Sun distance": Early January 147.1 million km, Early July 152.1 million km. Rows have a top rule; the right column uses tabular figures at 600.

### 6.7 Leu trace

- **Sheet:** Paper with a 1px Rule ring.
- **Header:** centred title plus an Ivory "Clear" pill.
- **Seven nodes:** Source passage, Concepts and claims, Relationship, Learning activity, Learner response, Judgement, Learner state.
  - Number circles are 26px; on: Plum/Ivory.
  - A 2px rail connects them; a Plum ribbon grows `scaleY` 0→1 over 0.5s when a node turns on.
  - Content unfolds via `grid-template-rows 0fr→1fr` over 0.5s.
- **Judgement:** a Highlight card with a grid of Muted labels and serif values, a check list (✓ Credit green / ✕ Fail), and the verdict:

  | Verdict | Text | Colour |
  |---|---|---|
  | credit | "Credit. Evidence recorded." | Credit green |
  | ask | "Ask a follow-up. No mastery." | Amber |
  | none | "No credit. Return to the passage." | Fail |

- **Learner state:** an Ivory list of `concept → old state → new state`.
- **Show source:** every node has a "Show source" button that flashes the passage (1.2s keyframe from Highlight to Peach tint), scrolls it to centre and focuses it.

### 6.8 Leu extraction comparison

- **Control:** a segmented radiogroup (Ivory track, Plum checked) with arrow-key wrap.
- **Views:**
  - **"What you see":** a mini page with a letter-spaced label (11.5px, 0.42em), running head, h4 and two serif columns.
  - **"What extraction returned":** a mono `pre` with Fail-tint `mark`s and numbered Fail badges 1-4. Its four notes have numbered Fail circles.
  - **"Canonical source":** a block list with mono ids (`p12·label` and so on), excluded rows struck through.

### 6.9 Leu dependency chain

- **Desktop:** two columns (steps / sticky diagram at `top:12vh`).
  - Each step has a minimum height of 62vh (the first 40vh) and is centred.
  - An IntersectionObserver with `rootMargin:-45% 0px -45% 0px` sets the current index.
- **Diagram panel:** Sage, radius 32. An ordered list of seven stages on a rail:
  - Rail: a 2px Rule line at x=17, `top/bottom: 30px`, opacity 0.55. A Plum overlay line uses `transform: scaleY(var(--prog))`, with `--prog = i / 6`, over 0.6s.
  - Stage circles (36px): upcoming are Sage with a 1.5px Rule ring; passed are Forest/Ivory; current is Plum/Ivory with a 6px `rgba(97,13,61,.14)` halo.
  - The current stage row becomes an Ivory card (radius 18, `--shadow`).
  - Names are 800 `clamp(17px,1.5vw,20px)`: Muted, then Ink when passed, Plum when current.
  - Passed stages show a Highlight chip, "Passes on **<output>**":

    | Stage | Passes on |
    |---|---|
    | PDF | glyphs with positions |
    | Canonical source | passages with stable ids |
    | Concepts and claims | a typed concept graph |
    | Questions | one learning activity |
    | Learner response | a conclusion and its reason |
    | Judgement | credit, a follow-up or a rejection |
    | Learner memory | evidence per concept |

  - Stage 3 holds the concept graph; its container unfolds via grid rows. The graph gets `.drawn` when the current index reaches 2 or more.
- **Below 900px:** the diagram is hidden. A sticky strip at `top:64px` shows the stage name plus seven 4px bars, and the graph renders inline in step 3 (`.inline-graph`).

### 6.10 Leu concept graph (`svg.graph`, viewBox `0 0 520 462`)

One pure layout function, used three times: chain, mobile inline, closing.

**Nodes** (centre x, y; size 172x54; radius 16):

| Key | Label | Centre | Source |
|---|---|---|---|
| tilt | axial tilt | 180, 50 | ¶1 |
| distance | orbital distance | 430, 50 | ¶3 |
| angle | sun angle | 100, 172 | ¶2 |
| daylength | day length | 300, 172 | ¶2 |
| energy | energy per m² | 200, 294 | ¶2 |
| seasons | seasons | 200, 408 | ¶1 |

- **Node text:**
  - Line 1: label, Figtree 700 15px Ink, at y−2, centred.
  - Line 2: `from ¶n`, plus ` · <state>` once studied. Figtree 500 11.5px Muted, at y+16.
- **Node accessibility:** `<g class="node <state>" data-k tabindex="0" role="img" aria-label="<label>, <line 2>">`.
- **Node states:**

  | State | Fill | Stroke |
  |---|---|---|
  | unseen | Ivory | Rule 1.3 |
  | evidence | Highlight | Credit green 2 |
  | weak | Amber tint | Amber 2, dash 5 3 |
  | missed | Fail tint | Fail 2 |

  Focus-visible: Plum 2.6 stroke.

**Edges** (in this order; `--i` is the index):

| # | From → To | Label | Target x offset |
|---|---|---|---|
| 0 | tilt → angle | changes | 0 |
| 1 | tilt → daylength | changes | 0 |
| 2 | angle → energy | concentrates | −22 |
| 3 | daylength → energy | adds hours to | +22 |
| 4 | energy → seasons | drives | 0 |
| 5 | distance → seasons | does not drive (negative) | n/a |

- **Normal edge:** from `(A.x, A.y+27)` to `(B.x+offset, B.y−30)`, with `cy` the mid y:
  `M x0,y0 C x0,cy x3,cy x3,y3`. The label centre is `((x0+x3)/2, cy)`.
- **Negative edge:** from `(430, 77)` to `(290, 408)` (seasons right edge + 4):
  `M x0,y0 C x0,y0+253 x3+128,y3 x3,y3`. The label centre is the cubic midpoint `((x0+3x0+3(x3+128)+x3)/8, (y0+3(y0+253)+3y3+y3)/8)`.
- **Label pill:** width `chars × 6.9 + 18`, height 22, radius 11, filled with the surface behind it (`--gbg`):

  | Context | `--gbg` |
  |---|---|
  | page | Paper |
  | diagram panel | Sage |
  | current chain card | Ivory |

  Text is 600 12px Forest. The negative pill is Plum tint with Plum text.
- **Strokes:** normal edges are 1.8px Rule. The negative edge is Plum, `stroke-dasharray .016 .012` with `pathLength=1`.
- **Arrowheads:** markers `viewBox 0 0 10 10`, path `M0,0 L10,5 L0,10 z`, `refX 9 refY 5`, size 7, `orient auto-start-reverse`. Rule-filled, or Plum for the negative edge. Marker ids are unique per SVG (`g0-ah`, `g0-ahn`, …).
- **Draw-in** (when `.drawn` is added):
  - normal edges: `stroke-dasharray:1; stroke-dashoffset 1→0` over 0.9s `--ease`, delay `i × 0.12s`, opacity 0→1 over 0.2s;
  - negative edge: fades in over 0.5s after 0.9s;
  - labels: fade over 0.4s after `0.45s + i × 0.12s`.

  Closing and inline graphs get `.drawn` from an IntersectionObserver (threshold 0.3); the chain graph from `setChain`.
- **Focus and hover:** on hover or focus of a node, the SVG gets `.focus`.
  - That node, its edges and its neighbours get `.hl`; everything else drops to opacity 0.18.
  - Highlighted normal edges turn Forest. Removing focus or hover clears this.
- **Re-render:** the graph re-renders whenever the learner model changes. Re-wire the listeners; keep `.drawn` on the SVG element.

### 6.11 Leu version comparison

- **Tabs:** a pill tablist (Ivory track, Plum selected) with arrow keys, Home and End. The tablist is left-aligned. It is a horizontal scroller on narrow viewports.
- **Panels:** two Ivory cards (radius 24, `--shadow`); they stack below 900px.
- **Pipelines (`.flowline`):** vertical. Each node is a rounded 12px box:
  - default: Paper fill with a Rule ring, 700 14px label plus an inline 600 11.5px Muted note;
  - the decider (`.auth`): Plum with Ivory text;
  - the gate (`.gate`): Highlight.
  - Connectors are 2px x 12px Rule lines with 6px arrowheads, 22px row gap.

  | Version | Pipeline (decider in **bold**) |
  |---|---|
  | Early | PDF text → **Heuristics** (holds the authority) → Question |
  | V36 | PDF → **Semantic / vector logic** (sets correctness) → Judge |
  | V37 | Canonical source → Structured read (proposes) → *Deterministic checks* (can only downgrade, gate) → **Judge** (decides) → Learner model |

- **V37 metrics:** a 2x2 grid of Paper tiles: 75%, 91.4%, 2/58, 3/80.
- **Cases:** labelled as examples. The judgement card is Highlight.

### 6.12 Leu results bento (`#perf`)

- **Row 1, two span-3 tiles:**
  - Forest: `25.90 s → 2.03 s`;
  - Highlight: `10.34 s → 64 ms`.
- **Bars:** each tile has before/after bars:
  - before is full width (Forest tile: Ivory at 22%; Highlight tile: Ink at 14%);
  - after is `scaleX(w/100)` with `w = 7.84` and `0.62` (Highlight on Forest, Plum on Highlight).
  - Bars animate when `#perf` intersects at 0.35: 1.1s `--ease`. Value labels appear at opacity 1 after 0.5s.
- **Row 2:** `2/58` (span 4) and `0/16` (span 2), both Ivory tiles with a Rule ring.
- **Below breakpoints:** span 2 below 960px, 1 column below 600px.

### 6.13 Leu native recordings (`#native`)

Two Sage figures. The caption comes first (800 title plus Forest line), then a slot (Paper, top radius 28, height `clamp(380px,46vw,620px)`) with placeholder text.

Keep the placeholder for parity. Swapping in the authentic Simulator videos is a separate follow-up task: when you do it, mask `.slot` in the parity spec, and never put device frames around web content.

### 6.14 Leu engineering (`#invs`)

- **Layout:** master-detail, `.85fr / 1.15fr`.
- **Left:** a vertical tablist of six titles (700 `clamp(17px,1.4vw,20px)`, Muted; selected is Ink, indented 18px with a 3px Plum bar). Arrow keys in all four directions.
- **Right:** a sticky Sage panel (`top:96px`, radius 28) with h3 plus a `dl` (Plum `dt`, Forest `dd`).
- Stacks below 860px, where the panel is not sticky.

### 6.15 Leu closing

- **Layout:** two columns.
- **Left:** the paper again. Passages render as tinted blocks by result: Highlight (credited), Amber tint (weak) or Fail tint (not credited).
- **Right:** a left-aligned head, the computed summary, the graph and a state legend.
- **Summary text** (exact):
  - before any answer: "Nothing has been recorded yet. Select a passage at the top of the page and answer it, and this graph will change while the page stays the same.";
  - after answers: "You answered on N of 3 passages: a credited, b with weak reasoning, c not credited. Leu would route the next study session from this, and every entry still points at its passage."

---

## 7. Leu content and state contract

- **Content:** `CONCEPTS`, `PASSAGES` (3 passages × 3 answers, each with read, checks and verdict), `VERDICT`, `STATE_LABEL`, `XV`, `STAGES` and `INV`. Copy them verbatim from the reference script. The subject is "Why seasons happen".
  - Nothing on the page refers to React or list keys. The behaviour test enforces this.
  - The facts are real: tilt 23.4°, perihelion in early January at about 147.1 million km, aphelion in early July at about 152.1 million km.
- **Answering:**
  - sets every concept of the passage to the verdict state (credit → evidence, ask → weak, none → missed);
  - records `passageResult[passage]`;
  - re-renders the judgement and state nodes, the closing paper, the summary and all graphs.
- **Selecting another passage** rebuilds the trace from scratch; the learner model persists.
- **Clear** resets the trace and selection only.

---

## 8. Motion spec

All motion is answering motion, except the one hero sequence and the scroll-linked chain. Everything is disabled under `prefers-reduced-motion: reduce`: a global rule sets durations and delays to 0, and JS waits become 0. Final states are reached immediately.

| What | Property | Duration | Easing | Delay / timing |
|---|---|---|---|---|
| Flow hero steps (JS) | `data-step` 1→4 | n/a | n/a | 350 ms, then every 750 ms |
| Token sweep | background-size | 0.7s | `--ease` | targets 0, anchors 0.18s, keep 0.36s |
| Operation cards | opacity, translateY 10px→0 | 0.5s | `--ease` | 0 / 0.1s / 0.2s |
| Checks | opacity | 0.5s | `--ease` | step 3 |
| Timeline ghost | opacity, translateX −16px→0 | 0.55s / 0.7s | `--ease` | step 4 |
| Pipeline stages (JS waits) | `data-s` | n/a | n/a | 1: 240, 2: 240, 3: 260, 4-6: 320 each, commit 300, verify 420 ms |
| Calendar event move | transform | 0.55s | `--ease` | n/a |
| Calendar rewind (undo/redo) | transform | 0.6s | `--rewind` | `.rewinding` held 650 ms |
| Trail | opacity 0.9→0 | 0.65s | ease-out | removed at 700 ms |
| Proposal ghost | opacity, scale .97→1 | 0.35s | `--ease` | on render |
| Event enter / leave | opacity | 0.35s | n/a | leave removes at 380 ms |
| Latency bars and labels | transform | 0.8s | `--ease` | on mode change |
| Buttons | transform, box-shadow, background | 0.2s | `--ease` | `:active` scale .98 |
| Tile launch (JS) | scroll then start | n/a | n/a | 500 ms |
| Leu passage lift | transform, box-shadow, background | 0.35s / 0.3s | `--ease` | n/a |
| Trace node unfold (JS) | `.on` | n/a | n/a | node k at k × 170 ms; judgement and state at 60 ms, then +170 ms |
| Trace ribbon | scaleY 0→1 | 0.5s | `--ease` | with node |
| Trace content | grid-template-rows | 0.5s | `--ease` | with node |
| Passage flash | keyframes | 1.2s | `--ease` | n/a |
| Chain progress line | scaleY | 0.6s | `--ease` | n/a |
| Chain stage colours | colour, background | 0.3-0.35s | n/a | n/a |
| Graph edges | stroke-dashoffset 1→0 | 0.9s | `--ease` | `i × 0.12s` |
| Graph negative edge | opacity | 0.5s | n/a | 0.9s |
| Graph labels | opacity | 0.4s | n/a | `0.45s + i × 0.12s` |
| Graph focus dim | opacity | 0.25s | n/a | n/a |
| Perf bars | transform | 1.1s | `--ease` | on intersect |
| Perf labels | opacity | 0.3s | n/a | 0.5s |
| Engineering tab | colour, padding-left | 0.2s / 0.3s | `--ease` | n/a |
| Smooth anchor scroll | `scroll-behavior` | browser | n/a | auto under reduced motion |

`motion.ts` asserts that the computed `transition` and `animation` of the listed elements equal the reference. The fake-clock tests assert the JS timings.

---

## 9. Accessibility contract

- **Skip link:** "Skip to content" is the first focusable element and targets `#main`.
- **Landmarks:** one `main`, a labelled product nav, and labelled sections.
- **Every control is a real button, radio or tab** with an accessible name:
  - Flow chips: `"<Label>: <utterance>"`;
  - Leu passages: `"¶n …"`;
  - graph nodes: `role="img"` with label and state.
- **Live regions:** Flow `#log` is `aria-live="polite"`; Leu `#xview` is `aria-live="polite"`.
- **Calendar:** each day track is `role="list"` labelled Today or Tomorrow. Each event is a `listitem` labelled `"<Title>, HH:MM-HH:MM[, protected]"`.
- **Keyboard patterns:**
  - radiogroup: Left/Right with wrap;
  - version tabs: Left/Right with wrap, Home, End;
  - engineering tabs: Up/Down/Left/Right with wrap;
  - Flow undo/redo: Ctrl/Cmd+Z and Shift+Ctrl/Cmd+Z inside `#demo`;
  - focus is never trapped.
- **Focus ring:** 2px Plum `:focus-visible` outline, offset 3px, on everything (graph nodes use the stroke instead).
- **Reduced motion:** complete, as in section 8.
- **Contrast:** all text pairs used meet WCAG AA. Do not lighten Muted or Rule-on-text pairs.
- **Language:** `lang="en"`; times use 24-hour `HH:MM`.

---

## 10. Definition of done

1. `/work/flow` and `/work/leu` are implemented in Svelte components as in 3.1. No HTML string injection is left except the SVG path data, which is generated by pure functions.
2. **All 75 parity tests: 0 differing pixels** at 1440, 1280, 1100, 820 and 390.
3. **All 21 behaviour and motion tests pass**, including fake-clock timing and computed-motion equality.
4. Engine unit tests (Vitest) cover:
   - `resolve`: active day, all-days fallback, same-day anchor, correction override, bound id, clarification, none;
   - `transform`: move keeps duration, shift, resize, delete, merge per id, fail on second mutation;
   - `validate`: keep violation, protected, bounds, conflict (strict overlap), ok checks.
5. No console errors or warnings on either page. No network requests other than the pinned font files.
6. No styles leak: the homepage and other `/work/*` pages are pixel-identical before and after the change. Add one full-page screenshot comparison per existing route, before and after.
7. Lighthouse accessibility is 100 on both routes. axe-core (`@axe-core/playwright`) reports no violations.
8. The global header and footer are unchanged. `PARITY_IMPL_HIDE` documents their selectors.
9. Nothing is pushed or deployed. The PR description lists:
   - the two decision points (fonts, CSS scoping) and what was chosen;
   - the parity run summary (counts per viewport);
   - any deliberate deviation. There should be none.

**If a test fails:** fix the implementation. Never edit the reference, thresholds, viewports or states to get green. The only exception is the font-family decision in 3.3, applied identically to both sides with sign-off.

---

## 11. Deliberate choices to preserve (do not "fix")

- **Light theme only;** no dark mode.
- **No em or en dashes in visible text.** Ranges use hyphens.
- **Only one small label above a heading per page** (the hero kicker). Section headings are left-aligned and stacked.
- **Single primary button plus a text link** in heroes. The same label ("Try it") is used for the same intent everywhere.
- **No fake product chrome:** no device frames, no fake voice dock, no hand-drawn mascot or logo marks.
- **Honest labels stay:**
  - "Illustrative model of Flow's pipeline.";
  - "A web model of Leu's loop with prepared answers. The native app is recorded further down.";
  - "Example …" on the version cases.
- **Statistics are shown separately and never summed.** Each keeps its own qualifier (median, p50, p95, approx., single observation).
- **Layout variety is intentional:** the asymmetric bento spans (4+2, 2+4, 6), Leu results (3+3, 4+2) and the master-detail engineering section.
