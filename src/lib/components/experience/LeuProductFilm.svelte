<script lang="ts">
  import LeuFlowLoop from './work/stages/LeuFlowLoop.svelte';
  import { leuMedia } from '$lib/content/leu-media';
  let { compact = false }: { compact?: boolean } = $props();
</script>

<figure class="leu-film" class:compact aria-label="Leu product loop">
  <div class="film-stage"><LeuFlowLoop /></div>
  <figcaption>{leuMedia.caption}</figcaption>
</figure>

<style>
  .leu-film { width: 100%; max-width: 30rem; margin-inline: auto; }
  .compact { max-width: 22rem; }
  .film-stage { height: clamp(25rem, 45vw, 35rem); overflow: hidden; border-radius: 16px; }
  figcaption { margin-top: 1rem; color: var(--color-muted); font-size: .75rem; line-height: 1.6; }
</style>
