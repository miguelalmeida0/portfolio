<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import Copy from '@lucide/svelte/icons/copy';
  let copied = $state(false); let copyError = $state(false);
  async function copy() { try { await navigator.clipboard.writeText('miguelalmeida1592@gmail.com'); copied = true; } catch { copyError = true; } }
</script>
<footer id="contact" class="relative isolate overflow-hidden bg-folio-ink px-[4.4%] pt-10 pb-10 text-folio-paper sm:pt-14">
  <img src="/images/miguel-contact-monochrome.webp" alt="Miguel Almeida" width="1100" height="1444" loading="lazy" class="absolute inset-x-0 top-2 -z-10 mx-auto h-[115%] w-auto max-w-none object-contain sm:h-[145%]" />
  <div class="flex min-h-[340px] justify-between gap-5 sm:min-h-[29vw]">
    <div class="z-10 self-start">
      <h2 class="text-[clamp(4rem,11vw,11rem)] leading-[.88] font-black tracking-[-.06em]">Let’s<br />talk.</h2>
      <div class="mt-4 flex flex-wrap items-center gap-2 text-sm sm:text-base"><a href="mailto:miguelalmeida1592@gmail.com" class="hover:underline" {...destinationLink("mailto:miguelalmeida1592@gmail.com")}>miguelalmeida1592@gmail.com</a><button type="button" aria-label="Copy email address" onclick={copy} class="flex size-11 cursor-pointer items-center justify-center"><Copy size={18} /></button></div>
      <p class="text-sm sm:text-base">Berlin, Germany</p>
      <span role="status" class="text-xs">{copied ? 'Email copied.' : copyError ? 'Please copy the email address above.' : ''}</span>
    </div>
    <nav aria-label="Social and résumé links" class="z-10 mt-4 w-24 shrink-0 text-sm sm:mt-12 sm:w-44 sm:text-base">
      {#each [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/miguelalmeida1/' }, { label: 'GitHub', href: 'https://github.com/miguelalmeida0' }, { label: 'Résumé', href: '/portfolio.pdf' }] as item}
        <a href={item.href}   class="mb-3 flex min-h-11 items-center justify-between gap-2 border-b border-folio-paper/60 hover:opacity-75" {...destinationLink(item.href)}>{item.label}<ArrowUpRight size={18} /></a>
      {/each}
    </nav>
  </div>
  <p class="relative z-20 whitespace-nowrap font-folio-wordmark text-[14vw] leading-none font-black tracking-[-.055em]" aria-label="Miguel Almeida">MIGUEL ALMEIDA</p>
</footer>

