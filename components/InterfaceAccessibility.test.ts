import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function readComponent(name: string) {
  return readFileSync(resolve(process.cwd(), "components", name), "utf8");
}

const sources = {
  adviceConfirm: readComponent("AdviceRefreshConfirm.tsx"),
  adviceResults: readComponent("AdviceResults.tsx"),
  dashboard: readComponent("Dashboard.tsx"),
  taskCard: readComponent("TaskCard.tsx"),
  timeline: readComponent("TimelineFilter.tsx"),
};

describe("changed interface accessibility contracts", () => {
  it("uses dark, offset focus indicators throughout dashboard actions", () => {
    for (const source of Object.values(sources)) {
      expect(source).not.toMatch(/focus(?:-visible|-within)?:ring-moss/);
    }

    expect(sources.dashboard).toContain(
      "focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral",
    );
    expect(sources.adviceConfirm).toContain(
      "focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral",
    );
    expect(sources.taskCard).toContain(
      "focus-visible:ring-2 focus-visible:ring-garden-ground",
    );
  });

  it("uses semantic text colours and visible selected-state boundaries", () => {
    const dashboardSources = Object.values(sources).join("\n");

    expect(dashboardSources).toContain("garden-ground");
    expect(dashboardSources).toContain("rain-ink");
    expect(dashboardSources).toContain("ember-ink");
    expect(dashboardSources).toContain("pale-mineral");
    expect(sources.timeline).toContain(
      "bg-pale-mineral text-rain-ink ring-2 ring-rain-ink",
    );
    expect(sources.taskCard).toContain(
      "ring-1 ring-garden-ground/40",
    );
  });
});
