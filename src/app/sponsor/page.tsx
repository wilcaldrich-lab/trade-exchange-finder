import type { Metadata } from "next";
import { CountView } from "@/components/CountView";
import { SponsorForm } from "@/components/SponsorForm";
import { getLiveStats } from "@/lib/stats";

const title = "Sponsor the directory";
const description = "Featured state listing at $49 a month, or a newsletter slot at $25 a week. No checkout. Write to us.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sponsor" },
  openGraph: { title, description, url: "/sponsor" },
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="market-card px-4 py-3">
      <p className="term-label">{label}</p>
      <p className="mt-1 font-mono text-4xl text-pine tabular-nums">{value.toLocaleString("en-US")}</p>
    </div>
  );
}

export default async function SponsorPage() {
  const stats = await getLiveStats();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <CountView />
      <p className="kicker">Sponsor</p>
      <h1 className="mt-2 font-display text-3xl leading-tight tracking-tight sm:text-4xl">Put your exchange in front of owners who are already looking</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Two placements. The prices below are the offer. There is no checkout on this site.
      </p>

      <section className="mt-6" aria-label="Live directory stats">
        {stats ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Listings in the database" value={stats.exchanges} />
            <Stat label="Email subscribers" value={stats.subscribers} />
            <Stat label="Pageviews, last 30 days" value={stats.pageviews30d} />
          </div>
        ) : (
          <p className="terminal px-4 py-3 text-sm">
            Live totals are unavailable until the database is connected. This page will not substitute a guessed number.
          </p>
        )}
        <p className="mt-2 text-xs text-muted">Counts are read from the database when this page loads.</p>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="market-card market-card-featured px-4 py-4">
          <h2 className="font-display text-2xl leading-tight">Featured state listing</h2>
          <p className="mt-2 font-mono text-4xl text-pine">$49<span className="text-lg text-muted">/month</span></p>
          <p className="mt-2 text-sm leading-relaxed">
            Your exchange at the top of one state page, linked through a counted click.
          </p>
        </div>
        <div className="market-card px-4 py-4">
          <h2 className="font-display text-2xl leading-tight">Newsletter slot</h2>
          <p className="mt-2 font-mono text-4xl text-cyan">$25<span className="text-lg text-muted">/week</span></p>
          <p className="mt-2 text-sm leading-relaxed">
            One “Sponsored by” line in the weekly note of five exchanges.
          </p>
        </div>
      </section>

      <section className="mt-8 max-w-xl">
        <SponsorForm />
      </section>
    </div>
  );
}
