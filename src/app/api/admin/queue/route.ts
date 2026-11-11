import { NextResponse } from "next/server";
import { adminDenied } from "@/lib/admin";
import { databaseUrl, logError, query } from "@/lib/db";

export async function GET(request: Request) {
  const denied = adminDenied(request);
  if (denied) return denied;
  if (!databaseUrl()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const submissions = await query(
      `SELECT id, kind, exchange_slug, payload, status, submitter_name, submitter_email, notes, created_at
       FROM submissions
       WHERE status = 'pending'
       ORDER BY created_at ASC
       LIMIT 100`,
    );
    return NextResponse.json({ submissions });
  } catch (error) {
    await logError(error, "/api/admin/queue");
    return NextResponse.json({ error: "Could not load the queue." }, { status: 500 });
  }
}
