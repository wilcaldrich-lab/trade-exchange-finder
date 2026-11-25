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
  assert.equal(stateLabel("Veneto", "IT"), "Veneto");
  assert.equal(stateLabel("Abruzzo", "IT"), "Abruzzo");
  assert.equal(stateLabel("Utrecht", "NL"), "Utrecht");
  assert.equal(stateLabel("Tokyo", "JP"), "Tokyo");
  assert.equal(countryName("AU"), "Australia");
  assert.equal(countryName("NZ"), "New Zealand");
  assert.equal(countryName("CH"), "Switzerland");
  assert.equal(countryName("BE"), "Belgium");
  assert.equal(countryName("IN"), "India");
  assert.equal(countryName("MX"), "Mexico");
  assert.equal(countryName("IT"), "Italy");
  assert.equal(countryName("NL"), "Netherlands");
  assert.equal(countryName("JP"), "Japan");
  assert.equal(countryName("TR"), "Turkey");
  assert.equal(countryName("PL"), "Poland");
  assert.equal(countryName("PT"), "Portugal");
  assert.equal(countryName("SE"), "Sweden");
  assert.equal(countryName("EG"), "Egypt");
  assert.equal(stateLabel("Delhi", "IN"), "Delhi");
  assert.equal(stateLabel("Istanbul", "TR"), "Istanbul");
  assert.equal(stateLabel("Östergötland", "SE"), "Östergötland");

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
  for (const code of ["au", "nz", "ch", "be", "in", "mx", "it", "nl", "jp", "tr", "pl", "pt", "se", "eg"]) {
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
  assert.ok(groups.get("ontario")?.exchanges.some((exchange) => exchange.slug === "barterpay"));
  assert.ok(groups.get("lombardy")?.exchanges.some((exchange) => exchange.slug === "circuito-linx"));
  assert.ok(groups.get("lombardy")?.exchanges.some((exchange) => exchange.slug === "bexb"));
  assert.equal(groups.get("veneto")?.label, "Veneto");
  assert.equal(groups.get("veneto")?.country, "IT");
  assert.ok(groups.get("veneto")?.exchanges.some((exchange) => exchange.slug === "circuito-venetex"));
  assert.equal(groups.get("abruzzo")?.label, "Abruzzo");
  assert.ok(groups.get("abruzzo")?.exchanges.some((exchange) => exchange.slug === "abrex"));
  assert.equal(groups.get("utrecht")?.label, "Utrecht");
  assert.equal(groups.get("utrecht")?.country, "NL");
  assert.ok(groups.get("utrecht")?.exchanges.some((exchange) => exchange.slug === "united-economy"));
  assert.equal(groups.get("tokyo")?.label, "Tokyo");
  assert.equal(groups.get("tokyo")?.country, "JP");
  assert.ok(groups.get("tokyo")?.exchanges.some((exchange) => exchange.slug === "barter-japan"));
  assert.equal(groups.get("istanbul")?.label, "Istanbul");
  assert.equal(groups.get("istanbul")?.country, "TR");
  assert.ok(groups.get("istanbul")?.exchanges.some((exchange) => exchange.slug === "garanti-barter"));
  assert.equal(groups.get("delhi")?.label, "Delhi");
  assert.equal(groups.get("delhi")?.country, "IN");
  assert.ok(groups.get("delhi")?.exchanges.some((exchange) => exchange.slug === "oneuptrade"));
  assert.ok(groups.get("maharashtra")?.exchanges.some((exchange) => exchange.slug === "bxi-barter-exchange-of-india"));
  assert.equal(groups.get("ostergotland")?.label, "Östergötland");
  assert.equal(groups.get("ostergotland")?.country, "SE");
  assert.ok(groups.get("ostergotland")?.exchanges.some((exchange) => exchange.slug === "svensk-barter"));
  assert.equal(groups.get("illinois")?.exchanges.some((exchange) => exchange.slug === "art-of-barter"), true);
  assert.equal(groups.get("arizona")?.exchanges.some((exchange) => exchange.slug === "itrade-pay"), true);
  assert.equal(groups.get("oklahoma")?.exchanges.some((exchange) => exchange.slug === "oklahoma-barter-exchange"), true);

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
