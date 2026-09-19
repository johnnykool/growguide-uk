# Starter varieties collection

The approved tomato layout now serves all four starter crop guides: tomatoes, courgettes, spring onions and cucumbers. Each has four varieties, Latin names, four-sentence introductions explaining why to choose them, conditions, size, containers, difficulty, sowing, planting, harvest, pest notes, limitations and ordinary Thompson & Morgan seed links. The hub links to all four guides. The main navigation stays as it was.

The full page template is `components/CropVarietyGuide.tsx`; page-level copy is in `data/variety-guides.ts`. The twelve new cards are in `data/starter-varieties.ts`, alongside the original tomato data in `data/varieties.ts`. The small `lib/variety-crops.ts` registry supplies contextual prompts and the analytics allowlist without sending the full editorial catalogue to clients.

## Source checks: 19 September 2026

All twelve new exact seed listings were opened in the browser and offered an add-to-basket control without an out-of-stock notice at review time. This is a dated check, not a live availability claim. Product calendar highlights were read from the rendered month elements. No prices or stock status are stored in the guide.

| Crop | Named seed listing | Reason for selection |
| --- | --- | --- |
| Courgette | [Defender F1](https://www.thompson-morgan.com/p/courgette-defender-f1-seeds/432TM) | Open habit; cucumber mosaic virus resistance |
| Courgette | [Black Beauty](https://www.thompson-morgan.com/p/courgette-black-beauty-organic-seeds/w79851TM) | Traditional dark fruit; organic seed packet |
| Courgette | [Sure Thing](https://www.thompson-morgan.com/p/courgette-sure-thing-seeds/tka2672TM) | Fruit set without insect pollination |
| Courgette | [Parador F1](https://www.thompson-morgan.com/p/courgette-parador-f1-seeds/318TM) | Yellow fruits; early cropping |
| Spring onion | [White Lisbon](https://www.thompson-morgan.com/p/spring-onion-white-lisbon/528TM) | Familiar quick salad crop |
| Spring onion | [Ishikura](https://www.thompson-morgan.com/p/bunching-onion-ishikura-kew-vegetable-seed-collection/WKC9732TM) | Non-bulbing stems; harvest young or larger |
| Spring onion | [Performer](https://www.thompson-morgan.com/p/spring-onion-performer-seeds/289TM) | Winter hardiness and extended season |
| Spring onion | [Apache](https://www.thompson-morgan.com/p/spring-onion-apache-seeds/794TM) | Purple-red colour for salads |
| Cucumber | [Marketmore](https://www.thompson-morgan.com/p/cucumber-marketmore-veg-patch-saver-seeds/wkf4385TM) | Outdoor ridge type |
| Cucumber | [Carmen F1](https://www.thompson-morgan.com/p/cucumber-carmen-f1-hybrid/538TM) | Long greenhouse fruit; specified disease resistance |
| Cucumber | [Mini Munch F1](https://www.thompson-morgan.com/p/cucumber-mini-munch-f1-agm-collection-seeds/tr01092TM) | Small fruits on a tall greenhouse plant |
| Cucumber | [Quick Snack F1](https://www.thompson-morgan.com/p/cucumber-quick-snack-f1-seeds/wkf7214TM) | Dwarf plant for small spaces |

Sure Thing, Parador and Apache replace the preliminary Parthenon, Gold Rush and North Holland Blood Red suggestions with verified retailer listings serving similar needs. Quick Snack replaces Telegraph Improved to add a genuinely compact cucumber alongside Carmen’s greenhouse role. Marketmore is named exactly as sold; no unsupported “76” suffix is added.

Product calendars: courgettes April–June sowing, July–October harvest (Parador June–October); White Lisbon and Performer March–September sowing, April–October main harvest; Ishikura and Apache March–July sowing, June–October main harvest; Marketmore March–June sowing, July–September harvest; Carmen and Mini Munch February–May sowing, June–September and June–October harvest respectively; Quick Snack March–June sowing, July–October harvest. Guide prose narrows these broad calendars by protection and local weather, making heated starts and overwintered crops explicit.

Botanical names and mature dimensions follow each listing. Ishikura and Performer are *Allium fistulosum*; White Lisbon and Apache are *Allium cepa*. The Ishikura listing has conflicting boilerplate about bulbs, so the guide follows its variety-specific non-bulbing description and omits that boilerplate. Established onion spread is distinguished from spacing for young salad crops. Sure Thing’s exact seed listing does not label it F1, so neither does the guide.

## Growing references and editorial judgments

- [Thompson & Morgan courgette guide](https://www.thompson-morgan.com/how-to-grow-courgettes): frost-sensitive timing, containers, pollination, harvesting and mildew.
- [Thompson & Morgan spring onion guide](https://www.thompson-morgan.com/how-to-grow-spring-onions): successive sowings, direct sowing, containers and overwintering.
- [Thompson & Morgan cucumber guide](https://www.thompson-morgan.com/how-to-grow-cucumbers): greenhouse/outdoor distinction, warm starts, planting, flower management.
- [Garden Organic allium pests](https://www.gardenorganic.org.uk/news/allium-pests-to-look-out-for-this-summer): onion fly, onion thrips and protective mesh.
- [Onion masterclass](https://blog.thompson-morgan.com/onions-masterclass-best-expert-content/): white rot persistence and insect mesh.

Kitchen-use suggestions, difficulty, container practicality and weather-qualified planting dates are editorial guidance. Supplier yield guarantees and broad immunity claims are not repeated. The tomato guide retains its original review date; see `tomato-varieties.md` for its source record.

## Navigation, measurement and photographs

One internal “Choosing your seeds?” panel appears per relevant visible crop group containing sowing or planting tasks. Care, harvest, protection and weather warnings alone do not trigger it. Singular/plural crop names are accepted. Retailer links appear only on named variety cards.

All four crop identifiers are allowed for the existing same-tab, 24-hour return attribution. Existing page-view tracking and seed-click properties remain in use. No claim is made that events have been verified in the live Vercel dashboard.

No individual variety photos have been added. Their identity and reuse permission must be established first. The existing general tomato photograph remains; new crop pages use the same typography, cards and comparison layout with text introductions.
