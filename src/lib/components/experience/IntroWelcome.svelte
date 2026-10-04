<script lang="ts">
  import { onMount } from 'svelte';
  import { beforeNavigate } from '$app/navigation';
  import { motionState, prefersReducedMotion } from '$lib/motion/policy';

  let visible = $state(false);
  let leaving = $state(false);
  let lifetime: ReturnType<typeof setTimeout>;
  let removal: ReturnType<typeof setTimeout>;

  function dismiss() {
    clearTimeout(lifetime);
    clearTimeout(removal);
    visible = false;
    leaving = false;
  }
  beforeNavigate(dismiss);

  onMount(() => {
    const root = document.documentElement;
    const show = () => {
      const shortcut = root.dataset.introShortcut;
      if (!shortcut || root.dataset.presentation !== 'complete') return;
      delete root.dataset.introShortcut;
      if (prefersReducedMotion() || document.hidden || Date.now() - Number(shortcut) > 4000) return;
      visible = true;
      lifetime = setTimeout(() => {
        leaving = true;
        removal = setTimeout(dismiss, 380);
      }, 3400);
    };
    const observer = new MutationObserver(show);
    observer.observe(root, { attributes: true, attributeFilter: ['data-intro-shortcut', 'data-presentation'] });
    show();
    const unsubscribe = motionState.subscribe(({ reduced }) => { if (reduced) dismiss(); });
    const visibility = () => { if (document.hidden) dismiss(); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') dismiss(); };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('keydown', escape);
    return () => {
      dismiss();
      observer.disconnect();
      unsubscribe();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('keydown', escape);
    };
  });
</script>

<!-- An existing live region announces the welcome without moving keyboard focus. -->
<div class="welcome-position no-print" role="status" aria-live="polite" aria-atomic="true">
  {#if visible}
    <div class="welcome" class:leaving data-intro-welcome>
      <div class="portrait" aria-hidden="true">
        <img src="/images/avatar-192.png" alt="" width="48" height="48" />
        <span class="hello-dot"></span>
      </div>
      <div class="copy">
        <div class="line"><p class="title">Straight to the point.</p></div>
        <div class="line"><p class="note">Glad you’re here. <span>— Miguel</span></p></div>
      </div>
      <svg class="arrival" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M12 4v15m-6-6 6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="lifetime" aria-hidden="true"></span>
    </div>
  {/if}
</div>

<style>
  .welcome-position { position: fixed; z-index: 65; bottom: max(28px, env(safe-area-inset-bottom)); left: 0; right: 0; display: flex; justify-content: center; padding-inline: 20px; pointer-events: none; }
  .welcome { position: relative; overflow: hidden; display: flex; align-items: center; gap: 16px; max-width: 100%; padding: 17px 22px 17px 17px; border: 1px solid rgb(20 42 34 / 12%); border-radius: 22px; background: #f9f7ee; color: #142a22; box-shadow: 0 12px 36px rgb(20 42 34 / 12%), 0 2px 6px rgb(20 42 34 / 4%); font-family: 'Figtree', 'Helvetica Neue', Arial, sans-serif; animation: welcome-in 480ms cubic-bezier(.22, 1, .36, 1) both; }
  .lifetime { position: absolute; bottom: 0; left: 22px; right: 22px; height: 2px; border-radius: 2px; background: rgb(89 22 60 / 24%); transform-origin: left; animation: lifetime 3400ms linear both; }
  .portrait { position: relative; flex: 0 0 48px; width: 48px; height: 48px; animation: portrait-in 650ms cubic-bezier(.22, 1, .36, 1) both; }
  img { display: block; width: 100%; height: 100%; border-radius: 50%; object-fit: cover; background: #e5edc0; }
  .hello-dot { position: absolute; right: -1px; bottom: 1px; width: 11px; height: 11px; border: 2px solid #f9f7ee; border-radius: 50%; background: #59163c; }
  .copy { min-width: 0; }
  .line { overflow: hidden; }
  p { margin: 0; }
  .title { font-size: 18px; font-weight: 650; line-height: 1.4; letter-spacing: -.025em; animation: line-in 500ms 80ms cubic-bezier(.22, 1, .36, 1) both; }
  .note { margin-top: 3px; font-size: 14px; font-weight: 400; line-height: 1.5; color: #4e5c54; animation: line-in 500ms 160ms cubic-bezier(.22, 1, .36, 1) both; }
  .note span { white-space: nowrap; }
  .arrival { flex: 0 0 22px; width: 22px; height: 22px; margin-left: 4px; color: #59163c; animation: arrival-in 600ms 160ms cubic-bezier(.22, 1, .36, 1) both; }
  .leaving { animation: welcome-out 360ms cubic-bezier(.4, 0, 1, 1) both; }
  @keyframes welcome-in { from { opacity: 0; transform: translateY(14px) scale(.98); } to { opacity: 1; transform: none; } }
  @keyframes portrait-in { from { transform: rotate(-8deg) scale(.9); } to { transform: none; } }
  @keyframes line-in { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: none; } }
  @keyframes arrival-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
  @keyframes welcome-out { to { opacity: 0; transform: translateY(8px); } }
  @keyframes lifetime { from { transform: scaleX(1); } to { transform: scaleX(0); } }
  @media (max-width: 480px) {
    .welcome-position { bottom: max(20px, env(safe-area-inset-bottom)); padding-inline: 16px; }
    .welcome { gap: 12px; padding: 15px; border-radius: 20px; }
    .title { font-size: 17px; }
    .note { font-size: 13px; }
    .arrival { flex-basis: 18px; width: 18px; height: 18px; margin-left: 0; }
  }
  @media (prefers-reduced-motion: reduce) { .welcome, .portrait, .title, .note, .arrival, .lifetime { animation: none; } }
</style>
