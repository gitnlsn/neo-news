import type { MetadataRoute } from "next";
import { env } from "~/env";
import { db } from "~/server/db";
import { getUrlsFromHtml } from "~/utils/use-cases/get-urls-from-html";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  const posts = await db.post.findMany({
    select: {
      slug: true,
      updatedAt: true,
      content: true,
    },

    where: {
      isPublished: true,
      deletedAt: null,
    },

    orderBy: {
      updatedAt: "desc",
    },

    take: 50000,
  });

  return posts.map((post) => ({
    url: `${env.NEXT_PUBLIC_APP_PUBLIC_URL}/post/${post.slug}`,
    images: getUrlsFromHtml(post.content).map((image) =>
      image.replace(/&/g, "&amp;"),
    ),
    lastModified: post.updatedAt,
  }));
}
