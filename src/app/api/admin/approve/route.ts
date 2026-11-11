import { NextResponse } from "next/server";
import { adminDenied } from "@/lib/admin";
import { databaseUrl, logError } from "@/lib/db";
import { isReadError, readJson } from "@/lib/http";
import { ReviewError, reviewSubmission } from "@/lib/submissions";

export async function POST(request: Request) {
  const denied = adminDenied(request);
  if (denied) return denied;
  if (!databaseUrl()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const body = await readJson(request);
    if (isReadError(body)) return NextResponse.json({ error: body.error }, { status: 400 });
    const id = typeof body.id === "number" ? body.id : Number(body.id);
    const action = body.action === "approve" || body.action === "reject" ? body.action : null;
    if (!Number.isInteger(id) || id < 1 || !action) {
      return NextResponse.json({ error: "Send an id and action of approve or reject." }, { status: 400 });
    }
    const result = await reviewSubmission(id, action);
    return NextResponse.json({ ok: true, id, ...result });
  } catch (error) {
    if (error instanceof ReviewError) return NextResponse.json({ error: error.message }, { status: error.status });
    await logError(error, "/api/admin/approve");
    return NextResponse.json({ error: "Could not review that submission." }, { status: 500 });
  }
}
