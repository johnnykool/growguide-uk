# Printable resource guides

Approved for publication on 22 September 2026. The Resources library provides a two-thirds-width desktop preview, responsive mobile layout, page selection, zoom, a native expanded-view dialog, and original PDF links. Resource selection resets the preview state.

Four A4 guides (two pages each): crop rotation; companion planting; vegetable storage; seed storage and lifespan. Compiled by GrowGuide UK. The calendar now separates sage indoor sowing, terracotta outdoor sowing, outlined planting and blue-green harvest, with different printed markings.

Regenerate guide PDFs with `scripts/build-resource-guides.py` using ReportLab and the bundled DM fonts. Regenerate calendars with `scripts/build-growing-calendar.py`. Render previews directly from the finished PDFs and update dimensions/file sizes in `data/resources.ts`. Source references inside each guide are clickable; the generator contains the full URL register.

## Editorial decisions

- Four-year rotation is a planning baseline, with return in year five and three intervening growing years. Botanical families and combined planning groups are distinguished. Clubroot and allium white rot need disease-specific management.
- Companion benefits are labelled as practical, habitat-based, trial-supported or traditional. The French marigold trial concerns glasshouse whitefly on tomatoes, not universal pest control.
- Vegetable storage distinguishes crop conditions and approximate quality windows from safety guarantees. Current Food Standards Agency guidance permits domestic fridge storage of potatoes. Fridge advice uses 0-5 C.
- Seed lifespan ranges are rough planning estimates, not expiry dates. Conditions and batch history matter. UK seed supplier guidance is cross-checked with seed-merchant and university references; overseas sowing calendars are not imported into UK advice. Garlic cloves, potato tubers and onion sets are excluded from the dry-seed lifespan chart.
- No scientific organisation is presented as the publisher or endorser. Attribution remains GrowGuide UK; references document the supporting evidence.
