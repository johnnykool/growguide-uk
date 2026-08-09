import Link from "next/link";
import BrandMark from "./BrandMark";

export default function Footer() {
  return (
    <footer className="mt-12 bg-dark-earth text-cream">
      <div className="mx-auto max-w-6xl px-4 py-5">
        <div className="flex flex-col gap-2 text-xs text-cream sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {" "}
            <a href="/" className="inline-flex items-center gap-1.5 align-middle">
              <BrandMark className="h-4 w-4 text-sage" />
              <span className="font-serif text-sm text-cream">GrowGuide UK</span>
            </a>
          </p>
          <p>
            Growing data based on RHS guidance · Photos from Unsplash &amp;
            Pexels · Weather by OpenWeatherMap
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
