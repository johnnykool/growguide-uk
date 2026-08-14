import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import SetupProgress from "./SetupProgress";

afterEach(cleanup);

describe("SetupProgress", () => {
  it("renders four compact step buttons with the current step announced", () => {
    render(
      <SetupProgress
        activeStep={2}
        completedSteps={[1]}
        summaries={{ 1: "SW1A 1AA · London" }}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(4);
    expect(screen.getByText("Your location").closest("li")).toHaveTextContent(
      "SW1A 1AA · London",
    );
    expect(
      screen.getByRole("button", { name: /What you want to grow/i }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("enables completed and current steps while disabling locked steps", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <SetupProgress
        activeStep={2}
        completedSteps={[1]}
        summaries={{
          1: "SW1A 1AA · London",
          2: "2 crops selected",
          3: "Medium plot (4–20m²)",
          4: "No tools selected",
        }}
        onEdit={onEdit}
      />,
    );

    expect(screen.getByRole("button", { name: /Your location/i })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: /What you want to grow/i }),
    ).toBeEnabled();
    expect(screen.getByRole("button", { name: /Your plot/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Your tool shed/i })).toBeDisabled();

    await user.click(
      screen.getByRole("button", { name: /Your location/i }),
    );

    expect(onEdit).toHaveBeenCalledWith(1);
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
