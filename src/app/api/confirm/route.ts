import { readConfirmToken } from "@/lib/confirm";
import { databaseUrl, logError, query } from "@/lib/db";
import { addToAudience } from "@/lib/resend-mail";
import { siteUrl } from "@/lib/site";

function page(title: string, message: string, status: number) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;background:#080a10;color:#e8eef7;font-family:Georgia,serif">
  <main style="max-width:36rem;margin:0 auto;padding:4rem 1rem">
    <p style="letter-spacing:.16em;text-transform:uppercase;color:#f0d24a;font-size:.7rem">Trade Exchange Finder</p>
    <h1 style="font-size:2.4rem;line-height:1;margin:.5rem 0 0">${title}</h1>
    <p style="color:#a7b3c7;line-height:1.5">${message}</p>
    <p><a href="${siteUrl()}/" style="color:#2ee0cc">Back to the directory</a></p>
  </main>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
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
