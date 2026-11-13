import { Resend } from "resend";
import { fromAddress } from "@/lib/site";

function apiKey(): string | null {
  return process.env.RESEND_API_KEY || null;
}

function segmentId(): string | null {
  return process.env.RESEND_AUDIENCE_ID || null;
}

function alreadyThere(message: string | undefined): boolean {
  return /already exists|duplicate|already been added/i.test(message || "");
}

export async function addToAudience(email: string): Promise<{ ok: boolean; error?: string }> {
  const key = apiKey();
  const segment = segmentId();
  if (!key || !segment) return { ok: false, error: "Resend is not configured" };
  const resend = new Resend(key);
  const created = await resend.contacts.create({
    email,
    segments: [{ id: segment }],
  });
  if (!created.error) return { ok: true };
  if (!alreadyThere(created.error.message)) {
    return { ok: false, error: created.error.message || "Resend contact error" };
  }
  const added = await resend.contacts.segments.add({ email, segmentId: segment });
  if (!added.error || alreadyThere(added.error.message)) return { ok: true };
  return { ok: false, error: added.error.message || "Resend segment error" };
}

export async function sendConfirmEmail(email: string, link: string): Promise<{ ok: boolean; error?: string }> {
  const key = apiKey();
  if (!key) return { ok: false, error: "Resend is not configured" };
  const resend = new Resend(key);
  const result = await resend.emails.send({
    from: fromAddress(),
    to: email,
    subject: "Confirm your Trade Exchange Finder email",
    text: [
      "Confirm your email to hear when the directory changes.",
      "",
      link,
      "",
      "If you did not sign up, you can ignore this message.",
    ].join("\n"),
  });
  if (result.error) return { ok: false, error: result.error.message };
  return { ok: true };
}

export async function sendOwnerEmail(input: {
  id: number;
  subject: string;
  text: string;
  replyTo: string;
}): Promise<{ ok: boolean; error?: string }> {
  const key = apiKey();
  const recipients = [process.env.OWNER_EMAIL, process.env.BOT_EMAIL]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
  if (!key || recipients.length === 0) return { ok: false, error: "Mail is not configured" };
  const resend = new Resend(key);
  const result = await resend.emails.send(
    {
      from: fromAddress(),
      to: recipients,
      replyTo: input.replyTo,
      subject: input.subject,
      text: input.text,
    },
    { idempotencyKey: `sponsor-inquiry/${input.id}` },
  );
  if (result.error) return { ok: false, error: result.error.message };
  return { ok: true };
}

export async function createNewsletterDraft(input: {
  subject: string;
  html: string;
  name: string;
}): Promise<{ id: string } | { error: string }> {
  const key = apiKey();
  const segment = segmentId();
  if (!key || !segment) return { error: "Resend is not configured" };
  const resend = new Resend(key);
  const replyTo = process.env.OWNER_EMAIL?.trim();
  const draft = {
    name: input.name,
    from: fromAddress(),
    subject: input.subject,
    html: input.html,
    send: false as const,
    ...(replyTo ? { replyTo } : {}),
  };
  const created = await resend.broadcasts.create({ ...draft, segmentId: segment });
  if (!created.error && created.data?.id) return { id: created.data.id };

  const legacy = await resend.broadcasts.create({ ...draft, audienceId: segment });
  if (!legacy.error && legacy.data?.id) return { id: legacy.data.id };
  return { error: (legacy.error?.message || created.error?.message || "Could not create the draft").slice(0, 300) };
}
