# Printable resource guides

Approved for publication on 22 September 2026. The Resources library provides a two-thirds-width desktop preview, responsive mobile layout, page selection, zoom, a native expanded-view dialog, and original PDF links. Resource selection resets the preview state.

Four A4 guides (two pages each): crop rotation; companion planting; vegetable storage; seed storage and lifespan. Compiled by GrowGuide UK. The calendar now separates sage indoor sowing, terracotta outdoor sowing, outlined planting and blue-green harvest, with different printed markings.

Each resource has a shareable page at `/resources/{id}`, using the ID in `data/resources.ts`. Choosing a resource updates the URL; opening or refreshing that link selects the same guide. Each page includes its own canonical URL, title, description and first-page preview image for social sharing. These pages are included in the sitemap automatically. `/resources` remains the library entrance.

Regenerate guide PDFs with `scripts/build-resource-guides.py` using ReportLab and the bundled DM fonts. Regenerate calendars with `scripts/build-growing-calendar.py`. Render previews directly from the finished PDFs and update dimensions/file sizes in `data/resources.ts`. Source references inside each guide are clickable; the generator contains the full URL register.

## Vegetable storage revision, 25 September 2026

The storage generator incorporates the author's V2 wording, with spelling and grammar corrections and the bitter-potato warning retained. Rebuilding from the source table fixes the displaced potato-row background from the Draw edit. The website keeps its existing download URL and refreshed previews; a genuine `growguide-uk-vegetable-storage-V2.pdf` is also provided. The displayed download size remains 356 KB, rounded from 364,766 bytes.

The original V2 was an OpenDocument drawing despite its `.pdf` filename. A local editable backup is retained in `output/pdf/growguide-uk-vegetable-storage-user-edits.odg`; it is not a website asset. In LibreOffice, use Export as PDF for a downloadable PDF. Future wording edits should also be applied to `storage()` in the generator so rebuilding preserves them.

## Editorial decisions

- Four-year rotation is a planning baseline, with return in year five and three intervening growing years. Botanical families and combined planning groups are distinguished. Clubroot and allium white rot need disease-specific management.
- Companion benefits are labelled as practical, habitat-based, trial-supported or traditional. The French marigold trial concerns glasshouse whitefly on tomatoes, not universal pest control.
- Vegetable storage distinguishes crop conditions and approximate quality windows from safety guarantees. Current Food Standards Agency guidance permits domestic fridge storage of potatoes. Fridge advice uses 0-5 C.
- Seed lifespan ranges are rough planning estimates, not expiry dates. Conditions and batch history matter. UK seed supplier guidance is cross-checked with seed-merchant and university references; overseas sowing calendars are not imported into UK advice. Garlic cloves, potato tubers and onion sets are excluded from the dry-seed lifespan chart.
- No scientific organisation is presented as the publisher or endorser. Attribution remains GrowGuide UK; references document the supporting evidence.
