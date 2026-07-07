<script lang="ts">
  import { onMount } from 'svelte';

  import { site } from '$lib/content/folio';

  let time = '--:--';

  const updateTime = () => {
    time = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Berlin'
    });
  };

  onMount(() => {
    updateTime();
    const interval = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(interval);
  });
</script>

<div class="pointer-events-none fixed inset-x-0 bottom-0 z-40 print:hidden">
  <div class="mx-auto mb-3 flex max-w-[1400px] items-center justify-between rounded-full border border-border/60 bg-background/78 px-4 py-2 backdrop-blur-xl sm:px-5">
    <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
      <span class="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle"></span>
      Available · CET
    </span>
    <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
      {site.location} {time} · {site.temperatureC}°C
    </span>
  </div>
</div>
