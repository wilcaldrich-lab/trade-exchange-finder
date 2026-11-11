import { Resend } from "resend";
import { fromAddress } from "@/lib/site";

function configured(): { apiKey: string; audienceId: string } | null {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return null;
  return { apiKey, audienceId };
}

export async function addToAudience(email: string): Promise<{ ok: boolean; error?: string }> {
  const config = configured();
  if (!config) return { ok: false, error: "Resend is not configured" };
  const resend = new Resend(config.apiKey);
  const segmented = await resend.contacts.create({
    email,
    segments: [{ id: config.audienceId }],
  });
  if (!segmented.error) return { ok: true };
  if (/already exists|duplicate/i.test(segmented.error.message || "")) return { ok: true };

  const legacy = await resend.contacts.create({
    email,
    audienceId: config.audienceId,
  });
  const message = legacy.error?.message || segmented.error.message || "Resend contact error";
  if (!legacy.error || /already exists|duplicate/i.test(message)) return { ok: true };
  return { ok: false, error: message };
}

export async function sendOwnerEmail(input: {
  id: number;
  subject: string;
  text: string;
  replyTo: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipients = [process.env.OWNER_EMAIL, process.env.BOT_EMAIL]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
  if (!apiKey || recipients.length === 0) return { ok: false, error: "Mail is not configured" };
  const resend = new Resend(apiKey);
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
  const config = configured();
  if (!config) return { error: "Resend is not configured" };
  const resend = new Resend(config.apiKey);
  const draft = {
    name: input.name,
    from: fromAddress(),
    subject: input.subject,
    html: input.html,
    send: false as const,
  };
  const created = await resend.broadcasts.create({ ...draft, segmentId: config.audienceId });
  if (!created.error && created.data?.id) return { id: created.data.id };

  const legacy = await resend.broadcasts.create({ ...draft, audienceId: config.audienceId });
  if (!legacy.error && legacy.data?.id) return { id: legacy.data.id };
  return { error: (legacy.error?.message || created.error?.message || "Could not create the draft").slice(0, 300) };
}
