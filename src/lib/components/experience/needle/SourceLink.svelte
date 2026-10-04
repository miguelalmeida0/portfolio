<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  let { href, label }: { href: string; label: string } = $props();
</script>
<a {href} {...destinationLink(href)} class="mt-5 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">{label}<span class="sr-only"> (opens in a new tab)</span></a>
