# Agent instructions for ianrastall.github.io

Repository boundaries:

- This repository is the public GitHub Pages website source for `https://ianrastall.github.io`.
- The entire site is [index.html](index.html): one standalone HTML5 file with embedded CSS and
  JavaScript. There is no build step, no framework, and no `src/` tree.
- [404.html](404.html) is a small standalone error page, styled independently of `index.html`.

Primary direction:

- Keep the site a single static HTML file with no build tooling (no Astro, no bundler, no
  npm dependencies). Edit `index.html` directly.
- The page is a searchable PowerShell command reference. Content lives in the `data` array
  (and the `aliasCheatSheet` array) inside `index.html`'s `<script>` block — add new rows there
  rather than hand-writing table markup.
- Do not reintroduce a server runtime, database, CMS, authentication backend, or JS framework
  build pipeline for this site.
- Deployment is handled by [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which
  publishes the repository root as-is via GitHub Actions. Don't add a build/compile step to it.
