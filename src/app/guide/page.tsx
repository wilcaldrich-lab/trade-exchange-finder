import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How business barter works",
  description:
    "A plain explanation of business trade exchanges: trade credits, published fees, IRTA, NATE, and what to ask before joining.",
  alternates: { canonical: "/guide" },
};

export default function GuidePage() {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How business barter works",
          dateModified: "2026-11-10",
          author: { "@type": "Organization", name: "Trade Exchange Finder" },
          publisher: { "@type": "Organization", name: "Trade Exchange Finder" },
        }}
      />
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brass">Guide</p>
      <h1 className="mt-2 font-display text-4xl leading-none tracking-tight sm:text-5xl">How business barter works</h1>
      <p className="mt-4 text-lg leading-relaxed">
        A barter exchange, also called a trade exchange, is a membership network for businesses. Members sell to each other. The exchange keeps the ledger. This page describes the usual arrangement. It is not a promise about any one exchange, and it does not invent prices.
      </p>

      <h2 className="mt-8 font-display text-3xl">The trade itself</h2>
      <p className="mt-3 leading-relaxed">
        A member provides a good or service to another member. Instead of paying the whole bill in cash, the buyer pays in trade credits, sometimes called trade dollars. The exchange records the credit on the seller’s account and the debit on the buyer’s. The seller can later spend those credits with other members.
      </p>
      <p className="mt-3 leading-relaxed">
        The exchange is the bookkeeper, and often a broker that introduces members. It is not a bank. A trade credit is a claim inside that network. It is useful where members will accept it, and it is not the same thing as cash in a checking account.
      </p>

      <h2 className="mt-8 font-display text-3xl">What it can cost</h2>
      <p className="mt-3 leading-relaxed">
        When an exchange publishes its prices, the bill is usually some mix of a one-time joining fee, monthly or annual dues, and a cash commission on purchases or sales. Some dues are split between cash and trade credits. The cash portion is still cash.
      </p>
      <p className="mt-3 leading-relaxed">
        Many exchanges do not publish a price list. On this site, a fee, member count, or founding year appears only when the exchange or its public directory listing stated it. Otherwise the field says “Not published.” Confirm the current fees with the exchange before you join. A blank is not a price of zero.
      </p>

      <h2 className="mt-8 font-display text-3xl">Networks named on the listings</h2>
      <p className="mt-3 leading-relaxed">
        IRTA, the International Reciprocal Trade Association, and NATE, the National Association of Trade Exchanges, are industry associations. An exchange that belongs to one may be able to clear trades with other member exchanges, so a credit is not limited to the local group. That is a membership fact, not a quality rating.
      </p>
      <p className="mt-3 leading-relaxed">
        Universal Currency, shown here as UC, is the name IRTA uses for inter-exchange credit. Some NATE members use the label BANC when they describe trading with other participating exchanges. This directory prints the labels an exchange publishes. It does not score them.
      </p>

      <h2 className="mt-8 font-display text-3xl">Questions worth asking</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
        <li>What can you actually buy with credits near you, this month?</li>
        <li>What is the cash joining fee, the dues, and the cash commission, and which side of a trade pays it?</li>
        <li>Do unused credits expire, and can the exchange change that rule?</li>
        <li>How are disputes and refunds handled?</li>
        <li>What happens to a credit balance if you leave?</li>
        <li>Who records the sale for tax purposes, and what paperwork do you receive?</li>
      </ul>

      <h2 className="mt-8 font-display text-3xl">Taxes</h2>
      <p className="mt-3 leading-relaxed">
        In the United States, the IRS treats barter income as taxable. What that means for a particular business depends on the facts. Ask a tax professional before you rely on a credit balance.
      </p>

      <h2 className="mt-8 font-display text-3xl">How this directory was built</h2>
      <p className="mt-3 leading-relaxed">
        The opening set was taken from the public IRTA and NATE member directories and from the exchanges’ own websites, and checked on November 10, 2026. Software vendors, parked domains, and listings whose sites could not be read were left out. New listings and corrections sit in a review queue. They are not public until someone approves them.
      </p>
      <p className="mt-3 leading-relaxed">
        Trade Exchange Finder is not an exchange. It does not broker trades, hold credits, or take a cut of a transaction.
      </p>
      <p className="mt-6">
        <Link href="/" className="font-bold text-pine underline underline-offset-4">Back to the directory</Link>
      </p>
    </article>
  );
}
