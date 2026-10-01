<script lang="ts">
  let { stack }: { stack: string[] } = $props();
</script>

<p class="project-stack" data-project-stack><span class="sr-only">Built with: </span>{stack.join(' · ')}</p>
