import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Figtree: () => ({ variable: "font-figtree" }),
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
    expect(metadata.icons).toEqual({
      icon: [
        {
          url: "/brand/growguide-avatar.png",
          type: "image/png",
          sizes: "1024x1024",
        },
      ],
      apple: [
        {
          url: "/brand/growguide-avatar.png",
          type: "image/png",
          sizes: "1024x1024",
        },
      ],
    });
    expect(
      Array.from(
        readFileSync(
          resolve(process.cwd(), "public/brand/growguide-avatar.png"),
        ).subarray(0, 8),
      ),
    ).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
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
    expect(markup).toMatch(/<body class="font-figtree [^"]*font-sans"/);
    expect(markup).toContain('data-design-direction="gravity-rain"');
    expect(markup).toContain("f20db32c");
    expect(markup).toMatch(
      /<body[^>]*><template data-design-direction="gravity-rain">/,
    );
  });
});
