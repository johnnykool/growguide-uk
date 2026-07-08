import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getVegetableById } from "@/data/vegetables";
import {
  AdviceResponse,
  AdviceTask,
  PLOT_SIZE_LABELS,
  TIMELINE_LABELS,
  Timeline,
  PlotSize,
  WeatherData,
} from "@/lib/types";

export const maxDuration = 60;

interface AdviceRequestBody {
  postcode: string;
  region: string;
  lat: number;
  lng: number;
  vegetables: string[];
  plotSize: PlotSize;
  environment: string[];
  equipment: string[];
  timeline: Timeline;
  weather: WeatherData | null;
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
          `- ${d.dayName} ${d.date}: high ${d.high}°C, low ${d.low}°C, ${d.conditions}, rain probability ${d.rainProbability}%`
      )
      .join("\n");
    weatherSection = [
      `Current conditions: ${w.current.temp}°C, ${w.current.description}.`,
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
- Location: postcode ${body.postcode}, region: ${body.region} (lat ${body.lat}, lng ${body.lng})
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
      { error: "Advice service is not configured (missing ANTHROPIC_API_KEY)." },
      { status: 500 }
    );
  }

  let body: AdviceRequestBody;
  try {
    body = await request.json();
    if (!Array.isArray(body.vegetables) || body.vegetables.length === 0) {
      throw new Error("no vegetables");
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid request — vegetables and setup details are required." },
      { status: 400 }
    );
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
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
