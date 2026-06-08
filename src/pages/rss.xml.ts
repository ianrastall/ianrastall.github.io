import rss from "@astrojs/rss";
import { getPublicPosts, postUrl } from "../lib/posts";
import { SITE } from "../lib/site";

export async function GET(context: { site: URL }) {
  const posts = await getPublicPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: postUrl(post),
      categories: [post.data.category, ...post.data.tags]
    }))
  });
}
