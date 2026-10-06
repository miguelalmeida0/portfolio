# Portfolio motion audit — 6 October 2026

## Authority and evidence

Production source: `.cache/leu-flow-pages`; starting product commit `914c8a4`.
Svelte 5.57 / SvelteKit 2.70; GSAP 3.15 is already installed but is not used by
the active route components. Existing motion is primarily WAAPI, CSS and scoped
requestAnimationFrame controllers. Keep their working state machines.

Inspected the actual local application at `127.0.0.1:4397`, all nine meaningful
routes at 1440×900 and 390×844. Captures and control inventories are in
`artifacts/motion/before`. This is the current four-card Selected Work layout,
not the obsolete mosaic/revamp components still present in source.

Browser interactions exercised before implementation: preview pause/resume;
Needle queries, inspector, graph compatibility/stale reply, image sizes, cache,
window and capture modes; F24 situation navigation, asynchronous states,
migration comparison/foundation, architecture tabs and offline save; Second
Voice voice/strength/rewrite, timeout/replay and share cancellation; Flow
proposal/confirmation, undo/redo, day change and latency comparison; Leu passage,
unsupported-reason answer, source return, extraction/version/engineering tabs;
Story audience toggle and all eight chapter navigation buttons; mobile menu.
CV and PDF viewer inspected as document surfaces. External destinations remain
real links and are not submitted to or changed during this audit.

No current standalone Decision Anatomy, avatar/3D scene, legal route or project
gallery overlay exists. F24 legal notices are part of its case study. Do not
resurrect obsolete components to manufacture animation opportunities.

Headless Playwright launch encountered macOS MachPort permission denial after an
initial smoke succeeded. Connected Chrome's Playwright controls remain usable.
A separate `motion-review/20261006` branch runs production-build before/after
surveys and acceptance checks on GitHub's Linux Chromium runner. Production main
is not changed while this evidence is being gathered. See MOTION_QA.md for final
status and measurement limits; do not interpret this audit as a performance pass.

## Priority matrix

| SECTION | CURRENT EXPERIENCE | PROBLEM | MOTION OPPORTUNITY | TRIGGER | GSAP/WEB PRIMITIVE | EXPECTED UX PAYOFF | PERFORMANCE RISK | MOBILE VERSION | REDUCED-MOTION VERSION | PRIORITY |
|---|---|---|---|---|---|---|---|---|---|---|
| First visit / introduction | Existing measured silhouette-to-portrait transfer, interruptible, session-scoped | Already distinctive; a second entrance would compete | Preserve; new hero ownership starts after its completion | Existing presentation completion | Existing WAAPI + mutation observation | Keep the established arrival and immediate escape | Avoid duplicate portrait transforms during transfer | Preserve existing shortened/interruptible path | Existing bypass | REJECT adding another intro |
| Hero portrait | Authentic cutout on a static sage field; wind headline already lives | Portrait has no relationship to precise pointer movement | Very small photographic depth with soft return; original crop/geometry remain authoritative | Fine pointer inside portrait, only while visible | quickTo, matchMedia, context | Immediate material response within the first viewport | Two transforms on one photographic layer; no new pointermove tweens | Static portrait; no hover emulation | Original image, no transforms | P1 |
| Wind typography | Subtle periodic pass + pointer response, observer/visibility suspension | Existing motion is purposeful; its policy ignores the site's manual Reduced setting | Preserve choreography; connect its enablement to the common policy | Preference change | Existing rAF, motionState | Consistent accessibility without another text effect | Existing per-glyph work, not increased | Existing static text | Static semantic heading | P1 policy only |
| Hero → Selected Work | Hard boundary followed by static heading and large photo | The first major change of subject has no choreography | Major title line aperture; photo crop resolves with scroll, without moving the section or copy | Viewport entry / natural scroll | SplitText masks, ScrollTrigger scrub | The forest chapter feels entered, not simply encountered | One image transform; bounded photo scale, no pin | Short title mask + smaller photo transform | All content immediately visible, static photo | P0 |
| F24 feature photo | Authentic static photograph links to case study | Largest still image lacks depth and attention response | Slow scroll-linked crop inside the fixed frame | Scroll | ScrollTrigger | Connect the production story to a physical artifact | No filters, no continuous layout reads | Scroll amplitude reduced, no pointer layer | Original crop | P1 |
| Four independent previews | Correct videos autoplay only when visible; explicit pause control | Surrounding frames and arrows do not acknowledge attention | Slight image-plane displacement within fixed link; title arrow answers focus and pointer | Hover/focus/press | quickTo, context | A collection of related work with distinct media, not four tilting boxes | Preserve media loading controller and decode budget | Press feedback; no perspective or hover | Color/focus response, no spatial movement | P1 |
| Needle search → inspector | Prepared results are useful; selection instantly replaces larger artwork | Identity disappears between thumbnail and inspection | Carry the selected artwork into the inspector using its measured rectangles | Explicit artwork selection | Flip.fit, transform-only temporary image layer | Explains which object moved from search to attention | One temporary layer; cancel rapid selections and route exits | Short local inspector settle; no cross-screen flight | Immediate original state update | P0 |
| Case-study chapter titles | Large well-typeset titles; every chapter arrives fully frozen | No punctuation between long stretches of evidence | Mask only major chapter lines once; no paragraph animations | First viewport approach, not every scroll reversal | SplitText autoSplit/onSplit + ScrollTrigger | Clear problem/decision/evidence beats without interfering with reading | Split only chapter headings; restore on unmount/preference/resize | Shorter, less stagger; no scrubbed text | Original unsplit headings | P0 |
| Case-study section navigation | Sticky navigation changes active pill abruptly | State says where, but not how chapters relate | Animate existing active surface between links; small truthful progress rule | Active chapter / native scroll | quickTo, ScrollTrigger | Continuous orientation across long evidence | One indicator; measured only when active target/size changes | Existing compact navigation retained; progress only, no scroll capture | Existing instant active pill; progress omitted, aria-current intact | P1 |
| Project → detail and next project | Native root View Transition; shared-media allowlist contains obsolete ghostwriter only | Current links get no object continuity | Share the project label with its case-study navigation name; use existing route owner | Ordinary internal navigation | Native View Transition, scoped names, shared tokens | Preserve project identity through route changes | No screenshot clones in JS; no extra route delay | Existing menu veil remains owner; simpler transition | Normal SvelteKit navigation | P1 |
| F24 situation/migration models | Timed situation story and spatial foundation chips already explain architecture | Adding ambient movement would obscure state | Leave state timelines and geometry alone | Existing explicit controls/autoplay | Existing WAAPI | Preserve already excellent explanatory motion | No added work | Existing tabs/press controls | Existing instant state | REJECT extra model choreography |
| Flow command/calendar | Typed operation choreography, confirmation, rollback and undo are visible | Strong existing storytelling | Preserve; animate only surrounding chapter punctuation | Existing model states | Existing state machine | Keep truth and reversibility legible | No parallel animation owner | Existing compact layout | Existing preference behavior | REJECT extra calendar motion |
| Leu source/learning trace | Source selection propagates through trace and returns to exact passage | Reading must stay stationary | Preserve source/answer model; apply shared chapter grammar outside it | Chapter approach | Shared heading action only | Frame decisions while preserving source trust | No movement behind reading text | Same source interaction | Static source and instant chapter state | P1 surrounding titles |
| Second Voice diff/privacy/gates | Distinct request states, explicit share and recoverable rewrite | Copy is already a visual comparison | Preserve text comparison; common chapter punctuation | Chapter approach | Shared heading action only | Make major decisions easier to follow without animating prose | No per-word rewrite animation added | Existing controls | Immediate content | P1 surrounding titles |
| Story | Eight scroll-linked scenes, visible progress and next/back buttons | Already its own narrative; extra scroll ownership risks resistance | Leave it alone | Existing scroll / buttons | Existing scoped scene runners | Preserve its coherent personality | No new ScrollTriggers on Story | Existing inline scenes | Existing no-autoplay mode | REJECT extra scroll engine |
| Contact / Line M | Train reacts to station focus/pointer and idles with visibility awareness | Already memorable and useful | Preserve, including external link semantics | Existing attention / focus | Existing controller | End on a distinctive, functional interaction | No added timeline | Existing stacked stations | Existing static service | REJECT competing footer reveal |
| CV / PDF | Calm document; new zoom ruler is already responsive | Animation would compete with recruitment reading | Exclude entirely from new GSAP owners | None | Native document interaction | Fast scanning and predictable links | Zero GSAP cost on direct CV/PDF visit | Same | Same | REJECT decorative motion |
| Velocity skew, broad pinning, every-card tilt | Not present | Would add spectacle with no explanatory value | Reject | None | None | Preserve direct scrolling, legibility and fixed hit targets | Avoid hot-path paint and gratuitous layers | None | None | REJECT |
| Preview photo → fictional F24 UI | Different objects, different provenance | A shared-photo flight would imply they are the same artifact | Reject media morph; share project identity only | Route | Label continuity | Honest continuity rather than a visual lie | None | Same | Same | REJECT media morph |

## Motion language and ownership

One grammar: **open → settle → follow → return**. Use the existing cream/forest/
plum surfaces. Masks belong to chapter typography; depth belongs to photography;
motion between objects belongs to explicit selection. Long-form text stays still.

Extend the existing `src/lib/motion/tokens.ts` rather than create a parallel token
system. GSAP seconds derive from the existing millisecond durations: micro 170ms,
standard 360ms, chapter 520ms, cinematic 620ms; line stagger 55ms; maximum chapter
travel one line inside a mask; photo travel 12px desktop / 4px touch; pointer 6px;
primary ease (.22,1,.36,1), secondary (.2,.8,.2,1), exit power2.in; pointer settle
360ms; scrub 0.45s desktop / direct scroll on touch. No elastic eases.

Feature ownership stays close to Hero, WorkSection, SearchDemo and ProductNav.
Only repeated lifecycle policy/runtime loading and major-heading behavior are
shared. Each owner uses a GSAP context and responsive matchMedia context, with
explicit cleanup for listeners, observers, delayed font completion and temporary
Flip layers. Reverting policy or unmounting must restore original styles and text.

Content is server-rendered and readable before any motion code loads. The first
viewport must not wait for GSAP, and headings already in view when an owner starts
must not disappear. Below-fold headings may prepare a mask before viewport entry.
Fonts and layout-affecting images trigger a coalesced refresh, not per-frame layout.

## References consulted

- [GSAP matchMedia and automatic context cleanup](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/)
- [SplitText responsive splitting, masks and accessibility](https://gsap.com/docs/v3/Plugins/SplitText/)
- [quickTo for pointer updates](https://gsap.com/docs/v3/GSAP/gsap.quickTo()/)
- [Flip.fit and transform scaling](https://gsap.com/docs/v3/Plugins/Flip/static.fit()/)

These are engineering references, not borrowed visual templates.
