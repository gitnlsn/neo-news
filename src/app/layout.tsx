import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import { GoogleTagManager } from "@next/third-parties/google";
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";
import { env } from "~/env";

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
