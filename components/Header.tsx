import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-light-sage/50 bg-cream/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
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
      </div>
    </header>
  );
}
