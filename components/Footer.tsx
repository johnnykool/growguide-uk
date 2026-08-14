import Link from "next/link";
import BrandMark from "./BrandMark";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-pale-mineral/20 bg-garden-ground text-pale-mineral">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="flex items-center gap-2 font-semibold">
              <BrandMark className="h-5 w-5 text-sky-blue" />
              © {new Date().getFullYear()} GrowGuide UK
            </p>
            <p className="text-pale-mineral/75">
            Growing data based on RHS guidance · Photos from Unsplash &amp;
            Pexels · Weather by OpenWeatherMap
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-pale-mineral/75">Help cover weather and AI costs.</span>
            <a
              href="https://ko-fi.com/growguideuk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border border-sky-blue px-3 py-2 font-semibold text-pale-mineral transition-colors hover:bg-sky-blue hover:text-garden-ground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-blue focus-visible:ring-offset-2 focus-visible:ring-offset-garden-ground"
            >
              Support GrowGuide
            </a>
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center py-3 font-semibold text-pale-mineral underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-blue focus-visible:ring-offset-2 focus-visible:ring-offset-garden-ground"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
