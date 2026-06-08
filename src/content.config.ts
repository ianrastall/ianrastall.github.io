import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z
    .object({
      title: z.string().trim().min(1, "Post title is required.").max(160),
      description: z
        .string()
        .trim()
        .min(1, "Post description is required.")
        .max(320),
      published: z.coerce.date().optional(),
      updated: z.coerce.date().optional(),
      slug: z
        .string()
        .trim()
        .regex(slugPattern, "Use a lowercase hyphenated slug, for example: example-title."),
      category: z.string().trim().min(1, "A primary category is required."),
      tags: z.array(z.string().trim().min(1)).default([]),
      draft: z.boolean().default(true),
      featured: z.boolean().default(false),
      heroImage: z.string().trim().startsWith("/images/posts/").optional()
    })
    .superRefine((data, context) => {
      if (!data.draft && !data.published) {
        context.addIssue({
          code: "custom",
          path: ["published"],
          message: "Published posts require a timezone-aware published timestamp."
        });
      }

      if (data.published && data.updated && data.updated.getTime() < data.published.getTime()) {
        context.addIssue({
          code: "custom",
          path: ["updated"],
          message: "Updated must be the same as or later than published."
        });
      }

      if (data.heroImage) {
        const heroPath = join(process.cwd(), "public", data.heroImage.replace(/^\//, ""));
        if (!existsSync(heroPath)) {
          context.addIssue({
            code: "custom",
            path: ["heroImage"],
            message: `Hero image not found under public/: ${data.heroImage}`
          });
        }
      }
    })
});

export const collections = { blog };
