# Mobile autoplay: device report and reduced-motion fix

The owner's iPhone report identifies the code path: the browser requests reduced
motion and has no explicit full-motion choice. Leu is fully visible, initialized
and enabled; its clock advances from 0 to 0.974 to 2.172 seconds with no script
errors. The reduced-motion renderer keeps the room stationary and CSS hides the
chapter page, leaving only a subtle window tint. Playback is running, but the
intended reading sequence has been removed. Other projects are offscreen in
this report, so their paused clocks are expected.

The first correction used stationary artwork emphasis, sequential rule fields
and feedback, word-by-word rewrite reveals, and chapter/room crossfades. The
owner confirmed playback, then rejected the Needle treatment and Leu chapter
panel. The current refinement replaces Needle with a description/search/match
sequence and removes Leu's chapter and glow entirely. Leu now keeps only the
original rain inside its window, in both motion profiles. No device setting
change or special playback URL is needed. Desktop compositions remain available.

## Investigation evidence

- Public homepage bytes match the tested release, including an iPhone user agent.
- The diagnostic baseline is `fd1d56227bdaef1bf7f873eb981656e279444cb0`; its local equivalent is
  `266c323ff9e0f3edab4aa60203ffe85206f08cf7`.
- The repository has no service worker registration or HTML cache handler.
- Public HTML sends `Cache-Control: no-cache, max-age=0, must-revalidate`.
- Current response has no Content-Security-Policy header blocking inline scripts.
- Chromium touch dispatch, wheel scrolling, toolbar-sized height changes,
  background return, history return and desktop/mobile resize did not reproduce
  the reported stop. No page script errors were recorded.
- At scroll offset 1985, Leu advanced from 2.698 to 3.898 seconds after touch;
  from 5.048 to 6.248 after viewport changes; and from 6.315 to 7.515 after
  background return. These are browser probes, not physical iPhone evidence.
- A question about whether tapping the project opens its dialog received no
  answer. The subsequent device report confirms main-script execution and
  identifies build `bb522a9f2fc0`, `reducedMotion: true`, `savedPause: false`,
  `fullMotionChoice: false`, and a visible page with all dependencies present.

The earlier one-percent whole-scene check could pass a window tint. The initial
crossfade regression required a displayed chapter page, but the owner's later
direction explicitly removes that page. Its replacement checks the reported
393-by-637 viewport in both motion profiles: no chapter/glow nodes, a stationary
room, visible rain inside the window and no meaningful changes outside it.
Needle has a separate search/magnifier/match check. Unit checks cover finite
geometry and seamless repeated cycles in both profiles.

## Diagnostic delivery

`/motion-debug/` is a separate static copy generated from the exact normal
homepage. Its early script records errors before the main script runs, observer
callbacks, media/layout flags, stored pause choice, GSAP ticker values and each
preview's clock and inline rendering values. It captures samples before opening
its panel. Reading computed geometry is an explicit separate action because
forcing layout can change the failure being investigated.

The report can distinguish a saved pause, startup failure, a missing visibility
signal, background/dialog suspension, a desktop layout, and a stopped clock
despite a playing flag. Advancing clocks are described as clocks, not as proof
that the physical display repainted. The no-JavaScript explanation remains in
static HTML. Reports are shown locally and copied only by user action; no
telemetry endpoint or automatic transmission is added. The route is no-store
and noindex. Normal homepage bytes and motion logic are unchanged.

Fault-injection browser checks cover a main bootstrap exception, missing observer
callbacks, a paused GSAP global timeline while the playing flag stays true,
saved pause, JavaScript disabled, and a healthy desktop. The observer wrapper
also preserves the native callback receiver. The report establishes the active
code path and the missing chapter layer. Browser checks verify the correction
under those same conditions; post-deployment physical-device confirmation is
still separate from that evidence.
