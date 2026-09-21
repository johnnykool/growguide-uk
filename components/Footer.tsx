import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 bg-dark-earth text-cream">
      <div className="mx-auto max-w-6xl px-4 py-5">
        <div id="free-growing-calendar" className="mb-5 flex scroll-mt-20 flex-col gap-3 border-b border-cream/20 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-xl">Good things to grow with.</p>
            <p className="text-sm">Free guides and printables for your patch.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/resources"
              className="inline-flex min-h-11 items-center rounded-btn border border-sage/70 px-4 py-2 text-sm font-semibold transition-colors hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              Preview our free resources
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xs text-cream sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {" "}
            <span className="font-serif text-sm text-cream">GrowGuide UK</span>
          </p>
          <p>
            Growing data compiled by GrowGuide UK · Photos from Unsplash &amp;
            Pexels · Weather by Met Office · Map tiles by OpenWeatherMap
          </p>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p>Help cover weather and AI costs.</p>
            <a
              href="https://ko-fi.com/growguideuk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-btn border border-sage/70 px-3 py-2 font-semibold text-cream transition-colors hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              Support GrowGuide
            </a>
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center py-3 font-semibold text-cream underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
