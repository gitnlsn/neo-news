import { PrismaClient } from "@prisma/client";
import type { MetadataRoute } from "next";
import { env } from "~/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  const prisma = new PrismaClient();
  const posts = await prisma.post.findMany({
    select: {
      slug: true,
      updatedAt: true,
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
    lastModified: post.updatedAt,
  }));
}
