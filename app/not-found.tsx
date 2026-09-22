import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { ICON_SIZE_INLINE, ICON_WEIGHT } from "@/lib/icons";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Page not found | ${SITE_NAME}`,
  robots: { index: false, follow: true },
};

const WAYS_BACK = [
  {
    href: "/",
    label: "Your Grow Guide",
    hint: "What to sow, plant and pick on your plot this month",
  },
  {
    href: "/varieties",
    label: "Vegetable varieties",
    hint: "Compare tomatoes, courgettes, cucumbers and spring onions",
  },
  {
    href: "/resources",
    label: "Free resources",
    hint: "Printable growing calendars and guides for the shed wall",
  },
];

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60dvh] max-w-3xl flex-col justify-center px-4 py-16 sm:py-24">
      <p className="font-mono text-sm text-earth-ink">404</p>
      <h1 className="mt-3 font-serif text-4xl leading-[1.1] tracking-[-0.01em] sm:text-5xl">
        It&rsquo;s somewhere in this shed
      </h1>
      <p className="mt-5 max-w-[55ch] text-lg leading-relaxed text-earth-ink">
        That page is not where we left it. Everything below is still on its hook.
      </p>

      <ul className="mt-10 divide-y divide-light-sage border-y border-light-sage">
        {WAYS_BACK.map(way => (
          <li key={way.href}>
            <Link
              href={way.href}
              className="group flex min-h-11 items-center justify-between gap-6 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              <span>
                <span className="font-serif text-2xl">{way.label}</span>
                <span className="mt-1 block text-earth-ink">{way.hint}</span>
              </span>
              <ArrowRight
                size={ICON_SIZE_INLINE}
                weight={ICON_WEIGHT}
                aria-hidden="true"
                className="shrink-0 text-earth-ink motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
              />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
