import type { Metadata } from "next";
import Link from "next/link";
import { CountView } from "@/components/CountView";

const title = "Privacy policy";
const description =
  "How Trade Exchange Finder handles analytics, pageview counts, newsletter email, and form submissions.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { title, description, url: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-6">
      <CountView />
      <p className="kicker">Privacy</p>
      <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight sm:text-5xl">Privacy policy</h1>
      <p className="mt-3 text-sm text-muted">November 12, 2026</p>
      <p className="mt-4 text-lg leading-relaxed">
        Trade Exchange Finder is the directory at barterexchanges.org. This page says what the site stores, why, and how to ask us to delete it.
      </p>

      <h2 className="mt-8 font-display text-2xl leading-tight sm:text-3xl">Google Analytics</h2>
      <p className="mt-3 leading-relaxed">
        When analytics is turned on, the site loads Google Analytics 4. Google may set cookies and receive the pages you open, a rough location, and details about your browser. We use that to see which pages are used.
      </p>
      <p className="mt-3 leading-relaxed">
        Advertising cookies stay off. In the European Economic Area, the United Kingdom, and Switzerland, analytics cookies stay off as well. Elsewhere, analytics storage is allowed. The tag only sends measurements from barterexchanges.org.
      </p>

      <h2 className="mt-8 font-display text-2xl leading-tight sm:text-3xl">Pageview counts</h2>
      <p className="mt-3 leading-relaxed">
        The site also keeps its own pageview count. That count does not use a cookie. It stores the page path, the referring site’s origin and path, the day, and how many times that combination was seen. It does not store your IP address or a visitor id.
      </p>

      <h2 className="mt-8 font-display text-2xl leading-tight sm:text-3xl">Newsletter</h2>
      <p className="mt-3 leading-relaxed">
        If you sign up for the short note, we store your email address and ask you to confirm it. After you confirm, we send that address to Resend, which delivers the mail. Until you confirm, the address stays in our database and is not added to the mailing list.
      </p>

      <h2 className="mt-8 font-display text-2xl leading-tight sm:text-3xl">Forms</h2>
      <p className="mt-3 leading-relaxed">
        Listing submissions and sponsor inquiries are stored in Neon Postgres. That includes the text you type and the email address you give us, so we can review a listing or reply about a sponsorship.
      </p>

      <h2 className="mt-8 font-display text-2xl leading-tight sm:text-3xl">Why we keep it</h2>
      <p className="mt-3 leading-relaxed">
        We keep this information to run the directory, send the notes you asked for, review listings and sponsor requests, and understand which pages are used.
      </p>

      <h2 className="mt-8 font-display text-2xl leading-tight sm:text-3xl">How long we keep it</h2>
      <p className="mt-3 leading-relaxed">
        Daily pageview totals stay while the directory is operating. They are not tied to a person. Email addresses stay until you unsubscribe or ask us to delete them. Form submissions stay so we can review them and reply, and we delete them when you ask.
      </p>

      <h2 className="mt-8 font-display text-2xl leading-tight sm:text-3xl">Unsubscribe or delete</h2>
      <p className="mt-3 leading-relaxed">
        Each newsletter has an unsubscribe link. You can also email hello@barterexchanges.org and ask to be removed, or ask us to delete the signup and the form messages we can match to you.
      </p>
      <p className="mt-3 leading-relaxed">
        Contact: <a href="mailto:hello@barterexchanges.org" className="text-pine underline underline-offset-4">hello@barterexchanges.org</a>
      </p>
      <p className="mt-6">
        <Link href="/" className="font-bold text-pine underline underline-offset-4">Back to the directory</Link>
      </p>
    </article>
  );
}
