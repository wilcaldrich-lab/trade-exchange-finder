"use client";

import { useState, type FormEvent } from "react";

export function SignupForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [fax, setFax] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source, company_fax: fax }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error || "Could not save that email.");
        return;
      }
      setMessage("You're on the list.");
      setEmail("");
    } catch {
      setError("Could not save that email.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <label htmlFor={`email-${source}`} className="text-sm font-bold">
        Email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`email-${source}`}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@yourbusiness.com"
          className="h-12 min-w-0 flex-1 rounded-md border border-line bg-card px-3 text-base"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-12 rounded-md bg-pine px-4 text-sm font-bold text-paper disabled:opacity-60"
        >
          {pending ? "Saving…" : "Sign up"}
        </button>
      </div>
      <label className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
        Fax
        <input tabIndex={-1} autoComplete="off" value={fax} onChange={(event) => setFax(event.target.value)} />
      </label>
      {message ? <p className="text-sm text-pine">{message}</p> : null}
      {error ? <p className="text-sm text-stamp" role="alert">{error}</p> : null}
    </form>
  );
}
