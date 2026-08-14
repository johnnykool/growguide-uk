# GrowGuide UK Rain to Action Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the dashboard’s first working frame so forecast conditions visibly land on a specific local action, the seasonal timeline appears before the map, and the shipped interface fully uses the Gravity Rain visual language.

**Architecture:** Preserve the current profile, weather, advice, storage, confirmation, abort, and API flows. Add one deterministic presentational weather-cue component, one authored black-flower SVG component, then recompose existing dashboard components around them without changing request payloads or persisted data.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Vitest, Testing Library, semantic SVG.

**Spec:** `docs/superpowers/specs/2026-08-09-growguide-gravity-rain-identity-design.md`

## Global Constraints

- Approved world: Gravity Rain; approved composition: `.impeccable/mocks/gravity-rain-c.webp`.
- Garden ground `#20312C`; pale mineral `#E7E8E4`; sky blue `#7DB8E6`; ember coral `#E0645B`; moss veil `#A6B49C`; black flower `#0E0F10`.
- Preserve advice requests, confirmation, abort behaviour, cached tasks, checkboxes, storage warnings, setup, privacy, and API payloads unchanged.
- Add no account, analytics, AI call, user-data field, or measured garden geometry.
- Keep user-facing text and interruptions minimal.
- Keep 44-pixel touch targets, semantic headings, keyboard access, WCAG AA text contrast, and 3:1 focus/essential-graphic contrast.
- Motion runs once and stops; reduced-motion users see the final state.
- No Unicode flower, gardening emoji, photo hero, rounded-card, shadow-soft, or compatibility colour aliases on the rebuilt dashboard surfaces.

---

### Task 1: Deterministic Weather-to-Action Cue

**Files:**
- Create: `components/WeatherActionCue.tsx`
- Create: `components/WeatherActionCue.test.tsx`
- Modify: `components/WeatherBanner.tsx`
- Modify: `components/WeatherBanner.test.tsx`

**Interfaces:**
- Consumes: `WeatherData | null` from `lib/types.ts`.
- Produces: `getWeatherActionCue(weather): { kind: "rain" | "frost"; text: string } | null`.
- Produces: `WeatherActionCue({ weather, id? }: { weather: WeatherData | null; id?: string })`.
- Task 3 consumes the component in the priority panel and uses `id="weather-action-target"` as the connector endpoint.

- [ ] **Step 1: Write the failing cue tests**

Create `components/WeatherActionCue.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { WeatherData } from "@/lib/types";
import WeatherActionCue, { getWeatherActionCue } from "./WeatherActionCue";

const base: WeatherData = {
  current: { temp: 12, description: "light rain", icon: "10d" },
  daily: [],
  warnings: { rainSoon: false, frostSoon: false },
};

describe("WeatherActionCue", () => {
  it("turns rain risk into one local watering action", () => {
    render(<WeatherActionCue weather={{ ...base, warnings: { rainSoon: true, frostSoon: false } }} />);
    expect(screen.getByRole("note", { name: "Weather-linked action" })).toHaveTextContent(
      "Rain ahead — check the soil before watering.",
    );
  });

  it("prioritises frost when both warnings are present", () => {
    expect(getWeatherActionCue({
      ...base,
      warnings: { rainSoon: true, frostSoon: true },
    })).toEqual({
      kind: "frost",
      text: "Frost risk — protect tender crops before temperatures drop.",
    });
  });

  it("renders nothing without a warning", () => {
    const { container } = render(<WeatherActionCue weather={base} />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run RED**

Run:

```bash
npx vitest run components/WeatherActionCue.test.tsx components/WeatherBanner.test.tsx
```

Expected: fail because `WeatherActionCue.tsx` does not exist.

- [ ] **Step 3: Implement the cue and simplify the banner**

Implement the exact priority rule and strings from the tests. Render the cue as:

```tsx
<aside id={id} role="note" aria-label="Weather-linked action">
  <span aria-hidden="true" />
  <p>{cue.text}</p>
</aside>
```

Use a fine blue top rule on mobile and a blue left rule on desktop; use coral only for frost. Remove the banner’s generic `Rain may change your next tasks` block and its internal trajectory. Keep the forecast region, symbols, daily list, loading, error, retry, and reduced-motion behaviour otherwise unchanged. Update `WeatherBanner.test.tsx` so the success test asserts the forecast data but not the removed generic warning.

- [ ] **Step 4: Run GREEN and regression checks**

Run:

```bash
npx vitest run components/WeatherActionCue.test.tsx components/WeatherBanner.test.tsx
npx tsc --noEmit
```

Expected: all pass without warnings.

- [ ] **Step 5: Commit**

```bash
git add components/WeatherActionCue.tsx components/WeatherActionCue.test.tsx components/WeatherBanner.tsx components/WeatherBanner.test.tsx
git commit -m "feat: connect forecast to a local action"
```

### Task 2: Authored Black-Flower and Semantic Dashboard Surfaces

**Files:**
- Create: `components/BlackFlowerMark.tsx`
- Create: `components/BlackFlowerMark.test.tsx`
- Modify: `components/PlotSummary.tsx`
- Modify: `components/PlotSummary.test.tsx`
- Modify: `components/SeasonalCalendar.tsx`
- Modify: `components/SeasonalCalendar.test.tsx`
- Modify: `components/WeatherBanner.tsx`
- Modify: `components/Dashboard.tsx`
- Modify: `components/InterfaceAccessibility.test.ts`

**Interfaces:**
- Produces: `BlackFlowerMark({ className?, title? }: { className?: string; title?: string })`.
- PlotSummary consumes the mark decoratively beside `Your plot`.
- Task 3 relies on all rebuilt dashboard-visible surfaces using semantic Gravity Rain tokens.

- [ ] **Step 1: Write the failing authored-mark and surface tests**

Create `components/BlackFlowerMark.test.tsx` with the same accessibility contract as `BrandMark`: decorative by default and nameable with a title. Extend `PlotSummary.test.tsx`:

```tsx
const view = render(<PlotSummary profile={profile} month={8} />);
expect(view.container).not.toHaveTextContent("✿");
expect(view.container.querySelector('[data-black-flower="true"]')).toBeInTheDocument();
```

Extend `InterfaceAccessibility.test.ts` to read `WeatherBanner.tsx`, `PlotSummary.tsx`, and `SeasonalCalendar.tsx`, then assert their joined source does not match:

```ts
/rounded-card|shadow-soft|bg-(cream|sage|warm-stone)|text-(dark-earth|earth-ink)|border-dark-earth|ring-(moss|terracotta)/
```

Also assert Dashboard source contains neither `✿` nor `🥀`.

- [ ] **Step 2: Run RED**

Run:

```bash
npx vitest run components/BlackFlowerMark.test.tsx components/PlotSummary.test.tsx components/SeasonalCalendar.test.tsx components/WeatherBanner.test.tsx components/InterfaceAccessibility.test.ts
```

Expected: missing component, Unicode flower, compatibility aliases, rounded-card, and shadow-soft fail the new contracts.

- [ ] **Step 3: Implement the authored mark and semantic migration**

Create a 32×32 current-colour SVG flower with five individually authored petal paths around one central circle. Use `useId()` for titled instances, `data-black-flower="true"`, `fill="currentColor"`, no Unicode, and no enclosing badge.

Replace PlotSummary’s `✿` with the decorative mark. Convert PlotSummary and SeasonalCalendar classes to `garden-ground`, `pale-mineral`, `rain-ink`, `ember`, `moss-veil`, and `black-flower` tokens. Convert WeatherBanner loading/error/success surfaces to square matte fine-line panels with semantic tokens; remove rounded-card and shadow-soft. Remove the Dashboard advice-error emoji and keep the same error copy and retry action.

- [ ] **Step 4: Run GREEN and full regression**

Run:

```bash
npx vitest run components/BlackFlowerMark.test.tsx components/PlotSummary.test.tsx components/SeasonalCalendar.test.tsx components/WeatherBanner.test.tsx components/InterfaceAccessibility.test.ts
npm test
npx tsc --noEmit
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add components/BlackFlowerMark.tsx components/BlackFlowerMark.test.tsx components/PlotSummary.tsx components/PlotSummary.test.tsx components/SeasonalCalendar.tsx components/SeasonalCalendar.test.tsx components/WeatherBanner.tsx components/Dashboard.tsx components/InterfaceAccessibility.test.ts
git commit -m "feat: complete Gravity Rain dashboard language"
```

### Task 3: Compact Shared Rain-to-Action Composition

**Files:**
- Modify: `components/Dashboard.tsx`
- Modify: `components/Dashboard.test.tsx`
- Modify: `components/WeatherMap.tsx`
- Modify: `components/WeatherMap.test.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `WeatherActionCue` from Task 1 with `id="weather-action-target"`.
- Produces: one `data-testid="weather-action-path"` SVG, decorative and desktop-only.
- Keeps WeatherMap props unchanged; only its visual height and placement change.

- [ ] **Step 1: Write the failing composition tests**

Update the Dashboard test WeatherMap mock to:

```tsx
vi.mock("./WeatherMap", () => ({
  default: () => <section aria-label="Weather map reference" />,
}));
```

Add a warning fixture and test:

```tsx
it("links forecast risk to a specific action and keeps season before the map", async () => {
  const rainy = { ...weather, warnings: { rainSoon: true, frostSoon: false } };
  vi.stubGlobal("fetch", vi.fn().mockImplementation((input: unknown) => {
    if (routeOf(input) === "/api/weather") return Promise.resolve(response(rainy));
    if (routeOf(input) === "/api/advice") return Promise.resolve(response(replacementAdvice));
    return Promise.reject(new Error("Unexpected request"));
  }));

  render(<Dashboard profile={profile} onEdit={vi.fn()} />);

  const cue = await screen.findByRole("note", { name: "Weather-linked action" });
  expect(cue).toHaveTextContent("Rain ahead — check the soil before watering.");
  expect(screen.getByTestId("weather-action-path")).toHaveAttribute("aria-hidden", "true");

  const season = screen.getByRole("region", { name: "This season" });
  const map = screen.getByRole("region", { name: "Weather map reference" });
  expect(season.compareDocumentPosition(map) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
```

Extend `WeatherMap.test.tsx` to assert its map container uses a compact height no larger than Tailwind `h-52`.

- [ ] **Step 2: Run RED**

Run:

```bash
npx vitest run components/Dashboard.test.tsx components/WeatherMap.test.tsx
```

Expected: cue, cross-panel path, season-before-map order, and compact map height are missing.

- [ ] **Step 3: Recompose the first working frame**

In Dashboard:

- remove `Your growing dashboard` and `Priorities`;
- make the h1 compact (`text-2xl sm:text-3xl`) and keep postcode summary plus Edit setup in one responsive row;
- wrap heading, forecast, and workspace in one relative `rain-action-composition`;
- place WeatherActionCue at the top of `What needs doing`;
- add one `aria-hidden="true"`, `data-testid="weather-action-path"` blue dashed SVG, hidden below `lg`, running from the forecast’s lower-right field to the cue’s left edge;
- keep mobile priorities first and plot second;
- render SeasonalCalendar immediately after the 60/40 workspace;
- render WeatherMap after the seasonal timeline as a full-width secondary reference.

In WeatherMap, change the map canvas from `h-64` to `h-48 sm:h-52`. In globals.css, add one-run `rain-action-path` draw motion using the existing exponential ease and disable it under `prefers-reduced-motion`.

- [ ] **Step 4: Run GREEN and behavior regression**

Run:

```bash
npx vitest run components/Dashboard.test.tsx components/WeatherMap.test.tsx components/AdviceRefreshConfirm.test.tsx components/InterfaceAccessibility.test.ts
npm test
npx tsc --noEmit
npm run build
git diff --check
```

Expected: all tests, TypeScript, build, and whitespace checks pass. Existing advice-request counts, abort handling, confirmation focus, storage warnings, and checkbox behavior remain green.

- [ ] **Step 5: Commit**

```bash
git add components/Dashboard.tsx components/Dashboard.test.tsx components/WeatherMap.tsx components/WeatherMap.test.tsx app/globals.css
git commit -m "feat: rebuild Rain to Action composition"
```

## Plan Self-Review

- Spec coverage: deterministic rain/frost cue, cross-panel trajectory, compact first frame, mobile ordering, timeline-before-map, authored flower, semantic surface migration, motion, accessibility, and behaviour preservation each map to a task.
- Placeholder scan: no TBD, TODO, deferred implementation, or undefined interface remains.
- Type consistency: all tasks consume the existing `WeatherData` shape; `WeatherActionCue` and `BlackFlowerMark` signatures are defined before consumption.
- Scope: no API, storage, advice, analytics, privacy, or setup behaviour changes are included.
