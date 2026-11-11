import type { Exchange } from "@/lib/exchange";
import { escapeHtml } from "@/lib/format";
import { locationLine } from "@/lib/places";
import { absoluteUrl } from "@/lib/site";

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const current = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((current - start) / 86_400_000);
}

export function pickFive(entries: Exchange[], now = new Date()): Exchange[] {
  const pool = [...entries].filter((entry) => entry.slug && entry.name).sort((a, b) => a.slug.localeCompare(b.slug));
  if (pool.length <= 5) return pool;
  const start = dayOfYear(now) % pool.length;
  const picks: Exchange[] = [];
  const seen = new Set<string>();
  for (let step = 0; picks.length < 5 && step < pool.length * 2; step += 1) {
    const item = pool[(start + step * 7) % pool.length];
    if (!item || seen.has(item.slug)) continue;
    seen.add(item.slug);
    picks.push(item);
  }
  return picks;
}

export function oneLine(exchange: Exchange): string {
  const place = locationLine(exchange);
  return place === "Not published" ? exchange.name : `${exchange.name} — ${place}`;
}

export function newsletterHtml(input: {
  picks: Exchange[];
  sponsorName: string;
  sponsorHref: string;
}): string {
  const items = input.picks
    .map((exchange) => {
      const href = escapeHtml(absoluteUrl(`/exchange/${exchange.slug}`));
      const line = escapeHtml(oneLine(exchange));
      return `<li style="margin:0 0 14px;"><a href="${href}" style="color:#0f6a4e;">${line}</a></li>`;
    })
    .join("");
  const sponsor = escapeHtml(input.sponsorName);
  const sponsorHref = escapeHtml(input.sponsorHref);
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f4efe4;color:#1c1915;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:560px;margin:0 auto;">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;">Trade Exchange Finder</p>
    <h1 style="margin:0 0 12px;font-size:28px;font-weight:normal;line-height:1.2;">Five exchanges worth a look</h1>
    <p style="margin:0 0 18px;font-size:16px;line-height:1.45;">A short list from the public directory. A fee or member count is included on the site only when that exchange published it.</p>
    <ol style="margin:0 0 20px;padding-left:20px;font-size:17px;line-height:1.4;">
      ${items}
    </ol>
    <p style="margin:0 0 20px;font-size:16px;">Sponsored by <a href="${sponsorHref}" style="color:#0f6a4e;">${sponsor}</a></p>
    <p style="margin:0;font-size:13px;line-height:1.4;"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#5c564c;">Unsubscribe</a></p>
  </div>
</body>
</html>`;
}
