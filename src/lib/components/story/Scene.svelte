<script lang="ts">
  import type { SceneId, SceneRunner } from '$lib/story/scenes';
  import Glance from './scenes/Glance.svelte';
  import Sketch from './scenes/Sketch.svelte';
  import States from './scenes/States.svelte';
  import Incident from './scenes/Incident.svelte';
  import Failures from './scenes/Failures.svelte';
  import OwnTools from './scenes/OwnTools.svelte';
  import Request from './scenes/Request.svelte';
  import Boundary from './scenes/Boundary.svelte';
  let { id, runner, run }: { id: SceneId; runner: SceneRunner; run: (action: number) => void } = $props();
  const sceneState = $derived(runner.state);
</script>
{#if id === 'hi'}<Glance state={$sceneState} />
{:else if id === 'ux'}<Sketch state={$sceneState} />
{:else if id === 'build'}<States state={$sceneState} retry={() => run(3)} />
{:else if id === 'f24'}<Incident state={$sceneState} />
{:else if id === 'fail'}<Failures state={$sceneState} patch={runner.patch} retry={() => runner.patch({ mode: 0, request: 0 })} />
{:else if id === 'own'}<OwnTools state={$sceneState} />
{:else if id === 'love'}<Request state={$sceneState} patch={runner.patch} />
{:else}<Boundary state={$sceneState} />{/if}
