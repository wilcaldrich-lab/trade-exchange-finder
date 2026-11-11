export const NOT_PUBLISHED = "Not published";

export function published(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return NOT_PUBLISHED;
  const text = String(value).trim();
  return text.length ? text : NOT_PUBLISHED;
}

export function formatCashFee(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return NOT_PUBLISHED;
  const rounded = Math.round(value * 100) / 100;
  const text = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return `${text}%`;
}

export function formatCount(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return NOT_PUBLISHED;
  return Math.trunc(value).toLocaleString("en-US");
}

export function formatDate(iso: string | null): string {
  if (!iso) return NOT_PUBLISHED;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function scrubSecrets(value: string): string {
  return value.replace(/postgres(?:ql)?:\/\/\S+/gi, "postgres://[redacted]");
}
