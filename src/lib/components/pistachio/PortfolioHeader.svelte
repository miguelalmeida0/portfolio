<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';</script>
<header class="flex items-center justify-between gap-5 px-[4.4%] py-7 text-sm sm:text-base">
  <a href="/" aria-label="Miguel Almeida, home" {...destinationLink("/")}>Miguel Almeida <span class="px-2">/</span> Berlin</a>
  <nav aria-label="Main navigation" class="flex gap-4 sm:gap-[3vw]">
    <a href="#work" class="hover:underline" {...destinationLink("#work")}>Work</a><a href="/story" class="hover:underline" {...destinationLink("/story")}>Story</a>
    <a href="/portfolio.pdf" class="hover:underline" {...destinationLink("/portfolio.pdf")}>CV</a><a href="#contact" class="hidden hover:underline sm:block" {...destinationLink("#contact")}>Contact</a>
  </nav>
</header>

