# Mobile project films

The mobile layout previously called `projectScenes.reset(true)` and returned
before installing any playback clock. This intentionally completed the desktop
scroll scenes, leaving mobile previews static. Native page scrolling stays in
place; the four mobile films now own their visual properties independently.

## Direction

Use the existing artwork, typography, room photography and authored product
examples. Keep the simplified image/title/sentence/action feed. Three approaches
were considered: replaying desktop scroll progress, pre-rendered videos, and
subject-specific DOM compositions. The last avoids video payloads and autoplay
restrictions while giving each subject a different spatial story.

| Film | Duration | 0% | 25% | 50% | 75% | 100% |
| --- | --- | --- | --- | --- | --- | --- |
| Needle | 8.8s | Description types above three collection objects | Magnifier inspects the collection | Magnifier discovers the golden object | Golden object selected, “Found it.” | Original arrangement |
| F24 | 8.4s | Empty condition | Condition typed | Dry run and attempted save | Error preserves the rule | Saved confirmation resolves and returns to editing |
| Second Voice | 8.8s | Original passage, empty rewrite | “Rain” crosses the seam | Rewrite settles into complete lines | Read both passages | Rewrite clears for the next take |
| Leu | 10s | Original room with window rain | Window rain | Window rain | Window rain | Seamless rain reset |

Needle uses a 640×440 world; the other compositions retain their 640×640 world.
Only artwork moves inside the stable preview button. Project names, links,
reading copy, page height and hit areas remain fixed. Every visible preview
runs independently, including two previews that fit together at 320px. Clocks
pause offscreen, with a case study open, on a hidden page, and via the
“Pause motion” control. User pause persists per tab.
Reduced motion keeps the camera and reading copy still. Needle's magnifier
inspects the collection while the objects stay near their original positions;
rule fields appear before feedback and rewrite words fade into place. Leu uses
the same contained window rain in both profiles. Its room, headline and sofa
remain still: there is no chapter panel, room zoom, glow or steam animation.
The existing explicit `?motion=play` choice can enable full compositions.
No-JavaScript posters and public case-study links remain available. Desktop
retains its scroll choreography.

## Checks

- Deterministic frame functions, finite geometry across multiple loops, playback
  admission (including equally visible previews), and shipping integration have
  dedicated unit checks.
- Browser inspection at 393px covers all four running scenes and case-study
  opening/closing. At 320px the pause control uses its icon with an accessible
  label; measured document overflow is zero.
- The release browser suite additionally exercises autoplay entry, simultaneous
  visible playback, dialog suspension, pause/resume, reduced motion and resize.
- This is browser emulation, not a physical iPhone performance trace. No device
  frame-rate claim is made.

## Autoplay recovery

The first follow-up fixed equally visible previews competing for a single clock.
The next exposed a Play control and explicit playback link under reduced motion,
but the normal URL still intentionally returned static scenes in that mode.
That left automatic playback dependent on an extra opt-in. The user's screenshot
cannot establish the phone's actual media preference, so that preference is not
claimed as a confirmed on-device cause.

Two regression tests now examine rendered pixels. On the deployed HTML, the
plain reduced-motion URL never starts a clock; Leu's open middle interval changes
less than 0.5% of its pixels above the color-difference threshold. Both tests
fail before the fix. The candidate autoplays gentle reduced-motion compositions
without input and keeps visible window activity during Leu's open interval.
The tests require more than 1% changed pixels, sample several points to avoid
equal phases of a fade, and verify the gentle scenes' transforms remain fixed.
Pause persistence, explicit playback, dialog suspension, desktop resizing and
simultaneous visible previews remain covered by the six-test playback group.

## Owner-directed refinement

The owner subsequently confirmed the loops were playing, rejected Needle's
floating-card treatment and Leu's large chapter panel, and requested only the
original background rain for Leu. The chapter and glow nodes and styles are
removed entirely. Existing rain particles use the pausable GSAP clock, so the
normal URL also has visible rain with Reduce Motion enabled. Needle reuses
three existing sprite crops for the search and magnified views; no image or
video assets or dependencies are added.

The new browser regressions first failed on the old release: Leu contained two
unwanted overlay nodes in both motion profiles and Needle had no magnifier.
They now verify rain changes inside the window, no meaningful pixel changes
outside it, a stable room, and Needle's visible search and match. Pixel checks
use a summed RGB difference above 30 to exclude compositor rounding; the
window itself must change by more than one percent. Both Leu profiles use the
reported 393-by-637 viewport. Full-loop Needle samples and Leu room screenshots
were inspected in both profiles. These checks cover rendered behavior, not just
an advancing clock.

Validation for the refinement: 440 unit checks pass and Svelte reports zero
errors or warnings. Fifteen focused browser checks pass, including the two rain
profiles and Needle's search. The first full browser run passed 14 checks but
one browser process crashed during launch, before visiting the page; that
unchanged check passed when rerun separately.
Both rain profiles and the Needle search also pass at device pixel ratio 3.
Independent review found no remaining code issues after correcting screenshot
coordinate scaling. The local Cloudflare worker cannot start because this
environment denies network-interface enumeration (`uv_interface_addresses`);
production-worker browser coverage is therefore also required from CI.
