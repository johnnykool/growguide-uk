"use client";

import { seedDestination, type SeedRetailer } from "@/data/varieties";
import { trackSeedClick } from "@/lib/variety-analytics";

export default function SeedLink({ crop, variety, name, retailer }: { crop: string; variety: string; name: string; retailer: SeedRetailer }) {
  const { href, affiliate } = seedDestination(retailer);
  return (
    <a href={href} target="_blank" rel={affiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
      onClick={() => trackSeedClick(crop, variety, retailer.name, affiliate)}
      className="inline-flex min-h-11 items-center justify-center rounded-btn border border-dark-earth px-4 py-2.5 text-center text-sm font-semibold text-earth-ink transition-colors hover:bg-light-sage/40 motion-safe:active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream">
      View seeds at {retailer.name}<span className="sr-only"> for {name} (opens in a new tab)</span>
      {affiliate && <span className="ml-2 text-xs">(affiliate)</span>}
    </a>
  );
}
