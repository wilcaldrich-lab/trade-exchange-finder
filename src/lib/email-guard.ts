const DISPOSABLE_SUFFIXES = [
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "guerrillamail.biz",
  "guerrillamail.de",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "sharklasers.com",
  "grr.la",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "tempmail.com",
  "temp-mail.org",
  "temp-mail.io",
  "10minutemail.com",
  "10minutemail.net",
  "trashmail.com",
  "trashmail.de",
  "trashmail.org",
  "dispostable.com",
  "getnada.com",
  "nada.email",
  "maildrop.cc",
  "fakeinbox.com",
  "throwawaymail.com",
  "mailnesia.com",
  "mailcatch.com",
  "spam4.me",
  "tempinbox.com",
  "moakt.com",
  "emailondeck.com",
  "mintemail.com",
  "mytemp.email",
  "tmpmail.org",
  "tmpmail.net",
  "discard.email",
  "inboxkitten.com",
  "getairmail.com",
  "burnermail.io",
  "mailforspam.com",
  "spamgourmet.com",
  "mailnull.com",
  "mailinator.org",
  "example.com",
  "example.org",
  "example.net",
  "example.edu",
];

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function domainBlocked(domain: string): boolean {
  return DISPOSABLE_SUFFIXES.some((suffix) => domain === suffix || domain.endsWith(`.${suffix}`));
}

export function emailBlockReason(value: string): string | null {
  const email = normalizeEmail(value);
  if (email.length > 254 || !EMAIL_RE.test(email)) return "Enter a valid email address.";
  const [local, domain] = email.split("@");
  if (!local || !domain) return "Enter a valid email address.";
  if (local === "test" || local.startsWith("test+") || email.startsWith("test@")) {
    return "Use a real business email address.";
  }
  if (domainBlocked(domain) || domain.endsWith(".invalid") || domain.endsWith(".test")) {
    return "That email domain cannot be added.";
  }
  return null;
}
