# Ian Rastall Repositories

This repository contains the source for Ian Rastall's public GitHub Pages landing page at `https://ianrastall.github.io`.

The site is a single Astro page with standalone repository boxes that link directly to GitHub projects.

It is built as a static site using [Astro](https://astro.build) and published automatically to GitHub Pages.

## Usage and deployment

1. Push changes to the `main` branch.
2. A GitHub Action will build the site and deploy it.
3. The site is live at `https://ianrastall.github.io`.

## Local development

To run the site locally on Windows using VS Code and PowerShell:

1. Clone the repository.
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the local server:
   ```powershell
   npm run dev
   ```
   Open `http://127.0.0.1:4321` in your browser.

## Other commands

- Build the production output locally:
  ```powershell
  npm run build
  ```
- Run typechecking and validation:
  ```powershell
  npm run check
  ```
