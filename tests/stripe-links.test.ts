import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { FEATURED_LISTING_CHECKOUT_URL, NEWSLETTER_SPONSOR_CHECKOUT_URL } from "../src/lib/stripe-links";

function source(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("sponsor checkout URLs live in one constants file", () => {
  assert.equal(FEATURED_LISTING_CHECKOUT_URL, "https://buy.stripe.com/9B65kE9VqdxpbNd6mt6EU00");
  assert.equal(NEWSLETTER_SPONSOR_CHECKOUT_URL, "https://buy.stripe.com/bJeeVe6Je64X3gH7qx6EU01");
  const links = source("src/lib/stripe-links.ts");
  assert.equal(links.match(/https:\/\/buy\.stripe\.com\//g)?.length, 2);
});

test("sponsor page pays through those links and keeps the inquiry form", () => {
  const page = source("src/app/sponsor/page.tsx");
  assert.match(page, /from "@\/lib\/stripe-links"/);
  assert.match(page, /href=\{FEATURED_LISTING_CHECKOUT_URL\}/);
  assert.match(page, /href=\{NEWSLETTER_SPONSOR_CHECKOUT_URL\}/);
  assert.match(page, /Start for \$49\/mo/);
  assert.match(page, /Start for \$25\/week/);
  assert.match(page, /rel="noopener"/);
  assert.doesNotMatch(page, /target=/);
  assert.doesNotMatch(page, /buy\.stripe\.com/);
  assert.match(page, /After you pay, William will email within one business day/);
  assert.match(page, /Cancel anytime from the link in your Stripe receipt/);
  assert.match(page, /isPaidReturn\(params\.paid\)/);
  assert.match(page, /Payment received\. Thanks!/);
  assert.match(page, /<SponsorForm \/>/);

  const form = source("src/components/SponsorForm.tsx");
  assert.match(form, /Questions first\? Send an inquiry/);
  assert.match(form, /Featured listing on a state page — \$49\/month/);
  assert.match(form, /Newsletter sponsor slot — \$25\/week/);
  assert.doesNotMatch(form, /buy\.stripe\.com/);
});

test("other sponsor mentions still link to the sponsor page", () => {
  assert.match(source("src/components/Header.tsx"), /href="\/sponsor"/);
  assert.match(source("src/components/Footer.tsx"), /href="\/sponsor"/);
  assert.doesNotMatch(source("src/components/Header.tsx"), /buy\.stripe\.com/);
  assert.doesNotMatch(source("src/components/Footer.tsx"), /buy\.stripe\.com/);
});
