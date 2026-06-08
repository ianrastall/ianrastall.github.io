import type { BlogPost } from "./posts";

export const POSTS_PER_PAGE = 15;

export type FeedPage = {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
};

export function getFeedPage(posts: BlogPost[], page: number): FeedPage {
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const start = (page - 1) * POSTS_PER_PAGE;

  return {
    posts: posts.slice(start, start + POSTS_PER_PAGE),
    currentPage: page,
    totalPages
  };
}

export function pagePath(page: number): string {
  return page <= 1 ? "/" : `/page/${page}/`;
}
