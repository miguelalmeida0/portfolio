<script lang="ts">
  import { onDestroy } from 'svelte';

  import { copyText } from '$lib/utils/clipboard';

  type Variant = 'tile' | 'line' | 'compact';
  type CopyState = 'idle' | 'success' | 'error';

  export let email: string;
  export let label = 'Email';
  export let variant: Variant = 'tile';
  export let className = '';
  export let testId: string | undefined = undefined;

  const successMessage = 'Email copied ✓ — feel free to reach out anytime.';
  const failureMessage = 'Couldn’t copy automatically — please copy manually';

  let copyState: CopyState = 'idle';
  let toastVisible = false;
  let liveMessage = '';
  let resetTimeout: ReturnType<typeof setTimeout> | null = null;
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;
  let unlockTimeout: ReturnType<typeof setTimeout> | null = null;
  let locked = false;

  $: isSuccess = copyState === 'success';
  $: isError = copyState === 'error';
  $: feedbackMessage = isSuccess ? successMessage : isError ? failureMessage : '';
  $: actionLabel = isSuccess ? 'Copied' : isError ? 'Retry' : 'Copy';
  $: buttonClass = `${baseClass} ${
    variant === 'line' ? lineClass : variant === 'compact' ? compactClass : tileClass
  } ${className}`;
  $: toastClass = `${toastBaseClass} ${
    variant === 'line' ? lineToastClass : variant === 'compact' ? compactToastClass : tileToastClass
  } ${toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`;

  const baseClass =
    'group/copy-email interactive-copy relative text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/45';
  const tileClass =
    'interactive-surface flex min-h-[168px] w-full flex-col justify-center gap-6 overflow-hidden px-8 py-9 hover:bg-card/50 focus-visible:bg-card/50 sm:px-11 sm:py-10';
  const lineClass =
    'interactive-row block w-full border-b border-border/60 py-5 hover:bg-card/20 focus-visible:bg-card/20';
  const compactClass =
    'interactive-row -mx-2 flex min-h-11 w-[calc(100%+1rem)] items-center justify-between gap-4 rounded-lg px-2 py-2 break-all hover:bg-card/45 focus-visible:bg-card/45';
  const toastBaseClass =
    'pointer-events-none absolute z-20 max-w-[min(23rem,calc(100%-2rem))] rounded-full border border-border/70 bg-background/92 px-3.5 py-2 font-mono text-[10px] leading-snug tracking-[0.02em] text-foreground shadow-[0_18px_48px_-28px_oklch(0_0_0_/_0.55)] backdrop-blur-xl transition-all duration-200 ease-out';
  const tileToastClass = 'right-5 top-5 sm:right-8';
  const lineToastClass = 'right-0 top-[calc(100%+0.5rem)]';
  const compactToastClass = 'right-0 top-[calc(100%+0.35rem)]';

  onDestroy(() => {
    if (resetTimeout) clearTimeout(resetTimeout);
    if (hideTimeout) clearTimeout(hideTimeout);
    if (unlockTimeout) clearTimeout(unlockTimeout);
  });

  const queueFeedback = (state: CopyState) => {
    if (resetTimeout) clearTimeout(resetTimeout);
    if (hideTimeout) clearTimeout(hideTimeout);

    copyState = state;
    liveMessage = state === 'success' ? 'Email copied' : failureMessage;
    toastVisible = true;

    resetTimeout = setTimeout(() => {
      toastVisible = false;
      hideTimeout = setTimeout(() => {
        copyState = 'idle';
        liveMessage = '';
      }, 240);
    }, 2100);
  };

  const copyEmail = async () => {
    if (locked) return;

    locked = true;
    if (unlockTimeout) clearTimeout(unlockTimeout);
    unlockTimeout = setTimeout(() => {
      locked = false;
    }, 350);

    const didCopy = await copyText(email);
    queueFeedback(didCopy ? 'success' : 'error');
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (!['Enter', ' ', 'Spacebar'].includes(event.key)) return;

    event.preventDefault();
    void copyEmail();
  };
</script>

<button
  type="button"
  data-testid={testId}
  aria-label="Copy email address to clipboard"
  on:click={copyEmail}
  on:keydown={handleKeydown}
  class={buttonClass}
>
  {#if variant === 'tile'}
    <span class="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
      {label}
    </span>
    <span class="grid gap-4">
      <span
        class="min-w-0 break-all font-display text-[clamp(1.05rem,1.25vw,1.42rem)] leading-tight tracking-[-0.01em] text-foreground transition-colors duration-[var(--interaction-duration)] group-hover/copy-email:text-accent group-focus-visible/copy-email:text-accent sm:break-normal"
      >
        {email}
      </span>
      <span
        class="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-border/70 bg-background/45 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-all duration-[var(--interaction-duration)] group-hover/copy-email:border-accent/45 group-hover/copy-email:text-accent group-focus-visible/copy-email:border-accent/45 group-focus-visible/copy-email:text-accent"
        aria-hidden="true"
      >
        <span>{actionLabel}</span>
        <span
          class={`grid size-4 place-items-center rounded-full border border-current text-[9px] transition-all duration-200 ${
            isSuccess ? 'scale-100 opacity-100' : 'scale-75 opacity-45'
          }`}
        >
          ✓
        </span>
      </span>
    </span>
  {:else if variant === 'line'}
    <span class="grid gap-2 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-start sm:gap-6">
      <span class="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </span>
      <span
        class="break-all font-display text-[clamp(1.15rem,1.45vw,1.45rem)] leading-[1.05] tracking-[-0.02em] text-foreground transition-colors duration-[var(--interaction-duration)] group-hover/copy-email:text-accent group-focus-visible/copy-email:text-accent"
      >
        {email}
      </span>
      <span
        class="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover/copy-email:text-accent group-focus-visible/copy-email:text-accent"
        aria-hidden="true"
      >
        {actionLabel}
      </span>
    </span>
  {:else}
    <span class="min-w-0 break-all">{email}</span>
    <span
      class="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover/copy-email:text-accent group-focus-visible/copy-email:text-accent"
      aria-hidden="true"
    >
      {actionLabel}
    </span>
  {/if}

  {#if feedbackMessage}
    <span class={toastClass} aria-hidden="true">
      {feedbackMessage}
    </span>
  {/if}

  <span class="sr-only" aria-live="polite" aria-atomic="true">{liveMessage}</span>
</button>
