# Fooliosity Website — Codex 5.5 Handoff

## 1. Purpose

This repository will contain **Fooliosity**, Ian Rastall's public personal blog and publication site, served at:

```text
https://ianrastall.github.io
```

The site is intended to support substantial Markdown-based writing across subjects such as film, music, technology, history, religion, philosophy, current events, personal projects, and long-form analysis.

Routine publishing will eventually be performed through the separate Windows desktop application in:

```text
ianrastall/BlogCreator
```

The website should therefore be designed as a stable static publishing target whose content files can be generated and edited safely by software.

## 2. Current repository state

At the time of this handoff, the website itself has **not yet been scaffolded**.

The repository currently contains documentation establishing:

- the site name, Fooliosity;
- the public address;
- the intended Astro/Markdown/GitHub Pages stack;
- the separation from BlogCreator and MDEdit;
- Codex instructions and this handoff.

Do not assume an Astro project, package manifest, content collection, layout, theme, workflow, or published page already exists. The first implementation milestone is to create them.

## 3. Repository boundaries

| Repository | Responsibility |
|---|---|
| `ianrastall/ianrastall.github.io` | This public website source and GitHub Pages deployment |
| `ianrastall/BlogCreator` | Standalone C#/.NET 10/WinUI 3 desktop publishing application |
| `ianrastall/MDEdit` | Independent general-purpose Markdown editor |

Non-negotiable rules:

- Do not place BlogCreator's C# source in this repository.
- Do not turn the website into a mode of MDEdit.
- Do not modify MDEdit as part of website work.
- Do not add a server runtime, database, conventional CMS, or authentication backend.
- Keep published content in portable text and ordinary asset files.
- Coordinate content paths and front matter with BlogCreator.

## 4. Intended technology stack

Use:

```text
Astro
TypeScript where configuration or components require it
Markdown as the primary post format
MDX only when a post genuinely needs components
Astro content collections
GitHub Actions
GitHub Pages
Shiki for code syntax highlighting
Pagefind or another build-time static search system
RSS
Sitemap
```

Prefer Astro's stable, documented APIs and official integrations.

Avoid:

- a client-heavy single-page application architecture;
- React/Vue/Svelte unless a specific isolated component clearly requires one;
- runtime API dependencies for basic navigation or article rendering;
- a hosted CMS;
- loading essential typography, JavaScript, or editor assets from third-party CDNs;
- unnecessary analytics or tracking;
- dependencies that make posts unreadable outside Astro.

## 5. User and operational assumptions

The user works primarily on Windows using:

- VS Code;
- GitHub Desktop;
- PowerShell;
- AI-generated code and step-by-step instructions.

The user does not intend to learn Astro, Node.js, YAML, GitHub Actions, or frontend development merely to publish articles.

Therefore:

- Once the site is established, routine publication should require only BlogCreator.
- Build commands and troubleshooting must be exact and copyable.
- Configuration should be centralized and clearly named.
- Avoid workflows requiring recurring manual edits to multiple files.
- Error output should be retained as GitHub Actions logs or artifacts where useful.
- Documentation should distinguish one-time developer setup from routine authoring.

## 6. Primary architecture

A recommended target structure is:

```text
.github/
  workflows/
    deploy.yml
public/
  favicon.svg
  images/
    site/
    posts/
src/
  components/
  content/
    config.ts
    blog/
  layouts/
    BaseLayout.astro
    PostLayout.astro
  pages/
    index.astro
    about.astro
    archive.astro
    404.astro
    posts/
      [...slug].astro
    categories/
      [category].astro
    tags/
      [tag].astro
    rss.xml.js
  styles/
    global.css
    article.css
astro.config.mjs
package.json
tsconfig.json
README.md
AGENTS.md
CODEX_HANDOFF.md
```

This is a direction, not a requirement to preserve empty folders. Keep the resulting structure understandable and avoid excessive abstraction.

## 7. Content path contract

The preferred canonical post directory is:

```text
src/content/blog/
```

Each post should be a Markdown file. BlogCreator will eventually read and write files here.

Recommended filename policy:

```text
<slug>.md
```

Example:

```text
src/content/blog/what-blade-runner-is-remembering.md
```

A date prefix may be adopted only if it provides a clear benefit. The canonical public URL should derive from the explicit `slug`, not depend irreversibly on the physical filename.

Post assets should normally be organized as:

```text
public/images/posts/<slug>/
```

Example:

```text
public/images/posts/what-blade-runner-is-remembering/hero.webp
public/images/posts/what-blade-runner-is-remembering/diagram-01.webp
```

Keep this contract stable once BlogCreator begins writing files.

## 8. Proposed front matter contract

This schema must be coordinated with `ianrastall/BlogCreator/CODEX_HANDOFF.md` before being treated as final.

Recommended post file:

```markdown
---
title: "What Blade Runner Is Actually Remembering"
description: "An examination of memory, identity, and narrative concealment in Blade Runner."
published: 2026-06-07T18:30:00-05:00
updated: 2026-06-07T18:30:00-05:00
slug: "what-blade-runner-is-actually-remembering"
category: "Film"
tags:
  - Blade Runner
  - Film analysis
draft: false
featured: false
heroImage: "/images/posts/what-blade-runner-is-actually-remembering/hero.webp"
---

Article body begins here.
```

Recommended field semantics:

| Field | Required | Meaning |
|---|---:|---|
| `title` | yes | Human-readable article title |
| `description` | yes | Listing, search, RSS, and social summary |
| `published` | yes for public posts | Time-zone-aware first publication timestamp |
| `updated` | no | Time-zone-aware most recent substantive revision |
| `slug` | yes | Stable public path segment |
| `category` | yes | One primary broad category |
| `tags` | no | Zero or more specific descriptors |
| `draft` | yes | Exclude from production output when true |
| `featured` | no | Allow selected prominence on the home page |
| `heroImage` | no | Root-relative path under `public` |

Schema guidance:

- Use ISO 8601 timestamps with offsets.
- Preserve the user's America/Chicago publication context when generated locally.
- Slugs must be unique.
- Category and tag matching should be case-normalized for routing while preserving display capitalization.
- Draft posts must not appear in production pages, RSS, sitemap, search, tag pages, or category pages.
- `updated` should not be changed for inconsequential build or formatting operations.
- Avoid duplicate fields representing the same concept.

Astro's content schema should validate this contract and provide actionable build errors.

## 9. URL design

Use simple, stable, human-readable URLs.

Recommended article URL:

```text
/posts/<slug>/
```

Examples:

```text
/posts/what-blade-runner-is-actually-remembering/
/posts/a-bahai-reading-of-adam/
```

Recommended taxonomy URLs:

```text
/categories/<normalized-category>/
/tags/<normalized-tag>/
```

Do not expose implementation details such as `.html`, content collection folders, or dates unless intentionally part of the editorial design.

Once public articles exist, avoid changing URL structure without redirects or an explicit migration plan.

## 10. Required pages and features

The first complete site should include:

### Home page

- Site name and short description.
- Recent posts.
- Optional featured posts.
- Clear access to archive, categories, tags, about, RSS, and search.

### Post page

- Title.
- Description where editorially appropriate.
- Publication date.
- Updated date when present.
- Category and tags.
- Hero image when present.
- Article content.
- Syntax-highlighted code blocks.
- Footnotes.
- Previous/next or related navigation only if it remains useful rather than cluttered.

### Archive

- Chronological listing grouped by year or another readable structure.
- No dependence on client-side JavaScript.

### Category pages

- List posts in a primary category.

### Tag pages

- List posts sharing a tag.

### About page

- Initial placeholder content may be used, clearly marked for replacement.

### Search

- Build-time static index.
- Search should operate without a server.
- Exclude drafts and irrelevant generated text.

### RSS

- Valid feed with absolute article URLs.
- Include title, description, date, and link.
- Full-content RSS is optional; summaries are acceptable initially.

### Sitemap and metadata

- Sitemap.
- Canonical URLs.
- Open Graph metadata.
- Twitter card metadata where compatible.
- Meaningful page titles and descriptions.

### 404 page

- Clear path back to the home page and archive.

## 11. Design direction

A final visual identity has not yet been selected. Do not mistake the absence of a design specification for permission to create a generic neon developer-blog theme.

Initial design principles:

- serious personal publication rather than startup landing page;
- typography suitable for long-form reading;
- dark-mode-friendly, with a coherent light mode if implemented;
- restrained interface;
- generous but not wasteful article spacing;
- readable measure, approximately 65–80 characters per line for prose;
- strong heading hierarchy;
- high contrast without pure-black/pure-white glare where avoidable;
- responsive from desktop to phone;
- no gratuitous animation;
- no large JavaScript framework for navigation or theme switching.

Use local/system font stacks initially unless a specific licensed font choice is made later.

Do not fabricate a permanent author biography or editorial slogan. Use clearly centralized placeholder copy where personal wording is still required.

## 12. Accessibility requirements

At minimum:

- semantic landmarks;
- one logical `h1` per page;
- meaningful heading order;
- keyboard-accessible navigation;
- visible focus indicators;
- adequate contrast;
- alt text support for content images;
- decorative images marked appropriately;
- link text understandable out of context;
- form labels for search;
- reduced-motion respect if motion exists;
- responsive text without horizontal scrolling at common zoom levels;
- tables scroll safely on narrow screens;
- code blocks remain usable on mobile.

Automated checks are useful but do not substitute for structural review.

## 13. Markdown requirements

The site should support common authoring needs:

- headings;
- emphasis;
- ordered and unordered lists;
- block quotations;
- links;
- images;
- fenced code blocks with language identifiers;
- tables;
- footnotes;
- task lists where reasonable;
- definition lists only if supported cleanly;
- raw HTML only when necessary and controlled.

Prefer standards-compatible Markdown. Avoid custom syntax that BlogCreator would have to parse unless the benefit is substantial.

## 14. Syntax highlighting

Use Astro's supported Shiki integration or equivalent build-time highlighting.

Requirements:

- dark theme compatible with the site;
- readable light-theme behavior if light mode exists;
- language labels optional but desirable;
- copy button optional and should not bloat the initial scaffold;
- no runtime fetch for highlighting;
- unsupported languages should degrade gracefully;
- code blocks must retain horizontal scrolling rather than break the page.

The BlogCreator editor's Monaco highlighting is a separate concern. Published highlighting does not need to reproduce Monaco exactly.

## 15. Images and media

The website repository should contain web-appropriate assets, not master media archives.

Guidelines:

- Use WebP or AVIF where practical, with reasonable fallbacks when needed.
- Preserve meaningful source images outside this repository when they are large or archival.
- Do not commit WAV, high-bitrate video, or large project files.
- Use responsive image tooling when it does not conflict with BlogCreator's predictable asset paths.
- Validate missing hero images during build.
- Require alt text in Markdown for meaningful inline images.
- Prefer YouTube or another appropriate platform for large video rather than GitHub Pages storage.

## 16. GitHub Pages deployment

The repository name is correctly reserved for a user site:

```text
ianrastall.github.io
```

The production URL should therefore be rooted at:

```text
https://ianrastall.github.io/
```

Use an Actions-based Astro deployment rather than committing generated output to `main`.

The deployment workflow should:

1. Check out the repository.
2. Install the supported Node version.
3. Install dependencies deterministically.
4. Run validation and tests.
5. Build Astro.
6. Upload the Pages artifact.
7. Deploy through the official GitHub Pages action.

Use the official GitHub Pages actions and minimal required permissions.

Expected permissions generally include:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

Use a concurrency group so obsolete deployments do not race newer ones.

The user may need to select **GitHub Actions** as the Pages source once through repository settings. Document the exact click path when that action becomes necessary.

## 17. Local development commands

After Astro is scaffolded, README and this file must be updated with exact versions and commands.

Expected pattern:

```powershell
npm install
npm run dev
npm run build
npm run preview
```

Prefer `npm ci` in CI once a lockfile exists.

Recommended scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "...",
    "format": "..."
  }
}
```

Do not add formatting or linting tools merely for fashion. Add them only when configured to produce stable, useful results without rewriting user-authored prose.

## 18. Node and dependency policy

- Declare a supported Node version in `package.json` engines or a version file.
- Commit the lockfile.
- Use exact or sensibly constrained dependency versions.
- Avoid frequent speculative upgrades.
- Do not combine major dependency upgrades with unrelated feature work.
- Prefer official Astro integrations.
- Audit generated starter dependencies and remove unused packages.

## 19. Draft behavior

Draft exclusion is critical.

Production builds must exclude draft posts from:

- generated routes;
- home page;
- archive;
- category pages;
- tag pages;
- RSS;
- sitemap;
- search index;
- related-post data.

A local development option to view drafts may be provided, but it must be explicit and impossible to enable accidentally in production.

Do not rely solely on hiding draft links while still generating public draft pages.

## 20. Date handling

Dates should be treated as editorial data rather than filesystem timestamps.

Requirements:

- Parse timezone-aware values.
- Display dates consistently.
- Sort by `published` descending unless an editorial override is introduced later.
- Do not mutate publication dates during builds.
- Use `updated` only when present and later than `published`.
- Document how scheduled future dates are handled before implementing scheduled publication.

The initial site may reject future publication dates or treat them as drafts until a deliberate scheduling workflow is implemented.

## 21. Build validation

The production build should fail clearly for:

- duplicate slugs;
- missing required front matter;
- invalid dates;
- invalid hero-image paths;
- malformed content collection entries;
- broken internal content references where detectable.

Warnings should be reserved for nonfatal concerns. Do not convert serious publication errors into silent fallbacks.

## 22. Testing direction

At minimum, add tests or build assertions for:

- front matter schema acceptance and rejection;
- draft exclusion;
- unique slugs;
- post sorting;
- category/tag normalization;
- expected generated routes;
- RSS generation;
- sitemap or canonical URL correctness where practical.

The Astro build itself is a required integration test.

## 23. Search direction

Pagefind is a likely fit because it produces a static search index after build.

Requirements:

- no server dependency;
- no draft indexing;
- sensible result titles and summaries;
- keyboard-accessible search UI;
- minimal client JavaScript;
- index only meaningful page content;
- integrate after core pages and content contract are stable.

Do not let search block the initial publishable scaffold.

## 24. Comments direction

Comments are not required for the first milestone.

If added later, Giscus using GitHub Discussions is a likely fit. It must be:

- optional;
- clearly separated from article content;
- privacy-conscious;
- configured only after repository Discussions and mapping choices are understood.

Do not add a comment system during the initial scaffold.

## 25. Analytics direction

No analytics are required initially.

If added later:

- prefer privacy-respecting analytics;
- avoid invasive tracking;
- centralize configuration;
- do not block rendering;
- document exactly what is collected.

## 26. Security and privacy

- Never commit tokens, API keys, private credentials, or local filesystem paths.
- Use GitHub's built-in Pages deployment authentication.
- Do not inject unsanitized front matter into raw HTML attributes.
- Treat raw HTML in Markdown conservatively.
- Keep dependencies current through deliberate maintenance, not automatic uncontrolled upgrades.
- Do not publish local drafts or private notes through broad glob patterns.

## 27. Source-control workflow for Codex

For substantial work:

1. Pull current `main`.
2. Read `AGENTS.md`, this file, and the BlogCreator handoff.
3. Create a focused branch.
4. Implement one coherent milestone.
5. Run local checks and production build.
6. Update README and this handoff when commands or architecture change.
7. Commit the lockfile with dependency changes.
8. Push and open a pull request.
9. Confirm Actions passes.
10. Do not merge a failing deployment workflow.

Avoid combining the initial scaffold with speculative comments, analytics, custom domains, or extensive animation.

## 28. First implementation milestone

The first Codex task should create a complete minimal site—not merely install Astro.

Required outcome:

1. Astro project scaffold in the repository root.
2. Content collection and validated post schema.
3. One clearly marked sample post.
4. Home page.
5. Post route.
6. Archive page.
7. Category route.
8. Tag route.
9. About placeholder.
10. RSS.
11. Sitemap.
12. 404 page.
13. Dark-first responsive styling.
14. Syntax highlighting.
15. GitHub Pages deployment workflow.
16. README with exact Windows/VS Code commands.
17. Production build passing in CI.

The sample post should be obviously replaceable and should not invent personal claims for the author.

## 29. Definition of done for the first milestone

The website scaffold is complete only when:

- `npm ci` or the documented install command succeeds;
- `npm run build` succeeds;
- the content schema accepts the agreed BlogCreator-compatible example;
- draft content is excluded from production;
- all required routes build;
- RSS and sitemap are generated;
- navigation works without a client framework;
- mobile and desktop layouts are usable;
- GitHub Actions deploys successfully;
- the Pages site is accessible at `https://ianrastall.github.io`;
- README contains exact setup and troubleshooting steps;
- BlogCreator's handoff is updated if the final post contract differs from the proposal.

## 30. Immediate starting prompt for a fresh Codex session

Use this task framing:

> Implement the first complete Fooliosity website milestone in `ianrastall/ianrastall.github.io`: scaffold a modern Astro static blog for GitHub Pages, define and validate the BlogCreator-compatible Markdown front matter contract, add the core pages, RSS, sitemap, syntax highlighting, dark-first responsive styling, draft exclusion, tests/build validation, and an official GitHub Actions Pages deployment. Do not modify BlogCreator or MDEdit. Keep the design restrained and suitable for long-form reading. Update README and CODEX_HANDOFF.md with the final commands and any schema decisions.

Before coding, inspect `ianrastall/BlogCreator/CODEX_HANDOFF.md` to prevent schema and content-path divergence.
