import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontKanit, fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

import { Kanit } from "next/font/google";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

const kanit = Kanit({
  subsets: ["latin", "thai", "latin-ext"],
  display: "swap",
  weight: "300",
});


export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className={kanit.className} >
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-kanit antialiased", fontKanit.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-screen">
            <Suspense fallback={<p>Loading...</p>}>
              <Navbar />
              <main className="container mx-auto max-w-7xl pt-12 pb-6 px-6 flex-grow">
                {children}
              </main>
            </Suspense>

          </div>
        </Providers>
      </body>
    </html>
  );
}
