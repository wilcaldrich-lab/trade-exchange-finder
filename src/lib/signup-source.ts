const PAGE_SOURCE = /^(exchange|country|state):[a-z0-9-]{1,80}$/;

/** Keep the stored signup source to known pages. Unknown values stay "home". */
export function cleanSource(value: unknown): string {
  const source = typeof value === "string" ? value : "home";
  if (source === "home" || source === "footer" || source === "sponsor") return source;
  if (PAGE_SOURCE.test(source)) return source;
  return "home";
}
