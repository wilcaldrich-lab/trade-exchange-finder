import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { tokenMatches } from "../src/lib/auth";
import { exchangesFromUnknown, publishesFees } from "../src/lib/exchange";
import { emailBlockReason } from "../src/lib/email-guard";
import { NOT_PUBLISHED, formatCashFee, published } from "../src/lib/format";
import { pickFive } from "../src/lib/newsletter";
import { filterExchanges, scrubQuery } from "../src/lib/search";
import { slugify } from "../src/lib/slug";
import { listingPayload } from "../src/lib/submissions";
import { isSafeHttpUrl, safeRedirectTarget } from "../src/lib/urls";

const seed = exchangesFromUnknown(
  JSON.parse(readFileSync(new URL("../data/exchanges.json", import.meta.url), "utf8")) as unknown,
);

const addedWorldwide = new Map([
  ["itex", "US"],
  ["bartercard-australia", "AU"],
  ["bartercard-new-zealand", "NZ"],
  ["wir-bank-chw", "CH"],
  ["res", "BE"],
  ["bxi-barter-exchange-of-india", "IN"],
  ["metro-trading-association", "US"],
  ["itrade-colorado", "US"],
  ["tbt-barter", "US"],
  ["barter-network-inc", "US"],
  ["badger-barter", "US"],
  ["via-permuta", "BR"],
  ["exmerce", "CA"],
  ["barter-de-mexico", "MX"],
  ["london-barter-network", "CA"],
]);

const addedRound2 = new Map([
  ["barterpay", "CA"],
  ["art-of-barter", "US"],
  ["itrade-pay", "US"],
  ["oklahoma-barter-exchange", "US"],
  ["circuito-linx", "IT"],
  ["circuito-venetex", "IT"],
  ["abrex", "IT"],
  ["united-economy", "NL"],
  ["barter-japan", "JP"],
]);

test("seed file has 64 unique sourced exchanges", () => {
  const catalog = JSON.parse(readFileSync(new URL("../data/exchanges.json", import.meta.url), "utf8")) as {
    count: number;
  };
  assert.equal(catalog.count, 64);
  assert.equal(seed.length, 64);
  assert.equal(new Set(seed.map((exchange) => exchange.slug)).size, 64);
  assert.equal(
    seed.some((exchange) => exchange.slug === "trade-euro" || exchange.website?.includes("tradeeuro.eu")),
    false,
  );
  const rechecked = new Map([
    ["bbx-global", "2026-11-21"],
    ["bancmarc", "2026-11-21"],
    ["bbx-uk", "2026-11-24"],
    ["bexb", "2026-11-24"],
    ["crescent-city-trade-exchange", "2026-11-24"],
  ]);
  for (const exchange of seed) {
    assert.ok(exchange.name);
    assert.ok(exchange.source_urls.length > 0);
    const expectedDate =
      rechecked.get(exchange.slug) ??
      (addedRound2.has(exchange.slug) ? "2026-11-24" : addedWorldwide.has(exchange.slug) ? "2026-11-23" : "2026-11-10");
    assert.equal(exchange.last_checked, expectedDate, exchange.slug);
  }
  assert.equal(addedWorldwide.size, 15);
  for (const [slug, country] of addedWorldwide) {
    const exchange = seed.find((item) => item.slug === slug);
    assert.ok(exchange, slug);
    assert.equal(exchange.country, country);
    assert.equal(exchange.website_http_status, 200);
    assert.ok(exchange.description);
  }
  assert.equal(addedRound2.size, 9);
  for (const [slug, country] of addedRound2) {
    const exchange = seed.find((item) => item.slug === slug);
    assert.ok(exchange, slug);
    assert.equal(exchange.country, country);
    assert.equal(exchange.website_http_status, 200);
    assert.ok(exchange.description);
    assert.equal(exchange.networks.length, 0);
  }

  const barterpay = seed.find((exchange) => exchange.slug === "barterpay");
  assert.ok(barterpay);
  assert.equal(barterpay.city, "Stoney Creek");
  assert.equal(barterpay.state_region, "ON");
  assert.equal(barterpay.monthly_dues, "$15");
  assert.equal(barterpay.joining_fee, "$300");
  assert.equal(barterpay.cash_fee_percent, null);
  assert.equal(barterpay.approx_member_count, 4000);
  assert.equal(barterpay.email, "hello@barterpay.ca");

  for (const slug of ["circuito-linx", "circuito-venetex", "abrex"]) {
    const exchange = seed.find((item) => item.slug === slug);
    assert.ok(exchange);
    assert.match(exchange.description ?? "", /commercial-credit circuit \(Sardex-style\) that works like a business barter exchange/);
  }

  const united = seed.find((exchange) => exchange.slug === "united-economy");
  assert.ok(united);
  assert.equal(united.phone, null);
  assert.equal(united.email, "info@unitedeconomy.nl");
  assert.equal(united.approx_member_count, 700);
  assert.match(united.description ?? "", /complementary-currency \/ circular-money cooperative/);
  assert.match(united.description ?? "", /rather than a classic trade exchange/);

  const japan = seed.find((exchange) => exchange.slug === "barter-japan");
  assert.ok(japan);
  assert.equal(japan.phone, "03-5379-3965");
  assert.equal(japan.email, null);
  assert.equal(japan.cash_fee_percent, 3.3);
  assert.equal(japan.year_founded, 2009);
  assert.match(japan.description ?? "", /No public email address was found/);

  const crescent = seed.find((exchange) => exchange.slug === "crescent-city-trade-exchange");
  assert.ok(crescent);
  assert.equal(crescent.website, "https://crescentcitytrade.net/");
  assert.equal(crescent.email, "info@crescentcitytrade.net");

  const bexb = seed.find((exchange) => exchange.slug === "bexb");
  assert.ok(bexb);
  assert.equal(bexb.email, "info@bexb.it");
  assert.match(bexb.description ?? "", /Since 16 July 2025/);
  assert.match(bexb.description ?? "", /In-Lire S\.p\.A\. Società Benefit/);

  const bbxUk = seed.find((exchange) => exchange.slug === "bbx-uk");
  assert.ok(bbxUk);
  assert.equal(bbxUk.website, "https://bbxuk.com/");
  assert.equal(bbxUk.email, "info.uk@bbxworld.com");
});

test("missing facts render as Not published", () => {
  assert.equal(published(null), NOT_PUBLISHED);
  assert.equal(published(""), NOT_PUBLISHED);
  assert.equal(formatCashFee(null), NOT_PUBLISHED);
  assert.equal(formatCashFee(6), "6%");
  assert.equal(formatCashFee(12.5), "12.5%");
  const alamo = seed.find((exchange) => exchange.slug === "alamo-barter");
  assert.ok(alamo);
  assert.equal(alamo.cash_fee_percent, null);
  assert.equal(publishesFees(alamo), false);
  const arizona = seed.find((exchange) => exchange.slug === "arizona-trade-exchange");
  assert.ok(arizona);
  assert.equal(arizona.cash_fee_percent, 12);
  assert.equal(publishesFees(arizona), true);
});

test("search matches name, city, state, and description only as requested", () => {
  const texas = filterExchanges(seed, { q: "Texas", state: "", country: "", network: "", fees: false });
  assert.ok(texas.some((exchange) => exchange.slug === "alamo-barter"));
  const fees = filterExchanges(seed, { q: "", state: "", country: "", network: "NATE", fees: true });
  assert.ok(fees.length > 0);
  assert.ok(fees.every((exchange) => exchange.networks.includes("NATE") && publishesFees(exchange)));
  assert.equal(scrubQuery("reach me at owner@shop.com please"), "reach me at [email] please");
});

test("email guard blocks junk and allows a normal address", () => {
  assert.equal(emailBlockReason("owner@shop.com"), null);
  assert.equal(emailBlockReason("owner+list@shop.com"), null);
  assert.ok(emailBlockReason("test@shop.com"));
  assert.ok(emailBlockReason("person@example.com"));
  assert.ok(emailBlockReason("person@mailinator.com"));
  assert.ok(emailBlockReason("person@spam.mailinator.com"));
  assert.ok(emailBlockReason("not-an-email"));
});

test("admin token compare is equal only for the same secret", () => {
  assert.equal(tokenMatches("secret-value", "secret-value"), true);
  assert.equal(tokenMatches("secret-value", "secret-valuE"), false);
  assert.equal(tokenMatches("", "secret-value"), false);
  assert.equal(tokenMatches("secret-value", undefined), false);
  assert.equal(tokenMatches(null, ""), false);
});

test("redirect targets reject unsafe URLs", () => {
  assert.equal(isSafeHttpUrl("https://barterexchanges.org/sponsor"), true);
  assert.equal(isSafeHttpUrl("javascript:alert(1)"), false);
  assert.equal(isSafeHttpUrl("//evil.example"), false);
  assert.equal(isSafeHttpUrl("https://user:pass@evil.example"), false);
  const origin = "https://barterexchanges.org";
  assert.equal(safeRedirectTarget("/sponsor", origin)?.href, "https://barterexchanges.org/sponsor");
  assert.equal(safeRedirectTarget("/\\evil.com", origin), null);
  assert.equal(safeRedirectTarget("//evil.com", origin), null);
  assert.equal(safeRedirectTarget("https://evil.example/offer", origin)?.href, "https://evil.example/offer");
});

test("a correction can clear networks and still ignore a blank source list", () => {
  assert.deepEqual(listingPayload({ networks: [], source_urls: [], phone: "210-650-9300" }, "correction"), {
    networks: [],
    phone: "210-650-9300",
  });
  assert.deepEqual(listingPayload({ source_urls: [] }, "correction"), {});
});

test("newsletter pick is five unique exchanges", () => {
  const picks = pickFive(seed, new Date("2026-11-11T12:00:00Z"));
  assert.equal(picks.length, 5);
  assert.equal(new Set(picks.map((pick) => pick.slug)).size, 5);
  for (const size of [7, 14, 28]) {
    const pool = Array.from({ length: size }, (_, index) => ({ ...seed[0], slug: `n-${index}`, name: `N ${index}` }));
    const chosen = pickFive(pool, new Date("2026-11-11T12:00:00Z"));
    assert.equal(chosen.length, 5, `size ${size}`);
    assert.equal(new Set(chosen.map((pick) => pick.slug)).size, 5);
  }
});

test("slugify keeps urls readable", () => {
  assert.equal(slugify("North Yorkshire"), "north-yorkshire");
  assert.equal(slugify("São Paulo"), "sao-paulo");
});

test("listing contact migration matches the seed corrections", () => {
  const sql = readFileSync(new URL("../db/migrations/003_listing_contacts.sql", import.meta.url), "utf8");
  assert.match(sql, /DELETE FROM entries\s+WHERE slug = 'trade-euro'/);
  assert.match(sql, /slug = 'crescent-city-trade-exchange'/);
  assert.match(sql, /https:\/\/crescentcitytrade\.net\//);
  assert.match(sql, /info@crescentcitytrade\.net/);
  assert.match(sql, /slug = 'bexb'/);
  assert.match(sql, /info@bexb\.it/);
  assert.match(sql, /Since 16 July 2025/);
  assert.match(sql, /slug = 'bbx-uk'/);
  assert.match(sql, /info\.uk@bbxworld\.com/);
  assert.doesNotMatch(sql, /tradeeuro\.eu|bexb@bexb\.it|tanya@crescentcitytrade\.com|laura\.whitemore@bbxworld\.com/);
});

test("worldwide exchange migration inserts the same 15 slugs once", () => {
  const sql = readFileSync(new URL("../db/migrations/004_add_worldwide_exchanges.sql", import.meta.url), "utf8");
  assert.match(sql, /ON CONFLICT \(slug\) DO NOTHING/);
  assert.match(sql, /INSERT INTO schema_migrations \(id\)\s+VALUES \('004_add_worldwide_exchanges'\)/);
  assert.doesNotMatch(sql, /classification|evidence/);
  for (const slug of addedWorldwide.keys()) {
    assert.equal(sql.split(`'${slug}'`).length - 1, 1, slug);
  }
});

test("round-2 exchange migration inserts the same 9 slugs once", () => {
  const sql = readFileSync(new URL("../db/migrations/005_add_round2_exchanges.sql", import.meta.url), "utf8");
  assert.match(sql, /ON CONFLICT \(slug\) DO NOTHING/);
  assert.match(sql, /INSERT INTO schema_migrations \(id\)\s+VALUES \('005_add_round2_exchanges'\)/);
  assert.doesNotMatch(sql, /classification|evidence/);
  for (const slug of addedRound2.keys()) {
    assert.equal(sql.split(`'${slug}'`).length - 1, 1, slug);
  }
  assert.match(sql, /commercial-credit circuit \(Sardex-style\) that works like a business barter exchange/);
  assert.match(sql, /complementary-currency \/ circular-money cooperative/);
  assert.match(sql, /'barter-japan',\s*\n\s*'https:\/\/www\.barter-japan\.com\/',\s*\n\s*'Tokyo',\s*\n\s*'Tokyo',\s*\n\s*'JP',\s*\n\s*'03-5379-3965',\s*\n\s*NULL,/);
});

test("migration file creates the directory tables", () => {
  const sql = readFileSync(new URL("../db/migrations/001_init.sql", import.meta.url), "utf8");
  for (const table of [
    "entries",
    "submissions",
    "signups",
    "zero_result_searches",
    "pageviews",
    "sponsor_weeks",
    "sponsor_clicks",
    "sponsor_inquiries",
    "errors",
  ]) {
    assert.match(sql, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`));
  }
});
