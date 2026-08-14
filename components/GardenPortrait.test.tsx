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

  it("renders a useful empty setup state without inventing selections", () => {
    render(
      <GardenPortrait
        vegetables={[]}
        plotSize="medium"
        environment={[]}
        equipment={[]}
        variant="setup"
      />,
    );
    expect(screen.getByText("Your selections will shape this portrait.")).toBeInTheDocument();
    expect(screen.queryByText(/London/)).not.toBeInTheDocument();
  });
});
