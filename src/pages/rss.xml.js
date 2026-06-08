import rss from "@astrojs/rss";
import { site } from "../data/site";
import { getPublishedPosts, postPath } from "../lib/posts";

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: site.name,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: postPath(post),
      categories: [post.data.category, ...post.data.tags]
    }))
  });
}
