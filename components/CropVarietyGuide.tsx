import Image from "next/image";
import Link from "next/link";
import { seedDestination } from "@/data/varieties";
import type { VarietyGuide } from "@/data/variety-guides";
import SeedLink from "./SeedLink";
import VarietyFacts from "./VarietyFacts";
import VarietyVisit from "./VarietyVisit";

export default function CropVarietyGuide({ guide }: { guide: VarietyGuide }) {
  const hasAffiliates = guide.varieties.some(v => seedDestination(v.retailer).affiliate);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <VarietyVisit crop={guide.slug} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-3 text-sm">
        <Link href="/" className="variety-text-link">Your Grow Guide</Link>
        <span aria-hidden="true">/</span>
        <Link href="/varieties" className="variety-text-link">Varieties</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{guide.name}</span>
      </nav>

      {/* Editorial header. One headline, one lead paragraph, one link: the
          second intro paragraph now opens the variety section, where it
          actually introduces the four varieties it describes. */}
      <header className={`mt-8 grid items-center gap-8 md:gap-14 ${guide.image ? "md:grid-cols-[1.4fr_1fr]" : ""}`}>
        <div>
          <h1 className="max-w-3xl font-serif text-4xl leading-[1.1] tracking-[-0.01em] sm:text-5xl lg:text-6xl">
            {guide.heading}
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-earth-ink">{guide.intro[0]}</p>
          <a href="#comparison" className="variety-text-link mt-5">
            Jump to the quick comparison <span aria-hidden="true">↓</span>
          </a>
        </div>
        {guide.image && (
          <div className="relative h-56 overflow-hidden rounded-card sm:h-72 md:h-[22rem]">
            <Image
              src={guide.image.src}
              alt={guide.image.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 430px"
              className="object-cover"
            />
          </div>
        )}
      </header>

      <section aria-labelledby="variety-cards" className="mt-16 sm:mt-24">
        <h2 id="variety-cards" className="max-w-2xl font-serif text-3xl leading-tight sm:text-4xl">
          Four varieties, four good reasons
        </h2>
        <p className="mt-4 max-w-[65ch] text-lg leading-relaxed text-earth-ink">{guide.intro[1]}</p>
        <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-earth-ink">
          {hasAffiliates
            ? "Some retailer links are affiliate links. Grow Guide UK may receive a small commission if you make a purchase, at no additional cost to you."
            : "These are ordinary retailer links. GrowGuide UK does not earn a commission from them."}
          {" "}Seed links open in a new tab. Check the retailer for current availability.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {guide.varieties.map(v => (
            <article
              key={v.id}
              id={v.id}
              aria-labelledby={`${v.id}-title`}
              className="flex scroll-mt-24 flex-col rounded-card border border-light-sage bg-sage/10 p-6 sm:p-8"
            >
              {/* The reason to pick this variety leads the card. It used to sit
                  below the prose, four paragraphs into the reading order. */}
              <p className="font-semibold text-earth-ink">{v.bestFor}</p>
              <h3 id={`${v.id}-title`} className="mt-1 font-serif text-2xl leading-tight sm:text-3xl">
                {v.name}
              </h3>
              <p className="mt-2 text-sm text-earth-ink">
                <span className="sr-only">Latin name: </span>
                <i lang="la">{v.latinName}</i>
              </p>
              <p className="mt-1 text-sm text-earth-ink">{v.habit}</p>

              <p className="mt-5 max-w-[60ch] leading-relaxed text-earth-ink">{v.general}</p>

              <VarietyFacts variety={v} />

              <div className="mt-6 rounded-btn border-l-2 border-terracotta bg-cream px-5 py-4">
                <h4 className="text-sm font-semibold text-dark-earth">Pests &amp; diseases</h4>
                <p className="mt-1 text-sm leading-relaxed text-earth-ink">{v.pestsDiseases}</p>
                <h4 className="mt-4 text-sm font-semibold text-dark-earth">Bear in mind</h4>
                <p className="mt-1 text-sm leading-relaxed text-earth-ink">{v.limitation}</p>
              </div>

              <div className="mt-auto pt-6">
                <SeedLink crop={guide.slug} variety={v.id} name={v.name} retailer={v.retailer} />
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-[65ch] text-sm leading-relaxed text-earth-ink">
          Sizes are approximate mature dimensions, not planting distances. Difficulty is our practical
          guide to the care involved, not an official rating. “Easy” still means regular watering and feeding.
        </p>
      </section>

      <section id="comparison" aria-labelledby="comparison-title" className="mt-16 scroll-mt-24 sm:mt-24">
        <h2 id="comparison-title" className="font-serif text-3xl leading-tight sm:text-4xl">Compare at a glance</h2>
        <p className="mt-3 max-w-[65ch] text-lg leading-relaxed text-earth-ink">{guide.comparisonIntro}</p>
        <div
          role="region"
          aria-label={`Comparison of ${guide.name.toLowerCase()}, scroll horizontally on small screens`}
          tabIndex={0}
          className="mt-6 overflow-x-auto rounded-card border border-light-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <table className="w-full min-w-[640px] text-left text-sm text-earth-ink">
            <caption className="sr-only">
              {guide.name} compared by best use, growing place and mature size
            </caption>
            <thead className="bg-sage/40 text-earth-ink">
              <tr>
                {["Variety", "Choose it for", "Growing place", "Height & spread"].map(label => (
                  <th key={label} scope="col" className="px-5 py-4 font-semibold">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-light-sage/60">
              {guide.varieties.map(v => (
                <tr key={v.id}>
                  <th scope="row" className="px-5 py-4 font-semibold">
                    <a className="variety-text-link" href={`#${v.id}`}>{v.name}</a>
                  </th>
                  <td className="px-5 py-4">{v.bestFor}</td>
                  <td className="px-5 py-4">{v.position}</td>
                  <td className="px-5 py-4">{v.heightSpread}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-earth-ink md:hidden">Swipe the comparison sideways to see all four columns.</p>
      </section>

      <section aria-labelledby="timing-title" className="mt-16 rounded-card bg-sage/20 p-6 sm:mt-24 sm:p-10">
        <h2 id="timing-title" className="max-w-2xl font-serif text-3xl leading-tight sm:text-4xl">
          A note on UK timing
        </h2>
        <div className="mt-6 grid gap-x-12 gap-y-4 text-earth-ink lg:grid-cols-2">
          {guide.timing.map(paragraph => (
            <p key={paragraph} className="max-w-[60ch] leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </section>

      <section aria-labelledby="healthy-crops" className="mt-16 max-w-[65ch] sm:mt-24">
        <h2 id="healthy-crops" className="font-serif text-3xl leading-tight sm:text-4xl">
          Keeping {guide.name.toLowerCase()} healthy
        </h2>
        {guide.health.map(paragraph => (
          <p key={paragraph} className="mt-4 leading-relaxed text-earth-ink">{paragraph}</p>
        ))}
      </section>

      <section
        aria-labelledby="your-plot"
        className="mt-16 flex flex-col gap-5 rounded-card border border-light-sage bg-blush/40 p-6 sm:mt-24 sm:flex-row sm:items-center sm:justify-between sm:p-10"
      >
        <div>
          <h2 id="your-plot" className="font-serif text-3xl leading-tight">Make it work for your plot</h2>
          <p className="mt-2 max-w-[48ch] leading-relaxed text-earth-ink">
            Use your growing space and local weather to plan the next step, from sowing to planting out.
          </p>
        </div>
        <Link href="/" className="variety-text-link shrink-0">
          Back to your personalised Grow Guide <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
