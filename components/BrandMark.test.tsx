import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BrandMark from "./BrandMark";

describe("BrandMark", () => {
  it("is decorative by default and nameable when used alone", () => {
    const view = render(<BrandMark />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    view.rerender(<BrandMark title="GrowGuide UK" />);
    expect(screen.getByRole("img", { name: "GrowGuide UK" })).toBeVisible();
  });
});
