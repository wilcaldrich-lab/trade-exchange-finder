import { NextResponse } from "next/server";
import { bearerToken, tokenMatches } from "@/lib/auth";

export function adminDenied(request: Request): NextResponse | null {
  const token = bearerToken(request.headers.get("authorization"));
  if (!tokenMatches(token, process.env.ADMIN_TOKEN)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
