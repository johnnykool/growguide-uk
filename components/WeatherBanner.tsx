"use client";

import { WeatherData } from "@/lib/types";

interface Props {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  locationLabel: string;
}

function WeatherSymbol({ icon, label }: { icon: string; label: string }) {
  const code = icon.slice(0, 2);
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
  };

  if (code === "01") {
    return (
      <svg
        role="img"
        aria-label={label}
        className="h-full w-full"
        viewBox="0 0 32 32"
        {...common}
      >
        <circle cx="16" cy="16" r="5" />
        <path d="M16 4v4M16 24v4M4 16h4M24 16h4M7.5 7.5l2.8 2.8M21.7 21.7l2.8 2.8M24.5 7.5l-2.8 2.8M10.3 21.7l-2.8 2.8" />
      </svg>
    );
  }

  if (["09", "10", "11"].includes(code)) {
    return (
      <svg
        role="img"
        aria-label={label}
        className="h-full w-full"
        viewBox="0 0 32 32"
        {...common}
      >
        <path d="M8.5 20.5a5 5 0 0 1 .8-9.9A7 7 0 0 1 22.8 12a4.5 4.5 0 0 1 .7 8.5H8.5Z" />
        <path d="m11 24-1 3M17 24l-1 3M23 24l-1 3" />
      </svg>
    );
  }

  if (code === "13") {
    return (
      <svg
        role="img"
        aria-label={label}
        className="h-full w-full"
        viewBox="0 0 32 32"
        {...common}
      >
        <path d="M16 6v20M7.3 11l17.4 10M7.3 21l17.4-10M16 6l-2 2M16 6l2 2M16 26l-2-2M16 26l2-2" />
      </svg>
    );
  }

  return (
    <svg
      role="img"
      aria-label={label}
      className="h-full w-full"
      viewBox="0 0 32 32"
      {...common}
    >
      <path d="M7.5 22a5.5 5.5 0 0 1 1-10.9A8 8 0 0 1 24 13a4.5 4.5 0 0 1 .5 9H7.5Z" />
    </svg>
  );
}

export default function WeatherBanner({
  weather,
  loading,
  error,
  onRetry,
  locationLabel,
}: Props) {
  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-sage/60 rounded-card shadow-soft p-5 animate-pulse"
      >
        <p className="text-dark-earth">Reading the sky over your plot…</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-warm-stone/60 rounded-card shadow-soft p-5">
        <p className="text-dark-earth">
          We can&apos;t load local weather right now. You can still get growing
          advice.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-btn bg-cream px-4 py-2 text-sm font-semibold text-dark-earth shadow-soft transition-colors hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-warm-stone"
        >
          Try weather again
        </button>
      </div>
    );
  }

  const { current, daily } = weather;

  return (
    <section
      aria-label="Local forecast"
      className="forecast-ribbon overflow-hidden rounded-[0.4rem] bg-[#20312C] px-5 py-5 text-[#E7E8E4] shadow-soft"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex min-w-[11rem] items-center gap-3 lg:border-r lg:border-[#E7E8E4]/20 lg:pr-6">
          <span className="h-10 w-10 shrink-0 text-[#7DB8E6]">
            <WeatherSymbol
              icon={current.icon}
              label={`${current.description} weather`}
            />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A6B49C]">
              {locationLabel}
            </p>
            <p className="mt-1 text-3xl font-semibold leading-none">
              {current.temp}°C
            </p>
            <p className="mt-1 text-sm capitalize text-[#E7E8E4]/75">
              {current.description}
            </p>
          </div>
        </div>

        <ul
          aria-label="Seven-day forecast"
          className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1"
        >
          {daily.map((day) => (
            <li
              key={day.date}
              aria-label={`${day.dayName}: high ${day.high}°, low ${day.low}°, ${day.rainProbability}% rain`}
              className="flex min-w-[5.5rem] flex-1 flex-col items-center border-l border-[#E7E8E4]/15 px-3 py-1 first:border-l-0"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A6B49C]">
                {day.dayName}
              </span>
              <span className="my-1 h-7 w-7 text-[#7DB8E6]">
                <WeatherSymbol icon={day.icon} label={day.conditions} />
              </span>
              <span className="text-sm font-semibold">
                {day.high}° <span className="text-[#A6B49C]">{day.low}°</span>
              </span>
              <span className="text-xs text-[#7DB8E6]">
                {day.rainProbability}% rain
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
