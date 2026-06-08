import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ianrastall.github.io",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "github-dark",
      wrap: false
    }
  }
});
