<script lang="ts">
  import LinkButton from '$lib/components/experience/LinkButton.svelte';
  import { enter } from '$lib/experience/motion';
  const chapters = [
    { year: '2020–2021', title: 'UX Design Institute.', body: 'I completed the UX Design Institute diploma in 2021, then studied full-stack web development at CareerFoundry. That path brought interface design and implementation into the same practice.' },
    { year: '2021–2022', title: 'CareerFoundry, then independent work.', body: 'I studied full-stack web development at CareerFoundry and worked independently on responsive websites and product interfaces. I wanted to own the behavior as well as the layout.' },
    { year: '2022–now', title: 'Four years across Svelte and React.', body: 'The original Svelte frontend grew from initial mockups into production through close work with product, design, backend and QA. As the product evolved, frontend delivery continued in React through new features and shared UI architecture. The application is now used by hundreds of companies.' },
    { year: 'Independent work', title: 'Second Voice, from design to deployment.', body: 'With Second Voice, I owned product design, frontend engineering and server orchestration. I took the writing experience through to deployment, combining a React interface and animated edit review with model integration, authentication and privacy controls. The architecture also handles spending limits, repeated requests and interrupted generations.' }
  ];
</script>
<svelte:head><title>Story | Miguel Almeida</title><meta name="description" content="From UX design to production frontend development. Miguel Almeida’s path through design, independent work and F24." /></svelte:head>
<article class="shell pb-16 pt-12 sm:pb-24 sm:pt-20">
  <header class="max-w-5xl pb-12"><p class="label-type mb-6 text-plum">A little context</p><h1 class="display-type text-[clamp(3rem,7.6vw,7.5rem)]">I started in UX.<br /><span class="font-medium text-plum">Then built the frontend.</span></h1><p class="mt-8 max-w-xl text-lg leading-relaxed">I’m Miguel, a Portuguese frontend developer based in Berlin. After studying UX and web development, four years at F24 followed across the original Svelte frontend and continued product delivery in React.</p></header>
  {#each chapters as chapter}<section class="grid gap-5 border-t border-rule py-8 sm:grid-cols-[1fr_2fr] sm:py-12" use:enter><p class="label-type pt-2 text-plum">{chapter.year}</p><div class="max-w-2xl"><h2 class="display-type text-3xl sm:text-4xl">{chapter.title}</h2><p class="mt-5 text-lg leading-relaxed">{chapter.body}</p></div></section>{/each}
  <div class="mt-8 flex flex-wrap gap-8"><LinkButton href="/#work" label="Explore the work" /><LinkButton href="/cv" label="View my CV" secondary /></div>
</article>
