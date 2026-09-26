import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ResourcePage, { generateMetadata, generateStaticParams } from "./page";

afterEach(cleanup);

describe("individual resource pages", () => {
  it("opens a shared storage link with the storage guide already selected", async () => {
    render(await ResourcePage({ params: Promise.resolve({ slug: "vegetable-storage" }) }));
    expect(screen.getByRole("heading", { name: "Keep the harvest." })).toBeVisible();
    expect(screen.getByRole("link", { name: "Download A4 PDF" })).toHaveAttribute("href", "/downloads/growguide-uk-vegetable-storage.pdf");
    expect(screen.getByRole("link", { name: "Vegetable storage" })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("heading", { name: "Sow. Plant. Harvest." })).not.toBeInTheDocument();
  });

  it("gives shared links a matching canonical URL, title and preview image", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "vegetable-storage" }) });
    expect(metadata.title).toBe("Vegetable storage | GrowGuide UK");
    expect(metadata.alternates).toEqual({ canonical: "/resources/vegetable-storage" });
    expect(metadata.openGraph).toMatchObject({
      title: "Vegetable storage | GrowGuide UK",
      url: "https://growguideuk.co.uk/resources/vegetable-storage",
      images: [{ url: "https://growguideuk.co.uk/images/resources/vegetable-storage-1.png" }],
    });
    expect(metadata.twitter).toMatchObject({ images: ["https://growguideuk.co.uk/images/resources/vegetable-storage-1.png"] });
  });

  it("prebuilds all guide URLs and rejects unknown guides", async () => {
    expect(generateStaticParams()).toEqual([
      { slug: "growing-calendar" }, { slug: "crop-rotation" },
      { slug: "companion-planting" }, { slug: "vegetable-storage" },
      { slug: "seed-storage-and-lifespan" },
      { slug: "autumn-plot-clear-up" }, { slug: "winter-soil-care" },
      { slug: "autumn-tools-and-greenhouse" },
    ]);
    const params = Promise.resolve({ slug: "missing-guide" });
    await expect(ResourcePage({ params })).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    await expect(generateMetadata({ params })).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });
});
