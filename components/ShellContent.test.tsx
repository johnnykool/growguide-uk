import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "./Footer";
import Header from "./Header";

describe("GrowGuide shell content", () => {
  it("keeps product provenance in the compact footer, not the header", () => {
    render(
      <>
        <Header />
        <Footer />
      </>,
    );

    const header = screen.getByRole("banner");
    const footer = screen.getByRole("contentinfo");

    expect(within(header).getByRole("link", { name: /GrowGuide UK/i })).toBeVisible();
    expect(
      within(header).queryByRole("link", { name: /CrystalPocket/i }),
    ).not.toBeInTheDocument();
    expect(within(footer).getByText(/GrowGuide UK/i)).toBeVisible();
    expect(
      within(footer).getByRole("link", { name: /crystalpocket\.com/i }),
    ).toBeVisible();
    expect(within(footer).getByText(/Weather by OpenWeatherMap/i)).toBeVisible();
    expect(within(footer).getByText(/Photos from Unsplash & Pexels/i)).toBeVisible();

    for (const socialNetwork of [
      "Facebook",
      "Instagram",
      "X",
      "YouTube",
      "LinkedIn",
    ]) {
      expect(
        within(footer).queryByRole("link", { name: socialNetwork }),
      ).not.toBeInTheDocument();
    }

    for (const anchor of within(footer).getAllByRole("link")) {
      expect(anchor.getAttribute("href")).not.toMatch(
        /(?:facebook|instagram|x|twitter|youtube|linkedin)\.com/i,
      );
    }
  });
});
