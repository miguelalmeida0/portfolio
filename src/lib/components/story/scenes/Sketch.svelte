<script lang="ts">
  import data from '$lib/story/story.json';
  import type { SceneState } from '$lib/story/scenes';
  let { state }: { state: SceneState } = $props();
</script>
<div class="sketch"><div class="sketch-lines" aria-hidden="true"><i></i><b></b><i></i><i></i><b></b></div><ol>{#each data.scenes.ux.notes as note, i}<li class:revealed={state.notes > i}>{note}</li>{/each}</ol></div>
