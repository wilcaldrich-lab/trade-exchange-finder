type Bucket = { count: number; resetAt: number; blocked: boolean };
type HeaderSource = { get(name: string): string | null };

const buckets = new Map<string, Bucket>();

function prune(protect: string, now: number) {
  if (buckets.size <= 5000) return;
  for (const [name, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(name);
  }
  if (buckets.size <= 5000) return;
  for (const [name, bucket] of buckets) {
    if (name === protect || bucket.blocked) continue;
    buckets.delete(name);
    if (buckets.size <= 4000) return;
  }
}

export function rateLimit(key: string, limit = 8, windowMs = 60_000, now = Date.now()): boolean {
  prune(key, now);
  const current = buckets.get(key);
  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs, blocked: false });
    return true;
  }
  if (current.count >= limit) {
    current.blocked = true;
    return false;
  }
  current.count += 1;
  if (current.count >= limit) current.blocked = true;
  return true;
}

function firstIp(value: string | null): string | null {
  const ip = value?.split(",")[0]?.trim();
  return ip ? ip.slice(0, 64) : null;
}

/** Prefer the platform client IP. The first X-Forwarded-For hop can be spoofed. */
export function clientIpFromHeaders(headers: HeaderSource): string {
  return (
    firstIp(headers.get("x-vercel-forwarded-for")) ||
    firstIp(headers.get("x-real-ip")) ||
    firstIp(headers.get("x-forwarded-for")) ||
    "unknown"
  );
}

export function clientIp(request: Request): string {
  return clientIpFromHeaders(request.headers);
}

export function honeypotFilled(body: Record<string, unknown>): boolean {
  const value = body.company_fax;
  return typeof value === "string" && value.trim().length > 0;
}
