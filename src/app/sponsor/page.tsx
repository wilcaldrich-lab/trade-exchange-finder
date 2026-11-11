import type { Metadata } from "next";
import { SponsorForm } from "@/components/SponsorForm";
import { getLiveStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Sponsor the directory",
  description: "Featured state listing at $49 a month, or a newsletter slot at $25 a week. No checkout. Write to us.",
  alternates: { canonical: "/sponsor" },
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-card px-4 py-3">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brass">{label}</p>
      <p className="mt-1 font-display text-4xl tabular-nums">{value.toLocaleString("en-US")}</p>
    </div>
  );
}

export default async function SponsorPage() {
  const stats = await getLiveStats();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brass">Sponsor</p>
      <h1 className="mt-2 font-display text-4xl leading-none tracking-tight sm:text-5xl">Put your exchange in front of owners who are already looking</h1>
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
          <p className="rounded-md border border-line bg-card px-4 py-3 text-sm">
            Live totals are unavailable until the database is connected. This page will not substitute a guessed number.
          </p>
        )}
        <p className="mt-2 text-xs text-muted">Counts are read from the database when this page loads.</p>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-line bg-card px-4 py-4">
          <h2 className="font-display text-2xl">Featured state listing</h2>
          <p className="mt-2 font-display text-4xl">$49<span className="text-lg text-muted">/month</span></p>
          <p className="mt-2 text-sm leading-relaxed">
            Your exchange at the top of one state page, linked through a counted click.
          </p>
        </div>
        <div className="rounded-md border border-line bg-card px-4 py-4">
          <h2 className="font-display text-2xl">Newsletter slot</h2>
          <p className="mt-2 font-display text-4xl">$25<span className="text-lg text-muted">/week</span></p>
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
