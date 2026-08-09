import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows crawling and advertises the canonical sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: "/api/" },
      sitemap: "https://growguideuk.co.uk/sitemap.xml",
      host: "https://growguideuk.co.uk",
    });
  });
});
