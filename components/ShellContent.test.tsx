import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Footer from "./Footer";
import Header from "./Header";
import {
  HeaderWeatherProvider,
  usePublishHeaderWeather,
} from "./HeaderWeatherContext";

function WeatherHeader() {
  usePublishHeaderWeather("SW1A 1AA", {
    current: {
      temp: 16,
      description: "light rain",
      icon: "10d",
    },
    daily: [],
    warnings: { rainSoon: true, frostSoon: false },
  });

  return <Header />;
}

afterEach(cleanup);

describe("GrowGuide shell content", () => {
  it("keeps the rebranded footer's Ko-fi and privacy routes direct", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(
      within(footer).getByRole("link", { name: "Support GrowGuide" }),
    ).toHaveAttribute("href", "https://ko-fi.com/growguideuk");
    expect(within(footer).getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
  });

  it("uses a contrast-safe mark in the pale header", () => {
    render(<Header />);

    const homeLink = screen.getByRole("link", { name: "GrowGuide UK" });
    expect(homeLink.querySelector("svg")).toHaveClass("text-rain-ink");
  });

  it("groups the published weather summary in a current garden weather region", () => {
    render(
      <HeaderWeatherProvider>
        <WeatherHeader />
      </HeaderWeatherProvider>,
    );

    const weather = screen.getByRole("region", {
      name: "Current garden weather",
    });
    expect(within(weather).getByText("SW1A 1AA")).toBeVisible();
    expect(within(weather).getByText("16°C")).toBeVisible();
    expect(within(weather).getByText("light rain")).toBeVisible();
  });

  it("keeps product provenance in the compact footer, not the header", () => {
    render(
      <>
        <Header />
        <Footer />
      </>,
    );

    const header = screen.getByRole("banner");
    const footer = screen.getByRole("contentinfo");

    const homeLink = within(header).getByRole("link", { name: "GrowGuide UK" });
    expect(homeLink).toBeVisible();
    expect(within(homeLink).queryByRole("img")).not.toBeInTheDocument();
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
