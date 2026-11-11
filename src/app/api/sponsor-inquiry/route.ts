import { NextResponse } from "next/server";
import { databaseUrl, logError, query } from "@/lib/db";
import { emailBlockReason, normalizeEmail } from "@/lib/email-guard";
import { isReadError, readJson } from "@/lib/http";
import { clientIp, honeypotFilled, rateLimit } from "@/lib/rate-limit";
import { sendOwnerEmail } from "@/lib/resend-mail";

const OFFERS = new Set(["state-feature", "newsletter", "both", "question"]);

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    if (isReadError(body)) return NextResponse.json({ error: body.error }, { status: 400 });
    if (!rateLimit(`sponsor:${clientIp(request)}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Wait a minute and try again." }, { status: 429 });
    }
    if (honeypotFilled(body)) return NextResponse.json({ ok: true });
    const name = text(body.name, 120);
    const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
    const emailReason = emailBlockReason(email);
    const offer = typeof body.offer === "string" && OFFERS.has(body.offer) ? body.offer : null;
    const message = text(body.message, 4000);
    if (!name) return NextResponse.json({ error: "Your name is required." }, { status: 400 });
    if (emailReason) return NextResponse.json({ error: emailReason }, { status: 400 });
    if (!offer) return NextResponse.json({ error: "Choose an offer." }, { status: 400 });
    if (!message) return NextResponse.json({ error: "Add a short note." }, { status: 400 });
    if (!databaseUrl()) {
      return NextResponse.json({ error: "Inquiries are unavailable until the database is connected." }, { status: 503 });
    }

    const inserted = await query<{ id: string }>(
      `INSERT INTO sponsor_inquiries (name, email, exchange_name, offer, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id::text`,
      [name, email, text(body.exchange_name, 200), offer, message],
    );
    const id = Number(inserted[0]?.id || 0);
    const mailed = await sendOwnerEmail({
      id,
      replyTo: email,
      subject: `Sponsor inquiry: ${offer}`,
      text: [`From: ${name} <${email}>`, `Exchange: ${text(body.exchange_name, 200) || "Not provided"}`, `Offer: ${offer}`, "", message].join("\n"),
    });
    if (!mailed.ok) await logError(new Error(mailed.error || "Sponsor email failed"), "/api/sponsor-inquiry");
    return NextResponse.json({ ok: true, emailed: mailed.ok });
  } catch (error) {
    await logError(error, "/api/sponsor-inquiry");
    return NextResponse.json({ error: "Could not save that inquiry." }, { status: 500 });
  }
}
