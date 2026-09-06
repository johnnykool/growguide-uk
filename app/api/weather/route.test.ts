// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import dailyFixture from "@/lib/weather/__fixtures__/metoffice-daily.json";
import hourlyFixture from "@/lib/weather/__fixtures__/metoffice-hourly.json";
import { clearStoredForecasts } from "@/lib/weather/cache";
import { POST } from "./route";

const WEATHER_UNAVAILABLE = { error: "Weather is unavailable right now." };
const INVALID_LOCATION = { error: "Please provide a valid location." };

function weatherRequest(body: unknown) {
  return new Request("http://localhost/api/weather", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function expectSafeError(response: Response, expected: object) {
  const payload = await response.json();
  expect(payload).toEqual(expected);
  expect(JSON.stringify(payload)).not.toMatch(
    /METOFFICE|OPENWEATHERMAP|API_KEY|\b\d{3}\b/,
  );
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// The route calls two endpoints per request; serve the matching fixture.
function okFetch() {
  return vi.fn(async (url: string) =>
    jsonResponse(url.includes("/daily") ? dailyFixture : hourlyFixture),
  );
}

beforeEach(() => {
  clearStoredForecasts();
  vi.stubEnv("METOFFICE_API_KEY", "test-key");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/weather", () => {
  it("keeps the missing-configuration status while hiding configuration details", async () => {
    vi.stubEnv("METOFFICE_API_KEY", "");

    const response = await POST(weatherRequest({ lat: 51.5, lng: -0.1 }));

    expect(response.status).toBe(500);
    await expectSafeError(response, WEATHER_UNAVAILABLE);
  });

  it("keeps invalid coordinates as a safe client error", async () => {
    const response = await POST(weatherRequest({ lat: "north", lng: -0.1 }));

    expect(response.status).toBe(400);
    await expectSafeError(response, INVALID_LOCATION);
  });

  it.each([
    ["numeric strings", { lat: "51.5", lng: -0.1 }],
    ["nulls that would coerce to zero", { lat: null, lng: null }],
    ["booleans that would coerce to one", { lat: true, lng: true }],
    ["arrays that would coerce to zero", { lat: [], lng: [] }],
    ["latitude above 90", { lat: 90.1, lng: -0.1 }],
    ["latitude below -90", { lat: -90.1, lng: -0.1 }],
    ["longitude above 180", { lat: 51.5, lng: 180.1 }],
    ["longitude below -180", { lat: 51.5, lng: -180.1 }],
    // Well-formed, on Earth, but outside the UK. Coordinates only ever come
    // from a UK postcode lookup, and the Met Office free tier is 360
    // calls/day, so accepting these would let anyone drain the quota.
    ["Paris", { lat: 48.8566, lng: 2.3522 }],
    ["New York", { lat: 40.7128, lng: -74.006 }],
  ])("rejects %s without contacting the weather service", async (_name, body) => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(weatherRequest(body));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["Lerwick, Shetland", { lat: 60.1532, lng: -1.1416 }],
    ["Isles of Scilly", { lat: 49.9144, lng: -6.3152 }],
    ["Manchester", { lat: 53.4808, lng: -2.2426 }],
  ])("accepts the real UK location %s", async (_name, body) => {
    vi.stubGlobal("fetch", okFetch());

    const response = await POST(weatherRequest(body));

    expect(response.status).toBe(200);
  });

  it("returns a normalised forecast", async () => {
    vi.stubGlobal("fetch", okFetch());

    const response = await POST(weatherRequest({ lat: 51.5074, lng: -0.1278 }));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.daily.length).toBeGreaterThan(0);
    expect(body.observedAt).toBe("2026-09-06T11:00Z");
    expect(body.stale).toBeUndefined();
  });

  it("rounds coordinates to the grid before calling upstream", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);

    await POST(weatherRequest({ lat: 51.5074, lng: -0.1278 }));

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain("latitude=51.51");
    expect(url).toContain("longitude=-0.13");
  });

  it("serves the last good forecast when the quota is exhausted", async () => {
    vi.stubGlobal("fetch", okFetch());
    await POST(weatherRequest({ lat: 51.5074, lng: -0.1278 }));

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 429 })),
    );
    const response = await POST(weatherRequest({ lat: 51.5074, lng: -0.1278 }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ stale: true });
  });

  it("keeps an upstream rejection as a safe gateway error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 429 })),
    );

    const response = await POST(weatherRequest({ lat: 51.5, lng: -0.1 }));

    expect(response.status).toBe(502);
    await expectSafeError(response, WEATHER_UNAVAILABLE);
  });

  it("keeps an empty forecast as a safe gateway error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({
          features: [
            { properties: { modelRunDate: "2026-09-06T11:00Z", timeSeries: [] } },
          ],
        }),
      ),
    );

    const response = await POST(weatherRequest({ lat: 51.5, lng: -0.1 }));

    expect(response.status).toBe(502);
    await expectSafeError(response, WEATHER_UNAVAILABLE);
  });

  it("keeps request failures as safe gateway errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("socket closed")));

    const response = await POST(weatherRequest({ lat: 51.5, lng: -0.1 }));

    expect(response.status).toBe(502);
    await expectSafeError(response, WEATHER_UNAVAILABLE);
  });

  it("logs the failure server-side without leaking detail to the client", async () => {
    const errorSpy = vi.spyOn(console, "error");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("socket closed")));

    const response = await POST(weatherRequest({ lat: 51.5, lng: -0.1 }));

    expect(errorSpy).toHaveBeenCalled();
    await expectSafeError(response, WEATHER_UNAVAILABLE);
  });
});
