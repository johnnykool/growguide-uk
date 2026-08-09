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
      screen.getByText(/exact postcode.*api\.postcodes\.io/i),
    ).toBeVisible();
    expect(
      screen.getByText(/coordinates.*OpenWeatherMap/i),
    ).toBeVisible();
    expect(
      screen.getByText(/Anthropic receives bounded region, garden, and derived-weather context/i),
    ).toBeVisible();
    expect(
      screen.getByText(/does not receive your exact postcode or coordinates/i),
    ).toBeVisible();
    expect(
      screen.getByText(/creates no user accounts, sells no data, and runs no advertising trackers/i),
    ).toBeVisible();
    expect(screen.queryByText(/accept cookies/i)).not.toBeInTheDocument();
  });

  it("has privacy-specific canonical and social metadata", () => {
    expect(metadata.alternates).toEqual({ canonical: "/privacy" });
    expect(metadata.openGraph).toMatchObject({
      url: "https://growguideuk.co.uk/privacy",
      title: "Privacy | GrowGuide UK",
      description: "How GrowGuide UK handles analytics and gardening data.",
      images: [
        expect.objectContaining({
          url: "/images/growguide-kofi-logo.png",
          alt: "GrowGuide UK seedling logo",
        }),
      ],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Privacy | GrowGuide UK",
      description: "How GrowGuide UK handles analytics and gardening data.",
      images: ["/images/growguide-kofi-logo.png"],
    });
  });
});
