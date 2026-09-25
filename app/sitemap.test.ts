import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("contains only canonical public pages", () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      "https://growguideuk.co.uk/",
      "https://growguideuk.co.uk/privacy",
      "https://growguideuk.co.uk/resources",
      "https://growguideuk.co.uk/varieties",
      "https://growguideuk.co.uk/varieties/tomatoes",
      "https://growguideuk.co.uk/varieties/courgettes",
      "https://growguideuk.co.uk/varieties/spring-onions",
      "https://growguideuk.co.uk/varieties/cucumbers",
      "https://growguideuk.co.uk/resources/growing-calendar",
      "https://growguideuk.co.uk/resources/crop-rotation",
      "https://growguideuk.co.uk/resources/companion-planting",
      "https://growguideuk.co.uk/resources/vegetable-storage",
      "https://growguideuk.co.uk/resources/seed-storage-and-lifespan",
    ]);
    expect(JSON.stringify(sitemap())).not.toContain("/api/");
    expect(JSON.stringify(sitemap())).not.toContain("vercel.app");
  });
});
