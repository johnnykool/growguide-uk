import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-light-sage/50 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href="/" className="flex items-center gap-2">
          <Image
            src="/images/growguide-logo.jpg"
            alt=""
            width={32}
            height={32}
            priority
            className="h-8 w-8 rounded-btn object-cover"
          />
          <span className="font-serif text-xl text-dark-earth">
            GrowGuide <span className="text-moss">UK</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <Link href="/resources" className="inline-flex min-h-11 items-center rounded-btn px-3 py-2 text-sm font-semibold text-earth-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream">
            Resources
          </Link>
        </nav>
      </div>
    </header>
  );
}
