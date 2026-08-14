# Task 3 Report — Compact Shared Rain-to-Action Composition

## Scope

- Rebuilt the dashboard first frame as one relative `rain-action-composition` containing the compact heading, forecast, and 60/40 workspace.
- Removed the `Your growing dashboard` and `Priorities` kickers, reduced the h1 to `text-2xl sm:text-3xl`, and placed the postcode summary and Edit setup action in one responsive row.
- Added the deterministic `WeatherActionCue` at the top of `What needs doing` with the specified `weather-action-target` endpoint.
- Added one warning-dependent, decorative, desktop-only blue dashed SVG trajectory from the forecast's lower-right field to the action cue.
- Preserved mobile priority-first/plot-second ordering, moved the seasonal timeline immediately after the workspace, and moved the weather map below it as a full-width secondary reference.
- Reduced the map canvas from `h-64` to `h-48 sm:h-52` without changing WeatherMap props or Leaflet behaviour.
- Added one-run exponential-ease path motion and a reduced-motion final state.
- Preserved all advice, storage, abort, confirmation, request-count, retry, focus, and checkbox behaviour. Unrelated `.impeccable` artifacts were neither modified nor staged.

## TDD evidence

### RED

Command:

```sh
npx vitest run components/Dashboard.test.tsx components/WeatherMap.test.tsx
```

Output summary (exit 1):

```text
FAIL  components/Dashboard.test.tsx
Unable to find role="note" and name "Weather-linked action"

FAIL  components/WeatherMap.test.tsx
Expected: h-48 sm:h-52
Received: h-64 w-full

Test Files  2 failed (2)
Tests  2 failed | 14 passed (16)
```

These were the intended failures: the cue and cross-panel composition were not connected, the timeline/map order had not been rebuilt, and the map retained its tall canvas.

### GREEN and behaviour regression

Command:

```sh
npx vitest run components/Dashboard.test.tsx components/WeatherMap.test.tsx components/AdviceRefreshConfirm.test.tsx components/InterfaceAccessibility.test.ts
```

Output (exit 0):

```text
Test Files  4 passed (4)
Tests  24 passed (24)
```

The Dashboard coverage still verifies restored advice, cancellation, exactly one replacement request, loading focus, storage rejection, safe server copy, timeout guidance, abort-after-unmount, obsolete-response disposal, and saved checkbox state.

## Full verification

```text
npm test
Test Files  31 passed (31)
Tests  126 passed (126)

npx tsc --noEmit
No output; exit 0.

npm run build
Compiled successfully; 9/9 static pages generated; exit 0.

git diff --check
No output; exit 0.
```

## Self-review

- The connector exists only when a rain or frost cue exists, remains `aria-hidden="true"`, is not focusable, and is hidden below `lg`.
- The connector uses the same exponential easing curve as the existing setup trajectory and stops after one 900 ms run; reduced-motion users receive the final static state.
- The heading, forecast, workspace, timeline, and map retain semantic headings/regions and 44-pixel action targets.
- Dashboard API payloads, persisted data, timers, request IDs, abort controller, confirmation, task completion, and retry callbacks are unchanged.
- WeatherMap keeps the same prop contract, overlay controls, marker, attribution, overlay route, and lifecycle; only the canvas height changed.
- `components/WeatherMap.test.tsx` was created because the repository had no pre-existing WeatherMap test file despite the brief describing it as a modification.

## Concerns

None.
