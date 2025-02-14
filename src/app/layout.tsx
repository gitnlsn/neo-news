import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { Toaster } from "~/components/ui/sonner";
import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Neo News",
  description:
    "Anuncie seus negócios e divulgue notícias aqui. A plataforma ideal para compartilhar suas novidades com o mundo.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: ["anúncios", "notícias", "negócios", "divulgação", "publicidade"],
  authors: [{ name: "Neo News" }],
  openGraph: {
    title: "Neo News",
    description: "Anuncie seus negócios e divulgue notícias aqui",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <GoogleAnalytics gaId={env.GOOGLE_ANALYTICS_ID} />
      <GoogleTagManager gtmId={env.GOOGLE_TAG_MANAGER_ID} />

      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <SessionProvider>
            <TRPCReactProvider>
              <NuqsAdapter>
                <>
                  {children}
                  <Toaster />
                </>
              </NuqsAdapter>
            </TRPCReactProvider>
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  );
}
