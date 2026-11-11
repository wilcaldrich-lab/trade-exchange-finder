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
import { isSafeHttpUrl } from "../src/lib/urls";

const seed = exchangesFromUnknown(
  JSON.parse(readFileSync(new URL("../data/exchanges.json", import.meta.url), "utf8")) as unknown,
);

test("seed file has 41 unique sourced exchanges", () => {
  assert.equal(seed.length, 41);
  assert.equal(new Set(seed.map((exchange) => exchange.slug)).size, 41);
  for (const exchange of seed) {
    assert.ok(exchange.name);
    assert.ok(exchange.source_urls.length > 0);
    assert.equal(exchange.last_checked, "2026-11-10");
  }
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
});

test("newsletter pick is five unique exchanges", () => {
  const picks = pickFive(seed, new Date("2026-11-11T12:00:00Z"));
  assert.equal(picks.length, 5);
  assert.equal(new Set(picks.map((pick) => pick.slug)).size, 5);
});

test("slugify keeps urls readable", () => {
  assert.equal(slugify("North Yorkshire"), "north-yorkshire");
  assert.equal(slugify("São Paulo"), "sao-paulo");
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
