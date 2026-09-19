import { beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "@vercel/analytics";
import { rememberVarietyVisit, trackGrowGuideReturn, trackSeedClick } from "./variety-analytics";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

beforeEach(() => { sessionStorage.clear(); vi.mocked(track).mockReset(); });

describe("variety analytics", () => {
  it("records a return once with crop context and no garden data", () => {
    rememberVarietyVisit("tomatoes");
    trackGrowGuideReturn();
    trackGrowGuideReturn();
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith("grow_guide_return", { crop: "tomatoes" });
  });

  it("does not count old visits as a new return", () => {
    vi.spyOn(Date, "now").mockReturnValueOnce(0).mockReturnValueOnce(86_400_001);
    rememberVarietyVisit("tomatoes");
    trackGrowGuideReturn();
    expect(track).not.toHaveBeenCalled();
  });

  it("records only fixed seed-link properties", () => {
    trackSeedClick("tomatoes", "sungold-f1", "Thompson & Morgan", false);
    expect(track).toHaveBeenCalledWith("seed_link_click", { crop: "tomatoes", variety: "sungold-f1", retailer: "Thompson & Morgan", affiliate: false });
  });

  it("keeps navigation usable when storage or analytics is blocked", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.mocked(track).mockImplementation(() => { throw new Error("blocked"); });
    expect(() => rememberVarietyVisit("tomatoes")).not.toThrow();
    expect(() => trackSeedClick("tomatoes", "sungold-f1", "Thompson & Morgan", false)).not.toThrow();
  });
});
