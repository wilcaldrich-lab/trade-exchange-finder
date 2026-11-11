export function siteUrl(): string {
  const raw = process.env.SITE_URL || "https://barterexchanges.org";
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export const HOUSE_SPONSOR_SLUG = "your-exchange-here";

export function fromAddress(): string {
  const raw = (process.env.FROM_EMAIL || "hello@barterexchanges.org").trim();
  if (raw.includes("<")) return raw;
  return `Trade Exchange Finder <${raw}>`;
}
