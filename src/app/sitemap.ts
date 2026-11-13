import type { MetadataRoute } from "next";
import { getExchanges } from "@/lib/catalog";
import { countryGroups, stateGroups } from "@/lib/directory";
import { siteUrl } from "@/lib/site";

const SITEMAP_UPDATED = new Date("2026-11-12T00:00:00.000Z");

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  const exchanges = await getExchanges();
  const pages = ["", "/guide", "/submit", "/sponsor", "/privacy"].map((path) => ({
    url: `${origin}${path || "/"}`,
    lastModified: SITEMAP_UPDATED,
  }));
  const listings = exchanges.map((exchange) => ({
    url: `${origin}/exchange/${exchange.slug}`,
    lastModified: exchange.last_checked ? new Date(`${exchange.last_checked}T00:00:00Z`) : SITEMAP_UPDATED,
  }));
  const states = [...stateGroups(exchanges).keys()].map((slug) => ({
    url: `${origin}/state/${slug}`,
    lastModified: SITEMAP_UPDATED,
  }));
  const countries = [...countryGroups(exchanges).keys()].map((slug) => ({
    url: `${origin}/country/${slug}`,
    lastModified: SITEMAP_UPDATED,
  }));
  return [...pages, ...listings, ...states, ...countries];
}
