# Ian Rastall Repository Landing Page — Codex Handoff

## 1. Purpose

This repository contains Ian Rastall's public GitHub Pages landing page, served at:

```text
https://ianrastall.github.io
```

The site is a single clean index page. Each listed repository appears as an independent blurb box and links directly to its GitHub repository.

## 2. Current repository state

The site has been simplified into a repository directory. Internal game/tool routing has been removed.

The repository contains:

- Astro configuration and package manifests;
- Core layout and styling (`BaseLayout.astro`, `global.css`);
- A single repository landing page (`src/pages/index.astro`);
- A simple 404 page.

Generated folders such as `node_modules/`, `dist/`, and `.astro/` are intentionally ignored and should not be committed.

## 3. Repository boundaries

| Repository | Responsibility |
|---|---|
| `ianrastall/ianrastall.github.io` | This public website source and GitHub Pages deployment |

Non-negotiable rules:
- Keep repository data directly in `src/pages/index.astro`.
- Do not add internal project pages or route cards.
- Do not re-introduce the Markdown blog infrastructure or the old game portal.
- Do not add a server runtime, database, conventional CMS, or authentication backend.

## 4. Intended technology stack

Use:

```text
Astro
TypeScript where configuration or components require it
GitHub Actions
GitHub Pages
```

Avoid:
- a client-heavy single-page application architecture for the shell;
- React/Vue/Svelte for this static landing page;
- unnecessary analytics or tracking.

## 5. Primary architecture

A recommended target structure is:

```text
.github/
  workflows/
    deploy.yml
public/
  favicon.svg
src/
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    404.astro
  styles/
    global.css
astro.config.mjs
package.json
tsconfig.json
README.md
AGENTS.md
CODEX_HANDOFF.md
```

## 6. GitHub Pages deployment

The repository name is correctly reserved for a user site:

```text
ianrastall.github.io
```

The production URL should therefore be rooted at:

```text
https://ianrastall.github.io/
```

Use an Actions-based Astro deployment rather than committing generated output to `main`.

## 7. Local development commands

Current local command pattern:

```powershell
npm install
npm run dev
npm run build
```

Recommended scripts:

```json
{
  "scripts": {
    "dev": "astro dev --host 127.0.0.1",
    "build": "astro check && astro build",
    "preview": "astro preview --host 127.0.0.1",
    "check": "astro check"
  }
}
```

## 8. Definition of done for repository entries

When adding a new repository:
- Add one object to the `repos` array in `src/pages/index.astro`.
- Include `name`, `description`, and `url`.
- Link directly to the GitHub repository with `target="_blank"` and `rel="noopener noreferrer"`.
