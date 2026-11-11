import { NextResponse } from "next/server";
import { getExchanges } from "@/lib/catalog";
import { databaseUrl, logError, query } from "@/lib/db";
import { emailBlockReason, normalizeEmail } from "@/lib/email-guard";
import { isReadError, readJson } from "@/lib/http";
import { clientIp, honeypotFilled, rateLimit } from "@/lib/rate-limit";
import { slugify } from "@/lib/slug";
import { listingPayload } from "@/lib/submissions";

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    if (isReadError(body)) return NextResponse.json({ error: body.error }, { status: 400 });
    if (!rateLimit(`submit:${clientIp(request)}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Wait a minute and try again." }, { status: 429 });
    }
    if (honeypotFilled(body)) return NextResponse.json({ ok: true });
    const kind = body.kind === "new" || body.kind === "correction" ? body.kind : null;
    if (!kind) return NextResponse.json({ error: "Choose a new listing or a correction." }, { status: 400 });
    const submitterEmail = typeof body.submitter_email === "string" ? normalizeEmail(body.submitter_email) : "";
    const emailReason = emailBlockReason(submitterEmail);
    if (emailReason) return NextResponse.json({ error: emailReason }, { status: 400 });
    const submitterName = text(body.submitter_name, 120);
    if (!submitterName) return NextResponse.json({ error: "Your name is required." }, { status: 400 });

    let exchangeSlug: string | null = null;
    if (kind === "correction") {
      exchangeSlug = slugify(typeof body.exchange_slug === "string" ? body.exchange_slug : "");
      if (!exchangeSlug) return NextResponse.json({ error: "Choose the exchange to correct." }, { status: 400 });
      const existing = await getExchanges();
      if (!existing.some((exchange) => exchange.slug === exchangeSlug)) {
        return NextResponse.json({ error: "That exchange is not in the directory." }, { status: 400 });
      }
    } else if (typeof body.name !== "string" || body.name.trim().length < 2) {
      return NextResponse.json({ error: "The exchange name is required." }, { status: 400 });
    }
    if (!databaseUrl()) {
      return NextResponse.json({ error: "Submissions are unavailable until the database is connected." }, { status: 503 });
    }
    const recent = await query<{ count: string }>(
      "SELECT count(*)::text AS count FROM submissions WHERE submitter_email = $1 AND created_at > now() - interval '1 hour'",
      [submitterEmail],
    );
    if (Number(recent[0]?.count || 0) >= 5) {
      return NextResponse.json({ error: "Too many submissions from that email. Try again later." }, { status: 429 });
    }

    const payload = listingPayload(body, kind);
    const inserted = await query<{ id: string }>(
      `INSERT INTO submissions (kind, exchange_slug, payload, submitter_name, submitter_email, notes)
       VALUES ($1, $2, $3::jsonb, $4, $5, $6)
       RETURNING id::text`,
      [kind, exchangeSlug, JSON.stringify(payload), submitterName, submitterEmail, text(body.notes, 2000)],
    );
    return NextResponse.json({ ok: true, id: Number(inserted[0]?.id || 0) });
  } catch (error) {
    await logError(error, "/api/submit");
    return NextResponse.json({ error: "Could not save that submission." }, { status: 500 });
  }
}
