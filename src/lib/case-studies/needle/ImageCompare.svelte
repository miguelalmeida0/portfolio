<script lang="ts">
  import { needleImageSample as sample } from '$lib/content/needle-investigation';
  const variants = [
    { label: 'Original JPEG', src: '/projects/needle/queen-louise-original.jpg', bytes: sample.originalBytes, width: '339 × 623 px', description: 'The bundled museum image. A useful source, but more bytes than a small tile needs.' },
    { label: 'Tile · AVIF', src: sample.tile, bytes: sample.tileBytes, width: '160 × 294 px', description: 'A 160-pixel derivative for the small artwork tile. The request matches the place the image will appear.' },
    { label: 'Detail · AVIF', src: sample.detail, bytes: sample.detailBytes, width: '339 × 623 px', description: 'A 640-pixel request stays at the original 339-pixel width. The pipeline avoids enlarging the source.' }
  ];
  let selected = $state(1);
  const variant = $derived(variants[selected]);
  let failed = $state(false);
</script>
<div class="image-compare frame">
  <figure class="image-stage">{#if failed}<p role="status">Image sample unavailable.</p>{:else}<img src={variant.src} alt={`Queen Louise, ${variant.label}`} width="339" height="623" loading="lazy" onerror={() => failed = true} />{/if}<figcaption>{sample.title} · {sample.artist}</figcaption></figure>
  <div class="image-data"><div class="chips" role="group" aria-label="Compare image formats">{#each variants as item, i}<button class="chip" type="button" aria-pressed={selected === i} onclick={() => { selected = i; failed = false; }}>{item.label}</button>{/each}</div>
    <div aria-live="polite" aria-atomic="true"><p class="big-value">{(variant.bytes / 1000).toFixed(1)} <span>kB</span></p><p class="image-dimensions">{variant.width}</p><p>{variant.description}</p></div>
    <div class="byte-bars" aria-label="Encoded image file sizes">{#each variants as item, i}<div class:chosen={selected === i}><div><span>{item.label}</span><b>{(item.bytes / 1000).toFixed(1)} kB</b></div><span class="byte-track"><span style:width={`${item.bytes / sample.originalBytes * 100}%`}></span></span></div>{/each}</div>
  </div>
</div>
<p class="cap">{sample.conditions}</p>
