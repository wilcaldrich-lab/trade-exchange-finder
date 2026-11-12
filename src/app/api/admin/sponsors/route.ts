import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { adminDenied } from "@/lib/admin";
import { databaseUrl, logError, query } from "@/lib/db";
import { isReadError, readJson } from "@/lib/http";
import { listSponsors, mapSponsor, validSponsorUrl } from "@/lib/sponsors";

const PLACEMENTS = new Set(["bar", "state_feature", "newsletter"]);

function cleanSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const slug = value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/^-|-$/g, "").slice(0, 80);
  return slug || null;
}

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function dateOrNull(value: unknown): string | null | "invalid" {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return "invalid";
}

export async function GET(request: Request) {
  const denied = adminDenied(request);
  if (denied) return denied;
  if (!databaseUrl()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    return NextResponse.json({ sponsors: await listSponsors() });
  } catch (error) {
    await logError(error, "/api/admin/sponsors");
    return NextResponse.json({ error: "Could not load sponsors." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = adminDenied(request);
  if (denied) return denied;
  if (!databaseUrl()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const body = await readJson(request);
    if (isReadError(body)) return NextResponse.json({ error: body.error }, { status: 400 });
    const id = body.id === undefined ? null : Number(body.id);
    if (id !== null && (!Number.isInteger(id) || id < 1)) {
      return NextResponse.json({ error: "Sponsor id is invalid." }, { status: 400 });
    }
    const slug = body.slug === undefined ? undefined : cleanSlug(body.slug);
    const name = body.name === undefined ? undefined : text(body.name, 160);
    const destination = body.destination_url === undefined ? undefined : text(body.destination_url, 500);
    const placement = body.placement === undefined ? undefined : text(body.placement, 40);
    const starts = body.starts_on === undefined ? undefined : dateOrNull(body.starts_on);
    const ends = body.ends_on === undefined ? undefined : dateOrNull(body.ends_on);
    if (slug === null || starts === "invalid" || ends === "invalid") {
      return NextResponse.json({ error: "Check the slug and dates." }, { status: 400 });
    }
    if (placement !== undefined && !PLACEMENTS.has(placement || "")) {
      return NextResponse.json({ error: "Placement must be bar, state_feature, or newsletter." }, { status: 400 });
    }
    if (destination && !validSponsorUrl(destination)) {
      return NextResponse.json({ error: "Destination must be an http(s) URL or a site path." }, { status: 400 });
    }

    if (id === null) {
      if (!slug || !name || !destination) {
        return NextResponse.json({ error: "New sponsors need a slug, name, and destination URL." }, { status: 400 });
      }
      const rows = await query<Record<string, unknown>>(
        `INSERT INTO sponsor_weeks (
          slug, name, tagline, destination_url, placement, state_region, exchange_slug, active, starts_on, ends_on
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`,
        [
          slug,
          name,
          text(body.tagline, 240),
          destination,
          placement || "bar",
          text(body.state_region, 80),
          cleanSlug(body.exchange_slug),
          body.active === false ? false : true,
          starts,
          ends,
        ],
      );
      revalidateTag("sponsors", { expire: 0 });
      return NextResponse.json({ sponsor: rows[0] ? mapSponsor(rows[0]) : null }, { status: 201 });
    }

    const assignments: string[] = [];
    const values: unknown[] = [];
    const set = (column: string, value: unknown) => {
      values.push(value);
      assignments.push(`${column} = $${values.length}`);
    };
    if (slug) set("slug", slug);
    if (name) set("name", name);
    if (body.tagline !== undefined) set("tagline", text(body.tagline, 240));
    if (destination) set("destination_url", destination);
    if (placement) set("placement", placement);
    if (body.state_region !== undefined) set("state_region", text(body.state_region, 80));
    if (body.exchange_slug !== undefined) set("exchange_slug", cleanSlug(body.exchange_slug));
    if (typeof body.active === "boolean") set("active", body.active);
    if (starts !== undefined) set("starts_on", starts);
    if (ends !== undefined) set("ends_on", ends);
    if (!assignments.length) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    assignments.push("updated_at = now()");
    values.push(id);
    const rows = await query<Record<string, unknown>>(
      `UPDATE sponsor_weeks SET ${assignments.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values,
    );
    if (!rows[0]) return NextResponse.json({ error: "Sponsor not found." }, { status: 404 });
    revalidateTag("sponsors", { expire: 0 });
    return NextResponse.json({ sponsor: mapSponsor(rows[0]) });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && (error as { code: string }).code === "23505") {
      return NextResponse.json({ error: "That sponsor slug is already used." }, { status: 409 });
    }
    await logError(error, "/api/admin/sponsors");
    return NextResponse.json({ error: "Could not save the sponsor." }, { status: 500 });
  }
}
