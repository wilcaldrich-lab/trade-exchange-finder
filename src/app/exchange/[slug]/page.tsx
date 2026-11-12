import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CountView } from "@/components/CountView";
import { JsonLd } from "@/components/JsonLd";
import { SignupForm } from "@/components/SignupForm";
import { getExchange } from "@/lib/catalog";
import type { Exchange } from "@/lib/exchange";
import { NOT_PUBLISHED, formatCashFee, formatCount, formatDate, published } from "@/lib/format";
import { telHref } from "@/lib/phone";
import { countryName, locationLine, stateLabel } from "@/lib/places";
import { absoluteUrl } from "@/lib/site";
import { isSafeHttpUrl, websiteLabel } from "@/lib/urls";

type Params = { params: Promise<{ slug: string }> };

function summary(exchange: Exchange): string {
  const text = exchange.description?.replace(/\s+/g, " ").trim();
  if (text) return text.slice(0, 180);
  const place = locationLine(exchange);
  if (place !== NOT_PUBLISHED) return `${exchange.name} in ${place}. Business barter exchange listing.`;
  return `${exchange.name}. Business barter exchange listing.`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const exchange = await getExchange(slug);
  if (!exchange) return { title: "Exchange not listed" };
  const description = summary(exchange);
  const path = `/exchange/${exchange.slug}`;
  const image = `${path}/opengraph-image`;
  return {
    title: exchange.name,
    description,
    alternates: { canonical: path },
    openGraph: { title: exchange.name, description, url: path, images: [image] },
    twitter: { card: "summary_large_image", title: exchange.name, description, images: [image] },
  };
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-card px-3 py-3">
      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brass">{label}</dt>
      <dd className="mt-1 text-sm leading-snug">{children}</dd>
    </div>
  );
}

export default async function ExchangePage({ params }: Params) {
  const { slug } = await params;
  const exchange = await getExchange(slug);
  if (!exchange) notFound();
  const website = exchange.website && isSafeHttpUrl(exchange.website) ? exchange.website : null;
  const place = locationLine(exchange);
  const linkedSources = exchange.source_urls.filter((url) => isSafeHttpUrl(url));
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: exchange.name,
    url: website || absoluteUrl(`/exchange/${exchange.slug}`),
    description: exchange.description || undefined,
  };
  if (exchange.city || exchange.state_region || exchange.country) {
    jsonLd.address = {
      "@type": "PostalAddress",
      addressLocality: exchange.city || undefined,
      addressRegion: exchange.state_region || undefined,
      addressCountry: exchange.country || undefined,
    };
  }
  if (exchange.phone) jsonLd.telephone = exchange.phone;
  if (exchange.email) jsonLd.email = exchange.email;

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-6">
      <CountView />
      <JsonLd data={jsonLd} />
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brass">
        <Link href="/" className="hover:text-ink">Directory</Link>
        {place !== NOT_PUBLISHED ? ` · ${place}` : ""}
      </p>
      <h1 className="mt-2 font-display text-4xl leading-none tracking-tight sm:text-5xl">{exchange.name}</h1>
      {exchange.networks.length ? (
        <ul className="mt-3 flex flex-wrap gap-1">
          {exchange.networks.map((network) => (
            <li key={network} className="border border-line bg-card px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em]">
              {network}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted">Networks: {NOT_PUBLISHED}</p>
      )}
      <p className="mt-4 text-lg leading-relaxed">{published(exchange.description)}</p>
      {website ? (
        <p className="mt-4">
          <a href={website} className="font-bold text-pine underline underline-offset-4" rel="noopener noreferrer">
            Visit {websiteLabel(website)}
          </a>
        </p>
      ) : (
        <p className="mt-4 text-sm">Website: {NOT_PUBLISHED}</p>
      )}

      <h2 className="mt-8 font-display text-2xl">Published facts</h2>
      <dl className="mt-3 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
        <Fact label="City">{published(exchange.city)}</Fact>
        <Fact label="State or region">{exchange.state_region ? stateLabel(exchange.state_region, exchange.country) : NOT_PUBLISHED}</Fact>
        <Fact label="Country">{exchange.country ? `${countryName(exchange.country)} (${exchange.country})` : NOT_PUBLISHED}</Fact>
        <Fact label="Phone">
          {exchange.phone ? <a href={telHref(exchange.phone, exchange.country)}>{exchange.phone}</a> : NOT_PUBLISHED}
        </Fact>
        <Fact label="Email">
          {exchange.email ? <a href={`mailto:${exchange.email}`}>{exchange.email}</a> : NOT_PUBLISHED}
        </Fact>
        <Fact label="Year founded">{published(exchange.year_founded)}</Fact>
        <Fact label="Approximate members">{formatCount(exchange.approx_member_count)}</Fact>
        <Fact label="Member count notes">{published(exchange.member_count_notes)}</Fact>
        <Fact label="Cash fee">{formatCashFee(exchange.cash_fee_percent)}</Fact>
        <Fact label="Monthly dues">{published(exchange.monthly_dues)}</Fact>
        <Fact label="Annual dues">{published(exchange.annual_dues)}</Fact>
        <Fact label="Joining fee">{published(exchange.joining_fee)}</Fact>
        <Fact label="Fee notes">{published(exchange.fees_notes)}</Fact>
        <Fact label="Website response when checked">{published(exchange.website_http_status)}</Fact>
        <Fact label="Last checked">{formatDate(exchange.last_checked)}</Fact>
      </dl>

      <h2 className="mt-8 font-display text-2xl">Sources</h2>
      {linkedSources.length ? (
        <ul className="mt-3 space-y-2 text-sm">
          {linkedSources.map((url) => (
            <li key={url}>
              <a href={url} className="break-all text-pine underline underline-offset-4" rel="noopener noreferrer">
                {url}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm">{NOT_PUBLISHED}</p>
      )}
      <p className="mt-6 text-sm">
        See a mistake? <Link href={`/submit?slug=${exchange.slug}`} className="font-bold underline underline-offset-4">Send a correction</Link>. It is reviewed before anything changes.
      </p>
      <div className="mt-8 max-w-md rounded-md border border-line bg-card px-4 py-4">
        <h2 className="font-display text-2xl">Follow this directory</h2>
        <div className="mt-3">
          <SignupForm source={`exchange:${exchange.slug}`} />
        </div>
      </div>
    </article>
  );
}
