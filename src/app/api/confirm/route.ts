import { readConfirmToken } from "@/lib/confirm";
import { databaseUrl, logError, query } from "@/lib/db";
import { escapeHtml } from "@/lib/format";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { addToAudience } from "@/lib/resend-mail";
import { siteUrl } from "@/lib/site";

function page(title: string, message: string, status: number, formToken?: string) {
  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  const home = escapeHtml(`${siteUrl()}/`);
  const form = formToken
    ? `<form method="post" action="/api/confirm" style="margin:1.5rem 0">
        <input type="hidden" name="token" value="${escapeHtml(formToken)}">
        <button type="submit" style="height:3rem;border:1px solid #e7ffab;border-radius:2px;background:#b6ff3c;color:#071208;font-family:ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;padding:0 1rem;cursor:pointer">Confirm email</button>
      </form>`
    : "";
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle}</title>
</head>
<body style="margin:0;background:#05060a;color:#e9f6ef;font-family:Georgia,serif;background-image:linear-gradient(rgba(57,240,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(57,240,255,.05) 1px,transparent 1px);background-size:40px 40px">
  <main style="max-width:36rem;margin:0 auto;padding:4rem 1rem">
    <p style="letter-spacing:.16em;text-transform:uppercase;color:#39f0ff;font-size:.7rem;font-family:ui-monospace,monospace">[ Trade Exchange Finder ]</p>
    <h1 style="font-size:2.4rem;line-height:1.15;margin:.5rem 0 0">${safeTitle}</h1>
    <p style="color:#b7c6ce;line-height:1.5">${safeMessage}</p>
    ${form}
    <p><a href="${home}" style="color:#b6ff3c">Back to the directory</a></p>
  </main>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

async function tokenFrom(request: Request): Promise<string> {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    try {
      const body = (await request.json()) as { token?: unknown };
      return typeof body.token === "string" ? body.token : "";
    } catch {
      return "";
    }
  }
  if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
    try {
      const form = await request.formData();
      const token = form.get("token");
      return typeof token === "string" ? token : "";
    } catch {
      return "";
    }
  }
  return new URL(request.url).searchParams.get("token") || "";
}

async function confirm(request: Request, token: string) {
  if (!rateLimit(`confirm:${clientIp(request)}`, 10, 60_000)) {
    return page("Too many tries", "Wait a minute and open the confirmation link again.", 429);
  }
  const email = readConfirmToken(token);
  if (!email) return page("Link not valid", "This confirmation link is invalid or expired.", 400);
  if (!databaseUrl()) return page("Not available", "Signups are unavailable until the database is connected.", 503);
  try {
    const rows = await query<{ email: string }>("SELECT email FROM signups WHERE email = $1", [email]);
    if (!rows[0]) return page("Not on the list", "That email is not waiting to be confirmed.", 404);
    await query("UPDATE signups SET confirmed = true WHERE email = $1", [email]);
    const synced = await addToAudience(email);
    if (synced.ok) {
      await query("UPDATE signups SET synced_at = now() WHERE email = $1", [email]);
      return page("You're confirmed", "We'll send a short note when the directory changes. Unsubscribe anytime.", 200);
    }
    await logError(new Error(synced.error || "Resend signup failed"), "/api/confirm");
    return page(
      "Confirmed, list update pending",
      "Your email is confirmed. Adding it to the mailing list failed, and we'll retry.",
      200,
    );
  } catch (error) {
    await logError(error, "/api/confirm");
    return page("Could not confirm", "We could not confirm that email. Try the link again in a minute.", 500);
  }
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const email = readConfirmToken(token);
  if (!email) return page("Link not valid", "This confirmation link is invalid or expired.", 400);
  if (!databaseUrl()) return page("Not available", "Signups are unavailable until the database is connected.", 503);
  try {
    const rows = await query<{ email: string }>("SELECT email FROM signups WHERE email = $1", [email]);
    if (!rows[0]) return page("Not on the list", "That email is not waiting to be confirmed.", 404);
  } catch (error) {
    await logError(error, "/api/confirm");
    return page("Could not confirm", "We could not open that confirmation link. Try it again in a minute.", 500);
  }
  return page(
    "Confirm your email",
    "Press the button to join the list. Opening this page does not confirm the address.",
    200,
    token,
  );
}

export async function POST(request: Request) {
  return confirm(request, await tokenFrom(request));
}
