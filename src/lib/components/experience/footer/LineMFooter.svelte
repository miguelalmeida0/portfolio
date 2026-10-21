<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { getContext, onMount } from 'svelte';
  import s from './LineMFooter.module.css';
  import { EMAIL, STOPS, STOP_AT } from './contact';
  import { LINE_M, initialTrain, type LineService } from './service';
  import { copyText } from '$lib/experience/motion';

  let root: HTMLElement;
  let line: HTMLElement;
  let train = $state(initialTrain());
  let toast = $state('');
  const service = getContext<LineService>(LINE_M);
  let toastTimer: ReturnType<typeof setTimeout>;
  let mounted = false;
  onMount(() => {
    mounted = true;
    const unregister = service.register(root);
    const unsubscribe = service.subscribe(state => train = state);
    return () => { mounted = false; unregister(); unsubscribe(); clearTimeout(toastTimer); };
  });
  async function activate(i: number) {
    service?.aim(i, 'activate');
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
    <!-- Native pointer/context-menu activation can focus a board anchor even
         with tabindex=-1. Keep it exposed, without a second Tab sequence or
         live announcements; the stations remain the primary keyboard route. -->
    <div class={s.board} data-board role="group" aria-label="Line M departure board">
      <div class={s.hd}><span class={s.rnd}>M</span><b>Line M</b><span>towards Miguel</span></div>
      {#each STOPS as stop, i}
        <a data-dep={i} data-requested={train.requested === i} data-arrived={train.at === i} class="{s.dep} {train.requested === i ? s.hot : ''}"
          href={stop.href} tabindex="-1"
          onpointerenter={(event) => { if (event.pointerType !== 'touch') service?.aim(i); }} onfocus={() => service?.aim(i, 'focus')} onclick={() => activate(i)} {...destinationLink(stop.href)}>
          <span class="{s.rnd} {s.rndS}">M</span><span class={s.n}>{stop.name}</span><span class={s.v}>{stop.value}</span>
          <span class={s.s}><b>{train.at === i ? 'Now here' : train.requested === i ? 'Next stop' : stop.status}</b></span>
        </a>
      {/each}
    </div>
  </div>
  <nav bind:this={line} data-line class={s.line} aria-label="Contact Miguel">
    <span class={s.start} data-thread-dock aria-hidden="true"></span><span class={s.startl}>You are here</span>
    {#each STOPS as stop, i}
      <a data-stop={i} data-requested={train.requested === i} data-arrived={train.at === i} class="{s.stn} {train.at === i ? s.here : ''}" style:--at="{STOP_AT[i]}%"
        href={stop.href}
        aria-label="{stop.name}: {stop.value}. {stop.hint}"
        onpointerenter={(event) => { if (event.pointerType !== 'touch') service?.aim(i); }} onfocus={() => service?.aim(i, 'focus')} onclick={() => activate(i)} {...destinationLink(stop.href)}>
        <span class={s.o} aria-hidden="true"></span>
        <span class={s.sign}><span class={s.nm}>{stop.name}</span>
          <span class={s.vl}>{#if stop.id === 'email'}{stop.value.split('@')[0]}@<wbr />{stop.value.split('@')[1]}{:else}{stop.value}{/if}</span>
          <span class={s.hint}>{stop.hint}</span>
        </span>
      </a>
    {/each}
  </nav>
  <button class={s.routeToggle} type="button" disabled={train.reduced} aria-pressed={train.held} onclick={() => service.toggle()}>{train.held ? 'Resume route' : 'Pause route'}</button>
  <div data-toast role="status" aria-live="polite" class="{s.toast} {toast ? s.on : ''}">{toast}</div>
</footer>
