import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SeasonalCalendar from "./SeasonalCalendar";

describe("SeasonalCalendar", () => {
  it("names every crop month with its seasonal state", () => {
    render(<SeasonalCalendar vegetableIds={["tomato"]} />);

    expect(
      screen.getByRole("region", { name: "This season" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "This season" }),
    ).toBeVisible();
    expect(
      screen.getByRole("region", { name: "Seasonal timeline" }),
    ).toHaveAttribute("tabindex", "0");
    expect(screen.getByText("September")).toBeVisible();
    const harvest = screen.getByRole("img", {
      name: "Tomato, August: harvest",
    });
    expect(harvest).toBeVisible();
    expect(harvest).toHaveClass("bg-rain-ink");

    const sowOrPlant = screen.getByRole("img", {
      name: "Tomato, March: sow or plant",
    });
    expect(sowOrPlant).toBeVisible();
    expect(sowOrPlant).toHaveClass("bg-moss-veil");

    const dormant = screen.getByRole("img", {
      name: "Tomato, December: dormant",
    });
    expect(dormant).toBeVisible();
    expect(dormant).toHaveClass("bg-pale-mineral");
    expect(
      screen.getAllByRole("img", {
        name: /^Tomato, .+: (sow or plant|harvest|dormant)$/,
      }),
    ).toHaveLength(12);
  });
});
