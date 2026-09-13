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
    // Exact string, not a regex: the credits line also names GrowGuide UK, so
    // a substring match would find both it and the copyright mark.
    expect(within(footer).getByText("GrowGuide UK")).toBeVisible();
    const supportLink = within(footer).getByRole("link", {
      name: /Support GrowGuide/i,
    });

    expect(within(footer).getByText("Help cover weather and AI costs.")).toBeVisible();
    expect(supportLink).toHaveAttribute("href", "https://ko-fi.com/growguideuk");
    expect(supportLink).toHaveAttribute("target", "_blank");
    expect(supportLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(within(footer).getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/privacy",
    );

    const renderedShell = [
      document.body.textContent,
      ...within(footer)
        .getAllByRole("link")
        .map((anchor) => anchor.getAttribute("href")),
    ]
      .join(" ")
      .toLowerCase();

    expect(renderedShell).not.toContain("crystal" + "pocket");
    expect(
      within(footer).getByText(
        /Weather by Met Office · Map tiles by OpenWeatherMap/i,
      ),
    ).toBeVisible();
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
  it("credits growing data to GrowGuide UK rather than a horticultural body", () => {
    // Scope to this render: the suite runs without Testing Library's global
    // cleanup, so an unscoped role query would also match the earlier footer.
    const { container } = render(<Footer />);

    const footer = within(container).getByRole("contentinfo");

    expect(
      within(footer).getByText(/Growing data compiled by GrowGuide UK/i),
    ).toBeVisible();

    const renderedFooter = [
      footer.textContent,
      ...within(footer)
        .getAllByRole("link")
        .map((anchor) => anchor.getAttribute("href")),
    ]
      .join(" ")
      .toLowerCase();

    expect(renderedFooter).not.toContain("rhs");
    expect(renderedFooter).not.toContain("royal horticultural");
  });
});
