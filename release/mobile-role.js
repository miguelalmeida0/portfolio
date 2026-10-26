// Native details keeps navigation usable before JavaScript and without it.
(() => {
  const menu = document.querySelector('.mobile-menu');
  const summary = menu.querySelector('summary');
  const mobile = matchMedia('(max-width: 767px)');
  const close = () => { menu.open = false; };
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) close();
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      event.preventDefault();
      close();
      summary.focus({preventScroll: true});
    }
  });
  mobile.addEventListener('change', () => { if (!mobile.matches) close(); });
})();
