import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="kicker kicker-alert">404</p>
      <h1 className="mt-2 font-display text-4xl leading-tight">That page is not in the directory</h1>
      <p className="mt-3 text-muted">The exchange, state, or country may be missing, or the address is mistyped.</p>
      <p className="mt-6">
        <Link href="/" className="font-bold text-pine underline underline-offset-4">
          Back to the exchanges
        </Link>
      </p>
    </div>
  );
}
