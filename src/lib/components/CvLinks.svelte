<script lang="ts">
  export let links: {href:string;label:string}[] = [];
  let menu: HTMLDetailsElement;
  let trigger: HTMLElement;
  function outside(event: PointerEvent) {
    if (menu?.open && !menu.contains(event.target as Node)) menu.open=false;
  }
  function escape(event: KeyboardEvent) {
    if(event.key==='Escape' && menu?.open){
      event.preventDefault();menu.open=false;trigger.focus({preventScroll:true});
    }
  }
</script>

<svelte:window onpointerdown={outside} onkeydown={escape} />
<details class="cv-links" bind:this={menu}>
  <summary bind:this={trigger}>CV links <svg aria-hidden="true" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" /></svg></summary>
  <nav aria-label="Links from the CV">
    {#each links as link (link.href)}
      <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
    {/each}
  </nav>
</details>

<style>
  .cv-links{position:relative;font-size:14px;}
  summary{display:flex;align-items:center;gap:8px;min-height:44px;padding:8px 0;cursor:pointer;list-style:none;}
  summary::-webkit-details-marker{display:none;}
  svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.5;transition:transform 160ms;}
  details[open] svg{transform:rotate(180deg);}
  nav{position:absolute;z-index:5;top:calc(100% + 6px);right:0;min-width:180px;max-width:calc(100vw - 24px);max-height:50dvh;overflow:auto;padding:6px;background:#f5f6ed;border:1px solid #c5ccba;border-radius:8px;}
  a{display:flex;align-items:center;min-height:40px;padding:8px 12px;color:inherit;text-decoration:none;overflow-wrap:anywhere;}
  a:hover{background:#e8ecdf;}
  summary:focus-visible,a:focus-visible{outline:2px solid #610d3d;outline-offset:2px;}
  @media(prefers-reduced-motion:reduce){svg{transition:none;}}
</style>
