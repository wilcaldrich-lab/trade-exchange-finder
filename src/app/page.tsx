import type { Metadata } from "next";
import { SignupForm } from "@/components/SignupForm";
import { DirectoryPage } from "@/components/DirectoryPage";
import { JsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Trade Exchange Finder — business barter exchanges" },
  description:
    "Find a business barter exchange. Search by name, city, or state, and filter by network and whether fees are published.",
  alternates: { canonical: "/" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  const origin = siteUrl();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Trade Exchange Finder",
          url: origin,
          description: "A directory of business barter and trade exchanges.",
          potentialAction: {
            "@type": "SearchAction",
            target: `${origin}/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <DirectoryPage
        searchParams={searchParams}
        heading="Find a business barter exchange"
        lede="Local trade exchanges for businesses. A blank fee means the exchange has not published it."
        canonical="/"
        showBrowse
      />
      <section className="mx-auto w-full max-w-5xl px-4 pb-10">
        <div className="rounded-md border border-line bg-card px-4 py-4">
          <h2 className="font-display text-2xl">Get a short note</h2>
          <p className="mt-1 text-sm text-muted">When a listing is added or a published figure changes.</p>
          <div className="mt-3 max-w-md">
            <SignupForm source="home" />
          </div>
        </div>
      </section>
    </>
  );
}
