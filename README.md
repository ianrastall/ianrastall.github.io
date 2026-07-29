# ianrastall.github.io

Source for Ian Rastall's public GitHub Pages site at `https://ianrastall.github.io`.

The site is a single standalone HTML file — [index.html](index.html) — with embedded CSS and
JavaScript, and no build step. It's a searchable quick reference for common PowerShell commands
(navigation, files, system info, processes, networking, and more).

## Local development

No install or build step is required. To preview:

```powershell
# From the repo root, open the file directly...
start index.html

# ...or serve it so relative paths behave exactly like production:
python -m http.server 8000
```

Then edit `index.html` directly — the reference data lives in the `data` array near the top of
its `<script>` block.

## Deployment

Pushes to `main` trigger [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which
publishes the repository root straight to GitHub Pages via GitHub Actions. There is nothing to
build or bundle.
