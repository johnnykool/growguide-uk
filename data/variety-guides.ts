import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { VarietyCrop } from "@/lib/variety-crops";
import { TOMATO_VARIETIES, VARIETY_REVIEW_DATE, type CropVariety } from "./varieties";
import { COURGETTE_VARIETIES, SPRING_ONION_VARIETIES, CUCUMBER_VARIETIES } from "./starter-varieties";

export interface VarietyGuide {
  slug: VarietyCrop;
  name: string;
  singular: string;
  heading: string;
  description: string;
  summary: string;
  intro: [string, string];
  image?: { src: string; alt: string };
  varieties: CropVariety[];
  comparisonIntro: string;
  timing: string[];
  health: string[];
  growingGuide: string;
  additionalSource?: { url: string; label: string };
  reviewDate: string;
}

export const TOMATO_GUIDE: VarietyGuide = {
  slug: "tomatoes", name: "Tomatoes", singular: "tomato",
  heading: "Tomato varieties for your growing space",
  description: "Compare Gardener’s Delight, Sungold F1, Tumbling Tom Red and Crimson Crush F1 for outdoor growing, greenhouses and containers.",
  summary: "A familiar cherry, a sweet orange tomato, a trailing basket variety and a blight-resistant outdoor option. Four different starting points for your next crop.",
  intro: [
    "A sunny basket and a greenhouse border need different plants. Choose the growing habit first, then the flavour and fruit you’d like to pick.",
    "These four varieties each have a different strength. All need warmth and sun; a sheltered outdoor spot matters, especially in cooler parts of the UK.",
  ],
  image: { src: "/images/veg/tomato.jpg", alt: "Freshly harvested red cherry tomatoes" },
  varieties: TOMATO_VARIETIES,
  comparisonIntro: "Short on room? Start with the growth habit. A pot can hold a tall tomato, but it still needs support.",
  timing: [
    "Start seeds indoors. For greenhouse crops, late February to mid-March is a useful guide; for outdoor crops, aim for late March to early April. An indoor sowing date does not mean the plant can spend its whole life on a windowsill.",
    "“Planting time” means moving young plants into their final growing position. The dates assume an unheated greenhouse or outdoor growing; heated greenhouses can start earlier. Harden plants off and wait until frost risk has passed before moving them outdoors. Local conditions can shift all these dates, so follow the seed packet and your weather forecast.",
    "A cordon is a tall plant grown on a support, usually as one main stem. A bush branches naturally and keeps its side shoots. F1 means a first-generation hybrid; saved seed may not grow into the same type.",
  ],
  health: [
    "Check young growth and leaf undersides for pests, and ventilate greenhouses. Blight is a particular concern in warm, wet conditions, even on resistant varieties.",
    "Split fruit and blossom-end rot can be linked to uneven watering. Blossom-end rot is a growing disorder, not an infectious disease; keeping the compost evenly moist helps.",
  ],
  growingGuide: "https://www.thompson-morgan.com/how-to-grow-tomatoes",
  reviewDate: VARIETY_REVIEW_DATE,
};

export const COURGETTE_GUIDE: VarietyGuide = {
  slug: "courgettes", name: "Courgettes", singular: "courgette",
  heading: "Courgette varieties for a summer of picking",
  description: "Compare Defender F1, Black Beauty, Sure Thing and Parador F1 for UK vegetable beds, patio pots and growing under cover.",
  summary: "Dependable green fruits, a traditional favourite, a variety that sets without insect pollination and a golden-yellow crop. Choose for your growing conditions and your kitchen.",
  intro: [
    "One well-grown courgette can keep you picking for weeks. Choose the fruit you enjoy cooking, then give the plant the space and regular attention it needs.",
    "These four bush varieties suit different priorities, from familiar green courgettes to fruit set under cover. All are summer crops that need warmth, sun and protection from frost.",
  ],
  image: { src: "/images/veg/courgette.jpg", alt: "Dark green courgettes freshly picked with their flowers attached" },
  varieties: COURGETTE_VARIETIES,
  comparisonIntro: "All four are bush varieties with a generous spread. Compare fruit colour and pollination needs before deciding where to plant.",
  timing: [
    "Start seeds indoors in April or May, or sow outside in warm soil from late May to June. Move young plants out after gradually hardening them off and once frost risk has passed. In a colder or exposed garden, that may mean waiting until June.",
    "June harvests need an early, protected start; July is a more realistic first picking for many gardens. Pick young fruits regularly and continue while plants remain productive, usually until autumn cold or frost ends the crop.",
    "Most courgettes need insects to pollinate their flowers. Sure Thing is parthenocarpic, meaning it can set fruit without pollination. F1 identifies a first-generation hybrid; saved seed may not produce the same variety.",
  ],
  health: [
    "Check seedlings for slug damage and look beneath leaves for aphids. Powdery mildew can appear as a white coating later in the season; keep roots evenly moist and allow air to circulate between plants.",
    "Small fruits that stop growing may reflect poor pollination or growing stress. For varieties needing pollination, let insects reach the flowers once plants are established. Disease resistance reduces risk but does not replace regular checks.",
  ],
  growingGuide: "https://www.thompson-morgan.com/how-to-grow-courgettes",
  reviewDate: "19 September 2026",
};

export const SPRING_ONION_GUIDE: VarietyGuide = {
  slug: "spring-onions", name: "Spring onions", singular: "spring onion",
  heading: "Spring onion varieties for fresh, regular harvests",
  description: "Compare White Lisbon, Ishikura, Performer and Apache for fresh salads, long stems, overwintering and colourful UK container crops.",
  summary: "A quick white salad onion, long stems for stir-fries, a hardy choice for a longer season and purple-red colour. Small sowings fit into beds and containers.",
  intro: [
    "A few spring onions can lift a salad, soup or stir-fry. Growing your own lets you choose the stem, colour and picking season that suit the way you cook.",
    "These four varieties work in modest spaces. Some are bulb-forming onions harvested young; others are non-bulbing types that can stay in the garden longer.",
  ],
  varieties: SPRING_ONION_VARIETIES,
  comparisonIntro: "For a quick salad crop, sow thinly and harvest young. Give Ishikura and Performer more room if you intend to keep them as established plants.",
  timing: [
    "Sow small batches through the variety’s stated season. Most spring onions are sown where they will grow, so there is no separate planting-out date. If starting in modules, transplant once the roots hold the compost together and the plants are hardened off.",
    "White Lisbon can be ready in about eight weeks in good growing weather. This is not a winter timetable: late sowings grow slowly and are usually kept for spring. April harvests generally come from plants established the previous season.",
    "The mature spread describes an established plant, especially for perennial bunching onions. It is not the spacing needed for a closely sown row that will be pulled young. Follow the seed packet for your intended harvest size.",
  ],
  health: [
    "Onion fly and thrips can damage alliums; inspect stems and leaves and use insect mesh where flies are a recurring problem. Keep the crop weed-free and avoid waterlogged compost.",
    "White rot is a persistent soil disease. If it has affected an allium bed, grow in containers of fresh compost rather than moving onions around the same affected soil. Remove diseased plants and avoid transferring contaminated soil on tools.",
  ],
  growingGuide: "https://www.thompson-morgan.com/how-to-grow-spring-onions",
  additionalSource: { url: "https://blog.thompson-morgan.com/onions-masterclass-best-expert-content/", label: "Onion growing and white rot guidance" },
  reviewDate: "19 September 2026",
};

export const CUCUMBER_GUIDE: VarietyGuide = {
  slug: "cucumbers", name: "Cucumbers", singular: "cucumber",
  heading: "Cucumber varieties for your growing space",
  description: "Compare Marketmore, Carmen F1, Mini Munch F1 and Quick Snack F1 for UK outdoor beds, greenhouses and small containers.",
  summary: "An outdoor ridge cucumber, long greenhouse fruits, small snacks from a tall plant and a compact plant for pots. Start with where you can grow them.",
  intro: [
    "The right cucumber starts with the right growing place. A sheltered outdoor bed, a warm greenhouse and a small patio pot each call for a different plant.",
    "Choose outdoor or greenhouse suitability first, then the size of fruit you enjoy. Small fruits do not always mean a small plant, so check the mature size as well.",
  ],
  varieties: CUCUMBER_VARIETIES,
  comparisonIntro: "Marketmore suits outdoor beds; Carmen and Mini Munch need greenhouse warmth. Quick Snack is the compact choice where a tall climber will not fit.",
  timing: [
    "For greenhouse crops, sow indoors in March or April and keep young plants warm. February sowings need reliable heated protection. For outdoor crops, an April or May indoor start avoids keeping large plants waiting for suitable weather.",
    "An unheated greenhouse is usually ready for planting in late May or June, once nights remain around 15°C or warmer. Harden outdoor plants off and wait for warm soil and frost-free conditions. Direct sowing outdoors is an option for suitable varieties in late May or June.",
    "Early June harvests require an early, warm start; outdoor plants commonly begin in July. The end of the season depends on cold nights and plant health. Follow the exact packet’s instructions, especially for flower removal: Marketmore needs its male flowers for pollination.",
  ],
  health: [
    "Under glass, inspect leaf undersides for red spider mite, whitefly and aphids. Keep plants watered, ventilate without chilling them, and provide shade if strong summer sun scorches the leaves.",
    "Powdery mildew can affect cucumbers even when a variety has resistance. Avoid letting the roots dry out or sit in saturated compost. Protect young outdoor plants from slugs while they establish.",
  ],
  growingGuide: "https://www.thompson-morgan.com/how-to-grow-cucumbers",
  reviewDate: "19 September 2026",
};

export const VARIETY_GUIDES = [TOMATO_GUIDE, COURGETTE_GUIDE, SPRING_ONION_GUIDE, CUCUMBER_GUIDE];

export function varietyMetadata(guide: VarietyGuide): Metadata {
  const title = `${guide.singular[0].toUpperCase()}${guide.singular.slice(1)} varieties for UK gardens | ${SITE_NAME}`;
  const path = `/varieties/${guide.slug}`;
  return {
    title, description: guide.description, alternates: { canonical: path },
    openGraph: { title, description: guide.description, url: `${SITE_URL}${path}`, ...(guide.image && { images: [{ url: guide.image.src, alt: guide.image.alt }] }) },
    twitter: { title, description: guide.description, card: guide.image ? "summary_large_image" : "summary", ...(guide.image && { images: [guide.image.src] }) },
  };
}
