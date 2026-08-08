import type { Vegetable } from "./types";

export type SeasonalMarker =
  | "sow-outdoors"
  | "transplant"
  | "sow-indoors"
  | "harvest"
  | "next-month";

export interface SeasonalMarkerInfo {
  kind: SeasonalMarker;
  label: string;
}

export interface SeasonalRecommendation {
  vegetable: Vegetable;
  marker: SeasonalMarkerInfo;
}

const markerInfo: Record<SeasonalMarker, SeasonalMarkerInfo> = {
  "sow-outdoors": { kind: "sow-outdoors", label: "Sow outside now" },
  transplant: { kind: "transplant", label: "Plant out now" },
  "sow-indoors": { kind: "sow-indoors", label: "Sow indoors now" },
  harvest: { kind: "harvest", label: "Harvest now" },
  "next-month": { kind: "next-month", label: "Coming up next month" },
};

const currentActions: Array<[SeasonalMarker, keyof Vegetable]> = [
  ["sow-outdoors", "sowOutdoors"],
  ["transplant", "transplant"],
  ["sow-indoors", "sowIndoors"],
  ["harvest", "harvest"],
];

export function getSeasonalMarker(
  vegetable: Vegetable,
  month: number,
): SeasonalMarkerInfo | null {
  for (const [kind, field] of currentActions) {
    if ((vegetable[field] as number[]).includes(month)) return markerInfo[kind];
  }

  const nextMonth = (month % 12) + 1;
  if (
    currentActions.some(([, field]) =>
      (vegetable[field] as number[]).includes(nextMonth),
    )
  ) {
    return markerInfo["next-month"];
  }

  return null;
}

export function getSeasonalRecommendations(
  vegetables: Vegetable[],
  month: number,
  limit = 6,
): SeasonalRecommendation[] {
  const rank = Object.keys(markerInfo) as SeasonalMarker[];
  const recommendations = vegetables
    .map((vegetable, index) => ({
      vegetable,
      marker: getSeasonalMarker(vegetable, month),
      index,
    }))
    .filter(
      (item): item is SeasonalRecommendation & { index: number } =>
        item.marker !== null &&
        (item.marker.kind !== "next-month" || item.vegetable.difficulty === "Easy"),
    )
    .sort(
      (a, b) =>
        rank.indexOf(a.marker.kind) - rank.indexOf(b.marker.kind) ||
        a.index - b.index,
    );

  const ids = new Set<string>();
  return recommendations.filter(({ vegetable }) => {
    if (ids.has(vegetable.id)) return false;
    ids.add(vegetable.id);
    return true;
  }).slice(0, limit).map(({ vegetable, marker }) => ({ vegetable, marker }));
}
