<script lang="ts">
  import RevealHeading from './RevealHeading.svelte';
</script>

<section class="page-gutter py-16 sm:py-20 md:py-28">
  <div class="mx-auto grid max-w-[1400px] items-start gap-10 lg:grid-cols-12 lg:gap-12">
    <div class="lg:col-span-7">
      <RevealHeading
        className="font-display text-[clamp(2.25rem,7vw,5rem)] leading-[0.95] tracking-tight"
      >
        I build <em class="not-italic text-accent">frontends</em> that feel <em class="not-italic">calm</em>, considered
        <em class="not-italic text-accent">and made by hand.</em>
      </RevealHeading>
    </div>

    <div class="space-y-4 lg:col-span-5 lg:pt-10">
      <div class="rounded-2xl bg-foreground p-5 text-background sm:p-7">
        <div class="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] opacity-65">
          In practice
        </div>
        <p class="font-display text-lg font-semibold leading-snug sm:text-xl md:text-2xl">
          The web feels more human when nothing screams and everything simply works.
        </p>
      </div>

      <div class="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur sm:p-7">
        <p class="leading-relaxed text-foreground/85">
          I care about the small frictions: how a focus state feels, how a menu lands, how a
          list breathes when it loads. The compound of those small choices is what makes a
          product feel <em class="not-italic text-accent">trustworthy</em>.
        </p>
      </div>
    </div>
  </div>
</section>
