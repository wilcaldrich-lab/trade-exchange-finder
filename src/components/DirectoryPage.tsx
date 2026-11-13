import Link from "next/link";
import { after } from "next/server";
import { headers } from "next/headers";
import { ExchangeBrowser } from "@/components/ExchangeBrowser";
import { JsonLd } from "@/components/JsonLd";
import { getExchanges } from "@/lib/catalog";
import { decorate } from "@/lib/directory";
import { filtersActive, filterExchanges, parseFilters, type Filters } from "@/lib/search";
import { logZeroResult } from "@/lib/search-log";
import { absoluteUrl } from "@/lib/site";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function DirectoryPage({
  searchParams,
  heading,
  lede,
  canonical,
  lockState = null,
  lockCountry = null,
  featuredSlug = null,
  feature = null,
  showBrowse = false,
}: {
  searchParams: SearchParams;
  heading: string;
  lede: string;
  canonical: string;
  lockState?: string | null;
  lockCountry?: string | null;
  featuredSlug?: string | null;
  feature?: { slug: string; name: string; tagline: string | null } | null;
  showBrowse?: boolean;
}) {
  const headerList = await headers();
  const all = decorate(await getExchanges());
  let scoped = all.views;
  if (lockState) scoped = scoped.filter((exchange) => exchange.state_slug === lockState);
  if (lockCountry) scoped = scoped.filter((exchange) => exchange.country_slug === lockCountry);
  const parsed = parseFilters(await searchParams);
  const filters: Filters = {
    ...parsed,
    state: lockState ? "" : parsed.state,
    country: lockCountry ? "" : parsed.country,
  };
  const results = filterExchanges(scoped, filters);
  if (headerList.get("x-count-view") === "1" && filtersActive(filters) && results.length === 0) {
    after(() => logZeroResult(filters));
  }

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: heading,
    url: absoluteUrl(canonical),
    numberOfItems: results.length,
    itemListElement: results.slice(0, 41).map((exchange, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/exchange/${exchange.slug}`),
      name: exchange.name,
    })),
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-3 sm:py-5">
      <JsonLd data={itemList} />
      <p className="kicker">Trade floor</p>
      <h1 className="mt-1 font-display text-[1.7rem] leading-tight tracking-tight sm:text-5xl">{heading}</h1>
      <p className="mt-1.5 max-w-2xl text-sm text-muted sm:text-base">{lede}</p>
      {feature ? (
        <aside className="market-card market-card-featured mt-4 px-4 py-3 text-sm">
          <p className="kicker kicker-alert">Featured</p>
          <a href={`/go/${feature.slug}`} className="mt-1 block font-display text-2xl leading-tight hover:text-pine-ink">
            {feature.name}
          </a>
          {feature.tagline ? <p className="mt-1 text-muted">{feature.tagline}</p> : null}
        </aside>
      ) : null}
      <div className="mt-3">
        <ExchangeBrowser
          exchanges={scoped}
          initial={filters}
          states={all.states}
          countries={all.countries}
          showState={!lockState}
          showCountry={!lockCountry}
          featuredSlug={featuredSlug}
        />
      </div>
      {showBrowse ? (
        <section className="mt-8 border-t border-line pt-5">
          <h2 className="font-display text-2xl leading-tight">Browse by state</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {all.states.map((state) => (
              <li key={state.slug}>
                <Link href={`/state/${state.slug}`} className="chip">
                  {state.label}
                  <span className="font-mono text-cyan">{state.count}</span>
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="mt-6 font-display text-2xl leading-tight">Browse by country</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {all.countries.map((country) => (
              <li key={country.slug}>
                <Link href={`/country/${country.slug}`} className="chip">
                  {country.label}
                  <span className="font-mono text-cyan">{country.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
