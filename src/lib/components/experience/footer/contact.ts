export const EMAIL = 'miguelalmeida1592@gmail.com';
export const STOPS = [
  { id: 'email', name: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, external: false, hint: 'Copies it and opens your mail app', status: 'Copy + open' },
  { id: 'linkedin', name: 'LinkedIn', value: 'Miguel Almeida', href: 'https://www.linkedin.com/in/miguelalmeida1/', external: true, hint: 'Opens in a new tab ↗', status: 'Direct ↗' },
  { id: 'github', name: 'GitHub', value: 'Miguel Almeida', href: 'https://github.com/miguelalmeida0', external: true, hint: 'Opens in a new tab ↗', status: 'Direct ↗' },
  { id: 'resume', name: 'Résumé', value: 'One page, PDF', href: '/portfolio.pdf', external: true, hint: 'Opens the PDF in a new tab ↗', status: 'View PDF ↗' }
] as const;
export const STOP_AT = [16, 39, 62, 85] as const;
