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
  equipment: ["trowel"],
  lastUpdated: "2026-08-08T09:00:00.000Z",
};

describe("PlotSummary", () => {
  it("summarises one selected crop and its current-month activity", () => {
    const view = render(<PlotSummary profile={profile} month={8} />);

    expect(
      screen.getByRole("region", { name: "Your plot profile" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Your plot" })).toBeVisible();
    expect(screen.getByText("Tomato")).toBeVisible();
    expect(screen.getByText("Raised beds")).toBeVisible();
    expect(screen.getByText("1 tool")).toBeVisible();
    expect(screen.getByText("Small raised bed (<4m²)")).toBeVisible();
    expect(screen.getByText("August")).toBeVisible();
    expect(screen.getByText("1 crop")).toBeVisible();
    expect(screen.getByText("1 active this month")).toBeVisible();
    expect(screen.getByText(PLOT_SIZE_LABELS.small)).toBeVisible();
    expect(view.container).not.toHaveTextContent("✿");
    expect(
      view.container.querySelector('[data-black-flower="true"]'),
    ).toBeInTheDocument();
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

  it("labels empty growing conditions as not specified", () => {
    render(
      <PlotSummary profile={{ ...profile, environment: [] }} month={8} />,
    );

    expect(screen.getByText("Not specified")).toBeVisible();
  });
});
