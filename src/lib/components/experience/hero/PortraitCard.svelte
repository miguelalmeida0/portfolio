<script lang="ts">
  import AskExperience from '$lib/components/ask/AskExperience.svelte';
  import { portraitMotion } from './portrait-motion';
  // Use the complete transparent source directly over the sage field.
</script>
<div class="portrait-card" data-landing-target data-portrait-card use:portraitMotion>
  <picture>
    <source type="image/avif" srcset="/images/wind-full-720.avif 720w, /images/wind-full-1086.avif 1086w" sizes="(max-width: 767px) 250px, 357px" />
    <source type="image/webp" srcset="/images/wind-full-720.webp 720w, /images/wind-full-1086.webp 1086w" sizes="(max-width: 767px) 250px, 357px" />
    <img class="portrait" src="/images/miguel-contact-editorial.webp" width="1086" height="1448" alt="Miguel Almeida" fetchpriority="high" />
  </picture>
  <AskExperience />
</div>
<style>
  .portrait-card { position: relative; min-width: 0; height: 500px; border-radius: var(--card-radius); background: var(--sage); overflow: hidden; }
  picture { display: block; position: absolute; inset: 0; }
  .portrait { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); display: block; width: auto; height: calc(100% - 24px); max-width: 100%; object-fit: contain; object-position: bottom; }
  @media (min-width: 768px) and (max-width: 1023px) { .portrait-card { order: -1; height: 380px; } .portrait { height: calc(100% - 20px); } }
  @media (max-width: 767px) { .portrait-card { order: -1; height: clamp(260px, 78vw, 335px); } .portrait { height: calc(100% - 16px); } }
</style>
