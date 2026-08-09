import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SeasonalCalendar from "./SeasonalCalendar";

describe("SeasonalCalendar", () => {
  it("names every crop month with its seasonal state", () => {
    render(<SeasonalCalendar vegetableIds={["tomato"]} />);

    expect(
      screen.getByRole("img", { name: "Tomato, August: harvest" }),
    ).toBeVisible();
    expect(
      screen.getByRole("img", { name: "Tomato, March: sow or plant" }),
    ).toBeVisible();
    expect(
      screen.getByRole("img", { name: "Tomato, December: dormant" }),
    ).toBeVisible();
    expect(
      screen.getAllByRole("img", {
        name: /^Tomato, .+: (sow or plant|harvest|dormant)$/,
      }),
    ).toHaveLength(12);
  });
});
