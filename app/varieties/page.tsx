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

/** Tints for the cells that have no photograph, so the grid does not read as
 *  a stack of identical cream boxes. Indexed by position among those cells. */
const UNTINTED_FILLS = ["bg-blush/40", "bg-warm-stone/40"];

export default function VarietiesPage() {
  const guides = VARIETY_GUIDES;
  // A bento holds exactly as many cells as there is content for. The first
  // cell always spans the full width; the last one spans it too, but only
  // when doing so still leaves a complete row behind it.
  const middleCount = guides.length - 2;
  const lastSpansFull = middleCount >= 0 && middleCount % 2 === 0;

  let untintedSeen = 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <Link href="/" className="variety-text-link">Back to your Grow Guide</Link>

      <header className="mt-10 max-w-4xl">
        <h1 className="font-serif text-4xl leading-[1.1] tracking-[-0.01em] sm:text-5xl lg:text-6xl">
          A variety that fits your garden
        </h1>
        <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-earth-ink">
          Start with the space you have and the food you love. These short guides explain what each
          variety does well, and what it needs from you.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {guides.map((guide, i) => {
          const isFirst = i === 0;
          const isLast = i === guides.length - 1;
          const spansFull = isFirst || (isLast && lastSpansFull);
          const fill = guide.image
            ? "bg-sage/10"
            : UNTINTED_FILLS[untintedSeen++ % UNTINTED_FILLS.length];

          return (
            <section
              key={guide.slug}
              aria-labelledby={`${guide.slug}-guide`}
              className={`group relative grid overflow-hidden rounded-card border border-light-sage ${fill} ${
                spansFull ? "md:col-span-2" : ""
              } ${
                guide.image && spansFull ? "sm:grid-cols-[1fr_1.3fr]" : ""
              } ${
                // A text-only cell sitting beside a taller one with a photo
                // would otherwise leave its whole lower half empty.
                !guide.image && !spansFull ? "content-center" : ""
              } motion-safe:transition-shadow focus-within:ring-2 focus-within:ring-dark-earth focus-within:ring-offset-2 focus-within:ring-offset-cream hover:shadow-lifted`}
            >
              {guide.image && (
                <div className={`relative ${spansFull ? "min-h-56" : "h-52"}`}>
                  <Image
                    src={guide.image.src}
                    alt={guide.image.alt}
                    fill
                    sizes={spansFull ? "(max-width: 640px) 100vw, 480px" : "(max-width: 768px) 100vw, 560px"}
                    className="object-cover"
                  />
                </div>
              )}
              <div className={`p-6 sm:p-8 ${spansFull && !guide.image ? "sm:flex sm:items-end sm:justify-between sm:gap-10" : ""}`}>
                <div>
                  <h2 id={`${guide.slug}-guide`} className="font-serif text-2xl leading-tight sm:text-3xl">
                    {/* The pseudo-element makes the whole cell clickable while
                        the link's accessible name stays just the crop name. */}
                    <Link
                      href={`/varieties/${guide.slug}`}
                      className="after:absolute after:inset-0 focus-visible:outline-none"
                    >
                      {guide.name}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-[60ch] leading-relaxed text-earth-ink">{guide.summary}</p>
                </div>
                <p className="mt-5 shrink-0 font-semibold text-earth-ink underline underline-offset-4 group-hover:decoration-2 sm:mt-0">
                  Explore {guide.singular} varieties <span aria-hidden="true">→</span>
                </p>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
