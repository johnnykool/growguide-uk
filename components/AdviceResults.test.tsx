import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AdviceResults from "./AdviceResults";
import type { AdviceTask } from "@/lib/types";

afterEach(cleanup);

function show(tasks: AdviceTask[]) {
  return render(<AdviceResults advice={{ summary: "Your growing priorities.", weatherWarnings: ["Frost tonight"], tasks }} completed={{}} onToggleTask={vi.fn()} />);
}

const sow: AdviceTask = { vegetable: "Tomato", title: "Sow your tomatoes", category: "sowing", priority: "medium", detail: "Sow into seed compost." };

describe("contextual variety guidance", () => {
  it.each([
    ["Courgette", "courgette", "courgettes"],
    ["Cucumbers", "cucumber", "cucumbers"],
    ["Spring Onion", "spring onion", "spring-onions"],
  ])("links %s planting advice to its own guide once", (vegetable, label, slug) => {
    show([{ ...sow, vegetable }, { ...sow, vegetable, title: "Plant out", category: "planting" }]);
    const links = screen.getAllByRole("link", { name: new RegExp(`Explore ${label} varieties`) });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", `/varieties/${slug}`);
    expect(screen.queryByRole("link", { name: /View seeds/ })).not.toBeInTheDocument();
  });

  it("shows one internal link before instructions when tomato planting tasks are present", () => {
    show([sow, { ...sow, title: "Plant out", category: "planting" }]);
    const links = screen.getAllByRole("link", { name: /Explore tomato varieties/ });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/varieties/tomatoes");
    expect(links[0].compareDocumentPosition(screen.getAllByText(sow.detail)[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByRole("link", { name: /View seeds/ })).not.toBeInTheDocument();
  });

  it("does not show seed guidance in care, protection or unrelated crops", () => {
    show([{ ...sow, category: "care", title: "Water" }, { ...sow, category: "protection", title: "Protect from frost" }, { ...sow, vegetable: "Carrot" }]);
    expect(screen.queryByRole("link", { name: /Explore.*varieties/ })).not.toBeInTheDocument();
  });
});
