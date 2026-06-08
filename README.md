# Fooliosity

Source repository for the public website at https://ianrastall.github.io.

Fooliosity is an Astro static site deployed to GitHub Pages through GitHub Actions. Posts are ordinary Markdown files in `src/content/blog/` so BlogCreator can eventually create, edit, and publish them.

## One-Time Local Setup

Run these commands from the repository root in PowerShell:

```powershell
npm install
npm run build
```

## Local Development

```powershell
npm run dev
```

Astro will print a local URL, usually `http://localhost:4321/`.

## Production Build

```powershell
npm run build
```

The build runs content validation, Astro type checks, the static Astro build, and Pagefind search indexing. The generated site is written to `dist/`.

## Preview the Built Site

```powershell
npm run preview
```

## BlogCreator Content Contract

Canonical post directory:

```text
src/content/blog/
```

Canonical post asset directory:

```text
public/images/posts/<slug>/
```

Public post URL:

```text
/posts/<slug>/
```

Recommended Markdown front matter:

```yaml
---
title: "Example title"
description: "Concise summary for listings and metadata."
published: 2026-06-07T18:30:00-05:00
updated: 2026-06-07T18:30:00-05:00
slug: "example-title"
category: "Film"
tags:
  - Blade Runner
  - Film analysis
draft: false
featured: false
heroImage: "/images/posts/example-title/hero.webp"
---
```

Notes:

- `published` is required when `draft` is `false`.
- `updated` is optional, but cannot be earlier than `published`.
- `slug` must be lowercase letters and numbers separated by hyphens.
- `draft: true` posts are excluded from public routes, archive, RSS, sitemap, and search.
- Future-dated posts are treated as not yet public until the build date reaches `published`.
- `heroImage`, when present, must point to an existing file under `public/images/posts/`.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys the site whenever `main` is pushed.

If GitHub Pages is not already configured for Actions:

1. Open the repository on GitHub.
2. Go to **Settings**.
3. Open **Pages**.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. Save the setting.

## Related Repositories

- `ianrastall/BlogCreator` - separate WinUI 3 desktop publishing application.
- `ianrastall/MDEdit` - independent Markdown editor; it remains unchanged.
