# Fooliosity Time Wasters — Codex Handoff

## 1. Purpose

This repository will contain **Fooliosity**, Ian Rastall's public collection of time wasters and simple browser games, served at:

```text
https://ianrastall.github.io
```

The site is styled and structured identically to the `text-utils` project, but hosts entertainment-focused applications (like a match-3 game) rather than productive utilities.

## 2. Current repository state

The site has been re-architected as a Time Wasters portal. The previous blog infrastructure has been entirely removed.

The repository contains:

- Astro configuration and package manifests;
- Core layouts and styling matching `text-utils` (e.g., `BaseLayout.astro`, `global.css`);
- `src/data/tools.ts` which tracks available tools and games;
- A card-based home page (`src/pages/index.astro`);
- An initial game: `pick-three.astro` (a low-stress match-3 puzzle).

Generated folders such as `node_modules/`, `dist/`, and `.astro/` are intentionally ignored and should not be committed.

## 3. Repository boundaries

| Repository | Responsibility |
|---|---|
| `ianrastall/ianrastall.github.io` | This public website source and GitHub Pages deployment |

Non-negotiable rules:
- Keep the design identical in structure to `text-utils` (shell, panels, muted accents).
- Do not re-introduce the Markdown blog infrastructure.
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
- React/Vue/Svelte unless a specific isolated game clearly requires one;
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
  components/
    ToolCard.astro
  data/
    tools.ts
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    pick-three.astro
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

## 8. Definition of done for tools

When adding a new tool or game:
- Add an entry in `src/data/tools.ts`.
- Ensure colors are muted and animations are not excessive or "flashy".
- The game logic must live on the client-side within an Astro page.
