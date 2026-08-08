# Progressive Setup and Product Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace GrowGuide's long setup form with an accessible progressive accordion, add seasonal product character, harden destructive and failed states, repair mobile controls, and resolve every P1, P2, and minor critique item without losing the incumbent visual identity or saved-task behaviour.

**Architecture:** Keep `app/page.tsx` as the profile/setup switch. Add pure seasonal and display helpers in `lib`, versioned setup-draft storage, small focused UI components for progress and confirmation, and controlled responsive variants for the timeline. Preserve existing API contracts except for user-safe weather error text.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.5, Tailwind CSS 3.4, Vitest, React Testing Library, user-event, jsdom.

## Global Constraints

- Preserve the cream, sage, moss, blush, terracotta, warm-stone, and dark-earth palette.
- Preserve existing garden photography, British gardening voice, live postcode feedback, selection states, saved profile, saved advice, and completed tasks.
- Show no more than six seasonal crop recommendations before `Browse all crops`.
- Location and crop selection are required; plot details and equipment are optional.
- Never expose environment-variable names, upstream status codes, or other infrastructure details in user-facing weather errors.
- Fresh advice must not replace saved advice until the user confirms.
- All six timeline values must remain available on every viewport.
- Keep analytics packages installed but uninitialised.

---

### Task 1: Test foundation and seasonal domain helpers

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `lib/seasonal.ts`
- Create: `lib/seasonal.test.ts`
- Create: `lib/format.ts`
- Create: `lib/format.test.ts`

**Interfaces:**
- Produces: `getSeasonalMarker(vegetable: Vegetable, month: number): SeasonalMarkerInfo | null`
- Produces: `getSeasonalRecommendations(vegetables: Vegetable[], month: number, limit?: number): SeasonalRecommendation[]`
- Produces: `formatCropCount(count: number): string`
- `SeasonalMarker` is `'sow-outdoors' | 'transplant' | 'sow-indoors' | 'harvest' | 'next-month'`.

- [ ] **Step 1: Install the test dependencies and add scripts**

Run:

```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Add these scripts to `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 2: Write failing seasonal and formatting tests**

Write `lib/seasonal.test.ts` with focused fixtures that assert:

```ts
expect(getSeasonalMarker(outdoorSower, 8)?.label).toBe("Sow outside now");
expect(getSeasonalMarker(transplanter, 8)?.label).toBe("Plant out now");
expect(getSeasonalMarker(indoorSower, 8)?.label).toBe("Sow indoors now");
expect(getSeasonalMarker(harvestCrop, 8)?.label).toBe("Harvest now");
expect(getSeasonalMarker(januaryCrop, 12)?.label).toBe("Coming up next month");
expect(getSeasonalRecommendations(fixtures, 8)).toHaveLength(6);
expect(new Set(getSeasonalRecommendations(fixtures, 8).map((item) => item.vegetable.id)).size).toBe(6);
```

Write `lib/format.test.ts`:

```ts
expect(formatCropCount(0)).toBe("0 crops");
expect(formatCropCount(1)).toBe("1 crop");
expect(formatCropCount(2)).toBe("2 crops");
```

- [ ] **Step 3: Run the tests and verify RED**

Run:

```bash
npm test -- lib/seasonal.test.ts lib/format.test.ts
```

Expected: FAIL because `lib/seasonal.ts` and `lib/format.ts` do not exist.

- [ ] **Step 4: Implement the minimal pure helpers**

Implement `getSeasonalMarker` with priority: sow outdoors, transplant, sow indoors, harvest, active next month. Compute next month with `(month % 12) + 1`. Implement `getSeasonalRecommendations` by ranking the input without mutating it, removing duplicate IDs, and slicing to `limit = 6`.

Use this public shape:

```ts
export interface SeasonalMarkerInfo {
  kind: SeasonalMarker;
  label: string;
}

export interface SeasonalRecommendation {
  vegetable: Vegetable;
  marker: SeasonalMarkerInfo;
}
```

Implement `formatCropCount` as `${count} ${count === 1 ? "crop" : "crops"}`.

- [ ] **Step 5: Run tests and type checking**

Run:

```bash
npm test -- lib/seasonal.test.ts lib/format.test.ts
npx tsc --noEmit
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts lib/seasonal.ts lib/seasonal.test.ts lib/format.ts lib/format.test.ts
git commit -m "test: add seasonal planning foundation"
```

---

### Task 2: Versioned setup-draft persistence

**Files:**
- Modify: `lib/types.ts`
- Modify: `lib/storage.ts`
- Create: `lib/storage.test.ts`

**Interfaces:**
- Produces: `SetupDraftV1` with `version: 1`, `activeStep`, form values, optional validated lookup, and disclosure state.
- Produces: `loadSetupDraft(): SetupDraftV1 | null`
- Produces: `saveSetupDraft(draft: SetupDraftV1): void`
- Produces: `clearSetupDraft(): void`
- Preserves: `loadProfile`, `saveProfile`, `loadSavedAdvice`, `saveAdvice`, `clearSavedAdvice`, and `taskKey`.

- [ ] **Step 1: Write failing storage tests**

Add tests that use jsdom localStorage:

```ts
beforeEach(() => window.localStorage.clear());

it("round-trips a valid version-one draft", () => {
  saveSetupDraft(validDraft);
  expect(loadSetupDraft()).toEqual(validDraft);
});

it("rejects malformed and unknown-version drafts", () => {
  window.localStorage.setItem("growguide-setup-draft-v1", "not json");
  expect(loadSetupDraft()).toBeNull();
  window.localStorage.setItem("growguide-setup-draft-v1", JSON.stringify({ version: 2 }));
  expect(loadSetupDraft()).toBeNull();
});

it("clears only the setup draft", () => {
  window.localStorage.setItem("growguide-user", "saved-profile");
  saveSetupDraft(validDraft);
  clearSetupDraft();
  expect(loadSetupDraft()).toBeNull();
  expect(window.localStorage.getItem("growguide-user")).toBe("saved-profile");
});
```

- [ ] **Step 2: Run the storage test and verify RED**

Run:

```bash
npm test -- lib/storage.test.ts
```

Expected: FAIL because the setup-draft interfaces and functions are missing.

- [ ] **Step 3: Implement schema validation and storage functions**

Add `SetupDraftV1` to `lib/types.ts`. Validate every persisted property before returning a draft: version, step range 1–4, string postcode, array fields, valid plot size, boolean disclosure values, and lookup numeric coordinates when present. Reject invalid data without touching profile or advice keys.

Use key `growguide-setup-draft-v1`. Wrap reads and writes in the same server and JSON guards as existing storage helpers.

- [ ] **Step 4: Run tests and type checking**

Run:

```bash
npm test -- lib/storage.test.ts
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts lib/storage.ts lib/storage.test.ts
git commit -m "feat: persist unfinished garden setup"
```

---

### Task 3: Seasonal crop picker and optional equipment disclosure

**Files:**
- Modify: `components/VegetableGrid.tsx`
- Modify: `components/EquipmentSelector.tsx`
- Create: `components/VegetableGrid.test.tsx`
- Create: `components/EquipmentSelector.test.tsx`

**Interfaces:**
- `VegetableGrid` accepts existing `selected` and `onToggle` props plus `month`, `showAll`, `onShowAllChange`, `search`, and `onSearchChange`.
- `EquipmentSelector` accepts existing `selected` and `onToggle` props plus `showAll` and `onShowAllChange`.
- Consumes: seasonal helpers from Task 1.

- [ ] **Step 1: Write failing crop-picker tests**

Cover the user-visible behaviour:

```tsx
render(<VegetableGrid selected={[]} onToggle={onToggle} month={8} showAll={false} onShowAllChange={setShowAll} search="" onSearchChange={setSearch} />);
expect(screen.getByTestId("seasonal-recommendations").querySelectorAll('[aria-pressed="false"]')).toHaveLength(6);
expect(screen.getByText(/Sow outside now|Plant out now|Harvest now/)).toBeVisible();
await user.click(screen.getByRole("button", { name: /Browse all crops/i }));
expect(setShowAll).toHaveBeenCalledWith(true);
```

In expanded mode, type `tom` and assert Tomato remains while unrelated crops disappear. Type an impossible value and assert `No crops match` plus `Clear search`. Assert category headings use `h3`.

- [ ] **Step 2: Write failing equipment tests**

Assert the initial common-tool list contains exactly trowel, watering can, spade, fork, secateurs, and seed trays. Assert `Show all tools` requests expanded disclosure and all 17 options render in expanded mode.

- [ ] **Step 3: Run both component tests and verify RED**

Run:

```bash
npm test -- components/VegetableGrid.test.tsx components/EquipmentSelector.test.tsx
```

Expected: FAIL because the disclosure and seasonal props do not exist.

- [ ] **Step 4: Implement the crop picker**

Render recommendation cards first, using `VEG_PHOTOS[id]` through `next/image` when available and the existing emoji otherwise. Preserve text labels, `aria-pressed`, selected-state colour, focus-visible rings, and at least 44px height.

When `showAll` is true, render a labeled search input and category sections filtered by crop name. Keep `Browse all crops` secondary to the recommendation cards.

- [ ] **Step 5: Implement equipment disclosure**

Filter `EQUIPMENT_OPTIONS` against a `COMMON_EQUIPMENT_IDS` constant until `showAll` is true. Keep native checkboxes and existing selected styling.

- [ ] **Step 6: Run tests and type checking**

```bash
npm test -- components/VegetableGrid.test.tsx components/EquipmentSelector.test.tsx
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/VegetableGrid.tsx components/VegetableGrid.test.tsx components/EquipmentSelector.tsx components/EquipmentSelector.test.tsx
git commit -m "feat: guide seasonal crop and tool selection"
```

---

### Task 4: Progressive setup accordion

**Files:**
- Create: `components/SetupProgress.tsx`
- Create: `components/SetupProgress.test.tsx`
- Modify: `components/SetupWizard.tsx`
- Create: `components/SetupWizard.test.tsx`
- Modify: `app/page.tsx`
- Create: `app/page.test.tsx`

**Interfaces:**
- `SetupProgress` accepts `activeStep`, `completedSteps`, and `onEdit(step)`.
- `SetupWizard` continues to accept `initial`, `onSave`, and optional `onCancel`.
- Consumes: Task 2 draft helpers and Task 3 disclosure props.

- [ ] **Step 1: Write failing progress tests**

Assert `Step 2 of 4`, the progress value, completed summaries, and accessible Edit buttons. Edit buttons must call `onEdit` with their stage number.

- [ ] **Step 2: Write failing wizard progression tests**

Mock postcode fetch with a successful postcodes.io response. Test these behaviours separately:

```tsx
expect(screen.getByRole("button", { name: /Continue to crops/i })).toBeDisabled();
expect(screen.getByText(/Check your postcode to continue/i)).toBeVisible();
```

After valid lookup, Continue opens stage two and focuses its heading. Stage two blocks progression until one crop is selected. Stages three and four allow progression with defaults and no equipment. `Save my garden` calls `onSave` with the existing `UserProfile` shape. Restored draft values render after remount.

In `app/page.test.tsx`, mock `SetupWizard` with a button that calls its `onSave` prop using a valid profile. Save a setup draft before rendering `Home`, click the mock save button, then assert `loadProfile()` returns the profile and `loadSetupDraft()` returns null. This proves the draft clears only after the profile save path succeeds.

Assert the loading state in `app/page.tsx` has `role="status"` and `aria-live="polite"`.

- [ ] **Step 3: Run setup tests and verify RED**

```bash
npm test -- components/SetupProgress.test.tsx components/SetupWizard.test.tsx app/page.test.tsx
```

Expected: FAIL because progressive controls and draft behaviour are absent.

- [ ] **Step 4: Build `SetupProgress`**

Render a four-step ordered list, `aria-current="step"` on the active step, a semantic progress element or equivalent progressbar, and Edit buttons only for completed stages. Keep the component presentational.

- [ ] **Step 5: Refactor `SetupWizard` into controlled stages**

Keep existing postcode lookup logic and copy style. Add active-stage state, completion rules, refs for headings and invalid controls, Back/Continue controls, required/optional labels, and local draft effects.

Use these exact nearby requirement messages:

- Location: `Check your postcode to continue.`
- Crops: `Select at least one crop to continue.`
- Plot: `Optional — you can change this later.`
- Tools: `Optional — skip this if you are still building your tool shed.`

Add the privacy sentence from the design. Change crop guidance to `Select at least one crop you grow now or would like to grow.`

- [ ] **Step 6: Clear the draft from `Home.handleSave`**

Call `clearSetupDraft()` after `saveProfile(next)`. Preserve existing scroll-to-top and editing behaviour.

- [ ] **Step 7: Run focused and full tests**

```bash
npm test -- components/SetupProgress.test.tsx components/SetupWizard.test.tsx app/page.test.tsx
npm test
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add components/SetupProgress.tsx components/SetupProgress.test.tsx components/SetupWizard.tsx components/SetupWizard.test.tsx app/page.tsx app/page.test.tsx
git commit -m "feat: replace setup catalogue with guided steps"
```

---

### Task 5: Friendly weather recovery and seasonal dashboard summary

**Files:**
- Modify: `app/api/weather/route.ts`
- Create: `app/api/weather/route.test.ts`
- Modify: `components/WeatherBanner.tsx`
- Create: `components/WeatherBanner.test.tsx`
- Create: `components/PlotSummary.tsx`
- Create: `components/PlotSummary.test.tsx`
- Modify: `components/Dashboard.tsx`

**Interfaces:**
- `WeatherBanner` adds `onRetry: () => void`.
- `PlotSummary` accepts `profile: UserProfile` and optional `month?: number` for deterministic tests.
- `Dashboard` extracts weather loading into a stable `fetchWeather` callback reused on mount and Retry.

- [ ] **Step 1: Write failing API and banner tests**

With the weather API key absent, assert the route preserves status 500 and returns safe JSON:

```ts
const payload = await response.json();
expect(payload).toEqual({ error: "Weather is unavailable right now." });
expect(JSON.stringify(payload)).not.toMatch(/OPENWEATHERMAP|API_KEY|\b\d{3}\b/);
```

Render the error banner and assert it shows exactly:

```text
We can't load local weather right now. You can still get growing advice.
```

Click `Try weather again` and assert `onRetry` runs once. Assert loading uses `role="status"`.

- [ ] **Step 2: Write failing plot-summary tests**

Render a one-crop profile and assert `1 crop`, the current month label, active crop count, and `PLOT_SIZE_LABELS[profile.plotSize]`. Repeat with two crops to prove pluralisation.

- [ ] **Step 3: Run the tests and verify RED**

```bash
npm test -- app/api/weather/route.test.ts components/WeatherBanner.test.tsx components/PlotSummary.test.tsx
```

Expected: FAIL because safe errors, Retry, and the summary component are missing.

- [ ] **Step 4: Sanitize weather route responses**

Return user-safe errors for missing configuration, invalid coordinates, upstream failure, empty forecast, and request failure. Keep diagnostic detail in `console.error` only where an exception or upstream response exists; never send it to the client.

- [ ] **Step 5: Add retryable banner and dashboard request callback**

Refactor the dashboard weather effect to call `fetchWeather`. Clear prior error, set loading, preserve cancellation protection for unmount, and pass `fetchWeather` to `WeatherBanner.onRetry`.

- [ ] **Step 6: Add `PlotSummary` below the hero**

Compute current-month activity with Task 1 helpers. Show month, formatted crop count, active count, and plot label in a compact sage/warm-stone strip that uses existing tokens.

- [ ] **Step 7: Run tests, type checking, and API build coverage**

```bash
npm test -- app/api/weather/route.test.ts components/WeatherBanner.test.tsx components/PlotSummary.test.tsx
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add app/api/weather/route.ts app/api/weather/route.test.ts components/WeatherBanner.tsx components/WeatherBanner.test.tsx components/PlotSummary.tsx components/PlotSummary.test.tsx components/Dashboard.tsx
git commit -m "feat: add resilient weather and seasonal plot summary"
```

---

### Task 6: Confirm advice replacement and expose every timeline

**Files:**
- Create: `components/AdviceRefreshConfirm.tsx`
- Create: `components/AdviceRefreshConfirm.test.tsx`
- Modify: `components/TimelineFilter.tsx`
- Create: `components/TimelineFilter.test.tsx`
- Modify: `components/Dashboard.tsx`

**Interfaces:**
- `AdviceRefreshConfirm` accepts `onConfirm` and `onCancel`.
- `TimelineFilter` keeps `value` and `onChange` unchanged.
- `Dashboard` adds a local confirmation state but preserves advice storage and completed-task logic.

- [ ] **Step 1: Write failing confirmation tests**

Assert the panel states `Fresh advice will replace your current task list.` Assert it focuses its heading or panel on mount, calls `onConfirm` from `Replace my task list`, calls `onCancel` from `Keep saved tasks`, and cancels on Escape.

- [ ] **Step 2: Write failing timeline tests**

Render the filter and assert a labeled select contains all six `TIMELINE_LABELS` options. Change it to `30-days` and assert `onChange("30-days")`. Assert the desktop radiogroup still contains six radios and reflects the same selected value.

- [ ] **Step 3: Run tests and verify RED**

```bash
npm test -- components/AdviceRefreshConfirm.test.tsx components/TimelineFilter.test.tsx
```

Expected: FAIL because both new behaviours are absent.

- [ ] **Step 4: Implement responsive timeline variants**

Render the native select with `sm:hidden` and the existing radiogroup with `hidden sm:flex`. Keep both controlled by the same props. Do not rely on horizontal overflow.

- [ ] **Step 5: Implement advice replacement confirmation**

When advice exists, the fresh-advice button opens `AdviceRefreshConfirm`. Only confirmed replacement calls `fetchAdvice`. Cancel leaves advice, timestamp, and `completed` unchanged. A failed confirmed request must also leave them unchanged; only overwrite storage after a successful response.

- [ ] **Step 6: Run focused and full tests**

```bash
npm test -- components/AdviceRefreshConfirm.test.tsx components/TimelineFilter.test.tsx
npm test
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/AdviceRefreshConfirm.tsx components/AdviceRefreshConfirm.test.tsx components/TimelineFilter.tsx components/TimelineFilter.test.tsx components/Dashboard.tsx
git commit -m "feat: protect saved advice and repair mobile timelines"
```

---

### Task 7: Navigation, footer, calendar, and copy cleanup

**Files:**
- Modify: `components/Header.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/SeasonalCalendar.tsx`
- Create: `components/SeasonalCalendar.test.tsx`
- Create: `components/ShellContent.test.tsx`
- Modify: `components/Dashboard.tsx`
- Modify: `components/SetupWizard.tsx`

**Interfaces:**
- Preserves all component exports and call sites.
- Seasonal calendar cells gain deterministic accessible labels.

- [ ] **Step 1: Write failing shell and calendar tests**

Assert the header has no CrystalPocket link. Assert the footer has no Facebook, Instagram, X, YouTube, or LinkedIn links, but retains GrowGuide, CrystalPocket, weather attribution, and photography credit.

For a known crop/month fixture, assert accessible names:

```text
Tomato, August: harvest
Tomato, March: sow or plant
Tomato, December: dormant
```

Assert every month cell has a non-empty accessible name and colour is not its only exposed state.

- [ ] **Step 2: Run tests and verify RED**

```bash
npm test -- components/ShellContent.test.tsx components/SeasonalCalendar.test.tsx
```

Expected: FAIL because the old outbound/social links and incomplete calendar labels remain.

- [ ] **Step 3: Simplify header and footer**

Remove the sticky-header outbound link. Replace the footer's social block with one compact line of provenance and credits. Keep the footer dark-earth/cream treatment but reduce vertical padding and visual dominance.

- [ ] **Step 4: Add calendar state names**

Generate state text from the same active and harvest sets used for colour. Add `aria-label` to each cell and hide the decorative month initial from screen readers. Keep the visible legend and add plain visible words exactly as today.

- [ ] **Step 5: Apply remaining copy and semantic corrections**

Use `formatCropCount` in the dashboard hero. Confirm the wizard contains device-neutral crop copy and explicit required/optional labels from Task 4. Confirm initial loading has status semantics. Remove obsolete imports, comments, social data, and overflow classes.

- [ ] **Step 6: Run all automated checks**

```bash
npm test
npx tsc --noEmit
```

Expected: PASS with no warnings caused by changed code.

- [ ] **Step 7: Commit**

```bash
git add components/Header.tsx components/Footer.tsx components/SeasonalCalendar.tsx components/SeasonalCalendar.test.tsx components/ShellContent.test.tsx components/Dashboard.tsx components/SetupWizard.tsx
git commit -m "fix: finish accessible GrowGuide interface polish"
```

---

### Task 8: Production verification and bounded visual review

**Files:**
- Modify only files with defects discovered during this task.

**Interfaces:**
- Validates the complete setup-to-dashboard path without adding new scope.

- [ ] **Step 1: Run the full test, type, and build suite**

```bash
npm test
npx tsc --noEmit
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 2: Run the required Impeccable detector once**

Run it over every changed markup target in one command:

```bash
node /Users/johnworley/.agents/skills/impeccable/scripts/detect.mjs --json app/page.tsx components/SetupWizard.tsx components/SetupProgress.tsx components/VegetableGrid.tsx components/EquipmentSelector.tsx components/Dashboard.tsx components/PlotSummary.tsx components/WeatherBanner.tsx components/AdviceRefreshConfirm.tsx components/TimelineFilter.tsx components/Header.tsx components/Footer.tsx components/SeasonalCalendar.tsx
```

Expected: exit 0 and `[]`. If the detector returns findings with exit 2, fix genuine defects in one batch, rerun the affected automated tests, and do not rerun the detector.

- [ ] **Step 3: Start the production-like local preview**

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Record the session so it can be stopped after review.

- [ ] **Step 4: Perform one batched browser review**

Inspect desktop 1280×720 and mobile 390×844 together. Exercise:

- fresh setup, valid postcode, seasonal recommendations, search, Browse all, Back, and optional-tool completion;
- reload during an unfinished setup;
- dashboard summary, weather failure and Retry;
- advice replacement cancel and confirm;
- every mobile timeline value;
- keyboard focus order, visible focus, heading structure, and calendar names.

Capture desktop and mobile screenshots. Record all defects before editing.

- [ ] **Step 5: Apply one defect batch and confirm once**

Patch every real defect from Step 4 together. Run tests for affected files, `npx tsc --noEmit`, and `npm run build`. Recheck desktop and mobile once, then stop polishing.

- [ ] **Step 6: Stop the local server and review the source diff**

Stop the recorded dev-server session. Run:

```bash
git diff --check
git status --short
git diff --stat
```

Confirm there are no temporary files, debug output, orphaned code, unrelated edits, or accidental analytics initialisation.

- [ ] **Step 7: Commit verification fixes, if any**

If Step 5 changed files, stage only the possible verification targets below; unchanged paths are harmless:

```bash
git add app/page.tsx app/api/weather/route.ts components/SetupWizard.tsx components/SetupProgress.tsx components/VegetableGrid.tsx components/EquipmentSelector.tsx components/Dashboard.tsx components/PlotSummary.tsx components/WeatherBanner.tsx components/AdviceRefreshConfirm.tsx components/TimelineFilter.tsx components/Header.tsx components/Footer.tsx components/SeasonalCalendar.tsx
git commit -m "fix: resolve final GrowGuide visual defects"
```

If Step 5 changed nothing, record the clean verification evidence without creating an empty commit.
