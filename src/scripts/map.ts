type LeafletMap = (element: HTMLElement, options: { center: [number, number]; zoom: number }) => any;
type LeafletTileLayer = (url: string, options: Record<string, unknown>) => { addTo(map: any): void };
type LeafletMarker = (coords: [number, number]) => { addTo(map: any): { bindPopup(label: string): void } };

interface LeafletModule {
  map: LeafletMap;
  tileLayer: LeafletTileLayer;
  marker: LeafletMarker;
}

export async function initMap() {
  const mapEl = document.querySelector<HTMLElement>('[data-map]');
  if (!mapEl) return;
  const enabled = mapEl.getAttribute('data-enabled');
  if (enabled !== 'true') return;

  const hasCoords =
    Array.from(document.querySelectorAll<HTMLElement>('[data-place]')).some((card) => {
      const lat = card.getAttribute('data-lat');
      const lng = card.getAttribute('data-lng');
      return lat !== null && lng !== null && lat !== 'null' && lng !== 'null';
    }) ||
    (mapEl.getAttribute('data-venue-lat') !== 'null' && mapEl.getAttribute('data-venue-lng') !== 'null');

  if (!hasCoords) return;

  await ensureLeafletStyles();

  let leaflet: LeafletModule;
  try {
    leaflet = await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');
  } catch (error) {
    console.warn('Leaflet failed to load', error);
    return;
  }

  const { map, tileLayer, marker } = leaflet;
  mapEl.setAttribute('data-enabled', 'true');
  const lat = parseFloat(mapEl.getAttribute('data-venue-lat') || '0');
  const lngAttr = mapEl.getAttribute('data-venue-lng') || '0';
  const lng = parseFloat(lngAttr);
  const hasVenue = Number.isFinite(lat) && Number.isFinite(lng);
  const mapInstance = map(mapEl, {
    center: hasVenue ? [lat, lng] : [44.192, -72.825],
    zoom: hasVenue ? 13 : 11
  });

  tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance);

  if (hasVenue) {
    marker([lat, lng]).addTo(mapInstance).bindPopup(mapEl.getAttribute('data-venue-name') || 'Venue');
  }
}

async function ensureLeafletStyles() {
  if (document.querySelector('link[data-leaflet]')) return;
  await new Promise<void>((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.setAttribute('data-leaflet', 'true');
    link.addEventListener('load', () => resolve());
    link.addEventListener('error', () => resolve());
    document.head.append(link);
  });
}
