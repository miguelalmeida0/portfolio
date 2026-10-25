# Needle: real product loop

Direction 1 was selected by the owner: a description is entered in Needle's
actual search interface, the field docks above real results, and a selected
artwork expands into the inspector. This replaces the decorative magnifier.
The mobile preview is square so the gallery and artwork metadata remain legible.
Desktop, Leu, F24, Second Voice, navigation and case-study behavior are preserved.

## Observed source

Inspected https://needle.miguelalmeida.xyz/ through real browser interactions:
search example “A room with a window”, six results, artwork details for
“Moonlight, Strandgade 30”, comparison, and the artwork category map. Direction 1
uses only search, results and inspector. The serif/system font stacks and brand
mark come from the deployed interface. The six images are the actual Met images
returned by that search; their original URLs and compressed dimensions are in
`release/needle-film-assets.json`. The selected painting is Vilhelm Hammershøi,
1900–1906, European Paintings, Met record 441933.

## Composition and controller

- Period: 12.4 seconds, deterministic frames on the existing GSAP clock.
- Opening: query typing inside the search panel. The actual field moves into the
  toolbar while the heading and panel leave.
- Gallery: six images appear in reading order. The selected painting remains
  the same image through its enlargement, without stretch or a replacement cut.
- Inspector: the background becomes opaque before the detail heading is fully
  exposed. The painting and metadata hold, then return to the gallery and search.
- Reduce Motion: two fixed field positions crossfade and the artwork fades into
  its fixed inspector frame; there is no long field/image travel. All stages
  still autoplay on the normal URL. Pause, offscreen, hidden-page and open-dialog
  controls continue to govern the same clock.

Six WebPs add approximately 204 KB of image data (273 KB as embedded JSON).
They have no runtime network dependency. DOM creation and decoding begin only
on first mobile initialization; the metadata/bytes remain part of the document.
The new layers are non-interactive and aria-hidden inside the named case-study
preview button. Without script execution, the original poster remains available.

## Verification

The existing frame tests were updated first. They failed on the previous query
length (26 rather than 20) and previous loop period before implementation.
The new sequence then passed the finite-frame, repeated-cycle and story checks.
Browser checks cover both preferences at 393×637 and DPR 3: actual image decoding,
query, gallery, inspector metadata, stable reading hold, reduced-motion field
position, return, no horizontal overflow, and desktop restoration. The wider
playback/responsive/diagnostic group covers 320, 390, 430 and 768 pixel widths,
pause persistence, offscreen/dialog suspension and the other three previews.
Full-loop frames were visually inspected in both motion profiles. These are
browser tests and captures, not a physical iPhone performance measurement.

## Post-deploy monitoring and validation

The shipping agent owns immediate verification: wait for Cloudflare Pages and
blocking Chromium/WebKit checks, compare the public normal and iPhone-UA HTML
with the tested candidate, and check a fresh public load. Expected signals are
one Needle demo, no old magnifier, six decoded results, advancing visible clock,
and a readable inspector before return. There is no new telemetry endpoint.
A bootstrap error, missing/undecodable artwork, frozen visible clock or broken
case-study navigation is a regression trigger. Revert the focused release commit
through ordinary history if required; do not reset or force-push shared refs.
The requested square frame and new real-product sequence are intended behavior.

## Review and final local validation

Compound Engineering review completed with receipt
`20261026-060521-54ad041f` (source review; six independent lenses and a fresh
finding validator). Three retained findings were applied in two file-owned
batches: #1 scoped artwork sizing/no poster clip; #2 selection outline local to
its cell; #3 static submit geometry under reduced motion. None remain unresolved.
The image regression first reproduced all six inherited clips and 19–33 CSS-pixel
cell gaps. The submit regression first reproduced the missing profile-specific
scale. Both pass after their corrections. The two reported lifecycle/geometry
test gaps now have direct desktop-first/re-entry and inspector-entry/return checks.

Final local checks: 441 unit tests pass; Svelte check has zero errors/warnings;
the seven affected browser scenarios pass at DPR 3, including four responsive
widths, both Needle profiles, and first-use/re-entry. The earlier 20-scenario
playback/responsive/diagnostic run also passed. Full-loop native-DPR captures
were inspected again after the corrections; no page errors were recorded.
The local cached Chromium engine is version 133 because the current browser
package download failed; current Chromium/WebKit verification remains with CI.

A final rendered-frame check found the docked field overlapped the wordmark by
1.47 CSS px. The geometry regression first failed, then passed after reserving
28 more world pixels for the brand while retaining the field's right margin.
Both motion-profile scenarios and desktop-first re-entry passed again, followed
by another native-DPR full-loop capture without page errors.
