"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AdviceResponse,
  Timeline,
  UserProfile,
  WeatherData,
} from "@/lib/types";
import {
  getAdviceProfileFingerprint,
  loadSavedAdvice,
  saveAdvice,
} from "@/lib/storage";
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

const ADVICE_UNAVAILABLE_MESSAGE =
  "We can't generate growing advice right now. Please try again.";

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
  const [adviceStorageWarning, setAdviceStorageWarning] = useState(false);
  const [confirmAdviceRefresh, setConfirmAdviceRefresh] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const adviceLoadingStatus = useRef<HTMLParagraphElement | null>(null);
  const loadingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const adviceMounted = useRef(false);
  const adviceRequestId = useRef(0);
  const adviceAbortController = useRef<AbortController | null>(null);
  const profileFingerprint = getAdviceProfileFingerprint(profile);

  // Restore the last advice session so returning users see their task list
  // without another AI call.
  useEffect(() => {
    adviceMounted.current = true;
    setAdvice(null);
    setGeneratedAt(undefined);
    setCompleted({});
    setAdviceLoading(false);
    setAdviceError(null);
    setAdviceStorageWarning(false);
    setConfirmAdviceRefresh(false);
    const saved = loadSavedAdvice(profileFingerprint);
    if (saved) {
      setAdvice(saved.advice);
      setTimeline(saved.timeline);
      setGeneratedAt(saved.generatedAt);
      setCompleted(saved.completed ?? {});
    }
    return () => {
      adviceMounted.current = false;
      adviceRequestId.current += 1;
      adviceAbortController.current?.abort();
      adviceAbortController.current = null;
      if (loadingTimer.current) {
        clearInterval(loadingTimer.current);
        loadingTimer.current = null;
      }
    };
  }, [profileFingerprint]);

  useEffect(() => {
    if (adviceLoading) adviceLoadingStatus.current?.focus();
  }, [adviceLoading]);

  const fetchWeather = useCallback(async () => {
    if (!weatherMounted.current) return;
    const requestId = ++weatherRequestId.current;
    setWeatherLoading(true);
    setWeatherError(null);
    setWeather(null);
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
    if (!adviceMounted.current) return;
    adviceAbortController.current?.abort();
    const controller = new AbortController();
    adviceAbortController.current = controller;
    const requestId = ++adviceRequestId.current;
    const isCurrentRequest = () =>
      adviceMounted.current && requestId === adviceRequestId.current;

    setAdviceLoading(true);
    setAdviceError(null);
    let i = 0;
    setLoadingMessage(LOADING_MESSAGES[0]);
    const timer = setInterval(() => {
      if (!isCurrentRequest()) return;
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[i]);
    }, 2500);
    loadingTimer.current = timer;

    try {
      const res = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          region: profile.region,
          vegetables: profile.vegetables,
          plotSize: profile.plotSize,
          environment: profile.environment,
          equipment: profile.equipment,
          timeline,
          weather,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!isCurrentRequest()) return;
      if (!res.ok || !data) {
        setAdviceError(
          res.status === 504
            ? "The advice took too long to generate — try a shorter timeline or fewer vegetables, then try again."
            : res.status >= 500
              ? ADVICE_UNAVAILABLE_MESSAGE
              : data?.error ?? "Something went wrong generating advice."
        );
      } else {
        const now = new Date().toISOString();
        setAdvice(data);
        setGeneratedAt(now);
        setCompleted({});
        const saved = saveAdvice(
          {
            profileFingerprint,
            timeline,
            generatedAt: now,
            advice: data,
            completed: {},
          },
          profile,
        );
        setAdviceStorageWarning(!saved);
      }
    } catch (error) {
      if (
        isCurrentRequest() &&
        !(error instanceof DOMException && error.name === "AbortError")
      ) {
        setAdviceError(
          "Couldn't reach the advice service. Check your connection and try again."
        );
      }
    } finally {
      clearInterval(timer);
      if (loadingTimer.current === timer) loadingTimer.current = null;
      if (isCurrentRequest()) {
        adviceAbortController.current = null;
        setAdviceLoading(false);
      }
    }
  }, [profile, profileFingerprint, timeline, weather]);

  const toggleTask = useCallback(
    (key: string) => {
      const next = { ...completed, [key]: !completed[key] };
      setCompleted(next);
      if (advice && generatedAt) {
        const saved = saveAdvice(
          { profileFingerprint, timeline, generatedAt, advice, completed: next },
          profile,
        );
        setAdviceStorageWarning(!saved);
      }
    },
    [advice, completed, generatedAt, profile, profileFingerprint, timeline]
  );

  return (
    <main className="bg-pale-mineral text-garden-ground">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="border-b border-garden-ground/25 pb-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rain-ink">
                Your growing dashboard
              </p>
              <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight text-garden-ground sm:text-5xl">
                Weather, translated into action.
              </h1>
              <p className="mt-3 text-sm font-medium text-garden-ground/75">
                {profile.postcode} · {profile.region} ·{" "}
                {formatCropCount(profile.vegetables.length)}
              </p>
            </div>
            <button
              type="button"
              onClick={onEdit}
              className="min-h-11 self-start border border-garden-ground/40 bg-pale-mineral px-4 py-2 text-sm font-semibold text-garden-ground transition-colors hover:bg-garden-ground hover:text-pale-mineral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral sm:self-auto"
            >
              Edit setup
            </button>
          </div>
        </section>

        <div className="mt-6">
          <WeatherBanner
            weather={weather}
            loading={weatherLoading}
            error={weatherError}
            onRetry={fetchWeather}
            locationLabel={profile.postcode}
          />
        </div>

        <div className="dashboard-workspace mt-8 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(20rem,2fr)] lg:items-start">
          <div className="order-2 min-w-0 space-y-6 lg:order-1">
            <PlotSummary profile={profile} />
            <WeatherMap
              lat={profile.lat}
              lng={profile.lng}
              postcode={profile.postcode}
            />
          </div>

          <section
            aria-label="What needs doing"
            className="order-1 min-w-0 border-t-4 border-rain-ink bg-pale-mineral pt-5 lg:order-2 lg:border-l lg:border-t-0 lg:border-l-garden-ground/25 lg:pl-8 lg:pt-0"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rain-ink">
                Priorities
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-garden-ground">
                What needs doing
              </h2>
              <p className="mt-2 text-sm text-garden-ground/70">
                Choose a timeframe for practical, weather-aware tasks.
              </p>
              <div className="mt-5">
                <TimelineFilter value={timeline} onChange={setTimeline} />
              </div>
              {adviceLoading ? (
                <p
                  ref={adviceLoadingStatus}
                  role="status"
                  aria-label="Generating growing advice"
                  aria-live="polite"
                  tabIndex={-1}
                  className="mt-5 w-full cursor-wait bg-garden-ground px-6 py-3 text-base font-semibold text-pale-mineral focus:outline-none focus:ring-2 focus:ring-garden-ground focus:ring-offset-2 focus:ring-offset-pale-mineral sm:w-fit"
                >
                  {loadingMessage}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (advice) {
                      setConfirmAdviceRefresh(true);
                    } else {
                      void fetchAdvice();
                    }
                  }}
                  className="mt-5 min-h-11 w-full bg-rain-ink px-6 py-3 text-base font-semibold text-pale-mineral transition-colors hover:bg-garden-ground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral sm:w-auto"
                >
                  {advice ? "Get fresh advice" : "Get growing advice"}
                </button>
              )}
              {advice && !adviceLoading && (
                adviceStorageWarning ? (
                  <p
                    role="alert"
                    aria-label="Advice wasn't saved in this browser."
                    className="mt-3 text-sm font-semibold text-ember-ink"
                  >
                    Advice wasn&apos;t saved in this browser.
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-garden-ground/70">
                    Your saved tasks are below — tick them off as you go. Fresh
                    advice replaces the list.
                  </p>
                )
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
            </div>

            {adviceError && (
              <div className="mt-5 border-l-4 border-ember bg-pale-mineral p-5 text-ember-ink ring-1 ring-ember-ink/30">
                <p className="mb-3 font-medium">{adviceError}</p>
                <button
                  type="button"
                  onClick={fetchAdvice}
                  className="min-h-11 border border-ember-ink px-4 py-2 text-sm font-semibold text-ember-ink transition-colors hover:bg-ember hover:text-pale-mineral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral"
                >
                  Try again
                </button>
              </div>
            )}

            {advice && !adviceLoading && (
              <div className="mt-6">
                <AdviceResults
                  advice={advice}
                  generatedAt={generatedAt}
                  completed={completed}
                  onToggleTask={toggleTask}
                />
              </div>
            )}

            {!advice && !adviceLoading && !adviceError && (
              <p className="mt-6 border-t border-garden-ground/20 pt-4 text-sm leading-relaxed text-garden-ground/70">
                Your task list is saved on this device so you can tick off work
                as you go.
              </p>
            )}
          </section>
        </div>

        <div className="mt-10 border-t border-garden-ground/25 pt-5">
          <SeasonalCalendar vegetableIds={profile.vegetables} />
        </div>
      </div>
    </main>
  );
}
