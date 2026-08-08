# GrowGuide Progressive Setup and Product Polish

## Purpose

Refine GrowGuide's first-run setup and dashboard so gardeners reach useful, personalised guidance with less effort. Preserve the product's earthy palette, garden photography, warm writing, labeled controls, live postcode feedback, visible selection states, saved profile, saved advice, and completed tasks.

## Scope

This change implements every P1 and P2 issue from the 8 August 2026 Impeccable critique and resolves its minor observations. It retains the existing Next.js application, local-first profile storage, weather and advice APIs, crop data, and overall visual identity.

Analytics packages remain installed but uninitialised. Vercel Analytics integration and Microsoft Clarity project configuration require a separate privacy and deployment decision.

## Design Principles

1. Keep the garden-specific visual world. Extend the existing cream, sage, moss, blush, terracotta, and earth palette.
2. Reveal one meaningful decision at a time.
3. Show users what remains before they press a button.
4. Preserve work across reloads and explicit refresh actions.
5. Keep technical failures behind calm, actionable language.
6. Use seasonal information to improve decisions, not merely decorate the page.

## Setup Experience

### Progressive accordion

The setup remains one route and one form, but it becomes a four-stage accordion:

1. **Your location** — required
2. **What you want to grow** — required
3. **Your plot** — optional details with the existing medium-size default
4. **Your tool shed** — optional

Only the active stage exposes its complete controls. A completed stage collapses into a concise summary and remains editable. The interface shows `Step N of 4` and a slim progress bar. Back and Continue controls sit directly below the active stage. The final stage offers `Save my garden` and an explicit `Skip tools and finish` path when no equipment is selected.

Location must validate before stage two opens. At least one crop must be selected before stage three opens. Stages three and four never block completion.

Each disabled Continue control has nearby text that states the missing requirement. Required controls use `aria-required`, `aria-invalid`, and `aria-describedby`. Validation messages remain beside their controls. The accordion moves focus to the next stage heading after successful progression and to the first invalid control after failed validation.

### Draft persistence

The app saves incomplete setup locally under a new versioned draft key after meaningful state changes. The draft contains the active stage, postcode text, validated lookup, crops, plot size, environment, equipment, and expanded catalogue state. It excludes transient loading and error values.

On first load, the wizard restores a valid draft when no saved profile exists. Saving a profile clears the draft. Cancelling an edit restores the saved profile and clears only the editing draft. Malformed or stale drafts fail closed and never block setup.

The location card states: `Your postcode is used for local weather and stored on this device.`

## Seasonal Crop Selection

### Recommended first view

The crop stage opens with up to six recommendations for the current UK month. A pure selector ranks crops in this order:

1. Sow outdoors this month
2. Transplant this month
3. Sow indoors this month
4. Harvest this month
5. Easy crops that are active next month

The selector removes duplicates and preserves the source data's stable order within each rank. Each recommendation shows one plain-language seasonal marker: `Sow outside now`, `Plant out now`, `Sow indoors now`, `Harvest now`, or `Coming up next month`.

Recommendations use existing crop photography when available and the existing emoji fallback when no photograph exists. They preserve `aria-pressed`, text labels, focus rings, and selected-state contrast.

### Browse and search

The default view shows recommendations plus `Browse all crops`. The expanded catalogue includes a case-insensitive search field and category groups. Category headings use sequential heading levels. Search returns matching crop names and shows a useful empty state.

Copy changes from `Tap to select` to `Select at least one crop you grow now or would like to grow.` Selection counts handle singular and plural forms.

## Equipment Selection

The tool stage begins with six common tools: trowel, watering can, spade, fork, secateurs, and seed trays. `Show all tools` reveals the complete existing list. Equipment remains optional and retains checkbox semantics and visible selection states.

## Dashboard Improvements

### Seasonal plot summary

The dashboard adds a compact summary strip below the hero. It shows the current month, the user's crop count with correct singular/plural grammar, the number of selected crops active this month, and the plot-size label. This strip uses the same seasonal selector as setup, so both surfaces agree.

The existing weather banner, advice controls, task cards, saved tasks, map, calendar, imagery, and layout remain intact.

### Weather recovery

The API never returns environment-variable names or upstream status codes to the browser. The banner shows: `We can't load local weather right now. You can still get growing advice.` It includes `Try weather again`, which repeats the weather request without reloading the page.

Loading uses `role="status"` and `aria-live="polite"`. Retry communicates its next loading state through the same live region.

### Replacing saved advice

When saved advice exists, `Get fresh advice` opens an inline confirmation panel instead of starting the request. The panel states that fresh advice replaces the current list while preserving the old list until the user confirms. It offers `Replace my task list` and `Keep saved tasks`.

The panel receives focus when it opens. Escape or `Keep saved tasks` closes it. Confirming starts the existing loading sequence; a failed request leaves the saved advice and completion state untouched.

### Timeline on mobile

Screens below Tailwind's `sm` breakpoint use a labeled native select for all six timeline ranges. Larger screens retain the existing radio-style pills. Both controls use the same value and change handler.

## Header and Footer

The sticky header keeps the GrowGuide identity and removes the CrystalPocket outbound link. The footer becomes a compact product note without generic social-platform links. It retains the GrowGuide name, concise attribution, weather source, photography credit, and CrystalPocket ownership link.

This change keeps operational attention on setup and gardening tasks without removing provenance.

## Accessibility Corrections

- Use sequential headings in the crop catalogue.
- Give every seasonal calendar cell an accessible label that names the crop, month, and state: sow/plant, harvest, or dormant.
- Add visible text or screen-reader text so calendar meaning never depends on colour alone.
- Mark the initial `Opening the potting shed…` state as a polite status.
- Preserve visible keyboard focus on every control.
- Keep touch targets at least 44px tall where the progressive flow introduces new controls.
- Move focus predictably after accordion progression, validation failure, and refresh confirmation.

## Copy Corrections

- Use `1 crop` and pluralise all other crop counts.
- Replace `Tap to select` with device-neutral guidance.
- Label required and optional stages explicitly.
- Replace raw weather errors with friendly, actionable copy.
- Explain destructive advice replacement before it occurs.
- Keep the established British gardening voice and `en-GB` spelling.

## Component Boundaries

- `SetupWizard` owns draft state, stage progression, postcode lookup, and final profile creation.
- A new `SetupProgress` component renders progress and completed-stage summaries.
- `VegetableGrid` owns recommendation, search, expanded browsing, crop imagery, and selection presentation.
- `EquipmentSelector` owns common-tool disclosure and complete equipment selection.
- A new pure seasonal helper computes crop markers and recommendations.
- Storage helpers own versioned draft parsing, saving, loading, and clearing.
- `WeatherBanner` renders loading, success, friendly failure, and retry states.
- `Dashboard` owns weather requests, replacement-confirmation state, and the seasonal plot summary.
- `TimelineFilter` owns the responsive select/radio presentation.
- `Header`, `Footer`, and `SeasonalCalendar` receive narrow presentation and accessibility changes.

## Data Flow

1. `Home` loads the saved profile as it does today.
2. When no profile exists, `SetupWizard` loads a valid draft and restores its active stage.
3. Setup changes write a versioned local draft.
4. Saving creates the existing `UserProfile`, saves it through `saveProfile`, clears the draft, and opens the dashboard.
5. The dashboard computes seasonal summary data locally from the saved crop IDs and current month.
6. Weather retry repeats the existing POST request. Advice refresh requires explicit confirmation when saved advice exists.

## Error Handling

- Invalid postcode format stays inline and prevents progression.
- Failed postcode lookup preserves the typed postcode and offers another attempt.
- Empty crop search explains that no crops match and offers `Clear search`.
- Invalid draft JSON or schema returns no draft and removes nothing else.
- Weather failures preserve all non-weather dashboard functions and expose Retry.
- Advice failure preserves saved advice, timestamps, and completed tasks.

## Testing Strategy

Add Vitest, React Testing Library, `user-event`, and jsdom because the project has no automated test runner.

Use test-driven development for each behaviour:

- Seasonal ranking, marker priority, duplicate removal, next-month rollover, and six-item limit.
- Draft round-trip, invalid-data fallback, saved-profile isolation, and clearing after save.
- Setup progression, required-step gating, focus movement, pluralisation, search, and optional-tool completion.
- Friendly weather failure and Retry.
- Advice replacement confirmation, cancellation, and saved-state preservation after failure.
- Mobile timeline select and desktop radio controls sharing one value.
- Calendar accessible labels for active, harvest, and dormant months.
- Header and footer content changes.

Run unit and component tests, TypeScript checks, the production build, one Impeccable detector pass over every changed markup file, and a bounded desktop/mobile browser review.

## Acceptance Criteria

1. A first-time user completes setup through four progressive stages without scanning the full crop or equipment catalogue.
2. Setup survives a reload before completion.
3. Users cannot advance past an unchecked postcode or an empty crop selection.
4. Seasonal recommendations show at most six relevant crops with truthful markers.
5. Every crop remains discoverable through search or `Browse all crops`.
6. Optional plot and equipment details never block completion.
7. Technical weather details never reach user-facing copy, and Retry works.
8. Fresh advice cannot replace saved tasks without confirmation.
9. All six timeline ranges remain visible and usable on mobile.
10. The dashboard gains useful seasonal character without replacing the existing palette, photography, copy style, weather, map, calendar, advice, or saved tasks.
11. The header and footer stop competing with the primary task.
12. Automated tests, TypeScript checks, the production build, detector scan, and bounded visual review pass.

## Non-Goals

- Rebrand or replace the incumbent visual system.
- Change crop facts or add region-specific horticultural data that the project does not contain.
- Change the advice prompt, model, or task-storage format.
- Add accounts, cloud sync, or server-side profile storage.
- Initialise analytics or publish the application.
