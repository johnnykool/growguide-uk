import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  DM_Sans: () => ({ variable: "font-sans" }),
  DM_Serif_Display: () => ({ variable: "font-serif" }),
}));
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/SiteAnalytics", () => ({ default: () => null }));
vi.mock("@/components/SiteStructuredData", () => ({ default: () => null }));

import { metadata } from "./layout";

describe("root metadata", () => {
  it("publishes one canonical search and sharing identity", () => {
    expect(metadata.metadataBase?.toString()).toBe("https://growguideuk.co.uk/");
    expect(metadata.alternates).toEqual({ canonical: "/" });
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      locale: "en_GB",
      url: "https://growguideuk.co.uk",
      siteName: "GrowGuide UK",
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(JSON.stringify(metadata)).not.toMatch(
      /google-analytics|googletagmanager|clarity/i,
    );
  });
});
