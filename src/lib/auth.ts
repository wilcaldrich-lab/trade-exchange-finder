import { createHash, timingSafeEqual } from "crypto";

export function tokenMatches(provided: string | null | undefined, expected: string | undefined): boolean {
  if (!expected) return false;
  const actual = createHash("sha256").update(provided ?? "").digest();
  const wanted = createHash("sha256").update(expected).digest();
  return timingSafeEqual(actual, wanted);
}

export function bearerToken(header: string | null): string | null {
  if (!header) return null;
  const match = /^Bearer\s+(\S+)\s*$/i.exec(header);
  return match ? match[1] : null;
}
