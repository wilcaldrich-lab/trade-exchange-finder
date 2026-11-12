import type { Exchange, ExchangeView } from "@/lib/exchange";
import { publishesFees } from "@/lib/exchange";
import { stateLabel, stateSlug } from "@/lib/places";

export type Filters = {
  q: string;
  state: string;
  country: string;
  network: string;
  fees: boolean;
};

export const EMPTY_FILTERS: Filters = {
  q: "",
  state: "",
  country: "",
  network: "",
  fees: false,
};

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw || "").trim().slice(0, 200);
}

export function parseFilters(params: SearchParams): Filters {
  const network = first(params.network).toUpperCase();
  const fees = first(params.fees);
  return {
    q: first(params.q),
    state: first(params.state).toLowerCase(),
    country: first(params.country).toLowerCase(),
    network: network === "IRTA" || network === "NATE" || network === "UC" || network === "BANC" ? network : "",
    fees: fees === "1" || fees === "true",
  };
}

export function filtersActive(filters: Filters): boolean {
  return Boolean(filters.q || filters.state || filters.country || filters.network || filters.fees);
}

export function toQuery(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.state) params.set("state", filters.state);
  if (filters.country) params.set("country", filters.country);
  if (filters.network) params.set("network", filters.network);
  if (filters.fees) params.set("fees", "1");
  const query = params.toString();
  return query ? `?${query}` : "";
}

function haystack(exchange: Exchange): string {
  return [exchange.name, exchange.city, exchange.state_region, stateLabel(exchange.state_region, exchange.country), exchange.description]
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .toLowerCase();
}

export function matchesQuery(exchange: Exchange, query: string): boolean {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return true;
  const text = haystack(exchange);
  return tokens.every((token) => text.includes(token));
}

function stateOf(exchange: ExchangeView | Exchange): string {
  if ("state_slug" in exchange && exchange.state_slug) return exchange.state_slug;
  return stateSlug(exchange.state_region, exchange.country);
}

function countryOf(exchange: ExchangeView | Exchange): string {
  if ("country_slug" in exchange && exchange.country_slug) return exchange.country_slug;
  return (exchange.country || "").toLowerCase();
}

export function filterExchanges<T extends Exchange>(list: T[], filters: Filters): T[] {
  return list.filter((exchange) => {
    if (filters.country && countryOf(exchange) !== filters.country) return false;
    if (filters.state && stateOf(exchange) !== filters.state) return false;
    if (filters.network && !exchange.networks.includes(filters.network)) return false;
    if (filters.fees && !publishesFees(exchange)) return false;
    if (filters.q && !matchesQuery(exchange, filters.q)) return false;
    return true;
  });
}

export function scrubQuery(query: string): string {
  return query.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, "[email]").slice(0, 200);
}
