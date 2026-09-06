const BASE_URL = "https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point";

// Three hours. The dominant lever on the 360 calls/day free tier.
export const CACHE_SECONDS = 10800;

// The Met Office marks unavailable values with -99 rather than omitting them.
const NOT_AVAILABLE = -99;

export interface MetOfficeDailyEntry {
  time: string;
  dayMaxScreenTemperature?: number;
  nightMinScreenTemperature?: number;
  daySignificantWeatherCode?: number;
  nightSignificantWeatherCode?: number;
  dayProbabilityOfRain?: number;
  nightProbabilityOfRain?: number;
}

export interface MetOfficeHourlyEntry {
  time: string;
  screenTemperature?: number;
  minScreenAirTemp?: number;
  significantWeatherCode?: number;
  probOfPrecipitation?: number;
}

export interface MetOfficeForecast {
  daily: MetOfficeDailyEntry[];
  hourly: MetOfficeHourlyEntry[];
  modelRunDate: string;
}

interface MetOfficeResponse {
  features?: {
    properties?: {
      modelRunDate?: string;
      timeSeries?: Record<string, unknown>[];
    };
  }[];
}

export class MetOfficeError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "MetOfficeError";
    this.status = status;
  }
}

function stripSentinels<T>(entry: Record<string, unknown>): T {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(entry)) {
    if (value === NOT_AVAILABLE) continue;
    cleaned[key] = value;
  }
  return cleaned as T;
}

function seriesFrom<T>(body: MetOfficeResponse): T[] {
  const series = body?.features?.[0]?.properties?.timeSeries;
  if (!Array.isArray(series) || series.length === 0) {
    throw new MetOfficeError("Weather service returned no forecast data.", 502);
  }
  return series.map((entry) => stripSentinels<T>(entry));
}

async function getSeries(
  endpoint: "daily" | "hourly",
  lat: number,
  lng: number,
  apiKey: string
): Promise<MetOfficeResponse> {
  const url = `${BASE_URL}/${endpoint}?latitude=${lat}&longitude=${lng}`;
  // Auth travels in the `apikey` header, not `Authorization`, and that
  // choice is load-bearing: Next's Data Cache only caches this fetch because
  // it looks cacheable. An `Authorization: Bearer ...` header trips Next's
  // autoNoCache heuristic and silently disables caching for the request —
  // no error, no failing test, just a jump from ~16 calls/location/day to 2
  // per page load against the 360/day quota. Do not "tidy" this to Bearer.
  const response = await fetch(url, {
    headers: { apikey: apiKey, accept: "application/json" },
    next: { revalidate: CACHE_SECONDS },
  });
  if (!response.ok) {
    throw new MetOfficeError(
      `Weather service returned an error (${response.status}).`,
      response.status
    );
  }
  return (await response.json()) as MetOfficeResponse;
}

export async function fetchForecast(
  lat: number,
  lng: number,
  apiKey: string
): Promise<MetOfficeForecast> {
  const [dailyBody, hourlyBody] = await Promise.all([
    getSeries("daily", lat, lng, apiKey),
    getSeries("hourly", lat, lng, apiKey),
  ]);

  return {
    daily: seriesFrom<MetOfficeDailyEntry>(dailyBody),
    hourly: seriesFrom<MetOfficeHourlyEntry>(hourlyBody),
    modelRunDate:
      dailyBody?.features?.[0]?.properties?.modelRunDate ??
      new Date().toISOString(),
  };
}
