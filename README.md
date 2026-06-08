# Fooliosity

Source repository for the public website at <https://ianrastall.github.io>.

Fooliosity is an Astro static site published by GitHub Actions to GitHub Pages. Posts are ordinary Markdown files in `src/content/blog/` so BlogCreator can eventually write them without needing a server, database, CMS, or generated `dist/` commit.

## Local Commands

Run these from the repository root in PowerShell:

```powershell
npm install
npm run dev
npm run build
npm run preview
```

`npm run dev` starts the local editing server. `npm run build` runs Astro type/content checks, builds the static site into `dist/`, and generates the Pagefind search index.

## Publishing

This repository uses a one-branch workflow: commit directly to `main`, then push.

Commit source files, Markdown posts, assets under `public/`, `package.json`, and `package-lock.json`.

Do not commit:

- `node_modules/`
- `dist/`
- `.astro/`
- local preview logs

Those are ignored because GitHub Actions rebuilds them.

After the first workflow run, GitHub Pages may need to be set once to use Actions:

1. Open the repository on GitHub.
2. Go to **Settings**.
3. Open **Pages**.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.

## Post Front Matter

Posts use this Markdown front matter shape:

```yaml
---
title: "Example title"
description: "Concise summary for listings, RSS, search, and metadata."
published: "2026-06-07T19:45:00-05:00"
updated: "2026-06-07T20:15:00-05:00"
slug: "example-title"
category: "Programming"
tags:
  - Python
draft: false
featured: false
heroImage: "/images/posts/example-title/hero.webp"
heroAlt: "Description of the image."
heroCaption: "Optional caption shown below the image."
aiAssisted: true
aiDisclosure: "This post was drafted with AI assistance and reviewed before publication."
---
```

`updated`, `heroImage`, `heroAlt`, `heroCaption`, `aiAssisted`, and `aiDisclosure` are optional. If `aiAssisted` is true, the post displays an editorial disclosure.

Related repositories:

- `ianrastall/BlogCreator` - separate WinUI 3 desktop publishing application.
- `ianrastall/MDEdit` - independent Markdown editor; it remains unchanged.
