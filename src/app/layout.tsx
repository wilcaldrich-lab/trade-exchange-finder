import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Rajdhani } from "next/font/google";
import { after, connection } from "next/server";
import { headers } from "next/headers";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SponsorBar } from "@/components/SponsorBar";
import { recordPageview } from "@/lib/pageviews";
import { HOUSE_SPONSOR_SLUG, siteUrl } from "@/lib/site";
import { getBarSponsor } from "@/lib/sponsors";

const sans = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
});

const display = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
});

export const viewport: Viewport = {
  themeColor: "#080a10",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Find a business barter exchange",
    template: "%s | Trade Exchange Finder",
  },
  description:
    "A directory of business barter and trade exchanges for small business owners. Compare location, networks, and published fees. Missing figures are marked Not published.",
  applicationName: "Trade Exchange Finder",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Trade Exchange Finder",
    url: "/",
    title: "Trade Exchange Finder",
    description: "Compare business barter exchanges. Unpublished figures stay blank.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const headerList = await headers();
  if (headerList.get("x-count-view") === "1") {
    const pathname = headerList.get("x-pathname");
    const referrer = headerList.get("referer");
    after(() => recordPageview(pathname, referrer));
  }
  const sponsor = await getBarSponsor();
  const bar = {
    slug: sponsor?.slug || HOUSE_SPONSOR_SLUG,
    name: sponsor?.name || "Your exchange here",
    tagline: sponsor?.tagline || "Reach owners who are comparing trade exchanges.",
  };

  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-card focus:px-3 focus:py-2">
          Skip to content
        </a>
        <SponsorBar sponsor={bar} />
        <Header />
        <main id="content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
