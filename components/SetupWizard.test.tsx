import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { saveSetupDraft } from "@/lib/storage";
import type { SetupDraftV1, UserProfile } from "@/lib/types";
import SetupWizard from "./SetupWizard";

const postcodeResult = {
  status: 200,
  result: {
    postcode: "SW1A 1AA",
    quality: 1,
    eastings: 529090,
    northings: 179645,
    country: "England",
    nhs_ha: "London",
    longitude: -0.141,
    latitude: 51.501,
    european_electoral_region: "London",
    primary_care_trust: "Westminster",
    region: "London",
    lsoa: "Westminster 018C",
    msoa: "Westminster 018",
    incode: "1AA",
    outcode: "SW1A",
    parliamentary_constituency: "Cities of London and Westminster",
    admin_district: "Westminster",
    parish: "Westminster, unparished area",
    admin_county: null,
    date_of_introduction: "198001",
    admin_ward: "St James's",
    ced: null,
    ccg: "NHS North West London",
    nuts: "Westminster",
    pfa: "Metropolitan Police",
    codes: {
      admin_district: "E09000033",
      admin_county: "E99999999",
      admin_ward: "E05013806",
      parish: "E43000236",
      parliamentary_constituency: "E14001172",
      ccg: "E38000245",
      ccg_id: "W2U3Z",
      ced: "E99999999",
      nuts: "TLI32",
      lsoa: "E01004736",
      msoa: "E02000977",
      lau2: "E09000033",
      pfa: "E23000001",
    },
  },
};

const restoredDraft: SetupDraftV1 = {
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
  plotSize: "large",
  environment: ["greenhouse"],
  equipment: ["trowel"],
  showAllCrops: true,
  showAllEquipment: true,
};

beforeEach(() => {
  window.localStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(postcodeResult),
    }),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function validateLocation(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole("textbox", { name: /postcode/i }), "SW1A 1AA");
  await user.click(screen.getByRole("button", { name: /Check postcode/i }));
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: /Continue to crops/i }),
    ).toBeEnabled(),
  );
}

describe("SetupWizard", () => {
  it("keeps the location gate disabled until the postcode has been checked", () => {
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /Continue to crops/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("heading", { name: /Where do you garden.*required/i }),
    ).toBeVisible();
    expect(screen.getByText("Check your postcode to continue.")).toBeVisible();
    expect(screen.getByRole("textbox", { name: /postcode/i })).toHaveAttribute(
      "aria-required",
      "true",
    );
    expect(
      screen.getByText(
        "Your postcode is used for local weather and stored on this device.",
      ),
    ).toBeVisible();
  });

  it("returns focus to the postcode field after an invalid check", async () => {
    const user = userEvent.setup();
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    const postcodeInput = screen.getByRole("textbox", { name: /postcode/i });
    await user.type(postcodeInput, "not a postcode");
    await user.click(screen.getByRole("button", { name: /Check postcode/i }));

    expect(postcodeInput).toHaveFocus();
    expect(postcodeInput).toHaveAttribute("aria-invalid", "true");
  });

  it("opens and focuses the crop stage after a successful postcode lookup", async () => {
    const user = userEvent.setup();
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    await validateLocation(user);
    await user.click(
      screen.getByRole("button", { name: /Continue to crops/i }),
    );

    const cropHeading = screen.getByRole("heading", {
      level: 2,
      name: /What would you like to grow/i,
    });
    expect(cropHeading).toHaveFocus();
    expect(screen.getByText("Step 2 of 4")).toBeVisible();
    expect(
      screen.queryByRole("textbox", { name: /postcode/i }),
    ).not.toBeInTheDocument();
  });

  it("blocks the crop stage until at least one crop is selected", async () => {
    const user = userEvent.setup();
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    await validateLocation(user);
    await user.click(
      screen.getByRole("button", { name: /Continue to crops/i }),
    );

    const continueButton = screen.getByRole("button", {
      name: /Continue to plot/i,
    });
    expect(
      screen.getByRole("heading", {
        name: /What would you like to grow.*required/i,
      }),
    ).toBeVisible();
    expect(continueButton).toBeDisabled();
    expect(
      screen.getByText("Select at least one crop to continue."),
    ).toBeVisible();

    await user.click(
      screen.getByRole("button", { name: /Browse all crops/i }),
    );
    await user.click(screen.getByRole("button", { name: /Tomato/i }));
    expect(continueButton).toBeEnabled();
  });

  it("allows optional plot and tool stages and saves the existing profile shape", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SetupWizard initial={null} onSave={onSave} />);

    await validateLocation(user);
    await user.click(
      screen.getByRole("button", { name: /Continue to crops/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /Browse all crops/i }),
    );
    await user.click(screen.getByRole("button", { name: /Tomato/i }));
    await user.click(
      screen.getByRole("button", { name: /Continue to plot/i }),
    );

    expect(
      screen.getByText("Optional — you can change this later."),
    ).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: /Continue to tools/i }),
    );

    expect(
      screen.getByText(
        "Optional — skip this if you are still building your tool shed.",
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: /Save my garden/i }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: /Skip tools and finish/i }),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: /Save my garden/i }));

    expect(onSave).toHaveBeenCalledWith({
      postcode: "SW1A 1AA",
      lat: 51.501,
      lng: -0.141,
      region: "London",
      vegetables: ["tomato"],
      plotSize: "medium",
      environment: [],
      equipment: [],
      lastUpdated: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    } satisfies UserProfile);
  });

  it("restores persisted setup values and disclosure state after remount", async () => {
    saveSetupDraft(restoredDraft);

    const firstRender = render(<SetupWizard initial={null} onSave={vi.fn()} />);

    expect(screen.getByText("Step 2 of 4")).toBeVisible();
    expect(
      screen.getByRole("button", { name: /Tomato/i, pressed: true }),
    ).toBeVisible();
    expect(screen.getByRole("searchbox", { name: /Search crops/i })).toBeVisible();

    firstRender.unmount();
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    await waitFor(() =>
      expect(screen.getByText("Step 2 of 4")).toBeVisible(),
    );
    expect(
      screen.getByRole("button", { name: /Tomato/i, pressed: true }),
    ).toBeVisible();
  });
});
