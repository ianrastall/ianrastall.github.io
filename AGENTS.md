# Codex instructions for Fooliosity website

Read [`CODEX_HANDOFF.md`](CODEX_HANDOFF.md) before making changes. It is the canonical handoff for this repository.

Repository boundaries:

- This repository is the public Fooliosity website source for `https://ianrastall.github.io`.
- The desktop publishing application lives in `ianrastall/BlogCreator`.
- MDEdit lives in `ianrastall/MDEdit` and must remain untouched.

Primary direction:

- Build this as an Astro static site published by GitHub Pages through GitHub Actions.
- Posts should be ordinary Markdown or MDX files with a stable front matter schema compatible with BlogCreator.
- Keep the site static, portable, accessible, dark-mode-friendly, and easy for BlogCreator to generate content for.
- Do not add a server runtime, database, CMS dependency, or proprietary publishing lock-in.
- Do not assume the user wants to operate Node, Astro, or Git manually after setup; BlogCreator should eventually handle routine publishing.

Before implementing post schema or content paths, inspect the BlogCreator handoff so both repositories agree.
