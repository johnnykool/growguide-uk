# Met Office DataHub Forecast Swap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace OpenWeatherMap's 5-day/3-hour forecast with the Met Office DataHub Site Specific API, fixing five accuracy defects while leaving the `WeatherData` contract stable.

**Architecture:** The single inline route splits into four focused modules under `lib/weather/` — a weather-code table, a grid-rounding and last-good store, an upstream client, and a normaliser — leaving `app/api/weather/route.ts` as thin request handling. OpenWeatherMap stays only for map tiles.

**Tech Stack:** Next.js 14 App Router, TypeScript (strict), Vitest with jsdom, Testing Library.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-05-metoffice-forecast-swap-design.md`. Read it before Task 2.
- Base URL: `https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point`, key in an `apikey` request header.
- Env var: `METOFFICE_API_KEY`. Server-side only — never prefix with `NEXT_PUBLIC_`.
- `OPENWEATHERMAP_API_KEY` stays, used only by `app/api/weather-tiles/[...tile]/route.ts`. Do not modify that route.
- Cache lifetime: 10800 seconds (3 hours). Grid resolution: 0.01 degrees.
- Frost threshold: 3 °C. Rain threshold: 50 percent. Warning window: 48 hours. Forecast strip: 5 days.
- `-99` is the upstream not-available sentinel and must be stripped at the client boundary.
- TypeScript is `strict: true`. `resolveJsonModule` is already enabled.
- Vitest config does not set `globals: true` — every test file must import `describe`, `it`, `expect`, `vi` from `vitest`.
- Path alias `@/*` maps to the project root.
- Fixtures already exist: `lib/weather/__fixtures__/metoffice-daily.json` and `metoffice-hourly.json`, captured live on 6 September 2026 for latitude 51.5074, longitude -0.1278.

---

### Task 1: Test infrastructure

`main` has no test runner. This task adds Vitest using the same versions and configuration already proven on the `codex/growguide-true-rebuild` branch, so the two branches converge.

**Files:**
- Create: `vitest.config.mts`
- Create: `vitest.setup.ts`
- Create: `lib/weather/smoke.test.ts` (temporary, deleted in Step 6)
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm test` runs Vitest once; `npm run test:watch` watches. Test files resolve `@/` to the project root and run in jsdom.

- [ ] **Step 1: Add dependencies and scripts**

Add to `package.json` `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Add to `package.json` `devDependencies`:

```json
"@testing-library/jest-dom": "6.6.3",
"@testing-library/react": "^16.3.2",
"@vitejs/plugin-react": "4.3.4",
"jsdom": "24.1.3",
"vitest": "2.1.9"
```

- [ ] **Step 2: Install**

Run: `npm install`
Expected: completes without peer-dependency errors.

- [ ] **Step 3: Create `vitest.config.mts`**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
  },
  resolve: {
    alias: { "@": path.resolve(projectRoot, ".") },
  },
});
```

- [ ] **Step 4: Create `vitest.setup.ts`**

```typescript
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Create a temporary smoke test proving config works**

Create `lib/weather/smoke.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import daily from "./__fixtures__/metoffice-daily.json";

describe("test infrastructure", () => {
  it("loads JSON fixtures through the @ alias config", () => {
    expect(daily.features[0].properties.timeSeries.length).toBe(8);
  });
});
```

- [ ] **Step 6: Run it, then delete it**

Run: `npm test`
Expected: 1 passing test.

Then delete `lib/weather/smoke.test.ts` — it exists only to prove the harness works.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.mts vitest.setup.ts
git commit -m "test: add vitest matching the sibling branch config"
```

---

### Task 2: Weather code table

Maps Met Office `significantWeatherCode` (0–30, with 4 unused) to a description and an OpenWeatherMap-style icon code, so `WeatherBanner.weatherEmoji` keeps working unchanged.

**Files:**
- Create: `lib/weather/codes.ts`
- Test: `lib/weather/codes.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `describeWeatherCode(code: number | undefined): WeatherDescription` where `interface WeatherDescription { description: string; icon: string }`. Also exports `UNKNOWN_WEATHER: WeatherDescription`.

- [ ] **Step 1: Write the failing test**

Create `lib/weather/codes.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { describeWeatherCode, UNKNOWN_WEATHER } from "./codes";

describe("describeWeatherCode", () => {
  it("maps a day code to a day icon", () => {
    expect(describeWeatherCode(1)).toEqual({ description: "sunny", icon: "01d" });
  });

  it("maps a night code to a night icon", () => {
    expect(describeWeatherCode(0)).toEqual({ description: "clear night", icon: "01n" });
  });

  it("distinguishes the day and night variants of one condition", () => {
    expect(describeWeatherCode(9).icon).toBe("09n");
    expect(describeWeatherCode(10).icon).toBe("09d");
  });

  it("returns the fallback for code 4, which the Met Office does not use", () => {
    expect(describeWeatherCode(4)).toEqual(UNKNOWN_WEATHER);
  });

  it("returns the fallback for an out-of-range code", () => {
    expect(describeWeatherCode(99)).toEqual(UNKNOWN_WEATHER);
  });

  it("returns the fallback for a missing code", () => {
    expect(describeWeatherCode(undefined)).toEqual(UNKNOWN_WEATHER);
  });

  it("defines every code from 0 to 30 except 4", () => {
    const missing: number[] = [];
    for (let code = 0; code <= 30; code += 1) {
      if (code === 4) continue;
      if (describeWeatherCode(code) === UNKNOWN_WEATHER) missing.push(code);
    }
    expect(missing).toEqual([]);
  });

  it("only emits icon codes WeatherBanner can render", () => {
    const renderable = new Set(["01", "02", "03", "04", "09", "10", "11", "13", "50"]);
    for (let code = 0; code <= 30; code += 1) {
      const { icon } = describeWeatherCode(code);
      expect(renderable.has(icon.slice(0, 2))).toBe(true);
      expect(["d", "n"]).toContain(icon.slice(2));
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- codes`
Expected: FAIL — cannot resolve `./codes`.

- [ ] **Step 3: Write the implementation**

Create `lib/weather/codes.ts`:

```typescript
export interface WeatherDescription {
  description: string;
  icon: string;
}

export const UNKNOWN_WEATHER: WeatherDescription = {
  description: "unknown",
  icon: "01d",
};

// Met Office significant weather codes. 4 is not used by the API.
// Icons reuse OpenWeatherMap's codes so WeatherBanner needs no change.
const WEATHER_CODES: Record<number, WeatherDescription> = {
  0: { description: "clear night", icon: "01n" },
  1: { description: "sunny", icon: "01d" },
  2: { description: "partly cloudy", icon: "02n" },
  3: { description: "partly cloudy", icon: "02d" },
  5: { description: "mist", icon: "50d" },
  6: { description: "fog", icon: "50d" },
  7: { description: "cloudy", icon: "03d" },
  8: { description: "overcast", icon: "04d" },
  9: { description: "light rain shower", icon: "09n" },
  10: { description: "light rain shower", icon: "09d" },
  11: { description: "drizzle", icon: "09d" },
  12: { description: "light rain", icon: "10d" },
  13: { description: "heavy rain shower", icon: "09n" },
  14: { description: "heavy rain shower", icon: "09d" },
  15: { description: "heavy rain", icon: "10d" },
  16: { description: "sleet shower", icon: "13n" },
  17: { description: "sleet shower", icon: "13d" },
  18: { description: "sleet", icon: "13d" },
  19: { description: "hail shower", icon: "13n" },
  20: { description: "hail shower", icon: "13d" },
  21: { description: "hail", icon: "13d" },
  22: { description: "light snow shower", icon: "13n" },
  23: { description: "light snow shower", icon: "13d" },
  24: { description: "light snow", icon: "13d" },
  25: { description: "heavy snow shower", icon: "13n" },
  26: { description: "heavy snow shower", icon: "13d" },
  27: { description: "heavy snow", icon: "13d" },
  28: { description: "thunder shower", icon: "11n" },
  29: { description: "thunder shower", icon: "11d" },
  30: { description: "thunder", icon: "11d" },
};

export function describeWeatherCode(
  code: number | undefined
): WeatherDescription {
  if (code === undefined) return UNKNOWN_WEATHER;
  return WEATHER_CODES[code] ?? UNKNOWN_WEATHER;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- codes`
Expected: 7 passing.

- [ ] **Step 5: Commit**

```bash
git add lib/weather/codes.ts lib/weather/codes.test.ts
git commit -m "feat: map Met Office significant weather codes to icons"
```

---

### Task 3: Grid rounding and last-good store

Rounds coordinates to 0.01 degrees for the upstream call, and keeps the most recent successful payload per cell so the route can serve something when the daily quota is exhausted.

**Files:**
- Modify: `lib/types.ts:32-50`
- Create: `lib/weather/cache.ts`
- Test: `lib/weather/cache.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `WeatherData` widened with required `observedAt: string` and optional `stale?: boolean` — Tasks 5, 6 and 7 all rely on both. Also `GRID_DEGREES: number`, `roundToGrid(value: number): number`, `gridKey(lat: number, lng: number): string`, `storeForecast(key: string, data: WeatherData): void`, `readStoredForecast(key: string): WeatherData | null`, `clearStoredForecasts(): void`.

- [ ] **Step 1: Widen the WeatherData type**

The store below marks a payload stale, so the field must exist before it is
written. In `lib/types.ts`, replace the `DailySummary` icon comment and the
whole `WeatherData` interface:

```typescript
export interface DailySummary {
  date: string; // ISO date
  dayName: string; // e.g. "Tue"
  high: number;
  low: number;
  conditions: string;
  icon: string; // icon key, e.g. "10d"
  rainProbability: number; // 0-100
}

export interface WeatherData {
  current: {
    temp: number;
    description: string;
    icon: string;
  };
  daily: DailySummary[];
  warnings: {
    rainSoon: boolean; // rain forecast in next 48h
    frostSoon: boolean; // frost risk in next 48h
  };
  observedAt: string; // ISO date-time of the upstream model run
  stale?: boolean; // true when served from the last-good store
}
```

Run: `npx tsc --noEmit`
Expected: no errors. Nothing constructs `WeatherData` yet except the old route, which supplies every field it declares.

- [ ] **Step 2: Write the failing test**

Create `lib/weather/cache.test.ts`:

```typescript
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- cache`
Expected: FAIL — cannot resolve `./cache`.

- [ ] **Step 4: Write the implementation**

Create `lib/weather/cache.ts`:

```typescript
import type { WeatherData } from "@/lib/types";

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

export function readStoredForecast(key: string): WeatherData | null {
  const stored = lastGood.get(key);
  if (!stored) return null;
  return { ...stored, stale: true };
}

export function clearStoredForecasts(): void {
  lastGood.clear();
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- cache`
Expected: 12 passing.

- [ ] **Step 6: Commit**

```bash
git add lib/types.ts lib/weather/cache.ts lib/weather/cache.test.ts
git commit -m "feat: add forecast grid rounding and last-good store"
```

---

### Task 4: Upstream client

Fetches the daily and hourly endpoints in parallel, sets the `apikey` header, applies the three-hour cache lifetime, strips `-99` sentinels, and fails with a typed error.

**Files:**
- Create: `lib/weather/metoffice.ts`
- Test: `lib/weather/metoffice.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `interface MetOfficeDailyEntry { time: string; dayMaxScreenTemperature?: number; nightMinScreenTemperature?: number; daySignificantWeatherCode?: number; nightSignificantWeatherCode?: number; dayProbabilityOfRain?: number; nightProbabilityOfRain?: number }`
  - `interface MetOfficeHourlyEntry { time: string; screenTemperature?: number; minScreenAirTemp?: number; significantWeatherCode?: number; probOfPrecipitation?: number }`
  - `interface MetOfficeForecast { daily: MetOfficeDailyEntry[]; hourly: MetOfficeHourlyEntry[]; modelRunDate: string }`
  - `class MetOfficeError extends Error { status: number }`
  - `fetchForecast(lat: number, lng: number, apiKey: string): Promise<MetOfficeForecast>`
  - `CACHE_SECONDS: number`

- [ ] **Step 1: Write the failing test**

Create `lib/weather/metoffice.test.ts`:

```typescript
import { beforeEach, describe, expect, it, vi } from "vitest";
import dailyFixture from "./__fixtures__/metoffice-daily.json";
import hourlyFixture from "./__fixtures__/metoffice-hourly.json";
import { CACHE_SECONDS, fetchForecast, MetOfficeError } from "./metoffice";

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

function mockFetchOk() {
  return vi.fn(async (url: string) =>
    jsonResponse(url.includes("/daily") ? dailyFixture : hourlyFixture)
  );
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchForecast", () => {
  it("calls both endpoints with the coordinates", async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal("fetch", fetchMock);

    await fetchForecast(51.51, -0.13, "test-key");

    const urls = fetchMock.mock.calls.map((call) => call[0] as string);
    expect(urls.some((u) => u.includes("/point/daily"))).toBe(true);
    expect(urls.some((u) => u.includes("/point/hourly"))).toBe(true);
    expect(urls[0]).toContain("latitude=51.51");
    expect(urls[0]).toContain("longitude=-0.13");
  });

  it("sends the key in an apikey header, never in the query string", async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal("fetch", fetchMock);

    await fetchForecast(51.51, -0.13, "test-key");

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit & { next?: unknown }];
    expect((init.headers as Record<string, string>).apikey).toBe("test-key");
    expect(url).not.toContain("test-key");
  });

  it("requests the three-hour cache lifetime", async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal("fetch", fetchMock);

    await fetchForecast(51.51, -0.13, "test-key");

    const [, init] = fetchMock.mock.calls[0] as [string, { next: { revalidate: number } }];
    expect(init.next.revalidate).toBe(CACHE_SECONDS);
    expect(CACHE_SECONDS).toBe(10800);
  });

  it("returns both series and the model run date", async () => {
    vi.stubGlobal("fetch", mockFetchOk());

    const forecast = await fetchForecast(51.51, -0.13, "test-key");

    expect(forecast.daily).toHaveLength(8);
    expect(forecast.hourly).toHaveLength(49);
    expect(forecast.modelRunDate).toBe("2026-09-06T11:00Z");
  });

  it("strips -99 sentinels so downstream code never sees them", async () => {
    const sentinel = {
      features: [
        {
          properties: {
            modelRunDate: "2026-09-06T11:00Z",
            timeSeries: [
              { time: "2026-09-06T00:00Z", dayMaxScreenTemperature: -99, nightMinScreenTemperature: 9 },
            ],
          },
        },
      ],
    };
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse(sentinel)));

    const forecast = await fetchForecast(51.51, -0.13, "test-key");

    expect(forecast.daily[0].dayMaxScreenTemperature).toBeUndefined();
    expect(forecast.daily[0].nightMinScreenTemperature).toBe(9);
  });

  it("throws MetOfficeError carrying the upstream status", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ code: "900908" }, 403)));

    await expect(fetchForecast(51.51, -0.13, "bad-key")).rejects.toMatchObject({
      name: "MetOfficeError",
      status: 403,
    });
  });

  it("throws when the series is empty", async () => {
    const empty = { features: [{ properties: { modelRunDate: "x", timeSeries: [] } }] };
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse(empty)));

    await expect(fetchForecast(51.51, -0.13, "test-key")).rejects.toBeInstanceOf(MetOfficeError);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- metoffice`
Expected: FAIL — cannot resolve `./metoffice`.

- [ ] **Step 3: Write the implementation**

Create `lib/weather/metoffice.ts`:

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- metoffice`
Expected: 7 passing.

- [ ] **Step 5: Commit**

```bash
git add lib/weather/metoffice.ts lib/weather/metoffice.test.ts
git commit -m "feat: add Met Office DataHub site-specific client"
```

---

### Task 5: Normalisation

Turns the two upstream series into the existing `WeatherData` shape. This is where the five accuracy defects are actually fixed.

**Files:**
- Create: `lib/weather/normalise.ts`
- Test: `lib/weather/normalise.test.ts`

**Interfaces:**
- Consumes: `MetOfficeForecast`, `MetOfficeDailyEntry`, `MetOfficeHourlyEntry` from `./metoffice`; `describeWeatherCode` from `./codes`; `DailySummary`, `WeatherData` from `@/lib/types`.
- Produces: `normaliseForecast(forecast: MetOfficeForecast, now?: number): WeatherData`, plus `FROST_CELSIUS`, `RAIN_PROBABILITY_PERCENT`, `WARNING_WINDOW_HOURS`, `FORECAST_DAYS`.

- [ ] **Step 1: Write the failing test**

Create `lib/weather/normalise.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import dailyFixture from "./__fixtures__/metoffice-daily.json";
import hourlyFixture from "./__fixtures__/metoffice-hourly.json";
import type {
  MetOfficeDailyEntry,
  MetOfficeForecast,
  MetOfficeHourlyEntry,
} from "./metoffice";
import { normaliseForecast } from "./normalise";

// Midday UTC on the day the fixtures were captured.
const NOW = Date.parse("2026-09-06T12:00:00Z");

function fromFixtures(): MetOfficeForecast {
  return {
    daily: dailyFixture.features[0].properties.timeSeries as MetOfficeDailyEntry[],
    hourly: hourlyFixture.features[0].properties.timeSeries as MetOfficeHourlyEntry[],
    modelRunDate: dailyFixture.features[0].properties.modelRunDate,
  };
}

function withHourly(hourly: MetOfficeHourlyEntry[]): MetOfficeForecast {
  return { ...fromFixtures(), hourly };
}

function hour(offsetHours: number, fields: Partial<MetOfficeHourlyEntry>): MetOfficeHourlyEntry {
  return {
    time: new Date(NOW + offsetHours * 3_600_000).toISOString(),
    screenTemperature: 12,
    minScreenAirTemp: 12,
    significantWeatherCode: 1,
    probOfPrecipitation: 0,
    ...fields,
  };
}

describe("normaliseForecast daily strip", () => {
  it("excludes the leading previous day", () => {
    const { daily } = normaliseForecast(fromFixtures(), NOW);
    expect(daily[0].date).toBe("2026-09-06");
    expect(daily.map((d) => d.date)).not.toContain("2026-09-05");
  });

  it("returns five days", () => {
    expect(normaliseForecast(fromFixtures(), NOW).daily).toHaveLength(5);
  });

  it("takes high and low from the day maximum and night minimum", () => {
    const [today] = normaliseForecast(fromFixtures(), NOW).daily;
    expect(today.high).toBe(26);
    expect(today.low).toBe(18);
  });

  it("names the day from the entry's own local date", () => {
    expect(normaliseForecast(fromFixtures(), NOW).daily[0].dayName).toBe("Sun");
  });

  it("takes rain probability as the greater of day and night", () => {
    const forecast = fromFixtures();
    forecast.daily = [
      { time: "2026-09-06T00:00Z", dayMaxScreenTemperature: 20, nightMinScreenTemperature: 10, dayProbabilityOfRain: 12, nightProbabilityOfRain: 47 },
    ];
    expect(normaliseForecast(forecast, NOW).daily[0].rainProbability).toBe(47);
  });

  it("drops a day with no maximum temperature rather than rendering a gap", () => {
    const forecast = fromFixtures();
    forecast.daily = [
      { time: "2026-09-06T00:00Z", nightMinScreenTemperature: 10 },
      { time: "2026-09-07T00:00Z", dayMaxScreenTemperature: 20, nightMinScreenTemperature: 10 },
    ];
    const { daily } = normaliseForecast(forecast, NOW);
    expect(daily).toHaveLength(1);
    expect(daily[0].date).toBe("2026-09-07");
  });

  it("describes the day from the daytime weather code", () => {
    const forecast = fromFixtures();
    forecast.daily = [
      { time: "2026-09-06T00:00Z", dayMaxScreenTemperature: 20, nightMinScreenTemperature: 10, daySignificantWeatherCode: 12 },
    ];
    expect(normaliseForecast(forecast, NOW).daily[0]).toMatchObject({
      conditions: "light rain",
      icon: "10d",
    });
  });
});

describe("normaliseForecast current reading", () => {
  it("uses the hourly entry nearest to now", () => {
    const forecast = withHourly([
      hour(-5, { screenTemperature: 5 }),
      hour(0.25, { screenTemperature: 17.4, significantWeatherCode: 7 }),
      hour(10, { screenTemperature: 30 }),
    ]);
    expect(normaliseForecast(forecast, NOW).current).toEqual({
      temp: 17,
      description: "cloudy",
      icon: "03d",
    });
  });

  it("carries the model run date through as observedAt", () => {
    expect(normaliseForecast(fromFixtures(), NOW).observedAt).toBe("2026-09-06T11:00Z");
  });
});

describe("normaliseForecast warnings", () => {
  it("warns of frost at exactly the threshold", () => {
    const forecast = withHourly([hour(6, { minScreenAirTemp: 3 })]);
    expect(normaliseForecast(forecast, NOW).warnings.frostSoon).toBe(true);
  });

  it("does not warn of frost just above the threshold", () => {
    const forecast = withHourly([hour(6, { minScreenAirTemp: 3.1 })]);
    expect(normaliseForecast(forecast, NOW).warnings.frostSoon).toBe(false);
  });

  it("warns of rain at exactly the threshold", () => {
    const forecast = withHourly([hour(6, { probOfPrecipitation: 50 })]);
    expect(normaliseForecast(forecast, NOW).warnings.rainSoon).toBe(true);
  });

  it("does not warn of rain just below the threshold", () => {
    const forecast = withHourly([hour(6, { probOfPrecipitation: 49 })]);
    expect(normaliseForecast(forecast, NOW).warnings.rainSoon).toBe(false);
  });

  it("ignores conditions beyond the 48 hour window", () => {
    const forecast = withHourly([hour(60, { minScreenAirTemp: -4, probOfPrecipitation: 95 })]);
    expect(normaliseForecast(forecast, NOW).warnings).toEqual({
      rainSoon: false,
      frostSoon: false,
    });
  });

  it("ignores conditions already in the past", () => {
    const forecast = withHourly([
      hour(-6, { minScreenAirTemp: -4, probOfPrecipitation: 95 }),
      hour(1, {}),
    ]);
    expect(normaliseForecast(forecast, NOW).warnings).toEqual({
      rainSoon: false,
      frostSoon: false,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- normalise`
Expected: FAIL — cannot resolve `./normalise`.

- [ ] **Step 3: Write the implementation**

Create `lib/weather/normalise.ts`:

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- normalise`
Expected: 14 passing.

- [ ] **Step 5: Commit**

```bash
git add lib/weather/normalise.ts lib/weather/normalise.test.ts
git commit -m "feat: normalise Met Office forecasts to WeatherData"
```

---

### Task 6: Route rewrite

Widens `WeatherData`, then rewrites the route to compose the modules. After this task the application actually uses the Met Office.

**Files:**
- Modify: `app/api/weather/route.ts` (full rewrite)
- Test: `app/api/weather/route.test.ts`

**Interfaces:**
- Consumes: `fetchForecast` from `@/lib/weather/metoffice`; `normaliseForecast` from `@/lib/weather/normalise`; `gridKey`, `roundToGrid`, `storeForecast`, `readStoredForecast` from `@/lib/weather/cache`.
- Produces: `POST` handler unchanged in signature — accepts `{ lat, lng }`, returns `WeatherData` or `{ error }`.

- [ ] **Step 1: Write the failing test**

Create `app/api/weather/route.test.ts`:

```typescript
// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import dailyFixture from "@/lib/weather/__fixtures__/metoffice-daily.json";
import hourlyFixture from "@/lib/weather/__fixtures__/metoffice-hourly.json";
import { clearStoredForecasts } from "@/lib/weather/cache";
import { POST } from "./route";

function request(body: unknown) {
  return new Request("http://localhost/api/weather", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function okFetch() {
  return vi.fn(async (url: string) => ({
    ok: true,
    status: 200,
    json: async () => (url.includes("/daily") ? dailyFixture : hourlyFixture),
  }));
}

function failingFetch(status = 429) {
  return vi.fn(async () => ({ ok: false, status, json: async () => ({}) }));
}

beforeEach(() => {
  clearStoredForecasts();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.stubEnv("METOFFICE_API_KEY", "test-key");
});

describe("POST /api/weather", () => {
  it("reports a missing key as a configuration error", async () => {
    vi.stubEnv("METOFFICE_API_KEY", "");
    const response = await POST(request({ lat: 51.5, lng: -0.1 }));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringContaining("METOFFICE_API_KEY"),
    });
  });

  it("rejects a body without usable coordinates", async () => {
    vi.stubGlobal("fetch", okFetch());
    const response = await POST(request({ lat: "nowhere" }));
    expect(response.status).toBe(400);
  });

  it("returns a normalised forecast", async () => {
    vi.stubGlobal("fetch", okFetch());
    const response = await POST(request({ lat: 51.5074, lng: -0.1278 }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.daily.length).toBeGreaterThan(0);
    expect(body.observedAt).toBe("2026-09-06T11:00Z");
    expect(body.stale).toBeUndefined();
  });

  it("rounds coordinates to the grid before calling upstream", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);
    await POST(request({ lat: 51.5074, lng: -0.1278 }));
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain("latitude=51.51");
    expect(url).toContain("longitude=-0.13");
  });

  it("serves the last good forecast when the quota is exhausted", async () => {
    vi.stubGlobal("fetch", okFetch());
    await POST(request({ lat: 51.5074, lng: -0.1278 }));

    vi.stubGlobal("fetch", failingFetch(429));
    const response = await POST(request({ lat: 51.5074, lng: -0.1278 }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ stale: true });
  });

  it("errors when upstream fails and nothing is stored", async () => {
    vi.stubGlobal("fetch", failingFetch(429));
    const response = await POST(request({ lat: 51.5074, lng: -0.1278 }));
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toHaveProperty("error");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- route`
Expected: FAIL — the route still reads `OPENWEATHERMAP_API_KEY`.

- [ ] **Step 3: Rewrite the route**

Replace the whole of `app/api/weather/route.ts`:

```typescript
import { NextResponse } from "next/server";
import {
  gridKey,
  readStoredForecast,
  roundToGrid,
  storeForecast,
} from "@/lib/weather/cache";
import { fetchForecast } from "@/lib/weather/metoffice";
import { normaliseForecast } from "@/lib/weather/normalise";

export async function POST(request: Request) {
  const apiKey = process.env.METOFFICE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather service is not configured (missing METOFFICE_API_KEY)." },
      { status: 500 }
    );
  }

  let lat: number, lng: number;
  try {
    const body = await request.json();
    lat = Number(body.lat);
    lng = Number(body.lng);
    if (!isFinite(lat) || !isFinite(lng)) throw new Error("bad coords");
  } catch {
    return NextResponse.json(
      { error: "Invalid request — lat and lng are required." },
      { status: 400 }
    );
  }

  const key = gridKey(lat, lng);

  try {
    const forecast = await fetchForecast(
      roundToGrid(lat),
      roundToGrid(lng),
      apiKey
    );
    const weather = normaliseForecast(forecast);
    storeForecast(key, weather);
    return NextResponse.json(weather);
  } catch {
    // Past the daily quota, or upstream is down. A forecast a few hours old
    // beats no forecast, so long as the banner says how old it is.
    const stored = readStoredForecast(key);
    if (stored) return NextResponse.json(stored);

    return NextResponse.json(
      { error: "Could not reach the weather service. Please try again." },
      { status: 502 }
    );
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- route`
Expected: 6 passing.

- [ ] **Step 5: Run the whole suite**

Run: `npm test`
Expected: all passing.

- [ ] **Step 6: Commit**

```bash
git add app/api/weather/route.ts app/api/weather/route.test.ts
git commit -m "feat: serve forecasts from the Met Office DataHub"
```

---

### Task 7: Banner copy and stale notice

Softens the frost wording to match the lower threshold, and tells the user when a forecast is being served past the quota ceiling.

**Files:**
- Modify: `components/WeatherBanner.tsx`
- Test: `components/WeatherBanner.test.tsx`

**Interfaces:**
- Consumes: `WeatherData` with `observedAt` and `stale` from Task 6.
- Produces: no new exports. `WeatherBanner` keeps its `{ weather, loading, error }` props.

- [ ] **Step 1: Write the failing test**

Create `components/WeatherBanner.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- WeatherBanner`
Expected: FAIL — frost copy still reads "Frost expected", and no stale notice exists.

- [ ] **Step 3: Add the age helper**

In `components/WeatherBanner.tsx`, add below `weatherEmoji`:

```tsx
// How old the reading is, for forecasts served past the daily quota.
function ageLabel(observedAt: string): string | null {
  const observed = Date.parse(observedAt);
  if (Number.isNaN(observed)) return null;
  const hours = Math.max(0, Math.round((Date.now() - observed) / 3_600_000));
  if (hours < 1) return "updated just now";
  if (hours === 1) return "updated 1 hour ago";
  return `updated ${hours} hours ago`;
}
```

- [ ] **Step 4: Change the frost wording**

Replace the `warnings.frostSoon` message:

```tsx
  if (warnings.frostSoon)
    warningMessages.push(
      "Frost risk in the next 48 hours — protect tender plants and seedlings."
    );
```

- [ ] **Step 5: Render the stale notice**

In the `bg-sage/60` panel, the flex row holding the current reading and the day
strip is closed by a `</div>` that is immediately followed by another `</div>`
closing the panel itself. Insert between those two closing tags:

```tsx
        {weather.stale && (
          <p className="mt-3 text-xs text-dark-earth/70">
            Showing the last forecast we could fetch — {ageLabel(weather.observedAt) ?? "age unknown"}.
          </p>
        )}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- WeatherBanner`
Expected: 6 passing.

- [ ] **Step 7: Commit**

```bash
git add components/WeatherBanner.tsx components/WeatherBanner.test.tsx
git commit -m "feat: soften frost wording and label stale forecasts"
```

---

### Task 8: Documentation, environment, and full verification

Records the new key, narrows what OpenWeatherMap is for, and proves the whole thing works against the live API.

**Files:**
- Modify: `.env.local.example`
- Modify: `README.md`

**Interfaces:**
- Consumes: everything above.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Update `.env.local.example`**

Replace the OpenWeatherMap block and add the Met Office one:

```
# Met Office DataHub — site-specific forecasts (daily + hourly).
# Subscribe to "Global Spot" under Site Specific. Free plan: 360 calls/day.
# https://datahub.metoffice.gov.uk/
METOFFICE_API_KEY=your-metoffice-datahub-api-key

# OpenWeatherMap — map tile overlays only (rain, cloud, temperature, wind).
# Forecasts no longer use this key.
# Sign up at https://openweathermap.org/api
OPENWEATHERMAP_API_KEY=your-openweathermap-api-key
```

- [ ] **Step 2: Update the README**

Change the architecture lines (around line 19):

```
        ├─ /api/weather ─────── Met Office DataHub daily + hourly, normalised
        ├─ /api/weather-tiles ─ proxies OpenWeatherMap radar/cloud/temp map
```

Change the technology table row for Weather to two rows:

```
| Forecasts | Met Office DataHub (Site Specific / Global Spot) |
| Map tiles | OpenWeatherMap |
```

Add a row to the environment variable table, above the OpenWeatherMap row:

```
| `METOFFICE_API_KEY` | [datahub.metoffice.gov.uk](https://datahub.metoffice.gov.uk) |
```

Change the sentence below that table so it reads: `All three are used only inside
API route handlers. The app runs without the Met Office key (advice still works;
the forecast banner notes it is unavailable).`

Update the credits line to read `Weather by [Met Office](https://www.metoffice.gov.uk) · Map tiles by [OpenWeatherMap](https://openweathermap.org)`.

- [ ] **Step 3: Typecheck and build**

Run: `npx tsc --noEmit`
Expected: no errors. This catches any other file constructing a `WeatherData` without `observedAt`.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Run the whole suite**

Run: `npm test`
Expected: all passing across all six test files.

- [ ] **Step 5: Verify against the live API**

Start the dev server and make one real request. This costs 2 of the 360 daily calls.

```bash
npm run dev
```

Then in another shell:

```bash
curl -s -X POST http://localhost:3000/api/weather -H 'content-type: application/json' -d '{"lat":51.5074,"lng":-0.1278}' | python3 -m json.tool | head -40
```

Expected: `current`, five `daily` entries beginning today, `warnings`, and `observedAt` matching a recent model run. No `stale` field.

- [ ] **Step 6: Commit**

```bash
git add .env.local.example README.md
git commit -m "docs: record the Met Office key and narrow OpenWeatherMap's role"
```

---

## Verification Checklist

Every defect the spec set out to fix, and where it is proven:

- Stale "current" reading → Task 5, "uses the hourly entry nearest to now"
- UTC day bucketing → Task 5, "names the day from the entry's own local date"
- Fake daily minimum and maximum → Task 5, "takes high and low from the day maximum and night minimum"
- Partial leading day → Task 5, "excludes the leading previous day"
- Frost threshold too low → Task 5 thresholds, Task 7 wording
- Quota ceiling handled → Task 6, "serves the last good forecast when the quota is exhausted"
