import type { MetadataRoute } from "next";
import { env } from "~/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${env.NEXT_PUBLIC_APP_PUBLIC_URL}`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_PUBLIC_URL}/post`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_PUBLIC_URL}/post/sitemap.xml`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${env.NEXT_PUBLIC_APP_PUBLIC_URL}/profile/sitemap.xml`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
  ];
}
