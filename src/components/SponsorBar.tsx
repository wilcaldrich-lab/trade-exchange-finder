"use client";

import { useSyncExternalStore } from "react";

type SponsorCopy = {
  slug: string;
  name: string;
  tagline: string | null;
};

function storageKey(slug: string) {
  return `tef-sponsor-dismissed:${slug}`;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("tef-sponsor-dismiss", onStoreChange);
  return () => window.removeEventListener("tef-sponsor-dismiss", onStoreChange);
}

export function SponsorBar({ sponsor }: { sponsor: SponsorCopy }) {
  const dismissed = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(storageKey(sponsor.slug)) === "1",
    () => false,
  );
  if (dismissed) return null;

  return (
    <div className="border-b border-stamp/50 bg-[#140810] text-ink">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2 text-sm">
        <span className="pill pill-featured shrink-0">Sponsored</span>
        <a href={`/go/${sponsor.slug}`} className="min-w-0 flex-1 truncate hover:underline">
          <span className="font-bold">{sponsor.name}</span>
          {sponsor.tagline ? <span className="text-ink/80"> — {sponsor.tagline}</span> : null}
        </a>
        <button
          type="button"
          className="shrink-0 rounded-md px-2 py-1 text-base leading-none hover:bg-white/10"
          aria-label="Dismiss sponsor"
          onClick={() => {
            window.localStorage.setItem(storageKey(sponsor.slug), "1");
            window.dispatchEvent(new Event("tef-sponsor-dismiss"));
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
