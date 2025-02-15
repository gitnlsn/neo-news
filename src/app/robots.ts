import type { MetadataRoute } from "next";
import { env } from "~/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [
      `${env.APP_PUBLIC_URL}sitemap.xml`,
      `${env.APP_PUBLIC_URL}post/sitemap.xml`,
      `${env.APP_PUBLIC_URL}profile/sitemap.xml`,
    ],
  };
}
