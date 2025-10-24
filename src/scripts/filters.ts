interface FilterState {
  price?: boolean;
  pet_friendly?: boolean;
  family_friendly?: boolean;
  distance?: boolean;
}

type Predicate = (card: HTMLElement) => boolean;

const predicates: Record<keyof FilterState, Predicate> = {
  price: (card) => {
    const price = card.getAttribute('data-price');
    return price === '$' || price === '$$';
  },
  pet_friendly: (card) => card.getAttribute('data-pet') === 'true',
  family_friendly: (card) => card.getAttribute('data-family') === 'true',
  distance: (card) => {
    const minutes = Number(card.getAttribute('data-distance'));
    return Number.isFinite(minutes) ? minutes <= 15 : true;
  }
};

export function initFilters() {
  const container = document.querySelector<HTMLElement>('[data-filter-group]');
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-place]'));
  if (!container || !cards.length) return;

  const state: FilterState = {};

  const update = () => {
    cards.forEach((card) => {
      const visible = Object.entries(state).every(([key, active]) => {
        if (!active) return true;
        const predicate = predicates[key as keyof FilterState];
        return predicate ? predicate(card) : true;
      });
      card.toggleAttribute('hidden', !visible);
      card.setAttribute('aria-hidden', visible ? 'false' : 'true');
    });
  };

  container.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-filter]');
    if (!target) return;
    const key = target.getAttribute('data-filter') as keyof FilterState;
    if (!key) return;
    const next = !(state[key] ?? false);
    state[key] = next;
    target.setAttribute('aria-pressed', String(next));
    update();
  });

  update();
}
