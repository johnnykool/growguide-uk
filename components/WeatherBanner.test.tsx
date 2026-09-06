import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { WeatherData } from "@/lib/types";
import WeatherBanner from "./WeatherBanner";

function weather(overrides: Partial<WeatherData> = {}): WeatherData {
  return {
    current: { temp: 14, description: "cloudy", icon: "03d" },
    daily: [
      { date: "2026-09-06", dayName: "Sun", high: 18, low: 9, conditions: "cloudy", icon: "03d", rainProbability: 20 },
    ],
    warnings: { rainSoon: false, frostSoon: false },
    observedAt: "2026-09-06T09:00:00Z",
    ...overrides,
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("WeatherBanner", () => {
  it("renders the current reading", () => {
    render(<WeatherBanner weather={weather()} loading={false} error={null} />);
    expect(screen.getByText("14°C")).toBeInTheDocument();
  });

  it("words the frost warning as a risk, matching the 3 degree threshold", () => {
    render(
      <WeatherBanner
        weather={weather({ warnings: { rainSoon: false, frostSoon: true } })}
        loading={false}
        error={null}
      />
    );
    expect(screen.getByText(/Frost risk in the next 48 hours/)).toBeInTheDocument();
  });

  it("says nothing about staleness for a fresh forecast", () => {
    render(<WeatherBanner weather={weather()} loading={false} error={null} />);
    expect(screen.queryByText(/last forecast we could fetch/)).not.toBeInTheDocument();
  });

  it("reports the age of a stale forecast", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-06T13:00:00Z"));
    render(
      <WeatherBanner weather={weather({ stale: true })} loading={false} error={null} />
    );
    expect(screen.getByText(/last forecast we could fetch — updated 4 hours ago/)).toBeInTheDocument();
  });

  it("uses the singular for a one hour old stale forecast", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-06T10:00:00Z"));
    render(
      <WeatherBanner weather={weather({ stale: true })} loading={false} error={null} />
    );
    expect(screen.getByText(/updated 1 hour ago/)).toBeInTheDocument();
  });

  it("still shows the unavailable state on error", () => {
    render(<WeatherBanner weather={null} loading={false} error="boom" />);
    expect(screen.getByText(/Weather is unavailable right now/)).toBeInTheDocument();
  });
});
