import { NextResponse } from "next/server";

// Proxies OpenWeatherMap map tiles so the API key never reaches the browser.
// URL shape: /api/weather-tiles/{layer}/{z}/{x}/{y}

const ALLOWED_LAYERS = new Set([
  "precipitation_new",
  "clouds_new",
  "temp_new",
  "wind_new",
]);

// Leaflet loads tiles as <img> elements, and browsers send no Origin header on
// an image GET, so the advice route's isSameOrigin check would reject every
// legitimate tile here. Sec-Fetch-Site and Referer are what a browser does
// send: the first on any current engine, the second under this site's
// strict-origin-when-cross-origin policy. So rather than demand proof that a
// request is same-site, reject only on positive evidence that it is not. That
// stops another site embedding these tiles in its own map and billing our key
// for them. A scripted client sending neither header still gets through: the
// same bargain the advice route already makes, and a provider spend cap is
// what bounds the worst case.
//
// This guards cache misses only, because a warm CDN entry is served without
// reaching this code at all. That is the right boundary rather than a gap in
// it: a cache hit costs no upstream call, and upstream calls are the whole of
// what the key is billed for.
const SAME_SITE_VALUES = new Set(["same-origin", "same-site", "none"]);

function isCrossSite(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return !SAME_SITE_VALUES.has(fetchSite);

  const referer = request.headers.get("referer");
  if (!referer) return false;
  try {
    return new URL(referer).host !== new URL(request.url).host;
  } catch {
    // An unparseable Referer is not something a browser produces.
    return true;
  }
}

export async function GET(
  request: Request,
  // Next 15 resolves route params asynchronously.
  { params }: { params: Promise<{ tile: string[] }> }
) {
  if (isCrossSite(request)) {
    // Never cached: a stored 403 would outlive the request that earned it and
    // be replayed to the site's own users for the rest of the window.
    return NextResponse.json(
      { error: "Not available off-site" },
      { status: 403, headers: { "Cache-Control": "no-store" } }
    );
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const [layer, z, x, y] = (await params).tile ?? [];
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
