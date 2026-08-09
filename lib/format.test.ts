import { describe, expect, it } from "vitest";
import { formatCropCount } from "./format";

describe("formatCropCount", () => {
  it("uses the plural for zero crops", () => {
    expect(formatCropCount(0)).toBe("0 crops");
  });

  it("uses the singular for one crop", () => {
    expect(formatCropCount(1)).toBe("1 crop");
  });

  it("uses the plural for multiple crops", () => {
    expect(formatCropCount(2)).toBe("2 crops");
  });
});
