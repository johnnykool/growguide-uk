import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PLOT_SIZE_LABELS, UserProfile } from "@/lib/types";
import PlotSummary from "./PlotSummary";

afterEach(cleanup);

const profile: UserProfile = {
  postcode: "BS1 5AH",
  lat: 51.4545,
  lng: -2.5879,
  region: "South West England",
  vegetables: ["tomato"],
  plotSize: "small",
  environment: ["raised-beds"],
  lastUpdated: "2026-08-08T09:00:00.000Z",
};

describe("PlotSummary", () => {
  it("summarises one selected crop and its current-month activity", () => {
    render(<PlotSummary profile={profile} month={8} />);

    expect(screen.getByText("August")).toBeVisible();
    expect(screen.getByText("1 crop")).toBeVisible();
    expect(screen.getByText("1 active this month")).toBeVisible();
    expect(screen.getByText(PLOT_SIZE_LABELS.small)).toBeVisible();
  });

  it("pluralises the selected crop count", () => {
    render(
      <PlotSummary
        profile={{ ...profile, vegetables: ["tomato", "courgette"] }}
        month={8}
      />,
    );

    expect(screen.getByText("2 crops")).toBeVisible();
    expect(screen.getByText("2 active this month")).toBeVisible();
  });
});
