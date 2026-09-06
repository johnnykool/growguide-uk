import { NextResponse } from "next/server";
import {
  gridKey,
  readStoredForecast,
  roundToGrid,
  storeForecast,
} from "@/lib/weather/cache";
import { fetchForecast } from "@/lib/weather/metoffice";
import { normaliseForecast } from "@/lib/weather/normalise";

// `Number()` coercion turns things like null, "", [], and true into finite
// numbers (0, 0, 0, 1), so we require a genuine `number` type in addition to
// the range check.
function isUsableCoordinate(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

// Coordinates only ever originate from a postcodes.io UK postcode lookup in
// the setup wizard, so anything outside the UK is a malformed or malicious
// request rather than a legitimate one. This box — not the ±90/±180 globe —
// is the bound that matters: the Met Office free tier allows only 360
// calls/day and each distinct grid cell costs 2 calls per 3-hour cache
// window, so an unthrottled endpoint accepting arbitrary global coordinates
// could burn the entire day's quota for every user in well under 200 POSTs.
const UK_LAT_MIN = 49.5;
const UK_LAT_MAX = 61.1;
const UK_LNG_MIN = -8.7;
const UK_LNG_MAX = 2.1;

export async function POST(request: Request) {
  const apiKey = process.env.METOFFICE_API_KEY;
  if (!apiKey) {
    // Name the variable in the server log, never in the response — the client
    // has no use for our configuration and an attacker shouldn't learn it.
    console.error("Weather route is not configured: METOFFICE_API_KEY is unset");
    return NextResponse.json(
      { error: "Weather is unavailable right now." },
      { status: 500 }
    );
  }

  let lat: number, lng: number;
  try {
    const body = await request.json();
    if (
      !isUsableCoordinate(body.lat, UK_LAT_MIN, UK_LAT_MAX) ||
      !isUsableCoordinate(body.lng, UK_LNG_MIN, UK_LNG_MAX)
    ) {
      throw new Error("bad coords");
    }
    lat = body.lat;
    lng = body.lng;
  } catch {
    return NextResponse.json(
      { error: "Please provide a valid location." },
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
      { error: "Weather is unavailable right now." },
      { status: 502 }
    );
  }
}
