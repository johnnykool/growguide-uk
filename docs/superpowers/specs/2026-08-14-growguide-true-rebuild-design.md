# GrowGuide UK True Rebuild Design

**Date:** 14 August 2026  
**Status:** Approved for local implementation  
**Mode:** Operate  
**Direction:** Gravity Rain field record  
**Seed:** `f20db32c`

## Purpose

Rebuild the setup and dashboard as one coherent working instrument. Preserve the tested profile, storage, postcode, weather, advice, privacy, and cost controls. Replace the old wizard, summary table, and faint decorative connector.

The result must feel like a new product composition, not the old interface with new colours.

## Product Truth

- GrowGuide UK helps everyday UK growers decide what to do next.
- Location, conditions, plot size, equipment, and crops shape the guidance.
- The browser stores the profile and advice locally.
- Weather requests remain automatic after setup. Paid AI advice remains deliberate and confirmed before replacement.
- Copy, interruptions, and user data stay minimal.
- The interface must remain distinct from growguide.co.uk.

## Structural Direction

The surface uses an annotated horticultural field record: a large, factual garden portrait surrounded by short labels, weather traces, and action controls. It borrows the clarity of a specimen sheet without turning gardening into decoration.

Seven grounded structures were considered: allotment task board, Met Office forecast chart, potting bench, railway timing board, Ordnance Survey field sheet, horticultural field record, and workshop pegboard. The field record carries the product best because the same schematic can grow during setup and become the dashboard's working centre.

The catalog challengers were rejected. Modular colour bars conflict with the restrained Gravity Rain palette; telop captions and teletext weaken trust; Miura folds and tensegrity obscure familiar controls; a type specimen makes typography, not gardening, the subject.

## Setup Experience

Setup becomes a responsive workbench, not a stack of bordered panels.

### Desktop

- A narrow progress spine and active controls occupy the left side.
- A large live garden portrait occupies the right side and remains visible through all four steps.
- The portrait starts as an empty field grid. Postcode adds the region and weather origin. Crop selections add labelled crop bands. Plot and environment selections alter the schematic's scale and condition markers. Equipment adds a compact tool register.
- The active step changes within the same workspace; the page does not present four separate cards.
- Back, continue, skip, and save actions sit in one stable control dock.

### Mobile

- The active controls come first.
- A compact portrait follows and updates without pushing the main action below excessive explanation.
- Progress uses four short numbered tabs with complete, current, and locked states.
- Required labels, errors, and focus movement remain intact.

### Truth Boundary

The portrait is a categorical schematic, never a measured plot plan. It uses only selected crop names, crop categories, plot-size class, environment labels, equipment count, postcode, and region. It never assigns real-world crop positions, bed dimensions, yields, or conditions the user did not provide.

## Dashboard Experience

The first working frame joins forecast, garden portrait, and action into one composition.

### Desktop

- A designed weather chip sits in the header.
- The page opens with a compact location line and edit action.
- A dark forecast rail spans the work surface.
- Below it, the garden portrait occupies roughly two thirds of the frame. A focused action station occupies the remaining third.
- The weather path begins at the relevant forecast area and lands precisely on the deterministic rain or frost action.
- The black-flower mark is at least 32px and anchors the garden portrait.
- Advice controls and results stay in the action station. The default timeframe is seven days; common choices are visible, and longer ranges live under one "More" control.
- The seasonal timeline and weather map remain secondary, below the first frame.

### Mobile

- The order is forecast, action, portrait, season, then map.
- The weather path becomes a visible vertical or diagonal trace between forecast and action; it must remain a path, not collapse into a thin border.
- The seasonal timeline opens at the current month and shows a continuation cue.

### Forecast Copy

The forecast label states the number of entries rendered. The current five-entry payload reads "Five-day forecast."

## Signature Motion

Successful weather loading triggers one clear 1.8-second sequence:

1. The weather source brightens for about 300ms.
2. A 3px Sky Blue path draws from forecast to action from about 250ms to 1,300ms.
3. The target cue receives a brief colour wash and black-flower bloom from about 1,150ms to 1,800ms.

The sequence runs once when a rain or frost cue appears. It never loops. Content remains legible before, during, and after motion. `prefers-reduced-motion: reduce` shows the final path and target state without animation.

Setup transitions may use one short, restrained reveal when the active step changes. No ambient or continuous motion is allowed.

## Visual Language

Gravity Rain remains the durable identity:

- Garden Ground and Pale Mineral define the field record.
- Sky Blue and Rain Ink belong to weather and action.
- Ember marks frost, protection, error, and urgent timing.
- Moss marks growth and selection.
- Figtree remains the only typeface.
- Surfaces stay matte and square, with rules, bands, and spatial grouping instead of generic floating cards.
- The Rainline GG and black-flower marks remain. No sprout, leaf badge, gradient, glass, or broad soft shadow appears.

Every visible control must use this language. Existing selection grids may keep their data and keyboard behaviour, but their composition and controls must join the field record.

## Behaviour Preserved

- Draft restoration and local persistence.
- Postcode validation, request invalidation, and focus handling.
- At least one crop required before later setup steps.
- Optional plot, environment, and equipment choices.
- Profile save failure handling.
- Weather request cancellation and retry behaviour.
- Advice request cancellation, stale-response protection, saved advice, completion state, replacement confirmation, and storage warnings.
- No new external service, analytics product, account, cookie banner, or paid request.

## Accessibility

- Keep semantic headings, regions, labels, live states, and errors.
- Keep all controls keyboard reachable with a visible focus style.
- Keep touch targets at least 44px.
- Keep action before portrait in mobile DOM and reading order.
- Expose the portrait as a concise factual summary; mark its decorative geometry hidden.
- Do not rely on colour, geometry, or animation alone to communicate state.

## Components and Boundaries

- `GardenPortrait` owns deterministic profile-to-schematic rendering and its accessible summary.
- `SetupWorkbench` owns setup composition and stable navigation. `SetupWizard` retains state, validation, persistence, and postcode behaviour.
- `WeatherWorksurface` owns the joined forecast, path, portrait, and deterministic action layout.
- `Dashboard` retains weather and advice state, requests, persistence, and confirmation behaviour.
- `TimelineFilter` owns common and extended timeframe controls.
- `SeasonalCalendar` owns current-month alignment and continuation affordance.
- `Header` owns the compact weather chip.

## Verification and Approval Gate

Automated checks protect behaviour; they do not approve the design.

Before any push, provide:

1. A local desktop screenshot of first-run setup at 1440×900.
2. A local mobile screenshot of first-run setup at 390×844.
3. A local desktop screenshot of the weather-success dashboard at 1440×900.
4. A local mobile screenshot of the weather-success dashboard at 390×844.
5. Motion proof at the start, midpoint, and final state, or an equivalent short recording.
6. A production build and focused behavioural test results.
7. An explicit approval from the user.

The branch remains local until item 7. No push, merge, pull request, or production deployment is authorised by this spec.
