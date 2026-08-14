---
name: GrowGuide UK — Gravity Rain
description: A matte weather-to-action system for practical UK growing guidance.
colors:
  garden-ground: "#20312C"
  pale-mineral: "#E7E8E4"
  sky-blue: "#7DB8E6"
  rain-ink: "#285F87"
  ember: "#E0645B"
  ember-ink: "#A83F3A"
  moss-veil: "#A6B49C"
  black-flower: "#0E0F10"
typography:
  display:
    fontFamily: "Figtree, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.11
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Figtree, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Figtree, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Figtree, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Figtree, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.12em"
rounded:
  square: "0px"
  btn: "3px"
  card: "4px"
  full: "9999px"
spacing:
  hairline: "1px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
  touch: "44px"
components:
  button-primary:
    backgroundColor: "{colors.rain-ink}"
    textColor: "{colors.pale-mineral}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "12px 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.garden-ground}"
    textColor: "{colors.pale-mineral}"
    rounded: "{rounded.square}"
  button-secondary:
    backgroundColor: "{colors.pale-mineral}"
    textColor: "{colors.garden-ground}"
    rounded: "{rounded.square}"
    padding: "8px 16px"
    height: "44px"
  field:
    backgroundColor: "{colors.pale-mineral}"
    textColor: "{colors.garden-ground}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "12px 16px"
    height: "44px"
  matte-panel:
    backgroundColor: "{colors.pale-mineral}"
    textColor: "{colors.garden-ground}"
    rounded: "{rounded.square}"
    padding: "20px"
  forecast-ribbon:
    backgroundColor: "{colors.garden-ground}"
    textColor: "{colors.pale-mineral}"
    rounded: "{rounded.square}"
    padding: "20px"
---

# Design System: GrowGuide UK — Gravity Rain

## Overview

**Creative North Star: "Gravity Rain"**

Gravity Rain is a calm, practical working system in which local weather visibly bends the interface toward the action it changes. Its signature composition, Rain to Action, treats forecast paths, timing lines, and a dark flower marker as information architecture rather than decoration. The system feels sophisticated through precision: one humanist sans, matte surfaces, fine boundaries, restrained colour, and generous working space.

The interface is quiet but not passive. Dark forecast regions establish local conditions; blue motion traces a real consequence; coral and moss identify protection and growth states; the factual plot profile and short priority list complete the thought. Copy stays concise, plain, and encouraging. Setup, privacy, loading, error, and empty states explain only what is needed for the next decision, with no invented claims or decorative gardening language.

**Key Characteristics:**

- Weather visibly leads to a useful action.
- Matte mineral surfaces are structured by fine lines, not floating cards.
- A single humanist sans keeps operational information direct.
- Authored Rainline GG and black-flower marks replace generic gardening symbols.
- Colour is semantic: blue for weather/action, coral for protection/urgency, moss for planting/healthy states.
- Mobile keeps priorities before plot context and never compresses labels into illegibility.

## Colors

The palette pairs a cool mineral canvas with deep garden green, two functional rain blues, sparing ember coral, muted moss, and one near-black authored marker.

### Primary

- **Rain Ink:** The primary action colour for filled buttons, selected controls, harvest states, links, and map markers.
- **Sky Blue:** Weather information, forecast symbols, rain trajectories, action-link boundaries, and branded marks on dark regions.

### Secondary

- **Moss Veil:** Planting, sowing, healthy states, selected setup choices, and quiet supportive fills.

### Tertiary

- **Ember:** Protection, current-time emphasis, warning rails, and urgent state graphics.
- **Ember Ink:** Readable warning and error text on Pale Mineral.

### Neutral

- **Garden Ground:** Primary text, strong focus indicators, fine-line borders at reduced opacity, the forecast ribbon, loading actions, and the footer.
- **Pale Mineral:** The default page, panel, field, and control surface; it also reverses to text on Garden Ground.
- **Black Flower:** The factual plot anchor and authored focal marker; keep it near-black rather than repurposing it as general body text.

### Named Rules

**The Weather Carries Blue Rule.** Use Rain Ink for action and Sky Blue for weather paths and symbols; blue must explain local conditions or what to do next.

**The Signal Stays Singular Rule.** Coral identifies protection, error, or time-sensitive risk; moss identifies growth and selection. Do not use either as general decoration.

## Typography

**Display Font:** Figtree (with sans-serif fallback)

**Body Font:** Figtree (with sans-serif fallback)

**Label Font:** Figtree (with sans-serif fallback)

**Character:** Figtree is a friendly, workmanlike humanist sans: clear enough for forecasts and forms, warm enough for an encouraging gardening service. Weight and spacing create hierarchy without introducing a decorative display face.

### Hierarchy

- **Display** (600, 2.25rem, 1.11, -0.03em): Setup and major page titles; privacy rises from 2.25rem to 3rem on larger screens.
- **Headline** (600, 1.875rem, 1.25, -0.03em): The dashboard promise and compact surface introductions; it reduces to 1.5rem on phones.
- **Title** (600, 1.5rem, 1.25): Primary panel and step headings.
- **Body** (400, 1rem, 1.6): Instructions, privacy explanations, summaries, and task detail. Reading copy is capped around 70 characters.
- **Label** (600, 0.75rem, 0.12em, uppercase): Forecast days, plot facts, crop group labels, and timing metadata. Operational labels remain legible and short.

### Named Rules

**The One Workhorse Rule.** Use Figtree throughout; do not introduce a serif, script, or ornamental gardening face.

**The Minimal Copy Rule.** Lead with the next decision, use plain UK English, and omit kickers, repeated reassurance, and explanatory copy that does not change an action.

## Layout

The global shell uses a centered 80rem container with 1rem phone gutters and 1.5rem gutters from the small breakpoint. Setup narrows to 48rem; privacy reading content sits within 64rem and keeps paragraphs to about 70 characters. The repeated spacing rhythm is 4, 8, 12, 16, 20, 24, and 32 pixels, with 44 pixels reserved as the minimum interactive height.

The dashboard opens with a compact heading and profile summary, then the forecast ribbon, then one working composition. At 1024px and above, the plot profile and priority panel form a 60/40 split (`3fr 2fr`): plot on the left, actions on the right, separated by a fine vertical line. The seasonal timeline follows immediately, with the weather map as a compact secondary reference below the first working frame.

On phones, the forecast scrolls horizontally, the action panel comes before the plot profile, timeline controls collapse to a native select, and the seasonal calendar remains horizontally scrollable at a readable fixed minimum width. The desktop trajectory is replaced by a short local blue boundary above the action region. Setup controls stack before 640px; privacy rows become a two-column label-and-copy layout from 768px.

**The Action Before Context Rule.** On narrow screens, show what needs doing before the factual plot profile; never preserve desktop column order at the cost of the next useful action.

## Elevation & Depth

Gravity Rain is flat and matte by default. Core dashboard, setup, privacy, forecast, and navigation surfaces use tonal reversal, one-pixel borders, rules, left rails, and whitespace instead of shadows. The theme still defines a low matte shadow (`0 8px 24px rgb(32 49 44 / 0.08)`) and a one-pixel soft edge (`0 1px 0 rgb(32 49 44 / 0.14)`) for compatibility, but the rebuilt Gravity Rain surfaces do not apply them.

### Named Rules

**The Matte by Default Rule.** Keep working surfaces flat at rest; establish depth with Garden Ground boundaries, dark/light reversal, and spatial grouping rather than floating card shadows.

## Shapes

The dominant form is square and architectural: panels, fields, task rows, buttons, map controls, setup choices, and forecast bands use straight edges. Fine one-pixel borders and dividers carry most grouping, with stronger two- or four-pixel rails reserved for selected, weather-linked, warning, and priority states. The configured 3px button and 4px card radii are restrained compatibility tokens, not a reason to round every surface. Full circles are limited to data points, cue dots, and map markers.

The Rainline GG is an authored 64-unit SVG made from two open, interlocking G-shaped rain strokes with round caps and joins. The black-flower mark is an authored 32-unit silhouette with five petals and one centre, used as the plot anchor. Neither mark is enclosed in a badge.

**The Fine Edge Rule.** Start square and use one-pixel rules; add curvature only when the shape itself communicates a point, marker, or path.

## Components

Components are precise and action-first. Their default state is quiet; selected, warning, and weather-linked states add a strong semantic boundary instead of decorative treatment.

### Buttons

- **Shape:** Square-edged in shipped core surfaces, at least 44px high, with 12px vertical and 20–24px horizontal padding for primary actions.
- **Primary:** Rain Ink with Pale Mineral text; loading actions reverse to Garden Ground. Primary actions fill the available phone width and shrink to content width on larger screens.
- **Hover / Focus:** Hover shifts Rain Ink to Garden Ground. Keyboard focus is a 2px Garden Ground ring with a 2px Pale Mineral offset; dark-footer controls use Sky Blue for the ring and offset against Garden Ground.
- **Secondary:** Pale Mineral with a reduced-opacity Garden Ground border; hover may reverse to Garden Ground or add a light Moss Veil wash depending on consequence.
- **Disabled:** Moss Veil at reduced strength with Garden Ground text, a not-allowed cursor, and no false action emphasis.

### Chips

- **Style:** Setup choices are square bordered controls with Pale Mineral surfaces; selected choices use a Moss Veil fill and a full Garden Ground boundary.
- **State:** Timeline options use a Rain Ink two-pixel selected ring; phone timelines become a labelled native select rather than a cramped row.

### Cards / Containers

- **Corner Style:** Square on all shipped Gravity Rain working panels.
- **Background:** Pale Mineral for working content; Garden Ground only for forecast, focus, loading, and footer regions.
- **Shadow Strategy:** No shadow on the rebuilt system; use fine Garden Ground borders and internal dividers.
- **Border:** One-pixel Garden Ground at 20–40% opacity, with a four-pixel semantic rail for priority or error states.
- **Internal Padding:** 20px on phones, commonly 24px from the small breakpoint.

### Inputs / Fields

- **Style:** Pale Mineral fill, one-pixel Garden Ground border at about 45% opacity, square corners, 44px minimum height, and 12–16px horizontal padding.
- **Focus:** A 2px Garden Ground ring with a 2px Pale Mineral offset; grouped checkbox controls use the same focus-within treatment.
- **Error / Disabled:** Ember Ink carries error copy and `aria-invalid`; disabled actions use muted Moss Veil and retain readable Garden Ground text.

### Navigation

The sticky header is a single compact home link: 32px Rainline GG, a 1.25rem semibold wordmark, and Rain Ink on “UK”. It sits on Pale Mineral with a fine bottom rule and a 44px minimum target. The footer reverses to Garden Ground, repeats a smaller Rainline GG, and keeps only cost support and privacy destinations.

### Forecast Ribbon

The forecast is a full-width Garden Ground band with Pale Mineral readings, Moss Veil labels, and Sky Blue weather symbols. Current conditions keep a compact leading block; the seven-day list scrolls horizontally and gives each day at least 5.5rem. Loading and unavailable states remain Pale Mineral matte panels and never fabricate a weather-linked action.

### Rain-to-Action Path

When real weather contains a rain or frost warning, one authored Sky Blue dashed SVG trajectory runs from the forecast ribbon toward a deterministic action cue. Frost takes priority over rain because protection is time-sensitive. On large screens the masked stroke draws once over 900ms with `cubic-bezier(0.16, 1, 0.3, 1)` and stops; on phones, a short blue top boundary preserves label width. With `prefers-reduced-motion: reduce`, animation is removed and the final visible path remains. Loading, error, no-weather, and no-warning states render no cue and no path.

### Task Rows and Seasonal Timeline

Task rows use a one-pixel Garden Ground ring and a four-pixel semantic rail: Ember for urgent protection, Moss Veil for sowing/planting/harvest, and Sky Blue for ordinary weather-aware work. Checkboxes have a 44-by-44-pixel touch wrapper around a 24px control and use an authored SVG tick. The seasonal timeline stays slim and factual: Moss Veil for sow/plant, Rain Ink for harvest, Pale Mineral for dormant, and an Ember ring for the current month.

### Authored Marks

Use Rainline GG beside the wordmark and alone only with an accessible title. Use the black-flower mark as the plot anchor. Both SVG components are decorative by default (`aria-hidden`) and create a unique `<title>` relationship when meaningfully named.

**The Rain Must Land Rule.** Never draw a weather trajectory unless it terminates at a real, deterministic action generated from available weather state.

**The Authored Marks Rule.** Never substitute a sprout, seedling, leaf-in-circle, Unicode flower, or generic gardening badge for Rainline GG or the black-flower anchor.

## Do's and Don'ts

### Do:

- **Do** use Pale Mineral as the working canvas and Garden Ground for structure, focus, and dark functional bands.
- **Do** preserve the forecast → action → plot → season reading order, adapting actions before plot on phones.
- **Do** keep every interactive target at least 44px high, keyboard reachable, clearly labelled, and visibly focused.
- **Do** keep essential content visible without animation; respect reduced motion by showing the final path without drawing it.
- **Do** write short, plain, factual copy and expose errors, status changes, required fields, and selected states semantically.
- **Do** use authored SVG for identity, weather symbols, checkmarks, and plot markers.

### Don't:

- **Don't** use gradients, glass effects, floating generic card grids, broad soft shadows, or cream-and-terracotta editorial styling.
- **Don't** introduce a display serif, ornamental gardening type, or decorative text that competes with the next action.
- **Don't** use blue, coral, or moss without their weather/action, protection/error, or planting/selection meaning.
- **Don't** invent measured plot geometry, weather cues, claims, pop-ups, or additional explanatory copy.
- **Don't** shrink forecast, timeline, or form labels to preserve a desktop layout on phones; scroll, stack, or switch control form instead.
- **Don't** animate continuously or make an action, cue, label, or path depend on animation or JavaScript effects to remain understandable.
