import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { Toaster } from "~/components/ui/sonner";
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
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <TRPCReactProvider>
            <NuqsAdapter>
              <>
                {children}
                <Toaster />
              </>
            </NuqsAdapter>
          </TRPCReactProvider>
        </Suspense>
      </body>
    </html>
  );
}
