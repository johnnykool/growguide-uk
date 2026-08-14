import BrandMark from "./BrandMark";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-garden-ground/25 bg-pale-mineral">
      <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6">
        <a
          href="/"
          className="inline-flex min-h-11 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral"
        >
          <BrandMark className="h-8 w-8 shrink-0 text-sky-blue" />
          <span className="text-xl font-semibold tracking-[-0.02em] text-garden-ground">
            GrowGuide <span className="text-rain-ink">UK</span>
          </span>
        </a>
      </div>
    </header>
  );
}
