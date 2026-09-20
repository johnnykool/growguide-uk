# Free growing calendar

Two printable PDFs for GrowGuide UK:

- `public/downloads/growguide-uk-growing-calendar-a4.pdf`: two A4 portrait pages for home printers.
- `public/downloads/growguide-uk-growing-calendar-a3.pdf`: one A3 portrait wall chart.

The footer offers both downloads at `/downloads/growguide-uk-growing-calendar-a4.pdf` and `/downloads/growguide-uk-growing-calendar-a3.pdf`. Matching review copies are in `output/pdf/`.

Print at actual size on the matching paper size. All content sits within normal printer margins. White paper, restrained ivory panels, and muted sage, clay and oat marks reduce ink coverage. Different track positions and additional mark shapes distinguish activities when printed in greyscale. Fonts are embedded; text and chart geometry remain sharp when enlarged.

## Brand and layout

The original GrowGuide UK logo, DM Serif Display and DM Sans are used with the site palette. The photographed chart is a reference for the calendar concept; this edition uses the site's own 32 vegetables and herbs, rather than a transcription of the photograph. Each crop has four separate activity tracks, readable January to December, and row/plant spacing columns in centimetres.

## Content and attribution

Base data: `data/vegetables.ts`, as read at build time. The PDF presents broad planning windows, not a postcode forecast or a promise of harvest from every sowing. Seed packets, local frost dates, cultivar and growing conditions take precedence. The live growing database is unchanged.

Print-edition clarifications are explicit in `scripts/build-growing-calendar.py`:

- Potatoes and garlic use the planting track, not outdoor seed sowing.
- Broccoli is labelled calabrese, rather than winter sprouting broccoli.
- Cabbage is scoped to summer/autumn types, removing the separate spring-cabbage sowing cycle. Transplanting is April-June.
- Lettuce is scoped to spring/summer sowings, with indoor sowing in February-March and transplanting successive batches March-September.
- Cucumber is scoped to outdoor ridge types: indoor sowing April-May, planting out June, and 90cm spacing.
- Onion includes spring sets and seed-grown plants, with planting March-May.
- Broad-bean spacing is shown for single rows (45cm), avoiding ambiguity over double rows. Runner-bean spacing distinguishes within-pair rows from the 150cm gap between pairs.
- Dill replaces rosemary in the printable edition: direct sowing April-July, harvesting June-October, 30cm between rows and 20cm between plants. Sow small batches for continued harvests; the chart covers the outdoor growing season.
- Chive harvests are labelled as applying to established plants. A dash in row spacing means the base data does not specify one universal row distance.

Calendar attribution: Compiled by GrowGuide UK.

## Rebuilding

Run `python3 scripts/build-growing-calendar.py` with ReportLab installed. The builder resolves paths relative to the project, reads the source crop data, embeds the supplied brand fonts and regenerates both review and public copies. Font copyright/license metadata is retained alongside the fonts in `scripts/calendar-assets/`.

After changes, render and inspect all PDF pages. The print-edition spacing and crop scope overrides are intentionally explicit and should be reviewed when updating the source dataset.
