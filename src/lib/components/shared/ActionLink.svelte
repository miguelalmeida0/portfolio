<script lang="ts">
  import { scrollToHash } from '$lib/utils/anchors';

  export let href: string;
  export let variant: 'primary' | 'ghost' | 'nav' | 'pill' = 'primary';
  export let className = '';
  export let download: string | boolean | undefined = undefined;
  export let smoothHash = false;

  const externalPattern = /^https?:\/\//;

  $: isExternal = externalPattern.test(href);
  $: target = isExternal ? '_blank' : undefined;
  $: rel = isExternal ? 'noopener noreferrer' : undefined;

  $: variantClass =
    variant === 'ghost'
      ? 'interactive-button border border-border/70 bg-transparent text-foreground hover:bg-card/70'
      : variant === 'nav'
        ? 'interactive-button text-muted-foreground hover:text-foreground'
        : variant === 'pill'
          ? 'interactive-button border border-border/60 bg-card/65 text-foreground hover:bg-card'
          : 'interactive-button button-solid hover:opacity-96';

  const handleClick = (event: MouseEvent) => {
    if (!smoothHash || !href.startsWith('#')) return;
    event.preventDefault();
    scrollToHash(href);
  };
</script>

<a
  {href}
  {target}
  {rel}
  {download}
  on:click={handleClick}
  class={`inline-flex items-center gap-2 rounded-full px-5 py-3 font-sans text-[12px] font-semibold ${variantClass} ${className}`}
>
  <slot />
</a>
