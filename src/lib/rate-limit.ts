type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit = 8, windowMs = 60_000): boolean {
  const now = Date.now();
  if (buckets.size > 5000) buckets.clear();
  const current = buckets.get(key);
  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim().slice(0, 64) || "unknown";
  return request.headers.get("x-real-ip")?.slice(0, 64) || "unknown";
}

export function honeypotFilled(body: Record<string, unknown>): boolean {
  const value = body.company_fax;
  return typeof value === "string" && value.trim().length > 0;
}
