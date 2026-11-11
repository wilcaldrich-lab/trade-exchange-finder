import { NextResponse } from "next/server";
import { adminDenied } from "@/lib/admin";
import { databaseUrl, logError } from "@/lib/db";
import { getAdminStats } from "@/lib/stats";

export async function GET(request: Request) {
  const denied = adminDenied(request);
  if (denied) return denied;
  if (!databaseUrl()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    return NextResponse.json(await getAdminStats());
  } catch (error) {
    await logError(error, "/api/admin/stats");
    return NextResponse.json({ error: "Could not load stats." }, { status: 500 });
  }
}
