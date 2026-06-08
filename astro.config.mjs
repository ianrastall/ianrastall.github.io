import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ianrastall.github.io",
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      gfm: true,
      smartypants: true,
      shikiConfig: {
        theme: "github-dark"
      },
      syntaxHighlight: "shiki"
    })
  }
});
