# Linux WebKit media backend

`playwright.config.ts` selects `WEBKIT_GST_USE_PLAYBIN3=1` only for Linux
WebKit projects. macOS WebKit and the other browser engines keep their normal
launch environment. No deployed application setting changes.

With Playwright 1.61.1 / WebKit revision 2311 and Ubuntu 24.04 GStreamer 1.24.2,
the legacy playbin pipeline blocked `HTMLMediaElement.pause()` for 13.2–14.0
seconds when navigating away from Leu's MP4 fallback. Moving the pause before
navigation merely moved the freeze. Replacing pause with an empty-source load
also blocked, so neither application workaround was kept.

The supported playbin3 backend reduced the same measured pause to 0–1 ms and
source reset to 7–10 ms. The unmodified application then completed the fallback,
case-study navigation and Back flow in both WebKit projects. The regression test
requires an actual failed WebM request before each MP4 fallback and bounds the
complete case-study navigation to eight seconds. No browser test is skipped and
no navigation timeout is increased.

The separate frame-inspection test reloads the same film after its synthetic
seek to the final frame before resuming normal playback/navigation. Its decoded
first/early/final-frame and poster comparisons retain their original bounds.

Upstream backend selection:
https://chromium.googlesource.com/external/github.com/WebKit/webkit/+/a8823543d6bf29ae58b360b33d1f86d6267a10e2/Source/WebCore/platform/graphics/gstreamer/MediaPlayerPrivateGStreamer.cpp
(`createGSTPlayBin`, `WEBKIT_GST_USE_PLAYBIN3`).

## Test server and HTTP byte ranges

Playwright runs the compiled SvelteKit Cloudflare worker with `wrangler dev`
and the Workers Assets binding in `wrangler.e2e.jsonc`. The production Pages
configuration and deployment command are unchanged.

Wrangler 4.137.0's legacy `pages dev` asset handler returned the entire Flow MP4
with status 200 and chunked transfer encoding even for `Range: bytes=0-4095`.
Linux WebKit's playbin3 backend consequently decoded metadata but never advanced
playback. This reproduced the hosted failures with the actual compiled worker;
Vite preview did not reproduce them. Workers Assets supplies Content-Length on
the first response, allowing the compiled worker's Cache API to serve subsequent
ranges with status 206 and the correct Content-Range. The media HTTP test checks
the initial size and compares subsequent range bodies with the source films.
The local asset binding may answer an uncached range with a full 200 response;
the browser checks also cover playback from a fresh server cache.

The real-worker regression checks retain decoded frame, playback progression,
reduced motion, fallback and navigation assertions. No application video, poster,
layout or timeout is changed to accommodate the test server.

### Uncached range parity (21 October 2026)

The expanded release suite also intercepts delayed media requests, which disables
the browser cache. Workers Assets still returned whole-file `200` responses for
some of those range requests. Linux WebKit reproduced stalled playback and a
startup clock correction with a plain video, while the same public Pages asset
played steadily. Playwright 1.64.1 reproduced the issue too; the repository stays
on 1.61.1.

`scripts/local-cloudflare-worker.mjs` wraps only the local `ASSETS` binding. It
executes the compiled Pages worker unchanged and converts an ignored single-range
request into an exact `206` response from the actual asset bytes. Full responses
advertise byte-range support. Existing partial responses, encoded responses and
stale `If-Range` requests pass through. Unit tests check exact range bodies,
lengths and `416` behavior. The
production Pages configuration, application routing and media files are unchanged.

### Native WebKit release gate

The full WebKit release job runs on `macos-15`, using Safari's native media
backend. Chromium and the independent two-browser scrollbar job stay on Linux.
The job names, test selection, assertions, timeouts, zero-retry policy and required
`validate` dependencies are unchanged.

After correcting range behavior, Linux GStreamer's startup `currentTime` still
moved backward in a plain native video (for example, 0.531s to 0.112s), independent
of the portfolio controller. The same issue persisted in the isolated 1.64.1
runtime comparison. This Linux media behavior remains unresolved; native macOS
WebKit is the release platform for video playback and loop-boundary acceptance.
Do not describe the native release gate as a Linux media pass.
