import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line bg-card/95">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-pine font-display text-lg leading-none text-pine">
            Bx
          </span>
          <span className="min-w-0">
            <span className="block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brass">
              Trade exchange finder
            </span>
            <span className="block font-display text-[1.35rem] leading-none tracking-tight">Barter Exchanges</span>
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 text-sm">
          <Link href="/guide" className="rounded-md px-2.5 py-2 hover:bg-paper">
            Guide
          </Link>
          <Link href="/submit" className="rounded-md px-2.5 py-2 hover:bg-paper">
            Submit
          </Link>
          <Link href="/sponsor" className="rounded-md bg-pine px-3 py-2 font-bold text-paper hover:bg-pine/90">
            Sponsor
          </Link>
        </nav>
      </div>
    </header>
  );
}
