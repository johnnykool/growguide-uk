# GrowGuide UK 🌱

A vegetable planner and growing guide for UK gardeners. Next.js (App Router) + TypeScript + Tailwind CSS. No accounts — your setup lives in your browser's localStorage.

## Getting started

1. Copy `.env.local.example` to `.env.local` and add your keys:
   - `OPENWEATHERMAP_API_KEY` — free at [openweathermap.org](https://openweathermap.org/api) (5 day / 3 hour forecast)
   - `ANTHROPIC_API_KEY` — from [platform.claude.com](https://platform.claude.com/)
2. Install and run:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

> **Note:** Node.js isn't on this machine's default PATH — a standalone Node v22 was installed at
> `~/.local/node/node-v22.17.0-darwin-x64/bin`. Either add that to your PATH
> (`export PATH="$HOME/.local/node/node-v22.17.0-darwin-x64/bin:$PATH"`) or install Node another way.

## How it works

- **First visit** — a setup screen collects your postcode (resolved to lat/lng/region via postcodes.io), the vegetables you grow, plot size/environment and equipment. Everything is stored under the `growguide-user` localStorage key.
- **Return visits** — you go straight to the dashboard: a live weather banner (with terracotta warnings when frost or rain is due within 48 hours), a timeline picker, and a "Get Growing Advice" button that asks Claude (`claude-sonnet-4-6`) for a prioritised, weather-aware task list built from the RHS-based vegetable database in [data/vegetables.ts](data/vegetables.ts).
- Both API keys stay server-side in the route handlers ([app/api/weather/route.ts](app/api/weather/route.ts), [app/api/advice/route.ts](app/api/advice/route.ts)). If weather is unavailable, advice still works and notes the gap; if the AI call fails, you get a friendly retry.
