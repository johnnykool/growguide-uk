import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SavedAdvice, SetupDraftV1, UserProfile } from "./types";
import {
  clearSetupDraft,
  loadSavedAdvice,
  loadSetupDraft,
  saveAdvice,
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

const profile: UserProfile = {
  postcode: "BS1 5AH",
  lat: 51.4545,
  lng: -2.5879,
  region: "South West England",
  vegetables: ["tomato"],
  plotSize: "small",
  environment: ["raised-beds"],
  equipment: ["trowel"],
  lastUpdated: "2026-08-08",
};

const scopedAdvice: SavedAdvice & { profileFingerprint: string } = {
  profileFingerprint:
    "v1|BS15AH|51.4545|-2.5879|south west england|tomato|small|raised-beds|trowel",
  timeline: "7-days",
  generatedAt: "2026-08-08T12:00:00.000Z",
  advice: { summary: "Saved plan", weatherWarnings: [], tasks: [] },
  completed: {},
};

describe("setup draft storage", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

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
      { ...validDraft, activeStep: 1.5 },
      { ...validDraft, postcode: 123 },
      { ...validDraft, vegetables: "tomato" },
      { ...validDraft, plotSize: "allotment" },
      { ...validDraft, showAllCrops: "yes" },
      { ...validDraft, lookup: { ...validDraft.lookup!, lat: "51.501" } },
      { ...validDraft, vegetables: ["stale-crop"] },
      { ...validDraft, environment: ["stale-environment"] },
      { ...validDraft, equipment: ["stale-tool"] },
      { ...validDraft, lookup: { ...validDraft.lookup!, region: "Mars" } },
      { ...validDraft, lookup: { ...validDraft.lookup!, postcode: "not-valid" } },
      { ...validDraft, lookup: { ...validDraft.lookup!, lat: Infinity } },
      { ...validDraft, lookup: { ...validDraft.lookup!, lat: 90.1 } },
      { ...validDraft, lookup: { ...validDraft.lookup!, lng: -180.1 } },
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

  it("does not throw when draft writes are denied", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    });

    expect(() => saveSetupDraft(validDraft)).not.toThrow();
  });

  it("does not throw when draft removal is denied", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new DOMException("Storage denied", "SecurityError");
    });

    expect(() => clearSetupDraft()).not.toThrow();
  });
});

describe("saved advice storage", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("restores advice only for its matching garden profile", () => {
    saveAdvice(scopedAdvice, profile);

    expect(loadSavedAdvice(profile)).toEqual(scopedAdvice);
    expect(
      loadSavedAdvice({
        ...profile,
        postcode: "EH1 1YZ",
        lat: 55.9533,
        lng: -3.1883,
      }),
    ).toBeNull();
    expect(
      loadSavedAdvice({ ...profile, vegetables: ["tomato", "courgette"] }),
    ).toBeNull();
  });
});
