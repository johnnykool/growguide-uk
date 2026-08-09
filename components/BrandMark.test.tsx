import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BrandMark from "./BrandMark";

describe("BrandMark", () => {
  it("is decorative by default and nameable when used alone", () => {
    const view = render(<BrandMark />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    view.rerender(<BrandMark title="GrowGuide UK" />);
    expect(screen.getByRole("img", { name: "GrowGuide UK" })).toBeVisible();
  });

  it("gives every titled mark its own title relationship", () => {
    const view = render(
      <>
        <BrandMark title="GrowGuide UK" />
        <BrandMark title="GrowGuide UK" />
      </>,
    );

    const titleIds = within(view.container)
      .getAllByRole("img", { name: "GrowGuide UK" })
      .map((mark) => mark.getAttribute("aria-labelledby"));

    expect(new Set(titleIds).size).toBe(2);
    for (const titleId of titleIds) {
      expect(document.getElementById(titleId ?? "")).toHaveTextContent("GrowGuide UK");
    }
  });
});
