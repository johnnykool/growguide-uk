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
