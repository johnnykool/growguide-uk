import { useState } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TIMELINE_LABELS, Timeline } from "@/lib/types";
import TimelineFilter from "./TimelineFilter";

afterEach(cleanup);

function ControlledTimelineFilter({
  initialValue,
  onChange,
}: {
  initialValue: Timeline;
  onChange: (timeline: Timeline) => void;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <TimelineFilter
      value={value}
      onChange={(timeline) => {
        onChange(timeline);
        setValue(timeline);
      }}
    />
  );
}

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

  it("keeps all six timelines split between common controls and one disclosure", () => {
    render(<TimelineFilter value="30-days" onChange={vi.fn()} />);

    const group = screen.getByRole("radiogroup", { name: "Advice timeline" });

    expect(group).toBeInTheDocument();
    for (const timeline of ["24-hours", "3-days", "7-days"] as const) {
      expect(
        screen.getByRole("radio", { name: TIMELINE_LABELS[timeline] }),
      ).toBeVisible();
    }
    const disclosure = screen.getByText(/More timeframes/).closest("details");
    expect(disclosure).toBeTruthy();
    if (!disclosure) throw new Error("Expected More timeframes disclosure");
    const extendedGroup = within(disclosure).getByRole("radiogroup", {
      name: "More timeframes",
    });
    for (const timeline of ["14-days", "30-days", "3-months"] as const) {
      expect(
        within(extendedGroup).getByRole("radio", {
          name: TIMELINE_LABELS[timeline],
        }),
      ).toBeInTheDocument();
    }
  });

  it("keeps an initial extended selection in the native closed disclosure", async () => {
    const user = userEvent.setup();

    render(
      <ControlledTimelineFilter initialValue="30-days" onChange={vi.fn()} />,
    );

    const disclosure = screen.getByText(/More timeframes/).closest("details");
    expect(disclosure).toBeTruthy();
    if (!disclosure) throw new Error("Expected More timeframes disclosure");
    const summary = disclosure.querySelector("summary");
    if (!summary) throw new Error("Expected More timeframes summary");

    expect(disclosure).not.toHaveAttribute("open");
    expect(summary).toHaveTextContent("More timeframes · Next 30 days");
    expect(summary).not.toHaveAttribute("role");
    expect(summary).not.toHaveAttribute("aria-checked");
    expect(summary.tabIndex).toBe(0);

    await user.click(summary);

    expect(disclosure).toHaveAttribute("open", "");
    const extendedGroup = within(disclosure).getByRole("radiogroup", {
      name: "More timeframes",
    });
    expect(
      within(extendedGroup).getByRole("radio", {
        name: TIMELINE_LABELS["30-days"],
      }),
    ).toHaveAttribute("aria-checked", "true");
    expect(
      within(extendedGroup).getByRole("radio", {
        name: TIMELINE_LABELS["30-days"],
      }),
    ).toHaveAttribute("tabindex", "0");
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

  it("cycles focus and selection through all common timelines with arrow keys", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ControlledTimelineFilter initialValue="24-hours" onChange={onChange} />,
    );

    const twentyFourHours = screen.getByRole("radio", {
      name: TIMELINE_LABELS["24-hours"],
    });
    twentyFourHours.focus();

    await user.keyboard("{ArrowRight}");
    const threeDays = screen.getByRole("radio", {
      name: TIMELINE_LABELS["3-days"],
    });
    expect(threeDays).toHaveFocus();
    expect(threeDays).toHaveAttribute("aria-checked", "true");

    await user.keyboard("{ArrowDown}");
    const sevenDays = screen.getByRole("radio", {
      name: TIMELINE_LABELS["7-days"],
    });
    expect(sevenDays).toHaveFocus();
    expect(sevenDays).toHaveAttribute("aria-checked", "true");

    await user.keyboard("{ArrowRight}");
    expect(twentyFourHours).toHaveFocus();
    expect(twentyFourHours).toHaveAttribute("aria-checked", "true");

    await user.keyboard("{ArrowLeft}");
    expect(sevenDays).toHaveFocus();
    expect(sevenDays).toHaveAttribute("aria-checked", "true");
    expect(onChange).toHaveBeenNthCalledWith(1, "3-days");
    expect(onChange).toHaveBeenNthCalledWith(2, "7-days");
    expect(onChange).toHaveBeenNthCalledWith(3, "24-hours");
    expect(onChange).toHaveBeenNthCalledWith(4, "7-days");
  });

  it("cycles focus and selection through all extended timelines with arrow keys", async () => {
    const user = userEvent.setup();

    render(
      <ControlledTimelineFilter initialValue="14-days" onChange={vi.fn()} />,
    );

    const disclosure = screen.getByText(/More timeframes/).closest("details");
    if (!disclosure) throw new Error("Expected More timeframes disclosure");
    await user.click(disclosure.querySelector("summary") as HTMLElement);

    const fourteenDays = screen.getByRole("radio", {
      name: TIMELINE_LABELS["14-days"],
    });
    fourteenDays.focus();

    await user.keyboard("{ArrowRight}");
    const thirtyDays = screen.getByRole("radio", {
      name: TIMELINE_LABELS["30-days"],
    });
    expect(thirtyDays).toHaveFocus();
    expect(thirtyDays).toHaveAttribute("aria-checked", "true");

    await user.keyboard("{ArrowDown}");
    const threeMonths = screen.getByRole("radio", {
      name: TIMELINE_LABELS["3-months"],
    });
    expect(threeMonths).toHaveFocus();
    expect(threeMonths).toHaveAttribute("aria-checked", "true");
    expect(disclosure).toHaveAttribute("open", "");

    await user.keyboard("{ArrowRight}");
    expect(fourteenDays).toHaveFocus();
    expect(fourteenDays).toHaveAttribute("aria-checked", "true");

    await user.keyboard("{ArrowLeft}");
    expect(threeMonths).toHaveFocus();
    expect(threeMonths).toHaveAttribute("aria-checked", "true");
  });
});
