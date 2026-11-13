import Link from "next/link";
import { publishesFees, type ExchangeView } from "@/lib/exchange";
import { NOT_PUBLISHED, formatCashFee, formatCount } from "@/lib/format";
import { locationLine } from "@/lib/places";

function quoteClass(value: string) {
  return value === NOT_PUBLISHED
    ? "mt-0.5 font-mono text-base text-muted"
    : "mt-0.5 font-mono text-lg text-pine";
}

export function ExchangeCard({ exchange, featured = false }: { exchange: ExchangeView; featured?: boolean }) {
  const place = locationLine(exchange);
  const placeHref = exchange.state_slug
    ? `/state/${exchange.state_slug}`
    : exchange.country_slug
      ? `/country/${exchange.country_slug}`
      : null;
  const fee = formatCashFee(exchange.cash_fee_percent);
  const members = formatCount(exchange.approx_member_count);
  const symbol =
    exchange.state_region && exchange.state_region.length <= 3
      ? exchange.state_region.toUpperCase()
      : exchange.country || "";

  return (
    <article className={`market-card px-4 py-3.5 ${featured ? "market-card-featured" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <p className={featured ? "kicker kicker-alert" : "kicker"}>{featured ? "Featured" : "Listing"}</p>
        <span className="flex items-center gap-2">
          {symbol ? <span className="font-mono text-xs tracking-[0.14em] text-cyan">{symbol}</span> : null}
          {featured ? <span className="pill pill-featured">Featured</span> : null}
        </span>
      </div>
      <div className="mt-1 flex items-start justify-between gap-3">
        <h2 className="font-display text-[1.35rem] leading-tight tracking-tight">
          <Link href={`/exchange/${exchange.slug}`} className="decoration-pine underline-offset-4 hover:text-pine-ink hover:underline">
            {exchange.name}
          </Link>
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted">
        {placeHref ? (
          <Link href={placeHref} className="hover:text-ink">
            {place}
          </Link>
        ) : (
          place
        )}
      </p>
      {exchange.networks.length ? (
        <ul className="mt-2 flex flex-wrap gap-1">
          {exchange.networks.map((network) => (
            <li key={network} className="pill">
              {network}
            </li>
          ))}
        </ul>
      ) : null}
      {exchange.description ? <p className="mt-2 line-clamp-3 text-[0.95rem] leading-snug">{exchange.description}</p> : null}
      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-2">
        <div>
          <p className="term-label">Fees</p>
          <p className={quoteClass(fee)}>{fee}</p>
          {publishesFees(exchange) && exchange.cash_fee_percent === null ? (
            <p className="text-xs text-muted">Other fees are published</p>
          ) : null}
        </div>
        <div>
          <p className="term-label">Members</p>
          <p className={quoteClass(members)}>{members}</p>
        </div>
      </div>
    </article>
  );
}
