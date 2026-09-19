# Tomato varieties: first release

The first release contains `/varieties` and `/varieties/tomatoes`. The hub lists only the published tomato guide; courgettes, spring onions and cucumbers remain the next stage. The main navigation is unchanged.

The tomato guide uses the existing cream, sage and serif design. Four cards explain different needs, followed by an accessible comparison table, UK timing notes, sources and a return to the personalised guide. One internal prompt appears above the tomato task group when the visible tasks include sowing or planting. It does not appear for care, harvest, protection or weather warnings alone.

Each card now includes the common variety name and italic Latin species name, an “In general” description, conditions, height and spread, container suitability, difficulty, separate sowing/planting/harvest times, and pests and diseases. Planting refers to moving young plants to their final position. Dates are approximate UK guidance, qualified by frost risk and greenhouse protection. Mature size is distinguished from planting spacing. The comparison includes mature size; shared health advice distinguishes blossom-end rot from infectious disease.

## Retailer links

The owner chose Thompson & Morgan as the starting retailer, using ordinary links for now. All four cards link to its named seed listings. These do not generate affiliate income. No prices or live stock claims are displayed.

The shared catalogue is `data/varieties.ts`. Each retailer has `name`, `url` and an optional `affiliateUrl`. To enable an agreed affiliate programme, replace the retailer details as necessary and set an approved HTTPS deep link for the exact named seed variety. The seed link then receives a visible affiliate label and `rel="sponsored noopener noreferrer"`; the page automatically displays the supplied affiliate disclosure above the cards. Invalid affiliate URLs fall back to the ordinary listing. Update the privacy copy when affiliate links go live.

## Sources checked on 18 September 2026

- [Gardener’s Delight seeds](https://www.thompson-morgan.com/p/tomato-gardeners-delight-seeds/277TM): cordon, cherry fruit, greenhouse/outdoor cultivation, February–April sowing and July–October harvest.
- [Sungold F1 seeds](https://www.thompson-morgan.com/p/tomato-sungold-f1-seeds/840TM): sweet orange cherry fruit, cordon habit, greenhouse/outdoor cultivation and July–October harvest.
- [Tumbling Tom Red seeds](https://www.thompson-morgan.com/p/tomato-tumbling-tom-red-seeds/515TM): trailing bush, baskets, no side-shoot removal, February–April sowing and July–September harvest.
- [Crimson Crush F1 seeds](https://www.thompson-morgan.com/p/tomato-crimson-crush-f1-seeds/wkc9370TM): hybrid cordon, blight resistance, outdoor and greenhouse suitability, July–September harvest. The listing was out of stock when checked; the guide links to it without promising availability.
- [Thompson & Morgan tomato growing guide](https://www.thompson-morgan.com/how-to-grow-tomatoes): growing conditions, aphids, whitefly, blight and watering-related fruit disorders. Product listings provide the Latin name and mature sizes: up to 2m × 50cm for the three cordons; 30cm × 30cm for Tumbling Tom Red. Sungold’s listing specifies tobacco mosaic virus and fusarium wilt resistance.
- [Suttons blight guidance](https://hub.suttons.co.uk/gardening-advice/tomatoes-that-beat-blight): disease-resistance context.

Retailer seed listings were accessible at review time. Availability is left to the retailer; it is not monitored. Difficulty ratings are editorial estimates of care requirements, not horticultural certifications. All dates are approximate and qualified by the sowing-location notes.

## Measurement

The existing Vercel Web Analytics installation records route page views. Two custom events are added:

| Event | Properties | Meaning |
| --- | --- | --- |
| `seed_link_click` | `crop`, `variety`, `retailer`, `affiliate` | A named seed link was activated; filter `affiliate=true` after affiliate links are configured. |
| `grow_guide_return` | `crop` | The home guide was opened within 24 hours of a variety guide in the same tab. |

Return attribution uses a session-storage marker containing only crop and visit time. It is consumed on returning home and ignored after 24 hours. It does not measure return from a retailer tab, cross-device visits, purchases or long-term retention. Storage and analytics failures do not block navigation. No garden profile, postcode, coordinates or affiliate URL are added to custom events.

Verify custom-event availability in the deployment’s Vercel Analytics plan and dashboard when deploying. Local tests verify event dispatch, not ingestion by a live analytics account. Production deployment follows the existing GitHub-to-Vercel workflow when changes are pushed to main.

## Expanding after review

Confirm the tomato design and copy length first. For each next crop, verify four distinct uses and exact seed listings, reuse the card fields and comparison pattern, then add the route to the sitemap and the crop-specific prompt. Extend return-attribution’s published crop allowlist at the same time. Keep routine advice free of retailer links.
