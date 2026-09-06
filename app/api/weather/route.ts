import { NextResponse } from "next/server";
import { DailySummary, WeatherData } from "@/lib/types";

interface ForecastEntry {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number };
  weather: { description: string; icon: string; main: string }[];
  pop?: number;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather service is not configured (missing OPENWEATHERMAP_API_KEY)." },
      { status: 500 }
    );
  }

  let lat: number, lng: number;
  try {
    const body = await request.json();
    lat = Number(body.lat);
    lng = Number(body.lng);
    if (!isFinite(lat) || !isFinite(lng)) throw new Error("bad coords");
  } catch {
    return NextResponse.json(
      { error: "Invalid request — lat and lng are required." },
      { status: 400 }
    );
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Weather service returned an error (${res.status}).` },
        { status: 502 }
      );
    }
    const data = await res.json();
    const list: ForecastEntry[] = data.list ?? [];
    if (list.length === 0) {
      return NextResponse.json(
        { error: "Weather service returned no forecast data." },
        { status: 502 }
      );
    }

    const current = {
      temp: Math.round(list[0].main.temp),
      description: list[0].weather[0]?.description ?? "unknown",
      icon: list[0].weather[0]?.icon ?? "01d",
    };

    // Group 3-hourly entries into daily summaries.
    const byDate = new Map<string, ForecastEntry[]>();
    for (const entry of list) {
      const date = new Date(entry.dt * 1000).toISOString().slice(0, 10);
      const bucket = byDate.get(date) ?? [];
      bucket.push(entry);
      byDate.set(date, bucket);
    }

    const daily: DailySummary[] = [];
    for (const [date, entries] of Array.from(byDate.entries()).slice(0, 5)) {
      const highs = entries.map((e) => e.main.temp_max);
      const lows = entries.map((e) => e.main.temp_min);
      // Pick the condition from the midday-ish entry as representative.
      const midday =
        entries.find((e) => new Date(e.dt * 1000).getUTCHours() >= 12) ??
        entries[Math.floor(entries.length / 2)];
      daily.push({
        date,
        dayName: new Date(date + "T12:00:00Z").toLocaleDateString("en-GB", {
          weekday: "short",
        }),
        high: Math.round(Math.max(...highs)),
        low: Math.round(Math.min(...lows)),
        conditions: midday.weather[0]?.description ?? "unknown",
        icon: midday.weather[0]?.icon ?? "01d",
        rainProbability: Math.round(
          Math.max(...entries.map((e) => e.pop ?? 0)) * 100
        ),
      });
    }

    // Warnings: rain or frost within the next 48 hours.
    const cutoff = Date.now() / 1000 + 48 * 3600;
    const next48 = list.filter((e) => e.dt <= cutoff);
    const rainSoon = next48.some(
      (e) => (e.pop ?? 0) >= 0.5 || /rain|drizzle|thunder/i.test(e.weather[0]?.main ?? "")
    );
    const frostSoon = next48.some((e) => e.main.temp_min <= 1);

    const payload: WeatherData = {
      current,
      daily,
      // Stopgap: OpenWeatherMap forecast response carries no model-run timestamp. This route is superseded by the Met Office implementation in a later task.
      observedAt: new Date().toISOString(),
      warnings: { rainSoon, frostSoon },
    };
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Could not reach the weather service. Please try again." },
      { status: 502 }
    );
  }
}
