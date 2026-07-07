import { cn } from '$lib/utils/cn';

const fontSans = "font-['Source_Sans_3']";
const fontDisplay = "font-['Cormorant_Garamond']";
const fontSerif = "font-['Cormorant_Garamond']";
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1F8FC]/85 focus-visible:ring-offset-2 focus-visible:ring-offset-[#122A39]';
const elevatedCard =
  'border border-[#C2DAE9]/14 shadow-[0_28px_80px_-38px_rgba(0,0,0,0.72)]';

export const tokens = {
  page: {
    shell: cn(
      fontSans,
      'relative min-h-screen overflow-clip bg-[radial-gradient(circle_at_18%_16%,rgba(194,218,233,0.16)_0,transparent_18%),radial-gradient(circle_at_84%_10%,rgba(49,118,154,0.18)_0,transparent_24%),linear-gradient(180deg,#173447_0%,#122A39_48%,#0B1721_100%)] text-[#F1F8FC] selection:bg-[#C2DAE9] selection:text-[#17384B]'
    ),
    main: 'relative z-10',
    curtainLeft:
      'pointer-events-none absolute -left-28 top-0 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(161,195,218,0.28)_0,transparent_66%)] blur-3xl',
    curtainRight:
      'pointer-events-none absolute right-[-7rem] top-20 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(49,118,154,0.22)_0,transparent_65%)] blur-3xl',
    photoWash:
      "pointer-events-none absolute inset-0 bg-[url('/ui-water-texture.jpg')] bg-cover bg-center opacity-[0.42] mix-blend-screen saturate-[0.94] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.44)_8%,#000_22%,#000_100%)]",
    photoVeil:
      'pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(13,23,33,0.16)_0%,rgba(14,26,36,0.08)_36%,rgba(9,18,26,0.05)_100%)]',
    paperGlow:
      'pointer-events-none absolute bottom-[-6rem] left-1/2 h-[22rem] w-[48rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(194,218,233,0.1)_0,transparent_70%)] blur-3xl',
    grain:
      'pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-soft-light [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:3px_3px,4px_4px]',
    vignette:
      'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(8,17,25,0.34)_76%,rgba(4,10,16,0.68)_100%)]'
  },
  motion: {
    duration: {
      fast: 180,
      base: 420,
      slow: 640
    },
    distance: {
      sm: 16,
      md: 24,
      lg: 36
    },
    opacity: {
      enter: 0.14
    },
    stagger: {
      none: 0,
      xs: 90,
      sm: 160,
      md: 240
    },
    progressWidths: [
      'w-0',
      'w-[10%]',
      'w-[20%]',
      'w-[30%]',
      'w-[40%]',
      'w-[50%]',
      'w-[60%]',
      'w-[70%]',
      'w-[80%]',
      'w-[90%]',
      'w-full'
    ],
    progressHeights: [
      'h-[0%]',
      'h-[5%]',
      'h-[10%]',
      'h-[15%]',
      'h-[20%]',
      'h-[25%]',
      'h-[30%]',
      'h-[35%]',
      'h-[40%]',
      'h-[45%]',
      'h-[50%]',
      'h-[55%]',
      'h-[60%]',
      'h-[65%]',
      'h-[70%]',
      'h-[75%]',
      'h-[80%]',
      'h-[85%]',
      'h-[90%]',
      'h-[95%]',
      'h-full'
    ],
    progressTops: [
      'top-[0%]',
      'top-[5%]',
      'top-[10%]',
      'top-[15%]',
      'top-[20%]',
      'top-[25%]',
      'top-[30%]',
      'top-[35%]',
      'top-[40%]',
      'top-[45%]',
      'top-[50%]',
      'top-[55%]',
      'top-[60%]',
      'top-[65%]',
      'top-[70%]',
      'top-[75%]',
      'top-[80%]',
      'top-[85%]',
      'top-[90%]',
      'top-[95%]',
      'top-[100%]'
    ],
    pointerBucketsAmbient: {
      center: 'translate-x-0 translate-y-0',
      north: 'translate-x-0 -translate-y-[2px]',
      south: 'translate-x-0 translate-y-[2px]',
      east: 'translate-x-[2px] translate-y-0',
      west: '-translate-x-[2px] translate-y-0',
      northeast: 'translate-x-[2px] -translate-y-[2px]',
      northwest: '-translate-x-[2px] -translate-y-[2px]',
      southeast: 'translate-x-[2px] translate-y-[2px]',
      southwest: '-translate-x-[2px] translate-y-[2px]'
    },
    pointerBucketsRoute: {
      center: 'translate-x-0 translate-y-0',
      north: 'translate-x-0 -translate-y-[4px]',
      south: 'translate-x-0 translate-y-[4px]',
      east: 'translate-x-[4px] translate-y-0',
      west: '-translate-x-[4px] translate-y-0',
      northeast: 'translate-x-[4px] -translate-y-[4px]',
      northwest: '-translate-x-[4px] -translate-y-[4px]',
      southeast: 'translate-x-[4px] translate-y-[4px]',
      southwest: '-translate-x-[4px] translate-y-[4px]'
    },
    pointerBucketsSubject: {
      center: 'translate-x-0 translate-y-0',
      north: 'translate-x-0 -translate-y-[6px]',
      south: 'translate-x-0 translate-y-[6px]',
      east: 'translate-x-[6px] translate-y-0',
      west: '-translate-x-[6px] translate-y-0',
      northeast: 'translate-x-[6px] -translate-y-[6px]',
      northwest: '-translate-x-[6px] -translate-y-[6px]',
      southeast: 'translate-x-[6px] translate-y-[6px]',
      southwest: '-translate-x-[6px] translate-y-[6px]'
    }
  },
  layout: {
    nav: 'mx-auto flex w-full max-w-[94rem] items-center justify-between gap-4 px-3 py-3 sm:px-5 sm:py-4 lg:px-10',
    navLinks: 'hidden lg:flex lg:items-center lg:gap-5 xl:gap-6',
    journeyThread: 'pointer-events-none fixed right-4 top-[18vh] z-20 hidden h-[60vh] xl:flex 2xl:right-7',
    section: 'mx-auto w-full max-w-[94rem] px-4 py-18 sm:px-6 sm:py-20 lg:px-10 lg:py-24',
    hero: 'mx-auto w-full max-w-[94rem] px-4 pb-16 pt-24 sm:px-6 sm:pb-18 sm:pt-28 lg:px-10 lg:pb-24 lg:pt-32',
    heroStage:
      'relative isolate overflow-visible rounded-[2.75rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 xl:px-12 2xl:px-14',
    heroGrid:
      'relative z-10 grid items-start gap-12 xl:grid-cols-[minmax(0,1.04fr)_minmax(19rem,0.96fr)] xl:gap-10 2xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.9fr)] 2xl:gap-14',
    heroCopy: 'relative z-10 flex max-w-[50rem] flex-col gap-7 sm:gap-9 lg:gap-10',
    heroVisual:
      'relative hidden min-h-[34rem] xl:flex xl:w-full xl:max-w-[28rem] xl:justify-self-end 2xl:max-w-[31rem]',
    heroTagRow: 'flex flex-wrap items-center gap-3 sm:gap-4',
    heroCtaRow: 'grid w-full max-w-[54rem] gap-4 pt-4 sm:grid-cols-2 sm:gap-5 sm:pt-5',
    heroMetaRow: 'grid w-full max-w-[48rem] gap-3 pt-1 sm:grid-cols-2 sm:gap-4 sm:pt-3',
    statGrid: 'hidden xl:mx-auto xl:grid xl:w-fit xl:grid-cols-3 xl:gap-5 xl:justify-center xl:pt-6',
    manifesto: 'mx-auto grid w-full max-w-[94rem] gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-10',
    work: 'mx-auto flex w-full max-w-[94rem] flex-col gap-8 px-4 py-20 sm:px-6 lg:px-10',
    workHeader: 'flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between',
    workList: 'flex flex-col gap-4',
    workRow: 'grid gap-6 lg:grid-cols-[0.14fr_0.5fr_0.36fr] lg:items-start',
    index: 'mx-auto flex w-full max-w-[94rem] flex-col gap-8 px-4 py-20 sm:px-6 lg:px-10',
    indexGrid: 'grid items-stretch gap-6 lg:grid-cols-3',
    experience: 'mx-auto flex w-full max-w-[94rem] flex-col gap-8 px-4 py-20 sm:px-6 lg:px-10',
    experienceList: 'flex flex-col gap-4',
    experienceRow: 'grid gap-4 rounded-[1.8rem] border border-[#C2DAE9]/14 bg-[#183243]/58 p-6 sm:grid-cols-[0.18fr_0.52fr_0.3fr] sm:items-start sm:p-8',
    contact: 'mx-auto w-full max-w-[94rem] px-4 py-20 sm:px-6 lg:px-10',
    contactGrid: 'grid gap-8 lg:grid-cols-[0.92fr_1.08fr]',
    contactLinks: 'flex flex-wrap gap-3',
    footer:
      'mx-auto flex w-full max-w-[94rem] flex-col gap-3 px-4 pb-10 pt-2 text-sm text-[#C2DAE9]/88 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10'
  },
  typography: {
    navBrand: cn(fontDisplay, 'text-[clamp(0.96rem,7vw,1.22rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-[#F1F8FC] md:text-[1.3rem] xl:text-[1.4rem]'),
    navMeta: 'text-[0.68rem] uppercase leading-none tracking-[0.24em] text-[#C2DAE9]/88 xl:text-[0.72rem]',
    navLink: 'text-sm uppercase tracking-[0.22em] text-[#D8EAF4] transition hover:text-[#F1F8FC]',
    heroEyebrow: 'max-w-[26ch] text-[0.8rem] uppercase leading-[1.5] tracking-[0.26em] text-[#AECBDF] sm:max-w-none sm:text-[0.92rem] sm:tracking-[0.32em]',
    heroTitleLead: cn(
      fontDisplay,
      'text-[clamp(2.85rem,9.6vw,6.7rem)] font-semibold leading-[0.9] tracking-[-0.032em]'
    ),
    heroTitleAccent: cn(
      fontDisplay,
      'text-[clamp(2.85rem,9.6vw,6.7rem)] font-semibold leading-[0.9] tracking-[-0.032em]'
    ),
    heroSummary: 'max-w-[38rem] text-[0.98rem] leading-[1.78] text-[#E4F0F7] sm:max-w-[40rem] sm:text-[1.02rem] lg:text-[1.06rem]',
    sectionEyebrow: 'text-xs uppercase tracking-[0.3em] text-[#AECBDF]',
    sectionEyebrowDark: 'text-xs uppercase tracking-[0.3em] text-[#31769A]',
    sectionTitle: cn(
      fontDisplay,
      'text-[clamp(2.45rem,5vw,4.15rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-[#F1F8FC]'
    ),
    sectionTitleItalic: cn(
      fontDisplay,
      'text-[clamp(2.45rem,5vw,4.15rem)] font-semibold leading-[0.92] tracking-[-0.032em] text-[#F1F8FC]'
    ),
    sectionTitleDark: cn(
      fontDisplay,
      'text-[clamp(2.45rem,5vw,4.15rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-[#17384B]'
    ),
    sectionTitleItalicDark: cn(
      fontDisplay,
      'text-[clamp(2.45rem,5vw,4.15rem)] font-semibold leading-[0.92] tracking-[-0.032em] text-[#17384B]'
    ),
    manifestoWord: cn(fontDisplay, 'text-[clamp(2.35rem,5.4vw,4.9rem)] leading-[0.95] tracking-[-0.04em]'),
    manifestoWordItalic: cn(fontDisplay, 'text-[clamp(2.35rem,5.4vw,4.9rem)] leading-[0.95] tracking-[-0.04em]'),
    body: 'text-base leading-8 text-[#F1F8FC]',
    bodySoft: 'text-sm leading-7 text-[#D7E8F2] sm:text-[0.98rem]',
    bodyDark: 'text-base leading-8 text-[#17384B]',
    bodyInk: 'text-base leading-8 text-[#111111]',
    bodySoftDark: 'text-sm leading-7 text-[#2B6281] sm:text-[0.98rem]',
    tag: 'text-xs uppercase tracking-[0.22em] text-[#C2DAE9]',
    statValue: cn(fontSerif, 'text-4xl leading-none text-[#F1F8FC] sm:text-5xl'),
    statLabel: 'text-sm uppercase tracking-[0.28em] text-[#C2DAE9]',
    workNumber: 'text-xs uppercase tracking-[0.32em] text-[#AECBDF]',
    workTitle: cn(fontDisplay, 'text-[2.1rem] leading-[0.94] tracking-[-0.04em] text-[#F1F8FC] sm:text-[2.6rem]'),
    workTitleItalic: cn(fontDisplay, 'text-[2.1rem] leading-[0.94] tracking-[-0.04em] text-[#F1F8FC] sm:text-[2.6rem]'),
    workMeta: 'text-sm uppercase tracking-[0.24em] text-[#AECBDF]',
    indexTitle: cn(fontSerif, 'text-[2.1rem] leading-none tracking-[-0.03em]'),
    numeral: cn(fontDisplay, 'text-[2.55rem] leading-none'),
    footer: 'text-sm text-[#C2DAE9]/88'
  },
  surfaces: {
    nav:
      'sticky top-4 z-30 border border-[#C2DAE9]/14 bg-[#163040]/66 backdrop-blur-xl',
    navShell:
      'rounded-full shadow-[0_24px_64px_-36px_rgba(0,0,0,0.7)]',
    navButton:
      'inline-flex items-center gap-2 rounded-full border border-[#C2DAE9]/14 px-4 py-2.5 text-xs uppercase tracking-[0.22em] text-[#F1F8FC] transition hover:border-[#F1F8FC]/28 hover:bg-[#F1F8FC]/8',
    navButtonAccent: cn(
      focusRing,
      'inline-flex items-center gap-2 rounded-full border border-[#E5D2AE]/70 bg-[linear-gradient(180deg,#F5E8CF_0%,#E6D0AA_100%)] px-4 py-2.5 text-xs uppercase tracking-[0.22em] text-[#17384B] shadow-[0_18px_42px_-26px_rgba(0,0,0,0.55)] transition hover:translate-y-[-1px] hover:brightness-[1.02]'
    ),
    creamPill:
      'inline-flex items-center gap-2 rounded-full border border-[#D9BE8F]/34 bg-[linear-gradient(180deg,rgba(245,232,207,0.92)_0%,rgba(232,214,182,0.9)_100%)] px-5 py-3 text-xs uppercase tracking-[0.22em] text-[#17384B] transition hover:brightness-[0.99]',
    creamChip:
      'inline-flex items-center rounded-full border border-[#D9BE8F]/30 bg-[linear-gradient(180deg,rgba(245,232,207,0.74)_0%,rgba(232,214,182,0.72)_100%)] px-5 py-3 text-xs uppercase tracking-[0.22em] text-[#17384B] transition hover:brightness-[0.99]',
    tag:
      'inline-flex items-center rounded-full border border-[#C2DAE9]/12 bg-[#173447]/54 px-5 py-3 text-xs uppercase tracking-[0.24em] text-[#F1F8FC] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-6',
    heroButtonPrimary: cn(
      focusRing,
      'group inline-flex w-full items-center justify-between gap-3 rounded-full bg-[linear-gradient(180deg,#F1F8FC_0%,#C2DAE9_100%)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#17384B] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.65)] transition hover:translate-y-[-2px]'
    ),
    heroButtonSecondary: cn(
      focusRing,
      'group inline-flex w-full items-center justify-between gap-3 rounded-full border border-[#C2DAE9]/14 bg-[#173447]/44 px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#F1F8FC] transition hover:border-[#F1F8FC]/24 hover:bg-[#F1F8FC]/8'
    ),
    card: cn(
      elevatedCard,
      'rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(27,52,69,0.9)_0%,rgba(13,27,38,0.94)_100%)]'
    ),
    creamCard:
      'rounded-[1.8rem] border border-[#E5D2AE]/36 bg-[linear-gradient(180deg,#F5E8CF_0%,#E7D5B5_100%)] text-[#17384B] shadow-[0_22px_64px_-34px_rgba(0,0,0,0.6)]',
    paperCard:
      'rounded-[1.8rem] border border-[#C2DAE9]/14 bg-[linear-gradient(180deg,rgba(24,47,62,0.88)_0%,rgba(12,25,36,0.92)_100%)] shadow-[0_24px_72px_-36px_rgba(0,0,0,0.75)]',
    divider: 'h-px w-full bg-[#C2DAE9]/14'
  },
  patterns: {
    heroSurface:
      'pointer-events-none absolute inset-0 rounded-[2.75rem] bg-[linear-gradient(180deg,rgba(28,54,70,0.84)_0%,rgba(21,42,57,0.9)_22%,rgba(14,29,40,0.94)_100%)] shadow-[0_38px_110px_-58px_rgba(0,0,0,0.8)] backdrop-blur-[10px]',
    heroSurfaceFeather:
      'pointer-events-none absolute inset-x-10 top-[-2.5rem] h-20 bg-[linear-gradient(180deg,rgba(24,45,60,0.52)_0%,rgba(24,45,60,0.18)_42%,transparent_100%)] blur-2xl',
    heroAtmosphere:
      'pointer-events-none absolute inset-x-[-4rem] bottom-[-2rem] top-[-5.5rem] rounded-[3rem] bg-[radial-gradient(circle_at_68%_36%,rgba(49,118,154,0.14)_0,transparent_20%),radial-gradient(circle_at_76%_42%,rgba(161,195,218,0.08)_0,transparent_28%),radial-gradient(circle_at_16%_20%,rgba(241,248,252,0.08)_0,transparent_20%),linear-gradient(180deg,rgba(14,24,33,0)_0%,rgba(14,24,33,0.04)_24%,rgba(14,24,33,0)_100%)] opacity-90 blur-2xl transition-transform duration-700 ease-out [mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.04)_14%,rgba(0,0,0,0.46)_22%,#000_34%,#000_100%)]',
    heroSpill:
      'pointer-events-none absolute right-[8%] top-[18%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(49,118,154,0.22)_0,rgba(49,118,154,0.08)_28%,transparent_72%)] opacity-75 blur-3xl transition-transform duration-700 ease-out [mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.04)_16%,rgba(0,0,0,0.42)_26%,#000_38%,#000_100%)]',
    heroVignette:
      'pointer-events-none absolute inset-x-[-3rem] bottom-[-1rem] top-[-4.5rem] rounded-[3rem] bg-[radial-gradient(circle_at_58%_38%,transparent_0,rgba(12,25,36,0.06)_44%,rgba(7,14,20,0.3)_100%)] opacity-90 transition-transform duration-700 ease-out [mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.04)_14%,rgba(0,0,0,0.42)_22%,#000_34%,#000_100%)]',
    heroNoise:
      'pointer-events-none absolute inset-x-[-3rem] bottom-[-1rem] top-[-4.5rem] opacity-[0.12] mix-blend-soft-light [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:3px_3px,4px_4px] [mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.04)_14%,rgba(0,0,0,0.42)_22%,#000_34%,#000_100%)]',
    heroRouteSvg:
      'pointer-events-none absolute inset-x-[-2rem] top-4 z-[1] hidden h-[40rem] w-[calc(100%+4rem)] overflow-visible transition-transform duration-700 ease-out xl:block 2xl:h-[44rem]',
    heroRouteGlow:
      'hidden',
    heroRoutePath:
      'fill-none stroke-[#C2DAE9]/18 stroke-[1.75] [stroke-linecap:butt] [stroke-linejoin:round] [stroke-dasharray:1.04] [stroke-dashoffset:1.04] motion-safe:animate-[route-draw_1.9s_cubic-bezier(0.22,1,0.36,1)_0.18s_forwards]',
    heroRoutePathSoft:
      'fill-none stroke-[#d8c18f]/11 stroke-[3.2] [stroke-linecap:butt] [stroke-linejoin:round] opacity-80 [stroke-dasharray:1.04] [stroke-dashoffset:1.04] motion-safe:animate-[route-draw_2.2s_cubic-bezier(0.22,1,0.36,1)_0.28s_forwards]',
    heroRouteNode:
      'fill-[#F1F8FC] opacity-80 [filter:drop-shadow(0_0_12px_rgba(241,248,252,0.16))] motion-safe:animate-[node-breathe_5.8s_ease-in-out_infinite]',
    heroRouteNodeWarm:
      'fill-[#cb8f6a] opacity-80 [filter:drop-shadow(0_0_16px_rgba(184,116,84,0.18))] motion-safe:animate-[node-breathe_6.4s_ease-in-out_0.6s_infinite]',
    heroSubjectWrap:
      'group/portrait relative ml-auto mt-4 flex h-full w-full items-center justify-end xl:translate-x-4 xl:-translate-y-2 2xl:translate-x-8 2xl:-translate-y-4',
    heroSubjectHalo:
      'pointer-events-none absolute right-[4%] top-[8%] h-[30rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(241,248,252,0.12)_0,rgba(161,195,218,0.1)_28%,rgba(49,118,154,0.08)_46%,transparent_76%)] blur-[76px] transition-[transform,opacity] duration-700 ease-out',
    heroSubjectBloom:
      'pointer-events-none absolute right-[2%] top-[14%] h-[28rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(161,195,218,0.12)_0,rgba(49,118,154,0.04)_34%,transparent_74%)] opacity-65 blur-[58px] transition-[opacity,transform] duration-700 ease-out group-hover/portrait:opacity-88',
    heroPanel:
      'relative z-10 flex h-full w-full max-w-[24rem] flex-col justify-between gap-6 rounded-[2.5rem] border border-[#C2DAE9]/10 bg-[linear-gradient(180deg,rgba(9,16,23,0.96)_0%,rgba(5,9,14,0.98)_100%)] p-6 shadow-[0_36px_90px_-48px_rgba(0,0,0,0.95)]',
    heroPanelGlow:
      'pointer-events-none absolute inset-0 rounded-[2.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,transparent_28%,transparent_100%)]',
    heroPanelImageWrap:
      'relative overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(24,24,24,0.66)_0%,rgba(12,12,12,0.84)_100%)]',
    heroPanelImage:
      'block aspect-[4/5] w-full object-cover object-[66%_52%] saturate-[0.86] contrast-[1.1] brightness-[0.9] transition-[filter,transform] duration-700 ease-out group-hover/portrait:saturate-[0.92] group-hover/portrait:contrast-[1.16] group-hover/portrait:brightness-[0.96]',
    heroPanelImageShade:
      'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,transparent_0,transparent_32%,rgba(0,0,0,0.12)_58%,rgba(0,0,0,0.34)_100%)]',
    heroPanelLink:
      'relative z-10 inline-flex items-center gap-3 self-start rounded-full border border-[#C2DAE9]/14 bg-white/[0.04] px-4 py-3 text-sm font-medium tracking-[0.02em] text-[#F1F8FC] transition hover:border-[#F1F8FC]/20 hover:bg-white/[0.07]',
    heroPanelLinkIcon:
      'flex h-9 w-9 items-center justify-center rounded-full border border-[#C2DAE9]/14 bg-white/[0.05] text-[#F1F8FC]',
    heroSubjectNode:
      'pointer-events-none absolute right-[10%] top-[72%] h-3 w-3 rounded-full border border-[#C2DAE9]/22 bg-[radial-gradient(circle,#F1F8FC_0%,#AECBDF_42%,#31769A_100%)] shadow-[0_0_0_6px_rgba(241,248,252,0.05),0_0_22px_rgba(49,118,154,0.17)] motion-safe:animate-[node-breathe_5.4s_ease-in-out_infinite]',
    heroTitleHighlight:
      'inline-flex w-auto max-w-max self-start whitespace-nowrap rounded-[0.1em] border border-[#C2DAE9]/10 bg-[linear-gradient(180deg,rgba(7,13,18,0.94)_0%,rgba(4,8,12,0.98)_100%)] px-[0.18em] py-[0.06em] !text-[#F1F8FC] shadow-[0_24px_54px_-32px_rgba(0,0,0,0.78)]',
    heroTitleHighlightOffset:
      'mt-3 sm:mt-4',
    statCard:
      'relative flex h-full min-h-[18.75rem] flex-col overflow-hidden rounded-[1.6rem] border border-[#C2DAE9]/14 bg-[linear-gradient(180deg,rgba(25,46,60,0.92)_0%,rgba(12,25,35,0.95)_100%)] p-7 sm:p-8 shadow-[0_18px_54px_-30px_rgba(0,0,0,0.68)]',
    statLine: 'mb-8 block h-[0.28rem] w-16 rounded-full',
    marqueeShell:
      'border-y border-[#C2DAE9]/12 bg-[#173447]/34 py-5 backdrop-blur-sm',
    marqueeTrack:
      'flex min-w-max items-center gap-6 whitespace-nowrap motion-safe:animate-[marquee_34s_linear_infinite]',
    marqueeItem:
      'inline-flex items-center gap-6 text-sm uppercase tracking-[0.26em] text-[#C2DAE9]',
    quoteCard: cn(
      fontSerif,
      'rounded-[1.8rem] border border-[#E5D2AE]/36 bg-[linear-gradient(180deg,#F5E8CF_0%,#E7D5B5_100%)] p-6 text-[1.45rem] leading-8 text-[#17384B] shadow-[0_24px_70px_-36px_rgba(0,0,0,0.56)]'
    ),
    quoteNote: 'mt-5 text-xs uppercase tracking-[0.26em] text-[#31769A]',
    workRow:
      'group relative overflow-hidden rounded-[1.9rem] border border-[#C2DAE9]/12 bg-[linear-gradient(180deg,rgba(24,45,60,0.82)_0%,rgba(12,25,35,0.88)_100%)] p-6 transition-[border-color,box-shadow,transform] duration-500 ease-out hover:border-[#F1F8FC]/20 hover:shadow-[0_28px_72px_-44px_rgba(0,0,0,0.72)] sm:p-8',
    workOrbit:
      'pointer-events-none absolute right-8 top-7 hidden h-20 w-20 scale-[0.96] opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:scale-100 group-hover:opacity-100 lg:block',
    workOrbitAura:
      'absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(174,203,223,0.1)_0,rgba(49,118,154,0.05)_34%,transparent_72%)] blur-lg',
    workOrbitTrackWarm:
      'absolute inset-0 rounded-full [background:conic-gradient(from_215deg,transparent_0deg,rgba(161,195,218,0.0)_34deg,rgba(161,195,218,0.2)_96deg,transparent_158deg,transparent_360deg)] [mask:radial-gradient(farthest-side,transparent_calc(100%-1.7px),#000_calc(100%-1.1px))]',
    workOrbitTrackClay:
      'absolute inset-[0.72rem] rounded-full [background:conic-gradient(from_18deg,transparent_0deg,rgba(49,118,154,0.0)_20deg,rgba(49,118,154,0.18)_88deg,transparent_144deg,transparent_360deg)] [mask:radial-gradient(farthest-side,transparent_calc(100%-1.6px),#000_calc(100%-1px))]',
    workOrbitSpinPrimary:
      'absolute inset-0 motion-safe:group-hover:animate-[work-orbit_13.5s_linear_infinite]',
    workOrbitSpinSecondary:
      'absolute inset-[0.72rem] motion-safe:group-hover:animate-[work-orbit-reverse_16.5s_linear_infinite]',
    workOrbitDotWarm:
      'absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#C2DAE9] shadow-[0_0_10px_rgba(194,218,233,0.28)]',
    workOrbitDotClay:
      'absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#31769A] shadow-[0_0_8px_rgba(49,118,154,0.24)]',
    workTag:
      'inline-flex items-center rounded-full border border-[#C2DAE9]/12 bg-[#F1F8FC]/8 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-[#F1F8FC]',
    indexCard:
      'group flex h-full rounded-[1.8rem] border border-[#E5D2AE]/36 bg-[linear-gradient(180deg,#F5E8CF_0%,#E7D5B5_100%)] p-6 text-[#17384B] shadow-[0_20px_64px_-34px_rgba(0,0,0,0.58)]',
    indexCardClay:
      'group flex h-full rounded-[1.8rem] border border-[#AECBDF]/24 bg-[linear-gradient(180deg,#31769A_0%,#245D7B_100%)] p-6 text-[#F1F8FC] shadow-[0_20px_64px_-34px_rgba(0,0,0,0.58)]',
    chip:
      'inline-flex items-center rounded-full border border-current/16 bg-black/6 px-3 py-1.5 text-xs uppercase tracking-[0.2em]',
    formCard:
      'rounded-[1.8rem] border border-[#C2DAE9]/14 bg-[linear-gradient(180deg,rgba(24,45,60,0.9)_0%,rgba(12,25,35,0.94)_100%)] p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.72)]',
    formLabel: 'text-xs uppercase tracking-[0.24em] text-[#AECBDF]',
    input: cn(
      focusRing,
      'w-full rounded-[1.15rem] border border-[#C2DAE9]/14 bg-[#173447]/62 px-4 py-4 text-sm text-[#F1F8FC] placeholder:text-[#AECBDF] transition hover:border-[#F1F8FC]/18 focus:border-[#F1F8FC]/26'
    ),
    textarea: cn(
      focusRing,
      'min-h-[10.5rem] w-full resize-none rounded-[1.15rem] border border-[#C2DAE9]/14 bg-[#173447]/62 px-4 py-4 text-sm text-[#F1F8FC] placeholder:text-[#AECBDF] transition hover:border-[#F1F8FC]/18 focus:border-[#F1F8FC]/26'
    ),
    formActionRow: 'flex flex-wrap items-center gap-3',
    formStatusSuccess:
      'rounded-[1.15rem] border border-[#AECBDF]/28 bg-[#AECBDF]/14 px-4 py-3 text-sm text-[#F1F8FC]',
    formStatusError:
      'rounded-[1.15rem] border border-[#A1C3DA]/26 bg-[#31769A]/14 px-4 py-3 text-sm text-[#F1F8FC]',
    journeyRail:
      'relative h-full w-8',
    journeyLine:
      'absolute left-1/2 top-0 h-full w-px -translate-x-1/2 rounded-full bg-[#C2DAE9]/12',
    journeyTrail:
      'absolute left-1/2 top-0 w-px -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,rgba(241,248,252,0.06)_0%,rgba(174,203,223,0.28)_58%,rgba(49,118,154,0.54)_100%)] opacity-90 transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
    journeyMarker:
      'absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C2DAE9]/18 bg-[#163447]/92 transition-[opacity,box-shadow] duration-500 ease-out',
    journeyMarkerActive:
      'opacity-100 shadow-[0_0_0_4px_rgba(239,225,199,0.05)]',
    journeyMarkerIdle:
      'opacity-50',
    journeyNode:
      'absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C2DAE9]/18 bg-[radial-gradient(circle,#F1F8FC_0%,#AECBDF_42%,#31769A_100%)] shadow-[0_0_0_6px_rgba(241,248,252,0.05),0_0_22px_rgba(49,118,154,0.18)] transition-[top,transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
    journeyNodeEnd:
      'scale-[1.18] shadow-[0_0_0_9px_rgba(241,248,252,0.05),0_0_30px_rgba(49,118,154,0.24)]',
    journeyNodePulse:
      'motion-safe:animate-[journey-pulse_900ms_cubic-bezier(0.22,1,0.36,1)_1]'
  },
  utility: {
    hiddenUntilReveal: 'opacity-0',
    hiddenOnMobile: 'hidden md:flex',
    visibleOnMobile: 'flex md:hidden',
    proseMax: 'max-w-3xl'
  }
} as const;

export const toneClasses = {
  moss: tokens.patterns.indexCard,
  cream: tokens.patterns.indexCard,
  clay: tokens.patterns.indexCardClay
} as const;
