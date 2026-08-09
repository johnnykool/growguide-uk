import { describe, expect, it } from "vitest";
import {
  PUBLIC_ROUTES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_STRUCTURED_DATA,
  SITE_URL,
} from "./site";

describe("site identity", () => {
  it("uses the purchased domain as the only canonical origin", () => {
    expect(SITE_URL).toBe("https://growguideuk.co.uk");
    expect(SITE_NAME).toBe("GrowGuide UK");
    expect(SITE_DESCRIPTION).toMatch(/UK gardeners/i);
    expect(PUBLIC_ROUTES).toEqual(["/", "/privacy"]);
  });

  it("describes a free web application without unsupported claims", () => {
    expect(SITE_STRUCTURED_DATA).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "GrowGuide UK",
      url: "https://growguideuk.co.uk",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
    });
    expect(SITE_STRUCTURED_DATA).not.toHaveProperty("aggregateRating");
  });
});
