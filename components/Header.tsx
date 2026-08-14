"use client";

import BrandMark from "./BrandMark";
import { useHeaderWeatherSummary } from "./HeaderWeatherContext";

export default function Header() {
  const weatherSummary = useHeaderWeatherSummary();

  return (
    <header className="sticky top-0 z-40 border-b border-garden-ground/25 bg-pale-mineral">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <a
          href="/"
          className="inline-flex min-h-11 shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral"
        >
          <BrandMark className="h-8 w-8 shrink-0 text-rain-ink" />
          <span className="text-xl font-semibold tracking-[-0.02em] text-garden-ground">
            GrowGuide <span className="text-rain-ink">UK</span>
          </span>
        </a>
        {weatherSummary && (
          <p
            aria-label="Current garden weather"
            className="min-w-0 text-right text-xs font-semibold text-garden-ground/70 sm:text-sm"
          >
            <span>{weatherSummary.postcode}</span>
            {typeof weatherSummary.temp === "number" && (
              <>
                <span aria-hidden="true"> · </span>
                <span>{weatherSummary.temp}°C</span>
                {weatherSummary.description && (
                  <span className="hidden sm:inline">
                    <span aria-hidden="true"> · </span>
                    {weatherSummary.description}
                  </span>
                )}
              </>
            )}
          </p>
        )}
      </div>
    </header>
  );
}
