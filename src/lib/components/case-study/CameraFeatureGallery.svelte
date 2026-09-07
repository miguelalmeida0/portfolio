<script lang="ts">
  import { getApprovedMedia } from '$lib/content/project-media';
  export let compact = false;

  const examples = [
    { media: getApprovedMedia('camera-harness-peace-sign-result'), title: 'Recognize a gesture', description: 'A peace sign becomes a description you can confirm, retry, or hear aloud.', width: 2110, height: 902 },
    { media: getApprovedMedia('camera-harness-mug-result'), title: 'Describe a movement', description: 'Bringing a mug closer produces a movement description, ready for your review.', width: 2100, height: 910 }
  ];
</script>

<section class="feature-gallery" class:compact aria-label="Camera Harness gesture and movement examples">
  {#if !compact}
  <header>
    <h2 id="camera-features-title">From movement to meaning</h2>
    <p>Two recorded interactions · Open an image to see the detail.</p>
  </header>
  {/if}
  <div class="examples">
    {#each examples as example, index}
      {#if example.media}
        <figure>
          <a href={example.media.src} target="_blank" rel="noreferrer" aria-label={`View ${example.title.toLowerCase()} screenshot at full size (opens a new tab)`}>
            <img src={example.media.src} srcset={`${example.media.src.replace('-1600', '-720')} 720w, ${example.media.src} 1600w`} sizes={compact ? '(max-width: 900px) 92vw, min(52vw, 36rem)' : '(max-width: 760px) 92vw, 46vw'} alt={example.media.alt} width={example.width} height={example.height} loading={compact && index === 0 ? 'eager' : 'lazy'} decoding="async" />
          </a>
          <figcaption>
            <span aria-hidden="true">0{index + 1}</span>
            <div><h3>{example.title}</h3>{#if !compact}<p>{example.description}</p>{/if}</div>
          </figcaption>
        </figure>
      {/if}
    {/each}
  </div>
</section>

<style>
  .feature-gallery { width: 100%; margin: clamp(2rem, 4vw, 4rem) auto; }
  .compact { margin: 0; }
  .compact .examples { grid-template-columns: 1fr; gap: 1rem; }
  .compact figcaption { padding-top: 0.5rem; }
  header { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 0.6rem 2rem; margin-bottom: 1.25rem; }
  h2, h3, p, figure { margin: 0; }
  h2 { font-size: clamp(1.25rem, 2vw, 1.75rem); font-weight: 600; letter-spacing: -0.025em; }
  header p { font-size: 0.78rem; color: rgb(244 234 220 / 0.6); line-height: 1.5; }
  .examples { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(1.25rem, 2.5vw, 2.5rem); }
  figure { min-width: 0; }
  a { display: flex; align-items: center; aspect-ratio: 2100 / 910; border-radius: 8px; overflow: hidden; background: #faf9f6; }
  a:focus-visible { outline: 2px solid var(--ring); outline-offset: 5px; }
  img { display: block; width: 100%; height: 100%; object-fit: contain; }
  figcaption { display: flex; gap: 0.9rem; padding-top: 1rem; }
  figcaption > span { color: var(--accent); font-size: 0.75rem; line-height: 1.7; }
  h3 { font-size: 0.95rem; font-weight: 600; line-height: 1.5; }
  figcaption p { margin-top: 0.25rem; max-width: 48ch; font-size: 0.85rem; line-height: 1.6; color: rgb(244 234 220 / 0.65); }
  @media (max-width: 760px) { .examples { grid-template-columns: 1fr; gap: 1.75rem; } }
</style>
