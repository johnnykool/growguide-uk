import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SetupDraftV1, UserProfile } from "@/lib/types";
import {
  loadProfile,
  loadSetupDraft,
  saveProfile,
  saveSetupDraft,
} from "@/lib/storage";
import Home from "./page";

const effectControl = vi.hoisted(() => ({ enabled: true }));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();

  return {
    ...actual,
    useEffect: (...args: Parameters<typeof actual.useEffect>) => {
      if (effectControl.enabled) actual.useEffect(...args);
    },
  };
});

const profile: UserProfile = {
  postcode: "SW1A 1AA",
  lat: 51.501,
  lng: -0.141,
  region: "London",
  vegetables: ["tomato"],
  plotSize: "medium",
  environment: [],
  equipment: [],
  lastUpdated: "2026-08-08",
};

const draft: SetupDraftV1 = {
  version: 1,
  activeStep: 4,
  postcode: profile.postcode,
  lookup: {
    postcode: profile.postcode,
    lat: profile.lat,
    lng: profile.lng,
    region: profile.region,
  },
  vegetables: profile.vegetables,
  plotSize: profile.plotSize,
  environment: profile.environment,
  equipment: profile.equipment,
  showAllCrops: false,
  showAllEquipment: false,
};

vi.mock("@/components/SetupWizard", () => ({
  default: ({
    onSave,
    onCancel,
  }: {
    onSave: (next: UserProfile) => void;
    onCancel?: () => void;
  }) => (
    <div>
      <button type="button" onClick={() => onSave(profile)}>
        Complete setup
      </button>
      <button type="button" onClick={() => saveSetupDraft(draft)}>
        Create edit draft
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Cancel edit
        </button>
      )}
    </div>
  ),
}));

vi.mock("@/components/Dashboard", () => ({
  default: ({ onEdit }: { onEdit: () => void }) => (
    <div>
      <p>Garden dashboard</p>
      <button type="button" onClick={onEdit}>
        Edit garden
      </button>
    </div>
  ),
}));

beforeEach(() => {
  window.localStorage.clear();
  window.scrollTo = vi.fn();
  effectControl.enabled = true;
});

afterEach(cleanup);

describe("Home", () => {
  it("announces the loading state politely", () => {
    effectControl.enabled = false;
    render(<Home />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("Opening the potting shed…")).toBeVisible();
  });

  it("clears the setup draft only after the successful profile save path", async () => {
    const user = userEvent.setup();
    saveSetupDraft(draft);

    render(<Home />);
    await user.click(await screen.findByRole("button", { name: /Complete setup/i }));

    await waitFor(() => {
      expect(loadProfile()).toEqual(profile);
      expect(loadSetupDraft()).toBeNull();
    });
  });

  it("clears only the edit draft when a saved-profile edit is cancelled", async () => {
    const user = userEvent.setup();
    saveProfile(profile);

    render(<Home />);
    await user.click(await screen.findByRole("button", { name: /Edit garden/i }));
    await user.click(
      screen.getByRole("button", { name: /Create edit draft/i }),
    );
    expect(loadSetupDraft()).toEqual(draft);

    await user.click(screen.getByRole("button", { name: /Cancel edit/i }));

    expect(await screen.findByText("Garden dashboard")).toBeVisible();
    expect(loadProfile()).toEqual(profile);
    expect(loadSetupDraft()).toBeNull();
  });
});
