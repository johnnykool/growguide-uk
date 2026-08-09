export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-light-sage/50 bg-cream/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <a href="/" className="flex items-baseline gap-2">
          <span className="text-xl" aria-hidden>
            🌱
          </span>
          <span className="font-serif text-xl text-dark-earth">
            GrowGuide <span className="text-moss">UK</span>
          </span>
        </a>
      </div>
    </header>
  );
}
