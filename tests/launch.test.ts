import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { readConfirmToken, signConfirmToken } from "../src/lib/confirm";
import { poolConfig } from "../src/lib/db";
import { telHref } from "../src/lib/phone";
import { correctionChangesSlug } from "../src/lib/submissions";

test("phone links keep an existing plus and add the country calling code", () => {
  assert.equal(telHref("210-650-9300", "US"), "tel:+12106509300");
  assert.equal(telHref("(801) 802-0322", "US"), "tel:+18018020322");
  assert.equal(telHref("866-362-2783", "CA"), "tel:+18663622783");
  assert.equal(telHref("02-024-1000", "TH"), "tel:+6620241000");
  assert.equal(telHref("020 4586 7714", "GB"), "tel:+442045867714");
  assert.equal(telHref("0333-400-2014", "GB"), "tel:+443334002014");
  assert.equal(telHref("39-030-2059770", "IT"), "tel:+390302059770");
  assert.equal(telHref("55-31-2552-4442", "BR"), "tel:+553125524442");
  assert.equal(telHref("+55 11 3848 2800", "BR"), "tel:+551138482800");
  assert.equal(telHref("+32 475 44 76 76", "BE"), "tel:+32475447676");
  assert.equal(telHref("852-300-85832", "SG"), "tel:+6585230085832");
});

test("confirm tokens round trip and expire", () => {
  const previous = process.env.CONFIRM_SECRET;
  process.env.CONFIRM_SECRET = "confirm-test-secret";
  try {
    const token = signConfirmToken("Owner@Shop.com");
    if (!token) throw new Error("expected a token");
    assert.equal(readConfirmToken(token), "owner@shop.com");
    assert.equal(readConfirmToken(`${token}x`), null);
    const expired = signConfirmToken("owner@shop.com", Date.now() - 11 * 24 * 60 * 60 * 1000);
    if (!expired) throw new Error("expected an expired token");
    assert.equal(readConfirmToken(expired), null);
  } finally {
    if (previous === undefined) delete process.env.CONFIRM_SECRET;
    else process.env.CONFIRM_SECRET = previous;
  }
});

test("corrections cannot change the slug", () => {
  assert.equal(correctionChangesSlug({ slug: "other-name" }, "alamo-barter"), true);
  assert.equal(correctionChangesSlug({ slug: "Alamo Barter" }, "alamo-barter"), false);
  assert.equal(correctionChangesSlug({ name: "Alamo" }, "alamo-barter"), false);
});

test("signup migration adds confirmed and synced_at", () => {
  const sql = readFileSync(new URL("../db/migrations/002_signups_confirm.sql", import.meta.url), "utf8");
  assert.match(sql, /ADD COLUMN IF NOT EXISTS confirmed/);
  assert.match(sql, /ADD COLUMN IF NOT EXISTS synced_at/);
  assert.match(sql, /SET DEFAULT false/);
});

test("audience helper adds an existing contact to the segment", () => {
  const source = readFileSync(new URL("../src/lib/resend-mail.ts", import.meta.url), "utf8");
  const add = source.slice(source.indexOf("export async function addToAudience"), source.indexOf("export async function sendConfirmEmail"));
  assert.match(add, /contacts\.segments\.add/);
  assert.doesNotMatch(add, /audienceId/);
  const draft = source.slice(source.indexOf("export async function createNewsletterDraft"));
  assert.match(draft, /OWNER_EMAIL/);
  assert.match(draft, /replyTo/);
});

test("pool ssl rejects unauthorized certificates without sslmode", () => {
  const config = poolConfig("postgres://user:pass@ep.neon.tech/db?sslmode=require&channel_binding=require", 5);
  assert.deepEqual(config.ssl, { rejectUnauthorized: true });
  assert.equal(String(config.connectionString).includes("sslmode"), false);
  assert.match(String(config.connectionString), /channel_binding=require/);
  const local = poolConfig("postgres://user:pass@localhost:5432/db", 1);
  assert.equal(local.ssl, undefined);

  const script = `
    const pg = require("pg");
    const warnings = [];
    process.on("warning", (warning) => warnings.push(String(warning)));
    const pool = new pg.Pool(${JSON.stringify(config)});
    pool.end().then(() => setTimeout(() => {
      if (warnings.some((warning) => warning.includes("sslmode"))) process.exit(2);
      process.exit(0);
    }, 50));
  `;
  const result = spawnSync(process.execPath, ["-e", script], {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("predeploy script checks a clean tree and origin/main", () => {
  const script = readFileSync(new URL("../scripts/predeploy.mjs", import.meta.url), "utf8");
  assert.match(script, /git status --porcelain/);
  assert.match(script, /origin\/main/);
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { scripts: Record<string, string> };
  assert.equal(pkg.scripts.predeploy, "node scripts/predeploy.mjs");
});
