// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const TILE = ["temp_new", "3", "4", "5"];

function tileRequest(
  headers: Record<string, string> = {},
  tile: string[] = TILE
) {
  return new Request(`http://localhost/api/weather-tiles/${tile.join("/")}`, {
    headers,
  });
}

function call(headers: Record<string, string> = {}, tile: string[] = TILE) {
  return GET(tileRequest(headers, tile), { params: Promise.resolve({ tile }) });
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.stubEnv("OPENWEATHERMAP_API_KEY", "test-owm-key");
  fetchMock = vi.fn(async () => new Response("fake-png-bytes", { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("weather tile proxy", () => {
  it("serves a tile for the site's own map and keeps the key server-side", async () => {
    const response = await call({ "sec-fetch-site": "same-origin" });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    expect(await response.text()).not.toContain("test-owm-key");
  });

  it("sends the key upstream rather than to the browser", async () => {
    await call({ "sec-fetch-site": "same-origin" });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://tile.openweathermap.org/map/temp_new/3/4/5.png?appid=test-owm-key"
    );
  });

  it("resolves the asynchronous route params Next 15 hands it", async () => {
    const response = await call({ "sec-fetch-site": "same-origin" }, [
      "clouds_new",
      "6",
      "7",
      "8",
    ]);

    expect(response.status).toBe(200);
    expect(fetchMock.mock.calls[0][0]).toContain("/map/clouds_new/6/7/8.png");
  });

  // The point of the check: another site's map must not bill our key.
  it.each([
    ["cross-site", { "sec-fetch-site": "cross-site" }],
    [
      "a cross-site marker beside a friendly-looking referer",
      { "sec-fetch-site": "cross-site", referer: "http://localhost/" },
    ],
    ["a foreign referer", { referer: "https://tiles.example/steal" }],
    ["an unparseable referer", { referer: "not-a-url" }],
  ])("refuses a request carrying %s without spending a call", async (_label, headers) => {
    const response = await call(headers);

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps a refusal out of the shared cache", async () => {
    const response = await call({ "sec-fetch-site": "cross-site" });

    // A stored 403 would outlive the request and be replayed to real users.
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("still serves a browser that sends neither header", async () => {
    // Documents the deliberate bargain: the check rejects positive evidence of
    // cross-site use, it does not demand proof of same-site use.
    const response = await call();

    expect(response.status).toBe(200);
  });

  it("serves a direct navigation and the site's own referer", async () => {
    expect((await call({ "sec-fetch-site": "none" })).status).toBe(200);
    expect((await call({ referer: "http://localhost/" })).status).toBe(200);
  });

  it.each([
    ["an unlisted layer", ["evil_layer", "3", "4", "5"]],
    ["a traversal attempt in the path", ["temp_new", "3", "4", "..%2f..%2fetc"]],
    ["a non-numeric coordinate", ["temp_new", "3", "4", "5;rm"]],
    ["a missing coordinate", ["temp_new", "3", "4"]],
  ])("rejects %s before reaching upstream", async (_label, tile) => {
    const response = await call({ "sec-fetch-site": "same-origin" }, tile);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports an unconfigured key without naming it", async () => {
    vi.stubEnv("OPENWEATHERMAP_API_KEY", "");

    const response = await call({ "sec-fetch-site": "same-origin" });

    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toMatch(/OPENWEATHERMAP|API_KEY/);
  });

  it("passes an upstream failure through as a bare status", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 429 }));

    const response = await call({ "sec-fetch-site": "same-origin" });

    expect(response.status).toBe(429);
  });
});
