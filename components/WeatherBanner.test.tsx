import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { WeatherData } from "@/lib/types";
import WeatherBanner from "./WeatherBanner";

function weather(overrides: Partial<WeatherData> = {}): WeatherData {
  return {
    current: { temp: 14, description: "cloudy", icon: "03d" },
    daily: [
      {
        date: "2026-09-06",
        dayName: "Sun",
        high: 18,
        low: 9,
        conditions: "cloudy",
        icon: "03d",
        rainProbability: 20,
      },
    ],
    warnings: { rainSoon: false, frostSoon: false },
    observedAt: "2026-09-06T09:00:00Z",
    ...overrides,
  };
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("WeatherBanner", () => {
  it("announces loading through a polite status region", () => {
    render(
      <WeatherBanner weather={null} loading error={null} onRetry={vi.fn()} />,
    );

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Reading the sky over your plot…");
  });

  it("offers one retry without exposing the route error", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <WeatherBanner
        weather={null}
        loading={false}
        error="upstream returned 503"
        onRetry={onRetry}
      />,
    );

    expect(
      screen.getByText(
        "We can't load local weather right now. You can still get growing advice.",
      ),
    ).toBeVisible();
    expect(screen.queryByText(/503|upstream/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try weather again" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("renders the current reading", () => {
    render(
      <WeatherBanner
        weather={weather()}
        loading={false}
        error={null}
        onRetry={vi.fn()}
      />,
    );
    expect(screen.getByText("14°C")).toBeInTheDocument();
  });

  it("words the frost warning as a risk, matching the 3 degree threshold", () => {
    render(
      <WeatherBanner
        weather={weather({ warnings: { rainSoon: false, frostSoon: true } })}
        loading={false}
        error={null}
        onRetry={vi.fn()}
      />,
    );
    expect(
      screen.getByText(/Frost risk in the next 48 hours/),
    ).toBeInTheDocument();
  });

  it("says nothing about staleness for a fresh forecast", () => {
    render(
      <WeatherBanner
        weather={weather()}
        loading={false}
        error={null}
        onRetry={vi.fn()}
      />,
    );
    expect(
      screen.queryByText(/last forecast we could fetch/),
    ).not.toBeInTheDocument();
  });

  it("reports the age of a stale forecast", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-06T13:00:00Z"));
    render(
      <WeatherBanner
        weather={weather({ stale: true })}
        loading={false}
        error={null}
        onRetry={vi.fn()}
      />,
    );
    expect(
      screen.getByText(/last forecast we could fetch — updated 4 hours ago/),
    ).toBeInTheDocument();
  });

  it("uses the singular for a one hour old stale forecast", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-06T10:00:00Z"));
    render(
      <WeatherBanner
        weather={weather({ stale: true })}
        loading={false}
        error={null}
        onRetry={vi.fn()}
      />,
    );
    expect(screen.getByText(/updated 1 hour ago/)).toBeInTheDocument();
  });
});
