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
        className="border border-garden-ground/25 bg-moss-veil/35 p-5"
      >
        <p className="text-garden-ground">Reading the sky over your plot…</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="border border-ember-ink/35 bg-pale-mineral p-5">
        <p className="text-garden-ground">
          We can&apos;t load local weather right now. You can still get growing
          advice.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 min-h-11 border border-ember-ink px-4 py-2 text-sm font-semibold text-ember-ink transition-colors hover:bg-ember hover:text-pale-mineral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral"
        >
          Try weather again
        </button>
      </div>
    );
  }

  const { current, daily, warnings } = weather;
  const hasWeatherWarning = warnings.rainSoon || warnings.frostSoon;

  return (
    <section
      aria-label="Local forecast"
      className="forecast-ribbon overflow-hidden bg-garden-ground px-5 py-5 text-pale-mineral shadow-matte"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex min-w-[11rem] items-center gap-3 lg:border-r lg:border-pale-mineral/20 lg:pr-6">
          <span className="h-10 w-10 shrink-0 text-sky-blue">
            <WeatherSymbol
              icon={current.icon}
              label={`${current.description} weather`}
            />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss-veil">
              {locationLabel}
            </p>
            <p className="mt-1 text-3xl font-semibold leading-none">
              {current.temp}°C
            </p>
            <p className="mt-1 text-sm capitalize text-pale-mineral/75">
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
              className="flex min-w-[5.5rem] flex-1 flex-col items-center border-l border-pale-mineral/15 px-3 py-1 first:border-l-0"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-moss-veil">
                {day.dayName}
              </span>
              <span className="my-1 h-7 w-7 text-sky-blue">
                <WeatherSymbol icon={day.icon} label={day.conditions} />
              </span>
              <span className="text-sm font-semibold">
                {day.high}° <span className="text-moss-veil">{day.low}°</span>
              </span>
              <span className="text-xs text-sky-blue">
                {day.rainProbability}% rain
              </span>
            </li>
          ))}
        </ul>
      </div>

      {hasWeatherWarning && (
        <div className="relative mt-3 pt-8">
          <svg
            aria-hidden="true"
            className="forecast-trajectory absolute inset-x-0 top-0 h-8 w-full text-sky-blue"
            viewBox="0 0 320 32"
            preserveAspectRatio="none"
          >
            <g className="rain-path">
              <path
                d="M0 3 C92 3 189 7 316 29"
                fill="none"
                stroke="currentColor"
                strokeDasharray="5 7"
                strokeLinecap="round"
                strokeWidth="2"
              />
              <circle cx="316" cy="29" r="3" fill="currentColor" />
            </g>
          </svg>
          <p className="border-l border-ember pl-3 text-sm font-semibold text-pale-mineral">
            Rain may change your next tasks
          </p>
        </div>
      )}
    </section>
  );
}
