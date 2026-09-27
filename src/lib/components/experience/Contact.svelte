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

  async function copyEmail() {
    status = await copyText('miguelalmeida1592@gmail.com')
      ? 'Email copied.'
      : 'Select the email address to copy it.';
    clearTimeout(timer);
    timer = setTimeout(() => status = '', 3000);
  }

  onDestroy(() => clearTimeout(timer));
</script>

<footer id="contact" class="relative isolate overflow-clip bg-forest text-paper">
  <div class="shell relative pt-10 pb-7 sm:pt-12 min-[60rem]:pt-16 min-[60rem]:pb-8">
    <div use:contactSignature class="relative z-10 grid content-start gap-7 sm:grid-cols-2 min-[60rem]:min-h-80 min-[60rem]:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,.72fr)] min-[60rem]:gap-10">
      <div class="min-w-0 min-[60rem]:grid min-[60rem]:auto-rows-[3.5rem] min-[60rem]:content-start min-[60rem]:pt-6">
        <h2 class="display-type text-[clamp(3.5rem,6.8vw,6rem)] leading-[.9] min-[60rem]:whitespace-nowrap min-[60rem]:flex min-[60rem]:items-center min-[60rem]:text-5xl min-[60rem]:leading-none">Contact.</h2>
        <div class="mt-4 flex flex-wrap items-center gap-1 min-[60rem]:mt-0 min-[60rem]:flex-nowrap">
          <a class="min-h-11 min-w-0 content-center break-all text-sm underline-offset-4 hover:underline focus-visible:outline-paper" href="mailto:miguelalmeida1592@gmail.com">miguelalmeida1592@gmail.com</a>
          <button class="flex size-11 shrink-0 items-center justify-center rounded-md hover:bg-paper/10 focus-visible:outline-paper" aria-label="Copy email address" onclick={copyEmail}>
            {#if status === 'Email copied.'}<Check aria-hidden="true" size={16} />{:else}<Copy aria-hidden="true" size={16} />{/if}
          </button>
        </div>
        <p class="text-sm text-paper/80 min-[60rem]:flex min-[60rem]:items-center">Berlin, Germany</p>
        <p role="status" class="sr-only">{status}</p>
      </div>

      <nav aria-label="Social and résumé links" class="grid min-w-0 grid-cols-3 gap-x-4 sm:w-full sm:max-w-56 sm:grid-cols-1 sm:justify-self-end sm:self-center min-[60rem]:col-start-3 min-[60rem]:max-w-none min-[60rem]:self-start">
        {#each [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/miguelalmeida1/' }, { label: 'GitHub', href: 'https://github.com/miguelalmeida0' }, { label: 'Résumé', href: '/cv' }] as link}
          <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" class="group flex min-h-12 items-center justify-between gap-2 border-b border-paper/40 text-sm transition-colors hover:text-white focus-visible:outline-paper sm:min-h-14 sm:text-base sm:leading-none">
            <span>{link.label}</span>{#if link.href.startsWith('http')}<ArrowUpRight size={16} aria-hidden="true" class="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />{:else}<ArrowRight size={16} aria-hidden="true" class="shrink-0 transition-transform group-hover:translate-x-0.5" />{/if}
          </a>
        {/each}
      </nav>
    </div>

    <div aria-hidden="true" class="pointer-events-none relative mx-auto mt-8 h-[clamp(15rem,45vw,22rem)] w-4/5 max-w-[26rem] min-[60rem]:absolute min-[60rem]:inset-x-0 min-[60rem]:top-16 min-[60rem]:bottom-0 min-[60rem]:mt-0 min-[60rem]:h-auto min-[60rem]:w-[52%] min-[60rem]:max-w-[38rem]">
      <ContactPortrait />
    </div>

    <p use:contactSignature={true} class="relative z-20 -mt-16 origin-bottom text-center font-wordmark text-[clamp(1.85rem,10.8vw,8rem)] leading-[.9] font-bold tracking-[-.035em] whitespace-nowrap min-[60rem]:mt-6 min-[60rem]:text-[clamp(2.1rem,6vw,5.5rem)]">MIGUEL ALMEIDA<span data-contact-rule aria-hidden="true" class="pointer-events-none absolute inset-x-0 -bottom-3 h-px origin-left bg-paper/30"></span></p>
  </div>
</footer>
