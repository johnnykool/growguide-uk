import { beforeEach, describe, expect, it } from "vitest";
import type { WeatherData } from "@/lib/types";
import {
  clearStoredForecasts,
  gridKey,
  readStoredForecast,
  roundToGrid,
  storeForecast,
} from "./cache";

function sampleForecast(): WeatherData {
  return {
    current: { temp: 14, description: "cloudy", icon: "03d" },
    daily: [],
    warnings: { rainSoon: false, frostSoon: false },
    observedAt: "2026-09-06T11:00Z",
  };
}

describe("roundToGrid", () => {
  it("rounds a positive coordinate to the grid", () => {
    expect(roundToGrid(51.5074)).toBe(51.51);
  });

  it("rounds a negative coordinate to the grid", () => {
    expect(roundToGrid(-0.1278)).toBe(-0.13);
  });

  it("leaves an already-aligned coordinate untouched", () => {
    expect(roundToGrid(53.8)).toBe(53.8);
  });

  it("collapses binary float noise so URLs stay clean", () => {
    // Without normalisation this is 50.120000000000005, which would be
    // sent verbatim in the upstream query string.
    expect(roundToGrid(50.1216)).toBe(50.12);
  });
});

describe("gridKey", () => {
  it("collapses two coordinates inside one cell onto one key", () => {
    expect(gridKey(51.5074, -0.1278)).toBe(gridKey(51.5081, -0.1272));
  });

  it("separates coordinates that fall either side of a cell boundary", () => {
    expect(gridKey(51.5074, -0.1278)).not.toBe(gridKey(51.5074, -0.1248));
  });

  it("keeps distant coordinates on separate keys", () => {
    expect(gridKey(51.5074, -0.1278)).not.toBe(gridKey(53.4808, -2.2426));
  });

  it("never emits negative zero", () => {
    expect(gridKey(0.001, -0.001)).toBe("0.00,0.00");
  });
});

function forecastWithDays(dates: string[]): WeatherData {
  return {
    ...sampleForecast(),
    daily: dates.map((date) => ({
      date,
      dayName: "Sun",
      high: 18,
      low: 9,
      conditions: "cloudy",
      icon: "03d",
      rainProbability: 20,
    })),
  };
}

describe("last-good store", () => {
  beforeEach(() => {
    clearStoredForecasts();
  });

  it("returns null when nothing is stored for the key", () => {
    expect(readStoredForecast("51.51,-0.13")).toBeNull();
  });

  it("returns a stored forecast marked stale", () => {
    storeForecast("51.51,-0.13", sampleForecast());
    expect(readStoredForecast("51.51,-0.13")).toMatchObject({
      stale: true,
      observedAt: "2026-09-06T11:00Z",
    });
  });

  it("does not mark the stored copy stale", () => {
    const forecast = sampleForecast();
    storeForecast("51.51,-0.13", forecast);
    readStoredForecast("51.51,-0.13");
    expect(forecast.stale).toBeUndefined();
  });

  it("keeps separate entries per key", () => {
    storeForecast("51.51,-0.13", { ...sampleForecast(), current: { temp: 1, description: "a", icon: "01d" } });
    storeForecast("53.48,-2.24", { ...sampleForecast(), current: { temp: 2, description: "b", icon: "01d" } });
    expect(readStoredForecast("51.51,-0.13")?.current.temp).toBe(1);
    expect(readStoredForecast("53.48,-2.24")?.current.temp).toBe(2);
  });

  // A stored strip was filtered against the day it was fetched. Served again
  // after midnight it would otherwise carry days that have already happened.
  it("drops days that have already passed from a stored forecast", () => {
    storeForecast(
      "51.51,-0.13",
      forecastWithDays(["2026-09-05", "2026-09-06", "2026-09-07"]),
    );

    const served = readStoredForecast(
      "51.51,-0.13",
      Date.parse("2026-09-06T09:00:00Z"),
    );

    expect(served?.daily.map((day) => day.date)).toEqual([
      "2026-09-06",
      "2026-09-07",
    ]);
  });

  it("leaves the stored strip intact when every day is still ahead", () => {
    storeForecast("51.51,-0.13", forecastWithDays(["2026-09-06", "2026-09-07"]));

    const served = readStoredForecast(
      "51.51,-0.13",
      Date.parse("2026-09-06T09:00:00Z"),
    );

    expect(served?.daily).toHaveLength(2);
  });

  it("does not shorten the stored copy when serving a filtered one", () => {
    const forecast = forecastWithDays(["2026-09-05", "2026-09-06"]);
    storeForecast("51.51,-0.13", forecast);

    readStoredForecast("51.51,-0.13", Date.parse("2026-09-06T09:00:00Z"));

    expect(forecast.daily).toHaveLength(2);
  });

  it("deep-clones nested objects so mutations do not corrupt the stored record", () => {
    storeForecast("51.51,-0.13", sampleForecast());
    const copy = readStoredForecast("51.51,-0.13");
    if (copy) {
      copy.current.temp = 999;
    }
    const secondRead = readStoredForecast("51.51,-0.13");
    expect(secondRead?.current.temp).toBe(14); // original value, not 999
  });
});
