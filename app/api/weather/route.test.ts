import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const WEATHER_UNAVAILABLE = { error: "Weather is unavailable right now." };

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
  expect(JSON.stringify(payload)).not.toMatch(/OPENWEATHERMAP|API_KEY|\b\d{3}\b/);
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/weather", () => {
  it("keeps the missing-configuration status while hiding configuration details", async () => {
    vi.stubEnv("OPENWEATHERMAP_API_KEY", "");

    const response = await POST(weatherRequest({ lat: 51.5, lng: -0.1 }));

    expect(response.status).toBe(500);
    await expectSafeError(response, WEATHER_UNAVAILABLE);
  });

  it("keeps invalid coordinates as a safe client error", async () => {
    vi.stubEnv("OPENWEATHERMAP_API_KEY", "test-key");

    const response = await POST(weatherRequest({ lat: "north", lng: -0.1 }));

    expect(response.status).toBe(400);
    await expectSafeError(response, {
      error: "Please provide a valid location.",
    });
  });

  it("keeps an upstream rejection as a safe gateway error", async () => {
    vi.stubEnv("OPENWEATHERMAP_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 429 })),
    );
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(weatherRequest({ lat: 51.5, lng: -0.1 }));

    expect(response.status).toBe(502);
    await expectSafeError(response, WEATHER_UNAVAILABLE);
  });

  it("keeps an empty forecast as a safe gateway error", async () => {
    vi.stubEnv("OPENWEATHERMAP_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ list: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(weatherRequest({ lat: 51.5, lng: -0.1 }));

    expect(response.status).toBe(502);
    await expectSafeError(response, WEATHER_UNAVAILABLE);
  });

  it("keeps request failures as safe gateway errors", async () => {
    vi.stubEnv("OPENWEATHERMAP_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("socket closed")));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(weatherRequest({ lat: 51.5, lng: -0.1 }));

    expect(response.status).toBe(502);
    await expectSafeError(response, WEATHER_UNAVAILABLE);
  });
});
