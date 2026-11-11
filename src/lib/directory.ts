import type { Exchange, ExchangeView } from "@/lib/exchange";
import { countryName, stateLabel, stateSlug } from "@/lib/places";

export type PlaceLink = {
  slug: string;
  label: string;
  count: number;
};

export type StateGroup = {
  slug: string;
  label: string;
  country: string | null;
  stateRegion: string;
  exchanges: Exchange[];
};

export function stateGroups(list: Exchange[]): Map<string, StateGroup> {
  const buckets = new Map<string, Exchange[]>();
  for (const exchange of list) {
    if (!exchange.state_region) continue;
    const id = `${(exchange.country || "xx").toLowerCase()}:${stateSlug(exchange.state_region)}`;
    const current = buckets.get(id) || [];
    current.push(exchange);
    buckets.set(id, current);
  }

  const groups = new Map<string, StateGroup>();
  const used = new Set<string>();
  for (const id of [...buckets.keys()].sort()) {
    const exchanges = buckets.get(id) || [];
    const first = exchanges[0];
    if (!first?.state_region) continue;
    const base = stateSlug(first.state_region);
    let slug = base;
    if (used.has(slug)) slug = `${(first.country || "xx").toLowerCase()}-${base}`;
    used.add(slug);
    groups.set(slug, {
      slug,
      label: stateLabel(first.state_region, first.country),
      country: first.country,
      stateRegion: first.state_region,
      exchanges,
    });
  }
  return groups;
}

export function countryGroups(list: Exchange[]): Map<string, Exchange[]> {
  const groups = new Map<string, Exchange[]>();
  for (const exchange of list) {
    if (!exchange.country) continue;
    const slug = exchange.country.toLowerCase();
    const current = groups.get(slug) || [];
    current.push(exchange);
    groups.set(slug, current);
  }
  return groups;
}

export function decorate(list: Exchange[]): {
  views: ExchangeView[];
  states: PlaceLink[];
  countries: PlaceLink[];
} {
  const states = stateGroups(list);
  const countries = countryGroups(list);
  const stateByExchange = new Map<string, string>();
  for (const group of states.values()) {
    for (const exchange of group.exchanges) stateByExchange.set(exchange.slug, group.slug);
  }
  const views = list.map((exchange) => ({
    ...exchange,
    state_slug: stateByExchange.get(exchange.slug) || null,
    country_slug: exchange.country ? exchange.country.toLowerCase() : null,
  }));
  return {
    views,
    states: [...states.values()]
      .map((group) => ({ slug: group.slug, label: group.label, count: group.exchanges.length }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    countries: [...countries.entries()]
      .map(([slug, exchanges]) => ({
        slug,
        label: countryName(exchanges[0]?.country),
        count: exchanges.length,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  };
}
