# Met Office DataHub Forecast Swap

## Purpose

Replace OpenWeatherMap as GrowGuide's forecast source with the Met Office DataHub
site-specific API. The current forecast is inaccurate over the UK, partly because
OpenWeatherMap's free 5-day/3-hour endpoint runs a coarse global model, and partly
because the aggregation code introduces errors of its own.

## Scope

This change rewrites the forecast path only: `app/api/weather/route.ts` and the
modules it will be split into. The `WeatherData` contract stays stable, so
`Dashboard`, `WeatherBanner`, `TaskCard`, and the advice route need no edits beyond
two new optional fields.

OpenWeatherMap remains in the project. DataHub's raster map products are a separate
paid subscription, so `app/api/weather-tiles/[...tile]/route.ts` continues to proxy
OpenWeatherMap tiles unchanged. The project will carry both keys.

## Defects This Fixes

The existing route has five distinct accuracy faults, all of which disappear with the
new source and mapping.

1. `current` reads `list[0]`, the first *forecast* slot, so the displayed "now"
   temperature can be up to three hours stale or ahead.
2. Days are bucketed by UTC date. During British Summer Time the 00:00 BST slot falls
   into the previous day and drags that day's low down.
3. `temp_min` and `temp_max` in a 3-hourly forecast entry are not daily extremes.
   OpenWeatherMap returns them equal to `temp` in most entries, so the strip's highs
   and lows understate the true daily range.
4. Today's bucket is partial. Viewed at 16:00, "today's high" reflects only the
   remaining slots and reads low.
5. The frost warning triggers at 1 °C air temperature. Ground frost forms while screen
   temperature is still near 3–4 °C, so real frosts pass unwarned.

## Upstream API

Base URL `https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/`, with the key
supplied in an `apikey` request header. Responses are GeoJSON: the forecast series sits
at `features[0].properties.timeSeries`, alongside `modelRunDate` and
`requestPointDistance`, the distance in metres to the site the forecast was drawn from.

Two endpoints are called per refresh.

`daily` returns eight entries, the first of which is the previous day. Each entry carries `dayMaxScreenTemperature`,
`nightMinScreenTemperature`, `daySignificantWeatherCode`, `nightSignificantWeatherCode`,
`dayProbabilityOfRain`, `nightProbabilityOfRain`, `maxUvIndex`, and confidence bounds on
each temperature.

`hourly` returns 49 entries, spanning the current hour to 48 hours ahead. Each entry carries `screenTemperature`,
`significantWeatherCode`, `probOfPrecipitation`, `minScreenAirTemp`,
`feelsLikeTemperature`, and `precipitationRate`.

Both endpoints use `-99` as a not-available sentinel, and may omit fields entirely. The
daily series leads with the previous day, whose daytime fields are absent while its
night fields are present. `properties.location` is absent unless explicitly requested,
and nothing here depends on it.

## Quota

The free tier allows 360 calls per day, resetting at 00:00 UTC. This is tighter than
OpenWeatherMap's 1,000, and it constrains the design.

Grid rounding reduces cost only where users share a cell; it does not reduce the cost of
a distinct location. At a three-hour cache lifetime and two endpoints per refresh, each
distinct grid cell someone visits costs sixteen calls per day. The free tier therefore
supports roughly twenty distinct locations per day. That is adequate for present traffic
and will not survive growth.

The route degrades rather than failing when the ceiling arrives. It never silently
reports a stale forecast as current.

## Architecture

The route currently performs fetching, aggregation, and warning logic inline. It splits
into three modules, each independently testable.

`lib/weather/metoffice.ts` is the upstream client. It fetches the daily and hourly
endpoints, types the responses to the real DataHub shapes, and knows nothing about
GrowGuide's UI types. It normalises `-99` and absent fields to `undefined` at this
boundary, so no downstream code handles sentinels.

`lib/weather/normalise.ts` maps DataHub responses onto `WeatherData`. It owns the
significant weather code table and the frost and rain thresholds.

`lib/weather/cache.ts` owns grid rounding and the last-good store.

`app/api/weather/route.ts` becomes thin: validate coordinates, call the cached fetch,
return the payload or an error.

## Caching

Coordinates round to 0.01° before any upstream call, roughly 1.1 km north to south and
0.7 km east to west at UK latitudes.

Rounding is a minor optimisation rather than the main quota lever, and the spec should
not overstate it. Coordinates reach this route from a postcode lookup, so they are
already identical for repeat visits from the same postcode and would cache correctly
without rounding at all. Rounding helps only where two different postcodes fall in one
cell, which is common in cities and rare in the countryside. The three-hour lifetime is
what actually contains the call volume.

Resolution is therefore chosen for accuracy rather than for quota. A live request
resolved to a forecast site 222 m away, so sites are dense enough that coarse rounding
would select a different site than the user's own. That matters most for exactly the
case this application cares about: frost forms in valley bottoms and not on hillsides
a few kilometres away.

Two layers sit behind the rounding.

The primary cache is Next's data cache, through `fetch(url, { next: { revalidate: 10800 } })`.
On Vercel this is shared across instances, and it is the mechanism the current route
already relies on.

The secondary layer is a module-level map from grid cell to the last successful
`WeatherData`. When upstream returns 429, returns 5xx, or cannot be reached, the route
serves the stored payload with `stale: true` rather than an error.

This map is per-instance and does not survive a cold start. It is a safety net for the
quota ceiling, not a durable cache. Durable stale storage would require Vercel KV, which
is deliberately out of scope until the ceiling proves to be a real problem in production.

When no stored payload exists and upstream fails, the route returns the existing error
shape. `WeatherBanner` and the advice route already degrade gracefully in that case.

## Field Mapping

`current.temp` comes from the hourly entry nearest the present moment, via
`screenTemperature`. Its description and icon come from that entry's
`significantWeatherCode`.

`daily[].high` and `daily[].low` come from `dayMaxScreenTemperature` and
`nightMinScreenTemperature`. These are true day and night extremes, which removes the
need to aggregate anything.

`daily[].date` and `daily[].dayName` come from the daily entry's `time` field, which
already denotes the local day. No UTC bucketing occurs, so the British Summer Time fault
cannot recur.

`daily[].rainProbability` takes the greater of `dayProbabilityOfRain` and
`nightProbabilityOfRain`.

`warnings.rainSoon` is true when any hourly entry within 48 hours has
`probOfPrecipitation` of 50 or more.

`warnings.frostSoon` is true when any hourly entry within 48 hours has `minScreenAirTemp`
of 3 or below.

The daily series filters to today and later before the first five days are taken, which
discards any partial leading day.

## Weather Codes

`significantWeatherCode` runs 0 to 30, with 4 unused. Each code maps to a description and
to an OpenWeatherMap-style icon code, so `WeatherBanner.weatherEmoji` continues to work
without modification.

| Code | Meaning | Icon |
| --- | --- | --- |
| 0 | Clear night | `01n` |
| 1 | Sunny day | `01d` |
| 2 | Partly cloudy, night | `02n` |
| 3 | Partly cloudy, day | `02d` |
| 5 | Mist | `50d` |
| 6 | Fog | `50d` |
| 7 | Cloudy | `03d` |
| 8 | Overcast | `04d` |
| 9 | Light rain shower, night | `09n` |
| 10 | Light rain shower, day | `09d` |
| 11 | Drizzle | `09d` |
| 12 | Light rain | `10d` |
| 13 | Heavy rain shower, night | `09n` |
| 14 | Heavy rain shower, day | `09d` |
| 15 | Heavy rain | `10d` |
| 16 | Sleet shower, night | `13n` |
| 17 | Sleet shower, day | `13d` |
| 18 | Sleet | `13d` |
| 19 | Hail shower, night | `13n` |
| 20 | Hail shower, day | `13d` |
| 21 | Hail | `13d` |
| 22 | Light snow shower, night | `13n` |
| 23 | Light snow shower, day | `13d` |
| 24 | Light snow | `13d` |
| 25 | Heavy snow shower, night | `13n` |
| 26 | Heavy snow shower, day | `13d` |
| 27 | Heavy snow | `13d` |
| 28 | Thunder shower, night | `11n` |
| 29 | Thunder shower, day | `11d` |
| 30 | Thunder | `11d` |

An unrecognised or absent code yields the description `unknown` and the icon `01d`,
matching the current route's fallback.

Daily summaries use `daySignificantWeatherCode`. The current reading uses the hourly
`significantWeatherCode`, whose night variants — 0, 2, 9, 13, 16, 19, 22, 25, and 28 —
determine the day or night icon suffix directly. No sunrise calculation is needed.

## Behaviour Changes

Two changes alter what users see, and both are deliberate.

The frost threshold moves from 1 °C to 3 °C. Screen temperature is measured at 1.25 m,
and ground frost forms while air at that height remains near 3–4 °C. The banner's wording
becomes `Frost risk in the next 48 hours — protect tender plants and seedlings.`

A forecast served past the quota ceiling is labelled. When `stale` is true, the banner
appends the age of the reading, taken from `observedAt`.

## Type Changes

`WeatherData` gains two fields.

`observedAt` is a required ISO date-time string carrying the upstream `modelRunDate`.

`stale` is an optional boolean, present and true only when the payload came from the
last-good store.

`DailySummary` is otherwise unchanged. The comment on its `icon` field changes from
"OpenWeatherMap icon code" to "icon key", since the values remain the same strings.

## Configuration

`METOFFICE_API_KEY` is added and read server-side only, in the forecast route.

`OPENWEATHERMAP_API_KEY` remains, now read only by the tile proxy. `.env.local.example`
and the README state this narrower purpose, and the README's technology table credits
the Met Office for forecasts and OpenWeatherMap for map tiles.

Absent `METOFFICE_API_KEY`, the forecast route returns its existing configuration error
and the rest of the application continues to work, as it does today.

## Testing

`main` has no test runner. Vitest, jsdom, and Testing Library exist only on the
`codex/growguide-true-rebuild` branch. This change adds the same versions and
configuration to `main`, so the two branches converge rather than diverge.

A captured DataHub daily response serves as the fixture, with a matching hourly fixture.

Tests cover grid rounding, including sign handling for western longitudes; the weather
code table across day codes, night codes, the unused 4, and out-of-range input;
normalisation from fixture to `WeatherData`; coercion of `-99` and absent fields;
exclusion of a partial leading day; the frost and rain thresholds at and either side of
their boundaries; stale serving on 429 with `stale` set; and the error path when no
stored payload exists.

## Verification

Confirmed against the live API on 6 September 2026 with a Global Spot key, and the
responses are committed as fixtures in `lib/weather/__fixtures__/`.

The `apikey` header, the GeoJSON envelope, `modelRunDate`, `requestPointDistance`, and
every daily and hourly field named above are present as specified. The leading partial
day is real: its `daySignificantWeatherCode`, `dayProbabilityOfRain`, and `maxUvIndex`
are absent while `dayMaxScreenTemperature` and `nightMinScreenTemperature` are present,
so a partial day cannot be detected by a missing maximum and must be excluded by date.
No `-99` appeared in either response; the sentinel handling stays as documented defence.
Observed weather codes fell within 0 to 12, so the table above remains verified against
published implementations rather than exercised end to end.

## Out of Scope

Vercel KV or any durable stale store. Reconciliation with the weather interface on
`codex/growguide-true-rebuild`, which carries its own `WeatherWorksurface`,
`WeatherActionCue`, and `WeatherBanner` tests. Holding `WeatherData` stable is what keeps
that later merge cheap. Met Office severe weather warnings, UV index, and wind, all of
which the API now makes available and none of which the interface currently shows.
