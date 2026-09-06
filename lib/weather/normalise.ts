import type { DailySummary, WeatherData } from "@/lib/types";
import { describeWeatherCode } from "./codes";
import type {
  MetOfficeDailyEntry,
  MetOfficeForecast,
  MetOfficeHourlyEntry,
} from "./metoffice";

// Ground frost forms while screen temperature, measured at 1.25 m, is still
// near 3-4 C. Warning at 1 C, as the OpenWeatherMap route did, missed real
// frosts.
export const FROST_CELSIUS = 3;
export const RAIN_PROBABILITY_PERCENT = 50;
export const WARNING_WINDOW_HOURS = 48;
export const FORECAST_DAYS = 5;

function isoDate(time: string): string {
  return time.slice(0, 10);
}

// The upstream day is already a local day, so no bucketing is needed. Today is
// resolved in UK time so the strip does not drop a day around midnight in BST.
function londonToday(now: number): string {
  // en-CA's default order happens to be YYYY-MM-DD, but that's a locale
  // default, not a contract — an ICU build that falls back to en-US would
  // change the shape and silently empty the daily strip's date filter.
  // Spelling out year/month/day pins the output to YYYY-MM-DD regardless.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(now));
}

// Zone pinned to London so the weekday matches the London date sitting
// beside it, regardless of which zone the server process runs in.
function dayName(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    timeZone: "Europe/London",
  }).format(new Date(`${date}T12:00:00Z`));
}

function summarise(entry: MetOfficeDailyEntry): DailySummary | null {
  const high = entry.dayMaxScreenTemperature;
  const low = entry.nightMinScreenTemperature;
  if (high === undefined || low === undefined) return null;

  const date = isoDate(entry.time);
  const { description, icon } = describeWeatherCode(
    entry.daySignificantWeatherCode
  );

  return {
    date,
    dayName: dayName(date),
    high: Math.round(high),
    low: Math.round(low),
    conditions: description,
    icon,
    rainProbability: Math.round(
      Math.max(entry.dayProbabilityOfRain ?? 0, entry.nightProbabilityOfRain ?? 0)
    ),
  };
}

function nearestBy(
  hourly: MetOfficeHourlyEntry[],
  now: number,
  predicate: (entry: MetOfficeHourlyEntry) => boolean
): MetOfficeHourlyEntry | undefined {
  let nearest: MetOfficeHourlyEntry | undefined;
  let smallestGap = Number.POSITIVE_INFINITY;
  for (const entry of hourly) {
    if (!predicate(entry)) continue;
    const gap = Math.abs(Date.parse(entry.time) - now);
    if (gap < smallestGap) {
      smallestGap = gap;
      nearest = entry;
    }
  }
  return nearest;
}

// Prefers the nearest entry that actually carries a screenTemperature — the
// Met Office's -99 sentinel is already stripped to undefined by the time this
// runs, so an entry can be present with every other field but that one
// missing. Falling back to "nearest overall" only when nothing in the series
// has a reading avoids ever reporting 0 C in place of a missing value.
function nearestHour(
  hourly: MetOfficeHourlyEntry[],
  now: number
): MetOfficeHourlyEntry | undefined {
  return (
    nearestBy(hourly, now, (entry) => entry.screenTemperature !== undefined) ??
    nearestBy(hourly, now, () => true)
  );
}

function warningsFrom(hourly: MetOfficeHourlyEntry[], now: number) {
  const cutoff = now + WARNING_WINDOW_HOURS * 3_600_000;
  const window = hourly.filter((entry) => {
    const at = Date.parse(entry.time);
    return at >= now && at <= cutoff;
  });

  return {
    rainSoon: window.some(
      (entry) => (entry.probOfPrecipitation ?? 0) >= RAIN_PROBABILITY_PERCENT
    ),
    frostSoon: window.some((entry) => {
      // Fall back to screenTemperature when minScreenAirTemp is missing (the
      // Met Office omitted it, or it arrived as the -99 sentinel) so a
      // near-freezing reading still raises the warning instead of silently
      // passing frost by.
      const reading = entry.minScreenAirTemp ?? entry.screenTemperature;
      return reading !== undefined && reading <= FROST_CELSIUS;
    }),
  };
}

export function normaliseForecast(
  forecast: MetOfficeForecast,
  now: number = Date.now()
): WeatherData {
  const today = londonToday(now);
  const current = nearestHour(forecast.hourly, now);
  const { description, icon } = describeWeatherCode(
    current?.significantWeatherCode
  );

  const daily = forecast.daily
    .filter((entry) => isoDate(entry.time) >= today)
    .map(summarise)
    .filter((day): day is DailySummary => day !== null)
    .slice(0, FORECAST_DAYS);

  return {
    current: {
      temp: Math.round(current?.screenTemperature ?? 0),
      description,
      icon,
    },
    daily,
    warnings: warningsFrom(forecast.hourly, now),
    observedAt: forecast.modelRunDate,
  };
}
