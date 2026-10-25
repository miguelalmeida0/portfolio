# Mobile autoplay: unresolved device failure

The owner still reports all previews static after the latest release. The
physical iPhone failure has not been reproduced or causally identified. Earlier
passing browser checks must not be treated as confirmation of a device fix.

## Current evidence

- Public homepage bytes match the tested release, including an iPhone user agent.
- Main is `fd1d56227bdaef1bf7f873eb981656e279444cb0`; the local equivalent is
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
  answer. Main-script execution on the failing device remains unknown.

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
also preserves the native callback receiver. The next necessary evidence is a
report from the actual failing browser, not another speculative motion patch.
