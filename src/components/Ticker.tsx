import { getExchanges } from "@/lib/catalog";
import { decorate } from "@/lib/directory";

function Run({ items }: { items: string[] }) {
  return (
    <span className="ticker-run">
      {items.map((item, index) => (
        <span key={item}>
          {index > 0 ? <span className="ticker-sep">{" // "}</span> : null}
          {item}
        </span>
      ))}
    </span>
  );
}

export async function Ticker() {
  const { views, states } = decorate(await getExchanges());
  const busiest = [...states].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  const items = [
    `${views.length} EXCHANGES`,
    "TRADE DOLLARS",
    ...busiest.map((state) => `${state.label.toUpperCase()} ${state.count}`),
    "FEES WHEN PUBLISHED",
  ];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        <Run items={items} />
        <Run items={items} />
      </div>
    </div>
  );
}
