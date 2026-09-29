<script lang="ts">
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import Copy from '@lucide/svelte/icons/copy';
  import Check from '@lucide/svelte/icons/check';
  import { copyText } from '$lib/experience/motion';
  import ContactPortrait from './ContactPortrait.svelte';
  import { onDestroy } from 'svelte';
  import { contactSignature } from '$lib/motion/signature';

  let status = $state('');
  let timer: ReturnType<typeof setTimeout>;

  const links = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/miguelalmeida1/' },
    { label: 'GitHub', href: 'https://github.com/miguelalmeida0' },
    { label: 'Résumé', href: '/cv' }
  ];

  async function copyEmail() {
    status = await copyText('miguelalmeida1592@gmail.com')
      ? 'Email copied.'
      : 'Select the email address to copy it.';
    clearTimeout(timer);
    timer = setTimeout(() => status = '', 3000);
  }

  onDestroy(() => clearTimeout(timer));
</script>

<footer id="contact" class="relative isolate overflow-hidden border-t border-rule bg-ivory text-ink">
  <div class="shell relative py-9 sm:py-12 min-[60rem]:py-16">
    <div class="flex items-center justify-between gap-4 border-b border-rule pb-4">
      <p class="label-type">Contact</p>
      <p class="text-sm text-muted">Berlin, Germany</p>
    </div>

    <div class="relative grid justify-items-center pt-8 sm:pt-10">
      <div aria-hidden="true" class="relative h-[clamp(18rem,42vw,31rem)] w-[min(80vw,31rem)]">
        <ContactPortrait />
      </div>

      <div use:contactSignature={true} class="relative z-10 -mt-2 text-center sm:-mt-5">
        <h2 class="font-wordmark relative inline-block text-[clamp(2.35rem,6.2vw,5.4rem)] leading-[.9] font-bold tracking-[-.045em] whitespace-nowrap">
          MIGUEL ALMEIDA
          <span data-contact-rule aria-hidden="true" class="pointer-events-none absolute inset-x-0 -bottom-3 h-px origin-left bg-plum"></span>
        </h2>
        <p class="mt-5 text-sm text-muted sm:text-base">Frontend developer &amp; design engineer</p>
      </div>
    </div>

    <nav aria-label="Social, résumé and contact links" class="mx-auto mt-8 grid max-w-5xl border-y border-rule min-[48rem]:grid-cols-[repeat(3,minmax(0,1fr))_minmax(14rem,1.45fr)]">
      {#each links as link}
        <a
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel="noopener noreferrer"
          class="group flex min-h-14 items-center justify-between gap-3 border-b border-rule px-4 text-sm transition-colors hover:bg-sage focus-visible:outline-plum min-[48rem]:border-r min-[48rem]:border-b-0 sm:text-base"
        >
          <span>{link.label}</span>
          {#if link.href.startsWith('http')}
            <ArrowUpRight
              size={17}
              aria-hidden="true"
              class="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          {:else}
            <ArrowRight
              size={17}
              aria-hidden="true"
              class="shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          {/if}
        </a>
      {/each}
      <a
        href="mailto:miguelalmeida1592@gmail.com"
        class="group flex min-h-14 items-center justify-between gap-4 bg-forest px-5 text-sm font-semibold text-paper transition-colors hover:bg-ink focus-visible:outline-plum sm:text-base"
      >
        <span>Let’s talk</span>
        <ArrowRight size={19} aria-hidden="true" class="transition-transform group-hover:translate-x-1" />
      </a>
    </nav>

    <div class="mt-5 flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div class="flex min-w-0 flex-wrap items-center gap-1">
        <a
          class="min-h-11 min-w-0 content-center break-all underline-offset-4 hover:underline"
          href="mailto:miguelalmeida1592@gmail.com"
        >
          miguelalmeida1592@gmail.com
        </a>
        <button
          type="button"
          class="flex size-11 shrink-0 items-center justify-center rounded-md hover:bg-sage focus-visible:outline-plum"
          aria-label="Copy email address"
          onclick={copyEmail}
        >
          {#if status === 'Email copied.'}
            <Check aria-hidden="true" size={16} />
          {:else}
            <Copy aria-hidden="true" size={16} />
          {/if}
        </button>
        <span role="status" class="text-xs text-muted">{status}</span>
      </div>
      <p class="shrink-0 text-xs text-muted">© {new Date().getFullYear()} Miguel Almeida</p>
    </div>
  </div>
</footer>
