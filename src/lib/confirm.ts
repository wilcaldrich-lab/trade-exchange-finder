import { createHmac, timingSafeEqual } from "crypto";
import { normalizeEmail } from "@/lib/email-guard";

const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

export function confirmSecret(): string | null {
  return process.env.CONFIRM_SECRET || process.env.ADMIN_TOKEN || null;
}

export function signConfirmToken(email: string, now = Date.now()): string | null {
  const secret = confirmSecret();
  if (!secret) return null;
  const payload = Buffer.from(JSON.stringify({ e: normalizeEmail(email), x: now + TEN_DAYS_MS }), "utf8").toString(
    "base64url",
  );
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function readConfirmToken(token: string, now = Date.now()): string | null {
  const secret = confirmSecret();
  if (!secret) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const actual = Buffer.from(sig);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length || !timingSafeEqual(actual, wanted)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { e?: unknown; x?: unknown };
    if (typeof data.e !== "string" || typeof data.x !== "number" || data.x < now) return null;
    const email = normalizeEmail(data.e);
    return email.includes("@") ? email : null;
  } catch {
    return null;
  }
}
