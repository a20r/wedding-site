interface CountdownConfig {
  element: HTMLElement;
  date: string;
  timezone: string;
}

function parseISODate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return { year, month, day };
}

function getUTCFromParts(parts: { year: number; month: number; day: number }) {
  return Date.UTC(parts.year, parts.month - 1, parts.day);
}

function getTodayInZone(timezone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const partsMap = formatter.formatToParts(new Date()).reduce<Record<string, string>>((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});
  return {
    year: Number(partsMap.year),
    month: Number(partsMap.month),
    day: Number(partsMap.day)
  };
}

function renderCountdown({ element, date, timezone }: CountdownConfig) {
  const event = parseISODate(date);
  const eventUTC = getUTCFromParts(event);
  const today = getTodayInZone(timezone);
  const todayUTC = getUTCFromParts(today);
  const diff = eventUTC - todayUTC;
  const days = Math.round(diff / (1000 * 60 * 60 * 24));

  if (days < 0) {
    element.textContent = 'We did it!';
    return;
  }

  if (days === 0) {
    element.textContent = 'It\'s wedding day!';
  } else if (days === 1) {
    element.textContent = '1 day to go!';
  } else {
    element.textContent = `${days} days to go!`;
  }
}

export function initCountdown() {
  const el = document.querySelector<HTMLElement>('[data-countdown]');
  if (!el) return;

  const date = el.getAttribute('data-date');
  const timezone = el.getAttribute('data-timezone');
  if (!date || !timezone) return;

  const update = () => renderCountdown({ element: el, date, timezone });
  update();
  setInterval(update, 60 * 60 * 1000);
}
