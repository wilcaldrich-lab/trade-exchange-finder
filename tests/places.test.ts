import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { countryGroups, resolveStateSlug, stateGroups } from "../src/lib/directory";
import { exchangesFromUnknown } from "../src/lib/exchange";
import { countryName, stateLabel, stateSlug } from "../src/lib/places";
import { filterExchanges } from "../src/lib/search";

const seed = exchangesFromUnknown(
  JSON.parse(readFileSync(new URL("../data/exchanges.json", import.meta.url), "utf8")) as unknown,
);

test("/state/texas resolves and /state/tx redirects", () => {
  const groups = stateGroups(seed);
  const texas = resolveStateSlug("texas", groups);
  assert.equal(texas.redirectTo, null);
  assert.equal(texas.group?.label, "Texas");
  assert.equal(texas.group?.stateRegion, "TX");
  assert.ok(texas.group?.exchanges.some((exchange) => exchange.slug === "alamo-barter"));

  assert.equal(resolveStateSlug("tx", groups).redirectTo, "/state/texas");
  assert.equal(resolveStateSlug("TX", groups).redirectTo, "/state/texas");
  assert.equal(resolveStateSlug("Texas", groups).redirectTo, "/state/texas");
  assert.equal(resolveStateSlug("Tx", groups).group, null);

  assert.equal(resolveStateSlug("ontario", groups).group?.label, "Ontario");
  assert.equal(resolveStateSlug("on", groups).redirectTo, "/state/ontario");
  assert.equal(resolveStateSlug("sao-paulo", groups).group?.label, "Sao Paulo");
  assert.equal(resolveStateSlug("sp", groups).redirectTo, "/state/sao-paulo");
  assert.equal(resolveStateSlug("minas-gerais", groups).group?.label, "Minas Gerais");
  assert.equal(resolveStateSlug("nope", groups).group, null);
  assert.equal(resolveStateSlug("nope", groups).redirectTo, null);
});

test("state slugs use the full region name", () => {
  assert.equal(stateSlug("TX", "US"), "texas");
  assert.equal(stateSlug("tx", "US"), "texas");
  assert.equal(stateSlug("ON", "CA"), "ontario");
  assert.equal(stateSlug("SP", "BR"), "sao-paulo");
  assert.equal(stateSlug("Minas Gerais", "BR"), "minas-gerais");
  assert.equal(stateSlug("North Yorkshire", "GB"), "north-yorkshire");
  assert.equal(stateSlug("Bangkok", "TH"), "bangkok");
  assert.equal(stateSlug("AB", "CA"), "alberta");
  assert.equal(stateSlug("CDMX", "MX"), "mexico-city");
  assert.equal(stateLabel("SP", "BR"), "Sao Paulo");
  assert.equal(stateLabel("TX", "US"), "Texas");
  assert.equal(stateLabel("Basel-Stadt", "CH"), "Basel-Stadt");
  assert.equal(stateLabel("Flanders", "BE"), "Flanders");
  assert.equal(stateLabel("Maharashtra", "IN"), "Maharashtra");
  assert.equal(countryName("AU"), "Australia");
  assert.equal(countryName("NZ"), "New Zealand");
  assert.equal(countryName("CH"), "Switzerland");
  assert.equal(countryName("BE"), "Belgium");
  assert.equal(countryName("IN"), "India");
  assert.equal(countryName("MX"), "Mexico");

  for (const exchange of seed) {
    if (exchange.country) {
      const name = countryName(exchange.country);
      assert.notEqual(name, exchange.country.toUpperCase(), exchange.slug);
    }
    if (!exchange.state_region) continue;
    const slug = stateSlug(exchange.state_region, exchange.country);
    assert.ok(slug.length > 2, `${exchange.country} ${exchange.state_region} -> ${slug}`);
  }

  const countries = countryGroups(seed);
  for (const code of ["au", "nz", "ch", "be", "in", "mx"]) {
    assert.ok(countries.get(code)?.length, code);
  }
  const groups = stateGroups(seed);
  assert.equal(groups.get("alberta")?.exchanges.some((exchange) => exchange.slug === "exmerce"), true);
  assert.equal(resolveStateSlug("ab", groups).redirectTo, "/state/alberta");
  assert.equal(groups.get("mexico-city")?.label, "Mexico City");
  assert.equal(groups.get("flanders")?.label, "Flanders");
  assert.equal(groups.get("maharashtra")?.label, "Maharashtra");
  assert.equal(groups.get("basel-stadt")?.label, "Basel-Stadt");
  assert.ok(groups.get("ontario")?.exchanges.some((exchange) => exchange.slug === "london-barter-network"));

  const views = seed.map((exchange) => ({
    ...exchange,
    state_slug: stateSlug(exchange.state_region, exchange.country),
    country_slug: exchange.country ? exchange.country.toLowerCase() : null,
  }));
  const texas = filterExchanges(views, { q: "", state: "texas", country: "", network: "", fees: false });
  assert.ok(texas.some((exchange) => exchange.slug === "alamo-barter"));
  assert.ok(texas.every((exchange) => exchange.state_region === "TX"));
  const legacy = filterExchanges(views, { q: "", state: "tx", country: "", network: "", fees: false });
  assert.ok(legacy.some((exchange) => exchange.slug === "alamo-barter"));
  assert.ok(legacy.every((exchange) => exchange.state_region === "TX"));
});
