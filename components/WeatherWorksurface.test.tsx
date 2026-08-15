import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { UserProfile, WeatherData } from "@/lib/types";
import WeatherWorksurface from "./WeatherWorksurface";

afterEach(cleanup);

const profile: UserProfile = {
  postcode: "BS1 5AH",
  lat: 51.4545,
  lng: -2.5879,
  region: "South West England",
  vegetables: ["tomato", "carrot"],
  plotSize: "small",
  environment: ["raised-beds"],
  equipment: ["trowel"],
  lastUpdated: "2026-08-08T09:00:00.000Z",
};

const weather: WeatherData = {
  current: { temp: 16, description: "light rain", icon: "10d" },
  daily: [
    { date: "2026-08-14", dayName: "Fri", high: 17, low: 10, conditions: "light rain", icon: "10d", rainProbability: 70 },
    { date: "2026-08-15", dayName: "Sat", high: 18, low: 11, conditions: "cloudy", icon: "04d", rainProbability: 30 },
    { date: "2026-08-16", dayName: "Sun", high: 20, low: 12, conditions: "clear sky", icon: "01d", rainProbability: 10 },
    { date: "2026-08-17", dayName: "Mon", high: 19, low: 12, conditions: "cloudy", icon: "04d", rainProbability: 20 },
    { date: "2026-08-18", dayName: "Tue", high: 18, low: 11, conditions: "light rain", icon: "10d", rainProbability: 60 },
  ],
  warnings: { rainSoon: true, frostSoon: false },
};

function renderWorksurface(
  nextWeather: WeatherData | null,
  {
    loading = false,
    error = null,
  }: { loading?: boolean; error?: string | null } = {},
) {
  return render(
    <WeatherWorksurface
      profile={profile}
      weather={nextWeather}
      weatherLoading={loading}
      weatherError={error}
      onRetryWeather={vi.fn()}
      actionContent={
        <>
          <h2>What needs doing</h2>
          <button type="button">Get growing advice</button>
        </>
      }
    />,
  );
}

describe("WeatherWorksurface", () => {
  it("joins a real rain forecast to its matching action with one visible path", () => {
    renderWorksurface(weather);

    expect(
      screen.getByRole("region", { name: "Weather to action" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Your garden portrait" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "What needs doing" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Local forecast" }),
    ).toHaveClass("weather-story-source");
    const cue = screen.getByRole("note", { name: "Weather-linked action" });
    expect(cue).toHaveAttribute("data-weather-target", "rain");
    expect(
      cue.compareDocumentPosition(
        screen.getByRole("heading", { name: "What needs doing" }),
      ) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    const responsivePaths = [
      screen.getByTestId("weather-story-path-mobile"),
      screen.getByTestId("weather-story-path"),
    ];
    expect(responsivePaths).toHaveLength(2);
    for (const path of responsivePaths) {
      expect(path.tagName).toBe("path");
      expect(path).toHaveAttribute("data-motion", "once");
      expect(path).toHaveAttribute("pathLength", "1");
      expect(path).toHaveAttribute("stroke-width", "3");
    }
  });

  it("does not imply a weather action before weather is available", () => {
    renderWorksurface(null);

    expect(screen.queryByTestId("weather-story-path")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Local forecast" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("note", { name: "Weather-linked action" }),
    ).not.toBeInTheDocument();
  });

  it("does not draw a path when the forecast has no warning", () => {
    renderWorksurface({
      ...weather,
      warnings: { rainSoon: false, frostSoon: false },
    });

    expect(screen.queryByTestId("weather-story-path")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("note", { name: "Weather-linked action" }),
    ).not.toBeInTheDocument();
  });

  it.each([
    { state: "loading", loading: true, error: null },
    {
      state: "error",
      loading: false,
      error: "Weather is unavailable right now.",
    },
  ])(
    "suppresses both path and cue while weather is $state",
    ({ loading, error }) => {
      renderWorksurface(weather, { loading, error });

      expect(
        screen.queryByTestId("weather-story-path"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("note", { name: "Weather-linked action" }),
      ).not.toBeInTheDocument();
    },
  );
});
