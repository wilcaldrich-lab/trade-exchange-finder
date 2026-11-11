export async function readJson(request: Request): Promise<Record<string, unknown> | { error: string }> {
  let text = "";
  try {
    text = await request.text();
  } catch {
    return { error: "Could not read the request." };
  }
  if (text.length > 50_000) return { error: "That request is too large." };
  if (!text.trim()) return {};
  try {
    const parsed = JSON.parse(text) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { error: "Expected a JSON object." };
    return parsed as Record<string, unknown>;
  } catch {
    return { error: "Expected JSON." };
  }
}

export function isReadError(value: Record<string, unknown> | { error: string }): value is { error: string } {
  return Object.keys(value).length === 1 && "error" in value && typeof value.error === "string";
}
