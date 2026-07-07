<script lang="ts">
  import { onMount } from 'svelte';

  const SESSION_KEY = 'intro-seen-2026';
  const message = 'Made by hand, in Berlin.';
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
  const TYPE_INTERVAL_MS = 24;
  const HOLD_MS = 120;
  const FADE_MS = 260;

  export let initialVisible: boolean | undefined = undefined;

  let visible = initialVisible ?? false;
  let fading = false;
  let typed = '';
  let typingTimer: number | undefined;
  let holdTimer: number | undefined;
  let fadeTimer: number | undefined;

  const cornerLabels = [
    { text: '✦ Miguel Almeida', className: 'left-6 top-5' },
    { text: '26 / 2026', className: 'right-6 top-5 text-right' },
    { text: '52.52° N · 13.40° E', className: 'bottom-6 left-6' },
    { text: 'MA · 26-A', className: 'bottom-6 right-6 text-right' }
  ];

  const markSeen = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Ignore storage failures.
    }

    document.cookie = `${SESSION_KEY}=1; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  };

  const hasSeenIntro = () => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') return true;
    } catch {
      // Ignore storage failures.
    }

    return document.cookie
      .split(';')
      .some((cookie) => cookie.trim().startsWith(`${SESSION_KEY}=1`));
  };

  const clearIntroTimers = () => {
    if (typingTimer) window.clearInterval(typingTimer);
    if (holdTimer) window.clearTimeout(holdTimer);
    if (fadeTimer) window.clearTimeout(fadeTimer);
  };

  const lockScroll = () => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  };

  const unlockScroll = () => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  };

  const dismissIntro = (immediate = false) => {
    clearIntroTimers();

    if (immediate) {
      visible = false;
      fading = false;
      markSeen();
      unlockScroll();
      return;
    }

    if (fading) return;
    fading = true;

    fadeTimer = window.setTimeout(() => {
      visible = false;
      markSeen();
      unlockScroll();
    }, FADE_MS);
  };

  const handleOverlayKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    dismissIntro(true);
  };

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      visible = false;
      markSeen();
      return;
    }

    if (hasSeenIntro()) {
      visible = false;
      return;
    }

    if (initialVisible === undefined) {
      visible = true;
    } else if (!initialVisible) {
      return;
    }

    lockScroll();

    let index = 0;
    const skipIntro = () => dismissIntro(true);

    window.addEventListener('pointerdown', skipIntro, { once: true });
    window.addEventListener('keydown', skipIntro, { once: true });

    typingTimer = window.setInterval(() => {
      typed = message.slice(0, index + 1);
      index += 1;

      if (index >= message.length) {
        if (typingTimer) window.clearInterval(typingTimer);

        holdTimer = window.setTimeout(() => {
          dismissIntro();
        }, HOLD_MS);
      }
    }, TYPE_INTERVAL_MS);

    return () => {
      clearIntroTimers();
      window.removeEventListener('pointerdown', skipIntro);
      window.removeEventListener('keydown', skipIntro);
      unlockScroll();
    };
  });
</script>

{#if visible}
  <div
    class={`fixed inset-0 z-[120] flex items-center justify-center bg-background px-6 transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)] ${fading ? 'opacity-0' : 'opacity-100'}`}
    style={`transition-duration:${FADE_MS}ms;`}
    data-testid="intro-overlay"
    role="button"
    tabindex="0"
    aria-label="Skip intro"
    on:click={() => dismissIntro(true)}
    on:keydown={handleOverlayKeydown}
  >
    {#each cornerLabels as corner}
      <div class={`pointer-events-none absolute font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground ${corner.className}`}>
        {corner.text}
      </div>
    {/each}

    <div class="max-w-3xl text-center font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.96] tracking-tight text-foreground">
      {#if typed.includes('Berlin')}
        {typed.slice(0, typed.indexOf('Berlin'))}<span class="text-accent">Berlin</span>{typed.slice(
          typed.indexOf('Berlin') + 'Berlin'.length
        )}
      {:else}
        {typed}
      {/if}
      <span class="ml-1 inline-block h-[0.9em] w-[0.05em] translate-y-[0.08em] bg-accent animate-blink"></span>
    </div>
  </div>
{/if}
