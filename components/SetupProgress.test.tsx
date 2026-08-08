import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import SetupProgress from "./SetupProgress";

afterEach(cleanup);

describe("SetupProgress", () => {
  it("announces the current stage and exposes its progress value", () => {
    render(
      <SetupProgress
        activeStep={2}
        completedSteps={[1]}
        summaries={{ 1: "SW1A 1AA · London" }}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByText("Step 2 of 4")).toBeVisible();
    expect(screen.getByRole("progressbar")).toHaveAttribute("value", "2");
    expect(screen.getByRole("progressbar")).toHaveAttribute("max", "4");
    expect(screen.getByText("Your location").closest("li")).toHaveTextContent(
      "SW1A 1AA · London",
    );
    expect(screen.getByText("What you want to grow").closest("li")).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("offers accessible edit controls only for completed stages", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <SetupProgress
        activeStep={4}
        completedSteps={[1, 2, 3]}
        summaries={{
          1: "SW1A 1AA · London",
          2: "2 crops selected",
          3: "Medium plot (4–20m²)",
          4: "No tools selected",
        }}
        onEdit={onEdit}
      />,
    );

    expect(screen.getAllByRole("button", { name: /^Edit /i })).toHaveLength(3);
    expect(
      screen.queryByRole("button", { name: /Edit your tool shed/i }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /Edit what you want to grow/i }),
    );

    expect(onEdit).toHaveBeenCalledWith(2);
  });

  it("shows concise real-value summaries for completed stages", () => {
    render(
      <SetupProgress
        activeStep={1}
        completedSteps={[1, 2, 3, 4]}
        summaries={{
          1: "PR1 1AA · North West",
          2: "1 crop selected",
          3: "Small raised bed (<4m²)",
          4: "2 tools selected",
        }}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByText("PR1 1AA · North West")).toBeVisible();
    expect(screen.getByText("1 crop selected")).toBeVisible();
    expect(screen.getByText("Small raised bed (<4m²)")).toBeVisible();
    expect(screen.getByText("2 tools selected")).toBeVisible();
  });
});
