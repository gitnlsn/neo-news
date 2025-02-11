import { PrismaClient } from "@prisma/client";
import type { MetadataRoute } from "next";
import { env } from "~/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  const prisma = new PrismaClient();
  const profiles = await prisma.profile.findMany({
    select: {
      id: true,
      updatedAt: true,
      logo: {
        select: {
          url: true,
        },
      },
    },
    where: {
      posts: {
        some: {
          isPublished: true,
          deletedAt: null,
        },
      },
    },

    orderBy: {
      updatedAt: "desc",
    },

    take: 50000,
  });

  return profiles.map((profile) => ({
    url: `${env.NEXT_PUBLIC_APP_PUBLIC_URL}/profile/${profile.id}`,
    images: profile.logo?.url ? [profile.logo.url.replace(/&/g, "&amp;")] : [],
    lastModified: profile.updatedAt,
  }));
}
