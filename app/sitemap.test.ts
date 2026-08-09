import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("contains only canonical public pages", () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      "https://growguideuk.co.uk/",
      "https://growguideuk.co.uk/privacy",
    ]);
    expect(JSON.stringify(sitemap())).not.toContain("/api/");
    expect(JSON.stringify(sitemap())).not.toContain("vercel.app");
  });
});
