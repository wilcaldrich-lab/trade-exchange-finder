import { NextResponse } from "next/server";
import { adminDenied } from "@/lib/admin";
import { databaseUrl, logError, query } from "@/lib/db";

export async function GET(request: Request) {
  const denied = adminDenied(request);
  if (denied) return denied;
  if (!databaseUrl()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const searches = await query(
      `SELECT id, query, filters, created_at
       FROM zero_result_searches
       ORDER BY created_at DESC
       LIMIT 100`,
    );
    return NextResponse.json({ searches });
  } catch (error) {
    await logError(error, "/api/admin/searches");
    return NextResponse.json({ error: "Could not load searches." }, { status: 500 });
  }
}
