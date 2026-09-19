import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const title = `Vegetable varieties | ${SITE_NAME}`;
const description = "Choose vegetable varieties to suit your growing space. Start with four tomatoes for UK gardens, greenhouses and containers.";
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

      <section aria-labelledby="tomato-guide" className="mt-10 grid overflow-hidden rounded-card border border-light-sage sm:grid-cols-[1fr_1.5fr]">
        <div className="relative min-h-52">
          <Image src="/images/veg/tomato.jpg" alt="Freshly harvested red cherry tomatoes" fill sizes="(max-width: 640px) 100vw, 340px" className="object-cover" />
        </div>
        <div className="p-6 sm:p-8">
          <h2 id="tomato-guide" className="font-serif text-3xl">Tomatoes</h2>
          <p className="mt-3 text-earth-ink">A familiar cherry, a sweet orange tomato, a trailing basket variety and a blight-resistant outdoor option. Four different starting points for your next crop.</p>
          <Link href="/varieties/tomatoes" className="variety-text-link mt-4">Explore tomato varieties <span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <p className="mt-6 text-sm text-earth-ink">We’re starting with tomatoes. Courgettes, spring onions and cucumbers are planned next.</p>
    </main>
  );
}
