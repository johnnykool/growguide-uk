export interface ResourceEdition {
  format: string;
  label: string;
  description: string;
  href: string;
  fileSize: string;
  previews: { src: string; alt: string; width: number; height: number }[];
}

export interface PrintableResource {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  printNote: string;
  editions: ResourceEdition[];
}

// Add future PDF guides here; the Resources page and preview controls render
// directly from this catalogue. Preview images should come from the final PDF.
export const RESOURCES: PrintableResource[] = [
  {
    id: "growing-calendar",
    title: "Sow. Plant. Harvest.",
    subtitle: "The UK growing calendar",
    description:
      "A whole growing year, close to hand. Find the months to sow, plant and harvest your favourite vegetables and herbs, with spacing guidance to help you plan your patch.",
    highlights: [
      "32 vegetables and herbs, from broad beans to dill",
      "Separate marks for indoor sowing, outdoor sowing, planting and harvest",
      "Row and plant spacing, plus notes for UK growing conditions",
    ],
    printNote:
      "Print in portrait at actual size on the matching paper size. The A4 edition has two pages; the A3 edition keeps the whole year on one sheet.",
    editions: [
      {
        format: "A3",
        label: "A3 wall chart",
        description: "One sheet for the shed or potting bench",
        href: "/downloads/growguide-uk-growing-calendar-a3.pdf",
        fileSize: "368 KB",
        previews: [
          {
            src: "/images/resources/growing-calendar-a3-1.png",
            alt: "GrowGuide UK A3 growing calendar showing January to December sowing, planting and harvest windows for 32 vegetables and herbs, including dill.",
            width: 2122,
            height: 3000,
          },
        ],
      },
      {
        format: "A4",
        label: "A4 home print",
        description: "Two pages for your garden folder",
        href: "/downloads/growguide-uk-growing-calendar-a4.pdf",
        fileSize: "372 KB",
        previews: [
          {
            src: "/images/resources/growing-calendar-a4-1.png",
            alt: "GrowGuide UK A4 growing calendar, page 1 of 2: aubergine to dill, with monthly growing windows and spacing.",
            width: 2122,
            height: 3000,
          },
          {
            src: "/images/resources/growing-calendar-a4-2.png",
            alt: "GrowGuide UK A4 growing calendar, page 2 of 2: garlic to turnip, with monthly growing windows and spacing.",
            width: 2122,
            height: 3000,
          },
        ],
      },
    ],
  },
{
  "id": "crop-rotation",
  "title": "Rotate. Record. Repeat.",
  "subtitle": "Crop rotation",
  "description": "Plan a four-year rotation for beds, allotments, raised beds and containers.",
  "highlights": [
    "Plant family reference chart",
    "Four-year bed plan",
    "Small-space and UK winter advice"
  ],
  "printNote": "Print both A4 pages in portrait at actual size.",
  "editions": [
    {
      "format": "A4",
      "label": "A4 guide",
      "description": "Two pages for your garden folder",
      "href": "/downloads/growguide-uk-crop-rotation.pdf",
      "fileSize": "356 KB",
      "previews": [
        {
          "src": "/images/resources/crop-rotation-1.png",
          "alt": "GrowGuide UK Crop rotation A4 guide, page 1 of 2.",
          "width": 2122,
          "height": 3000
        },
        {
          "src": "/images/resources/crop-rotation-2.png",
          "alt": "GrowGuide UK Crop rotation A4 guide, page 2 of 2.",
          "width": 2122,
          "height": 3000
        }
      ]
    }
  ]
},
{
  "id": "companion-planting",
  "title": "Good neighbours.",
  "subtitle": "Companion planting",
  "description": "Choose useful plant combinations, with supported practices and traditional claims clearly distinguished.",
  "highlights": [
    "Practical planting combinations",
    "UK research and its limits",
    "Ideas for allotments, raised beds and pots"
  ],
  "printNote": "Print both A4 pages in portrait at actual size.",
  "editions": [
    {
      "format": "A4",
      "label": "A4 guide",
      "description": "Two pages for your garden folder",
      "href": "/downloads/growguide-uk-companion-planting.pdf",
      "fileSize": "356 KB",
      "previews": [
        {
          "src": "/images/resources/companion-planting-1.png",
          "alt": "GrowGuide UK Companion planting A4 guide, page 1 of 2.",
          "width": 2122,
          "height": 3000
        },
        {
          "src": "/images/resources/companion-planting-2.png",
          "alt": "GrowGuide UK Companion planting A4 guide, page 2 of 2.",
          "width": 2122,
          "height": 3000
        }
      ]
    }
  ]
},
{
  "id": "vegetable-storage",
  "title": "Keep the harvest.",
  "subtitle": "Vegetable storage",
  "description": "Find the right conditions for longer-keeping crops and fresh everyday harvests.",
  "highlights": [
    "Long-term storage and fridge charts",
    "Advice for damp and frosty UK winters",
    "Simple ways to reduce waste"
  ],
  "printNote": "Print both A4 pages in portrait at actual size.",
  "editions": [
    {
      "format": "A4",
      "label": "A4 guide",
      "description": "Two pages for your garden folder",
      "href": "/downloads/growguide-uk-vegetable-storage.pdf",
      "fileSize": "356 KB",
      "previews": [
        {
          "src": "/images/resources/vegetable-storage-1.png",
          "alt": "GrowGuide UK Vegetable storage A4 guide, page 1 of 2.",
          "width": 2122,
          "height": 3000
        },
        {
          "src": "/images/resources/vegetable-storage-2.png",
          "alt": "GrowGuide UK Vegetable storage A4 guide, page 2 of 2.",
          "width": 2122,
          "height": 3000
        }
      ]
    }
  ]
},
{
  "id": "seed-storage-and-lifespan",
  "title": "Save for next season.",
  "subtitle": "Seed storage & lifespan",
  "description": "Store seed well, test germination and plan next season with a 36-crop lifespan chart.",
  "highlights": [
    "Five-step seed storage routine",
    "A simple germination test",
    "Lifespan ranges for 36 vegetables and herbs"
  ],
  "printNote": "Print both A4 pages in portrait at actual size.",
  "editions": [
    {
      "format": "A4",
      "label": "A4 guide",
      "description": "Two pages for your garden folder",
      "href": "/downloads/growguide-uk-seed-storage-and-lifespan.pdf",
      "fileSize": "356 KB",
      "previews": [
        {
          "src": "/images/resources/seed-storage-and-lifespan-1.png",
          "alt": "GrowGuide UK Seed storage & lifespan A4 guide, page 1 of 2.",
          "width": 2122,
          "height": 3000
        },
        {
          "src": "/images/resources/seed-storage-and-lifespan-2.png",
          "alt": "GrowGuide UK Seed storage & lifespan A4 guide, page 2 of 2.",
          "width": 2122,
          "height": 3000
        }
      ]
    }
  ]
}
];
