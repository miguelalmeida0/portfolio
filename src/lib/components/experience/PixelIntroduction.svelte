<script lang="ts">
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ArrowDown from '@lucide/svelte/icons/arrow-down';
  import { pixelIntroduction } from '$lib/motion/pixel-introduction';

  const crops = ['inset(0 50% 50% 0)', 'inset(0 0 50% 50%)', 'inset(50% 50% 0 0)', 'inset(50% 0 0 50%)'];
</script>

<section use:pixelIntroduction data-pixel-intro aria-label="Meet Miguel Almeida" class="fixed inset-0 z-60 overflow-hidden text-paper no-print">
  <div data-intro-backdrop class="absolute inset-0 bg-forest"></div>

  <div data-intro-secondary class="absolute inset-x-[3.8%] top-[3.8%] flex items-center justify-between gap-4">
    <p class="text-sm font-medium sm:text-base">Portfolio</p>
    <a data-intro-exit href="#work" class="group flex min-h-12 items-center gap-3 border-b-2 border-paper/80 text-base font-bold transition-colors hover:text-white focus-visible:outline-paper sm:text-xl">
      View work<ArrowRight aria-hidden="true" size={23} class="transition-transform duration-150 group-hover:translate-x-0.5" />
    </a>
  </div>

  <div class="absolute inset-x-[3.8%] top-[53%] -translate-y-1/2 max-sm:top-1/2">
    <p data-intro-secondary class="mb-[2.4vw] ml-[11.3%] text-[clamp(1.125rem,2.05vw,2rem)] font-medium tracking-[-.025em] max-sm:mb-5 max-sm:ml-0 max-sm:text-center">Olá. I’m Miguel.</p>

    <div data-intro-wordmark aria-hidden="true" class="grid grid-cols-[minmax(0,1fr)_15.3%_minmax(0,1fr)] items-center gap-[1.5%] max-sm:grid-cols-1 max-sm:justify-items-center max-sm:gap-3">
      <span data-intro-first aria-hidden="true" class="block w-max origin-top-left justify-self-end whitespace-nowrap text-right font-wordmark text-[clamp(3.75rem,12.9vw,16rem)] leading-none font-bold tracking-[-.035em] max-sm:justify-self-center max-sm:text-[clamp(4rem,18vw,6rem)]">MIGUEL</span>
      <span data-intro-portrait aria-hidden="true" class="relative block aspect-square w-full origin-top-left max-sm:w-[clamp(5rem,22vw,7.5rem)]">
        <img data-intro-avatar src="/images/avatar-192.png" alt="" width="192" height="192" fetchpriority="high" class="block size-full object-cover opacity-0 [image-rendering:pixelated]" />
        {#each crops as crop, index}
          <img data-intro-tile src="/images/avatar-192.png" alt="" width="192" height="192" class="pointer-events-none absolute inset-0 size-full object-cover [image-rendering:pixelated]" style:clip-path={crop} style:transform={`translate(${index % 2 ? 10 : -10}px, ${index < 2 ? -10 : 10}px)`} />
        {/each}
        <span data-intro-reaction aria-hidden="true" class="pointer-events-none absolute inset-0 block opacity-0 [mask-image:radial-gradient(ellipse_26%_12%_at_50%_40%,black_65%,transparent_100%)]">
          <img data-intro-reaction-image src="/images/avatar-relaxed-gaze.webp" alt="" width="1254" height="1254" fetchpriority="high" class="absolute left-[-3%] top-[-16.9%] h-[121%] w-[120.3%] max-w-none [image-rendering:pixelated]" />
        </span>
        <span data-intro-mouth aria-hidden="true" class="pointer-events-none absolute inset-0 block opacity-0 [mask-image:radial-gradient(ellipse_20%_13%_at_50%_63%,black_65%,transparent_100%)]">
          <img src="/images/avatar-relaxed-gaze.webp" alt="" width="1254" height="1254" class="absolute left-[-3%] top-[-16.9%] h-[121%] w-[120.3%] max-w-none [image-rendering:pixelated]" />
        </span>
        <img data-intro-frame src="/images/portrait-registration.webp" alt="" width="512" height="512" class="pointer-events-none absolute -inset-[13%] size-[126%] max-w-none" />
      </span>
      <span data-intro-last aria-hidden="true" class="block w-max origin-top-left scale-x-[.865] whitespace-nowrap font-wordmark text-[clamp(3.75rem,12.9vw,16rem)] leading-none font-bold tracking-[-.035em] max-sm:scale-x-100 max-sm:text-[clamp(3.6rem,16.5vw,5.5rem)]">ALMEIDA</span>
    </div>

    <div data-intro-secondary class="mt-[5.4vw] text-center max-sm:mt-6">
      <p class="text-[clamp(1.25rem,3.3vw,3.25rem)] leading-[1.15] font-bold tracking-[-.035em] max-sm:mx-auto max-sm:max-w-[22ch] max-sm:text-[clamp(1.25rem,5.6vw,1.75rem)]">Frontend developer &amp; design engineer.</p>
      <p class="mt-5 text-[clamp(.875rem,1.65vw,1.5rem)] text-paper/80 max-sm:mt-3">React · Svelte · TypeScript</p>
    </div>
  </div>

  <div data-intro-secondary class="absolute inset-x-[3.8%] bottom-[4.7%] flex items-center justify-between gap-4 text-sm max-sm:flex-col max-sm:items-start max-sm:gap-2 sm:text-base">
    <p>Berlin, Germany</p>
    <button type="button" data-intro-exit class="group flex min-h-11 items-center gap-3 underline-offset-4 hover:underline focus-visible:outline-paper">
      <ArrowDown aria-hidden="true" size={22} class="transition-transform duration-150 group-hover:translate-y-0.5" /><span class="hidden sm:inline">Scroll to enter · start at the top</span><span class="sm:hidden">Scroll to enter</span>
    </button>
  </div>
</section>
