# Restore the medium and large screen scroll layout

The owner reported that the mobile-only changes had replaced the earlier
scrolling project layout on wider screens. Release baseline:
`e1aefa25767372f2e7e13cfb54472fde27a344e3`.

## Cause

- The mobile CSS and controller used `max-width:900px`. The mobile early return
  in `setupMotion()` therefore disabled the original hero and gallery at tablet
  widths, including 768px.
- The original gallery query also required `min-height:720px`. A 1536×690 or
  1024×700 browser viewport selected the tall, stacked fallback despite having
  enough width for the original side-by-side composition. This height condition
  predates the mobile release; it was still an obstacle to the requested layout.
- Existing acceptance covered desktop at 1440×900 and explicitly treated 768px
  as mobile. It did not cover shorter laptop windows.

No runtime exceptions were present. The original scroll implementation and
project markup were still in `release/home.html`; they had become unreachable
under the responsive conditions above. No open issue or PR already supplied a fix.

## Fix

Limit the phone CSS, film controller, mobile navigation, no-script layout and
motion diagnostics to widths below 768px. Select the original gallery at 768px
and above without the 720px height condition. Preserve the reviewed homepage
source, project assets, original scroll timelines, reduced-motion fallback,
public routes, phone autoplay and compact phone header.

## Verification

- Reproduction against immutable pre-fix shipping HTML: 768×1024 fails because
  the phone heading remains visible; 1536×690 fails because the horizontal
  gallery is absent. The 1440×900 baseline already passed.
- All five restored-layout tests pass: 768×1024, 1024×700, 1366×650, 1440×900,
  1536×690. Real wheel input lifts the pink sheet, changes the photographic
  hand pose, and reverses back to the opening. Real gallery scrolling changes
  the rendered track. Every project's preview sits beside its title and its
  case-study action remains reachable. No horizontal document overflow.
- Boundary resize coverage passes through 767↔768 and short/tall wider windows:
  exactly one hero/gallery pin owner on wider screens; phone autoplay returns
  after narrowing. No duplicate mounts or disabled phone films.
- Sixteen focused playback/layout scenarios and eight additional contact,
  footer, reduced-motion and Leu rain-only scenarios pass. Phone reading checks
  include 320, 390, 430, 600 and 767px. Both Needle motion profiles pass.
- Captured and inspected all project bounds and representative screenshots at
  tablet and short laptop sizes. No page errors; copy and previews fit the
  measured viewport. Local browser: Chromium 153 from the published Sparticuz
  package. Cross-browser coverage is supplied by the release CI.
- Svelte: zero errors/warnings. All 441 unit tests pass. Production build and
  build integrity pass. Generated homepage bytes match the tested candidate.

The existing 620px minimum gallery stage is unchanged; this verification covers
browser viewport heights of 650px and above. OS/browser reduced-motion settings
continue to select the original accessible fallback instead of pinned motion.

Independent Compound Engineering review `20261026-175505-7ba90c16` completed
five lenses: correctness, project standards, testing, frontend timing and
adversarial. No actionable findings or remaining testing gaps. The initial
hero-visibility coverage gap was closed and rerun before review completion.
Cross-model review was unavailable; no such coverage is claimed. Simplification
was unnecessary for mechanical breakpoint edits with no new abstraction.
