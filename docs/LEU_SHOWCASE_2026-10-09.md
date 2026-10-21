# Leu supplied-image showcase and sharp film

The Leu opening uses the six owner-supplied images. The overview presents the
three-phone composition on desktop and a readable complete handset on mobile.
Home → Library → Read → Tell it back are keyboard-accessible learning steps.
Platform focus preserves the selected step. The desktop image consistently
represents the reading companion rather than pretending to change into other
screens. Phone overview exposes the full four-screen composition, with a local
horizontal scroll viewport on small displays. The reader close-up uses the
larger phone in the hero, retaining 46% more source pixels than the four-screen
composition. Existing learning and engineering sections are preserved.

PNG originals were encoded as lossless WebP, preserving transparency. Supplied
WebP files were copied unchanged. Superseded gallery images and film files are
retired rather than shipping a second obsolete generation.

The owner's original 40.4-second loop is restored byte for byte from the
1440×810 H.264 master in commit `4db870e`. The previous browser-preferred WebM
was only 960×540. Playback now uses only the original master, providing 2.25×
the source pixels without changing a scene, frame, transition, or timing. A
new cache-versioned URL ensures browsers do not reuse the blurred alternative.
The original poster is retained. The rejected recaptured film and its generation
scripts are removed. The image gallery and all other case studies are unchanged.

The SHA-256 of the approved original MP4 is
`b314eff70e3652ef3a18e83e75f6bc4a55640d0665efc5d12f780abd601bf120`.
The regression check prevents accidentally replacing or recompressing it.
Browser checks require actual 1440×810 decoded video, the original duration,
only the master request, pause/resume, missing-file fallback, and autoplay retry.
