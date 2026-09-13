import type { WeatherData } from "@/lib/types";
import { dropPastDays } from "./normalise";

// Roughly 1.1 km north to south, 0.7 km east to west at UK latitudes.
// Chosen for accuracy, not quota: forecast sites sit a few hundred metres
// apart, so coarser cells would hand a user a different site than their own.
export const GRID_DEGREES = 0.01;

export function roundToGrid(value: number): number {
  // toFixed collapses binary float noise. Without it, roughly one UK latitude
  // in six lands on a value like 50.120000000000005, which would be sent
  // verbatim in the upstream query string.
  return Number((Math.round(value / GRID_DEGREES) * GRID_DEGREES).toFixed(2));
}

export function gridKey(lat: number, lng: number): string {
  // Adding zero collapses negative zero, which would otherwise key as "-0.00".
  const format = (value: number) => (roundToGrid(value) + 0).toFixed(2);
  return `${format(lat)},${format(lng)}`;
}

const lastGood = new Map<string, WeatherData>();

export function storeForecast(key: string, data: WeatherData): void {
  lastGood.set(key, data);
}

export function readStoredForecast(
  key: string,
  now: number = Date.now(),
): WeatherData | null {
  const stored = lastGood.get(key);
  if (!stored) return null;
  // Deep clone, not a spread: a shallow copy would leave `current`, `daily`
  // and `warnings` aliased to the stored record, so a caller mutating those
  // would corrupt the last-good entry for this cell.
  //
  // The strip is re-filtered on the way out because it was built against the
  // day it was fetched: served after midnight it would otherwise offer days
  // that have already happened. Callers must handle an empty result.
  return { ...dropPastDays(structuredClone(stored), now), stale: true };
}

export function clearStoredForecasts(): void {
  lastGood.clear();
}
