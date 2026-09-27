<script lang="ts">import LinkButton from './LinkButton.svelte';</script>

<section aria-labelledby="intro-heading" class="shell grid gap-7 pt-7 pb-11 min-[51.25rem]:grid-cols-[1.45fr_1fr] min-[51.25rem]:items-center min-[51.25rem]:gap-12 min-[51.25rem]:pt-10 min-[51.25rem]:pb-12">
  <div class="min-w-0">
    <h1 id="intro-heading" class="display-type text-[clamp(2.75rem,1.7rem+3.4vw,4.75rem)] leading-[.98]">
      <span class="block">Frontend developer</span><span class="block">& design engineer.</span>
    </h1>
    <div class="mt-5 hidden min-[51.25rem]:block"><LinkButton href="/cv" label="View CV" /></div>
  </div>
  <div class="min-w-0 border-t border-rule pt-5 min-[51.25rem]:border-t-0 min-[51.25rem]:border-l min-[51.25rem]:pt-0 min-[51.25rem]:pl-8">
    <p class="label-type text-plum">F24 · 4 years in product delivery</p>
    <h2 class="mt-3 text-[clamp(1.45rem,1.1rem+1.3vw,2rem)] leading-[1.16] font-semibold tracking-[-.02em]">From scratch to hundreds of companies.</h2>
    <p class="mt-2 max-w-[32ch] font-serif text-lg leading-relaxed">Built the original Svelte frontend at F24, from first mockups to production.</p>
    <p class="mt-4 max-w-[40ch] text-sm leading-relaxed text-muted" aria-label="Core skills">React · Svelte · TypeScript<br />Tailwind CSS · Playwright</p>
  </div>
  <div class="min-[51.25rem]:hidden"><LinkButton href="/cv" label="View CV" /></div>
</section>
