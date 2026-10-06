<script lang="ts">
  import { onDestroy } from 'svelte';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import Copy from '@lucide/svelte/icons/copy';
  import { destinationLink } from '$lib/navigation/destination-link';
  import { copyText } from '$lib/experience/motion';
  import { EMAIL, STOPS } from './contact';
  let result = $state('');
  let timer: ReturnType<typeof setTimeout>;
  let alive = true;
  async function copyEmail() {
    const copied = await copyText(EMAIL);
    if (!alive) return;
    result = copied ? 'Email address copied.' : 'Could not copy. Select the address above to copy it.';
    clearTimeout(timer);
    timer = setTimeout(() => result = '', 5000);
  }
  onDestroy(() => { alive = false; clearTimeout(timer); });
</script>
<footer id="contact" data-line-m class="contact-station">
  <div class="contact-intro">
    <div class="contact-title"><span class="line-mark" aria-hidden="true">M</span><h2>Let’s talk.</h2></div>
    <p>Frontend engineering, product design, and the work in between.</p>
  </div>
  <div class="contact-direct">
    <p class="contact-address">{EMAIL}</p>
    <div class="contact-actions">
      <a class="email-action" href={'mailto:' + EMAIL} {...destinationLink('mailto:' + EMAIL)}>Email me <ArrowUpRight size={20} aria-hidden="true" /></a>
      <button type="button" onclick={copyEmail}><Copy size={18} aria-hidden="true" /> Copy email</button>
    </div>
    <p data-toast class="copy-status" role="status" aria-live="polite">{result}</p>
  </div>
  <nav class="contact-route" aria-label="More ways to connect">
    {#each STOPS.filter(stop => stop.id !== 'email') as stop}
      <a href={stop.href} {...destinationLink(stop.href)}>
        <span class="station-point" aria-hidden="true"></span>
        <span>{stop.name}</span><ArrowUpRight size={20} aria-hidden="true" />
        <small>{stop.id === 'resume' ? 'One-page CV · PDF reader' : 'Opens in a new tab'}</small>
      </a>
    {/each}
  </nav>
</footer>
<style>
  .contact-station { color:var(--ink); font-family:var(--hero-font); padding:48px var(--page-x) 64px; display:grid; grid-template-columns:1fr 1fr; gap:24px 64px; background:var(--page); }
  .contact-title { display:flex; align-items:center; gap:16px; }
  .line-mark { display:grid; place-items:center; width:44px; height:44px; flex-shrink:0; background:var(--plum); color:var(--paper); font-size:24px; font-weight:800; border-radius:10px; }
  h2 { margin:0; font-size:clamp(36px,4vw,58px); line-height:1.08; font-weight:800; letter-spacing:-.03em; }
  .contact-intro p { margin-top:20px; max-width:42ch; color:var(--muted); font-size:22px; line-height:1.5; }
  .contact-direct { align-self:center; }
  .contact-address { margin:0; font-size:clamp(20px,2.1vw,30px); font-weight:600; line-height:1.4; overflow-wrap:anywhere; user-select:all; }
  .contact-actions { display:flex; flex-wrap:wrap; align-items:center; gap:12px 24px; margin-top:20px; }
  .contact-actions a,.contact-actions button { display:inline-flex; align-items:center; justify-content:center; gap:10px; min-height:56px; font-size:20px; font-weight:600; cursor:pointer; }
  .email-action { background:var(--plum); color:var(--paper); border-radius:12px; padding:12px 24px; }
  .email-action:hover { background:var(--plum-700); }
  .contact-actions button { text-decoration:underline; text-underline-offset:5px; }
  .copy-status { min-height:28px; margin:12px 0 0; font-size:18px; line-height:1.4; color:var(--plum); }
  .contact-route { grid-column:1/-1; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:32px; padding-top:28px; margin-top:16px; border-top:2px solid var(--plum); }
  .contact-route a { position:relative; display:grid; grid-template-columns:auto 1fr; column-gap:12px; align-items:center; min-height:64px; font-size:24px; font-weight:600; text-decoration:none; padding:12px 0; }
  .contact-route small { grid-column:1/-1; font-size:18px; line-height:1.4; font-weight:400; color:var(--muted); margin-top:6px; }
  .station-point { position:absolute; top:-36px; left:0; width:14px; height:14px; border:3px solid var(--plum); border-radius:50%; background:var(--page); }
  .contact-route a:hover>span:not(.station-point) { text-decoration:underline; text-underline-offset:5px; }
  :is(a,button):focus-visible { outline:3px solid var(--plum); outline-offset:5px; }
  @media(max-width:767px) {
    .contact-station { grid-template-columns:1fr; gap:24px; padding:32px var(--page-x) 48px; }
    .contact-intro p { font-size:18px; margin-top:16px; }
    .contact-address { font-size:20px; }
    .contact-actions a,.contact-actions button { font-size:16px; min-height:48px; }
    .copy-status { font-size:16px; }
    .contact-route { grid-template-columns:1fr; gap:12px; border-top:0; padding:0 0 0 22px; margin:0 0 0 6px; border-left:1px solid var(--plum); }
    .contact-route a { font-size:20px; }
    .contact-route small { font-size:16px; }
    .station-point { top:20px; left:-29px; }
  }
</style>
