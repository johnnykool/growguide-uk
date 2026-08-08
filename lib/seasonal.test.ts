import { describe, expect, it } from "vitest";
import type { Vegetable } from "./types";
import {
  getSeasonalMarker,
  getSeasonalRecommendations,
} from "./seasonal";

const vegetable = (
  id: string,
  months: Partial<
    Pick<Vegetable, "sowOutdoors" | "transplant" | "sowIndoors" | "harvest">
  > = {},
): Vegetable => ({
  id,
  name: id,
  category: "test",
  emoji: "🥬",
  sowIndoors: [],
  sowOutdoors: [],
  transplant: [],
  harvest: [],
  pests: [],
  diseases: [],
  pruningCare: "",
  spacing: "",
  difficulty: "Easy",
  notes: "",
  ...months,
});

const outdoorSower = vegetable("outdoor", { sowOutdoors: [8] });
const transplanter = vegetable("transplant", { transplant: [8] });
const indoorSower = vegetable("indoor", { sowIndoors: [8] });
const harvestCrop = vegetable("harvest", { harvest: [8] });
const januaryCrop = vegetable("january", { sowOutdoors: [1] });
const fixtures = [
  outdoorSower,
  transplanter,
  indoorSower,
  harvestCrop,
  vegetable("sixth", { harvest: [8] }),
  vegetable("seventh", { sowIndoors: [8] }),
  vegetable("outdoor", { harvest: [8] }),
];

describe("getSeasonalMarker", () => {
  it("marks outdoor sowing ahead of other current actions", () => {
    expect(
      getSeasonalMarker(
        vegetable("priority", { sowOutdoors: [8], harvest: [8] }),
        8,
      )?.label,
    ).toBe("Sow outside now");
  });

  it("marks each current seasonal action", () => {
    expect(getSeasonalMarker(outdoorSower, 8)?.label).toBe("Sow outside now");
    expect(getSeasonalMarker(transplanter, 8)?.label).toBe("Plant out now");
    expect(getSeasonalMarker(indoorSower, 8)?.label).toBe("Sow indoors now");
    expect(getSeasonalMarker(harvestCrop, 8)?.label).toBe("Harvest now");
  });

  it("marks an action active in January from December", () => {
    expect(getSeasonalMarker(januaryCrop, 12)?.label).toBe(
      "Coming up next month",
    );
  });
});

describe("getSeasonalRecommendations", () => {
  it("returns six unique current recommendations by default", () => {
    const recommendations = getSeasonalRecommendations(fixtures, 8);

    expect(recommendations).toHaveLength(6);
    expect(new Set(recommendations.map((item) => item.vegetable.id)).size).toBe(6);
  });
});
