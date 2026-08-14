import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SetupWorkbench from "./SetupWorkbench";

describe("SetupWorkbench", () => {
  it("keeps controls before the live portrait in DOM order", () => {
    render(
      <SetupWorkbench
        activeStep={2}
        completedSteps={[1]}
        summaries={{ 1: "SW1A 1AA · London" }}
        onEdit={vi.fn()}
        portrait={{
          postcode: "SW1A 1AA",
          region: "London",
          vegetables: ["lettuce"],
          plotSize: "medium",
          environment: [],
          equipment: [],
        }}
        controls={<section aria-label="Active setup step">Crop controls</section>}
      />,
    );
    const controls = screen.getByRole("region", { name: "Active setup step" });
    const portrait = screen.getByRole("region", { name: "Your garden portrait" });
    expect(
      controls.compareDocumentPosition(portrait) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
