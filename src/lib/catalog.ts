import { readFileSync } from "fs";
import path from "path";
import { unstable_cache } from "next/cache";
import { exchangesFromUnknown, toExchange, type Exchange } from "@/lib/exchange";
import { databaseUrl, logError, query } from "@/lib/db";

let seedCache: Exchange[] | null = null;

export function loadSeedExchanges(): Exchange[] {
  if (seedCache) return seedCache;
  const file = path.join(process.cwd(), "data/exchanges.json");
  const parsed = JSON.parse(readFileSync(file, "utf8")) as unknown;
  seedCache = exchangesFromUnknown(parsed);
  return seedCache;
}

const readExchanges = unstable_cache(
  async (): Promise<Exchange[]> => {
    const rows = await query<Record<string, unknown>>("SELECT * FROM entries ORDER BY name ASC");
    const exchanges = rows
      .map((row) => toExchange(row))
      .filter((row): row is Exchange => row !== null);
    if (!exchanges.length) return loadSeedExchanges();
    return exchanges;
  },
  ["exchanges"],
  { revalidate: 300, tags: ["exchanges"] },
);

export async function getExchanges(): Promise<Exchange[]> {
  if (!databaseUrl()) return loadSeedExchanges();
  try {
    return await readExchanges();
  } catch (error) {
    await logError(error, "getExchanges");
    return loadSeedExchanges();
  }
}

export async function getExchange(slug: string): Promise<Exchange | null> {
  const exchanges = await getExchanges();
  return exchanges.find((exchange) => exchange.slug === slug) || null;
}
