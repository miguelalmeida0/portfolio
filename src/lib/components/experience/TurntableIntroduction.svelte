<script lang="ts">
  import { turntableIntroduction } from '$lib/motion/turntable-introduction';
  const portrait = '/turntable-header/miguel-front-contour.webp';
  const rows = Array.from({ length: 47 }, (_, i) => i * 23 + 18);
  const name = 'MIGUEL ALMEIDA · '.repeat(9);
</script>

<section use:turntableIntroduction data-pixel-intro data-turntable-intro aria-hidden="true" class="no-print">
  <div data-intro-backdrop></div>
  <div data-intro-person>
    <svg data-intro-body viewBox="0 0 1016 1065" style:mask-image={'url("' + portrait + '")'} xmlns="http://www.w3.org/2000/svg">
      <g fill="currentColor">
        {#each rows as y, i}<text x={i % 2 ? -64 : -12} {y}>{name}</text>{/each}
      </g>
    </svg>
    <img data-intro-source src={portrait} width="1016" height="1065" alt="" decoding="async" fetchpriority="high" />
  </div>
</section>

<style>
  [data-pixel-intro] { position: fixed; inset: 0; z-index: 80; overflow: hidden; color: #0B2B22; }
  [data-intro-backdrop] { position: absolute; inset: 0; background: #E2EDBA; }
  [data-intro-person] { position: absolute; top: 0; left: 0; visibility: hidden; }
  [data-intro-body] { position: absolute; inset: 0; display: block; width: 100%; height: 100%; max-width: none; }
  [data-intro-body] { mask-size: 100% 100%; mask-repeat: no-repeat; mask-mode: alpha; }
  [data-intro-source] { display: none; }
  text { font-family: 'Figtree', 'Helvetica Neue', Arial, sans-serif; font-size: 17.4px; font-weight: 650; letter-spacing: .22px; }
</style>
