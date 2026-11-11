import type { MetadataRoute } from "next";
import { getExchanges } from "@/lib/catalog";
import { countryGroups, stateGroups } from "@/lib/directory";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  const exchanges = await getExchanges();
  const now = new Date();
  const pages = ["", "/guide", "/submit", "/sponsor"].map((path) => ({
    url: `${origin}${path || "/"}`,
    lastModified: now,
  }));
  const listings = exchanges.map((exchange) => ({
    url: `${origin}/exchange/${exchange.slug}`,
    lastModified: exchange.last_checked ? new Date(`${exchange.last_checked}T00:00:00Z`) : now,
  }));
  const states = [...stateGroups(exchanges).keys()].map((slug) => ({
    url: `${origin}/state/${slug}`,
    lastModified: now,
  }));
  const countries = [...countryGroups(exchanges).keys()].map((slug) => ({
    url: `${origin}/country/${slug}`,
    lastModified: now,
  }));
  return [...pages, ...listings, ...states, ...countries];
}
