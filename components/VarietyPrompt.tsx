import Link from "next/link";
import type { AdviceTask } from "@/lib/types";

export default function VarietyPrompt({ vegetable, tasks }: { vegetable: string; tasks: AdviceTask[] }) {
  const isTomato = /^(tomato|tomatoes)$/i.test(vegetable.trim());
  if (!isTomato || !tasks.some(task => task.category === "sowing" || task.category === "planting")) return null;

  return (
    <aside aria-label="Choose a tomato variety" className="mb-3 rounded-btn border border-light-sage bg-sage/20 px-4 py-3 text-sm text-earth-ink">
      <p className="font-semibold">Choosing your seeds?</p>
      <p className="mt-1">Compare tomato varieties for outdoor growing, sweetness and containers.</p>
      <Link href="/varieties/tomatoes" className="mt-1 inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream">
        Explore tomato varieties <span aria-hidden="true" className="ml-1">→</span>
      </Link>
    </aside>
  );
}
