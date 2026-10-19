export type Craft = 'counterform' | 'bearing' | 'throughline';
export type CraftPage = 'home' | 'story' | 'cv';
export const craftNames = { counterform: 'Counterform', bearing: 'Bearing', throughline: 'Throughline' };
export function craftLinks(direction: Craft, page: CraftPage) {
  const base = `/hero-lab/${direction}`;
  return [
    { label: 'Home', href: base, current: page === 'home' },
    { label: 'Work', href: page === 'home' ? '#work' : base + '#work', current: false },
    { label: 'Story', href: base + '/story', current: page === 'story' },
    { label: 'CV', href: base + '/cv', current: page === 'cv' }
  ];
}
