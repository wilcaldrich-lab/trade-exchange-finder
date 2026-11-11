"use client";

import { useState, type FormEvent } from "react";

const inputClass = "h-12 w-full rounded-md border border-line bg-card px-3 text-base";

export function SponsorForm() {
  const [fax, setFax] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setPending(true);
    setError("");
    setMessage("");
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/sponsor-inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          exchange_name: form.get("exchange_name"),
          offer: form.get("offer"),
          message: form.get("message"),
          company_fax: fax,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; emailed?: boolean };
      if (!response.ok) {
        setError(data.error || "Could not save that note.");
        return;
      }
      setMessage(
        data.emailed
          ? "Saved. We sent it to the owner."
          : "Saved. Email delivery is not confirmed yet, and the inquiry is in the database.",
      );
      formElement.reset();
    } catch {
      setError("Could not save that note.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <h2 className="font-display text-3xl">Get in touch</h2>
      <p className="text-sm text-muted">No checkout. Tell us which offer you want and where the exchange is based.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold">
          Name
          <input name="name" required autoComplete="name" className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold">
          Email
          <input name="email" type="email" required autoComplete="email" className={`${inputClass} mt-1 font-normal`} />
        </label>
      </div>
      <label className="text-sm font-bold">
        Exchange
        <input name="exchange_name" className={`${inputClass} mt-1 font-normal`} />
      </label>
      <label className="text-sm font-bold">
        Offer
        <select name="offer" required defaultValue="state-feature" className={`${inputClass} mt-1 font-normal`}>
          <option value="state-feature">Featured listing on a state page — $49/month</option>
          <option value="newsletter">Newsletter sponsor slot — $25/week</option>
          <option value="both">Both</option>
          <option value="question">A question before I decide</option>
        </select>
      </label>
      <label className="text-sm font-bold">
        Message
        <textarea name="message" required rows={5} className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2 font-normal" />
      </label>
      <label className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
        Fax
        <input tabIndex={-1} autoComplete="off" value={fax} onChange={(event) => setFax(event.target.value)} />
      </label>
      <button type="submit" disabled={pending} className="h-12 rounded-md bg-pine text-sm font-bold text-paper disabled:opacity-60">
        {pending ? "Sending…" : "Send"}
      </button>
      {message ? <p className="text-sm text-pine">{message}</p> : null}
      {error ? <p className="text-sm text-stamp" role="alert">{error}</p> : null}
    </form>
  );
}
