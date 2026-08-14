import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
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

const existingProfile: UserProfile = {
  postcode: "SW1A 1AA",
  lat: 51.501,
  lng: -0.141,
  region: "London",
  vegetables: ["tomato"],
  plotSize: "large",
  environment: ["greenhouse"],
  equipment: ["trowel"],
  lastUpdated: "2026-08-09",
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((next) => {
    resolve = next;
  });
  return { promise, resolve };
}

function postcodeResponse(postcode: string, region: string, ok = true) {
  return {
    ok,
    status: ok ? 200 : 404,
    json: vi.fn().mockResolvedValue(
      ok
        ? {
            ...postcodeResult,
            result: {
              ...postcodeResult.result,
              postcode,
              region,
            },
          }
        : { status: 404, error: "Postcode not found" },
    ),
  };
}

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

async function completeThroughStageFour(
  user: ReturnType<typeof userEvent.setup>,
) {
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
  await user.click(
    screen.getByRole("button", { name: /Continue to tools/i }),
  );
  await user.click(screen.getByRole("button", { name: /Save my garden/i }));
}

describe("SetupWizard", () => {
  it("introduces the four-step garden setup", () => {
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Tell us about your garden",
      }),
    ).toBeVisible();
    expect(
      screen.getByText("Four short steps. Saved on this device."),
    ).toBeVisible();
  });

  it("labels setup as an update for an existing garden", () => {
    render(<SetupWizard initial={existingProfile} onSave={vi.fn()} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Update your garden" }),
    ).toBeVisible();
  });

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
    expect(
      screen.queryByText("Check your postcode to continue."),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /UK postcode.*required/i }),
    ).toHaveAttribute(
      "aria-describedby",
      "postcode-help postcode-feedback",
    );
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

  it("does not let an older postcode success replace the latest location", async () => {
    const older = deferred<ReturnType<typeof postcodeResponse>>();
    const newer = deferred<ReturnType<typeof postcodeResponse>>();
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => older.promise)
      .mockImplementationOnce(() => newer.promise);
    vi.stubGlobal("fetch", fetchMock);
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    const postcodeInput = screen.getByRole("textbox", { name: /postcode/i });
    fireEvent.change(postcodeInput, { target: { value: "M1 1AE" } });
    fireEvent.keyDown(postcodeInput, { key: "Enter" });
    fireEvent.change(postcodeInput, { target: { value: "SW1A 1AA" } });
    fireEvent.keyDown(postcodeInput, { key: "Enter" });

    await act(async () => {
      newer.resolve(postcodeResponse("SW1A 1AA", "London"));
    });
    await waitFor(() => expect(screen.getByText("SW1A 1AA")).toBeVisible());
    expect(document.getElementById("postcode-feedback")).toHaveTextContent(
      "London",
    );

    await act(async () => {
      older.resolve(postcodeResponse("M1 1AE", "North West"));
    });

    expect(postcodeInput).toHaveValue("SW1A 1AA");
    expect(screen.getByText("SW1A 1AA")).toBeVisible();
    expect(document.getElementById("postcode-feedback")).toHaveTextContent(
      "London",
    );
    expect(document.getElementById("postcode-feedback")).not.toHaveTextContent(
      "North West",
    );
  });

  it("does not let an older postcode failure erase the latest success", async () => {
    const older = deferred<ReturnType<typeof postcodeResponse>>();
    const newer = deferred<ReturnType<typeof postcodeResponse>>();
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockImplementationOnce(() => older.promise)
        .mockImplementationOnce(() => newer.promise),
    );
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    const postcodeInput = screen.getByRole("textbox", { name: /postcode/i });
    fireEvent.change(postcodeInput, { target: { value: "M1 1AE" } });
    fireEvent.keyDown(postcodeInput, { key: "Enter" });
    fireEvent.change(postcodeInput, { target: { value: "SW1A 1AA" } });
    fireEvent.keyDown(postcodeInput, { key: "Enter" });

    await act(async () => {
      newer.resolve(postcodeResponse("SW1A 1AA", "London"));
    });
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Continue to crops/i }),
      ).toBeEnabled(),
    );

    await act(async () => {
      older.resolve(postcodeResponse("M1 1AE", "North West", false));
    });

    expect(screen.getByText("SW1A 1AA")).toBeVisible();
    expect(document.getElementById("postcode-feedback")).toHaveTextContent(
      "London",
    );
    expect(
      screen.getByRole("button", { name: /Continue to crops/i }),
    ).toBeEnabled();
    expect(
      screen.queryByText(/We couldn't find that postcode/i),
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
    expect(screen.getByText("1 crop selected.")).toBeVisible();
    expect(
      screen.queryByText("Select at least one crop to continue."),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Crop selection" }),
    ).not.toHaveAttribute("aria-describedby");
  });

  it("pluralises the setup crop selection count", async () => {
    const user = userEvent.setup();
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    await validateLocation(user);
    await user.click(screen.getByRole("button", { name: /Continue to crops/i }));
    await user.click(screen.getByRole("button", { name: /Browse all crops/i }));
    await user.click(screen.getByRole("button", { name: /Tomato/i }));
    await user.click(screen.getByRole("button", { name: /Carrot/i }));

    expect(screen.getByText("2 crops selected.")).toBeVisible();
  });

  it("keeps one live garden portrait mounted as crop selections change", async () => {
    const user = userEvent.setup();
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    const portrait = screen.getByRole("region", {
      name: "Your garden portrait",
    });

    await validateLocation(user);
    await user.click(screen.getByRole("button", { name: /Continue to crops/i }));
    await user.click(screen.getByRole("button", { name: /Browse all crops/i }));
    await user.click(screen.getByRole("button", { name: /Lettuce/i }));

    expect(
      screen.getByRole("region", { name: "Your garden portrait" }),
    ).toBe(portrait);
    expect(within(portrait).getByText("Lettuce")).toBeVisible();
  });

  it("summarises completed setup values in the stage list", async () => {
    const user = userEvent.setup();
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    await validateLocation(user);
    await user.click(screen.getByRole("button", { name: /Continue to crops/i }));
    const stages = screen.getByRole("navigation", { name: /Setup stages/i });
    expect(within(stages).getByText("SW1A 1AA · London")).toBeVisible();

    await user.click(screen.getByRole("button", { name: /Browse all crops/i }));
    await user.click(screen.getByRole("button", { name: /Tomato/i }));
    await user.click(screen.getByRole("button", { name: /Continue to plot/i }));
    expect(within(stages).getByText("1 crop selected")).toBeVisible();

    await user.click(screen.getByRole("button", { name: /Continue to tools/i }));
    expect(within(stages).getByText("Medium plot (4–20m²)")).toBeVisible();
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

  it("labels both non-blocking stages as optional", async () => {
    const user = userEvent.setup();
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    await validateLocation(user);
    await user.click(screen.getByRole("button", { name: /Continue to crops/i }));
    await user.click(screen.getByRole("button", { name: /Browse all crops/i }));
    await user.click(screen.getByRole("button", { name: /Tomato/i }));
    await user.click(screen.getByRole("button", { name: /Continue to plot/i }));

    expect(
      screen.getByRole("heading", { name: /Your plot.*optional/i }),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: /Continue to tools/i }));

    expect(
      screen.getByRole("heading", { name: /Your tool shed.*optional/i }),
    ).toBeVisible();
  });

  it("removes every forward route after an edited postcode becomes invalid", async () => {
    const user = userEvent.setup();
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    await completeThroughStageFour(user);
    await user.click(
      screen.getByRole("button", { name: /Edit your location/i }),
    );

    const postcodeInput = screen.getByRole("textbox", { name: /postcode/i });
    await user.clear(postcodeInput);
    await user.type(postcodeInput, "not a postcode");
    await user.click(screen.getByRole("button", { name: /Check postcode/i }));

    expect(postcodeInput).toHaveFocus();
    expect(
      screen.getByRole("button", { name: /Continue to crops/i }),
    ).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: /Edit what you want to grow/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Edit your plot/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Edit your tool shed/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Save my garden/i }),
    ).not.toBeInTheDocument();
  });

  it("removes plot and tool routes after the final crop is deselected", async () => {
    const user = userEvent.setup();
    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    await completeThroughStageFour(user);
    await user.click(
      screen.getByRole("button", { name: /Edit what you want to grow/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /Tomato/i, pressed: true }),
    );

    expect(
      screen.getByRole("button", { name: /Continue to plot/i }),
    ).toBeDisabled();
    expect(screen.getByRole("group", { name: /Crop selection/i })).toHaveFocus();
    expect(
      screen.queryByRole("button", { name: /Edit your plot/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Edit your tool shed/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Save my garden/i }),
    ).not.toBeInTheDocument();
  });

  it.each([
    {
      name: "location when a stage-four draft has no validated lookup",
      draft: {
        ...restoredDraft,
        activeStep: 4,
        lookup: null,
      } satisfies SetupDraftV1,
      stepText: "Step 1 of 4",
      heading: /Where do you garden/i,
    },
    {
      name: "crops when a stage-three draft has no crop selection",
      draft: {
        ...restoredDraft,
        activeStep: 3,
        vegetables: [],
      } satisfies SetupDraftV1,
      stepText: "Step 2 of 4",
      heading: /What would you like to grow/i,
    },
  ])("normalises a restored draft to $name", ({ draft, stepText, heading }) => {
    saveSetupDraft(draft);

    render(<SetupWizard initial={null} onSave={vi.fn()} />);

    expect(screen.getByText(stepText)).toBeVisible();
    expect(screen.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    expect(
      screen.queryByRole("button", { name: /Edit your plot|Edit your tool shed/i }),
    ).not.toBeInTheDocument();
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
