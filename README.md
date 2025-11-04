# Wedding Site

A modern, earth-toned single-page wedding website for celebrating at Lareau Farm in Waitsfield, Vermont on July 11, 2026. Built with [Hugo](https://gohugo.io/) using a custom theme inspired by Green Mountain vibes (think warm wood, sage greens, and soft neutrals).

## Getting started

```bash
# Install dependencies (Hugo extended) if you don't already have it
hugo version

# Run the development server with live reload
hugo server -D
```

Navigate to `http://localhost:1313` to preview the site. The sticky navigation includes scroll-spy highlighting to guide guests as they explore each section.

## Customizing content

Most content is controlled through `hugo.toml` so you can quickly update details without touching layout code.

- **Names, date, location, and tagline:** `params.coupleNames`, `params.weddingDate`, `params.weddingLocation`, and `params.heroTagline`
- **Schedule:** Update the `[[params.schedule]]` entries
- **Travel tips, lodging ideas, registries, and MTB trails:** Update the corresponding parameter arrays
- **RSVP button:** Point `params.rsvpLink` at your actual form or email

If you need to adjust imagery, edit `themes/lareau-earth/assets/css/main.css` (the hero uses an Unsplash background URL you can swap out for your own photo).

After making changes, run `hugo` to generate the static `public/` directory.

```bash
hugo
```

## Deploying to GitHub Pages

1. Update the `baseURL` value in `hugo.toml` to match your repository (e.g. `https://<username>.github.io/wedding-site/`).
2. Commit and push the site to your GitHub repository.
3. In GitHub, enable Pages for the repository and select the `gh-pages` branch (or configure GitHub Actions to publish the `public/` folder).

For an example workflow, see the [official Hugo GitHub Pages guide](https://gohugo.io/hosting-and-deployment/hosting-on-github/).

## Theme

The custom `lareau-earth` theme lives in `themes/lareau-earth` and includes:

- Sticky, scroll-spy navigation with smooth section transitions
- Earth-toned palette inspired by Vermont forests and farmhouses
- Custom layouts for the single-page experience, including a hidden-in-plain-sight MTB section for fellow riders

Feel free to adapt or extend the theme to fit your celebration!
