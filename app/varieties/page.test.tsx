import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "@vercel/analytics";
import VarietiesPage from "./page";
import Tomatoes from "./tomatoes/page";
import Courgettes from "./courgettes/page";
import SpringOnions from "./spring-onions/page";
import Cucumbers from "./cucumbers/page";
import { VARIETY_GUIDES } from "@/data/variety-guides";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));
afterEach(cleanup);
beforeEach(() => vi.mocked(track).mockReset());

describe("variety guide journeys", () => {
  it("offers every starter crop from the hub without retailer links", () => {
    render(<VarietiesPage />);
    for (const slug of ["tomatoes", "courgettes", "spring-onions", "cucumbers"]) {
      expect(document.querySelector(`a[href="/varieties/${slug}"]`)).toBeInTheDocument();
    }
    expect(screen.queryByRole("link", { name: /View seeds/ })).not.toBeInTheDocument();
  });

  it.each([
    ["tomatoes", Tomatoes, "Gardener’s Delight", "gardeners-delight"],
    ["courgettes", Courgettes, "Defender F1", "defender-f1"],
    ["spring-onions", SpringOnions, "White Lisbon", "white-lisbon"],
    ["cucumbers", Cucumbers, "Marketmore", "marketmore"],
  ] as const)("connects %s guidance to named seeds and back to the planner", (crop, Page, name, variety) => {
    render(<Page />);
    expect(screen.getAllByRole("article")).toHaveLength(4);
    const card = screen.getByRole("article", { name });
    const data = VARIETY_GUIDES.find(g => g.slug === crop)!.varieties.find(v => v.id === variety)!;
    expect(within(card).getByText(data.general)).toBeInTheDocument();
    expect(within(card).getByText(data.limitation)).toBeInTheDocument();
    for (const field of ["Where it grows", "Conditions", "Containers", "Size and effort", "Height & spread", "Difficulty", "When", "Sow", "Plant", "Harvest", "Pests & diseases", "Bear in mind"]) {
      expect(within(card).getByText(field)).toBeInTheDocument();
    }
    const seed = within(card).getByRole("link", { name: /View seeds at Thompson & Morgan/ });
    expect(new URL(seed.getAttribute("href")!).hostname).toBe("www.thompson-morgan.com");
    expect(seed).not.toHaveAttribute("rel", expect.stringContaining("sponsored"));
    fireEvent.click(seed);
    expect(track).toHaveBeenCalledWith("seed_link_click", { crop, variety, retailer: "Thompson & Morgan", affiliate: false });
    expect(screen.getByRole("link", { name: /Back to your personalised Grow Guide/ })).toHaveAttribute("href", "/");
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/RHS|Buy now|Lowest price/);
  });
});
