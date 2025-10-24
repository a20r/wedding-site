# Alex & Lily Wedding Site

A modern-yet-goofy single-page wedding website generated with [Eleventy](https://www.11ty.dev/). Fully static and optimized for GitHub Pages deployments.

## Quick start

```bash
npm install
npm run build
```

The compiled site lives in `dist/`.

### Local development

```bash
npm run dev
```

This runs esbuild in watch mode and `eleventy --serve` with hot reload. Visit `http://localhost:8080`.

You can also use the Taskfile helpers:

```bash
task dev
# or
task build
```

## Content model

All content lives in [`src/_data/config.yaml`](src/_data/config.yaml) and is validated at build-time with Zod. Each top-level section maps directly to a block on the single-page layout:

- `site` &mdash; Site metadata, hero content, RSVP Typeform URL, analytics, and map toggle.
- `sections` &mdash; Enable/disable chunks like RSVP, schedule, lodging, etc.
- `theme` &mdash; Color palette and font selections (system fonts by default). Setting `theme.fonts.use_webfonts: true` will load Google Fonts with `font-display: swap`.
- `easter_eggs` &mdash; Currently supports enabling the Konami “Pow Day Mode”.

### Editing tips

- Dates:
  - `site.date_iso` is the wedding date (YYYY-MM-DD).
  - `sections.schedule.items[].time_rfc3339` must include an explicit timezone offset (`2026-07-11T15:00:00-04:00`).
- Lodging:
  - `price_range` accepts `$`, `$$`, or `$$$`.
  - `status` accepts `on_hold`, `available`, or `full`.
  - Optional `lat`/`lng` coordinates allow the Leaflet map (when enabled).
- Activities, hikes, MTB, and registry links accept optional URLs; leave blank for plain text.
- Set `site.map_enabled: true` and provide at least one coordinate to render the interactive map.

Invalid YAML values fail the build with clear messages that highlight the offending path.

## BASE_URL & GitHub Pages

The GitHub Action automatically sets `BASE_URL` for project pages (e.g. `/owner/repo`). When testing locally you can override:

```bash
BASE_URL=/alex-lily npm run build
```

All assets and links respect this base path.

## Features

- Sticky header with scroll-spy and keyboard-friendly navigation.
- Hero section with RSVP call-to-action and timezone-aware countdown.
- Data-driven sections for travel, lodging filters, activities, hikes, MTB, FAQ, and registry.
- Optional Leaflet map powered by OpenStreetMap tiles.
- Konami code / long-press easter egg that toggles an 8-second “Pow Day Mode”. Disabled automatically under `prefers-reduced-motion`.
- Accessible focus states, semantic markup, and skip link.
- Lightweight footprint (esbuild-bundled JS, critical CSS inlined).

## Testing & deployment

- `npm run build` runs Zod validation, bundles TypeScript (<100 KB gzipped target), and outputs to `dist/`.
- `npm run typecheck` runs TypeScript in `--noEmit` mode.
- The GitHub Pages workflow (`.github/workflows/pages.yml`) builds on Node.js 20, uploads the `dist/` artifact, and deploys via `actions/deploy-pages@v4`.

To publish manually from the CLI:

```bash
npm run deploy
```

This uses `gh-pages` to push the latest `dist/` folder to the `gh-pages` branch.

## Editing styles & scripts

- Critical, above-the-fold styles live in [`src/styles/critical.css`](src/styles/critical.css) and are inlined in the document `<head>`.
- Remaining styles live in [`src/styles/main.css`](src/styles/main.css) and are served as an external stylesheet.
- TypeScript entry point: [`src/scripts/index.ts`](src/scripts/index.ts).
  - `scrollspy.ts` handles sticky navigation.
  - `countdown.ts` computes New York midnight day-deltas.
  - `filters.ts` enables lodging filter chips without layout jumps.
  - `konami.ts` controls Pow Day Mode, including long-press support.
  - `map.ts` lazy-loads Leaflet when enabled and coordinates are present.

## Accessibility & performance

- Semantic sectioning elements with `aria-live` feedback for the countdown and `aria-current` management for navigation.
- Focus states use high-contrast outlines with offset.
- Animations respect `prefers-reduced-motion`.
- No client-side frameworks; the JS bundle stays well within the 100 KB gzipped budget, and CSS under 50 KB gzipped.

## Updating assets

Place static images or SVG icons in [`src/assets/`](src/assets/) and Eleventy will copy them to `dist/assets/`. All asset links should be prefixed with `{{ site.BASE_URL }}` when referenced in templates.

## Konami / Pow Day Mode testing

- Keyboard: Enter the classic sequence `↑↑↓↓←→←→BA`.
- Touch: Long-press the logo for ~800 ms.
- The overlay self-dismisses after 8 seconds or via the close button.
- The easter egg respects `prefers-reduced-motion` and can be disabled via YAML.

## License

MIT. Enjoy the shenanigans!
