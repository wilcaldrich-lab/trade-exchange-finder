import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REDIRECT_HOSTS = new Set([
  "www.barterexchanges.org",
  "tradeexchangefinder.com",
  "www.tradeexchangefinder.com",
]);

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase().split(":")[0];
  if (REDIRECT_HOSTS.has(host)) {
    const destination = new URL(request.nextUrl.pathname + request.nextUrl.search, "https://barterexchanges.org");
    return NextResponse.redirect(destination, 308);
  }

  const requestHeaders = new Headers(request.headers);
  const path = request.nextUrl.pathname;
  requestHeaders.set("x-pathname", path);
  const isPage = !path.startsWith("/api") && !path.startsWith("/go");
  const purpose = `${request.headers.get("purpose") || ""} ${request.headers.get("sec-purpose") || ""}`.toLowerCase();
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("next-router-segment-prefetch") === "1" ||
    purpose.includes("prefetch");
  const dest = request.headers.get("sec-fetch-dest");
  const isRsc = request.headers.get("rsc") === "1";
  const count = isPage && !isPrefetch && (dest === "document" || dest === null || isRsc);
  requestHeaders.set("x-count-view", count ? "1" : "0");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:png|svg|jpg|jpeg|gif|webp|ico)$).*)"],
};
