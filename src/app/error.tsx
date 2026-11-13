"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="kicker kicker-alert">System</p>
      <h1 className="mt-2 font-display text-4xl leading-tight">Something went wrong</h1>
      <p className="mt-3 text-muted">The page did not finish loading. Try it again.</p>
      <button type="button" onClick={reset} className="mt-6 h-12 bg-pine px-4 text-sm text-paper">
        Try again
      </button>
    </div>
  );
}
