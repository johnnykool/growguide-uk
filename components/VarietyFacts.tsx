import type { CropVariety } from "@/data/varieties";

type FactRow = [label: string, value: string];

/** stack: label above value. duo: two such columns. pairs: label beside value. */
type FactLayout = "stack" | "duo" | "pairs";

type FactGroup = {
  label: string;
  layout: FactLayout;
  rows: FactRow[];
};

/**
 * The seven growing facts used to sit in a single seven-row list with a
 * hairline under every row, which read as a spec sheet and gave every value
 * the same weight. They are grouped into three clusters instead, with one
 * divider between clusters rather than one per row.
 */
export function factGroups(v: CropVariety): FactGroup[] {
  return [
    {
      label: "Where it grows",
      layout: "stack",
      rows: [
        ["Position", v.position],
        ["Conditions", v.conditions],
        ["Containers", v.containers],
      ],
    },
    {
      // Both values are short enough to sit side by side.
      label: "Size and effort",
      layout: "duo",
      rows: [
        ["Height & spread", v.heightSpread],
        ["Difficulty", v.difficulty],
      ],
    },
    {
      // These three are full sentences, so they need the width of the card.
      label: "When",
      layout: "pairs",
      rows: [
        ["Sow", v.sow],
        ["Plant", v.plant],
        ["Harvest", v.harvest],
      ],
    },
  ];
}

const LIST_CLASS: Record<FactLayout, string> = {
  stack: "grid-cols-1",
  duo: "grid-cols-1 sm:grid-cols-2",
  pairs: "grid-cols-1",
};

const ROW_CLASS: Record<FactLayout, string> = {
  stack: "",
  duo: "",
  pairs: "grid grid-cols-[4.5rem_1fr] gap-x-3",
};

export default function VarietyFacts({ variety }: { variety: CropVariety }) {
  return (
    <div className="mt-6">
      {factGroups(variety).map(group => (
        <div key={group.label} className="border-t border-light-sage/60 py-4">
          <h4 className="font-semibold text-dark-earth">{group.label}</h4>
          <dl className={`mt-2 grid gap-x-6 gap-y-3 ${LIST_CLASS[group.layout]}`}>
            {group.rows.map(([label, value]) => (
              <div key={label} className={ROW_CLASS[group.layout]}>
                <dt className="text-sm font-semibold text-earth-ink">{label}</dt>
                <dd className={group.layout === "pairs" ? "text-earth-ink" : "mt-0.5 text-earth-ink"}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
