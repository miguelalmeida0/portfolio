export interface MetaLink {
  label: string;
  href: string;
}

export interface HeroContent {
  subtitle: string;
  intro: string;
  primaryCta: MetaLink;
  secondaryCta: MetaLink;
}

export interface SelectedWorkItem {
  title: string;
  tagline: string;
  meta: string;
  href: string;
}

export interface ApproachItem {
  title: string;
  body: string;
}

export interface ExperienceTeaserItem {
  years: string;
  role: string;
  company: string;
}

export interface ConversationCta extends MetaLink {
  tone: 'primary' | 'ghost';
}

export interface ConversationFlow {
  id: 'recruiter' | 'collaborator' | 'wanderer';
  label: string;
  teaser: string;
  greeting: string;
  body: string;
  meta: string;
  ctas: ConversationCta[];
}

export interface CvExperienceEntry {
  years: string;
  role: string;
  company: string;
  location: string;
  bullets: string[];
}

export interface CvEducationEntry {
  year: string;
  title: string;
  place: string;
}

export interface StoryChapter {
  id: string;
  year: string;
  kicker: string;
  title: string;
  body: string[];
  quote?: string;
  footnote?: boolean;
}
