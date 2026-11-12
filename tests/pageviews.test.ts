import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { config, shouldCountView } from "../src/proxy";
import { recordPageview } from "../src/lib/pageviews";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith(".ts") || full.endsWith(".tsx") ? [full] : [];
  });
}

test("document and RSC navigations count, empty dest and bots do not", () => {
  const visit = { pathname: "/guide", dest: "document", isRsc: false, prefetch: false, userAgent: "Mozilla/5.0" };
  assert.equal(shouldCountView(visit), true);
  assert.equal(shouldCountView({ ...visit, dest: null, isRsc: true }), true);
  assert.equal(shouldCountView({ ...visit, dest: null, isRsc: false }), false);
  assert.equal(shouldCountView({ ...visit, prefetch: true }), false);
  assert.equal(shouldCountView({ ...visit, pathname: "/api/signup" }), false);
  assert.equal(shouldCountView({ ...visit, pathname: "/go/house" }), false);
  for (const userAgent of ["Googlebot/2.1", "curl/8.0", "wget", "python-requests/2.31", "HeadlessChrome", "AdsBot", "SitePreview"]) {
    assert.equal(shouldCountView({ ...visit, userAgent }), false, userAgent);
  }
});

test("matcher skips scripts, data files, and icons", () => {
  const matcher = config.matcher.join(" ");
  for (const ext of ["js", "json", "txt", "xml", "ico", "css", "map"]) {
    assert.match(matcher, new RegExp(ext));
  }
});

test("404 path produces no insert", () => {
  const callers = walk("src")
    .filter((file) => readFileSync(file, "utf8").includes("recordPageview("))
    .map((file) => file.split(path.sep).join("/"))
    .sort();
  assert.deepEqual(callers, ["src/components/CountView.tsx", "src/lib/pageviews.ts"]);

  const notFound = readFileSync("src/app/not-found.tsx", "utf8");
  assert.doesNotMatch(notFound, /CountView|recordPageview/);
  const layout = readFileSync("src/app/layout.tsx", "utf8");
  assert.doesNotMatch(layout, /recordPageview|CountView/);

  for (const page of ["src/app/state/[state]/page.tsx", "src/app/country/[country]/page.tsx", "src/app/exchange/[slug]/page.tsx"]) {
    const source = readFileSync(page, "utf8");
    const notFoundAt = source.lastIndexOf("notFound()");
    const countAt = source.indexOf("<CountView");
    assert.ok(notFoundAt >= 0 && countAt > notFoundAt, page);
  }
});

test("recordPageview does not insert outside production", async () => {
  const previousEnv = process.env.VERCEL_ENV;
  const previousDb = process.env.DATABASE_URL;
  process.env.VERCEL_ENV = "preview";
  process.env.DATABASE_URL = "postgres://user:pass@127.0.0.1:1/none";
  try {
    await recordPageview("/missing-page", null);
  } finally {
    if (previousEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previousEnv;
    if (previousDb === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDb;
  }
});
