export interface SeedRetailer {
  name: string;
  url: string;
  // Add only an approved affiliate deep link for this exact seed variety.
  affiliateUrl?: string;
}

export interface CropVariety {
  id: string;
  name: string;
  bestFor: string;
  latinName: string;
  habit: string;
  position: string;
  conditions: string;
  heightSpread: string;
  containers: string;
  difficulty: string;
  general: string;
  limitation: string;
  sow: string;
  plant: string;
  harvest: string;
  pestsDiseases: string;
  retailer: SeedRetailer;
}

export const TOMATO_VARIETIES: CropVariety[] = [
  {
    id: "gardeners-delight",
    name: "Gardener’s Delight",
    latinName: "Solanum lycopersicum",
    bestFor: "An outdoor cherry tomato",
    habit: "Tall cordon · red cherry fruit",
    position: "Greenhouse or warm, sheltered outdoors",
    conditions: "Full sun; fertile, well-drained soil or compost kept evenly moist.",
    heightSpread: "Up to 2m tall × 50cm wide",
    containers: "Large pot or growing bag, with support",
    difficulty: "Moderate · train and remove side shoots",
    general: "Choose Gardener’s Delight if you want a familiar cherry tomato with a tangy flavour for everyday salads and sandwiches. Its bite-sized red fruits make it a useful all-rounder for picking fresh through summer. It suits a greenhouse or a warm, sheltered outdoor spot, so you can grow it without a greenhouse if your garden has the right conditions. Allow room for a tall support and a little regular attention to tying in the stem and removing side shoots.",
    limitation: "Needs a tall support and regular side-shoot removal; allow space for a plant up to 2m tall.",
    sow: "Indoors: February-April; March-April for outdoor crops.",
    plant: "Greenhouse: late May. Outdoors: early June, after frost risk has passed.",
    harvest: "July-October",
    pestsDiseases: "Watch for aphids and whitefly. Blight can affect outdoor crops, especially in warm, wet weather.",
    retailer: { name: "Thompson & Morgan", url: "https://www.thompson-morgan.com/p/tomato-gardeners-delight-seeds/277TM" },
  },
  {
    id: "sungold-f1",
    name: "Sungold F1",
    latinName: "Solanum lycopersicum",
    bestFor: "Sweet tomatoes for snacking",
    habit: "Tall cordon · orange cherry fruit",
    position: "Greenhouse or warm, sheltered outdoors",
    conditions: "Full sun; fertile, well-drained soil or compost kept evenly moist.",
    heightSpread: "Up to 2m tall × 50cm wide",
    containers: "Large pot or growing bag, with support",
    difficulty: "Moderate · train and remove side shoots",
    general: "Choose Sungold F1 when sweetness is your main reason for growing tomatoes. Its small golden-orange fruits are lovely eaten straight from the plant and add colour to a bowl of mixed tomatoes. It is a good fit for a greenhouse border or a sunny, sheltered outdoor position where you can give a tall plant room to grow. If you enjoy picking a few tomatoes for snacks and salads, this variety makes good use of that space.",
    limitation: "A vigorous climber, not a compact patio bush. Needs regular training and side-shoot removal.",
    sow: "Indoors: February-April; March-April for outdoor crops.",
    plant: "Greenhouse: late May. Outdoors: early June, after frost risk has passed.",
    harvest: "July-October",
    pestsDiseases: "Watch for aphids, whitefly and blight. Has resistance to tobacco mosaic virus and fusarium wilt; it is not disease-proof.",
    retailer: { name: "Thompson & Morgan", url: "https://www.thompson-morgan.com/p/tomato-sungold-f1-seeds/840TM" },
  },
  {
    id: "tumbling-tom-red",
    name: "Tumbling Tom Red",
    latinName: "Solanum lycopersicum",
    bestFor: "Pots and hanging baskets",
    habit: "Trailing bush · red cherry fruit",
    position: "Greenhouse or sunny, sheltered outdoors",
    conditions: "Full sun; fertile, free-draining compost. Check baskets often to keep the roots evenly moist.",
    heightSpread: "Up to 30cm tall × 30cm wide; trailing habit",
    containers: "Especially suited to baskets and raised pots",
    difficulty: "Easy · no side-shoot removal",
    general: "Choose Tumbling Tom Red if you want to grow tomatoes in a basket or raised pot without finding space for a tall support. Its compact, trailing growth suits a sunny patio or balcony, bringing a crop of red cherry tomatoes within reach even when you have no vegetable bed. There is no need to train a main stem or remove side shoots, which makes the pruning simpler for a first-time grower. It is especially useful where space is limited and you can check the compost regularly to keep it watered.",
    limitation: "Basket compost dries quickly, so check watering often. Keep its side shoots: this is a bush tomato.",
    sow: "Indoors: February-March for greenhouse crops; March-April for outdoors.",
    plant: "Pot up under cover in spring. Move baskets outdoors in late May-June, after frost risk has passed.",
    harvest: "July-September",
    pestsDiseases: "Watch for aphids, whitefly and blight. Check the foliage regularly, including underneath the leaves.",
    retailer: { name: "Thompson & Morgan", url: "https://www.thompson-morgan.com/p/tomato-tumbling-tom-red-seeds/515TM" },
  },
  {
    id: "crimson-crush-f1",
    name: "Crimson Crush F1",
    latinName: "Solanum lycopersicum",
    bestFor: "Outdoor blight resistance",
    habit: "Tall cordon · large salad fruit",
    position: "Outdoors; also suitable for a greenhouse",
    conditions: "Full sun in a sheltered spot; fertile, well-drained soil kept evenly moist.",
    heightSpread: "Up to 2m tall × 50cm wide",
    containers: "Large pot or growing bag, with support",
    difficulty: "Moderate · train and remove side shoots",
    general: "Choose Crimson Crush F1 if you grow outdoors and blight has spoiled your tomatoes in previous summers. Developed for outdoor growing, it offers an extra defence against blight, although plants can still become infected. Its larger salad tomatoes suit slicing for sandwiches or serving alongside other summer vegetables. It also suits a greenhouse if you have room for a tall plant and time to tie it in and remove side shoots.",
    limitation: "Resistance is not immunity. Keep checking for blight and give the plants space and support.",
    sow: "Indoors: February-April; March-April for outdoor crops.",
    plant: "Greenhouse: late May. Outdoors: early June, after frost risk has passed.",
    harvest: "July-September",
    pestsDiseases: "Blight-resistant, but symptoms can still develop. Watch for aphids and whitefly as with other tomatoes.",
    retailer: { name: "Thompson & Morgan", url: "https://www.thompson-morgan.com/p/tomato-crimson-crush-f1-seeds/wkc9370TM" },
  },
];

export const VARIETY_REVIEW_DATE = "18 September 2026";

// Returns the URL only if it is one a seed link may safely point at. Anything
// else — a javascript: URI, a malformed string — collapses to null.
function httpsUrl(candidate: string | undefined): string | null {
  if (!candidate) return null;
  try {
    return new URL(candidate).protocol === "https:" ? candidate : null;
  } catch {
    return null;
  }
}

export function seedDestination(retailer: SeedRetailer) {
  // Invalid configuration must never turn a working seed link into a dead
  // button, so an unusable affiliate link falls back to the ordinary product
  // page. Both go through the same check: the fallback is the path taken by
  // every non-affiliate retailer, so screening only the rarer field would
  // guard the exception and leave the rule open.
  const affiliate = httpsUrl(retailer.affiliateUrl);
  if (affiliate) return { href: affiliate, affiliate: true };
  return { href: httpsUrl(retailer.url) ?? "#", affiliate: false };
}
