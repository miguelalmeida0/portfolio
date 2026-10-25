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
| Needle | 8.8s | Three collection objects in a loose fan | Curated triptych | Center object enlarged; side objects retreat | Objects gather back into a fan | Original fan |
| F24 | 8.4s | Empty condition | Condition typed | Dry run and attempted save | Error preserves the rule | Saved confirmation resolves and returns to editing |
| Second Voice | 8.8s | Original passage, empty rewrite | “Rain” crosses the seam | Rewrite settles into complete lines | Read both passages | Rewrite clears for the next take |
| Leu | 10s | Paper leaf over the nook | Leaf turns open | Rainy window and tea steam | Reading interval | Leaf closes for the next chapter |

Needle uses a 640×440 world; the other compositions retain their 640×640 world.
Only artwork moves inside the stable preview button. Project names, links,
reading copy, page height and hit areas remain fixed. A single most-visible
preview runs at a time. Clocks pause offscreen, with a case study open, on a
hidden page, and via the “Pause motion” control. User pause persists per tab.
Reduced motion uses completed static scenes. No-JavaScript posters and public
case-study links remain available. Desktop retains its scroll choreography.

## Checks

- Deterministic frame functions, finite geometry across multiple loops, playback
  admission, and shipping integration have dedicated unit checks.
- Browser inspection at 393px covers all four running scenes and case-study
  opening/closing. At 320px the pause control uses its icon with an accessible
  label; measured document overflow is zero.
- The release browser suite additionally exercises autoplay entry, exclusive
  clock ownership, dialog suspension, pause/resume, reduced motion and resize.
- This is browser emulation, not a physical iPhone performance trace. No device
  frame-rate claim is made.
