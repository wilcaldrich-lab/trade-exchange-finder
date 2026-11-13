import Link from "next/link";

export function Header() {
  return (
    <header className="site-header relative border-b border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2.5">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="mark">Bx</span>
          <span className="min-w-0">
            <span className="kicker block">Trade exchange finder</span>
            <span className="block font-display text-lg leading-none tracking-tight sm:text-[1.35rem]">Barter Exchanges</span>
          </span>
        </Link>
        <nav aria-label="Primary" className="flex w-full items-center justify-end gap-1 text-sm sm:w-auto">
          <Link href="/guide" className="px-2.5 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted hover:text-cyan">
            Guide
          </Link>
          <Link href="/submit" className="px-2.5 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted hover:text-cyan">
            Submit
          </Link>
          <Link href="/sponsor" className="bg-pine px-3 py-2 text-xs text-paper">
            Sponsor
          </Link>
        </nav>
      </div>
    </header>
  );
}
