<script lang="ts">
  import { findProject } from '$lib/experience/projects';
  import { selectedProjects } from '$lib/components/experience/work/selected-projects';
  let { slug }: { slug: string } = $props();
  const project = $derived(findProject(slug)!);
  const media = $derived(selectedProjects.find(item => item.id === slug));
</script>

<figure class="case-artifact" data-case-artifact data-project={slug}>
  <img src={media?.poster ?? '/projects/f24/illustrative-recovery.jpg'} alt={media?.alt ?? 'Fictional configuration screen: a failed save keeps the entered information and offers Retry.'} width="1440" height="1000" fetchpriority="high" />
  <figcaption>{slug === 'f24' ? 'Illustrative recovery state from the demo below. Fictional names and data; no internal F24 screens.' : slug === 'leu' ? 'Leu’s native learning walkthrough. The interactive example below is a web model.' : slug === 'flow' ? 'Recorded Flow interface. Controlled speech input; microphone recognition is not demonstrated.' : 'The actual product. The interactive examples below use prepared data.'}</figcaption>
</figure>
<dl class="case-brief" data-case-brief>
  <div><dt>The problem</dt><dd>{project.problem}</dd></div>
  <div><dt>My role</dt><dd>{project.ownership}</dd></div>
  <div><dt>What to look for</dt><dd>{project.decisions[0]?.detail ?? project.outcome}</dd></div>
</dl>
