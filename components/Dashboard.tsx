"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AdviceResponse,
  Timeline,
  UserProfile,
  WeatherData,
} from "@/lib/types";
import { loadSavedAdvice, saveAdvice } from "@/lib/storage";
import { HERO_HARVEST, VEG_PHOTOS } from "@/lib/images";
import { formatCropCount } from "@/lib/format";
import WeatherBanner from "./WeatherBanner";
import TimelineFilter from "./TimelineFilter";
import AdviceResults from "./AdviceResults";
import SeasonalCalendar from "./SeasonalCalendar";
import WeatherMap from "./WeatherMap";
import PlotSummary from "./PlotSummary";
import AdviceRefreshConfirm from "./AdviceRefreshConfirm";

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
  const weatherMounted = useRef(false);
  const weatherRequestId = useRef(0);

  const [timeline, setTimeline] = useState<Timeline>("7-days");
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | undefined>();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);
  const [confirmAdviceRefresh, setConfirmAdviceRefresh] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const loadingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restore the last advice session so returning users see their task list
  // without another AI call.
  useEffect(() => {
    const saved = loadSavedAdvice();
    if (saved) {
      setAdvice(saved.advice);
      setTimeline(saved.timeline);
      setGeneratedAt(saved.generatedAt);
      setCompleted(saved.completed ?? {});
    }
  }, []);

  const fetchWeather = useCallback(async () => {
    if (!weatherMounted.current) return;
    const requestId = ++weatherRequestId.current;
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: profile.lat, lng: profile.lng }),
      });

      const data = await res.json().catch(() => null);
      if (
        !weatherMounted.current ||
        requestId !== weatherRequestId.current
      ) {
        return;
      }
      if (!res.ok || !data) {
        setWeatherError("Weather is unavailable right now.");
      } else {
        setWeather(data);
      }
    } catch {
      if (
        weatherMounted.current &&
        requestId === weatherRequestId.current
      ) {
        setWeatherError("Weather is unavailable right now.");
      }
    } finally {
      if (
        weatherMounted.current &&
        requestId === weatherRequestId.current
      ) {
        setWeatherLoading(false);
      }
    }
  }, [profile.lat, profile.lng]);

  // Fetch weather immediately on dashboard load.
  useEffect(() => {
    weatherMounted.current = true;
    void fetchWeather();
    return () => {
      weatherMounted.current = false;
      weatherRequestId.current += 1;
    };
  }, [fetchWeather]);

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
        const now = new Date().toISOString();
        setAdvice(data);
        setGeneratedAt(now);
        setCompleted({});
        saveAdvice({ timeline, generatedAt: now, advice: data, completed: {} });
      }
    } catch {
      setAdviceError(
        "Couldn't reach the advice service. Check your connection and try again."
      );
    } finally {
      if (loadingTimer.current) clearInterval(loadingTimer.current);
      setAdviceLoading(false);
    }
  }, [profile, timeline, weather]);

  const toggleTask = useCallback(
    (key: string) => {
      setCompleted((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        if (advice && generatedAt) {
          saveAdvice({ timeline, generatedAt, advice, completed: next });
        }
        return next;
      });
    },
    [advice, generatedAt, timeline]
  );

  useEffect(() => {
    return () => {
      if (loadingTimer.current) clearInterval(loadingTimer.current);
    };
  }, []);

  const collagePhotos = profile.vegetables
    .filter((id) => VEG_PHOTOS[id])
    .slice(0, 3)
    .map((id) => ({ id, src: VEG_PHOTOS[id] }));

  return (
    <main>
      {/* Photo hero */}
      <section className="relative h-56 sm:h-72">
        <Image
          src={HERO_HARVEST}
          alt="A trug of freshly harvested vegetables"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-earth/80 via-dark-earth/30 to-transparent" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="font-serif text-3xl text-cream sm:text-4xl">
                  Your growing dashboard
                </h1>
                <p className="text-sm font-medium text-cream/85">
                  📍 {profile.postcode} · {profile.region} ·{" "}
                  {formatCropCount(profile.vegetables.length)}
                </p>
              </div>
              <button
                type="button"
                onClick={onEdit}
                className="rounded-btn bg-cream/90 px-4 py-2 text-sm font-semibold text-dark-earth shadow-soft transition-colors hover:bg-cream"
              >
                ✏️ Edit My Setup
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <PlotSummary profile={profile} />
        </div>

        <div className="mb-6">
          <WeatherBanner
            weather={weather}
            loading={weatherLoading}
            error={weatherError}
            onRetry={fetchWeather}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-5">
            <section>
              <h2 className="mb-3 font-serif text-2xl">
                What should I be doing?
              </h2>
              <TimelineFilter value={timeline} onChange={setTimeline} />
              <button
                type="button"
                onClick={() => {
                  if (advice) {
                    setConfirmAdviceRefresh(true);
                  } else {
                    void fetchAdvice();
                  }
                }}
                disabled={adviceLoading}
                className={`mt-4 w-full rounded-btn px-8 py-4 text-lg font-semibold text-cream shadow-soft transition-colors sm:w-auto ${
                  adviceLoading
                    ? "cursor-wait bg-moss/60"
                    : "bg-moss hover:bg-dark-earth"
                }`}
              >
                {adviceLoading
                  ? loadingMessage
                  : advice
                    ? "🌱 Get Fresh Advice"
                    : "🌱 Get Growing Advice"}
              </button>
              {advice && !adviceLoading && (
                <p className="mt-2 text-sm text-moss">
                  Your saved tasks are below — tick them off as you go. Fresh
                  advice replaces the list.
                </p>
              )}
              {confirmAdviceRefresh && !adviceLoading && (
                <AdviceRefreshConfirm
                  onConfirm={() => {
                    setConfirmAdviceRefresh(false);
                    void fetchAdvice();
                  }}
                  onCancel={() => setConfirmAdviceRefresh(false)}
                />
              )}
            </section>

            {adviceError && (
              <div className="rounded-card bg-terracotta/90 p-5 text-cream shadow-soft">
                <p className="mb-3 font-medium">🥀 {adviceError}</p>
                <button
                  type="button"
                  onClick={fetchAdvice}
                  className="rounded-btn bg-cream px-4 py-2 text-sm font-semibold text-dark-earth transition-colors hover:bg-blush"
                >
                  Try again
                </button>
              </div>
            )}

            {advice && !adviceLoading && (
              <AdviceResults
                advice={advice}
                generatedAt={generatedAt}
                completed={completed}
                onToggleTask={toggleTask}
              />
            )}

            {!advice && !adviceLoading && !adviceError && (
              <div className="overflow-hidden rounded-card bg-warm-stone/50 shadow-soft">
                {collagePhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-0.5">
                    {collagePhotos.map((p) => (
                      <div key={p.id} className="relative h-28 sm:h-36">
                        <Image
                          src={p.src}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 33vw, 220px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-6 text-center">
                  <p className="text-dark-earth/80">
                    Pick a timeline and press{" "}
                    <span className="font-semibold">Get Growing Advice</span>{" "}
                    for a weather-aware task list tailored to your plot. Your
                    tasks are saved so you can tick them off over the days
                    ahead.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (stacks below on mobile) */}
          <aside className="order-last min-w-0 space-y-6 lg:order-none">
            <WeatherMap
              lat={profile.lat}
              lng={profile.lng}
              postcode={profile.postcode}
            />
            <SeasonalCalendar vegetableIds={profile.vegetables} />
          </aside>
        </div>
      </div>
    </main>
  );
}
