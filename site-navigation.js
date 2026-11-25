(() => {
  const header = document.querySelector('.site-header');
  const nav = header.querySelector('.nav');
  const button = nav.querySelector('.menu-toggle');
  const menu = document.getElementById('home-menu');
  const mobile = matchMedia('(max-width: 767px)');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
  }
  nav.classList.add('is-enhanced');
  button.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));
  mobile.addEventListener('change', () => setMenu(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      button.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) || menu.contains(event.target)) setMenu(false);
  });
  const updateHeader = () => header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();
