import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BlackFlowerMark from "./BlackFlowerMark";

describe("BlackFlowerMark", () => {
  it("is decorative by default and nameable when used alone", () => {
    const view = render(<BlackFlowerMark />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    view.rerender(<BlackFlowerMark title="Your plot marker" />);
    expect(
      screen.getByRole("img", { name: "Your plot marker" }),
    ).toBeVisible();
  });

  it("gives every titled mark its own title relationship", () => {
    const view = render(
      <>
        <BlackFlowerMark title="Your plot marker" />
        <BlackFlowerMark title="Your plot marker" />
      </>,
    );

    const titleIds = within(view.container)
      .getAllByRole("img", { name: "Your plot marker" })
      .map((mark) => mark.getAttribute("aria-labelledby"));

    expect(new Set(titleIds).size).toBe(2);
    for (const titleId of titleIds) {
      expect(document.getElementById(titleId ?? "")).toHaveTextContent(
        "Your plot marker",
      );
    }
  });

  it("draws five authored petals around one centre", () => {
    const view = render(<BlackFlowerMark />);
    const mark = view.container.querySelector('[data-black-flower="true"]');

    expect(mark).toHaveAttribute("fill", "currentColor");
    expect(mark?.querySelectorAll("path")).toHaveLength(5);
    expect(mark?.querySelectorAll("circle")).toHaveLength(1);
  });

  it("provides 32px intrinsic dimensions without discarding class sizing", () => {
    const view = render(<BlackFlowerMark className="h-5 w-5" />);
    const mark = view.container.querySelector('[data-black-flower="true"]');

    expect(mark).toHaveAttribute("width", "32");
    expect(mark).toHaveAttribute("height", "32");
    expect(mark).toHaveClass("h-5", "w-5");
  });
});
