<script lang="ts">
  import { selectedProjects } from '$lib/components/experience/work/selected-projects';
  let { slug }: { slug: string } = $props();
  const media = $derived(selectedProjects.find(item => item.id === slug));
  // These two hero posters are 16:9. Reserve their real ratio during SSR,
  // before the browser decodes the image, to avoid a padded frame or jump.
  const widescreen = $derived(slug === 'leu' || slug === 'flow');
</script>

<figure class="case-artifact" data-case-artifact data-project={slug}>
  <img src={media?.poster ?? '/projects/f24/illustrative-recovery.jpg'} alt={media?.alt ?? 'Fictional configuration screen: a failed save keeps the entered information and offers Retry.'} width="1440" height={widescreen ? 810 : 1000} fetchpriority="high" />
  <figcaption>{slug === 'f24' ? 'Illustrative recovery state from the demo below. Fictional names and data; no internal F24 screens.' : slug === 'leu' ? 'Leu’s native learning walkthrough. The interactive example below is a web model.' : slug === 'flow' ? 'Recorded Flow interface. Controlled speech input; microphone recognition is not demonstrated.' : 'The actual product. The interactive examples below use prepared data.'}</figcaption>
</figure>
