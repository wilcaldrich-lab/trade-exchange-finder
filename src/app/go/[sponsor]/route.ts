import { NextResponse } from "next/server";
import { logError } from "@/lib/db";
import { HOUSE_SPONSOR_SLUG, siteUrl } from "@/lib/site";
import { getSponsorBySlug, logSponsorClick } from "@/lib/sponsors";
import { cleanReferrer, safeRedirectTarget } from "@/lib/urls";

type Params = { params: Promise<{ sponsor: string }> };

function appOrigin(request: Request): string {
  const url = new URL(request.url);
  const forwarded = (request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host)
    .split(",")[0]
    ?.trim();
  const host = forwarded || url.host;
  const hostname = host.split(":")[0].toLowerCase();
  const trusted =
    hostname === "barterexchanges.org" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".vercel.app");
  if (!trusted) return siteUrl();
  const proto =
    hostname === "barterexchanges.org" ? "https" : request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  return `${proto}://${host}`;
}

export async function GET(request: Request, { params }: Params) {
  const { sponsor } = await params;
  const slug = sponsor.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 80);
  const origin = appOrigin(request);
  try {
    if (slug === HOUSE_SPONSOR_SLUG) {
      await logSponsorClick(slug, cleanReferrer(request.headers.get("referer")));
      const response = NextResponse.redirect(new URL("/sponsor", origin), 302);
      response.headers.set("Cache-Control", "no-store");
      return response;
    }
    const row = slug ? await getSponsorBySlug(slug) : null;
    if (!row) return new NextResponse("Not found", { status: 404 });
    const target = safeRedirectTarget(row.destination_url, origin);
    if (!target) {
      await logError(new Error(`Unsafe sponsor URL for ${slug}`), `/go/${slug}`);
      return new NextResponse("Sponsor link is unavailable", { status: 404 });
    }
    await logSponsorClick(slug, cleanReferrer(request.headers.get("referer")));
    const response = NextResponse.redirect(target, 302);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    await logError(error, `/go/${slug || "unknown"}`);
    return new NextResponse("Sponsor link is unavailable", { status: 500 });
  }
}
