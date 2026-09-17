<script lang="ts">
  const heroPortrait = '/images/miguel-hero-1451.webp';
</script>

<figure class="hero-portrait" aria-label="Portrait of Miguel Almeida">
  <div class="portrait-frame" aria-hidden="true">
    <span class="portrait-aperture">
      <span class="mark mark-tl"></span>
      <span class="mark mark-tr"></span>
      <span class="mark mark-bl"></span>
      <span class="mark mark-br"></span>
    </span>
    <img
      src={heroPortrait}
      srcset="/images/miguel-hero-720.webp 720w, /images/miguel-hero-1451.webp 1451w"
      sizes="(max-width: 760px) 100vw, 55vw"
      alt=""
      class="portrait-image"
      width="1451"
      height="1086"
      loading="eager"
      decoding="async"
      fetchpriority="high"
      draggable="false"
    />
  </div>
</figure>

<style>
  .hero-portrait {
    position: absolute;
    inset: 0;
    z-index: 1;
    margin: 0;
    overflow: hidden;
    background: #000;
    pointer-events: none;
  }

  .portrait-frame {
    position: absolute;
    left: 50%;
    right: auto;
    top: clamp(4.35rem, 5.4svh, 5.6rem);
    width: min(100vw, 90.7rem);
    aspect-ratio: 1451 / 1086;
    margin-inline: 0;
    overflow: hidden;
    contain: layout paint;
    background: #000;
    transform: translateX(-50%);
  }

  /*
   * The aperture: four editorial crop marks that resolve with the portrait. Corner
   * marks rather than a full box, so nothing ever draws a line across the subject.
   * This is the site's frame vocabulary at its largest scale; the work tiles and the
   * case-study hero use the same gesture smaller.
   */
  .portrait-aperture {
    position: absolute;
    /* The top inset clears the fixed header so all four marks stay legible. */
    inset: 20% 12% 12%;
    z-index: 2;
    display: block;
    pointer-events: none;
  }

  .mark {
    --arm: clamp(14px, 1.6vw, 26px);

    position: absolute;
    width: var(--arm);
    height: var(--arm);
    border: 0 solid rgb(244 234 220 / 0.22);
  }

  .mark-tl { top: 0; left: 0; border-top-width: 1px; border-left-width: 1px; }
  .mark-tr { top: 0; right: 0; border-top-width: 1px; border-right-width: 1px; }
  .mark-bl { bottom: 0; left: 0; border-bottom-width: 1px; border-left-width: 1px; }
  .mark-br { bottom: 0; right: 0; border-bottom-width: 1px; border-right-width: 1px; }

  :global(html[data-motion='full']) .portrait-aperture {
    animation: aperture-resolve 700ms var(--motion-settle) 140ms both;
  }

  @keyframes aperture-resolve {
    from { opacity: 0; scale: 1.05; }
    to { opacity: 1; scale: 1; }
  }

  .portrait-image {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    max-width: none;
    object-fit: contain;
    object-position: center center;
    user-select: none;
    /*
     * Two independent properties, so they can never fight each other:
     * `scale` carries the one-off opening settle, `transform` carries the bounded
     * pointer depth. `--depth-*` stays at zero unless the pointer action runs, and
     * the animation only exists once the motion policy has said full motion is fine.
     */
    transform: translate3d(var(--depth-x), var(--depth-y), 0) rotate(var(--depth-tilt));
    transition: transform 320ms var(--motion-settle);
  }

  /* The pointer action owns `data-depth` on the hero's portrait wrapper. */
  :global([data-depth='tracking']) .portrait-image {
    transition: transform 160ms var(--motion-ease-feedback);
  }

  :global(html[data-motion='full']) .portrait-image {
    animation: portrait-settle var(--motion-hero-max) var(--motion-settle) both;
  }

  /*
   * Scale only. Fading the portrait in would make it a later largest-contentful
   * paint for no visual gain, and the brief is explicit that the real composition
   * is on screen from the first frame — it settles, it does not appear.
   */
  @keyframes portrait-settle {
    from {
      scale: 1.035;
    }

    to {
      scale: 1;
    }
  }

  @media (max-width: 760px) {
    /* Small screens get a shorter, decoration-only settle. */
    :global(html[data-motion='full']) .portrait-image {
      animation-duration: 420ms;
    }
  }

  @media (max-width: 900px) {
    .portrait-frame {
      top: clamp(11.5rem, 19svh, 13.5rem);
      width: min(100vw, 56rem);
    }
  }

  @media (max-width: 700px) {
    .portrait-frame {
      top: clamp(12.1rem, 20svh, 13.2rem);
      width: 128vw;
      transform: translateX(-50%);
    }
  }

  @media (max-width: 520px) {
    .portrait-frame {
      top: clamp(12.4rem, 24svh, 13.35rem);
      width: 152vw;
      transform: translateX(-50%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .portrait-image,
    .portrait-aperture {
      transform: none;
      transition: none;
      animation: none;
    }
  }

  :global(html[data-motion='reduced']) .portrait-image,
  :global(html[data-motion='reduced']) .portrait-aperture {
    transform: none;
    transition: none;
    animation: none;
  }
</style>
