<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { tokens } from '$lib/design/tokens';
  import { cn } from '$lib/utils/cn';

  export let href: string;
  export let label: string;
  export let variant: 'primary' | 'secondary' = 'secondary';
  export let download = false;
  export let ariaLabel: string | undefined = undefined;
  export let className = '';

  const variantClassMap = {
    primary: tokens.surfaces.heroButtonPrimary,
    secondary: tokens.surfaces.heroButtonSecondary
  } as const;

</script>

<a
  class={cn(variantClassMap[variant], className)}
  href={href}
  aria-label={ariaLabel}
  download={download}

   {...destinationLink(href, download)}
>
  <span>{label}</span>
  <span aria-hidden="true">↗</span>
</a>
