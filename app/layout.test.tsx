import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  DM_Sans: () => ({ variable: "font-sans" }),
  DM_Serif_Display: () => ({ variable: "font-serif" }),
}));
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/SiteAnalytics", () => ({
  default: () => <span data-site-analytics="mounted" />,
}));
vi.mock("@/components/SiteStructuredData", () => ({ default: () => null }));

import RootLayout, { metadata } from "./layout";

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
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "/brand/growguide-social.png",
        width: 1200,
        height: 630,
        alt: "Weather paths flow into GrowGuide UK actions",
      },
    ]);
    expect(metadata.twitter?.images).toEqual(["/brand/growguide-social.png"]);
    const prohibitedAnalyticsTokens = [
      "google-" + "analytics",
      "google" + "tagmanager",
      "clarity",
    ].join("|");
    expect(JSON.stringify(metadata)).not.toMatch(
      new RegExp(prohibitedAnalyticsTokens, "i"),
    );
  });

  it("mounts site analytics exactly once in the default layout", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>Garden planner</main>
      </RootLayout>,
    );

    expect(markup.match(/data-site-analytics="mounted"/g)).toHaveLength(1);
  });
});
