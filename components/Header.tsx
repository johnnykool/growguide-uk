export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-light-sage/50 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="flex items-baseline gap-2">
          <span className="text-xl" aria-hidden>
            🌱
          </span>
          <span className="font-serif text-xl text-dark-earth">
            GrowGuide <span className="text-moss">UK</span>
          </span>
        </a>
        <a
          href="https://crystalpocket.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-sm font-medium text-moss transition-colors hover:text-dark-earth sm:block"
        >
          Part of CrystalPocket ↗
        </a>
      </div>
    </header>
  );
}
