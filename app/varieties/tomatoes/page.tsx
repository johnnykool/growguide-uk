import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { seedDestination, TOMATO_VARIETIES, VARIETY_REVIEW_DATE } from "@/data/varieties";
import SeedLink from "@/components/SeedLink";
import VarietyVisit from "@/components/VarietyVisit";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const title = `Tomato varieties for UK gardens | ${SITE_NAME}`;
const description = "Compare Gardener’s Delight, Sungold F1, Tumbling Tom Red and Crimson Crush F1 for outdoor growing, greenhouses and containers.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "/varieties/tomatoes" },
  openGraph: { title, description, url: `${SITE_URL}/varieties/tomatoes`, images: [{ url: "/images/veg/tomato.jpg", alt: "Freshly harvested red cherry tomatoes" }] },
  twitter: { title, description, card: "summary_large_image", images: ["/images/veg/tomato.jpg"] },
};

export default function TomatoVarietiesPage() {
  const hasAffiliates = TOMATO_VARIETIES.some(v => seedDestination(v.retailer).affiliate);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <VarietyVisit crop="tomatoes" />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-3 text-sm">
        <Link href="/" className="variety-text-link">Your Grow Guide</Link>
        <span aria-hidden="true">/</span>
        <Link href="/varieties" className="variety-text-link">Varieties</Link>
        <span aria-hidden="true">/</span><span aria-current="page">Tomatoes</span>
      </nav>

      <div className="mt-7 grid items-center gap-8 md:grid-cols-[1.5fr_1fr] md:gap-12">
        <div>
          <h1 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">Tomato varieties for your growing space</h1>
          <p className="mt-5 max-w-2xl text-lg text-earth-ink">A sunny basket and a greenhouse border need different plants. Choose the growing habit first, then the flavour and fruit you’d like to pick.</p>
          <p className="mt-3 max-w-2xl text-earth-ink">These four varieties each have a different strength. All need warmth and sun; a sheltered outdoor spot matters, especially in cooler parts of the UK.</p>
          <a href="#comparison" className="variety-text-link mt-4">Jump to the quick comparison <span aria-hidden="true">↓</span></a>
        </div>
        <div className="relative h-52 overflow-hidden rounded-card sm:h-64 md:h-80">
          <Image src="/images/veg/tomato.jpg" alt="Freshly harvested red cherry tomatoes" fill priority sizes="(max-width: 768px) 100vw, 430px" className="object-cover" />
        </div>
      </div>

      <section aria-labelledby="variety-cards" className="mt-12 sm:mt-16">
        <h2 id="variety-cards" className="font-serif text-3xl">Four varieties, four good reasons</h2>
        <p className="mt-3 max-w-3xl text-sm text-earth-ink">
          {hasAffiliates
            ? "Some retailer links are affiliate links. Grow Guide UK may receive a small commission if you make a purchase, at no additional cost to you."
            : "These are ordinary retailer links. GrowGuide UK does not earn a commission from them."}
          {" "}Seed links open in a new tab. Check the retailer for current availability.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {TOMATO_VARIETIES.map(v => (
            <article key={v.id} id={v.id} aria-labelledby={`${v.id}-title`} className="flex scroll-mt-24 flex-col rounded-card border border-light-sage bg-sage/10 p-5 sm:p-7">
              <h3 id={`${v.id}-title`} className="font-serif text-3xl">{v.name}</h3>
              <p className="mt-1 text-sm text-earth-ink"><span className="sr-only">Latin name: </span><i lang="la">{v.latinName}</i></p>
              <p className="mt-1 text-sm text-earth-ink">{v.habit}</p>
              <p className="mt-4 font-semibold text-earth-ink">Best for: {v.bestFor.toLowerCase()}</p>
              <h4 className="mt-4 text-sm font-semibold text-earth-ink">In general</h4>
              <p className="mt-1 text-earth-ink">{v.general}</p>
              <dl className="mt-5 space-y-3 border-y border-light-sage/70 py-5 text-sm text-earth-ink">
                {[["Conditions", `${v.position}. ${v.conditions}`], ["Height & spread", v.heightSpread], ["Containers", v.containers], ["Difficulty", v.difficulty], ["Sowing time", v.sow], ["Planting time", v.plant], ["Harvest time", v.harvest]].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[7rem_1fr] gap-3"><dt className="font-semibold">{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>
              <h4 className="mt-5 text-sm font-semibold text-earth-ink">Pests &amp; diseases</h4>
              <p className="mt-1 text-sm text-earth-ink">{v.pestsDiseases}</p>
              <p className="mt-5 text-sm text-earth-ink"><strong>Bear in mind:</strong> {v.limitation}</p>
              <div className="mt-auto pt-6"><SeedLink crop="tomatoes" variety={v.id} name={v.name} retailer={v.retailer} /></div>
            </article>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-sm text-earth-ink">Sizes are approximate mature dimensions, not planting distances. Difficulty is our practical guide to the care involved, not an official rating. “Easy” still means regular watering and feeding.</p>
      </section>

      <section id="comparison" aria-labelledby="comparison-title" className="mt-12 scroll-mt-24 sm:mt-16">
        <h2 id="comparison-title" className="font-serif text-3xl">Compare at a glance</h2>
        <p className="mt-2 text-earth-ink">Short on room? Start with the growth habit. A pot can hold a tall tomato, but it still needs support.</p>
        <div role="region" aria-label="Tomato variety comparison, scroll horizontally on small screens" tabIndex={0} className="mt-5 overflow-x-auto rounded-btn border border-light-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream">
          <table className="w-full min-w-[640px] text-left text-sm text-earth-ink">
            <caption className="sr-only">Tomato varieties compared by best use, growing place and mature size</caption>
            <thead className="bg-sage/40"><tr>{["Variety", "Choose it for", "Growing place", "Height & spread"].map(label => <th key={label} scope="col" className="px-5 py-4 font-semibold">{label}</th>)}</tr></thead>
            <tbody>{TOMATO_VARIETIES.map(v => <tr key={v.id} className="border-t border-light-sage/60">
              <th scope="row" className="px-5 py-4 font-semibold"><a className="variety-text-link" href={`#${v.id}`}>{v.name}</a></th>
              <td className="px-5 py-4">{v.bestFor}</td>
              <td className="px-5 py-4">{v.position}</td>
              <td className="px-5 py-4">{v.heightSpread}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-earth-ink md:hidden">Swipe the comparison sideways to see all four columns.</p>
      </section>

      <section aria-labelledby="timing-title" className="mt-12 grid gap-6 border-y border-light-sage py-8 md:grid-cols-[1fr_2fr]">
        <h2 id="timing-title" className="font-serif text-3xl">A note on UK timing</h2>
        <div className="max-w-2xl space-y-3 text-earth-ink">
          <p>Start seeds indoors. For greenhouse crops, late February to mid-March is a useful guide; for outdoor crops, aim for late March to early April. An indoor sowing date does not mean the plant can spend its whole life on a windowsill.</p>
          <p>“Planting time” means moving young plants into their final growing position. The dates assume an unheated greenhouse or outdoor growing; heated greenhouses can start earlier. Harden plants off and wait until frost risk has passed before moving them outdoors. Local conditions can shift all these dates, so follow the seed packet and your weather forecast.</p>
          <p>A <strong>cordon</strong> is a tall plant grown on a support, usually as one main stem. A <strong>bush</strong> branches naturally and keeps its side shoots. <strong>F1</strong> means a first-generation hybrid; saved seed may not grow into the same type.</p>
        </div>
      </section>

      <section aria-labelledby="healthy-tomatoes" className="mt-10 max-w-3xl text-earth-ink">
        <h2 id="healthy-tomatoes" className="font-serif text-3xl">Keeping tomatoes healthy</h2>
        <p className="mt-3">Check young growth and leaf undersides for pests, and ventilate greenhouses. Blight is a particular concern in warm, wet conditions, even on resistant varieties.</p>
        <p className="mt-3">Split fruit and blossom-end rot can be linked to uneven watering. Blossom-end rot is a growing disorder, not an infectious disease; keeping the compost evenly moist helps.</p>
      </section>

      <section aria-labelledby="your-plot" className="mt-10 rounded-card bg-sage/35 p-6 sm:p-8">
        <h2 id="your-plot" className="font-serif text-3xl">Make it work for your plot</h2>
        <p className="mt-2 max-w-2xl text-earth-ink">Use your growing space and local weather to plan the next step, from sowing to planting out.</p>
        <Link href="/" className="variety-text-link mt-3">Back to your personalised Grow Guide <span aria-hidden="true">→</span></Link>
      </section>

      <section aria-labelledby="sources-title" className="mt-10 max-w-3xl text-sm text-earth-ink">
        <h2 id="sources-title" className="font-semibold">About this selection</h2>
        <p className="mt-2">Growing guidance and seed listings checked on {VARIETY_REVIEW_DATE}. The four retailer links above lead to the named seed varieties. We do not monitor stock or show live prices.</p>
        <p className="mt-2">Variety details are based on the linked Thompson &amp; Morgan seed listings and their <a className="variety-text-link" href="https://www.thompson-morgan.com/how-to-grow-tomatoes">tomato growing guide</a>. Container, difficulty and seasonal planning notes are our editorial interpretation of the growing advice.</p>
      </section>
    </main>
  );
}
