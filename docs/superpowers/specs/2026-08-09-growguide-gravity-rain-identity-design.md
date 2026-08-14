# GrowGuide UK Gravity Rain Identity

## Goal

Give GrowGuide UK a sophisticated identity that cannot be confused with growguide.co.uk. Preserve the current product, privacy approach, and concise experience.

## Approved Direction

The approved world is **Gravity Rain**. The approved composition is **Rain to Action** at `.impeccable/mocks/gravity-rain-c.webp`.

Weather should appear to flow into the actions it changes. The interface uses rain paths, forecast lines, and a dark flower focus marker as functional visual language, not decoration.

## Identity

- Replace the sprout emoji and seedling image with a code-native **Rainline GG** mark.
- Build the mark from parallel blue rain strokes that bend into two interlocking, open G paths.
- Keep a compact, roughly square silhouette without enclosing it in a circle.
- Use the mark beside the `GrowGuide UK` wordmark and alone for favicons and social avatars.
- Never use a sprout, seedling, leaf-in-circle, or generic gardening badge.
- Use a single humanist sans family throughout; remove the current display serif.

## Visual System

- Garden ground: `#20312C`
- Pale mineral: `#E7E8E4`
- Sky blue: `#7DB8E6`
- Ember coral: `#E0645B`
- Moss veil: `#A6B49C`
- Black flower: `#0E0F10`

Use pale mineral as the main working surface and garden ground for the forecast ribbon, footer, and focused regions. Reserve blue for weather and primary actions, coral for protection or urgent states, and moss for planting or healthy states.

Surfaces should feel matte and precise. Use fine lines, restrained radii, and generous space. Avoid gradients, glass effects, cream-and-terracotta editorial styling, and grids of generic rounded cards.

## Site Composition

### Header

Use the Rainline GG mark, wordmark, a compact location-weather summary, and minimal navigation. The header must remain useful on small screens without adding a menu modal unless the site needs more destinations.

### Forecast Ribbon

Show the available weather forecast in one dark horizontal band. A restrained blue trajectory may connect the most relevant forecast change to affected guidance. Motion runs once and stops; reduced-motion users see the final line.

### Working Area

Translate the approved plot map into existing product data. Do not invent a measured garden layout. Use the grower’s conditions, plot size, equipment, and selected crops to create a calm plot-profile region.

Place the short priority list beside it on wide screens and before it on phones. Keep each priority as a spacious row with timing, reason, and one action. Preserve the current advice-generation controls and cost warnings.

### Seasonal Context

Restyle the existing seasonal calendar as the slim bottom timeline shown in the approved composition. Keep sow, plant, protect, and harvest states factual and derived from existing crop data.

## Social and Search Assets

Create one asset family from the Rainline GG mark:

- square social avatar;
- favicon and app icon;
- Open Graph image with the wordmark and weather-to-action motif;
- Ko-fi and Pinterest profile image.

Update metadata and accessible descriptions to remove the seedling reference.

## Interaction and Accessibility

- Keep setup, dashboard, advice, storage, and privacy behaviour unchanged.
- Keep user-facing text and pop-ups minimal.
- Preserve keyboard access, visible focus, semantic headings, and 44-pixel touch targets.
- Meet WCAG AA contrast for text and 3:1 contrast for focus and essential graphics.
- Keep content visible without animation or JavaScript effects.

## Responsive Behaviour

- Desktop: forecast ribbon, plot profile, and priorities share the first working view.
- Mobile: compact header, horizontally scrollable forecast, priorities first, plot profile second, seasonal timeline last.
- Simplify trajectories on phones; never shrink labels into illegibility.

## Implementation Boundaries

- Author the logo and trajectory graphics as SVG or CSS, not generated raster UI.
- Keep generated imagery out of core controls and text.
- Reuse the existing data and workflows; this is a visual rebrand, not a feature expansion.
- Keep the page fast and avoid continuous animation.

## Verification

- Test the logo, header, metadata, and accessible names.
- Run the existing focused and full test suites, TypeScript, and production build.
- Inspect desktop and mobile renders against the approved composition.
- Confirm no visible sprout emoji, seedling logo, or old metadata remains.

## Finish Review Rebuild Addendum — 14 August 2026

The approved rebuild keeps every working data path and re-derives only the dashboard composition.

### Weather must land on an action

- Convert existing `rainSoon` and `frostSoon` flags into one deterministic, local weather-action cue. This adds no AI call and no new user data.
- Rain cue: `Rain ahead — check the soil before watering.`
- Frost cue: `Frost risk — protect tender crops before temperatures drop.`
- When both flags are true, frost takes priority because protection is time-sensitive.
- On desktop, one authored blue SVG path must visibly run from the forecast ribbon to this cue inside the priority panel. On mobile, reduce it to a short local rainline so labels remain full width.
- Loading, unavailable-weather, and no-warning states must not invent a cue.

### First viewport composition

- Remove the dashboard and priority kicker labels.
- Keep the `Weather, translated into action.` heading compact and pair the postcode summary with `Edit setup` on the same line where space permits.
- Treat the forecast, factual plot profile, and priority panel as one working composition: forecast first, then the 60/40 plot/action split.
- Put the seasonal timeline immediately after that split and before the weather map.
- Make the map a compact secondary reference below the first working frame. Keep all existing overlay controls and map behaviour.

### Own-world completion

- Replace the Unicode flower and advice-error emoji with authored SVG or plain text.
- Use an authored black-flower SVG as the factual plot anchor.
- Migrate dashboard-visible loading, error, profile, and seasonal surfaces from compatibility aliases, rounded-card, and shadow-soft classes to the semantic Gravity Rain tokens and matte fine-line treatment.
- Preserve advice requests, confirmation, abort behaviour, cached tasks, checkboxes, storage warnings, privacy, setup, and all API payloads unchanged.
