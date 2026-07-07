export type AccentTone = 'moss' | 'cream' | 'clay';

export interface NavItem {
  label: string;
  href: `#${string}`;
}

export interface CallToAction {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
  note: string;
}

export interface SiteProfile {
  name: string;
  role: string;
  eyebrow: string;
  headlineLead: string;
  headlineAccent: string;
  summary: string;
  location: string;
  availability: string;
  journalMark: string;
  portraitSrc: string;
  portraitAlt: string;
  linkedinHref: string;
  primaryCta: CallToAction;
  secondaryCta: CallToAction;
  downloadCta: CallToAction;
  stats: Stat[];
  marquee: string[];
}

export interface ManifestoFragment {
  text: string;
  italic?: boolean;
}

export interface ManifestoContent {
  eyebrow: string;
  fragments: ManifestoFragment[];
  quote: string;
  note: string;
  figure: string;
}

export interface FeaturedProject {
  number: string;
  period: string;
  title: string;
  titleItalic: string;
  summary: string;
  tags: string[];
  href: string;
}

export interface IndexEntry {
  numeral: string;
  title: string;
  body: string;
  chips: string[];
  tone: AccentTone;
}

export interface ExperienceItem {
  year: string;
  title: string;
  company: string;
  place: string;
  body: string;
}

export interface ContactLink {
  label: string;
  href: string;
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  titleItalic: string;
  summary: string;
  note: string;
  location: string;
  downloadLabel: string;
  links: ContactLink[];
}

export interface PortfolioContent {
  meta: {
    title: string;
    description: string;
  };
  navigation: NavItem[];
  site: SiteProfile;
  manifesto: ManifestoContent;
  featuredProjects: FeaturedProject[];
  indexEntries: IndexEntry[];
  experience: ExperienceItem[];
  contact: ContactContent;
  footerNote: string;
}
