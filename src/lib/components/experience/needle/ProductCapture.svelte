<script lang="ts">
  let { src, alt, width = 1440, height = 1000, eager = false }: { src: string; alt: string; width?: number; height?: number; eager?: boolean } = $props();
  let failed = $state(false);
</script>
{#if failed}
  <p role="status" class="flex min-h-48 items-center justify-center border border-[var(--color-rule)] p-8 text-center">Product capture unavailable. You can still explore Needle through the live product link.</p>
{:else}
  <img {src} {alt} {width} {height} loading={eager ? 'eager' : 'lazy'} onerror={() => failed = true} class="block h-auto w-full rounded-xl border border-[var(--color-rule)]" />
{/if}
