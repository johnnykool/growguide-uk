import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { AdviceTask } from "@/lib/types";
import TaskCard from "./TaskCard";

const task: AdviceTask = {
  vegetable: "Unknown crop",
  priority: "medium",
  category: "care",
  title: "Check drainage",
  detail: "Clear pooled water before watering again.",
};

describe("TaskCard", () => {
  it("keeps an unknown-crop task actionable without showing a generic sprout", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<TaskCard task={task} done={false} onToggle={onToggle} />);

    expect(screen.getByText("Unknown crop")).toBeVisible();
    expect(screen.queryByText("🌱")).not.toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: 'Mark "Check drainage" as done' }));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
