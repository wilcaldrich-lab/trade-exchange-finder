export function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.username || url.password) return false;
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function safeRedirectTarget(value: string, origin: string): URL | null {
  if (value.startsWith("/") && !value.startsWith("//")) {
    // Backslash and whitespace are URL-parser escapes that can leave the origin.
    if (/[\\\s\u0000]/.test(value)) return null;
    try {
      const url = new URL(value, origin);
      if (url.origin !== new URL(origin).origin) return null;
      return url;
    } catch {
      return null;
    }
  }
  if (!isSafeHttpUrl(value)) return null;
  return new URL(value);
}

export function cleanPath(raw: string | null | undefined): string {
  if (!raw) return "/";
  const path = raw.split("?")[0]?.split("#")[0] || "/";
  if (!path.startsWith("/") || path.startsWith("//")) return "/";
  return path.slice(0, 200);
}

export function cleanReferrer(raw: string | null | undefined): string {
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return `${url.origin}${url.pathname}`.slice(0, 200);
  } catch {
    return "";
  }
}

export function websiteLabel(value: string): string {
  try {
    return new URL(value).host.replace(/^www\./, "");
  } catch {
    return value;
  }
}
