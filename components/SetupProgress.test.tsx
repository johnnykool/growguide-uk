import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import SetupProgress from "./SetupProgress";

afterEach(cleanup);

describe("SetupProgress", () => {
  it("announces the current stage and exposes its progress value", () => {
    render(
      <SetupProgress activeStep={2} completedSteps={[1]} onEdit={vi.fn()} />,
    );

    expect(screen.getByText("Step 2 of 4")).toBeVisible();
    expect(screen.getByRole("progressbar")).toHaveAttribute("value", "2");
    expect(screen.getByRole("progressbar")).toHaveAttribute("max", "4");
    expect(screen.getByText("Your location").closest("li")).toHaveTextContent(
      "Complete",
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
});
