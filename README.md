# Fooliosity Time Wasters

This repository contains **Fooliosity**, Ian Rastall's public collection of browser-based time wasters and simple games.

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
