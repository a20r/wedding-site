(function () {
  const nav = document.getElementById('site-nav');
  const links = Array.from(document.querySelectorAll('.nav__links a'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const toggle = document.querySelector('.nav__toggle');
  const navMenu = document.getElementById('nav-menu');

  function setActiveLink() {
    const offset = nav.offsetHeight + 8;
    let activeSection = sections[0];

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top - offset <= 0) {
        activeSection = section;
      }
    });

    links.forEach((link) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target === activeSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  window.addEventListener('resize', setActiveLink);
  window.addEventListener('load', setActiveLink);

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
  });

  links.forEach((link) =>
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    })
  );
})();
