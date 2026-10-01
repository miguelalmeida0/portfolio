<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { f24Ownership } from '$lib/content/work-projects';
  const decision = f24Ownership;
</script>
<div class="stage-card card-a">
  <a class="photo-link" href="/work/f24" aria-label="View F24 case study" {...destinationLink("/work/f24")}>
    <img src="/projects/f24/hackathon.webp" alt="Colleagues gathered for a presentation at an F24 hackathon." width="1024" height="685" />
  </a>
  <p class="photo-caption">F24 hackathon · team context</p>
</div>
<div class="stage-card card-b">
  <p class="eyebrow">Product ownership · F24</p>
  <h4 class="decision-title">{decision.title}</h4>
  <p class="decision-body">{decision.body}</p>
  <ul class="tags" aria-label="Engineering focus">{#each decision.tags as tag}<li>{tag}</li>{/each}</ul>
  <div class="decision-footer"><p>{decision.meta}</p><a href={decision.href} {...destinationLink(decision.href)}>Explore my work</a></div>
</div>
<style>
  .photo-link { display: block; position: relative; flex: 1; min-height: 0; border-radius: 12px; overflow: hidden; cursor: pointer; }
  .photo-link:focus-visible { outline: 3px solid var(--plum); outline-offset: 3px; }
  img { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 12px; object-fit: cover; }
  .photo-caption, .eyebrow { font: 400 10px/1.6 var(--hero-font); color: var(--muted); }
  .photo-caption { margin-top: 10px; }
  h4 { margin-top: 24px; font: 800 21px/1.15 var(--hero-font); letter-spacing: -.02em; }
  .decision-title { margin-top: 24px; }
  .decision-body { margin-top: 22px; font: 400 18px/1.5 var(--hero-font); }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; margin-top: 22px; }
  .tags li { padding: 6px 10px; border: 1px solid var(--rule-ink); border-radius: 999px; font-size: 10px; }
  .decision-footer { margin-top: auto; padding-top: 24px; font: 400 10px/1.6 var(--hero-font); }
  .decision-footer a { display: inline-flex; align-items: center; min-height: 44px; margin-top: 8px; color: var(--plum); font: 600 13px/1.4 var(--hero-font); text-decoration: underline; text-underline-offset: 4px; }
  @media (max-width: 767px) { h4, .decision-title { margin-top: 16px; } .decision-body { margin-top: 14px; } .decision-footer { padding-top: 16px; } }
</style>
