import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function readComponent(name: string) {
  return readFileSync(resolve(process.cwd(), "components", name), "utf8");
}

const sources = {
  adviceConfirm: readComponent("AdviceRefreshConfirm.tsx"),
  dashboard: readComponent("Dashboard.tsx"),
  equipment: readComponent("EquipmentSelector.tsx"),
  progress: readComponent("SetupProgress.tsx"),
  vegetables: readComponent("VegetableGrid.tsx"),
  wizard: readComponent("SetupWizard.tsx"),
};

describe("changed interface accessibility contracts", () => {
  it("uses dark, offset focus indicators throughout setup and confirmation", () => {
    for (const source of Object.values(sources)) {
      expect(source).not.toMatch(/focus(?:-visible|-within)?:ring-moss/);
    }

    expect(sources.progress).toContain("accent-dark-earth");
    expect(sources.dashboard).toContain(
      "focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
    );
  });

  it("uses accessible text and selected-state class contracts on tinted surfaces", () => {
    expect(sources.progress).toContain(
      "bg-light-sage/70 text-earth-ink ring-2 ring-dark-earth",
    );
    expect(sources.progress).toContain("bg-warm-stone/50 text-earth-ink");
    expect(sources.progress).toContain(
      "font-semibold text-earth-ink underline decoration-earth-ink",
    );
    expect(sources.vegetables).toContain(
      "bg-blush text-earth-ink shadow-soft ring-2 ring-dark-earth",
    );
    expect(sources.vegetables).toContain(
      "bg-warm-stone/60 text-earth-ink ring-1 ring-dark-earth",
    );
    expect(sources.vegetables).toContain(
      "text-sm font-semibold text-earth-ink",
    );
    expect(sources.vegetables).toContain(
      "text-sm font-medium text-earth-ink ring-1 ring-dark-earth",
    );
    expect(sources.equipment).toContain(
      "bg-blush text-earth-ink ring-2 ring-dark-earth",
    );
    expect(sources.equipment).toContain(
      "bg-warm-stone/60 text-earth-ink ring-1 ring-dark-earth",
    );
    expect(sources.equipment).toContain(
      "text-sm font-medium text-earth-ink ring-1 ring-dark-earth",
    );
    expect(sources.wizard).toContain(
      "bg-blush text-earth-ink ring-2 ring-dark-earth",
    );
    expect(sources.wizard).toContain(
      "font-medium text-earth-ink ring-1 ring-dark-earth",
    );
    expect(sources.adviceConfirm).toContain(
      "border-dark-earth bg-blush/40",
    );

    expect(sources.progress).not.toContain("text-moss");
    expect(sources.vegetables).not.toContain("text-moss");
    expect(sources.wizard).not.toContain("text-terracotta");
    expect(sources.adviceConfirm).not.toContain("ring-terracotta");
  });
});
