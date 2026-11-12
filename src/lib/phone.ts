const CALLING_CODES: Record<string, string> = {
  US: "1",
  CA: "1",
  TH: "66",
  GB: "44",
  SG: "65",
  IT: "39",
  BR: "55",
  BE: "32",
};

/** tel: link that keeps a leading plus, or adds the country's calling code. */
export function telHref(phone: string, country: string | null | undefined): string {
  const compact = phone.trim();
  const hasPlus = compact.startsWith("+");
  let digits = compact.replace(/\D/g, "");
  if (!digits) return "tel:";
  if (hasPlus) return `tel:+${digits}`;
  const code = country ? CALLING_CODES[country.toUpperCase()] : undefined;
  if (!code) return `tel:+${digits}`;
  digits = digits.replace(/^0+/, "");
  if (digits.startsWith(code) && digits.length > code.length + 6) return `tel:+${digits}`;
  return `tel:+${code}${digits}`;
}
