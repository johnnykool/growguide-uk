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
      within(header).queryByRole("link", {
        name: new RegExp("crystal" + "pocket", "i"),
      }),
    ).not.toBeInTheDocument();
    expect(within(footer).getByText(/GrowGuide UK/i)).toBeVisible();
    const supportLink = within(footer).getByRole("link", {
      name: /Support GrowGuide/i,
    });

    expect(within(footer).getByText("Help cover weather and AI costs.")).toBeVisible();
    expect(supportLink).toHaveAttribute("href", "https://ko-fi.com/growguideuk");
    expect(supportLink).toHaveAttribute("target", "_blank");
    expect(supportLink).toHaveAttribute("rel", "noopener noreferrer");

    const renderedShell = [
      document.body.textContent,
      ...within(footer)
        .getAllByRole("link")
        .map((anchor) => anchor.getAttribute("href")),
    ]
      .join(" ")
      .toLowerCase();

    expect(renderedShell).not.toContain("crystal" + "pocket");
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
