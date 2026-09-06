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

    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit & { next?: unknown },
    ];
    expect((init.headers as Record<string, string>).apikey).toBe("test-key");
    expect(url).not.toContain("test-key");
  });

  it("requests the three-hour cache lifetime", async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal("fetch", fetchMock);

    await fetchForecast(51.51, -0.13, "test-key");

    const [, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      { next: { revalidate: number } },
    ];
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
