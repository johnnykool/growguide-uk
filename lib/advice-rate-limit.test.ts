import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  consumeAdviceQuota,
  resetRateLimitsForTest,
  RATE_LIMIT_MAX_REQUESTS,
} from "./advice-rate-limit";

const URL_VAR = "UPSTASH_REDIS_REST_URL";
const TOKEN_VAR = "UPSTASH_REDIS_REST_TOKEN";

function pipelineReply(count: number, ttl: number) {
  return new Response(
    JSON.stringify([{ result: count }, { result: 1 }, { result: ttl }]),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

beforeEach(() => {
  resetRateLimitsForTest();
  delete process.env[URL_VAR];
  delete process.env[TOKEN_VAR];
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env[URL_VAR];
  delete process.env[TOKEN_VAR];
});

describe("advice rate limit without a shared store", () => {
  it("allows a client up to the limit, then reports when to retry", async () => {
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i += 1) {
      expect(await consumeAdviceQuota("1.2.3.4")).toBeNull();
    }
    const retry = await consumeAdviceQuota("1.2.3.4");
    expect(retry).toBeGreaterThan(0);
  });

  it("counts each client separately", async () => {
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i += 1) {
      await consumeAdviceQuota("1.1.1.1");
    }
    expect(await consumeAdviceQuota("1.1.1.1")).toBeGreaterThan(0);
    expect(await consumeAdviceQuota("2.2.2.2")).toBeNull();
  });
});

describe("advice rate limit with a shared store", () => {
  beforeEach(() => {
    process.env[URL_VAR] = "https://redis.example.com/";
    process.env[TOKEN_VAR] = "test-token";
  });

  it("counts in Redis rather than in this process", async () => {
    const fetchMock = vi.fn().mockResolvedValue(pipelineReply(1, 600));
    vi.stubGlobal("fetch", fetchMock);

    expect(await consumeAdviceQuota("9.9.9.9")).toBeNull();

    const [url, init] = fetchMock.mock.calls[0];
    // Trailing slash on the configured URL must not produce a double slash.
    expect(url).toBe("https://redis.example.com/pipeline");
    expect(init.headers.Authorization).toBe("Bearer test-token");
    const commands = JSON.parse(init.body);
    expect(commands[0]).toEqual(["INCR", "advice-rate:9.9.9.9"]);
    // NX so a later request in the window cannot slide the expiry forward.
    expect(commands[1]).toEqual(["EXPIRE", "advice-rate:9.9.9.9", "600", "NX"]);
    expect(commands[2]).toEqual(["TTL", "advice-rate:9.9.9.9"]);
  });

  it("refuses once Redis reports more calls than the limit, using its TTL", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(pipelineReply(RATE_LIMIT_MAX_REQUESTS + 1, 421)),
    );
    expect(await consumeAdviceQuota("9.9.9.9")).toBe(421);
  });

  it("allows the call that exactly reaches the limit", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(pipelineReply(RATE_LIMIT_MAX_REQUESTS, 300)),
    );
    expect(await consumeAdviceQuota("9.9.9.9")).toBeNull();
  });

  it("falls back to the whole window when Redis reports no usable TTL", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(pipelineReply(RATE_LIMIT_MAX_REQUESTS + 1, -1)),
    );
    expect(await consumeAdviceQuota("9.9.9.9")).toBe(600);
  });

  it("keeps serving from the in-process limit when Redis is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    vi.spyOn(console, "warn").mockImplementation(() => {});

    // Degrades rather than refusing, and the local counter still bounds it.
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i += 1) {
      expect(await consumeAdviceQuota("8.8.8.8")).toBeNull();
    }
    expect(await consumeAdviceQuota("8.8.8.8")).toBeGreaterThan(0);
  });

  it("treats a non-200 from Redis the same as unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 500 })));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await consumeAdviceQuota("7.7.7.7")).toBeNull();
  });
});
