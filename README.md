# Anna & Jamie's Wedding Site

A Hugo-powered, single-page wedding website for our celebration at Lareau Farm in Waitsfield, Vermont on July 11, 2026. The design leans into modern earth tones with a sticky scroll-spy navigation and an MTB easter egg for fellow riders.

## Getting Started

1. [Install Hugo](https://gohugo.io/installation/) extended version if you haven't already.
2. Update the `baseURL` in `config.toml` with your GitHub Pages URL (`https://<your-github-username>.github.io/wedding-site/`).
3. Run the development server:

   ```bash
   hugo server -D
   ```

   The site will be available at `http://localhost:1313`.

## Deploying to GitHub Pages

1. Generate the production build:

   ```bash
   hugo --minify
   ```

   The static site will be created in the `public/` directory.

2. Push the contents of `public/` to your `gh-pages` branch (or the repository root when using the `username.github.io` pattern). One simple approach is to add the `public` folder as a Git submodule pointing to a separate branch.

3. Enable GitHub Pages in the repository settings and point it at the branch/folder that contains the generated files.

## Customizing

- Update copy and sections by editing `layouts/index.html`.
- Adjust colors, typography, and spacing in `static/css/style.css`.
- Modify navigation behavior or scroll-spy logic in `static/js/main.js`.

Happy planning!
