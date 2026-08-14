# GrowGuide UK True Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the setup wizard and dashboard summary layout with one responsive horticultural field-record experience that makes weather-to-action motion unmistakable.

**Architecture:** Preserve request, storage, validation, and advice state in `SetupWizard` and `Dashboard`. Add pure visual composition components around those engines: `GardenPortrait` translates categorical profile data into a truthful schematic, `SetupWorkbench` holds the first-run flow, and `WeatherWorksurface` joins forecast, portrait, and action. Keep secondary navigation changes isolated in the header, timeline filter, and seasonal calendar.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-14-growguide-true-rebuild-design.md`

## Global Constraints

- Work only on local branch `codex/growguide-true-rebuild`; do not push, merge, publish, deploy, or open a pull request.
- Preserve profile, draft, postcode, weather, advice, confirmation, storage, privacy, accessibility, and cost-control behaviour.
- Add no dependency, external service, analytics product, paid call, image generation, account, cookie banner, or pop-up.
- Use only profile categories and existing crop data. Never imply measured bed geometry, plant positions, yields, or unselected conditions.
- Keep Figtree and the existing Gravity Rain palette and authored marks.
- Use matte square surfaces; do not add gradients, glass, generic floating cards, broad shadows, sprout marks, or decorative photography.
- Keep user-facing copy short and in plain UK English.
- Keep every interactive target at least 44px, keyboard reachable, and visibly focused.
- Keep action before portrait in mobile DOM and reading order.
- Weather motion lasts 1.8 seconds, runs once per rain or frost cue, and shows the final state without animation under `prefers-reduced-motion: reduce`.
- Do not run the Impeccable detector again; it already ran once for this session.

---

## File Structure

- `components/GardenPortrait.tsx`: deterministic profile-to-schematic model and rendering.
- `components/GardenPortrait.test.tsx`: truth-boundary, accessible-summary, and overflow coverage.
- `components/SetupWorkbench.tsx`: responsive setup composition around existing active-step controls.
- `components/SetupWorkbench.test.tsx`: stable portrait and responsive DOM-order contract.
- `components/WeatherWorksurface.tsx`: joined forecast, motion path, portrait, and action station.
- `components/WeatherWorksurface.test.tsx`: cue/path and reduced-data state contracts.
- `components/SetupWizard.tsx`: retained state engine; new workbench rendering.
- `components/SetupProgress.tsx`: compact vertical/phone progress rail.
- `components/VegetableGrid.tsx`: field-record crop rows without photos.
- `components/EquipmentSelector.tsx`: compact register controls.
- `components/Dashboard.tsx`: retained request engine; new worksurface composition.
- `components/WeatherBanner.tsx`: five-day label and weather source hook.
- `components/WeatherActionCue.tsx`: precise motion target and authored flower anchor.
- `components/Header.tsx`: designed weather chip.
- `components/TimelineFilter.tsx`: three common ranges plus one extended menu.
- `components/SeasonalCalendar.tsx`: current-month alignment and compact continuation cue.
- `app/globals.css`: staged 1.8-second sequence and reduced-motion final state.
- `app/layout.tsx`: auditable direction contract for the rebuilt surface.

---

### Task 1: Build the truthful garden portrait

**Files:**
- Create: `components/GardenPortrait.tsx`
- Create: `components/GardenPortrait.test.tsx`

**Interfaces:**
- Consumes: `getVegetableById(id: string)`, `PLOT_SIZE_LABELS`, `ENVIRONMENT_OPTIONS`, `PlotSize`.
- Produces: default `GardenPortrait(props: GardenPortraitProps)` and named `getGardenPortraitModel(props)`.

- [ ] **Step 1: Read the test-quality rules**

Read `superpowers:test-driven-development/writing-good-tests.md` from the installed Superpowers skill directory before changing tests.

- [ ] **Step 2: Write the failing portrait tests**

Create `components/GardenPortrait.test.tsx` with real component assertions:

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GardenPortrait, { getGardenPortraitModel } from "./GardenPortrait";

const baseProps = {
  postcode: "SW1A 1AA",
  region: "London",
  vegetables: ["tomato", "carrot", "lettuce", "pea", "potato", "onion", "garlic"],
  plotSize: "medium" as const,
  environment: ["raised-beds"],
  equipment: ["trowel", "watering-can"],
};

describe("GardenPortrait", () => {
  it("builds a categorical portrait from profile facts without measured positions", () => {
    const model = getGardenPortraitModel(baseProps);
    expect(model.crops.map((crop) => crop.name)).toEqual([
      "Tomato", "Carrot", "Lettuce", "Pea", "Potato", "Onion",
    ]);
    expect(model.remainingCropCount).toBe(1);
    expect(model.plotLabel).toBe("Medium plot (4–20m²)");
    expect(model.environmentLabels).toEqual(["Raised beds"]);
    expect(model).not.toHaveProperty("coordinates");
  });

  it("exposes the facts and labels the drawing as a schematic", () => {
    render(<GardenPortrait {...baseProps} variant="dashboard" />);
    const portrait = screen.getByRole("region", { name: "Your garden portrait" });
    expect(within(portrait).getByText("Garden portrait")).toBeInTheDocument();
    expect(within(portrait).getByText("Schematic — not to scale")).toBeInTheDocument();
    expect(within(portrait).getByText("SW1A 1AA · London")).toBeInTheDocument();
    expect(within(portrait).getByText("+1 crop")).toBeInTheDocument();
  });

  it("renders a useful empty setup state without inventing selections", () => {
    render(
      <GardenPortrait
        vegetables={[]}
        plotSize="medium"
        environment={[]}
        equipment={[]}
        variant="setup"
      />,
    );
    expect(screen.getByText("Your selections will shape this portrait.")).toBeInTheDocument();
    expect(screen.queryByText(/London/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the tests and verify RED**

Run: `npx vitest run components/GardenPortrait.test.tsx`

Expected: FAIL because `GardenPortrait` does not exist.

- [ ] **Step 4: Implement the portrait model and component**

Create `components/GardenPortrait.tsx`. Use this public interface and model shape:

```tsx
import { getVegetableById } from "@/data/vegetables";
import {
  ENVIRONMENT_OPTIONS,
  PLOT_SIZE_LABELS,
  type PlotSize,
} from "@/lib/types";
import BlackFlowerMark from "./BlackFlowerMark";

export interface GardenPortraitProps {
  postcode?: string;
  region?: string;
  vegetables: string[];
  plotSize: PlotSize;
  environment: string[];
  equipment: string[];
  variant: "setup" | "dashboard";
  className?: string;
}

export type GardenPortraitData = Omit<GardenPortraitProps, "variant" | "className">;

export function getGardenPortraitModel(props: GardenPortraitData) {
  const resolved = props.vegetables.flatMap((id) => {
    const vegetable = getVegetableById(id);
    return vegetable ? [{ id, name: vegetable.name, category: vegetable.category }] : [];
  });
  return {
    crops: resolved.slice(0, 6),
    remainingCropCount: Math.max(0, resolved.length - 6),
    plotLabel: PLOT_SIZE_LABELS[props.plotSize],
    environmentLabels: props.environment.flatMap((id) => {
      const option = ENVIRONMENT_OPTIONS.find((item) => item.id === id);
      return option ? [option.label] : [];
    }),
    equipmentCount: props.equipment.length,
  };
}
```

Render a square field with `data-plot-size`, six labelled crop bands at most, environment and equipment registers, a 32px `BlackFlowerMark`, and the visible label `Schematic — not to scale`. Use a CSS grid and straight rules. Decorative SVG geometry must have `aria-hidden="true"`; the visible facts remain text.

- [ ] **Step 5: Run focused and affected tests**

Run: `npx vitest run components/GardenPortrait.test.tsx components/BlackFlowerMark.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/GardenPortrait.tsx components/GardenPortrait.test.tsx
git commit -m "feat: build factual garden portrait"
```

---

### Task 2: Replace the setup panels with one live workbench

**Files:**
- Create: `components/SetupWorkbench.tsx`
- Create: `components/SetupWorkbench.test.tsx`
- Modify: `components/SetupWizard.tsx`
- Modify: `components/SetupWizard.test.tsx`
- Modify: `components/SetupProgress.tsx`
- Modify: `components/SetupProgress.test.tsx`
- Modify: `components/VegetableGrid.tsx`
- Modify: `components/VegetableGrid.test.tsx`
- Modify: `components/EquipmentSelector.tsx`
- Modify: `components/EquipmentSelector.test.tsx`

**Interfaces:**
- Consumes: `GardenPortrait`, existing setup state and callbacks.
- Produces: default `SetupWorkbench` with `progress`, `controls`, and profile-draft props; preserves `SetupWizard`'s external props.

- [ ] **Step 1: Write the failing setup composition tests**

Create `components/SetupWorkbench.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SetupWorkbench from "./SetupWorkbench";

describe("SetupWorkbench", () => {
  it("keeps controls before the live portrait in DOM order", () => {
    render(
      <SetupWorkbench
        activeStep={2}
        completedSteps={[1]}
        summaries={{ 1: "SW1A 1AA · London" }}
        onEdit={vi.fn()}
        portrait={{
          postcode: "SW1A 1AA",
          region: "London",
          vegetables: ["lettuce"],
          plotSize: "medium",
          environment: [],
          equipment: [],
        }}
        controls={<section aria-label="Active setup step">Crop controls</section>}
      />,
    );
    const controls = screen.getByRole("region", { name: "Active setup step" });
    const portrait = screen.getByRole("region", { name: "Your garden portrait" });
    expect(controls.compareDocumentPosition(portrait) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
```

Add a `SetupWizard` regression that completes postcode lookup, opens crops, selects Lettuce, and asserts that the same `Your garden portrait` region remains mounted and gains `Lettuce`.

Update `SetupProgress` tests to require four compact step buttons, `aria-current="step"`, and disabled locked steps. Update selection tests to assert that crop photos are absent and selected crops/tools still expose `aria-pressed` or checked state.

- [ ] **Step 2: Run the tests and verify RED**

Run: `npx vitest run components/SetupWorkbench.test.tsx components/SetupWizard.test.tsx components/SetupProgress.test.tsx components/VegetableGrid.test.tsx components/EquipmentSelector.test.tsx`

Expected: FAIL because `SetupWorkbench` is missing and the old panel/photo composition remains.

- [ ] **Step 3: Implement `SetupWorkbench`**

Use this interface:

```tsx
import type { ReactNode } from "react";
import type { GardenPortraitProps } from "./GardenPortrait";

interface Props {
  activeStep: 1 | 2 | 3 | 4;
  completedSteps: number[];
  summaries: Partial<Record<1 | 2 | 3 | 4, string>>;
  onEdit: (step: 1 | 2 | 3 | 4) => void;
  portrait: Omit<GardenPortraitProps, "variant">;
  controls: ReactNode;
}
```

Render one `data-surface="setup-workbench"` main workspace. The progress spine and active controls come before the portrait in DOM order. Use `lg:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1.2fr)]`. Keep a dark Garden Ground title band inside the workbench, not a separate hero. Use `GardenPortrait` with `variant="setup"`.

- [ ] **Step 4: Recompose `SetupWizard` without changing its state engine**

Keep all hooks, validation, request IDs, focus refs, `lookupPostcode`, `toggle`, `openStep`, `completeAndOpen`, and `handleSave`. Replace only the returned hero/progress/panel tree with `SetupWorkbench`. Pass this exact portrait data:

```tsx
portrait={{
  postcode: lookup?.postcode,
  region: lookup?.region,
  vegetables,
  plotSize,
  environment,
  equipment,
}}
```

Each active step becomes a plain section labelled `Active setup step`. Put the step heading, fields, feedback, and stable navigation dock inside it. Keep existing element IDs, labels, button names, validation messages, and focus refs unless the spec explicitly changes visible copy.

- [ ] **Step 5: Rebuild setup progress and selectors in the field-record grammar**

Make `SetupProgress` a vertical ordered rail at desktop and a four-column numbered rail below `lg`. Each item is a button. Completed and current items are enabled; locked items are disabled. Use number, short label, and summary without separate `Edit` links.

Remove `next/image`, `VEG_PHOTOS`, and all crop photos from `VegetableGrid`. Render crop choices as compact ruled rows with crop name and seasonal state. Render equipment as a two-column register with a square 24px checkbox inside a 44px label target. Preserve controlled disclosure, search, full catalogue access, and existing callbacks.

- [ ] **Step 6: Run focused and full setup tests**

Run: `npx vitest run components/SetupWorkbench.test.tsx components/SetupWizard.test.tsx components/SetupProgress.test.tsx components/VegetableGrid.test.tsx components/EquipmentSelector.test.tsx app/page.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/SetupWorkbench.tsx components/SetupWorkbench.test.tsx components/SetupWizard.tsx components/SetupWizard.test.tsx components/SetupProgress.tsx components/SetupProgress.test.tsx components/VegetableGrid.tsx components/VegetableGrid.test.tsx components/EquipmentSelector.tsx components/EquipmentSelector.test.tsx
git commit -m "feat: rebuild setup as live garden workbench"
```

---

### Task 3: Join forecast, portrait, and action with visible motion

**Files:**
- Create: `components/WeatherWorksurface.tsx`
- Create: `components/WeatherWorksurface.test.tsx`
- Modify: `components/Dashboard.tsx`
- Modify: `components/Dashboard.test.tsx`
- Modify: `components/WeatherBanner.tsx`
- Modify: `components/WeatherBanner.test.tsx`
- Modify: `components/WeatherActionCue.tsx`
- Modify: `components/WeatherActionCue.test.tsx`
- Modify: `components/BlackFlowerMark.tsx`
- Modify: `app/globals.css`
- Modify: `components/InterfaceAccessibility.test.ts`
- Modify: `app/layout.tsx`
- Modify: `app/layout.test.tsx`

**Interfaces:**
- Consumes: `GardenPortrait`, `WeatherBanner`, `WeatherActionCue`, `WeatherData`, `UserProfile`.
- Produces: `WeatherWorksurface({ profile, weather, weatherLoading, weatherError, onRetryWeather, actionContent })`.

- [ ] **Step 1: Write the failing worksurface and motion tests**

Create a real-component test that renders rain-warning weather and asserts:

```tsx
expect(screen.getByRole("region", { name: "Weather to action" })).toBeInTheDocument();
expect(screen.getByRole("region", { name: "Your garden portrait" })).toBeInTheDocument();
expect(screen.getByRole("note", { name: "Weather-linked action" })).toHaveAttribute(
  "data-weather-target",
  "rain",
);
expect(screen.getByTestId("weather-story-path")).toHaveAttribute("data-motion", "once");
expect(screen.getByTestId("weather-story-path")).toHaveAttribute("stroke-width", "3");
```

Assert that no path or cue renders for `weather={null}` or weather with both warnings false. In `Dashboard.test.tsx`, assert that `What needs doing` precedes `Your garden portrait` in DOM order. In `WeatherBanner.test.tsx`, assert `aria-label="Five-day forecast"` for five entries.

Extend `InterfaceAccessibility.test.ts` to read `app/globals.css` and require these declarations:

```ts
expect(css).toContain("animation: weather-source-arrive 300ms");
expect(css).toContain("animation: weather-path-draw 1050ms 250ms");
expect(css).toContain("animation: weather-target-land 650ms 1150ms");
expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*\.weather-story-path-reveal[\s\S]*animation: none/);
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `npx vitest run components/WeatherWorksurface.test.tsx components/Dashboard.test.tsx components/WeatherBanner.test.tsx components/WeatherActionCue.test.tsx components/InterfaceAccessibility.test.ts app/layout.test.tsx`

Expected: FAIL because the worksurface and 1.8-second sequence do not exist.

- [ ] **Step 3: Implement `WeatherWorksurface`**

Use this interface:

```tsx
interface Props {
  profile: UserProfile;
  weather: WeatherData | null;
  weatherLoading: boolean;
  weatherError: string | null;
  onRetryWeather: () => void;
  actionContent: ReactNode;
}
```

Render a section named `Weather to action`. Render `WeatherBanner` first. When `getWeatherActionCue(weather)` returns a cue, render one absolute SVG with two responsive paths: desktop and mobile. Each visible path uses `strokeWidth="3"`, `pathLength="1"`, `data-testid="weather-story-path"`, and `data-motion="once"`. Use a separate reveal path or mask with class `weather-story-path-reveal`. Its endpoints must visually land inside the `WeatherActionCue` target region at both breakpoints.

Below the forecast, render action content before `GardenPortrait` in DOM order. Use CSS order to place portrait left and action right from `lg`. Apply a roughly two-thirds/one-third desktop grid. Keep the action station's heading and main action above the fold at 1440×900.

- [ ] **Step 4: Recompose `Dashboard` around the worksurface**

Keep all hooks, effects, request functions, timers, confirmation state, storage calls, and advice rendering. Replace the existing forecast/path/workspace/`PlotSummary` tree with `WeatherWorksurface`. Pass the current advice station as `actionContent`; render its `WeatherActionCue` first. Do not import or render `PlotSummary`.

Keep the page introduction to one location line, one h1, and `Edit setup`. Keep `SeasonalCalendar` and `WeatherMap` below the worksurface.

- [ ] **Step 5: Implement the staged sequence and target**

Use these exact timing declarations in `app/globals.css`:

```css
.weather-story-source {
  animation: weather-source-arrive 300ms ease-out both;
}

.weather-story-path-reveal {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: weather-path-draw 1050ms 250ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.weather-story-target {
  animation: weather-target-land 650ms 1150ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes weather-path-draw {
  to { stroke-dashoffset: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .weather-story-source,
  .weather-story-path-reveal,
  .weather-story-target {
    animation: none;
  }
  .weather-story-path-reveal { stroke-dashoffset: 0; }
}
```

Author `weather-source-arrive` as one brief Sky Blue emphasis and `weather-target-land` as a Pale Mineral-to-semantic-colour wash with a small flower scale from `0.82` to `1`. Neither animation may repeat. `WeatherActionCue` receives `data-weather-target={cue.kind}`, class `weather-story-target`, and a 32px `BlackFlowerMark` instead of the 8px dot.

- [ ] **Step 6: Correct forecast copy and direction contract**

In `WeatherBanner`, derive the list label as `${daily.length === 5 ? "Five" : daily.length}-day forecast` and add `weather-story-source` only when the worksurface has a cue. Add an optional `linkedAction` prop if needed; keep default call sites compatible.

Update `DESIGN_DIRECTION_CONTRACT` in `app/layout.tsx` to describe the field-record first viewport, the live setup portrait, and seed `f20db32c`. Keep the existing `template` placement as the body's first child. Update `app/layout.test.tsx` to require `f20db32c`.

- [ ] **Step 7: Run focused and affected tests**

Run: `npx vitest run components/WeatherWorksurface.test.tsx components/Dashboard.test.tsx components/WeatherBanner.test.tsx components/WeatherActionCue.test.tsx components/GardenPortrait.test.tsx components/InterfaceAccessibility.test.ts app/layout.test.tsx`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add components/WeatherWorksurface.tsx components/WeatherWorksurface.test.tsx components/Dashboard.tsx components/Dashboard.test.tsx components/WeatherBanner.tsx components/WeatherBanner.test.tsx components/WeatherActionCue.tsx components/WeatherActionCue.test.tsx components/BlackFlowerMark.tsx app/globals.css components/InterfaceAccessibility.test.ts app/layout.tsx app/layout.test.tsx
git commit -m "feat: make weather visibly land on action"
```

---

### Task 4: Finish the compact operating controls

**Files:**
- Modify: `components/Header.tsx`
- Modify: `components/ShellContent.test.tsx`
- Modify: `components/TimelineFilter.tsx`
- Modify: `components/TimelineFilter.test.tsx`
- Modify: `components/SeasonalCalendar.tsx`
- Modify: `components/SeasonalCalendar.test.tsx`

**Interfaces:**
- Consumes: existing header weather context, `Timeline`, selected crop IDs.
- Produces: compact weather chip, common/extended timeline control, and current-month-aligned seasonal region.

- [ ] **Step 1: Write the failing compact-control tests**

In `TimelineFilter.test.tsx`, assert that `Next 24 hours`, `Next 3 days`, and `Next 7 days` are visible radio controls, while `Next 14 days`, `Next 30 days`, and `Next 3 months` appear through one `More timeframes` disclosure. Select `Next 30 days` and assert `onChange("30-days")`.

In `SeasonalCalendar.test.tsx`, stub `HTMLElement.prototype.scrollTo`, render selected crops, and assert that the timeline calls `scrollTo` once to align the current month. Require visible phone copy `Months →` and an accessible region label.

In `ShellContent.test.tsx`, render the header weather context and assert that the weather summary sits in a region labelled `Current garden weather`, with postcode, temperature, and description.

- [ ] **Step 2: Run the tests and verify RED**

Run: `npx vitest run components/TimelineFilter.test.tsx components/SeasonalCalendar.test.tsx components/ShellContent.test.tsx`

Expected: FAIL because all six timeframes are exposed at once, the calendar does not align itself, and the header summary is plain text.

- [ ] **Step 3: Rebuild `TimelineFilter`**

Use `COMMON_TIMELINES = ["24-hours", "3-days", "7-days"]` and `EXTENDED_TIMELINES = ["14-days", "30-days", "3-months"]`. Keep one `radiogroup` for common options. Add a square `details` control with summary `More timeframes`; its three extended buttons use `role="radio"` and close the details element after selection. If an extended range is selected, show its label in the summary.

- [ ] **Step 4: Align `SeasonalCalendar` to the current month**

Add refs for the scroll region and the current-month cell in the first crop row. In `useEffect`, call:

```tsx
const left = Math.max(
  0,
  currentMonthCell.offsetLeft - scrollRegion.clientWidth * 0.35,
);
scrollRegion.scrollTo({ left, behavior: "auto" });
```

Show `Months →` only below `sm`. Preserve the full 12-month accessible matrix, visible month names, keyboard-focusable scroll region, and crop state labels.

- [ ] **Step 5: Design the header weather chip**

Wrap the summary in a non-interactive region labelled `Current garden weather`. Use a square Garden Ground chip with a Sky Blue left rule, temperature as the strongest value, postcode as a compact label, and description hidden only at the narrowest width. Do not add a button, pop-up, menu, or new text.

- [ ] **Step 6: Run focused, full, type, and build checks**

Run:

```bash
npx vitest run components/TimelineFilter.test.tsx components/SeasonalCalendar.test.tsx components/ShellContent.test.tsx components/Dashboard.test.tsx
npm test
npx tsc --noEmit
npm run build
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 7: Commit**

```bash
git add components/Header.tsx components/ShellContent.test.tsx components/TimelineFilter.tsx components/TimelineFilter.test.tsx components/SeasonalCalendar.tsx components/SeasonalCalendar.test.tsx
git commit -m "feat: finish compact GrowGuide controls"
```

---

## Controller-Owned Visual Approval Package

After all task reviews pass:

1. Start the local production or development server without deploying it.
2. Use a public test postcode and local browser storage. Do not call the advice endpoint.
3. Capture setup at 1440×900 and 390×844.
4. Capture the weather-success dashboard at 1440×900 and 390×844.
5. Capture the signature sequence near 0ms, 700ms, and 1,800ms.
6. Compare the first frame against `.impeccable/mocks/gravity-rain-c.webp` and the critique in `.impeccable/critique/2026-08-14T20-26-16Z__growguide-b0gajwu6r-wethink-vercel-app.md`.
7. Run one fresh Impeccable finish reviewer with the screenshots, spec, direction contract, approved mock, critique, and craft-floor path. Do not run the detector.
8. Apply material review fixes in one batch, recapture once, and obtain the reviewer's verdict.
9. Present the local screenshots and verdict to the user. Stop and wait for explicit approval. Do not push.
