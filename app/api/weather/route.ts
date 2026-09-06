import { NextResponse } from "next/server";
import {
  gridKey,
  readStoredForecast,
  roundToGrid,
  storeForecast,
} from "@/lib/weather/cache";
import { fetchForecast } from "@/lib/weather/metoffice";
import { normaliseForecast } from "@/lib/weather/normalise";

// Real-world latitude/longitude ranges. `Number()` coercion turns things
// like null, "", [], and true into finite numbers (0, 0, 0, 1), so we
// require a genuine `number` type in addition to the range check.
function isUsableCoordinate(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

export async function POST(request: Request) {
  const apiKey = process.env.METOFFICE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather service is not configured (missing METOFFICE_API_KEY)." },
      { status: 500 }
    );
  }

  let lat: number, lng: number;
  try {
    const body = await request.json();
    if (
      !isUsableCoordinate(body.lat, -90, 90) ||
      !isUsableCoordinate(body.lng, -180, 180)
    ) {
      throw new Error("bad coords");
    }
    lat = body.lat;
    lng = body.lng;
  } catch {
    return NextResponse.json(
      { error: "Invalid request — lat and lng are required." },
      { status: 400 }
    );
  }

  const key = gridKey(lat, lng);

  try {
    const forecast = await fetchForecast(
      roundToGrid(lat),
      roundToGrid(lng),
      apiKey
    );
    const weather = normaliseForecast(forecast);
    storeForecast(key, weather);
    return NextResponse.json(weather);
  } catch (error) {
    // Past the daily quota, upstream is down, or normaliseForecast hit a
    // genuine bug. Log server-side (grid key only — never raw coordinates,
    // the API key, or the upstream URL) so a real regression isn't invisible
    // in production, then fall back exactly as before: a forecast a few
    // hours old beats no forecast, so long as the banner says how old it is.
    console.error(`Weather fetch failed for grid ${key}:`, error);
    const stored = readStoredForecast(key);
    if (stored) return NextResponse.json(stored);

    return NextResponse.json(
      { error: "Could not reach the weather service. Please try again." },
      { status: 502 }
    );
  }
}
