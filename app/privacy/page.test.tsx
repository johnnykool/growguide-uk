import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPage, { metadata } from "./page";

describe("PrivacyPage", () => {
  it("explains the lean data flow in plain language", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { name: "Privacy" })).toBeVisible();
    expect(
      screen.getByText(/anonymous, cookieless Vercel Web Analytics/i),
    ).toBeVisible();
    expect(screen.getByText(/stay in this browser/i)).toBeVisible();
    expect(
      screen.getByText(/exact postcode and coordinates are not included/i),
    ).toBeVisible();
    expect(screen.getByText(/do not use advertising trackers/i)).toBeVisible();
    expect(screen.queryByText(/accept cookies/i)).not.toBeInTheDocument();
  });

  it("has canonical privacy metadata", () => {
    expect(metadata.alternates).toEqual({ canonical: "/privacy" });
  });
});
