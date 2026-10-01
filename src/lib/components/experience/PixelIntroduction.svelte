<script lang="ts">
  import { pixelIntroduction } from '$lib/motion/pixel-introduction';
  import { introSilhouette } from '$lib/motion/intro-silhouette';

  const rows = Array.from({ length: 63 }, (_, index) => index * 23 + 18);
  const name = 'MIGUEL ALMEIDA · '.repeat(9);
</script>

<section use:pixelIntroduction data-pixel-intro aria-hidden="true" class="no-print">
  <div data-intro-backdrop></div>
  <div data-intro-card>
    <div data-intro-person>
      <svg data-intro-body viewBox="0 0 1086 1448" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="intro-body-outline"><path d={introSilhouette} /></clipPath></defs>
        <g data-intro-type clip-path="url(#intro-body-outline)" fill="currentColor">
          {#each rows as y, index}
            <text x={index % 2 ? -64 : -12} {y}>{name}</text>
          {/each}
        </g>
      </svg>
      <!-- The action inserts only the live hero image's currentSrc after decode. -->
    </div>
  </div>
</section>

<style>
  [data-pixel-intro] { position: fixed; inset: 0; z-index: 60; overflow: hidden; color: #142A22; }
  [data-intro-backdrop] { position: absolute; inset: 0; background: #F0F3E4; }
  [data-intro-card] { position: absolute; inset: 0; overflow: hidden; transform-origin: 0 0; }
  [data-intro-person] { position: absolute; top: 50%; left: 50%; height: clamp(140px, 20svh, 200px); aspect-ratio: 1086 / 1448; transform: translate(-50%, -50%); transform-origin: 0 0; }
  [data-intro-body] { display: block; width: 100%; height: 100%; mask-size: 100% 100%; mask-repeat: no-repeat; mask-mode: alpha; }
  text { font-family: 'Figtree', 'Helvetica Neue', Arial, sans-serif; font-size: 17.4px; font-weight: 650; letter-spacing: .22px; }
</style>
