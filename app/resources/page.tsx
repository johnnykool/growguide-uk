import type { Metadata } from "next";
import { RESOURCES } from "@/data/resources";
import ResourcePreview from "@/components/ResourcePreview";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const title = `Free growing resources | ${SITE_NAME}`;
const description = "Preview and download free printable resources for your UK garden. Start with our vegetable and herb growing calendar, available as an A3 wall chart or two A4 pages.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/resources" },
  openGraph: { title, description, url: `${SITE_URL}/resources` },
  twitter: { title, description, card: "summary_large_image" },
};

export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">Resources</h1>
        <p className="mt-4 text-lg text-earth-ink">A little guidance to keep beside your seed packets. Browse our free printables, take a closer look, and find something useful for your patch.</p>
      </div>

      <div className="mt-10 space-y-16 sm:mt-14">
        {RESOURCES.map((resource) => (
          <article key={resource.id} id={resource.id} aria-labelledby={`${resource.id}-title`} className="scroll-mt-24 border-t border-moss/50 pt-8 sm:pt-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
              <ResourcePreview title={resource.title} editions={resource.editions} />
              <div className="lg:pt-1">
                <h2 id={`${resource.id}-title`} className="font-serif text-3xl leading-tight sm:text-4xl">{resource.title}</h2>
                <p className="mt-3 text-lg font-semibold text-earth-ink">{resource.subtitle}</p>
                <p className="mt-5 max-w-xl text-earth-ink">{resource.description}</p>
                <ul className="mt-6 list-disc space-y-3 pl-5 text-earth-ink marker:text-dark-earth">
                  {resource.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>

                <div className="mt-8 border-t border-moss/40 pt-6">
                  <h3 className="font-serif text-2xl">Make room for a growing year</h3>
                  <p className="mt-2 text-sm text-earth-ink">Free to download. No sign-up needed.</p>
                  <div className="mt-5 space-y-5">
                    {resource.editions.map((edition) => (
                      <div key={edition.format}>
                        <a href={edition.href} download className="inline-flex min-h-11 items-center justify-center gap-3 rounded-btn bg-dark-earth px-5 py-3 font-semibold text-cream transition-colors hover:bg-earth-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream">
                          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m-5-5 5 5 5-5M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" /></svg>
                          Download {edition.format} PDF
                        </a>
                        <p className="mt-2 text-sm text-earth-ink">{edition.description} · {edition.fileSize}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-7 max-w-xl text-sm text-earth-ink">{resource.printNote}</p>
                <p className="mt-4 text-sm text-earth-ink">Compiled by GrowGuide UK. Growing dates are a guide; follow your seed packet and local conditions.</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
