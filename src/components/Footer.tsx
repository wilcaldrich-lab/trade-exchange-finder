import Link from "next/link";
import { SignupForm } from "@/components/SignupForm";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-card">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="font-display text-2xl">A note when the directory changes</p>
          <p className="mt-1 max-w-md text-sm text-muted">
            Occasional mail about a new listing or a correction. No rented lists.
          </p>
          <div className="mt-3 max-w-md">
            <SignupForm source="footer" />
          </div>
        </div>
        <div className="text-sm">
          <p className="font-bold">Directory</p>
          <ul className="mt-2 space-y-1">
            <li><Link href="/" className="underline decoration-line underline-offset-4">All exchanges</Link></li>
            <li><Link href="/guide" className="underline decoration-line underline-offset-4">How business barter works</Link></li>
            <li><Link href="/submit" className="underline decoration-line underline-offset-4">Submit a listing</Link></li>
            <li><Link href="/sponsor" className="underline decoration-line underline-offset-4">Sponsor</Link></li>
          </ul>
          <p className="mt-4 text-muted">
            Figures stay blank until an exchange publishes them. Canonical site: barterexchanges.org.
          </p>
        </div>
      </div>
    </footer>
  );
}
