export type Exchange = {
  name: string;
  slug: string;
  website: string | null;
  city: string | null;
  state_region: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  networks: string[];
  description: string | null;
  cash_fee_percent: number | null;
  monthly_dues: string | null;
  annual_dues: string | null;
  joining_fee: string | null;
  fees_notes: string | null;
  approx_member_count: number | null;
  member_count_notes: string | null;
  year_founded: number | null;
  source_urls: string[];
  website_http_status: number | null;
  last_checked: string | null;
};

export type ExchangeView = Exchange & {
  state_slug: string | null;
  country_slug: string | null;
};

const NETWORKS = ["IRTA", "NATE", "UC", "BANC"] as const;

export function publishesFees(exchange: Pick<
  Exchange,
  "cash_fee_percent" | "monthly_dues" | "annual_dues" | "joining_fee" | "fees_notes"
>): boolean {
  return (
    exchange.cash_fee_percent !== null ||
    Boolean(exchange.monthly_dues || exchange.annual_dues || exchange.joining_fee || exchange.fees_notes)
  );
}

function text(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : null;
}

function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(String(value).replace(/%$/, "").trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function integerOrNull(value: unknown): number | null {
  const parsed = numberOrNull(value);
  if (parsed === null) return null;
  return Math.trunc(parsed);
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const items: string[] = [];
  for (const entry of value) {
    const item = text(entry);
    if (!item || seen.has(item)) continue;
    seen.add(item);
    items.push(item);
  }
  return items;
}

export function toExchange(raw: Record<string, unknown>): Exchange | null {
  const name = text(raw.name);
  const slug = text(raw.slug);
  if (!name || !slug) return null;
  return {
    name,
    slug,
    website: text(raw.website),
    city: text(raw.city),
    state_region: text(raw.state_region),
    country: text(raw.country)?.toUpperCase() ?? null,
    phone: text(raw.phone),
    email: text(raw.email),
    networks: stringList(raw.networks),
    description: text(raw.description),
    cash_fee_percent: numberOrNull(raw.cash_fee_percent),
    monthly_dues: text(raw.monthly_dues),
    annual_dues: text(raw.annual_dues),
    joining_fee: text(raw.joining_fee),
    fees_notes: text(raw.fees_notes),
    approx_member_count: integerOrNull(raw.approx_member_count),
    member_count_notes: text(raw.member_count_notes),
    year_founded: integerOrNull(raw.year_founded),
    source_urls: stringList(raw.source_urls),
    website_http_status: integerOrNull(raw.website_http_status),
    last_checked: text(raw.last_checked),
  };
}

export function exchangesFromUnknown(raw: unknown): Exchange[] {
  const list =
    raw && typeof raw === "object" && "exchanges" in raw
      ? (raw as { exchanges: unknown }).exchanges
      : raw;
  if (!Array.isArray(list)) return [];
  const exchanges: Exchange[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const exchange = toExchange(item as Record<string, unknown>);
    if (exchange) exchanges.push(exchange);
  }
  return exchanges.sort((a, b) => a.name.localeCompare(b.name));
}

export function knownNetwork(value: string): boolean {
  return (NETWORKS as readonly string[]).includes(value);
}

export const NETWORK_OPTIONS = NETWORKS;
