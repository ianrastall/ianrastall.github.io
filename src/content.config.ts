import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const dateTimeWithOffset = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/,
    "Use an ISO 8601 date-time with a timezone offset, such as 2026-06-07T19:45:00-05:00."
  )
  .transform((value) => new Date(value));

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z
    .object({
      title: z.string().min(1).max(160),
      description: z.string().min(1).max(320),
      published: dateTimeWithOffset,
      updated: dateTimeWithOffset.optional(),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      category: z.string().min(1),
      tags: z.array(z.string().min(1)).default([]),
      draft: z.boolean().default(true),
      featured: z.boolean().default(false),
      heroImage: z.string().regex(/^\/images\/posts\/.+/).optional(),
      aiAssisted: z.boolean().default(false),
      aiDisclosure: z.string().min(1).max(280).optional()
    })
    .superRefine((data, context) => {
      if (data.updated && data.updated < data.published) {
        context.addIssue({
          code: "custom",
          path: ["updated"],
          message: "updated must be the same as or later than published."
        });
      }

      if (data.aiDisclosure && !data.aiAssisted) {
        context.addIssue({
          code: "custom",
          path: ["aiDisclosure"],
          message: "aiDisclosure should only be present when aiAssisted is true."
        });
      }
    })
});

export const collections = { blog };
