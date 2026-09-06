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
});
