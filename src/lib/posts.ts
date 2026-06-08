import { getCollection, type CollectionEntry } from "astro:content";
import { SITE } from "./site";

export type BlogPost = CollectionEntry<"blog">;
export type PublicBlogPost = BlogPost & {
  data: BlogPost["data"] & { published: Date };
};

export type TaxonomyGroup = {
  name: string;
  slug: string;
  posts: PublicBlogPost[];
  count: number;
};

const taxonomyCollator = new Intl.Collator(SITE.locale, { sensitivity: "base" });

function assertUniqueSlugs(posts: BlogPost[]) {
  const seen = new Map<string, string>();

  for (const post of posts) {
    const previous = seen.get(post.data.slug);
    if (previous) {
      throw new Error(
        `Duplicate blog slug "${post.data.slug}" found in "${previous}" and "${post.id}". Slugs must be unique.`
      );
    }

    seen.set(post.data.slug, post.id);
  }
}

export async function getAllPosts() {
  const posts = await getCollection("blog");
  assertUniqueSlugs(posts);
  return posts;
}

export function isPublishablePost(post: BlogPost): post is PublicBlogPost {
  if (post.data.draft || !(post.data.published instanceof Date)) {
    return false;
  }

  return post.data.published.getTime() <= Date.now();
}

export function sortPostsByPublished(posts: PublicBlogPost[]) {
  return [...posts].sort(
    (left, right) => right.data.published.getTime() - left.data.published.getTime()
  );
}

export async function getPublicPosts() {
  const posts = await getAllPosts();
  return sortPostsByPublished(posts.filter(isPublishablePost));
}

export function getRecentPosts(posts: PublicBlogPost[], count = 6) {
  return sortPostsByPublished(posts).slice(0, count);
}

export function getFeaturedPosts(posts: PublicBlogPost[]) {
  return sortPostsByPublished(posts.filter((post) => post.data.featured));
}

export function postUrl(post: PublicBlogPost | BlogPost) {
  return `/posts/${post.data.slug}/`;
}

export function normalizeTaxonomy(value: string) {
  const normalized = value
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "uncategorized";
}

function addToGroup(map: Map<string, TaxonomyGroup>, displayName: string, post: PublicBlogPost) {
  const slug = normalizeTaxonomy(displayName);
  const existing = map.get(slug);

  if (existing) {
    existing.posts.push(post);
    existing.count = existing.posts.length;
    return;
  }

  map.set(slug, {
    name: displayName.trim(),
    slug,
    posts: [post],
    count: 1
  });
}

function sortedGroups(groups: Map<string, TaxonomyGroup>) {
  return [...groups.values()].sort((left, right) =>
    taxonomyCollator.compare(left.name, right.name)
  );
}

export function getCategoryGroups(posts: PublicBlogPost[]) {
  const groups = new Map<string, TaxonomyGroup>();

  for (const post of posts) {
    addToGroup(groups, post.data.category, post);
  }

  return sortedGroups(groups);
}

export function getTagGroups(posts: PublicBlogPost[]) {
  const groups = new Map<string, TaxonomyGroup>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      addToGroup(groups, tag, post);
    }
  }

  return sortedGroups(groups);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat(SITE.locale, {
    dateStyle: "medium",
    timeZone: SITE.timezone
  }).format(date);
}

export function getEditorialYear(date: Date) {
  return new Intl.DateTimeFormat(SITE.locale, {
    year: "numeric",
    timeZone: SITE.timezone
  }).format(date);
}

export function hasMeaningfulUpdate(post: PublicBlogPost) {
  return (
    post.data.updated instanceof Date &&
    post.data.updated.getTime() > post.data.published.getTime()
  );
}
