import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WeatherData } from "@/lib/types";
import WeatherBanner from "./WeatherBanner";

afterEach(cleanup);

const weather: WeatherData = {
  current: { temp: 19, description: "broken clouds", icon: "04d" },
  daily: [
    {
      date: "2026-08-11",
      dayName: "Tue",
      high: 17,
      low: 9,
      conditions: "light rain",
      icon: "10d",
      rainProbability: 60,
    },
    {
      date: "2026-08-12",
      dayName: "Wed",
      high: 20,
      low: 11,
      conditions: "clear sky",
      icon: "01d",
      rainProbability: 10,
    },
  ],
  warnings: { rainSoon: true, frostSoon: false },
};

describe("WeatherBanner", () => {
  it("connects the local forecast to weather-sensitive garden tasks", () => {
    render(
      <WeatherBanner
        weather={weather}
        loading={false}
        error={null}
        onRetry={vi.fn()}
        locationLabel="BS1 5AH"
      />,
    );

    expect(
      screen.getByRole("region", { name: "Local forecast" }),
    ).toBeVisible();
    expect(screen.getByText("BS1 5AH")).toBeVisible();
    expect(screen.getByText("19°C")).toBeVisible();
    expect(
      screen.getByRole("listitem", {
        name: "Tue: high 17°, low 9°, 60% rain",
      }),
    ).toBeVisible();
    expect(screen.getByText("Rain may change your next tasks")).toBeVisible();
  });

  it("announces loading through a polite status region", () => {
    render(
      <WeatherBanner
        weather={null}
        loading
        error={null}
        onRetry={vi.fn()}
        locationLabel="BS1 5AH"
      />,
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
        locationLabel="BS1 5AH"
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
});
