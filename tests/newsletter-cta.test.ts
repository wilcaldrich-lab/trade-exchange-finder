import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { cleanSource } from "../src/lib/signup-source";

function source(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("signup sources stay on known pages, including directory cards", () => {
  assert.equal(cleanSource("home"), "home");
  assert.equal(cleanSource("footer"), "footer");
  assert.equal(cleanSource("sponsor"), "sponsor");
  assert.equal(cleanSource("exchange:alamo-barter"), "exchange:alamo-barter");
  assert.equal(cleanSource("country:us"), "country:us");
  assert.equal(cleanSource("state:new-york"), "state:new-york");
  assert.equal(cleanSource("state:gb-greater-london"), "state:gb-greater-london");
  assert.equal(cleanSource(undefined), "home");
  assert.equal(cleanSource(12), "home");
  assert.equal(cleanSource("country:US"), "home");
  assert.equal(cleanSource("country:"), "home");
  assert.equal(cleanSource("exchange:"), "home");
  assert.equal(cleanSource("state:../admin"), "home");
  assert.equal(cleanSource("javascript:alert(1)"), "home");
  assert.equal(cleanSource(`exchange:${"a".repeat(81)}`), "home");
  assert.equal(cleanSource(`country:${"a".repeat(80)}`), `country:${"a".repeat(80)}`);
});

test("signup route still stores the cleaned source and does not change confirm mail", () => {
  const route = source("src/app/api/signup/route.ts");
  assert.match(route, /cleanSource\(body\.source\)/);
  assert.match(route, /sendConfirmEmail\(email, link\)/);
  assert.match(route, /INSERT INTO signups \(email, source, confirmed\)/);
  assert.doesNotMatch(route, /function cleanSource/);
  assert.match(source("src/components/SignupForm.tsx"), /fetch\("\/api\/signup"/);
  assert.match(source("src/components/SignupForm.tsx"), /company_fax: fax/);
});

test("newsletter card reuses the labelled signup form", () => {
  const card = source("src/components/NewsletterCta.tsx");
  const form = source("src/components/SignupForm.tsx");
  assert.match(card, /Get the weekly barter exchange roundup/);
  assert.match(card, /New exchanges, deals and barter tips every Tuesday, free, unsubscribe anytime\./);
  assert.match(card, /<SignupForm source=\{source\} \/>/);
  assert.match(card, /aria-labelledby=\{headingId\}/);
  assert.match(form, /<label htmlFor=\{fieldId\}/);
  assert.match(form, /type="email"/);
  assert.match(form, /autoComplete="email"/);
  assert.match(form, /aria-invalid=\{error \? true : undefined\}/);
  assert.match(form, /role="alert"/);
  assert.match(form, /role="status"/);
  assert.match(source("src/app/globals.css"), /\.prompt:focus-within/);
  assert.match(source("src/app/globals.css"), /\.prompt input:focus-visible/);
  assert.match(source("src/app/globals.css"), /\.bg-pine:focus-visible/);
});

test("exchange, country, and state pages place the card after the listing", () => {
  const exchange = source("src/app/exchange/[slug]/page.tsx");
  const correction = exchange.indexOf("Send a correction");
  const card = exchange.indexOf("<NewsletterCta");
  assert.ok(correction > 0 && card > correction);
  assert.doesNotMatch(exchange, /SignupForm/);
  assert.match(exchange, /source=\{`exchange:\$\{exchange\.slug\}`\}/);

  const directory = source("src/components/DirectoryPage.tsx");
  const list = directory.indexOf("<ExchangeBrowser");
  const cta = directory.indexOf("<NewsletterCta");
  const browse = directory.indexOf("{showBrowse ?");
  assert.ok(list > 0 && cta > list && browse > cta);
  assert.match(directory, /\{newsletterSource \?/);

  assert.match(source("src/app/country/[country]/page.tsx"), /newsletterSource=\{`country:\$\{group\.slug\}`\}/);
  assert.match(source("src/app/state/[state]/page.tsx"), /newsletterSource=\{`state:\$\{group\.slug\}`\}/);
  assert.doesNotMatch(source("src/app/page.tsx"), /newsletterSource/);
});
