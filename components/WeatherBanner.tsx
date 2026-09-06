"use client";

import { WeatherData } from "@/lib/types";

interface Props {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

// Map icon keys (lib/weather/codes.ts) to emoji so we stay inside the palette.
function weatherEmoji(icon: string): string {
  const map: Record<string, string> = {
    "01": "☀️",
    "02": "🌤️",
    "03": "☁️",
    "04": "☁️",
    "09": "🌧️",
    "10": "🌦️",
    "11": "⛈️",
    "13": "🌨️",
    "50": "🌫️",
  };
  return map[icon.slice(0, 2)] ?? "🌤️";
}

// How old the reading is, for forecasts served past the daily quota.
function ageLabel(observedAt: string): string | null {
  const observed = Date.parse(observedAt);
  if (Number.isNaN(observed)) return null;
  const hours = Math.max(0, Math.round((Date.now() - observed) / 3_600_000));
  if (hours < 1) return "updated just now";
  if (hours === 1) return "updated 1 hour ago";
  return `updated ${hours} hours ago`;
}

export default function WeatherBanner({ weather, loading, error }: Props) {
  if (loading) {
    return (
      <div className="bg-sage/60 rounded-card shadow-soft p-5 animate-pulse">
        <p className="text-dark-earth">Reading the sky over your plot…</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-warm-stone/60 rounded-card shadow-soft p-5">
        <p className="text-dark-earth">
          ☁️ Weather is unavailable right now
          {error ? ` — ${error}` : "."}{" "}
          You can still get growing advice below.
        </p>
      </div>
    );
  }

  const { current, daily, warnings } = weather;
  const warningMessages: string[] = [];
  if (warnings.frostSoon)
    warningMessages.push(
      "Frost risk in the next 48 hours — protect tender plants and seedlings."
    );
  if (warnings.rainSoon)
    warningMessages.push(
      "Rain expected in the next 48 hours — hold off watering and plan indoor jobs."
    );

  return (
    <div className="space-y-3">
      {warningMessages.length > 0 && (
        <div className="bg-terracotta text-cream rounded-card shadow-soft px-5 py-4">
          {warningMessages.map((msg) => (
            <p key={msg} className="font-medium">
              ⚠️ {msg}
            </p>
          ))}
        </div>
      )}
      <div className="bg-sage/60 rounded-card shadow-soft p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>
              {weatherEmoji(current.icon)}
            </span>
            <div>
              <p className="text-3xl font-semibold leading-none">
                {current.temp}°C
              </p>
              <p className="text-sm text-dark-earth/80 capitalize">
                {current.description}
              </p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {daily.map((day) => (
              <div
                key={day.date}
                className="flex flex-col items-center rounded-btn bg-cream/70 px-3 py-2 min-w-[4.5rem]"
              >
                <span className="text-xs font-semibold text-moss">
                  {day.dayName}
                </span>
                <span className="text-lg" aria-hidden>
                  {weatherEmoji(day.icon)}
                </span>
                <span className="text-sm font-medium">
                  {day.high}° <span className="text-moss">{day.low}°</span>
                </span>
                {day.rainProbability >= 30 && (
                  <span className="text-xs text-moss">
                    💧{day.rainProbability}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        {weather.stale && (
          <p className="mt-3 text-xs text-dark-earth/70">
            Showing the last forecast we could fetch — {ageLabel(weather.observedAt) ?? "age unknown"}.
          </p>
        )}
      </div>
    </div>
  );
}
