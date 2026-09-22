import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ResourcePreview from "./ResourcePreview";
import { RESOURCES } from "@/data/resources";

afterEach(cleanup);

describe("resource preview", () => {
  it("shows the calendar before download and lets readers inspect both A4 pages", () => {
    render(<ResourcePreview title={RESOURCES[0].title} editions={RESOURCES[0].editions} />);
    expect(screen.getByRole("img")).toHaveAttribute("alt", expect.stringContaining("A3"));
    expect(screen.getByRole("link", { name: /Open full-size preview/ })).toHaveAttribute(
      "href", "/images/resources/growing-calendar-a3-1.png",
    );
    fireEvent.change(screen.getByRole("combobox", { name: "Preview zoom" }), { target: { value: "150" } });
    expect(screen.getByRole("img").closest("figure")).toHaveStyle({ width: "150%" });
    fireEvent.click(screen.getByRole("button", { name: "A4 home print" }));
    expect(screen.getByRole("img")).toHaveAttribute("alt", expect.stringContaining("page 1 of 2"));
    expect(screen.getByRole("link", { name: /Open PDF/ })).toHaveAttribute("href", RESOURCES[0].editions[1].href);
    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(screen.getByRole("link", { name: /Open full-size preview/ })).toHaveAttribute(
      "href", "/images/resources/growing-calendar-a4-2.png",
    );
    fireEvent.click(screen.getByRole("button", { name: "A3 wall chart" }));
    expect(screen.getByRole("img")).toHaveAttribute("alt", expect.stringContaining("A3"));
    fireEvent.click(screen.getByRole("button", { name: "A4 home print" }));
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-pressed", "true");
  });
});
