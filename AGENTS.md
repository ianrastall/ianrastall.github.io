# Codex instructions for Ian Rastall repository landing page

Read [`CODEX_HANDOFF.md`](CODEX_HANDOFF.md) before making changes. It is the canonical handoff for this repository.

Repository boundaries:

- This repository is the public GitHub Pages website source for `https://ianrastall.github.io`.
- Other repositories linked from the landing page are external projects and must remain untouched unless the user explicitly asks to edit them.

Primary direction:

- Keep the site as a single clean Astro landing page.
- Repository blurbs live directly in `src/pages/index.astro`.
- Links should point straight to GitHub, not to internal project pages.
- Do not reintroduce game/tool subpages, Markdown blog infrastructure, a server runtime, database, CMS, or authentication backend.
