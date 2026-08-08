import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
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

  it("keeps saved tasks from a document-level Escape press", () => {
    const onCancel = vi.fn();

    render(<AdviceRefreshConfirm onConfirm={vi.fn()} onCancel={onCancel} />);
    const outsideControl = document.createElement("button");
    document.body.append(outsideControl);
    outsideControl.focus();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onCancel).toHaveBeenCalledOnce();
    outsideControl.remove();
  });

  it("restores focus to the fresh-advice trigger when closed", async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Get Fresh Advice
          </button>
          {open && (
            <AdviceRefreshConfirm
              onConfirm={() => setOpen(false)}
              onCancel={() => setOpen(false)}
            />
          )}
        </>
      );
    }

    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Get Fresh Advice" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Keep saved tasks" }));

    expect(trigger).toHaveFocus();
  });
});
