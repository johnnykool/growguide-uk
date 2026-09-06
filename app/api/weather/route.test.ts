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
  // The route now logs upstream/normalisation failures via console.error.
  // Silence it here so existing tests that exercise the failure path stay
  // pristine; the dedicated logging test below asserts against this spy.
  vi.spyOn(console, "error").mockImplementation(() => {});
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

  it("rejects coordinates that coerce to numbers instead of being numbers", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({ lat: null, lng: null }));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects out-of-range coordinates", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({ lat: 500, lng: -9999 }));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts a valid UK coordinate (Manchester)", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({ lat: 53.4808, lng: -2.2426 }));
    expect(response.status).toBe(200);
  });

  it("rejects a well-formed but non-UK coordinate (Paris) without reaching the network", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({ lat: 48.8566, lng: 2.3522 }));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("logs the failure server-side without leaking detail to the client", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", failingFetch(429));
    const response = await POST(request({ lat: 51.5074, lng: -0.1278 }));
    expect(response.status).toBe(502);
    expect(errorSpy).toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({
      error: "Could not reach the weather service. Please try again.",
    });
  });
});
