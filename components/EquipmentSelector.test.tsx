import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import EquipmentSelector from "./EquipmentSelector";

afterEach(cleanup);

describe("EquipmentSelector", () => {
  it("keeps every tool available for the legacy two-prop call site", () => {
    render(<EquipmentSelector selected={[]} onToggle={vi.fn()} />);

    expect(screen.getAllByRole("checkbox")).toHaveLength(17);
    expect(
      screen.queryByRole("button", { name: /Show all tools/i }),
    ).not.toBeInTheDocument();
  });

  it("starts with the six common tools", () => {
    render(
      <EquipmentSelector
        selected={[]}
        onToggle={vi.fn()}
        showAll={false}
        onShowAllChange={vi.fn()}
      />,
    );

    expect(
      screen
        .getAllByRole("checkbox")
        .map((input) => input.closest("label")?.textContent),
    ).toEqual([
      "Spade",
      "Fork",
      "Trowel",
      "Secateurs",
      "Watering can",
      "Seed trays",
    ]);
  });

  it("reveals every available tool after the gardener asks to see them", async () => {
    const user = userEvent.setup();
    const onShowAllChange = vi.fn();

    const { rerender } = render(
      <EquipmentSelector
        selected={[]}
        onToggle={vi.fn()}
        showAll={false}
        onShowAllChange={onShowAllChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Show all tools/i }));
    expect(onShowAllChange).toHaveBeenCalledWith(true);

    rerender(
      <EquipmentSelector
        selected={[]}
        onToggle={vi.fn()}
        showAll
        onShowAllChange={onShowAllChange}
      />,
    );

    expect(screen.getAllByRole("checkbox")).toHaveLength(17);
  });
});
