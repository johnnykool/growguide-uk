"use client";

import { VEGETABLES } from "@/data/vegetables";
import { AdviceTask } from "@/lib/types";

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-terracotta text-cream",
  medium: "bg-blush text-dark-earth",
  low: "bg-light-sage text-dark-earth",
};

export default function TaskCard({ task }: { task: AdviceTask }) {
  const veg = VEGETABLES.find(
    (v) => v.name.toLowerCase() === task.vegetable.toLowerCase()
  );

  return (
    <article className="bg-warm-stone/60 rounded-card shadow-soft p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {veg?.emoji ?? "🌱"}
          </span>
          <div>
            <p className="text-sm text-moss font-medium">{task.vegetable}</p>
            <h4 className="font-semibold leading-snug">{task.title}</h4>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium
          }`}
        >
          {task.priority}
        </span>
      </div>
      <span className="inline-block rounded-full bg-light-sage/70 px-3 py-0.5 text-xs font-medium text-dark-earth mb-3">
        {task.category}
      </span>
      <p className="text-sm leading-relaxed text-dark-earth/90">{task.detail}</p>
      {task.weatherNote && (
        <p className="mt-3 rounded-btn bg-cream/80 px-3 py-2 text-sm text-dark-earth">
          🌦️ {task.weatherNote}
        </p>
      )}
    </article>
  );
}
