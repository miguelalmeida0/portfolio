<script lang="ts">
  import { onMount } from 'svelte';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  const appUrl = 'https://secondvoice-ai.vercel.app/second-voice';
  const embedUrl = appUrl + '/embed';
  let frame = $state<HTMLIFrameElement>();
  let ready = $state(false);
  let loading = $state(false);
  let unavailable = $state(false);
  let height = $state(760);
  let timeout: ReturnType<typeof setTimeout> | undefined;
  function launch() {
    unavailable = false; loading = true;
    timeout = setTimeout(() => { if (!ready) { unavailable = true; loading = false; } }, 12000);
  }
  onMount(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== new URL(appUrl).origin || event.source !== frame?.contentWindow) return;
      if (event.data?.type !== 'second-voice:ready' || event.data?.version !== 1) return;
      ready = true; loading = false; clearTimeout(timeout);
      if (typeof event.data.height === 'number' && Number.isFinite(event.data.height)) height = Math.max(580, Math.min(2000, event.data.height));
    };
    window.addEventListener('message', receive);
    return () => { window.removeEventListener('message', receive); clearTimeout(timeout); };
  });
</script>
<div class="relative bg-folio-black text-white">
  {#if loading || ready}
    <iframe bind:this={frame} src={embedUrl} title="Use Second Voice AI" class="w-full border-0 {ready ? 'block' : 'absolute inset-0 pointer-events-none opacity-0'}" style:height={height + 'px'} inert={!ready} aria-hidden={!ready} allow="clipboard-write" referrerpolicy="strict-origin-when-cross-origin"></iframe>
  {/if}
  {#if !ready}
    <div class="relative">
      <img src="/projects/ghostwriter/ghostwriter-demo-poster.webp" alt="Preview of the Second Voice writing workspace" class="aspect-[1.65] min-h-80 w-full object-cover object-top opacity-60" width="1600" height="900" />
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/25 px-6 text-center">
        <span class="text-xs tracking-[.18em] uppercase">Second Voice AI</span>
        <h2 class="max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">Your words.<br />Another voice.</h2>
        {#if unavailable}
          <p role="status" class="max-w-sm text-sm text-white/85">The embedded studio isn’t available yet. You can use Second Voice in the full app.</p>
          <a href={appUrl} target="_blank" rel="noopener noreferrer" class="inline-flex min-h-[48px] items-center gap-3 rounded-md bg-folio-blue px-6 font-semibold text-black">Open Second Voice <ArrowUpRight size={18} /></a>
        {:else}
          <button type="button" onclick={launch} disabled={loading} class="min-h-[48px] cursor-pointer rounded-md bg-folio-blue px-6 font-semibold text-black disabled:cursor-wait disabled:opacity-70">{loading ? 'Opening the studio…' : 'Try Second Voice here'}</button>
          <p class="max-w-sm text-xs text-white/75" role="status">{loading ? 'Connecting to Second Voice.' : 'Write a passage, pick an author, and run a real rewrite.'}</p>
        {/if}
      </div>
    </div>
  {/if}
</div>

