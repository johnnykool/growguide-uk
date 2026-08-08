# GrowGuide UK 🌱

GrowGuide UK helps gardeners decide exactly what to do in their garden today. It combines local weather forecasts, RHS growing guidance, and AI reasoning to generate personalised daily gardening tasks tailored to each user's postcode, crops, and plot.

A full-stack web app that gives UK gardeners AI-generated, weather-aware growing advice tailored to their exact plot — postcode, crops, plot size, and the tools in their shed.

Tell it where you garden and what you grow, and it combines your local 5-day forecast with an RHS-based growing database to produce a prioritised task list: what to sow, plant, protect and harvest right now — including warnings like "frost Thursday night, fleece your seedlings."

## How it works

```
Browser (React/Next.js UI)
   │
   ├─ postcodes.io ──────────── postcode → lat/lng + region (geocoding)
   │
   └─ Next.js API routes (server-side — API keys never reach the browser)
        ├─ /api/weather ─────── OpenWeatherMap 5-day forecast, aggregated
        │                       into daily summaries + 48h frost/rain flags
        ├─ /api/weather-tiles ─ proxies OpenWeatherMap radar/cloud/temp map
        │                       tiles so the key stays hidden
        └─ /api/advice ──────── builds a prompt from the user's plot, live
                                forecast and RHS growing data, then calls
                                Claude (claude-sonnet-4-6) for a structured
                                JSON task list
```

- **No accounts, no database** — user setup, generated advice and task check-offs persist in `localStorage`. Returning visitors see their saved task list instantly; the AI is only called when they ask for fresh advice.
- **Interactive weather map** — Leaflet + OpenStreetMap centred on the user's plot, with live rain/cloud/temperature overlays.
- **Structured AI output** — the advice route prompts for strict JSON, parses defensively (fence-stripping, field validation, priority/category whitelisting) and degrades gracefully: if weather is unavailable, advice still generates and says so.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) · React 18 · TypeScript |
| Styling | Tailwind CSS with a custom earthy design system (DM Serif Display / DM Sans) |
| AI | Anthropic Claude API via the official `@anthropic-ai/sdk` |
| Weather | OpenWeatherMap (forecast + map tiles) |
| Geocoding | postcodes.io |
| Map | Leaflet + OpenStreetMap |
| Data | Hand-built database of 30 vegetables with RHS-based UK sowing/harvest windows, pests, diseases and care notes ([data/vegetables.ts](data/vegetables.ts)) |
| Hosting | Vercel, auto-deployed from this repo, on a custom subdomain |

## Running it locally

```bash
git clone https://github.com/johnnykool/growguide-uk.git
cd growguide-uk
npm install
cp .env.local.example .env.local   # then add your two API keys
npm run dev                        # → http://localhost:3000
```

You'll need two (free-tier friendly) keys in `.env.local`:

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [platform.claude.com](https://platform.claude.com/) |
| `OPENWEATHERMAP_API_KEY` | [openweathermap.org](https://openweathermap.org/api) |

Both are used only inside API route handlers. The app runs without the weather key (advice still works; the forecast banner and map overlays note they're unavailable).

## Project structure

```
app/
  page.tsx                    routes to setup wizard or dashboard
  api/advice/route.ts         Claude prompt build + JSON parsing
  api/weather/route.ts        forecast aggregation + frost/rain warnings
  api/weather-tiles/          server-side tile proxy
components/                   SetupWizard, Dashboard, WeatherMap, TaskCard…
data/vegetables.ts            the RHS-based growing database
lib/                          types, localStorage persistence, image maps
```

## Credits

Growing data based on [RHS](https://www.rhs.org.uk/) guidance · Photos from [Unsplash](https://unsplash.com) and [Pexels](https://pexels.com) · Weather by [OpenWeatherMap](https://openweathermap.org) · Geocoding by [postcodes.io](https://postcodes.io) · Map tiles © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors

Built by John Worley using AI-assisted development ([Claude Code](https://claude.com/claude-code)).
