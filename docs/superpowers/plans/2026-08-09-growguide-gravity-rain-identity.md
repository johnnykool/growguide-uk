# GrowGuide UK Gravity Rain Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the competitor-like sprout identity with the approved Rainline GG brand and translate the approved Rain to Action composition into the existing GrowGuide setup, dashboard, privacy, and social surfaces.

**Architecture:** Keep the current Next.js data flow, storage, weather requests, advice requests, and component boundaries. Add one reusable SVG brand component, convert the weather banner into the forecast ribbon, expand the plot summary into a factual plot profile, and recompose the dashboard around those existing parts. Use semantic SVG/CSS for the mark and trajectories; use static raster exports only for social sharing.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Vitest, Testing Library, SVG, `rsvg-convert`.

## Global Constraints

- Approved visual world: Gravity Rain.
- Approved composition: `.impeccable/mocks/gravity-rain-c.webp`.
- Garden ground: `#20312C`.
- Pale mineral: `#E7E8E4`.
- Sky blue: `#7DB8E6`.
- Ember coral: `#E0645B`.
- Moss veil: `#A6B49C`.
- Black flower: `#0E0F10`.
- The logo must use parallel rain strokes that bend into two open G paths; it must not use a circle, sprout, seedling, or leaf.
- Keep setup, dashboard, advice, storage, analytics, privacy, and API behaviour unchanged.
- Keep user-facing text, interruptions, and pop-ups minimal.
- Do not invent a measured garden layout; the comp’s map becomes a factual plot profile.
- Use SVG or CSS for the logo and trajectories, never rasterised UI text or controls.
- Preserve keyboard access, visible focus, 44-pixel touch targets, semantic headings, WCAG AA text contrast, and 3:1 focus/essential-graphic contrast.
- Motion runs once and stops; `prefers-reduced-motion` shows the final state.
- Remove visible sprout marks and seedling metadata from product surfaces.
- Keep generated advice cost controls and replacement confirmation behaviour unchanged.

---

### Task 1: Rainline GG Brand, Search Metadata, and Social Assets

**Files:**
- Create: `components/BrandMark.tsx`
- Create: `components/BrandMark.test.tsx`
- Create: `public/brand/growguide-mark.svg`
- Create: `public/brand/growguide-avatar.svg`
- Create: `public/brand/growguide-social.svg`
- Create mechanically: `public/brand/growguide-avatar.png`
- Create mechanically: `public/brand/growguide-social.png`
- Modify: `components/Header.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/ShellContent.test.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/layout.test.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `app/privacy/page.test.tsx`

**Interfaces:**
- Produces: `BrandMark({ className?, title? }: { className?: string; title?: string })`.
- Produces: `/brand/growguide-avatar.png` at 1024×1024 and `/brand/growguide-social.png` at 1200×630.
- Later tasks consume `BrandMark` in setup and shell surfaces.

- [ ] **Step 1: Write the failing brand and metadata tests**

Add this contract to `components/BrandMark.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BrandMark from "./BrandMark";

describe("BrandMark", () => {
  it("is decorative by default and nameable when used alone", () => {
    const view = render(<BrandMark />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    view.rerender(<BrandMark title="GrowGuide UK" />);
    expect(screen.getByRole("img", { name: "GrowGuide UK" })).toBeVisible();
  });
});
```

Extend `app/layout.test.tsx` so the sharing identity must expose the new landscape image:

```tsx
expect(metadata.openGraph?.images).toEqual([
  {
    url: "/brand/growguide-social.png",
    width: 1200,
    height: 630,
    alt: "Weather paths flow into GrowGuide UK actions",
  },
]);
expect(metadata.twitter?.images).toEqual(["/brand/growguide-social.png"]);
```

Update the equivalent privacy-page metadata expectations. Extend `ShellContent.test.tsx` to assert that the header link keeps the accessible name `GrowGuide UK` and that the mark contributes no duplicate image name.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
npx vitest run components/BrandMark.test.tsx components/ShellContent.test.tsx app/layout.test.tsx app/privacy/page.test.tsx
```

Expected: `BrandMark.tsx` is missing and metadata still references `/images/growguide-kofi-logo.png`.

- [ ] **Step 3: Implement the semantic mark and lockup**

Create `components/BrandMark.tsx` with this public shape and the same two paths in every static asset:

```tsx
interface BrandMarkProps {
  className?: string;
  title?: string;
}

export default function BrandMark({ className, title }: BrandMarkProps) {
  const titleId = title ? "rainline-gg-title" : undefined;
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-labelledby={titleId}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title id={titleId}>{title}</title>}
      <path d="M14 8v17c0 15 10 27 25 27h11V37H38" />
      <path d="M30 8v13c0 10 7 18 17 18h7V26H43" />
    </svg>
  );
}
```

Apply `fill="none"`, `stroke="currentColor"`, `strokeWidth="6"`, `strokeLinecap="round"`, and `strokeLinejoin="round"` on the SVG. Render it inside the existing home link before the wordmark. Keep the link’s accessible name `GrowGuide UK`.

Create matching static SVGs. The avatar uses a `#20312C` square ground, the blue mark in `#7DB8E6`, and no text. The social image uses the same ground, the mark, `GrowGuide UK`, the line `Weather, translated into action.`, and restrained blue trajectories ending at three labels: `Water`, `Plant`, and `Protect`.

- [ ] **Step 4: Generate the PNG exports mechanically**

Run:

```bash
rsvg-convert -w 1024 -h 1024 public/brand/growguide-avatar.svg -o public/brand/growguide-avatar.png
rsvg-convert -w 1200 -h 630 public/brand/growguide-social.svg -o public/brand/growguide-social.png
file public/brand/growguide-avatar.png public/brand/growguide-social.png
```

Expected: PNG outputs report 1024×1024 and 1200×630.

- [ ] **Step 5: Update root and privacy metadata**

Point both pages to `/brand/growguide-social.png` with 1200×630 dimensions and alt text `Weather paths flow into GrowGuide UK actions`. Remove the old seedling path and descriptions.

- [ ] **Step 6: Run GREEN and commit**

Run:

```bash
npx vitest run components/BrandMark.test.tsx components/ShellContent.test.tsx app/layout.test.tsx app/privacy/page.test.tsx
```

Expected: all focused tests pass.

Commit:

```bash
git add components/BrandMark.tsx components/BrandMark.test.tsx components/Header.tsx components/Footer.tsx components/ShellContent.test.tsx app/layout.tsx app/layout.test.tsx app/privacy/page.tsx app/privacy/page.test.tsx public/brand
git commit -m "feat: introduce Rainline GG identity"
```

### Task 2: Weather-to-Action Forecast Ribbon

**Files:**
- Modify: `components/WeatherBanner.tsx`
- Modify: `components/WeatherBanner.test.tsx`
- Modify: `components/Dashboard.tsx`
- Modify: `components/Dashboard.test.tsx`

**Interfaces:**
- Changes `WeatherBanner` props to include `locationLabel: string`.
- Preserves `weather`, `loading`, `error`, and `onRetry` behaviour.
- Produces one `aria-label="Local forecast"` region and a list of daily forecast items.

- [ ] **Step 1: Write the failing forecast contract**

Add a complete `WeatherData` fixture with two daily entries to `WeatherBanner.test.tsx`, then assert:

```tsx
render(
  <WeatherBanner
    weather={weather}
    loading={false}
    error={null}
    onRetry={vi.fn()}
    locationLabel="BS1 5AH"
  />,
);

expect(screen.getByRole("region", { name: "Local forecast" })).toBeVisible();
expect(screen.getByText("BS1 5AH")).toBeVisible();
expect(screen.getByText("19°C")).toBeVisible();
expect(screen.getByRole("listitem", { name: "Tue: high 17°, low 9°, 60% rain" })).toBeVisible();
expect(screen.getByText("Rain may change your next tasks")).toBeVisible();
```

Pass `locationLabel` in the existing loading and error tests. Add the prop in `Dashboard.tsx`; this produces the expected TypeScript failure before the component accepts it.

- [ ] **Step 2: Run the weather tests and verify RED**

Run:

```bash
npx vitest run components/WeatherBanner.test.tsx components/Dashboard.test.tsx
```

Expected: the ribbon region, location prop, and accessible daily list are missing.

- [ ] **Step 3: Implement the forecast ribbon**

Keep the loading and retry copy. For successful data, render:

```tsx
<section aria-label="Local forecast" className="forecast-ribbon">
  <div>{locationLabel}</div>
  <div>{current.temp}°C</div>
  <ul aria-label="Seven-day forecast">
    {daily.map((day) => (
      <li
        key={day.date}
        aria-label={`${day.dayName}: high ${day.high}°, low ${day.low}°, ${day.rainProbability}% rain`}
      >
        {/* visible day, condition symbol, temperatures, and rain probability */}
      </li>
    ))}
  </ul>
  {(warnings.rainSoon || warnings.frostSoon) && (
    <p>Rain may change your next tasks</p>
  )}
</section>
```

Use inline semantic SVG for cloud, rain, sun, and frost states. Add one decorative blue dashed trajectory, `aria-hidden="true"`, that ends at the warning line. Give its stroke a one-run draw animation and set `animation: none` in the existing reduced-motion media query.

Pass `profile.postcode` as `locationLabel` from `Dashboard`.

- [ ] **Step 4: Run GREEN and commit**

Run:

```bash
npx vitest run components/WeatherBanner.test.tsx components/Dashboard.test.tsx
```

Expected: focused tests pass with no console warnings.

Commit:

```bash
git add components/WeatherBanner.tsx components/WeatherBanner.test.tsx components/Dashboard.tsx components/Dashboard.test.tsx
git commit -m "feat: connect forecast to garden actions"
```

### Task 3: Factual Plot Profile and Seasonal Timeline

**Files:**
- Modify: `components/PlotSummary.tsx`
- Modify: `components/PlotSummary.test.tsx`
- Modify: `components/SeasonalCalendar.tsx`
- Modify: `components/SeasonalCalendar.test.tsx`

**Interfaces:**
- Preserves `PlotSummary({ profile, month? })`.
- Preserves `SeasonalCalendar({ vegetableIds })`.
- Produces `aria-label="Your plot profile"` and `aria-label="This season"` regions.

- [ ] **Step 1: Write failing plot-profile assertions**

Extend `PlotSummary.test.tsx`:

```tsx
expect(screen.getByRole("region", { name: "Your plot profile" })).toBeVisible();
expect(screen.getByRole("heading", { name: "Your plot" })).toBeVisible();
expect(screen.getByText("Tomato")).toBeVisible();
expect(screen.getByText("Raised beds")).toBeVisible();
expect(screen.getByText("Small raised bed (<4m²)")).toBeVisible();
```

Extend `SeasonalCalendar.test.tsx`:

```tsx
expect(screen.getByRole("region", { name: "This season" })).toBeVisible();
expect(screen.getByRole("heading", { name: "This season" })).toBeVisible();
```

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
npx vitest run components/PlotSummary.test.tsx components/SeasonalCalendar.test.tsx
```

Expected: new regions, heading, crop name, and environment label are absent.

- [ ] **Step 3: Recompose the plot profile without invented geometry**

Keep the existing month, crop count, active count, and plot-size calculations. Add a crop list from `getVegetableById`, environment labels from `ENVIRONMENT_OPTIONS`, and compact equipment count. Render selected crops as labelled rows in a quiet two-column grid; do not assign coordinates, distances, or bed positions.

Use a small decorative black flower marker only beside the heading. The marker is `aria-hidden="true"`; the crop names remain plain text.

- [ ] **Step 4: Flatten the calendar into the approved seasonal strip**

Wrap the calendar in `<section aria-label="This season">`. Keep all twelve accessible month-state graphics for every crop. On wide screens show each crop as one row; on phones allow horizontal scrolling with a visible focusable wrapper and no truncated month labels.

- [ ] **Step 5: Run GREEN and commit**

Run:

```bash
npx vitest run components/PlotSummary.test.tsx components/SeasonalCalendar.test.tsx
```

Expected: all focused tests pass.

Commit:

```bash
git add components/PlotSummary.tsx components/PlotSummary.test.tsx components/SeasonalCalendar.tsx components/SeasonalCalendar.test.tsx
git commit -m "feat: add factual plot and season views"
```

### Task 4: Rain to Action Dashboard Composition

**Files:**
- Modify: `components/Dashboard.tsx`
- Modify: `components/Dashboard.test.tsx`
- Modify: `components/AdviceResults.tsx`
- Modify: `components/TaskCard.tsx`
- Modify: `components/TimelineFilter.tsx`
- Modify: `components/AdviceRefreshConfirm.tsx`
- Modify: `components/InterfaceAccessibility.test.ts`

**Interfaces:**
- Keeps `Dashboard({ profile, onEdit })` and all request, abort, storage, and confirmation logic unchanged.
- Keeps `AdviceResults`, `TaskCard`, and `TimelineFilter` public props unchanged.
- Produces a page heading `Weather, translated into action.` and a region named `What needs doing`.

- [ ] **Step 1: Write the failing dashboard composition test**

In `Dashboard.test.tsx`, add a test against the real component:

```tsx
installFetch(response(replacementAdvice));
render(<Dashboard profile={profile} onEdit={vi.fn()} />);

expect(screen.getByRole("heading", { level: 1, name: "Weather, translated into action." })).toBeVisible();
expect(screen.getByRole("region", { name: "Your plot profile" })).toBeVisible();
expect(screen.getByRole("region", { name: "What needs doing" })).toBeVisible();
expect(screen.getByRole("button", { name: "Get growing advice" })).toBeVisible();
```

Update existing advice-button queries from emoji-prefixed names to `Get growing advice` and `Get fresh advice`. Keep every existing request-count, abort, focus, storage, and confirmation assertion.

- [ ] **Step 2: Run the dashboard and accessibility tests and verify RED**

Run:

```bash
npx vitest run components/Dashboard.test.tsx components/InterfaceAccessibility.test.ts
```

Expected: the new heading/regions/button names are missing and old source contracts no longer match the planned semantic colour names.

- [ ] **Step 3: Build the approved first viewport from existing components**

Remove the photo hero, collage, dark photo gradient, and `HERO_HARVEST`/`VEG_PHOTOS` imports. Render in this order:

```tsx
<main>
  <section>{/* h1, postcode/region/crop count, edit setup */}</section>
  <WeatherBanner locationLabel={profile.postcode} ... />
  <div className="dashboard-workspace">
    <div>{/* PlotSummary then WeatherMap */}</div>
    <section aria-label="What needs doing">
      {/* timeline, generate/refresh control, warnings, AdviceResults */}
    </section>
  </div>
  <SeasonalCalendar vegetableIds={profile.vegetables} />
</main>
```

Desktop uses a 60/40 split. Mobile orders `What needs doing` first, then plot profile, then weather map, then season. Keep copy concise and preserve the existing confirmation component.

- [ ] **Step 4: Convert advice cards into spacious task rows**

Keep checkbox behaviour and grouping. Remove vegetable-photo thumbnails, emoji fallbacks, pill-heavy chrome, and two-column task-card grids. Use a left state rail: blue for care/water, moss for planting, coral for protection/high priority. Keep category and priority as text with a single small colour marker.

Change the action labels to `Get growing advice` and `Get fresh advice`. Keep loading status focus and saved-advice warnings unchanged.

- [ ] **Step 5: Update accessibility source contracts**

Replace references to the incumbent warm palette with semantic dark-focus contracts that use `garden-ground`, `rain-ink`, `ember-ink`, and `pale-mineral`. Keep the existing check for visible focus and sufficient selected-state boundaries.

- [ ] **Step 6: Run GREEN and commit**

Run:

```bash
npx vitest run components/Dashboard.test.tsx components/AdviceRefreshConfirm.test.tsx components/InterfaceAccessibility.test.ts
```

Expected: all focused tests pass, including request cost, abort, storage, confirmation, and focus regressions.

Commit:

```bash
git add components/Dashboard.tsx components/Dashboard.test.tsx components/AdviceResults.tsx components/TaskCard.tsx components/TimelineFilter.tsx components/AdviceRefreshConfirm.tsx components/InterfaceAccessibility.test.ts
git commit -m "feat: build Rain to Action dashboard"
```

### Task 5: Visual Tokens, Setup, Privacy, and Responsive Integration

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `app/layout.tsx`
- Modify: `app/layout.test.tsx`
- Modify: `components/Header.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/SetupWizard.tsx`
- Modify: `components/SetupWizard.test.tsx`
- Modify: `components/SetupProgress.tsx`
- Modify: `components/VegetableGrid.tsx`
- Modify: `components/EquipmentSelector.tsx`
- Modify: `components/WeatherMap.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `components/ShellContent.test.tsx`

**Interfaces:**
- Keeps all component props and user workflows unchanged.
- Replaces `DM_Sans` and `DM_Serif_Display` with `Figtree` as `--font-figtree`.
- Adds semantic Tailwind colours: `garden-ground`, `pale-mineral`, `sky-blue`, `rain-ink`, `ember`, `ember-ink`, `moss-veil`, `black-flower`.

- [ ] **Step 1: Write failing shell and setup expectations**

Update the `next/font/google` mock in `app/layout.test.tsx`:

```tsx
vi.mock("next/font/google", () => ({
  Figtree: () => ({ variable: "font-figtree" }),
}));
```

Add to `SetupWizard.test.tsx`:

```tsx
expect(screen.getByRole("heading", { level: 1, name: "Tell us about your garden" })).toBeVisible();
expect(screen.getByText("Four short steps. Saved on this device.")).toBeVisible();
```

When `initial` is supplied, expect `Update your garden`. Extend `ShellContent.test.tsx` so the footer still exposes Ko-fi and privacy links after its visual rewrite.

- [ ] **Step 2: Run integration-focused tests and verify RED**

Run:

```bash
npx vitest run app/layout.test.tsx components/SetupWizard.test.tsx components/ShellContent.test.tsx app/privacy/page.test.tsx
```

Expected: the font mock, setup headings, and short setup line do not match production.

- [ ] **Step 3: Install the approved semantic palette and type system**

Define the exact palette variables from Global Constraints. Add darker text variants `--rain-ink: #285F87` and `--ember-ink: #A83F3A` for accessible text on pale mineral; keep sky blue and ember coral for larger graphics. Map legacy colour aliases to the new values until all setup components use semantic classes.

Use `Figtree` from `next/font/google` with one variable. Map both Tailwind `font-sans` and temporary `font-serif` aliases to `var(--font-figtree)` so no serif renders during the transition. Remove all production `font-serif` classes in the files touched by this task.

Add matte border and shadow tokens, the one-run rain-path animation, and reduced-motion rules. Keep body text at 16px or larger.

- [ ] **Step 4: Reframe setup and privacy without changing behaviour**

Replace the setup photo hero with a compact dark garden-ground introduction using `BrandMark` and two decorative blue trajectory lines. Use the exact headings tested above. Keep all four steps, draft persistence, validation, focus movement, and buttons unchanged.

Use pale mineral panels with fine garden-ground borders, blue action states, moss selection states, and coral error states. Apply the same header, type, palette, and line grammar to privacy and weather-map surfaces.

Keep the footer compact: provenance, `Support GrowGuide`, and `Privacy`. Add no social-link placeholders.

- [ ] **Step 5: Run the mechanical design detector exactly once**

Run only after all changed UI files are ready:

```bash
node /Users/johnworley/.agents/skills/impeccable/scripts/detect.mjs --json app/layout.tsx app/globals.css app/page.tsx app/privacy/page.tsx components/Header.tsx components/Footer.tsx components/SetupWizard.tsx components/SetupProgress.tsx components/VegetableGrid.tsx components/EquipmentSelector.tsx components/Dashboard.tsx components/WeatherBanner.tsx components/WeatherMap.tsx components/PlotSummary.tsx components/SeasonalCalendar.tsx components/AdviceResults.tsx components/TaskCard.tsx components/TimelineFilter.tsx components/AdviceRefreshConfirm.tsx
```

Expected: `[]`. Fix mechanical findings before the commit without running the detector again.

- [ ] **Step 6: Run focused and full verification**

Run:

```bash
npx vitest run app/layout.test.tsx components/SetupWizard.test.tsx components/ShellContent.test.tsx app/privacy/page.test.tsx
npm test
npx tsc --noEmit
npm run build
```

Expected: all tests, TypeScript, and the production build pass without warnings.

- [ ] **Step 7: Commit**

```bash
git add app components tailwind.config.ts public/brand
git commit -m "feat: complete Gravity Rain rebrand"
```

## Plan Self-Review

- Spec coverage: brand, metadata, social assets, forecast ribbon, plot translation, priorities, season, setup, privacy, responsiveness, accessibility, animation, and preservation of paid-advice behaviour each map to a task.
- Test integrity: component tests assert user-visible contracts and existing request/storage behaviour; no test asserts source text merely stayed unchanged.
- Interface consistency: `BrandMark`, `WeatherBanner.locationLabel`, `PlotSummary`, `SeasonalCalendar`, `Dashboard`, and existing advice component props are named consistently across tasks.
- Dependency discipline: no new runtime package is required; PNGs come from the installed `rsvg-convert` command.
