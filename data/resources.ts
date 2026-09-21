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
        fileSize: "361 KB",
        previews: [
          {
            src: "/images/resources/growing-calendar-a3-1.png",
            alt: "GrowGuide UK A3 growing calendar showing January to December sowing, planting and harvest windows for 32 vegetables and herbs, including dill.",
            width: 1415,
            height: 2000,
          },
        ],
      },
      {
        format: "A4",
        label: "A4 home print",
        description: "Two pages for your garden folder",
        href: "/downloads/growguide-uk-growing-calendar-a4.pdf",
        fileSize: "364 KB",
        previews: [
          {
            src: "/images/resources/growing-calendar-a4-1.png",
            alt: "GrowGuide UK A4 growing calendar, page 1 of 2: aubergine to dill, with monthly growing windows and spacing.",
            width: 1415,
            height: 2000,
          },
          {
            src: "/images/resources/growing-calendar-a4-2.png",
            alt: "GrowGuide UK A4 growing calendar, page 2 of 2: garlic to turnip, with monthly growing windows and spacing.",
            width: 1415,
            height: 2000,
          },
        ],
      },
    ],
  },
];
