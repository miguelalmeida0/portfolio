<script lang="ts">
  import LabPortrait from '../LabPortrait.svelte';
  let { sizes = '(max-width: 800px) 70vw, 42vw' }: {sizes?:string} = $props();
</script>
<div class="portrait" data-craft-portrait>
 <div class="cutout">
  <LabPortrait {sizes} />
  <img class="hair" src="/hero-lab/portrait-hair-volume.png" width="1086" height="1448" alt="" aria-hidden="true" decoding="async" />
 </div>
</div>
<style>
  .portrait { position:relative; width:100%; height:100%; display:flex; align-items:end; justify-content:center; }
  .cutout { position:relative;height:100%;aspect-ratio:1086/1448;flex-shrink:0; }
  .portrait :global(.lab-portrait) { height:100%; mask-image:url('/hero-lab/portrait-edge-mask.png');mask-size:100% 100%;mask-repeat:no-repeat; }
  .hair { position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:50% 100%;pointer-events:none; }
</style>
