import type { PoolClient } from "pg";
import { toExchange, type Exchange } from "@/lib/exchange";
import { getPool } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { isSafeHttpUrl } from "@/lib/urls";

const FIELDS = [
  "name",
  "slug",
  "website",
  "city",
  "state_region",
  "country",
  "phone",
  "email",
  "networks",
  "description",
  "cash_fee_percent",
  "monthly_dues",
  "annual_dues",
  "joining_fee",
  "fees_notes",
  "approx_member_count",
  "member_count_notes",
  "year_founded",
  "source_urls",
] as const;

type Field = (typeof FIELDS)[number];

function present(raw: Record<string, unknown>, key: Field): boolean {
  if (!Object.prototype.hasOwnProperty.call(raw, key)) return false;
  const value = raw[key];
  if (value === "" || value === undefined || value === null) return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

export function listingPayload(raw: Record<string, unknown>, mode: "new" | "correction"): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const key of FIELDS) {
    if (mode === "correction" && !present(raw, key)) continue;
    if (Object.prototype.hasOwnProperty.call(raw, key)) payload[key] = raw[key];
  }
  return payload;
}

function clip(value: string | null, max: number): string | null {
  if (!value) return null;
  return value.slice(0, max);
}

export function normalizeListing(raw: Record<string, unknown>, fallbackSlug?: string): Exchange | { error: string } {
  const draft = toExchange({
    ...raw,
    name: typeof raw.name === "string" ? raw.name : raw.name,
    slug: typeof raw.slug === "string" && raw.slug.trim() ? slugify(raw.slug) : fallbackSlug || slugify(String(raw.name || "")),
  });
  if (!draft) return { error: "A listing needs a name." };
  if (!draft.slug) return { error: "A listing needs a name that can become a URL." };
  if (draft.website && !isSafeHttpUrl(draft.website)) return { error: "Website must be an http(s) URL." };
  if (draft.country && !/^[A-Z]{2}$/.test(draft.country)) return { error: "Country must be a two-letter code." };
  if (draft.cash_fee_percent !== null && (draft.cash_fee_percent < 0 || draft.cash_fee_percent > 100)) {
    return { error: "Cash fee percent must be between 0 and 100." };
  }
  if (draft.year_founded !== null && (draft.year_founded < 1800 || draft.year_founded > 2100)) {
    return { error: "Founded year looks wrong." };
  }
  if (draft.approx_member_count !== null && draft.approx_member_count < 0) {
    return { error: "Member count cannot be negative." };
  }
  draft.name = clip(draft.name, 200) || draft.name;
  draft.description = clip(draft.description, 5000);
  draft.fees_notes = clip(draft.fees_notes, 2000);
  draft.phone = clip(draft.phone, 40);
  draft.email = clip(draft.email, 254);
  draft.networks = draft.networks
    .map((network) => network.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12))
    .filter((network) => network.length >= 2);
  draft.source_urls = draft.source_urls.filter((url) => isSafeHttpUrl(url)).slice(0, 12);
  return draft;
}

async function insertEntry(client: PoolClient, exchange: Exchange): Promise<void> {
  await client.query(
    `INSERT INTO entries (
      name, slug, website, city, state_region, country, phone, email, networks, description,
      cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
      member_count_notes, year_founded, source_urls, website_http_status, last_checked, updated_at
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      $11,$12,$13,$14,$15,$16,$17,$18,$19,NULL,CURRENT_DATE,now()
    )`,
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
    ],
  );
}

async function updateEntry(client: PoolClient, slug: string, patch: Partial<Exchange>): Promise<boolean> {
  const assignments: string[] = [];
  const values: unknown[] = [];
  const allowed = new Set<string>(FIELDS);
  for (const [key, value] of Object.entries(patch)) {
    if (!allowed.has(key) || key === "slug") continue;
    values.push(value);
    assignments.push(`${key} = $${values.length}`);
  }
  assignments.push("last_checked = CURRENT_DATE");
  assignments.push("updated_at = now()");
  values.push(slug);
  const result = await client.query(`UPDATE entries SET ${assignments.join(", ")} WHERE slug = $${values.length}`, values);
  return result.rowCount === 1;
}

export class ReviewError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function correctionChangesSlug(payload: Record<string, unknown>, exchangeSlug: string): boolean {
  if (typeof payload.slug !== "string" || !payload.slug.trim()) return false;
  return slugify(payload.slug) !== exchangeSlug;
}

export async function reviewSubmission(id: number, action: "approve" | "reject"): Promise<{ status: string }> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const found = await client.query<Record<string, unknown>>(
      "SELECT * FROM submissions WHERE id = $1 FOR UPDATE",
      [id],
    );
    const row = found.rows[0];
    if (!row) throw new ReviewError(404, "Submission not found.");
    if (row.status !== "pending") throw new ReviewError(409, "That submission is already reviewed.");

    if (action === "reject") {
      await client.query("UPDATE submissions SET status = 'rejected', reviewed_at = now() WHERE id = $1", [id]);
      await client.query("COMMIT");
      return { status: "rejected" };
    }

    const payload = row.payload && typeof row.payload === "object" ? (row.payload as Record<string, unknown>) : {};
    const kind = row.kind === "correction" ? "correction" : "new";
    if (kind === "new") {
      const listing = normalizeListing(payload);
      if ("error" in listing) throw new ReviewError(400, listing.error);
      await insertEntry(client, listing);
    } else {
      const exchangeSlug = typeof row.exchange_slug === "string" ? row.exchange_slug : "";
      if (!exchangeSlug) throw new ReviewError(400, "Correction is missing the exchange.");
      if (correctionChangesSlug(payload, exchangeSlug)) {
        throw new ReviewError(400, "Corrections cannot change the listing URL.");
      }
      const listing = normalizeListing({ ...payload, slug: exchangeSlug, name: payload.name || exchangeSlug }, exchangeSlug);
      if ("error" in listing) throw new ReviewError(400, listing.error);
      const patch: Partial<Exchange> = {};
      for (const key of FIELDS) {
        if (present(payload, key)) {
          patch[key] = listing[key] as never;
        }
      }
      const updated = await updateEntry(client, exchangeSlug, patch);
      if (!updated) throw new ReviewError(404, "The exchange to correct is not in the directory.");
    }

    await client.query("UPDATE submissions SET status = 'approved', reviewed_at = now() WHERE id = $1", [id]);
    await client.query("COMMIT");
    return { status: "approved" };
  } catch (error) {
    await client.query("ROLLBACK");
    if (typeof error === "object" && error && "code" in error && (error as { code: string }).code === "23505") {
      throw new ReviewError(409, "An exchange with that URL slug already exists.");
    }
    throw error;
  } finally {
    client.release();
  }
}
