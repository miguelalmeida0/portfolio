<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { onMount } from 'svelte';
  import s from './LineMFooter.module.css';
  import { EMAIL, STOPS, STOP_AT } from './contact';
  import { createLineService, initialTrain } from './service';
  import { copyText } from '$lib/experience/motion';
  import Mail from '@lucide/svelte/icons/mail';
  import FileText from '@lucide/svelte/icons/file-text';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';

  let root: HTMLElement;
  let line: HTMLElement;
  let train = $state(initialTrain());
  let toast = $state('');
  let service: ReturnType<typeof createLineService> | undefined;
  let toastTimer: ReturnType<typeof setTimeout>;
  let mounted = false;
  let desktopQuery: MediaQueryList;
  onMount(() => {
    mounted = true;
    desktopQuery = matchMedia('(min-width: 900px)');
    const sync = () => {
      service?.destroy();
      service = desktopQuery.matches ? createLineService(root, line, state => train = state) : undefined;
    };
    sync();
    desktopQuery.addEventListener('change', sync);
    return () => {
      mounted = false;
      desktopQuery.removeEventListener('change', sync);
      service?.destroy();
      clearTimeout(toastTimer);
    };
  });
  async function activate(i: number) {
    service?.aim(i);
    if (STOPS[i].id !== 'email') return;
    const copied = await copyText(EMAIL);
    if (!mounted) return;
    toast = copied ? 'Address copied — and opening your mail app. If nothing opens, just paste it.' : `Opening your mail app. Address: ${EMAIL}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast = '', 3800);
    // Keep the real anchor's default mailto action in the same user gesture.
  }
</script>

<footer id="contact" data-line-m bind:this={root} class={s.root}>
  <div class={s.top}>
    <div class={s.head} data-contact-head data-align="left">
      <div class={s.titleRow}><span class="{s.rnd} {s.rndL}" aria-hidden="true">M</span><h2 class={s.h}>Take Line M to Miguel.</h2></div>
      <p class={s.sub}>Four stops, one click each. Email copies and opens your mail app; the others open in a new tab.</p>
    </div>
    <div class={s.board} data-board aria-hidden="true" onpointerenter={() => service?.over(true)} onpointerleave={() => service?.over(false)}>
      <div class={s.hd}><span class={s.rnd}>M</span><b>Line M</b><span>towards Miguel</span></div>
      {#each STOPS as stop, i}
        <a data-dep={i} class="{s.dep} {train.hot === i ? s.hot : ''}"
          href={stop.href} tabindex="-1"
          onpointerenter={() => service?.aim(i)} onpointerleave={() => service?.leave()} onclick={() => activate(i)} {...destinationLink(stop.href)}>
          <span class="{s.rnd} {s.rndS}">M</span><span class={s.n}>{stop.name}</span><span class={s.v}>{stop.value}</span>
          <span class={s.s}><b>{train.at === i ? 'Now here' : stop.status}</b></span>
        </a>
      {/each}
    </div>
  </div>
  <nav bind:this={line} data-line class={s.line} aria-label="Contact Miguel" onpointerenter={() => service?.over(true)} onpointerleave={() => service?.over(false)}>
    <span class={s.start} aria-hidden="true"></span><span class={s.startl}>You are here</span>
    {#each STOPS as stop, i}
      <a data-stop={i} class="{s.stn} {train.at === i ? s.here : ''}" style:--at="{STOP_AT[i]}%"
        href={stop.href}
        aria-label="{stop.name}: {stop.value}. {stop.hint}"
        onpointerenter={() => service?.aim(i)} onfocus={() => service?.aim(i)} onpointerleave={() => service?.leave()} onclick={() => activate(i)} {...destinationLink(stop.href)}>
        <span class={s.o} aria-hidden="true"></span>
        <span class={s.sign}><span class={s.nm}>{stop.name}</span>
          <span class={s.vl}>{#if stop.id === 'email'}{stop.value.split('@')[0]}@<wbr />{stop.value.split('@')[1]}{:else}{stop.value}{/if}</span>
          <span class={s.hint}>{stop.hint}</span>
        </span>
      </a>
    {/each}
    <div data-train class="{s.train} {train.rev ? s.rev : ''} {train.open ? s.open : ''}" style:--p="{train.pos}%" style:transition-duration="{train.dur}ms" aria-hidden="true">
      <div class={s.body}>
        <div class={s.car}><span class={s.win} style:left="12px"></span><span class={s.door}></span><span class={s.win} style:right="12px"></span></div>
        <div class={s.car}><span class={s.win} style:left="12px"></span><span class={s.door}></span><span class="{s.rnd} {s.rndT}">M</span></div>
      </div>
    </div>
  </nav>

  <!-- Dedicated mobile composition. Desktop rail/board stay intact and are
       removed from the mobile layout rather than transformed to fit. -->
  <nav class={s.mobileJourney} data-mobile-line aria-label="Contact Miguel">
    <div class={s.mobileStartingPoint} aria-hidden="true">
      <span class={s.mobileTrain}>
        <span class={s.trainWindow}></span><span class={s.trainDoor}></span><span class={s.trainMark}>M</span>
      </span>
      <span class={s.mobileOrigin}>You are here</span>
    </div>
    <div class={s.mobileStops}>
      {#each STOPS as stop, i}
        <a
          data-mobile-stop={i}
          href={stop.href}
          class={s.mobileStop}
          aria-label="{stop.name}: {stop.value}. {stop.hint}"
          onclick={() => activate(i)}
          {...destinationLink(stop.href)}
        >
          <span class={s.mobileStation} aria-hidden="true"></span>
          <span class={s.mobileIcon} aria-hidden="true">
            {#if stop.id === 'email'}<Mail size={22} strokeWidth={1.85} />
            {:else if stop.id === 'linkedin'}<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M20.45 2H3.55C2.7 2 2 2.67 2 3.5v17c0 .83.7 1.5 1.55 1.5h16.9c.86 0 1.55-.67 1.55-1.5v-17c0-.83-.69-1.5-1.55-1.5ZM7.93 18.75H4.97V9.2h2.96v9.55ZM6.45 7.9a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.3 10.85h-2.96V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.49V9.2h2.84v1.3h.04c.4-.75 1.36-1.55 2.8-1.55 3 0 3.58 1.98 3.58 4.55v5.25Z"/></svg>
            {:else if stop.id === 'github'}<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.162 19.487c.5.093.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.775.603-3.36-1.338-3.36-1.338-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.087 2.91.831.09-.647.35-1.087.635-1.337-2.215-.252-4.544-1.108-4.544-4.937 0-1.09.39-1.98 1.029-2.677-.104-.253-.446-1.27.098-2.647 0 0 .838-.268 2.75 1.023a9.58 9.58 0 0 1 5 0c1.91-1.29 2.747-1.023 2.747-1.023.546 1.377.203 2.394.1 2.647.64.697 1.026 1.587 1.026 2.677 0 3.839-2.332 4.682-4.554 4.93.36.312.68.927.68 1.869 0 1.35-.013 2.438-.013 2.768 0 .27.18.582.688.482A10.001 10.001 0 0 0 12 2Z"/></svg>
            {:else}<FileText size={22} strokeWidth={1.85} />{/if}
          </span>
          <span class={s.mobileCopy}>
            <span class={s.mobileName}>{stop.name}</span>
            <span class={s.mobileValue}>{stop.value}</span>
          </span>
          <ChevronRight size={19} strokeWidth={1.8} class={s.mobileArrow} aria-hidden="true" />
        </a>
      {/each}
    </div>
  </nav>
  <div data-toast role="status" aria-live="polite" class="{s.toast} {toast ? s.on : ''}">{toast}</div>
</footer>
