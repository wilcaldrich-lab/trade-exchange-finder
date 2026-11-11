import { NextResponse } from "next/server";
import { databaseUrl, logError, query } from "@/lib/db";
import { emailBlockReason, normalizeEmail } from "@/lib/email-guard";
import { isReadError, readJson } from "@/lib/http";
import { clientIp, honeypotFilled, rateLimit } from "@/lib/rate-limit";
import { addToAudience } from "@/lib/resend-mail";

function cleanSource(value: unknown): string {
  const source = typeof value === "string" ? value : "home";
  if (source === "home" || source === "footer" || source === "sponsor") return source;
  if (/^exchange:[a-z0-9-]{1,80}$/.test(source)) return source;
  return "home";
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
    await query("INSERT INTO signups (email, source) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING", [
      email,
      cleanSource(body.source),
    ]);
    const synced = await addToAudience(email);
    if (!synced.ok) await logError(new Error(synced.error || "Resend signup failed"), "/api/signup");
    return NextResponse.json({ ok: true });
  } catch (error) {
    await logError(error, "/api/signup");
    return NextResponse.json({ error: "Could not save that signup." }, { status: 500 });
  }
}
