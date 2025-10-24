import { initScrollSpy } from './scrollspy';
import { initCountdown } from './countdown';
import { initKonami } from './konami';
import { initFilters } from './filters';
import { initMap } from './map';

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.remove('no-js');
  initScrollSpy();
  initCountdown();
  initFilters();
  initKonami();
  initMap();
});
