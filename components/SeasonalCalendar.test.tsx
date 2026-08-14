import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SeasonalCalendar from "./SeasonalCalendar";

const originalScrollTo = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "scrollTo",
);
let scrollTo: ReturnType<typeof vi.fn>;

beforeEach(() => {
  scrollTo = vi.fn();
  Object.defineProperty(HTMLElement.prototype, "scrollTo", {
    configurable: true,
    value: scrollTo,
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  if (originalScrollTo) {
    Object.defineProperty(HTMLElement.prototype, "scrollTo", originalScrollTo);
  } else {
    delete (HTMLElement.prototype as { scrollTo?: unknown }).scrollTo;
  }
});

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

  it("aligns the current month in the accessible timeline", () => {
    render(<SeasonalCalendar vegetableIds={["tomato"]} />);

    expect(screen.getByText("Months →")).toBeVisible();
    expect(
      screen.getByRole("region", { name: "Seasonal timeline" }),
    ).toHaveAttribute("tabindex", "0");
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenCalledWith({ left: 0, behavior: "auto" });
  });
});
