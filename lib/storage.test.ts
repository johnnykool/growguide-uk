import { beforeEach, describe, expect, it } from "vitest";
import type { SetupDraftV1 } from "./types";
import {
  clearSetupDraft,
  loadSetupDraft,
  saveSetupDraft,
} from "./storage";

const validDraft: SetupDraftV1 = {
  version: 1,
  activeStep: 2,
  postcode: "SW1A 1AA",
  lookup: {
    postcode: "SW1A 1AA",
    lat: 51.501,
    lng: -0.141,
    region: "London",
  },
  vegetables: ["tomato"],
  plotSize: "medium",
  environment: ["raised-beds"],
  equipment: ["trowel"],
  showAllCrops: true,
  showAllEquipment: false,
};

describe("setup draft storage", () => {
  beforeEach(() => window.localStorage.clear());

  it("round-trips a valid version-one draft", () => {
    saveSetupDraft(validDraft);

    expect(loadSetupDraft()).toEqual(validDraft);
  });

  it("rejects malformed and unknown-version drafts", () => {
    window.localStorage.setItem("growguide-setup-draft-v1", "not json");
    expect(loadSetupDraft()).toBeNull();

    window.localStorage.setItem(
      "growguide-setup-draft-v1",
      JSON.stringify({ version: 2 })
    );
    expect(loadSetupDraft()).toBeNull();
  });

  it("rejects drafts with invalid persisted properties", () => {
    const invalidDrafts = [
      { ...validDraft, activeStep: 5 },
      { ...validDraft, postcode: 123 },
      { ...validDraft, vegetables: "tomato" },
      { ...validDraft, plotSize: "allotment" },
      { ...validDraft, showAllCrops: "yes" },
      { ...validDraft, lookup: { ...validDraft.lookup!, lat: "51.501" } },
    ];

    for (const draft of invalidDrafts) {
      window.localStorage.setItem(
        "growguide-setup-draft-v1",
        JSON.stringify(draft)
      );
      expect(loadSetupDraft()).toBeNull();
    }
  });

  it("clears only the setup draft", () => {
    window.localStorage.setItem("growguide-user", "saved-profile");
    saveSetupDraft(validDraft);

    clearSetupDraft();

    expect(loadSetupDraft()).toBeNull();
    expect(window.localStorage.getItem("growguide-user")).toBe(
      "saved-profile"
    );
  });
});
