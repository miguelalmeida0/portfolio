<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import Menu from '@lucide/svelte/icons/menu';
  import X from '@lucide/svelte/icons/x';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { motionState } from '$lib/motion/policy';
  let open = $state(false);
  let trigger: HTMLButtonElement;
  afterNavigate(() => { open = false; });
  function escape(event: KeyboardEvent) { if (event.key === 'Escape' && open) { open = false; trigger?.focus(); } }
</script>
<svelte:window onkeydown={escape} />
<header class="shell relative z-30 no-print py-4 sm:py-5">
  <div class="flex items-center justify-between gap-4">
    <a href="/" data-identity-home class="group flex min-h-11 min-w-0 items-center gap-3 rounded-lg sm:gap-4" aria-label="Miguel Almeida — home">
      <img data-identity-avatar src="/images/avatar-192.png" alt="" width="192" height="192" class="size-10 shrink-0 rounded-lg object-cover transition-transform duration-200 ease-settle sm:size-13 {$motionState.reduced ? '' : 'group-hover:-rotate-3 group-hover:scale-105 group-focus-visible:-rotate-3'}" />
      <span class="flex min-w-0 flex-col items-start sm:flex-row sm:items-center sm:gap-7">
        <span data-identity-name class="identity-name font-wordmark relative inline-block origin-top-left whitespace-nowrap text-base leading-tight font-bold tracking-[-.035em] transition-colors group-hover:text-plum min-[24rem]:text-lg sm:text-xl"><span data-identity-first class="inline-block">MIGUEL</span> <span data-identity-last class="inline-block">ALMEIDA</span><span data-identity-rule aria-hidden="true" class="pointer-events-none absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-plum"></span></span>
        <span data-identity-location class="mt-1 text-xs sm:mt-0 sm:text-sm">Berlin</span>
      </span>
    </a>
    <nav aria-label="Main navigation" class="hidden items-center gap-7 text-sm min-[45rem]:flex">
      <a class="ink-link hover:text-plum hover:underline" href="/#work">Work</a>
      <a class="ink-link hover:text-plum hover:underline" href="/story">Story</a>
      <a class="group ink-link hover:text-plum hover:underline" href="/cv">CV <ArrowRight size={18} aria-hidden="true" class="transition-transform group-hover:translate-x-0.5" /></a>
      <a class="ink-link hover:text-plum hover:underline" href="#contact">Contact</a>
    </nav>
    <button bind:this={trigger} onclick={() => open = !open} aria-expanded={open} aria-controls="mobile-navigation" class="flex min-h-11 items-center gap-3 text-base min-[45rem]:hidden">
      {open ? 'Close' : 'Menu'}{#if open}<X aria-hidden="true" size={23} />{:else}<Menu aria-hidden="true" size={23} />{/if}
    </button>
  </div>
  {#if open}
    <nav id="mobile-navigation" aria-label="Mobile navigation" transition:slide={{ duration: $motionState.reduced ? 0 : 250, easing: cubicOut }} class="absolute inset-x-0 top-full rounded-b-xl border border-rule bg-paper px-5 py-4 shadow-sm min-[45rem]:hidden">
      {#each [{label:'Selected work',href:'/#work'},{label:'CV & experience',href:'/cv'},{label:'My story',href:'/story'},{label:'Get in touch',href:'#contact'}] as link}
        <a href={link.href} onclick={() => open = false} class="flex min-h-12 items-center justify-between text-lg hover:text-plum">{link.label}<ArrowRight aria-hidden="true" size={20} /></a>
      {/each}
    </nav>
  {/if}
</header>
