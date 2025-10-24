const rootMargin = '-40% 0px -55% 0px';

export function initScrollSpy() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  const sections = links
    .map((link) => document.querySelector<HTMLElement>(link.hash))
    .filter((section): section is HTMLElement => Boolean(section));

  if (!('IntersectionObserver' in window) || !sections.length) {
    return;
  }

  const setActive = (id: string | null) => {
    links.forEach((link) => {
      if (link.hash === `#${id}`) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? -1 : 1));
      if (visible[0]?.target?.id) {
        setActive(visible[0].target.id);
      }
    },
    { rootMargin }
  );

  sections.forEach((section) => observer.observe(section));

  window.addEventListener('hashchange', () => {
    const id = window.location.hash.replace('#', '');
    if (id) {
      setActive(id);
    }
  });

  if (window.location.hash) {
    setActive(window.location.hash.replace('#', ''));
  } else {
    setActive(sections[0]?.id ?? null);
  }
}
