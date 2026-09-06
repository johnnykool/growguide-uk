import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getVegetableById, VEGETABLES } from "@/data/vegetables";
import {
  AdviceResponse,
  AdviceTask,
  ENVIRONMENT_OPTIONS,
  EQUIPMENT_OPTIONS,
  PLOT_SIZE_LABELS,
  TIMELINE_LABELS,
  Timeline,
  PlotSize,
  UK_GARDEN_REGIONS,
  WeatherData,
} from "@/lib/types";

export const maxDuration = 300;

interface AdviceRequestBody {
  region: string;
  vegetables: string[];
  plotSize: PlotSize;
  environment: string[];
  equipment: string[];
  timeline: Timeline;
  weather: WeatherData | null;
}

const MAX_REQUEST_BYTES = 24_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_RATE_LIMIT_CLIENTS = 1_000;

const VEGETABLE_IDS = new Set(VEGETABLES.map((vegetable) => vegetable.id));
const PLOT_SIZE_IDS = new Set(Object.keys(PLOT_SIZE_LABELS));
const ENVIRONMENT_IDS = new Set(ENVIRONMENT_OPTIONS.map((item) => item.id));
const EQUIPMENT_IDS = new Set(EQUIPMENT_OPTIONS.map((item) => item.id));
const TIMELINE_IDS = new Set(Object.keys(TIMELINE_LABELS));
const UK_REGIONS = new Set<string>(UK_GARDEN_REGIONS);
const DAY_NAMES = new Set(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
const REQUEST_KEYS = new Set([
  "postcode",
  "region",
  "lat",
  "lng",
  "vegetables",
  "plotSize",
  "environment",
  "equipment",
  "timeline",
  "weather",
]);

interface RateLimitEntry {
  count: number;
  windowStartedAt: number;
}

// Defensive per-process limit only: serverless instances do not share this map,
// and cold starts reset it. A shared edge/store limiter is still required for a
// globally enforced quota, but this bounds repeat spend within each live process.
const adviceRateLimits = new Map<string, RateLimitEntry>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumberInRange(
  value: unknown,
  minimum: number,
  maximum: number,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum
  );
}

function isBoundedString(
  value: unknown,
  maximumLength: number,
): value is string {
  return typeof value === "string" && value.length <= maximumLength;
}

function isAllowedIdArray(
  value: unknown,
  allowed: Set<string>,
  maximumLength: number,
  allowEmpty = true,
): value is string[] {
  return (
    Array.isArray(value) &&
    (allowEmpty || value.length > 0) &&
    value.length <= maximumLength &&
    new Set(value).size === value.length &&
    value.every((item) => typeof item === "string" && allowed.has(item))
  );
}

function isWeatherData(value: unknown): value is WeatherData {
  if (!isRecord(value) || !isRecord(value.current) || !isRecord(value.warnings)) {
    return false;
  }

  const current = value.current;
  const warnings = value.warnings;
  if (
    !isFiniteNumberInRange(current.temp, -80, 60) ||
    !isBoundedString(current.description, 64) ||
    !/^[a-z][a-z -]*$/i.test(current.description) ||
    typeof current.icon !== "string" ||
    !/^\d{2}[dn]$/.test(current.icon) ||
    typeof warnings.rainSoon !== "boolean" ||
    typeof warnings.frostSoon !== "boolean" ||
    !Array.isArray(value.daily) ||
    value.daily.length > 5
  ) {
    return false;
  }

  return value.daily.every((item) => {
    if (!isRecord(item)) return false;
    return (
      typeof item.date === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
      typeof item.dayName === "string" &&
      DAY_NAMES.has(item.dayName) &&
      isFiniteNumberInRange(item.high, -80, 60) &&
      isFiniteNumberInRange(item.low, -80, 60) &&
      isBoundedString(item.conditions, 64) &&
      /^[a-z][a-z -]*$/i.test(item.conditions) &&
      typeof item.icon === "string" &&
      /^\d{2}[dn]$/.test(item.icon) &&
      isFiniteNumberInRange(item.rainProbability, 0, 100)
    );
  });
}

function parseAdviceRequest(value: unknown): AdviceRequestBody | null {
  if (!isRecord(value)) return null;
  if (Object.keys(value).some((key) => !REQUEST_KEYS.has(key))) return null;

  const hasLat = Object.prototype.hasOwnProperty.call(value, "lat");
  const hasLng = Object.prototype.hasOwnProperty.call(value, "lng");
  const optionalLocationIsValid =
    (!hasLat && !hasLng) ||
    (hasLat &&
      hasLng &&
      isFiniteNumberInRange(value.lat, -90, 90) &&
      isFiniteNumberInRange(value.lng, -180, 180));
  const optionalPostcodeIsValid =
    value.postcode === undefined ||
    (isBoundedString(value.postcode, 12) &&
      /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(value.postcode));

  if (
    !optionalLocationIsValid ||
    !optionalPostcodeIsValid ||
    typeof value.region !== "string" ||
    !UK_REGIONS.has(value.region) ||
    !isAllowedIdArray(
      value.vegetables,
      VEGETABLE_IDS,
      VEGETABLES.length,
      false,
    ) ||
    typeof value.plotSize !== "string" ||
    !PLOT_SIZE_IDS.has(value.plotSize) ||
    !isAllowedIdArray(
      value.environment,
      ENVIRONMENT_IDS,
      ENVIRONMENT_OPTIONS.length,
    ) ||
    !isAllowedIdArray(
      value.equipment,
      EQUIPMENT_IDS,
      EQUIPMENT_OPTIONS.length,
    ) ||
    typeof value.timeline !== "string" ||
    !TIMELINE_IDS.has(value.timeline) ||
    (value.weather !== null && !isWeatherData(value.weather))
  ) {
    return null;
  }

  return {
    region: value.region,
    vegetables: value.vegetables,
    plotSize: value.plotSize as PlotSize,
    environment: value.environment,
    equipment: value.equipment,
    timeline: value.timeline as Timeline,
    weather: value.weather,
  };
}

function clientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  return (forwarded || request.headers.get("x-real-ip") || "unknown").slice(0, 64);
}

function consumeAdviceQuota(client: string, now = Date.now()): number | null {
  for (const [key, entry] of Array.from(adviceRateLimits.entries())) {
    if (now - entry.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
      adviceRateLimits.delete(key);
    }
  }
  const entry = adviceRateLimits.get(client);
  if (!entry) {
    while (adviceRateLimits.size >= MAX_RATE_LIMIT_CLIENTS) {
      const oldest = adviceRateLimits.keys().next().value as string | undefined;
      if (!oldest) break;
      adviceRateLimits.delete(oldest);
    }
    adviceRateLimits.set(client, { count: 1, windowStartedAt: now });
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

function buildPrompt(body: AdviceRequestBody): string {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const vegData = body.vegetables
    .map((id) => getVegetableById(id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v))
    .map((v) =>
      [
        `### ${v.name} (${v.category}) — difficulty: ${v.difficulty}`,
        `- Sow indoors (months): ${v.sowIndoors.join(", ") || "n/a"}`,
        `- Sow outdoors (months): ${v.sowOutdoors.join(", ") || "n/a"}`,
        `- Transplant (months): ${v.transplant.join(", ") || "n/a"}`,
        `- Harvest (months): ${v.harvest.join(", ")}`,
        `- Common pests: ${v.pests.join("; ")}`,
        `- Common diseases: ${v.diseases.join("; ")}`,
        `- Care: ${v.pruningCare}`,
        `- Spacing: ${v.spacing}`,
        `- UK notes: ${v.notes}`,
      ].join("\n")
    )
    .join("\n\n");

  let weatherSection = "Weather data is currently unavailable — base advice on the season and region alone, and note that weather-specific guidance could not be included.";
  if (body.weather) {
    const w = body.weather;
    const dailyLines = w.daily
      .map(
        (d) =>
          `- ${d.date}: high ${d.high}°C, low ${d.low}°C, rain probability ${d.rainProbability}%`
      )
      .join("\n");
    const observedAt = Date.parse(w.observedAt);
    const staleHours = Number.isNaN(observedAt)
      ? null
      : Math.max(0, Math.round((Date.now() - observedAt) / 3_600_000));
    weatherSection = [
      `Current temperature: ${w.current.temp}°C.`,
      w.stale
        ? `Note: this forecast could not be refreshed${
            staleHours === null
              ? ""
              : ` and is roughly ${staleHours} hour${staleHours === 1 ? "" : "s"} old`
          } — weight it as background context rather than an exact current reading.`
        : "",
      `5-day forecast:`,
      dailyLines,
      w.warnings.frostSoon ? "⚠ Frost is forecast within the next 48 hours." : "",
      w.warnings.rainSoon ? "⚠ Rain is forecast within the next 48 hours." : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return `You are an expert UK vegetable-gardening adviser writing practical, weather-aware task lists for home gardeners, following RHS (Royal Horticultural Society) guidance.

Today's date: ${today}

## Gardener profile
- Region: ${body.region}
- Plot size: ${PLOT_SIZE_LABELS[body.plotSize] ?? body.plotSize}
- Growing environment: ${body.environment.join(", ") || "not specified"}
- Equipment available: ${body.equipment.join(", ") || "none specified"}

## Weather
${weatherSection}

## Advice period
Generate tasks for the period: ${TIMELINE_LABELS[body.timeline] ?? body.timeline} from today.

## The gardener's vegetables (RHS growing data)
${vegData}

## Instructions
- Produce specific, actionable tasks relevant to THIS period, THIS region and THIS weather. Do not invent tasks for months outside the period.
- Only suggest actions the gardener can perform with their stated equipment and growing environment (e.g. don't suggest greenhouse tasks if they have no greenhouse; suggest fleece only if they have fleece/netting).
- Prioritise: "high" for time-critical or weather-critical actions (frost protection, last chance to sow, harvest before spoiling), "medium" for beneficial routine work, "low" for optional or forward-planning tasks.
- Categories must be one of: sowing, planting, care, harvest, pest control, disease prevention, protection.
- Include a weatherNote only where the forecast genuinely changes what to do.
- Cover every selected vegetable that has something worth doing this period; it's fine to omit vegetables with nothing to do, but mention them in the summary if the whole period is quiet.
- Keep details practical and specific (quantities, depths, spacings, timings) rather than generic.
- Be concise: at most 2 tasks per vegetable, and keep each task's detail to 2–3 sentences. Prefer the single most valuable task per vegetable for short periods (24 hours / 3 days).

Return ONLY valid JSON — no markdown fences, no preamble, no trailing commentary — matching exactly this structure:
{
  "summary": "2-3 sentence overview of priorities for this period",
  "weatherWarnings": ["array of short warning strings, empty array if none"],
  "tasks": [
    {
      "vegetable": "Tomato",
      "priority": "high",
      "category": "care",
      "title": "Short imperative task title",
      "detail": "Detailed practical explanation of what to do and why.",
      "weatherNote": "Optional weather-specific note — omit this field if not relevant"
    }
  ]
}`;
}

function extractJson(text: string): AdviceResponse {
  // Defensive: strip code fences or stray prose around the JSON object.
  let candidate = text.trim();
  const fenceMatch = candidate.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) candidate = fenceMatch[1].trim();
  if (!candidate.startsWith("{")) {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON object found");
    candidate = candidate.slice(start, end + 1);
  }
  const parsed = JSON.parse(candidate);
  if (typeof parsed.summary !== "string" || !Array.isArray(parsed.tasks)) {
    throw new Error("Response missing required fields");
  }
  const tasks: AdviceTask[] = parsed.tasks
    .filter(
      (t: Partial<AdviceTask>) =>
        typeof t?.vegetable === "string" &&
        typeof t?.title === "string" &&
        typeof t?.detail === "string"
    )
    .map((t: AdviceTask) => ({
      vegetable: t.vegetable,
      priority: ["high", "medium", "low"].includes(t.priority) ? t.priority : "medium",
      category: t.category ?? "care",
      title: t.title,
      detail: t.detail,
      ...(t.weatherNote ? { weatherNote: t.weatherNote } : {}),
    }));
  return {
    summary: parsed.summary,
    weatherWarnings: Array.isArray(parsed.weatherWarnings)
      ? parsed.weatherWarnings.filter((w: unknown) => typeof w === "string")
      : [],
    tasks,
  };
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error: "We can't generate growing advice right now. Please try again.",
      },
      { status: 500 }
    );
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { error: "The advice request is too large." },
      { status: 413 },
    );
  }

  let body: AdviceRequestBody | null = null;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return NextResponse.json(
        { error: "The advice request is too large." },
        { status: 413 },
      );
    }
    body = parseAdviceRequest(JSON.parse(rawBody));
  } catch {
    body = null;
  }
  if (!body) {
    return NextResponse.json(
      { error: "Invalid request — vegetables and setup details are required." },
      { status: 400 }
    );
  }

  const retryAfter = consumeAdviceQuota(clientIdentifier(request));
  if (retryAfter !== null) {
    return NextResponse.json(
      { error: "Too many advice requests. Please wait and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: buildPrompt(body) }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text in model response");
    }
    const advice = extractJson(textBlock.text);
    return NextResponse.json(advice);
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: "The advice service had a problem responding. Please try again." },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "Couldn't generate advice this time. Please try again." },
      { status: 502 }
    );
  }
}
