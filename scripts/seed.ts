import { readFileSync } from "fs";
import path from "path";
import { Pool } from "pg";
import { exchangesFromUnknown } from "../src/lib/exchange";
import { migrate, migrationUrl, poolConfig } from "../src/lib/db";

async function main() {
  const url = migrationUrl();
  if (!url) throw new Error("DATABASE_URL or POSTGRES_URL is not set");
  await migrate(url);
  const parsed = JSON.parse(readFileSync(path.join(process.cwd(), "data/exchanges.json"), "utf8")) as unknown;
  const exchanges = exchangesFromUnknown(parsed);
  const pool = new Pool(poolConfig(url, 1));
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const exchange of exchanges) {
      await client.query(
        `INSERT INTO entries (
          name, slug, website, city, state_region, country, phone, email, networks, description,
          cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
          member_count_notes, year_founded, source_urls, website_http_status, last_checked, updated_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,now()
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          website = EXCLUDED.website,
          city = EXCLUDED.city,
          state_region = EXCLUDED.state_region,
          country = EXCLUDED.country,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          networks = EXCLUDED.networks,
          description = EXCLUDED.description,
          cash_fee_percent = EXCLUDED.cash_fee_percent,
          monthly_dues = EXCLUDED.monthly_dues,
          annual_dues = EXCLUDED.annual_dues,
          joining_fee = EXCLUDED.joining_fee,
          fees_notes = EXCLUDED.fees_notes,
          approx_member_count = EXCLUDED.approx_member_count,
          member_count_notes = EXCLUDED.member_count_notes,
          year_founded = EXCLUDED.year_founded,
          source_urls = EXCLUDED.source_urls,
          website_http_status = EXCLUDED.website_http_status,
          last_checked = EXCLUDED.last_checked,
          updated_at = now()`,
        [
          exchange.name,
          exchange.slug,
          exchange.website,
          exchange.city,
          exchange.state_region,
          exchange.country,
          exchange.phone,
          exchange.email,
          exchange.networks,
          exchange.description,
          exchange.cash_fee_percent,
          exchange.monthly_dues,
          exchange.annual_dues,
          exchange.joining_fee,
          exchange.fees_notes,
          exchange.approx_member_count,
          exchange.member_count_notes,
          exchange.year_founded,
          exchange.source_urls,
          exchange.website_http_status,
          exchange.last_checked,
        ],
      );
    }
    await client.query("COMMIT");
    console.log(`Seeded ${exchanges.length} exchanges.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
