"use client";

import { useState, type FormEvent } from "react";
import { NETWORK_OPTIONS } from "@/lib/exchange";

type Choice = { slug: string; name: string };

const inputClass = "h-12 w-full rounded-md border border-line bg-card px-3 text-base";

export function SubmitForm({ choices, initialSlug }: { choices: Choice[]; initialSlug: string }) {
  const [kind, setKind] = useState<"new" | "correction">(initialSlug ? "correction" : "new");
  const [networks, setNetworks] = useState<string[]>([]);
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
    const payload: Record<string, unknown> = {
      kind,
      company_fax: fax,
      networks,
      submitter_name: form.get("submitter_name"),
      submitter_email: form.get("submitter_email"),
      notes: form.get("notes"),
      exchange_slug: form.get("exchange_slug"),
      name: form.get("name"),
      website: form.get("website"),
      city: form.get("city"),
      state_region: form.get("state_region"),
      country: form.get("country"),
      phone: form.get("phone"),
      email: form.get("email"),
      description: form.get("description"),
      cash_fee_percent: form.get("cash_fee_percent"),
      monthly_dues: form.get("monthly_dues"),
      annual_dues: form.get("annual_dues"),
      joining_fee: form.get("joining_fee"),
      fees_notes: form.get("fees_notes"),
      approx_member_count: form.get("approx_member_count"),
      member_count_notes: form.get("member_count_notes"),
      year_founded: form.get("year_founded"),
      source_urls: String(form.get("source_urls") || "")
        .split(/\s+/)
        .map((url) => url.trim())
        .filter(Boolean),
    };
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error || "Could not save that submission.");
        return;
      }
      setMessage("Saved for review. It will not appear in the directory until it is approved.");
      formElement.reset();
      setNetworks([]);
    } catch {
      setError("Could not save that submission.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <fieldset className="flex gap-4">
        <legend className="text-sm font-bold">What are you sending?</legend>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="radio" name="kind" checked={kind === "new"} onChange={() => setKind("new")} />
          New listing
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="radio" name="kind" checked={kind === "correction"} onChange={() => setKind("correction")} />
          Correction
        </label>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold">
          Your name
          <input name="submitter_name" required autoComplete="name" className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold">
          Your email
          <input name="submitter_email" type="email" required autoComplete="email" className={`${inputClass} mt-1 font-normal`} />
        </label>
      </div>

      {kind === "correction" ? (
        <label className="text-sm font-bold">
          Exchange to correct
          <select name="exchange_slug" required defaultValue={initialSlug} className={`${inputClass} mt-1 font-normal`}>
            <option value="">Choose one</option>
            {choices.map((choice) => (
              <option key={choice.slug} value={choice.slug}>
                {choice.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <p className="text-sm text-muted">
        {kind === "correction"
          ? "Fill only the fields that should change. Blank fields stay as they are."
          : "Leave a fee or count blank if it is not published. Do not guess."}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold sm:col-span-2">
          Exchange name
          <input name="name" required={kind === "new"} className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold sm:col-span-2">
          Website
          <input name="website" type="url" placeholder="https://" className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold">
          City
          <input name="city" className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold">
          State or region
          <input name="state_region" placeholder="TX" className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold">
          Country code
          <input name="country" maxLength={2} placeholder="US" className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold">
          Phone
          <input name="phone" className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold sm:col-span-2">
          Public email
          <input name="email" type="email" className={`${inputClass} mt-1 font-normal`} />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-bold">Networks they publish</legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {NETWORK_OPTIONS.map((network) => (
            <label key={network} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={networks.includes(network)}
                onChange={(event) => {
                  setNetworks((current) =>
                    event.target.checked ? [...current, network] : current.filter((item) => item !== network),
                  );
                }}
              />
              {network}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="text-sm font-bold">
        Description
        <textarea name="description" rows={4} className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2 font-normal" />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold">
          Cash fee percent
          <input name="cash_fee_percent" inputMode="decimal" className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold">
          Year founded
          <input name="year_founded" inputMode="numeric" className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold">
          Monthly dues
          <input name="monthly_dues" className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold">
          Annual dues
          <input name="annual_dues" className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold sm:col-span-2">
          Joining fee
          <input name="joining_fee" className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold sm:col-span-2">
          Fee notes
          <textarea name="fees_notes" rows={3} className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2 font-normal" />
        </label>
        <label className="text-sm font-bold">
          Approximate member count
          <input name="approx_member_count" inputMode="numeric" className={`${inputClass} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-bold">
          Member count notes
          <input name="member_count_notes" className={`${inputClass} mt-1 font-normal`} />
        </label>
      </div>

      <label className="text-sm font-bold">
        Source URLs, one per line or separated by spaces
        <textarea name="source_urls" rows={3} className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2 font-normal" />
      </label>
      <label className="text-sm font-bold">
        Notes for the reviewer
        <textarea name="notes" rows={3} className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2 font-normal" />
      </label>
      <label className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
        Fax
        <input tabIndex={-1} autoComplete="off" value={fax} onChange={(event) => setFax(event.target.value)} />
      </label>
      <button type="submit" disabled={pending} className="h-12 rounded-md bg-pine text-sm font-bold text-white disabled:opacity-60">
        {pending ? "Sending…" : "Submit for review"}
      </button>
      {message ? <p className="text-sm text-pine-ink">{message}</p> : null}
      {error ? <p className="text-sm text-stamp" role="alert">{error}</p> : null}
    </form>
  );
}
