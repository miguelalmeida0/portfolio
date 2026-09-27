<script lang="ts">
  import { authors, strengths, type Author, type Strength } from '$lib/experience/samples';
  let { author = $bindable<Author>('Tolkien'), strength = $bindable<Strength>('Balanced'), disabled = false }: {
    author?: Author; strength?: Strength; disabled?: boolean;
  } = $props();
  const id = $props.id();
</script>
<fieldset {disabled}>
  <legend class="mb-2 text-sm text-muted">Choose an author</legend>
  <div class="grid grid-cols-2 gap-1 min-[23rem]:grid-cols-4 sm:gap-2">
    {#each authors as name}
      <label class="relative flex min-h-11 min-w-0 cursor-pointer font-serif text-[clamp(.8rem,.74rem+.25vw,.95rem)]">
        <input type="radio" name={id+'-author'} value={name} bind:group={author} class="peer sr-only" />
        <span class="flex min-h-11 w-full items-center justify-center whitespace-nowrap border-b-2 px-1 transition-colors duration-200 {author === name ? 'border-plum font-semibold text-plum' : 'border-transparent text-muted hover:border-rule hover:text-ink'} peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-plum peer-disabled:opacity-50">{name}</span>
      </label>
    {/each}
  </div>
</fieldset>
<fieldset {disabled} class="mt-3">
  <legend class="mb-1 text-sm text-muted">Voice strength</legend>
  <div class="flex gap-2">
    {#each strengths as option}
      <label class="relative flex min-h-11 flex-1 cursor-pointer">
        <input type="radio" name={id+'-strength'} value={option} bind:group={strength} class="peer sr-only" />
        <span class="flex w-full items-center justify-center rounded-md border-b-2 px-1 text-sm transition-colors {strength === option ? 'border-plum bg-ivory/70 font-semibold text-plum' : 'border-transparent text-muted hover:bg-ivory/60 hover:text-ink'} peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-plum peer-disabled:opacity-50">{option}</span>
      </label>
    {/each}
  </div>
</fieldset>
