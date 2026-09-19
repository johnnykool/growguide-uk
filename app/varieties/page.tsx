import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { VARIETY_GUIDES } from "@/data/variety-guides";

const title = `Vegetable varieties | ${SITE_NAME}`;
const description = "Compare tomato, courgette, spring onion and cucumber varieties for UK gardens. Four helpful choices per crop, with growing advice and seed links.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "/varieties" },
  openGraph: { title, description, url: `${SITE_URL}/varieties` },
  twitter: { title, description, card: "summary_large_image" },
};

export default function VarietiesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <Link href="/" className="variety-text-link">Back to your Grow Guide</Link>
      <h1 className="mt-8 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">A variety that fits your garden</h1>
      <p className="mt-4 max-w-2xl text-lg text-earth-ink">Start with the space you have and the food you love. These short guides explain what each variety does well, and what it needs from you.</p>

      <div className="mt-10 space-y-6">
        {VARIETY_GUIDES.map(guide => (
          <section key={guide.slug} aria-labelledby={`${guide.slug}-guide`} className={`grid overflow-hidden rounded-card border border-light-sage ${guide.image ? "sm:grid-cols-[1fr_1.5fr]" : ""}`}>
            {guide.image && <div className="relative min-h-52">
              <Image src={guide.image.src} alt={guide.image.alt} fill sizes="(max-width: 640px) 100vw, 340px" className="object-cover" />
            </div>}
            <div className="p-6 sm:p-8">
              <h2 id={`${guide.slug}-guide`} className="font-serif text-3xl">{guide.name}</h2>
              <p className="mt-3 max-w-2xl text-earth-ink">{guide.summary}</p>
              <Link href={`/varieties/${guide.slug}`} className="variety-text-link mt-4">Explore {guide.singular} varieties <span aria-hidden="true">→</span></Link>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
