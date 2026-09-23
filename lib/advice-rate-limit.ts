// Rate limiting for /api/advice, which spends Anthropic credit on every call.
//
// The in-process Map this replaces bounded repeat spend within one live
// serverless instance and nothing beyond it: instances do not share memory, and
// a cold start reset the count. Anyone willing to wait out a scale event got a
// fresh allowance.
//
// When UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, the counter
// moves to Redis over its REST API and the quota becomes global. Without them,
// or if Redis is unreachable, it falls back to the in-process Map so the site
// keeps working: a weaker limit is the correct trade against refusing advice to
// real gardeners because a cache is down. The Origin check in the route and a
// provider spend cap remain the outer bounds either way.
//
// Deliberately no SDK. Upstash's REST API is a POST with a bearer token, so a
// dependency would buy nothing and ship bytes into every serverless cold start.

export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
export const RATE_LIMIT_MAX_REQUESTS = 5;
export const MAX_RATE_LIMIT_CLIENTS = 1_000;

const REDIS_TIMEOUT_MS = 1_000;

interface RateLimitEntry {
  count: number;
  windowStartedAt: number;
}

const memoryLimits = new Map<string, RateLimitEntry>();

/** Exposed so tests can start from a known state; not used by the route. */
export function resetRateLimitsForTest(): void {
  memoryLimits.clear();
}

function redisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

/**
 * Fixed window in Redis. INCR creates the key at 1, EXPIRE NX sets the window
 * only on that first call so later requests cannot slide it forward, and TTL
 * reports what is left. One pipelined round trip, so the added latency is a
 * single hop.
 */
async function consumeFromRedis(
  config: { url: string; token: string },
  client: string,
): Promise<number | null> {
  const key = `advice-rate:${client}`;
  const windowSeconds = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000);

  const response = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, String(windowSeconds), "NX"],
      ["TTL", key],
    ]),
    signal: AbortSignal.timeout(REDIS_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Upstash responded ${response.status}`);

  const results = (await response.json()) as Array<{ result?: unknown }>;
  const count = Number(results?.[0]?.result);
  if (!Number.isFinite(count)) throw new Error("Upstash returned no counter");

  if (count <= RATE_LIMIT_MAX_REQUESTS) return null;

  // TTL is -1 when the key somehow has no expiry and -2 when it has already
  // gone; neither should strand a caller, so fall back to the whole window.
  const ttl = Number(results?.[2]?.result);
  return Number.isFinite(ttl) && ttl > 0 ? ttl : windowSeconds;
}

function consumeFromMemory(client: string, now: number): number | null {
  for (const [key, entry] of Array.from(memoryLimits.entries())) {
    if (now - entry.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
      memoryLimits.delete(key);
    }
  }
  const entry = memoryLimits.get(client);
  if (!entry) {
    while (memoryLimits.size >= MAX_RATE_LIMIT_CLIENTS) {
      const oldest = memoryLimits.keys().next().value as string | undefined;
      if (!oldest) break;
      memoryLimits.delete(oldest);
    }
    memoryLimits.set(client, { count: 1, windowStartedAt: now });
    return null;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return Math.max(
      1,
      Math.ceil((RATE_LIMIT_WINDOW_MS - (now - entry.windowStartedAt)) / 1000),
    );
  }
  entry.count += 1;
  return null;
}

/** Null when the caller may proceed, otherwise seconds until they may retry. */
export async function consumeAdviceQuota(
  client: string,
  now = Date.now(),
): Promise<number | null> {
  const config = redisConfig();
  if (config) {
    try {
      return await consumeFromRedis(config, client);
    } catch (error) {
      // Never let the limiter itself take the endpoint down.
      console.warn("Shared advice rate limit unavailable, using in-process limit", error);
    }
  }
  return consumeFromMemory(client, now);
}
