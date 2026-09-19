import Link from "next/link";
import type { AdviceTask } from "@/lib/types";
import { VARIETY_CROPS } from "@/lib/variety-crops";

export default function VarietyPrompt({ vegetable, tasks }: { vegetable: string; tasks: AdviceTask[] }) {
  const crop = VARIETY_CROPS.find(crop => crop.aliases.some(alias => alias === vegetable.trim().toLowerCase()));
  if (!crop || !tasks.some(task => task.category === "sowing" || task.category === "planting")) return null;

  return (
    <aside aria-label={`Choose a ${crop.singular} variety`} className="mb-3 rounded-btn border border-light-sage bg-sage/20 px-4 py-3 text-sm text-earth-ink">
      <p className="font-semibold">Choosing your seeds?</p>
      <p className="mt-1">{crop.prompt}</p>
      <Link href={`/varieties/${crop.slug}`} className="mt-1 inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream">
        Explore {crop.singular} varieties <span aria-hidden="true" className="ml-1">→</span>
      </Link>
    </aside>
  );
}
