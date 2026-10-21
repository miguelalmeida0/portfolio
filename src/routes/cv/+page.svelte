<script lang="ts">
  import '$lib/hero-lab/lab.css';
  import '$lib/hero-lab/typographic/typographic.css';
  import TypographicCv from '$lib/hero-lab/typographic/pages/TypographicCv.svelte';
</script>
<svelte:head>
  <title>CV · Miguel Almeida</title>
  <meta name="description" content="Miguel Almeida’s experience, skills and education. Frontend development at F24, independent products, and a background in UX design." />
  <link rel="preload" href="/fonts/antonio-700-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>
<TypographicCv />
