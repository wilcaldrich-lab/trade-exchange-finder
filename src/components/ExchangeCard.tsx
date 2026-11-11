import Link from "next/link";
import { publishesFees, type ExchangeView } from "@/lib/exchange";
import { formatCashFee } from "@/lib/format";
import { locationLine } from "@/lib/places";

export function ExchangeCard({ exchange, featured = false }: { exchange: ExchangeView; featured?: boolean }) {
  const place = locationLine(exchange);
  const placeHref = exchange.state_slug
    ? `/state/${exchange.state_slug}`
    : exchange.country_slug
      ? `/country/${exchange.country_slug}`
      : null;

  return (
    <article className="rounded-md border border-line bg-card px-4 py-3.5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-[1.35rem] leading-tight tracking-tight">
          <Link href={`/exchange/${exchange.slug}`} className="hover:text-pine-ink">
            {exchange.name}
          </Link>
        </h2>
        {featured ? (
          <span className="shrink-0 border border-brass px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brass">
            Featured
          </span>
        ) : null}
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
            <li
              key={network}
              className="border border-line px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-pine-ink"
            >
              {network}
            </li>
          ))}
        </ul>
      ) : null}
      {exchange.description ? <p className="mt-2 line-clamp-3 text-[0.95rem] leading-snug">{exchange.description}</p> : null}
      <p className="mt-2 text-sm">
        <span className="text-muted">Cash fee </span>
        {formatCashFee(exchange.cash_fee_percent)}
        {publishesFees(exchange) && exchange.cash_fee_percent === null ? (
          <span className="text-muted"> · other fees are published</span>
        ) : null}
      </p>
    </article>
  );
}
