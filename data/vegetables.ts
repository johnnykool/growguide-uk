import { Vegetable } from "@/lib/types";

// UK growing data based on RHS (Royal Horticultural Society) growing guides.
// Month numbers are 1-12 (January-December).
export const VEGETABLES: Vegetable[] = [
  // ── Fruiting ──────────────────────────────────────────────
  {
    id: "tomato",
    name: "Tomato",
    category: "Fruiting",
    emoji: "🍅",
    sowIndoors: [2, 3, 4],
    sowOutdoors: [],
    transplant: [5, 6],
    harvest: [7, 8, 9, 10],
    pests: ["Whitefly", "Aphids", "Tomato moth caterpillars"],
    diseases: ["Tomato blight", "Blossom end rot", "Grey mould (botrytis)"],
    pruningCare:
      "Pinch out side shoots on cordon (indeterminate) varieties weekly. Remove lower leaves below the first truss once fruit sets. Feed weekly with high-potash tomato feed once first truss has set. Water consistently to prevent blossom end rot and fruit splitting.",
    spacing: "45–60cm apart, rows 75cm apart",
    difficulty: "Medium",
    notes:
      "In most of the UK, outdoor tomatoes only ripen reliably in a warm, sheltered spot — a greenhouse gives far better results. Don't plant out until all frost risk has passed (late May/early June). Blight is a serious risk outdoors from July onwards, especially in wet summers; choose blight-resistant varieties like 'Crimson Crush' for outdoor growing.",
  },
  {
    id: "courgette",
    name: "Courgette",
    category: "Fruiting",
    emoji: "🥒",
    sowIndoors: [4, 5],
    sowOutdoors: [5, 6],
    transplant: [5, 6],
    harvest: [7, 8, 9, 10],
    pests: ["Slugs and snails", "Aphids"],
    diseases: ["Powdery mildew", "Cucumber mosaic virus", "Grey mould"],
    pruningCare:
      "Harvest fruits at 10–15cm long, checking every couple of days in summer — regular picking keeps plants productive. Water generously at the base, especially in dry spells. Mulch to retain moisture. Feed fortnightly with tomato feed once fruiting starts.",
    spacing: "90cm apart in all directions",
    difficulty: "Easy",
    notes:
      "One of the most productive UK crops — two or three plants feed a family. Sow seeds on their edge to prevent rotting. Harden off before planting out after the last frost. Early flowers may be all-male; fruiting settles down as the season warms. Powdery mildew in late summer is normal and plants keep cropping through it.",
  },
  {
    id: "cucumber",
    name: "Cucumber",
    category: "Fruiting",
    emoji: "🥒",
    sowIndoors: [3, 4, 5],
    sowOutdoors: [5, 6],
    transplant: [5, 6],
    harvest: [7, 8, 9],
    pests: ["Whitefly", "Red spider mite", "Slugs (young plants)"],
    diseases: ["Powdery mildew", "Cucumber mosaic virus"],
    pruningCare:
      "Train greenhouse types up a cane or string, pinching out the growing tip when it reaches the roof. Remove male flowers on older greenhouse varieties to prevent bitter fruit (all-female F1 varieties avoid this). Keep compost consistently moist and damp down greenhouse paths to deter red spider mite.",
    spacing: "45cm apart (greenhouse), 90cm apart (outdoor ridge types)",
    difficulty: "Medium",
    notes:
      "Choose the right type for your setup: greenhouse varieties need warmth and shelter; outdoor 'ridge' cucumbers are hardier and cope with UK summers in a sunny, sheltered spot. Don't plant out before June in most regions. Cold nights check growth badly — fleece young outdoor plants if temperatures dip.",
  },
  {
    id: "pepper",
    name: "Pepper",
    category: "Fruiting",
    emoji: "🫑",
    sowIndoors: [2, 3, 4],
    sowOutdoors: [],
    transplant: [5, 6],
    harvest: [7, 8, 9, 10],
    pests: ["Aphids", "Red spider mite", "Whitefly"],
    diseases: ["Grey mould (botrytis)", "Blossom end rot"],
    pruningCare:
      "Pinch out the growing tip when plants reach about 20cm to encourage bushiness. Stake plants carrying heavy crops. Water regularly and feed with tomato feed once the first fruits set. Pick the first fruits green to encourage more to form.",
    spacing: "45–50cm apart",
    difficulty: "Medium",
    notes:
      "Peppers need a long, warm season — sow early (Feb–Mar) with heat (18–21°C propagator). In most of the UK they crop far better in a greenhouse, polytunnel or on a sunny windowsill than outdoors. Fruits ripen from green to red/yellow given time and warmth; in cooler regions be prepared to harvest green.",
  },
  {
    id: "aubergine",
    name: "Aubergine",
    category: "Fruiting",
    emoji: "🍆",
    sowIndoors: [1, 2, 3, 4],
    sowOutdoors: [],
    transplant: [5, 6],
    harvest: [8, 9, 10],
    pests: ["Red spider mite", "Aphids", "Whitefly"],
    diseases: ["Grey mould (botrytis)", "Verticillium wilt"],
    pruningCare:
      "Pinch out the growing tip at 30cm to encourage branching. Allow 5–6 fruits per plant, removing excess flowers. Mist or damp down regularly to deter red spider mite and help fruit set. Feed with high-potash feed once flowering starts. Stake plants as fruit swells.",
    spacing: "50–60cm apart",
    difficulty: "Hard",
    notes:
      "Aubergines need more heat than tomatoes — realistically a greenhouse or polytunnel crop in the UK, or a very sheltered sunny patio in the south. Sow as early as January–February with a heated propagator (21–25°C to germinate). Harvest while skins are glossy; dull skin means over-ripe and bitter.",
  },

  // ── Legumes ───────────────────────────────────────────────
  {
    id: "runner-bean",
    name: "Runner Bean",
    category: "Legumes",
    emoji: "🫘",
    sowIndoors: [4, 5],
    sowOutdoors: [5, 6],
    transplant: [5, 6],
    harvest: [7, 8, 9, 10],
    pests: ["Slugs and snails", "Black bean aphid (blackfly)"],
    diseases: ["Halo blight", "Rust", "Root rots"],
    pruningCare:
      "Provide sturdy 1.8–2.4m canes or a wigwam before planting. Pinch out growing tips when plants reach the top of their supports. Water heavily when flowering starts — dry roots are the main cause of flowers failing to set. Pick pods young (15–20cm) every few days; letting pods mature stops production.",
    spacing: "15cm apart in double rows 60cm apart, or 5 plants per wigwam",
    difficulty: "Easy",
    notes:
      "A classic UK allotment crop and very productive. Never plant out before the last frost — runner beans are killed by frost. In cold, exposed gardens wait until early June. Mulch generously and water in dry spells; flower set fails in drought. White-flowered varieties set better in hot, dry weather.",
  },
  {
    id: "french-bean",
    name: "French Bean",
    category: "Legumes",
    emoji: "🫘",
    sowIndoors: [4, 5],
    sowOutdoors: [5, 6, 7],
    transplant: [5, 6],
    harvest: [7, 8, 9, 10],
    pests: ["Slugs and snails", "Black bean aphid (blackfly)"],
    diseases: ["Halo blight", "Rust", "Anthracnose"],
    pruningCare:
      "Dwarf varieties need little support beyond short twigs; climbing varieties need canes like runner beans. Water well once flowering begins. Pick pods regularly while young and pencil-thin to keep plants cropping — check every 2–3 days in August.",
    spacing: "Dwarf: 15cm apart, rows 45cm apart. Climbing: as runner beans",
    difficulty: "Easy",
    notes:
      "More tolerant of hot, dry spells than runner beans and self-pollinating, so pods set reliably. Very frost-tender — don't sow outdoors until mid-May in most areas (soil above 12°C). Successional sowings every 3 weeks until early July give beans into October. Dwarf types do well in containers.",
  },
  {
    id: "broad-bean",
    name: "Broad Bean",
    category: "Legumes",
    emoji: "🫛",
    sowIndoors: [1, 2],
    sowOutdoors: [2, 3, 4, 10, 11],
    transplant: [3, 4],
    harvest: [6, 7, 8],
    pests: ["Black bean aphid (blackfly)", "Pea and bean weevil", "Mice (seeds)"],
    diseases: ["Chocolate spot", "Broad bean rust"],
    pruningCare:
      "Pinch out the top 8cm of each plant once the first pods form — this deters blackfly, which colonise the soft tips first. Support taller varieties with string run between canes. Water when flowering and as pods swell. Harvest when beans show through the pod but before they get mealy.",
    spacing: "20cm apart in double rows 60cm apart",
    difficulty: "Easy",
    notes:
      "One of the few crops you can sow in autumn (October–November) in milder UK areas — hardy varieties like 'Aquadulce Claudia' overwinter and crop 3–4 weeks earlier. Spring sowings from February (under cloches) to April. Chocolate spot is worse in wet seasons and overcrowded rows — give plants air.",
  },
  {
    id: "pea",
    name: "Pea",
    category: "Legumes",
    emoji: "🫛",
    sowIndoors: [2, 3],
    sowOutdoors: [3, 4, 5, 6],
    transplant: [4, 5],
    harvest: [6, 7, 8, 9],
    pests: ["Pea moth", "Wood pigeons", "Mice (seeds)", "Pea and bean weevil"],
    diseases: ["Powdery mildew", "Downy mildew", "Foot and root rots"],
    pruningCare:
      "Provide twiggy sticks or netting for tendrils to climb as soon as seedlings emerge. Protect newly sown rows from mice and emerging seedlings from pigeons with netting. Water well from flowering onwards. Pick regularly from the bottom of the plant up — pods left on stop production.",
    spacing: "5–7cm apart in flat drills 15cm wide, rows 60–90cm apart",
    difficulty: "Easy",
    notes:
      "Peas dislike heat — UK springs suit them well. Sow every 3–4 weeks March–June for a long season; early sowings under cloches in February in mild areas. Sow a mildew-resistant variety like 'Hurst Green Shaft' for later crops. Starting in guttering under cover and sliding rows into the ground beats mice and slugs.",
  },

  // ── Roots ─────────────────────────────────────────────────
  {
    id: "carrot",
    name: "Carrot",
    category: "Roots",
    emoji: "🥕",
    sowIndoors: [],
    sowOutdoors: [3, 4, 5, 6, 7],
    transplant: [],
    harvest: [6, 7, 8, 9, 10, 11],
    pests: ["Carrot fly", "Slugs", "Aphids"],
    diseases: ["Carrot motley dwarf virus", "Violet root rot"],
    pruningCare:
      "Thin seedlings to 5–8cm apart in the evening, removing thinnings immediately — the smell attracts carrot fly. Keep weed-free while small. Avoid overwatering; steady moisture prevents roots splitting after rain. Cover with insect-proof mesh or erect a 60cm barrier against carrot fly.",
    spacing: "5–8cm apart after thinning, rows 15–30cm apart",
    difficulty: "Easy",
    notes:
      "Carrots need light, stone-free soil — roots fork in freshly manured or stony ground. On heavy clay grow short/round varieties or use containers. Carrot fly is the main UK problem: mesh covers, resistant varieties ('Flyaway', 'Resistafly') and sowing after mid-May (missing the first generation) all help. Don't transplant — always sow direct.",
  },
  {
    id: "beetroot",
    name: "Beetroot",
    category: "Roots",
    emoji: "🫜",
    sowIndoors: [2, 3],
    sowOutdoors: [3, 4, 5, 6, 7],
    transplant: [4, 5],
    harvest: [6, 7, 8, 9, 10],
    pests: ["Birds (seedlings)", "Aphids", "Leaf miners"],
    diseases: ["Leaf spot", "Scab"],
    pruningCare:
      "Thin clusters to one seedling per station when 2cm tall. Water every 10–14 days in dry spells — erratic watering makes roots woody or causes splitting. Harvest from golf-ball size onwards; twist off leaves rather than cutting to prevent bleeding.",
    spacing: "10cm apart, rows 30cm apart",
    difficulty: "Easy",
    notes:
      "Most beetroot 'seeds' are clusters of several seeds, so thinning matters. Early sowings (March) of bolt-resistant varieties like 'Boltardy' avoid running to seed in cold snaps. Sow small amounts every few weeks for continuous tender roots. Modules started indoors transplant well when small — unusual for a root crop.",
  },
  {
    id: "parsnip",
    name: "Parsnip",
    category: "Roots",
    emoji: "🫚",
    sowIndoors: [],
    sowOutdoors: [2, 3, 4, 5],
    transplant: [],
    harvest: [9, 10, 11, 12, 1, 2],
    pests: ["Carrot fly", "Celery fly"],
    diseases: ["Parsnip canker"],
    pruningCare:
      "Thin to 10–15cm apart. Keep weed-free early on; the foliage later smothers weeds itself. Water in prolonged drought to prevent roots splitting when rain returns. Leave roots in the ground and lift as needed through winter — frost improves the flavour.",
    spacing: "10–15cm apart, rows 30cm apart",
    difficulty: "Medium",
    notes:
      "Always use fresh seed — parsnip seed loses viability after a year. Germination is slow (up to a month) and erratic in cold soil; many gardeners wait until March–April rather than February. Station-sow 3 seeds and thin. Canker-resistant varieties like 'Gladiator' are worth choosing. Flavour is best after the first frosts.",
  },
  {
    id: "turnip",
    name: "Turnip",
    category: "Roots",
    emoji: "🍠",
    sowIndoors: [],
    sowOutdoors: [3, 4, 5, 6, 7, 8],
    transplant: [],
    harvest: [5, 6, 7, 8, 9, 10],
    pests: ["Flea beetle", "Cabbage root fly", "Slugs"],
    diseases: ["Club root", "Powdery mildew"],
    pruningCare:
      "Thin early sowings to 10cm, maincrop to 15cm. Water regularly — dry conditions make roots woody and encourage flea beetle. Harvest quickly: early varieties are best at golf-ball size, 6–10 weeks from sowing.",
    spacing: "10–15cm apart, rows 23–30cm apart",
    difficulty: "Easy",
    notes:
      "A fast, easy crop that suits successional sowing. Turnips are brassicas — rotate them with cabbages, not carrots, and avoid ground with club root. Cover seedlings with fleece or mesh against flea beetle (shot-holed leaves) and cabbage root fly. Late July–August sowings give tender autumn roots.",
  },
  {
    id: "radish",
    name: "Radish",
    category: "Roots",
    emoji: "🫜",
    sowIndoors: [],
    sowOutdoors: [2, 3, 4, 5, 6, 7, 8],
    transplant: [],
    harvest: [4, 5, 6, 7, 8, 9, 10],
    pests: ["Flea beetle", "Slugs", "Cabbage root fly"],
    diseases: ["Club root (rarely troublesome in fast crops)"],
    pruningCare:
      "Thin to 2.5cm apart promptly — overcrowded radishes make all leaf and no root. Water little and often; drought makes them woody and fiery, then splitting follows rain. Pull as soon as roots reach usable size, within 4–6 weeks of sowing.",
    spacing: "2.5cm apart, rows 15cm apart",
    difficulty: "Easy",
    notes:
      "The fastest crop on the plot — great for children and for intercropping between slower rows. Sow little and often (every 2 weeks) rather than one big row that bolts. Earliest sowings in February under cloches. Summer sowings bolt quickly in hot, dry spells; keep them watered and pick young.",
  },
  {
    id: "potato",
    name: "Potato",
    category: "Roots",
    emoji: "🥔",
    sowIndoors: [],
    sowOutdoors: [3, 4, 5],
    transplant: [],
    harvest: [6, 7, 8, 9, 10],
    pests: ["Slugs", "Wireworm", "Potato cyst eelworm"],
    diseases: ["Potato blight", "Common scab", "Blackleg"],
    pruningCare:
      "Chit seed potatoes in a light, cool place for 4–6 weeks before planting. Earth up stems as they grow, covering shoots until the ridge is 20–30cm high — this increases yield and stops tubers greening. Water well in dry spells once tubers start forming. Cut and remove foliage at the first sign of blight.",
    spacing: "First earlies 30cm apart, rows 60cm; maincrop 37cm apart, rows 75cm",
    difficulty: "Easy",
    notes:
      "Plant first earlies around late March (St Patrick's Day is traditional), second earlies early-mid April, maincrop mid-late April. Protect emerging shoots from late frosts by earthing up or fleecing. Blight hits maincrops in warm, humid summers ('Hutton periods') — earlies usually escape it. Buy certified seed potatoes rather than saving your own.",
  },

  // ── Alliums ───────────────────────────────────────────────
  {
    id: "onion",
    name: "Onion",
    category: "Alliums",
    emoji: "🧅",
    sowIndoors: [1, 2, 3],
    sowOutdoors: [3, 4],
    transplant: [3, 4],
    harvest: [7, 8, 9],
    pests: ["Onion fly", "Onion thrips", "Allium leaf miner"],
    diseases: ["Onion white rot", "Downy mildew", "Neck rot"],
    pruningCare:
      "Keep weed-free — onions have sparse foliage and compete badly with weeds. Water in dry spells but stop watering once bulbs swell and ripen. Don't bend the tops over; wait for foliage to topple naturally, then lift and dry bulbs thoroughly in the sun or an airy shed before storing.",
    spacing: "Sets: 10cm apart, rows 30cm apart",
    difficulty: "Easy",
    notes:
      "Sets (small bulbs planted March–April) are much easier than seed for UK beginners; heat-treated sets resist bolting. Autumn-planting sets (September–October) overwinter for an early summer crop. White rot persists in soil for many years — never plant alliums on infected ground, and rotate at least 4 years.",
  },
  {
    id: "garlic",
    name: "Garlic",
    category: "Alliums",
    emoji: "🧄",
    sowIndoors: [],
    sowOutdoors: [10, 11, 12, 1, 2, 3],
    transplant: [],
    harvest: [6, 7, 8],
    pests: ["Allium leaf miner", "Onion fly"],
    diseases: ["Rust", "Onion white rot"],
    pruningCare:
      "Plant individual cloves 2–3cm deep, pointed end up. Keep weed-free and water in dry spells during spring growth; stop watering as bulbs mature. Remove any flower stalks (scapes) from hardneck varieties — they're delicious stir-fried. Lift when leaves yellow, and dry thoroughly.",
    spacing: "15cm apart, rows 30cm apart",
    difficulty: "Easy",
    notes:
      "Garlic needs a period of cold to split into cloves, so autumn planting (October–November) suits the UK perfectly and gives the biggest bulbs; plant by early spring at the latest. Buy certified bulbs rather than supermarket garlic (often unsuited to the UK climate and can carry disease). Rust-spotted leaves are common but bulbs usually still mature.",
  },
  {
    id: "leek",
    name: "Leek",
    category: "Alliums",
    emoji: "🥬",
    sowIndoors: [1, 2, 3],
    sowOutdoors: [3, 4],
    transplant: [5, 6, 7],
    harvest: [9, 10, 11, 12, 1, 2],
    pests: ["Leek moth", "Allium leaf miner", "Onion thrips"],
    diseases: ["Leek rust", "White rot"],
    pruningCare:
      "Transplant pencil-thick seedlings into 15cm-deep dibber holes, drop one plant in each and 'puddle' in with water — don't backfill with soil. This blanches long white stems. Water in dry spells and keep weed-free. Earth up stems further in autumn for extra blanching.",
    spacing: "15cm apart, rows 30cm apart",
    difficulty: "Medium",
    notes:
      "A brilliant winter staple — hardy varieties like 'Musselburgh' stand in the ground from autumn to spring and are lifted as needed. Leek moth and allium leaf miner have spread across England and Wales; covering crops with fine insect mesh from April is the only reliable defence. Rotate to avoid rust and white rot.",
  },
  {
    id: "spring-onion",
    name: "Spring Onion",
    category: "Alliums",
    emoji: "🌱",
    sowIndoors: [],
    sowOutdoors: [3, 4, 5, 6, 7, 8],
    transplant: [],
    harvest: [5, 6, 7, 8, 9, 10],
    pests: ["Onion fly", "Onion thrips"],
    diseases: ["Downy mildew", "White rot"],
    pruningCare:
      "Sow thinly in shallow drills and barely thin — crowded plants stay slim and tender. Keep watered in dry weather for mild, juicy stems. Pull as needed from 8 weeks after sowing, using the largest first.",
    spacing: "Sow thinly, rows 15cm apart",
    difficulty: "Easy",
    notes:
      "Sow every 2–3 weeks from March to August for a continuous supply. 'White Lisbon' is the reliable UK standard; a winter-hardy strain sown in August–September overwinters for an early spring crop. Great in containers and window boxes. Same rotation rules as other alliums.",
  },

  // ── Brassicas ─────────────────────────────────────────────
  {
    id: "broccoli",
    name: "Broccoli",
    category: "Brassicas",
    emoji: "🥦",
    sowIndoors: [3, 4, 5],
    sowOutdoors: [4, 5, 6],
    transplant: [5, 6, 7],
    harvest: [7, 8, 9, 10],
    pests: ["Cabbage white caterpillars", "Cabbage root fly", "Wood pigeons", "Whitefly", "Flea beetle"],
    diseases: ["Club root", "Downy mildew"],
    pruningCare:
      "Plant firmly — brassicas hate loose soil — and fit brassica collars against cabbage root fly. Net against pigeons and butterflies from day one. Water well in dry spells. Cut the central head while buds are tight; side shoots then crop for weeks afterwards.",
    spacing: "30–45cm apart, rows 45cm apart",
    difficulty: "Medium",
    notes:
      "This is calabrese (summer broccoli); purple sprouting broccoli is sown in spring to crop the following late winter–spring — a superb hungry-gap crop if you have space. Heads 'bolt' to flower quickly in hot weather, so check often in summer. Club root is the big brassica risk: rotate on at least a 3-year cycle and lime acid soils.",
  },
  {
    id: "cauliflower",
    name: "Cauliflower",
    category: "Brassicas",
    emoji: "🥦",
    sowIndoors: [1, 2, 3, 4],
    sowOutdoors: [4, 5],
    transplant: [4, 5, 6],
    harvest: [6, 7, 8, 9, 10, 11],
    pests: ["Cabbage white caterpillars", "Cabbage root fly", "Wood pigeons", "Cabbage whitefly"],
    diseases: ["Club root", "Downy mildew"],
    pruningCare:
      "Never let plants go short of water or nutrients — any check to growth produces tiny 'button' heads. Firm soil, brassica collars and netting are essential. Bend a few leaves over developing summer curds to keep them white. Cut heads while curds are still tight.",
    spacing: "60cm apart each way",
    difficulty: "Hard",
    notes:
      "The trickiest brassica: cauliflowers demand rich, firm, moisture-retentive soil and an unchecked run of growth from sowing to harvest. Different varieties crop in summer, autumn or (in mild areas) spring — check the packet and sow accordingly. If your soil is light or your watering erratic, start with calabrese instead.",
  },
  {
    id: "cabbage",
    name: "Cabbage",
    category: "Brassicas",
    emoji: "🥬",
    sowIndoors: [2, 3, 4],
    sowOutdoors: [3, 4, 5, 7, 8],
    transplant: [5, 6, 9, 10],
    harvest: [6, 7, 8, 9, 10, 11],
    pests: ["Cabbage white caterpillars", "Cabbage root fly", "Wood pigeons", "Cabbage whitefly", "Flea beetle", "Slugs"],
    diseases: ["Club root", "Downy mildew"],
    pruningCare:
      "Plant deeply and firm in very well, fitting collars against root fly. Net against pigeons and butterflies throughout. Water in dry weather, especially as heads form. Cut when heads are firm; leaving a 10cm stalk of spring/summer types and cutting a cross in it often produces a bonus crop of mini-greens.",
    spacing: "Spring: 30cm; summer: 35–45cm; winter: 45–50cm apart",
    difficulty: "Medium",
    notes:
      "With spring, summer and winter varieties you can cut cabbage year-round in the UK — but each type has its own sowing window, so read the packet. Spring cabbage is sown late July–August and transplanted in autumn. Check under leaves for caterpillar eggs weekly in summer; fine netting beats picking them off. Rotate against club root.",
  },
  {
    id: "brussels-sprout",
    name: "Brussels Sprout",
    category: "Brassicas",
    emoji: "🥬",
    sowIndoors: [2, 3, 4],
    sowOutdoors: [3, 4],
    transplant: [5, 6],
    harvest: [10, 11, 12, 1, 2],
    pests: ["Cabbage white caterpillars", "Cabbage aphid", "Cabbage root fly", "Wood pigeons", "Whitefly"],
    diseases: ["Club root", "Downy mildew", "Light leaf spot"],
    pruningCare:
      "Plant very firmly in firm ground and stake tall varieties in autumn — loose, rocking plants produce loose, 'blown' sprouts. Net against pigeons all winter. Remove yellowing leaves as they appear. Pick sprouts from the bottom of the stem upwards once they reach 2–3cm and are tightly closed.",
    spacing: "60cm apart each way",
    difficulty: "Medium",
    notes:
      "A long-haul crop occupying ground from May to February, but few things beat home-grown sprouts after frost has sweetened them. F1 varieties hold firm sprouts far longer than older types. Grey cabbage aphid colonies hide inside sprout buttons — check early and often. Firm soil and shelter from wind are the two big success factors.",
  },
  {
    id: "kale",
    name: "Kale",
    category: "Brassicas",
    emoji: "🥬",
    sowIndoors: [3, 4, 5],
    sowOutdoors: [4, 5, 6],
    transplant: [6, 7],
    harvest: [9, 10, 11, 12, 1, 2],
    pests: ["Cabbage white caterpillars", "Wood pigeons", "Whitefly", "Flea beetle"],
    diseases: ["Club root (more tolerant than most brassicas)"],
    pruningCare:
      "Plant firmly and net against pigeons, especially in winter when other food is scarce. Pick young leaves from the crown regularly rather than stripping a plant bare — plants re-sprout for months. Remove yellowing lower leaves. Water in dry spells to keep leaves tender.",
    spacing: "45cm apart each way",
    difficulty: "Easy",
    notes:
      "The toughest, most forgiving brassica — hardy to well below freezing and productive from autumn right through the hungry gap. 'Nero di Toscana' (cavolo nero) and curly types both do well UK-wide. Flavour improves after frost. A few plants in a corner give winter greens with very little effort.",
  },

  // ── Leafy Greens ──────────────────────────────────────────
  {
    id: "lettuce",
    name: "Lettuce",
    category: "Leafy Greens",
    emoji: "🥗",
    sowIndoors: [1, 2, 3, 9, 10],
    sowOutdoors: [3, 4, 5, 6, 7, 8],
    transplant: [3, 4, 5],
    harvest: [5, 6, 7, 8, 9, 10],
    pests: ["Slugs and snails", "Aphids (including root aphid)", "Cutworms"],
    diseases: ["Downy mildew", "Grey mould", "Lettuce mosaic virus"],
    pruningCare:
      "Thin or transplant to final spacing early — checked seedlings bolt. Water in the morning rather than evening to reduce slug damage and mildew. Pick loose-leaf types a few leaves at a time; cut hearting types whole as soon as firm, before they bolt.",
    spacing: "Loose-leaf 15cm, butterhead 25cm, cos/crisphead 30cm apart",
    difficulty: "Easy",
    notes:
      "Sow little and often — a short row every fortnight beats a glut that bolts. Lettuce seed won't germinate above about 25°C, so in summer heatwaves sow in the evening in a shaded spot. Autumn sowings under cover (September–October) give winter/spring salads in a cold greenhouse. Slugs are the main enemy; raised beds and evening patrols help.",
  },
  {
    id: "spinach",
    name: "Spinach",
    category: "Leafy Greens",
    emoji: "🍃",
    sowIndoors: [],
    sowOutdoors: [3, 4, 5, 8, 9],
    transplant: [],
    harvest: [5, 6, 7, 8, 9, 10, 11],
    pests: ["Slugs", "Birds (seedlings)", "Leaf miners"],
    diseases: ["Downy mildew", "Spinach blight (cucumber mosaic virus)"],
    pruningCare:
      "Thin to 7–15cm depending on whether you want baby or full leaves. Keep consistently moist — drought is the main bolting trigger. Pick outer leaves regularly, little and often, and plants keep producing. Remove any plants that bolt immediately.",
    spacing: "7–15cm apart, rows 30cm apart",
    difficulty: "Easy",
    notes:
      "True spinach bolts fast in hot, dry midsummer weather — in the UK it's best as a spring (March–May) and late summer (August–September) crop. August–September sowings of a hardy variety overwinter for early spring pickings, especially under fleece or in a tunnel. Choose modern bolt-resistant, mildew-resistant varieties.",
  },

  // ── Cucurbits ─────────────────────────────────────────────
  {
    id: "butternut-squash",
    name: "Butternut Squash",
    category: "Cucurbits",
    emoji: "🎃",
    sowIndoors: [4, 5],
    sowOutdoors: [5, 6],
    transplant: [5, 6],
    harvest: [9, 10],
    pests: ["Slugs and snails (young plants)", "Aphids"],
    diseases: ["Powdery mildew", "Cucumber mosaic virus"],
    pruningCare:
      "Plant on a mound of compost-enriched soil. Pinch out the tips of trailing stems at 60cm to encourage branching and fruit set, and limit each plant to 3–4 fruits so they ripen fully. Raise developing fruit onto tiles or wood to prevent rot. Water and feed generously.",
    spacing: "90cm–1.2m apart",
    difficulty: "Medium",
    notes:
      "Butternuts need a longer, warmer season than most of the UK reliably provides — choose an early UK-bred variety like 'Hunter' or 'Harrier' and give them your sunniest spot. Cure harvested fruit in the sun (or a greenhouse) for two weeks so skins harden, then they store until well into winter. Harvest before the first frost, keeping a long stalk.",
  },
  {
    id: "pumpkin",
    name: "Pumpkin",
    category: "Cucurbits",
    emoji: "🎃",
    sowIndoors: [4, 5],
    sowOutdoors: [5, 6],
    transplant: [5, 6],
    harvest: [9, 10],
    pests: ["Slugs and snails (young plants)", "Aphids"],
    diseases: ["Powdery mildew", "Cucumber mosaic virus"],
    pruningCare:
      "Plant on a mound in rich soil with plenty of organic matter. For big pumpkins, restrict each plant to 1–2 fruits and feed weekly; for eating varieties allow 3–4. Lift fruit onto a tile or board to prevent rot. Cut with a long stalk before the first frost and cure in the sun for 10–14 days.",
    spacing: "1–1.5m apart (giant varieties 1.8m+)",
    difficulty: "Easy",
    notes:
      "Hungry, thirsty plants that famously thrive on old compost heaps. Sow indoors mid-April to mid-May, plant out after the last frost. In cooler regions smaller-fruited varieties ripen more reliably than giants. Powdery mildew in late summer looks alarming but rarely stops fruit ripening — keep watering at the roots.",
  },

  // ── Herbs ─────────────────────────────────────────────────
  {
    id: "basil",
    name: "Basil",
    category: "Herbs",
    emoji: "🌿",
    sowIndoors: [2, 3, 4, 5, 6],
    sowOutdoors: [5, 6],
    transplant: [6],
    harvest: [6, 7, 8, 9],
    pests: ["Slugs and snails", "Aphids", "Whitefly"],
    diseases: ["Downy mildew", "Damping off", "Grey mould"],
    pruningCare:
      "Pinch out growing tips regularly, harvesting from the top down to keep plants bushy, and remove flower spikes as they appear. Water in the morning, not the evening — basil hates sitting cold and wet overnight. Feed container plants fortnightly.",
    spacing: "20–30cm apart (or several plants per large pot)",
    difficulty: "Medium",
    notes:
      "A Mediterranean herb that sulks in cold, wet UK summers — it does far better on a sunny windowsill, in a greenhouse or in pots that can be moved under cover than in open ground. Don't plant out before June. Supermarket pot basil can be split into several clumps and potted on. Pick regularly or plants run to flower.",
  },
  {
    id: "parsley",
    name: "Parsley",
    category: "Herbs",
    emoji: "🌿",
    sowIndoors: [2, 3, 4],
    sowOutdoors: [3, 4, 5, 6, 7],
    transplant: [5, 6],
    harvest: [5, 6, 7, 8, 9, 10, 11, 12],
    pests: ["Carrot fly", "Slugs", "Celery fly"],
    diseases: ["Leaf spot", "Downy mildew"],
    pruningCare:
      "Pick outer stems first, cutting at the base, so the crown keeps producing. Water in dry spells to keep leaves lush and delay bolting. Remove flower stems in the second year, or let one plant self-seed. Cover with a cloche in autumn to keep picking quality leaves into winter.",
    spacing: "15–23cm apart",
    difficulty: "Easy",
    notes:
      "Famously slow to germinate — up to 4–6 weeks in cold soil, so be patient or pre-soak seed and sow indoors with gentle warmth. A biennial: it crops for a year then flowers, so sow fresh each spring. Parsley is related to carrots and can attract carrot fly. A July sowing gives plants that stand well through winter, especially cloched.",
  },
  {
    id: "chives",
    name: "Chives",
    category: "Herbs",
    emoji: "🌿",
    sowIndoors: [3, 4],
    sowOutdoors: [4, 5],
    transplant: [5, 6],
    harvest: [4, 5, 6, 7, 8, 9, 10],
    pests: ["Onion fly", "Aphids (rarely serious)"],
    diseases: ["Leek rust", "Downy mildew"],
    pruningCare:
      "Cut leaves with scissors 2–3cm above the base — cut clumps resprout within weeks. Remove flower stems for the best leaf flavour, or let some flower (the purple pompoms are edible and loved by bees), then shear the whole clump back to trigger fresh growth. Divide congested clumps every 3–4 years in spring or autumn.",
    spacing: "23–30cm apart",
    difficulty: "Easy",
    notes:
      "A fully hardy perennial — plant once and pick for years. Dies back in winter and reshoots in early spring; a pot brought into the greenhouse or kitchen in autumn extends the season. One of the easiest herbs for UK gardens, happy in beds, containers and even light shade. Rust-spotted leaves can simply be cut back hard.",
  },
  {
    id: "rosemary",
    name: "Rosemary",
    category: "Herbs",
    emoji: "🌲",
    sowIndoors: [2, 3, 4],
    sowOutdoors: [],
    transplant: [5, 6],
    harvest: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    pests: ["Rosemary beetle", "Scale insects", "Leafhoppers"],
    diseases: ["Root rot in wet soils", "Honey fungus (rarely)"],
    pruningCare:
      "Trim lightly after flowering in late spring to keep plants compact — never cut back into old, bare wood as it won't reshoot. Pick sprigs year-round. In pots, use gritty, free-draining compost and go easy on winter watering. Check for metallic-striped rosemary beetles from spring and pick them off.",
    spacing: "60–90cm apart (one plant is usually plenty)",
    difficulty: "Easy",
    notes:
      "An evergreen Mediterranean shrub that's hardy in most of the UK if — and only if — drainage is good; winter wet kills far more rosemary than cold. It's much quicker from a bought plant or summer cuttings than from seed (germination is slow and patchy). Give it full sun and poor, free-draining soil; in cold, wet areas grow in a pot by a south-facing wall.",
  },
];

export const CATEGORY_ORDER = [
  "Fruiting",
  "Legumes",
  "Roots",
  "Alliums",
  "Brassicas",
  "Leafy Greens",
  "Cucurbits",
  "Herbs",
];

export function getVegetableById(id: string): Vegetable | undefined {
  return VEGETABLES.find((v) => v.id === id);
}
