import { SignupForm } from "@/components/SignupForm";

const HEADLINE = "Get the weekly barter exchange roundup";
const VALUE = "New exchanges, deals and barter tips every Tuesday, free, unsubscribe anytime.";

export function NewsletterCta({ source }: { source: string }) {
  const headingId = `roundup-${source.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`;

  return (
    <section aria-labelledby={headingId} className="newsletter-cta market-card px-4 py-5 sm:px-6 sm:py-6">
      <div className="newsletter-cta-bar" aria-hidden="true" />
      <p className="kicker">
        <span className="live-dot" aria-hidden="true" />
        Weekly roundup
      </p>
      <h2 id={headingId} className="mt-2 max-w-2xl font-display text-[1.65rem] leading-tight sm:text-3xl">
        {HEADLINE}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{VALUE}</p>
      <div className="mt-4 max-w-xl">
        <SignupForm source={source} />
      </div>
    </section>
  );
}
