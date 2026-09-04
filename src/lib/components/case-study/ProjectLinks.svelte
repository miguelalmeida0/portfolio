<script lang="ts">
  import type { ProjectLink } from '$lib/content/case-studies';

  export let links: ProjectLink[] = [];
</script>

<div class="project-links" aria-label="Project availability">
  {#each links as link}
    {#if link.href}
      <a
        href={link.href}
        target={link.external ? '_blank' : undefined}
        rel={link.external ? 'noopener noreferrer' : undefined}
      >
        {link.label}{link.external ? ' ↗' : ''}
      </a>
    {:else}
      <span data-status={link.status}>{link.label}</span>
    {/if}
  {/each}
</div>

<style>
  .project-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  a,
  span {
    display: inline-flex;
    min-height: 2.75rem;
    align-items: center;
    border: 1px solid rgb(244 234 220 / 0.22);
    border-radius: 999px;
    padding: 0.55rem 0.85rem;
    color: rgb(244 234 220 / 0.76);
    font-size: 0.82rem;
    font-weight: 700;
  }

  a:hover,
  a:focus-visible {
    border-color: var(--accent);
    color: var(--foreground);
    outline: none;
  }

  a:focus-visible {
    box-shadow: 0 0 0 2px var(--ring);
  }

  span {
    border-style: dashed;
    color: rgb(244 234 220 / 0.5);
  }
</style>
