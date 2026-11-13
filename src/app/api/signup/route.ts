import { NextResponse } from "next/server";
import { signConfirmToken } from "@/lib/confirm";
import { databaseUrl, logError, query } from "@/lib/db";
import { emailBlockReason, normalizeEmail } from "@/lib/email-guard";
import { isReadError, readJson } from "@/lib/http";
import { clientIp, honeypotFilled, rateLimit } from "@/lib/rate-limit";
import { sendConfirmEmail } from "@/lib/resend-mail";
import { siteUrl } from "@/lib/site";

function cleanSource(value: unknown): string {
  const source = typeof value === "string" ? value : "home";
  if (source === "home" || source === "footer" || source === "sponsor") return source;
  if (/^exchange:[a-z0-9-]{1,80}$/.test(source)) return source;
  return "home";
}

function savedButNotMailed(warning: string) {
  return NextResponse.json({ ok: true, saved: true, mailed: false, warning });
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    if (isReadError(body)) return NextResponse.json({ error: body.error }, { status: 400 });
    if (!rateLimit(`signup:${clientIp(request)}`, 6, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Wait a minute and try again." }, { status: 429 });
    }
    if (honeypotFilled(body)) return NextResponse.json({ ok: true });
    const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
    const reason = emailBlockReason(email);
    if (reason) return NextResponse.json({ error: reason }, { status: 400 });
    if (!databaseUrl()) {
      return NextResponse.json({ error: "Signups are unavailable until the database is connected." }, { status: 503 });
    }
    const rows = await query<{ confirmed: boolean }>(
      `INSERT INTO signups (email, source, confirmed)
       VALUES ($1, $2, false)
       ON CONFLICT (email) DO UPDATE SET source = signups.source
       RETURNING confirmed`,
      [email, cleanSource(body.source)],
    );
    if (rows[0]?.confirmed) return NextResponse.json({ ok: true, saved: true, confirmed: true });
    const token = signConfirmToken(email);
    if (!token) {
      await logError(new Error("CONFIRM_SECRET or ADMIN_TOKEN is not set"), "/api/signup");
      return savedButNotMailed("We saved your email, but the confirmation message could not be sent.");
    }
    const link = `${siteUrl()}/api/confirm?token=${encodeURIComponent(token)}`;
    const mailed = await sendConfirmEmail(email, link);
    if (!mailed.ok) {
      await logError(new Error(mailed.error || "Confirm email failed"), "/api/signup");
      return savedButNotMailed("We saved your email, but the confirmation message could not be sent. Try again in a minute.");
    }
    return NextResponse.json({ ok: true, saved: true, mailed: true });
  } catch (error) {
    await logError(error, "/api/signup");
    return NextResponse.json({ error: "Could not save that signup." }, { status: 500 });
  }
}
