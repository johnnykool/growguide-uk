"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AdviceResponse,
  Timeline,
  UserProfile,
  WeatherData,
} from "@/lib/types";
import WeatherBanner from "./WeatherBanner";
import TimelineFilter from "./TimelineFilter";
import AdviceResults from "./AdviceResults";
import SeasonalCalendar from "./SeasonalCalendar";

interface Props {
  profile: UserProfile;
  onEdit: () => void;
}

const LOADING_MESSAGES = [
  "Checking the soil…",
  "Consulting the almanac…",
  "Reading the clouds…",
  "Asking the head gardener…",
];

export default function Dashboard({ profile, onEdit }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [timeline, setTimeline] = useState<Timeline>("7-days");
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const loadingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch weather immediately on dashboard load.
  useEffect(() => {
    let cancelled = false;
    setWeatherLoading(true);
    setWeatherError(null);
    fetch("/api/weather", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: profile.lat, lng: profile.lng }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setWeatherError(data.error ?? "Weather unavailable.");
        } else {
          setWeather(data);
        }
      })
      .catch(() => {
        if (!cancelled) setWeatherError("Couldn't reach the weather service.");
      })
      .finally(() => {
        if (!cancelled) setWeatherLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [profile.lat, profile.lng]);

  const fetchAdvice = useCallback(async () => {
    setAdviceLoading(true);
    setAdviceError(null);
    let i = 0;
    setLoadingMessage(LOADING_MESSAGES[0]);
    loadingTimer.current = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[i]);
    }, 2500);

    try {
      const res = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postcode: profile.postcode,
          region: profile.region,
          lat: profile.lat,
          lng: profile.lng,
          vegetables: profile.vegetables,
          plotSize: profile.plotSize,
          environment: profile.environment,
          equipment: profile.equipment,
          timeline,
          weather,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        setAdviceError(
          data?.error ??
            (res.status === 504
              ? "The advice took too long to generate — try a shorter timeline or fewer vegetables, then try again."
              : "Something went wrong generating advice.")
        );
      } else {
        setAdvice(data);
      }
    } catch {
      setAdviceError("Couldn't reach the advice service. Check your connection and try again.");
    } finally {
      if (loadingTimer.current) clearInterval(loadingTimer.current);
      setAdviceLoading(false);
    }
  }, [profile, timeline, weather]);

  useEffect(() => {
    return () => {
      if (loadingTimer.current) clearInterval(loadingTimer.current);
    };
  }, []);

  return (
    <main className="min-h-screen px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl">GrowGuide UK</h1>
            <p className="text-sm text-moss">
              {profile.postcode} · {profile.region}
            </p>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-btn bg-cream px-4 py-2 text-sm font-medium text-dark-earth ring-1 ring-light-sage hover:bg-light-sage/40 transition-colors"
          >
            ✏️ Edit My Setup
          </button>
        </header>

        <div className="mb-6">
          <WeatherBanner
            weather={weather}
            loading={weatherLoading}
            error={weatherError}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <section>
              <h2 className="font-serif text-xl mb-3">
                What should I be doing?
              </h2>
              <TimelineFilter value={timeline} onChange={setTimeline} />
              <button
                type="button"
                onClick={fetchAdvice}
                disabled={adviceLoading}
                className={`mt-4 w-full sm:w-auto rounded-btn px-8 py-4 text-lg font-semibold text-cream shadow-soft transition-colors ${
                  adviceLoading
                    ? "bg-moss/60 cursor-wait"
                    : "bg-moss hover:bg-dark-earth"
                }`}
              >
                {adviceLoading ? loadingMessage : "🌱 Get Growing Advice"}
              </button>
            </section>

            {adviceError && (
              <div className="bg-terracotta/90 text-cream rounded-card shadow-soft p-5">
                <p className="font-medium mb-3">🥀 {adviceError}</p>
                <button
                  type="button"
                  onClick={fetchAdvice}
                  className="rounded-btn bg-cream px-4 py-2 text-sm font-semibold text-dark-earth hover:bg-blush transition-colors"
                >
                  Try again
                </button>
              </div>
            )}

            {advice && !adviceLoading && <AdviceResults advice={advice} />}

            {!advice && !adviceLoading && !adviceError && (
              <div className="bg-warm-stone/50 rounded-card shadow-soft p-6 text-center">
                <p className="text-3xl mb-2" aria-hidden>
                  🧑‍🌾
                </p>
                <p className="text-dark-earth/80">
                  Pick a timeline and press{" "}
                  <span className="font-semibold">Get Growing Advice</span> for
                  a weather-aware task list tailored to your plot.
                </p>
              </div>
            )}
          </div>

          {/* Seasonal sidebar (stacks below on mobile) */}
          <aside className="order-last lg:order-none">
            <SeasonalCalendar vegetableIds={profile.vegetables} />
          </aside>
        </div>
      </div>
    </main>
  );
}
