# Task 5 report — Visual Tokens, Setup, Privacy, and Responsive Integration

## Result

Completed the Task 5 Gravity Rain rebrand integration against base commit
`0453b6a7a065b9130fca2f813f1f113b84425fd4`.

The recovered diff:

- installs the approved semantic palette and matte surface tokens, retains legacy
  aliases for untouched UI, and maps both Tailwind font aliases to Figtree;
- replaces the setup photo treatment with a compact garden-ground introduction,
  Rainline mark, trajectory lines, explicit first-run and edit headings, and the
  required local-device reassurance;
- keeps the four-step workflow, validation, draft persistence, focus handling,
  selections, touch targets, and save paths intact while applying the new palette;
- applies the matching fine-line system to the header, compact footer, privacy
  page, and weather map;
- preserves the Ko-fi and Privacy links, with no social placeholders; and
- adds the one-run `rain-path` animation and reduced-motion fallback.

No production `font-serif`, `DM_Sans`, or `DM_Serif_Display` usage remains in
the changed production files.

## TDD evidence

The pre-existing test diff adds the intended user-visible contracts:

- `app/layout.test.tsx` changes the Google font mock to `Figtree` and asserts the
  Figtree class plus the design-direction template and seed.
- `components/SetupWizard.test.tsx` adds the first-run heading, device-storage
  line, and existing-garden heading assertions.
- The base layout used `DM_Sans` and `DM_Serif_Display`; the base setup source
  did not contain either of the new setup headings or the four-step reassurance.
  Those assertions therefore describe behavior absent from the base revision.

The interrupted handoff did not retain the original terminal RED output, so this
report does not claim to have witnessed it. The base-versus-diff inspection above
establishes the red condition, and the current focused run is green:

```text
npx vitest run app/layout.test.tsx components/SetupWizard.test.tsx components/ShellContent.test.tsx app/privacy/page.test.tsx
4 files passed; 22 tests passed
```

## Impeccable detector

Executed exactly once, after the UI work was ready, with the task brief's exact
command:

```text
node /Users/johnworley/.agents/skills/impeccable/scripts/detect.mjs --json app/layout.tsx app/globals.css app/page.tsx app/privacy/page.tsx components/Header.tsx components/Footer.tsx components/SetupWizard.tsx components/SetupProgress.tsx components/VegetableGrid.tsx components/EquipmentSelector.tsx components/Dashboard.tsx components/WeatherBanner.tsx components/WeatherMap.tsx components/PlotSummary.tsx components/SeasonalCalendar.tsx components/AdviceResults.tsx components/TaskCard.tsx components/TimelineFilter.tsx components/AdviceRefreshConfirm.tsx
```

Raw result:

```json
[]
```

No detector findings required repair, and the detector was not rerun.

## Design contract and build evidence

`app/layout.tsx` contains a root-layout template carrying the Gravity Rain
production contract, including seed `6b059f98` and the exact required line:

```text
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
```

Following the successful production build, fixed-string searches found both the
seed/form line and that exact FINISH line in `.next/server/app/index.html` (and
in the shared layout output for other generated routes). This confirms the
contract survives production compilation.

## Verification

All commands below exited successfully:

```text
npx vitest run app/layout.test.tsx components/SetupWizard.test.tsx components/ShellContent.test.tsx app/privacy/page.test.tsx
  4 files passed; 22 tests passed

npm test
  28 files passed; 114 tests passed

npx tsc --noEmit
  exit 0

npm run build
  Next.js 14.2.35 production build completed; all 9 static pages generated

git diff --check 0453b6a7a065b9130fca2f813f1f113b84425fd4 --
  exit 0; no whitespace errors
```

The build fetched and emitted the Figtree asset normally; there was no font
network failure.

## Scope and hygiene

Only Task 5 source/test/config files and this report are intended for the scoped
commit. Existing untracked `.impeccable` artifacts are deliberately left
untouched and unstaged. No push was performed.

## Review fix round 1

The review findings were addressed without rerunning the Impeccable detector:

- The header Rainline mark now uses `text-rain-ink` on pale mineral rather than
  `text-sky-blue`; rain ink (`#285F87`) provides the required essential-graphic
  contrast against `#E7E8E4`.
- `components/ShellContent.test.tsx` now has an explicit, isolated footer
  contract test for the direct Ko-fi and Privacy hrefs. Its cleanup hook keeps
  each shell render independent. A companion header assertion protects the
  contrast-safe mark token.
- The new header assertion was first run red: the mark had
  `h-8 w-8 shrink-0 text-sky-blue`, rather than the required `text-rain-ink`.
  After the header change, `components/ShellContent.test.tsx` passed 3/3.
- `Dashboard.tsx`, `Dashboard.test.tsx`, `AdviceResults.tsx`, `PlotSummary.tsx`,
  `TaskCard.tsx`, and `WeatherBanner.tsx` were restored byte-for-byte to base
  `0453b6a7a065b9130fca2f813f1f113b84425fd4`. This removes the unrelated
  dashboard label/error-icon and shared dashboard styling changes from Task 5.

### Reconstructed original RED run

To supply an honest RED record without rewriting history, a temporary isolated
copy was created from base `0453b6a7a065b9130fca2f813f1f113b84425fd4`. Only the
then-Task-5 changes to `app/layout.test.tsx` and
`components/SetupWizard.test.tsx` were applied to that copy. The task's exact
focused command was then run there:

```text
npx vitest run app/layout.test.tsx components/SetupWizard.test.tsx components/ShellContent.test.tsx app/privacy/page.test.tsx
```

It exited `1`, with 2 test files failed and 2 passed (2 failed tests and 18
passed tests). `SetupWizard` failed because the base UI rendered `Tell us about
your plot` / `Update your plot`, not the required garden headings. The base
layout test module also failed to load because it received the new `Figtree`
mock while the base layout still invoked the old font imports. This is the
expected RED condition for the new tests; the first copy attempt was discarded
because its patch application failed before the command, and is not counted as
evidence.

### Round 1 verification

```text
npx vitest run app/layout.test.tsx components/SetupWizard.test.tsx components/ShellContent.test.tsx app/privacy/page.test.tsx
  4 files passed; 24 tests passed

npm test
  28 files passed; 116 tests passed

npx tsc --noEmit
  exit 0

npm run build
  Next.js 14.2.35 production build completed; all 9 static pages generated

git diff --check HEAD --
  exit 0; no whitespace errors

git diff --exit-code 0453b6a7a065b9130fca2f813f1f113b84425fd4 -- components/Dashboard.tsx components/Dashboard.test.tsx components/AdviceResults.tsx components/PlotSummary.tsx components/TaskCard.tsx components/WeatherBanner.tsx
  exit 0; all six explicitly out-of-scope files match the Task 4 base
```
