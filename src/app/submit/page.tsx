import type { Metadata } from "next";
import { SubmitForm } from "@/components/SubmitForm";
import { getExchanges } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Submit a listing or correction",
  description: "Send a new business barter exchange or a correction. It stays in review until it is approved.",
  alternates: { canonical: "/submit" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SubmitPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const initialSlug = typeof params.slug === "string" ? params.slug : "";
  const exchanges = await getExchanges();
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brass">Review queue</p>
      <h1 className="mt-2 font-display text-4xl leading-none tracking-tight">Submit a listing</h1>
      <p className="mt-3 text-muted">
        Exchanges can send a new listing or a correction. Nothing goes live until it is approved. If a number was not published, leave it blank.
      </p>
      <div className="mt-6">
        <SubmitForm
          initialSlug={initialSlug}
          choices={exchanges.map((exchange) => ({ slug: exchange.slug, name: exchange.name }))}
        />
      </div>
    </div>
  );
}
