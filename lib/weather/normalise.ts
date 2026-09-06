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
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(
    new Date(now)
  );
}

function dayName(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
  });
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

function nearestHour(
  hourly: MetOfficeHourlyEntry[],
  now: number
): MetOfficeHourlyEntry | undefined {
  let nearest: MetOfficeHourlyEntry | undefined;
  let smallestGap = Number.POSITIVE_INFINITY;
  for (const entry of hourly) {
    const gap = Math.abs(Date.parse(entry.time) - now);
    if (gap < smallestGap) {
      smallestGap = gap;
      nearest = entry;
    }
  }
  return nearest;
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
    frostSoon: window.some(
      (entry) =>
        entry.minScreenAirTemp !== undefined &&
        entry.minScreenAirTemp <= FROST_CELSIUS
    ),
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
