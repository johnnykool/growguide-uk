import { useState } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import VegetableGrid from "./VegetableGrid";

afterEach(cleanup);

function SearchableVegetableGrid() {
  const [search, setSearch] = useState("");

  return (
    <VegetableGrid
      selected={[]}
      onToggle={vi.fn()}
      month={8}
      showAll
      onShowAllChange={vi.fn()}
      search={search}
      onSearchChange={setSearch}
    />
  );
}

describe("VegetableGrid", () => {
  it("uses ruled crop controls without photos and exposes selection state", () => {
    const { container } = render(
      <VegetableGrid selected={["lettuce"]} onToggle={vi.fn()} />,
    );

    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Lettuce/i, pressed: true }),
    ).toBeVisible();
  });

  it("keeps the full crop catalogue available for the legacy two-prop call site", () => {
    render(<VegetableGrid selected={[]} onToggle={vi.fn()} />);

    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(32);
    expect(
      screen.queryByRole("button", { name: /Browse all crops/i }),
    ).not.toBeInTheDocument();
  });

  it("shows six seasonal crop recommendations before browsing the full catalogue", async () => {
    const user = userEvent.setup();
    const onShowAllChange = vi.fn();

    render(
      <VegetableGrid
        selected={[]}
        onToggle={vi.fn()}
        month={8}
        showAll={false}
        onShowAllChange={onShowAllChange}
        search=""
        onSearchChange={vi.fn()}
      />,
    );

    expect(
      screen
        .getByTestId("seasonal-recommendations")
        .querySelectorAll('[aria-pressed="false"]'),
    ).toHaveLength(6);
    expect(
      screen.getAllByText(/Sow outside now|Plant out now|Harvest now/).length,
    ).toBeGreaterThan(0);

    await user.click(
      screen.getByRole("button", { name: /Browse all crops/i }),
    );

    expect(onShowAllChange).toHaveBeenCalledWith(true);
  });

  it("filters expanded crop categories by the search term", async () => {
    const user = userEvent.setup();

    render(<SearchableVegetableGrid />);

    await user.type(screen.getByRole("searchbox", { name: /search crops/i }), "tom");

    expect(screen.getByRole("button", { name: /tomato/i })).toBeVisible();
    expect(screen.queryByRole("button", { name: /courgette/i })).not.toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1);
  });

  it("explains when a crop search has no matches and lets the gardener clear it", async () => {
    const user = userEvent.setup();

    render(<SearchableVegetableGrid />);

    await user.type(screen.getByRole("searchbox", { name: /search crops/i }), "not-a-crop");

    expect(screen.getByText("No crops match")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Clear search/i }));

    expect(screen.getByRole("button", { name: /tomato/i })).toBeVisible();
  });
});
