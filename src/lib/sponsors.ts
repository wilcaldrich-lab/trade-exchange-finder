import { databaseUrl, logError, query } from "@/lib/db";
import { isSafeHttpUrl } from "@/lib/urls";

export type Sponsor = {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  destination_url: string;
  placement: "bar" | "state_feature" | "newsletter";
  state_region: string | null;
  exchange_slug: string | null;
  active: boolean;
  starts_on: string | null;
  ends_on: string | null;
};

function dateText(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  const text = String(value).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
}

export function mapSponsor(row: Record<string, unknown>): Sponsor | null {
  const slug = typeof row.slug === "string" ? row.slug : "";
  const name = typeof row.name === "string" ? row.name : "";
  const destination = typeof row.destination_url === "string" ? row.destination_url : "";
  const placement = row.placement;
  if (!slug || !name || !destination) return null;
  if (placement !== "bar" && placement !== "state_feature" && placement !== "newsletter") return null;
  const id = typeof row.id === "number" ? row.id : Number(row.id);
  if (!Number.isInteger(id)) return null;
  return {
    id,
    slug,
    name,
    tagline: typeof row.tagline === "string" && row.tagline.trim() ? row.tagline.trim() : null,
    destination_url: destination,
    placement,
    state_region: typeof row.state_region === "string" && row.state_region.trim() ? row.state_region.trim() : null,
    exchange_slug: typeof row.exchange_slug === "string" && row.exchange_slug.trim() ? row.exchange_slug.trim() : null,
    active: row.active !== false,
    starts_on: dateText(row.starts_on),
    ends_on: dateText(row.ends_on),
  };
}

const ACTIVE_WINDOW = `
  active = true
  AND (starts_on IS NULL OR starts_on <= CURRENT_DATE)
  AND (ends_on IS NULL OR ends_on >= CURRENT_DATE)
`;

export async function getBarSponsor(): Promise<Sponsor | null> {
  if (!databaseUrl()) return null;
  try {
    const rows = await query<Record<string, unknown>>(
      `SELECT * FROM sponsor_weeks
       WHERE placement = 'bar' AND ${ACTIVE_WINDOW}
       ORDER BY starts_on DESC NULLS LAST, id DESC
       LIMIT 1`,
    );
    return rows[0] ? mapSponsor(rows[0]) : null;
  } catch (error) {
    await logError(error, "getBarSponsor");
    return null;
  }
}

export async function getStateSponsor(keys: string[]): Promise<Sponsor | null> {
  if (!databaseUrl()) return null;
  const normalized = [...new Set(keys.map((key) => key.trim().toLowerCase()).filter(Boolean))];
  if (!normalized.length) return null;
  try {
    const rows = await query<Record<string, unknown>>(
      `SELECT * FROM sponsor_weeks
       WHERE placement = 'state_feature' AND ${ACTIVE_WINDOW}
         AND lower(coalesce(state_region, '')) = ANY($1::text[])
       ORDER BY starts_on DESC NULLS LAST, id DESC
       LIMIT 1`,
      [normalized],
    );
    return rows[0] ? mapSponsor(rows[0]) : null;
  } catch (error) {
    await logError(error, "getStateSponsor");
    return null;
  }
}

export async function getNewsletterSponsor(): Promise<Sponsor | null> {
  if (!databaseUrl()) return null;
  try {
    const rows = await query<Record<string, unknown>>(
      `SELECT * FROM sponsor_weeks
       WHERE placement = 'newsletter' AND ${ACTIVE_WINDOW}
       ORDER BY starts_on DESC NULLS LAST, id DESC
       LIMIT 1`,
    );
    const sponsor = rows[0] ? mapSponsor(rows[0]) : null;
    if (sponsor) return sponsor;
    return getBarSponsor();
  } catch (error) {
    await logError(error, "getNewsletterSponsor");
    return null;
  }
}

export async function getSponsorBySlug(slug: string): Promise<Sponsor | null> {
  if (!databaseUrl()) return null;
  try {
    const rows = await query<Record<string, unknown>>(
      `SELECT * FROM sponsor_weeks
       WHERE slug = $1 AND ${ACTIVE_WINDOW}
       LIMIT 1`,
      [slug],
    );
    return rows[0] ? mapSponsor(rows[0]) : null;
  } catch (error) {
    await logError(error, `/go/${slug}`);
    return null;
  }
}

export async function listSponsors(): Promise<Sponsor[]> {
  const rows = await query<Record<string, unknown>>("SELECT * FROM sponsor_weeks ORDER BY id DESC");
  return rows.map((row) => mapSponsor(row)).filter((row): row is Sponsor => row !== null);
}

export function validSponsorUrl(value: string): boolean {
  return isSafeHttpUrl(value) || (value.startsWith("/") && !value.startsWith("//"));
}

export async function logSponsorClick(sponsor: string, referrer: string | null): Promise<void> {
  if (!databaseUrl()) return;
  try {
    await query("INSERT INTO sponsor_clicks (sponsor, path, referrer) VALUES ($1, $2, $3)", [
      sponsor.slice(0, 80),
      `/go/${sponsor}`.slice(0, 120),
      referrer ? referrer.slice(0, 200) : null,
    ]);
  } catch (error) {
    await logError(error, `/go/${sponsor}`);
  }
}
