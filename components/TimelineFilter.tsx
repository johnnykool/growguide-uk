"use client";

import { TIMELINE_LABELS, Timeline } from "@/lib/types";

interface Props {
  value: Timeline;
  onChange: (t: Timeline) => void;
}

export default function TimelineFilter({ value, onChange }: Props) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
      role="radiogroup"
      aria-label="Advice timeline"
    >
      {(Object.keys(TIMELINE_LABELS) as Timeline[]).map((t) => {
        const isSelected = t === value;
        return (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(t)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isSelected
                ? "bg-blush text-dark-earth shadow-soft"
                : "bg-warm-stone/60 text-dark-earth hover:bg-light-sage/60"
            }`}
          >
            {TIMELINE_LABELS[t]}
          </button>
        );
      })}
    </div>
  );
}
