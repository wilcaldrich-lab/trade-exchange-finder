import { NextResponse } from "next/server";
import { adminDenied } from "@/lib/admin";
import { databaseUrl, logError, query } from "@/lib/db";
import { addToAudience } from "@/lib/resend-mail";

export async function POST(request: Request) {
  const denied = adminDenied(request);
  if (denied) return denied;
  if (!databaseUrl()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const rows = await query<{ email: string }>(
      `SELECT email FROM signups
       WHERE confirmed = true AND synced_at IS NULL
       ORDER BY id ASC`,
    );
    let synced = 0;
    let failed = 0;
    for (const row of rows) {
      const result = await addToAudience(row.email);
      if (result.ok) {
        await query("UPDATE signups SET synced_at = now() WHERE email = $1", [row.email]);
        synced += 1;
      } else {
        failed += 1;
        await logError(new Error(result.error || "Resync failed"), "/api/admin/resync-signups");
      }
    }
    return NextResponse.json({ ok: true, synced, failed });
  } catch (error) {
    await logError(error, "/api/admin/resync-signups");
    return NextResponse.json({ error: "Could not resync signups." }, { status: 500 });
  }
}
