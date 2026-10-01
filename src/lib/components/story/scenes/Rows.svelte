<script lang="ts">
  import data from '$lib/story/story.json';
  let { rows = data.scenes.rows, loading = false }: { rows?: string[][]; loading?: boolean } = $props();
</script>
<div class:skeleton={loading} aria-hidden={loading || undefined}>{#each rows as [time, title, kind]}<div class="activity-row"><span>{time}</span><span>{title}</span><span class="row-kind">{kind}</span></div>{/each}</div>
