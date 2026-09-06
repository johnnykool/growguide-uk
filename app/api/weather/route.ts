import { NextResponse } from "next/server";
import {
  gridKey,
  readStoredForecast,
  roundToGrid,
  storeForecast,
} from "@/lib/weather/cache";
import { fetchForecast } from "@/lib/weather/metoffice";
import { normaliseForecast } from "@/lib/weather/normalise";

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
    lat = Number(body.lat);
    lng = Number(body.lng);
    if (!isFinite(lat) || !isFinite(lng)) throw new Error("bad coords");
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
  } catch {
    // Past the daily quota, or upstream is down. A forecast a few hours old
    // beats no forecast, so long as the banner says how old it is.
    const stored = readStoredForecast(key);
    if (stored) return NextResponse.json(stored);

    return NextResponse.json(
      { error: "Could not reach the weather service. Please try again." },
      { status: 502 }
    );
  }
}
