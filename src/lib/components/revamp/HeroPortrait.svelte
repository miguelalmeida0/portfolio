<script lang="ts">
  import heroPortrait from '$lib/assets/hero/portrait/miguel-hand-out.png';
</script>

<figure class="hero-portrait" aria-label="Portrait of Miguel Almeida">
  <div class="portrait-frame" aria-hidden="true">
    <img
      src={heroPortrait}
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
</style>
