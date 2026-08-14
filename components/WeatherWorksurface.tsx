import { useId, type ReactNode } from "react";
import type { UserProfile, WeatherData } from "@/lib/types";
import GardenPortrait from "./GardenPortrait";
import WeatherBanner from "./WeatherBanner";
import { getWeatherActionCue } from "./WeatherActionCue";

interface Props {
  profile: UserProfile;
  weather: WeatherData | null;
  weatherLoading: boolean;
  weatherError: string | null;
  onRetryWeather: () => void;
  actionContent: ReactNode;
}

const MOBILE_PATH = "M 940 0 C 720 22 270 2 48 48";
const DESKTOP_PATH = "M 940 0 C 920 24 780 10 700 48";

export default function WeatherWorksurface({
  profile,
  weather,
  weatherLoading,
  weatherError,
  onRetryWeather,
  actionContent,
}: Props) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const mobileMaskId = `weather-story-mobile-${id}`;
  const desktopMaskId = `weather-story-desktop-${id}`;
  const cue =
    !weatherLoading && !weatherError ? getWeatherActionCue(weather) : null;

  return (
    <section aria-label="Weather to action" className="relative">
      <div className="relative">
        <WeatherBanner
          weather={weather}
          loading={weatherLoading}
          error={weatherError}
          onRetry={onRetryWeather}
          locationLabel={profile.postcode}
          linkedAction={Boolean(cue)}
        />

        {cue && (
          <svg
            aria-hidden="true"
            data-testid="weather-story-path"
            data-motion="once"
            focusable="false"
            className="pointer-events-none absolute inset-x-0 top-full z-10 h-20 w-full overflow-visible text-sky-blue lg:h-24"
            viewBox="0 0 1000 96"
            preserveAspectRatio="none"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <defs>
              <mask
                id={mobileMaskId}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="1000"
                height="96"
              >
                <path
                  className="weather-story-path-reveal"
                  d={MOBILE_PATH}
                  pathLength="1"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </mask>
              <mask
                id={desktopMaskId}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="1000"
                height="96"
              >
                <path
                  className="weather-story-path-reveal"
                  d={DESKTOP_PATH}
                  pathLength="1"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </mask>
            </defs>

            <path
              className="weather-story-path-visible lg:hidden"
              d={MOBILE_PATH}
              pathLength="1"
              strokeWidth="3"
              strokeDasharray="0.055 0.035"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              mask={`url(#${mobileMaskId})`}
            />
            <path
              className="weather-story-path-visible hidden lg:block"
              d={DESKTOP_PATH}
              pathLength="1"
              strokeWidth="3"
              strokeDasharray="0.055 0.035"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              mask={`url(#${desktopMaskId})`}
            />
          </svg>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)] lg:items-start">
        <div
          className={`order-1 min-w-0 lg:order-2 lg:border-l lg:border-garden-ground/25 lg:pl-6 ${
            cue ? "" : "border-t-4 border-rain-ink pt-5 lg:border-t-0 lg:pt-0"
          }`}
        >
          {actionContent}
        </div>

        <GardenPortrait
          postcode={profile.postcode}
          region={profile.region}
          vegetables={profile.vegetables}
          plotSize={profile.plotSize}
          environment={profile.environment}
          equipment={profile.equipment}
          variant="dashboard"
          className="order-2 min-w-0 lg:order-1"
        />
      </div>
    </section>
  );
}
