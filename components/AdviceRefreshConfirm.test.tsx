import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import AdviceRefreshConfirm from "./AdviceRefreshConfirm";

afterEach(cleanup);

describe("AdviceRefreshConfirm", () => {
  it("warns that fresh advice replaces the task list and takes focus", () => {
    render(<AdviceRefreshConfirm onConfirm={vi.fn()} onCancel={vi.fn()} />);

    const heading = screen.getByRole("heading", {
      name: "Fresh advice will replace your current task list.",
    });

    expect(heading).toBeVisible();
    expect(heading).toHaveFocus();
  });

  it("confirms replacement from Replace my task list", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(<AdviceRefreshConfirm onConfirm={onConfirm} onCancel={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: "Replace my task list" }),
    );

    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("keeps saved tasks from Keep saved tasks", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<AdviceRefreshConfirm onConfirm={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Keep saved tasks" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("keeps saved tasks when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<AdviceRefreshConfirm onConfirm={vi.fn()} onCancel={onCancel} />);

    await user.keyboard("{Escape}");

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
