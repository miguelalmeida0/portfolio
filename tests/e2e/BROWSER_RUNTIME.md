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
