import { NextResponse } from "next/server";

// Proxies OpenWeatherMap map tiles so the API key never reaches the browser.
// URL shape: /api/weather-tiles/{layer}/{z}/{x}/{y}

const ALLOWED_LAYERS = new Set([
  "precipitation_new",
  "clouds_new",
  "temp_new",
  "wind_new",
]);

export async function GET(
  _request: Request,
  { params }: { params: { tile: string[] } }
) {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const [layer, z, x, y] = params.tile ?? [];
  if (
    !ALLOWED_LAYERS.has(layer) ||
    ![z, x, y].every((v) => /^\d+$/.test(v ?? ""))
  ) {
    return NextResponse.json({ error: "Bad tile request" }, { status: 400 });
  }

  const upstream = await fetch(
    `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${apiKey}`,
    { next: { revalidate: 600 } }
  );
  if (!upstream.ok) {
    return new NextResponse(null, { status: upstream.status });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": "image/png",
      // Tiles change slowly; let browsers and the CDN cache them.
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}
