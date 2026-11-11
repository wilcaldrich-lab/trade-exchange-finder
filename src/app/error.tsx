"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl">Something went wrong</h1>
      <p className="mt-3 text-muted">The page did not finish loading. Try it again.</p>
      <button type="button" onClick={reset} className="mt-6 h-12 rounded-md bg-pine px-4 text-sm font-bold text-paper">
        Try again
      </button>
    </div>
  );
}
