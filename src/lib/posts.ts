import { getCollection, type CollectionEntry } from "astro:content";
import { normalizeTaxonomy } from "./format";

export type BlogPost = CollectionEntry<"blog">;

export type TaxonomyGroup = {
  name: string;
  slug: string;
  posts: BlogPost[];
};

export function postPath(post: BlogPost): string {
  return `/posts/${post.data.slug}/`;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog");
  assertUniqueSlugs(posts);

  const now = new Date();

  return posts
    .filter((post) => !post.data.draft)
    .filter((post) => post.data.published <= now)
    .sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}

export async function getFeaturedPosts(limit = 3): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.data.featured).slice(0, limit);
}

export async function getRecentPosts(limit = 6): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  return posts.slice(0, limit);
}

export function groupByCategory(posts: BlogPost[]): TaxonomyGroup[] {
  const groups = new Map<string, TaxonomyGroup>();

  for (const post of posts) {
    const slug = normalizeTaxonomy(post.data.category);
    const group = groups.get(slug) ?? { name: post.data.category, slug, posts: [] };
    group.posts.push(post);
    groups.set(slug, group);
  }

  return sortGroups(groups);
}

export function groupByTag(posts: BlogPost[]): TaxonomyGroup[] {
  const groups = new Map<string, TaxonomyGroup>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = normalizeTaxonomy(tag);
      const group = groups.get(slug) ?? { name: tag, slug, posts: [] };
      group.posts.push(post);
      groups.set(slug, group);
    }
  }

  return sortGroups(groups);
}

function sortGroups(groups: Map<string, TaxonomyGroup>): TaxonomyGroup[] {
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function assertUniqueSlugs(posts: BlogPost[]): void {
  const seen = new Map<string, string>();

  for (const post of posts) {
    const previous = seen.get(post.data.slug);
    if (previous) {
      throw new Error(`Duplicate post slug "${post.data.slug}" in ${previous} and ${post.id}.`);
    }
    seen.set(post.data.slug, post.id);
  }
}
