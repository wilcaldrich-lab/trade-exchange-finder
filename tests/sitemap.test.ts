import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import sitemap from "../src/app/sitemap";
import { loadSeedExchanges } from "../src/lib/catalog";
import { countryGroups, stateGroups } from "../src/lib/directory";
import { siteUrl } from "../src/lib/site";

const addedAfterPr8 = [
  "/exchange/badger-barter",
  "/exchange/barter-de-mexico",
  "/exchange/barter-network-inc",
  "/exchange/bartercard-australia",
  "/exchange/bartercard-new-zealand",
  "/exchange/bxi-barter-exchange-of-india",
  "/exchange/exmerce",
  "/exchange/itex",
  "/exchange/itrade-colorado",
  "/exchange/london-barter-network",
  "/exchange/metro-trading-association",
  "/exchange/res",
  "/exchange/tbt-barter",
  "/exchange/via-permuta",
  "/exchange/wir-bank-chw",
  "/country/in",
  "/country/mx",
  "/country/au",
  "/country/nz",
  "/country/ch",
  "/country/be",
];

test("sitemap is rendered per request instead of a frozen revalidate snapshot", () => {
  const source = readFileSync(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
  assert.match(source, /export const dynamic = "force-dynamic"/);
  assert.doesNotMatch(source, /export const revalidate\b/);
});

test("sitemap lists every exchange, state, and country from the catalog", async () => {
  const previousDb = process.env.DATABASE_URL;
  const previousPg = process.env.POSTGRES_URL;
  const previousSite = process.env.SITE_URL;
  delete process.env.DATABASE_URL;
  delete process.env.POSTGRES_URL;
  process.env.SITE_URL = "https://barterexchanges.org";
  try {
    const exchanges = loadSeedExchanges();
    const origin = siteUrl();
    const urls = (await sitemap()).map((entry) => entry.url);
    const expected = new Set<string>([
      `${origin}/`,
      `${origin}/guide`,
      `${origin}/submit`,
      `${origin}/sponsor`,
      `${origin}/privacy`,
    ]);
    for (const exchange of exchanges) expected.add(`${origin}/exchange/${exchange.slug}`);
    for (const slug of stateGroups(exchanges).keys()) expected.add(`${origin}/state/${slug}`);
    for (const slug of countryGroups(exchanges).keys()) expected.add(`${origin}/country/${slug}`);

    assert.equal(urls.length, expected.size);
    assert.deepEqual(new Set(urls), expected);
    for (const path of addedAfterPr8) {
      assert.equal(urls.includes(`${origin}${path}`), true, path);
    }
  } finally {
    if (previousDb === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDb;
    if (previousPg === undefined) delete process.env.POSTGRES_URL;
    else process.env.POSTGRES_URL = previousPg;
    if (previousSite === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = previousSite;
  }
});
