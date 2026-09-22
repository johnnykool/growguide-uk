import Image from "next/image";
import Link from "next/link";

// The variety guides previously had no route in from the chrome. They were
// reachable only from the sowing and planting prompt inside a day's advice,
// which meant they stayed hidden unless you happened to grow one of the four
// crops in season.
const NAV_LINKS = [
  { href: "/varieties", label: "Varieties" },
  { href: "/resources", label: "Resources" },
];

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
          {/* The second nav link left the wordmark too little room at 375px,
              where it broke across two lines. */}
          <span className="whitespace-nowrap font-serif text-lg text-dark-earth sm:text-xl">
            GrowGuide <span className="text-moss">UK</span>
          </span>
        </a>
        <nav aria-label="Main navigation" className="flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center whitespace-nowrap rounded-btn px-2 py-2 text-sm font-semibold text-earth-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
