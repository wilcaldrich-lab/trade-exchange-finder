import { NextResponse } from "next/server";
import { adminDenied } from "@/lib/admin";
import { getExchanges } from "@/lib/catalog";
import { logError } from "@/lib/db";
import { newsletterHtml, pickFive } from "@/lib/newsletter";
import { createNewsletterDraft } from "@/lib/resend-mail";
import { absoluteUrl, HOUSE_SPONSOR_SLUG } from "@/lib/site";
import { getNewsletterSponsor } from "@/lib/sponsors";

export async function POST(request: Request) {
  const denied = adminDenied(request);
  if (denied) return denied;
  try {
    const exchanges = await getExchanges();
    const picks = pickFive(exchanges);
    if (!picks.length) return NextResponse.json({ error: "No exchanges are available for a draft." }, { status: 400 });
    const sponsor = await getNewsletterSponsor();
    const html = newsletterHtml({
      picks,
      sponsorName: sponsor?.name || "Your exchange here",
      sponsorHref: absoluteUrl(`/go/${sponsor?.slug || HOUSE_SPONSOR_SLUG}`),
    });
    const today = new Date().toISOString().slice(0, 10);
    const draft = await createNewsletterDraft({
      name: `Trade Exchange Finder ${today}`,
      subject: "Five barter exchanges worth a look",
      html,
    });
    if ("error" in draft) return NextResponse.json({ error: draft.error }, { status: 502 });
    return NextResponse.json({ id: draft.id, picks: picks.map((pick) => pick.slug) });
  } catch (error) {
    await logError(error, "/api/admin/newsletter/draft");
    return NextResponse.json({ error: "Could not create the newsletter draft." }, { status: 500 });
  }
}
