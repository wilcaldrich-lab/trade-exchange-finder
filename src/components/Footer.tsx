import Link from "next/link";
import { SignupForm } from "@/components/SignupForm";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-card">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:grid-cols-[1.2fr_0.8fr]">
        <div className="terminal px-4 py-4">
          <p className="kicker">Join the network</p>
          <p className="mt-1 font-display text-2xl leading-tight">A note when the directory changes</p>
          <p className="mt-1 max-w-md text-sm text-muted">
            Occasional mail about a new listing or a correction. No rented lists.
          </p>
          <div className="mt-3 max-w-md">
            <SignupForm source="footer" />
          </div>
        </div>
        <div className="text-sm">
          <p className="kicker">Directory</p>
          <ul className="mt-2 space-y-1.5">
            <li><Link href="/" className="underline decoration-line underline-offset-4 hover:text-pine-ink">All exchanges</Link></li>
            <li><Link href="/guide" className="underline decoration-line underline-offset-4 hover:text-pine-ink">How business barter works</Link></li>
            <li><Link href="/submit" className="underline decoration-line underline-offset-4 hover:text-pine-ink">Submit a listing</Link></li>
            <li><Link href="/sponsor" className="underline decoration-line underline-offset-4 hover:text-pine-ink">Sponsor</Link></li>
            <li><Link href="/privacy" className="underline decoration-line underline-offset-4 hover:text-pine-ink">Privacy</Link></li>
          </ul>
          <p className="mt-4 text-muted">
            Figures stay blank until an exchange publishes them. Canonical site: barterexchanges.org.
          </p>
        </div>
      </div>
    </footer>
  );
}
