import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TIMELINE_LABELS } from "@/lib/types";
import TimelineFilter from "./TimelineFilter";

afterEach(cleanup);

describe("TimelineFilter", () => {
  it("offers every timeline through a labeled mobile select", () => {
    render(<TimelineFilter value="7-days" onChange={vi.fn()} />);

    const select = screen.getByRole("combobox", { name: "Advice timeline" });
    const labels = screen
      .getAllByRole("option")
      .map((option) => option.textContent);

    expect(select).toHaveValue("7-days");
    expect(labels).toEqual(Object.values(TIMELINE_LABELS));
  });

  it("changes the controlled timeline from the mobile select", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimelineFilter value="7-days" onChange={onChange} />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Advice timeline" }),
      "30-days",
    );

    expect(onChange).toHaveBeenCalledWith("30-days");
  });

  it("keeps common timelines visible and places extended timelines in one disclosure", () => {
    render(<TimelineFilter value="30-days" onChange={vi.fn()} />);

    const group = screen.getByRole("radiogroup", { name: "Advice timeline" });

    expect(group).toBeInTheDocument();
    for (const timeline of ["24-hours", "3-days", "7-days"] as const) {
      expect(
        screen.getByRole("radio", { name: TIMELINE_LABELS[timeline] }),
      ).toBeVisible();
    }
    expect(screen.getByText(/More timeframes/)).toBeVisible();
    expect(screen.getByText(/More timeframes/).closest("details")).toBeTruthy();
    expect(
      screen.getByRole("radio", { name: TIMELINE_LABELS["30-days"] }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("selects an extended timeline through the More timeframes disclosure", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimelineFilter value="7-days" onChange={onChange} />);

    await user.click(screen.getByText("More timeframes"));
    await user.click(
      screen.getByRole("radio", { name: TIMELINE_LABELS["30-days"] }),
    );

    expect(onChange).toHaveBeenCalledWith("30-days");
    expect(screen.getByText("More timeframes").closest("details")).not.toHaveAttribute(
      "open",
    );
  });
});
