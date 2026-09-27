<script lang="ts">
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import Download from '@lucide/svelte/icons/download';
  import { cvExperience, cvEducation, cvLanguages, professionalRecommendation, site } from '$lib/content/folio';
  import { projects } from '$lib/experience/projects';
</script>
<svelte:head>
  <title>CV — Miguel Almeida</title>
  <meta name="description" content="Miguel Almeida’s experience, skills and education. Frontend development at F24, independent products, and a background in UX design." />
  <meta property="og:title" content="CV — Miguel Almeida" />
</svelte:head>
<article class="shell pb-16 pt-10 sm:pb-24 sm:pt-16">
  <header class="grid gap-8 border-b border-rule pb-10 sm:grid-cols-[1.7fr_1fr]">
    <div><p class="label-type mb-5 text-plum">Experience / Berlin, Germany</p><h1 class="display-type text-[clamp(3.5rem,8vw,8rem)]">Miguel<br />Almeida.</h1><p class="mt-5 font-serif text-2xl sm:text-3xl">Frontend developer & design engineer.</p></div>
    <div class="flex flex-col items-start justify-end gap-4">
      <p class="max-w-sm text-lg leading-relaxed">Four years building product interfaces at F24. A background in UX design. Care for the details that make software feel clear and dependable.</p>
      <a href="/portfolio.pdf" download="Miguel-Almeida-CV.pdf" class="action-button gap-3 px-5 hover:bg-ink"><Download size={18} aria-hidden="true" /> Download CV</a>
      <a href={'mailto:'+site.email} class="ink-link max-w-full break-all text-sm underline underline-offset-4">{site.email}</a>
    </div>
  </header>
  <div class="grid gap-12 pt-10 min-[900px]:grid-cols-[1.9fr_1fr] min-[900px]:gap-20">
    <div>
      <section aria-labelledby="experience-title">
        <h2 id="experience-title" class="label-type mb-8 text-plum">Professional experience</h2>
        {#each cvExperience as role}
          <div class="mb-10">
            <p class="text-sm text-muted">{role.years} / {role.company} / {role.location}</p>
            <h3 class="display-type mt-3 text-3xl">{role.role}</h3>
            <ul class="mt-5 space-y-3 pl-5 text-base leading-relaxed marker:text-plum">
              {#each role.bullets as bullet}<li class="list-disc pl-1">{bullet}</li>{/each}
            </ul>
          </div>
        {/each}
        <a href="/work/f24" class="ink-link text-plum underline underline-offset-4">Read about my work at F24 <ArrowRight aria-hidden="true" size={18} /></a>
      </section>
      <section class="mt-10 border-t border-rule pt-8" aria-labelledby="projects-title">
        <h2 id="projects-title" class="label-type mb-5 text-plum">Independent work</h2>
        {#each projects.filter(p => p.slug !== 'f24') as project}
          <a href={'/work/'+project.slug} class="group flex items-center justify-between gap-5 border-b border-rule py-5">
            <div><h3 class="display-type text-2xl group-hover:text-plum">{project.name}</h3><p class="mt-2 max-w-lg text-sm leading-relaxed text-muted">{project.summary}</p></div><ArrowRight aria-hidden="true" size={22} class="shrink-0" />
          </a>
        {/each}
      </section>
    </div>
    <aside class="space-y-10">
      <section><h2 class="label-type mb-5 text-plum">Core skills</h2><p class="text-lg leading-relaxed">React · Svelte · TypeScript<br />Tailwind CSS · Playwright<br />Design systems · Accessibility<br />Product UI · Figma</p></section>
      <section><h2 class="label-type mb-5 text-plum">Education</h2>{#each cvEducation as item}<div class="mb-6"><p class="text-sm text-muted">{item.year}</p><h3 class="mt-2 font-semibold">{item.title}</h3><p class="mt-1 text-sm leading-relaxed text-muted">{item.place}</p></div>{/each}</section>
      <section><h2 class="label-type mb-5 text-plum">Languages</h2><ul class="space-y-3 text-sm">{#each cvLanguages as language}<li>{language}</li>{/each}</ul></section>
      <figure class="rounded-xl bg-sage p-6"><blockquote class="font-serif text-xl leading-relaxed">“{professionalRecommendation.quote}”</blockquote><figcaption class="mt-5 text-sm"><span class="font-semibold">{professionalRecommendation.name}</span><br /><span class="text-muted">{professionalRecommendation.role}</span></figcaption></figure>
      <a href="/story" class="ink-link text-plum underline underline-offset-4">A little more about me <ArrowRight size={18} aria-hidden="true" /></a>
    </aside>
  </div>
</article>
