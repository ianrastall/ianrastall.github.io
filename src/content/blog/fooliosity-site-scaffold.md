---
title: "Fooliosity Site Scaffold"
description: "A replaceable sample post that exercises the first Astro publishing contract."
published: 2026-06-07T18:30:00-05:00
updated: 2026-06-07T18:30:00-05:00
slug: "fooliosity-site-scaffold"
category: "Site Notes"
tags:
  - Fooliosity
  - Astro
draft: false
featured: true
---

This sample post exists to prove that the website can build and publish ordinary Markdown content. It is intentionally replaceable.

The front matter above is the important part for BlogCreator. A future save operation can write these fields into `src/content/blog/<slug>.md`, and Astro will turn the file into a public post at `/posts/<slug>/`.

## Markdown Coverage

The site supports ordinary Markdown features needed for long-form writing:

- headings
- lists
- links
- block quotations
- tables
- fenced code blocks
- footnotes

> Drafts should stay private until their `draft` field is set to `false`.

```powershell
npm run build
```

| Field | Purpose |
| --- | --- |
| `slug` | Stable public URL segment |
| `category` | One broad primary grouping |
| `tags` | Specific descriptors |

Footnotes render through Astro's Markdown pipeline.[^note]

[^note]: This is sample text for build validation, not permanent editorial content.
