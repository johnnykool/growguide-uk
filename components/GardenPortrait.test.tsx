import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import GardenPortrait, { getGardenPortraitModel } from "./GardenPortrait";

const baseProps = {
  postcode: "SW1A 1AA",
  region: "London",
  vegetables: ["tomato", "carrot", "lettuce", "pea", "potato", "onion", "garlic"],
  plotSize: "medium" as const,
  environment: ["raised-beds"],
  equipment: ["trowel", "watering-can"],
};

afterEach(cleanup);

describe("GardenPortrait", () => {
  it("builds a categorical portrait from profile facts without measured positions", () => {
    const model = getGardenPortraitModel(baseProps);
    expect(model.crops.map((crop) => crop.name)).toEqual([
      "Tomato", "Carrot", "Lettuce", "Pea", "Potato", "Onion",
    ]);
    expect(model.remainingCropCount).toBe(1);
    expect(model.plotLabel).toBe("Medium plot (4–20m²)");
    expect(model.environmentLabels).toEqual(["Raised beds"]);
    expect(model).not.toHaveProperty("coordinates");
  });

  it("exposes the facts and labels the drawing as a schematic", () => {
    render(<GardenPortrait {...baseProps} variant="dashboard" />);
    const portrait = screen.getByRole("region", { name: "Your garden portrait" });
    expect(within(portrait).getByText("Garden portrait")).toBeInTheDocument();
    expect(within(portrait).getByText("Schematic — not to scale")).toBeInTheDocument();
    expect(within(portrait).getByText("SW1A 1AA · London")).toBeInTheDocument();
    expect(within(portrait).getByText("+1 crop")).toBeInTheDocument();
  });

  it.each([
    { plotSize: "windowsill", guideBandCount: 2 },
    { plotSize: "small", guideBandCount: 3 },
    { plotSize: "medium", guideBandCount: 4 },
    { plotSize: "large", guideBandCount: 6 },
  ] as const)(
    "renders $plotSize as a distinct categorical field with $guideBandCount guide bands",
    ({ plotSize, guideBandCount }) => {
      render(
        <GardenPortrait
          {...baseProps}
          plotSize={plotSize}
          variant="dashboard"
        />,
      );

      const field = screen.getByTestId("garden-field-grid");
      expect(field.querySelectorAll("[data-field-guide-band]")).toHaveLength(
        guideBandCount,
      );
    },
  );

  it("draws a labelled authored structure for every selected environment", () => {
    const environments = [
      ["open-ground", "Open ground"],
      ["raised-beds", "Raised beds"],
      ["greenhouse", "Greenhouse"],
      ["polytunnel", "Polytunnel"],
      ["containers", "Containers"],
    ] as const;

    render(
      <GardenPortrait
        {...baseProps}
        environment={environments.map(([id]) => id)}
        variant="dashboard"
      />,
    );

    const register = screen.getByRole("list", {
      name: "Selected growing environments",
    });
    for (const [id, label] of environments) {
      const item = within(register).getByText(label).closest("li");
      expect(item).toBeTruthy();
      expect(
        item?.querySelector(`[data-environment-structure="${id}"]`),
      ).toBeInTheDocument();
    }
  });

  it("renders a visible empty grid and message without inventing selections", () => {
    render(
      <GardenPortrait
        vegetables={[]}
        plotSize="medium"
        environment={[]}
        equipment={[]}
        variant="setup"
      />,
    );
    const emptyGrid = screen.getByTestId("garden-field-grid");
    expect(emptyGrid).toHaveAttribute("data-empty-grid", "true");
    expect(
      emptyGrid.querySelectorAll("[data-field-guide-band]"),
    ).toHaveLength(4);
    expect(
      emptyGrid.querySelectorAll("[data-field-guide-cell]"),
    ).toHaveLength(8);
    expect(screen.getByText("Your selections will shape this portrait.")).toBeInTheDocument();
    expect(screen.queryByText(/London/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("list", { name: "Selected growing environments" }),
    ).not.toBeInTheDocument();
  });
});
