"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ExchangeCard } from "@/components/ExchangeCard";
import type { ExchangeView } from "@/lib/exchange";
import { NETWORK_OPTIONS } from "@/lib/exchange";
import type { PlaceLink } from "@/lib/directory";
import { filterExchanges, toQuery, type Filters } from "@/lib/search";

export function ExchangeBrowser({
  exchanges,
  initial,
  states,
  countries,
  showState = true,
  showCountry = true,
  featuredSlug = null,
}: {
  exchanges: ExchangeView[];
  initial: Filters;
  states: PlaceLink[];
  countries: PlaceLink[];
  showState?: boolean;
  showCountry?: boolean;
  featuredSlug?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState(initial);
  const results = useMemo(() => {
    const filtered = filterExchanges(exchanges, filters);
    if (!featuredSlug) return filtered;
    return [...filtered].sort((a, b) => Number(b.slug === featuredSlug) - Number(a.slug === featuredSlug));
  }, [exchanges, filters, featuredSlug]);

  useEffect(() => {
    const next = toQuery(filters);
    if (window.location.search === next) return;
    router.replace(`${pathname}${next}`, { scroll: false });
  }, [filters, pathname, router]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div>
      <form action={pathname} method="get" onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="q">
            Search by name, city, state, or description
          </label>
          <input
            id="q"
            name="q"
            value={filters.q}
            onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
            placeholder="Search name, city, state, or description"
            className="h-11 min-w-0 flex-1 border border-line bg-card px-3 text-base"
          />
          <button type="submit" className="btn-ghost h-11 shrink-0 px-3 text-sm">
            Search
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:overflow-x-auto sm:pb-1">
          {showState ? (
            <label className="sr-only" htmlFor="state">
              State
            </label>
          ) : null}
          {showState ? (
            <select
              id="state"
              name="state"
              value={filters.state}
              onChange={(event) => setFilters((current) => ({ ...current, state: event.target.value }))}
              className="h-11 w-full min-w-0 border border-line bg-card px-2 text-sm sm:w-36 sm:shrink-0"
            >
              <option value="">All states</option>
              {states.map((state) => (
                <option key={state.slug} value={state.slug}>
                  {state.label} ({state.count})
                </option>
              ))}
            </select>
          ) : null}
          {showCountry ? (
            <select
              id="country"
              name="country"
              aria-label="Country"
              value={filters.country}
              onChange={(event) => setFilters((current) => ({ ...current, country: event.target.value }))}
              className="h-11 w-full min-w-0 border border-line bg-card px-2 text-sm sm:w-40 sm:shrink-0"
            >
              <option value="">All countries</option>
              {countries.map((country) => (
                <option key={country.slug} value={country.slug}>
                  {country.label} ({country.count})
                </option>
              ))}
            </select>
          ) : null}
          <select
            id="network"
            name="network"
            aria-label="Network"
            value={filters.network}
            onChange={(event) => setFilters((current) => ({ ...current, network: event.target.value }))}
            className="h-11 w-full min-w-0 border border-line bg-card px-2 text-sm sm:w-40 sm:shrink-0"
          >
            <option value="">All networks</option>
            {NETWORK_OPTIONS.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>
          <label className="flex h-11 min-w-0 items-center gap-2 border border-line bg-card px-2 text-sm sm:shrink-0">
            <input
              type="checkbox"
              name="fees"
              value="1"
              checked={filters.fees}
              onChange={(event) => setFilters((current) => ({ ...current, fees: event.target.checked }))}
            />
            Publishes fees
          </label>
        </div>
      </form>
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-muted" aria-live="polite">
        <span className="live-dot" aria-hidden="true" />
        <span className="text-pine">{results.length}</span>
        {results.length === 1 ? " exchange" : " exchanges"}
        {results.length !== exchanges.length ? ` of ${exchanges.length}` : ""}
      </p>
      {results.length ? (
        <div className="mt-3 flex flex-col gap-3">
          {results.map((exchange) => (
            <ExchangeCard key={exchange.slug} exchange={exchange} featured={exchange.slug === featuredSlug} />
          ))}
        </div>
      ) : (
        <p className="terminal mt-4 px-4 py-5 text-sm">
          <span className="kicker kicker-alert">No match</span>
          <span className="mt-1 block">No exchanges match. Try a city or state name, or clear a filter.</span>
        </p>
      )}
    </div>
  );
}
