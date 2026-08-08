"use client";

import { TIMELINE_LABELS, Timeline } from "@/lib/types";

interface Props {
  value: Timeline;
  onChange: (t: Timeline) => void;
}

export default function TimelineFilter({ value, onChange }: Props) {
  return (
    <>
      <label className="block sm:hidden">
        <span className="sr-only">Advice timeline</span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as Timeline)}
          className="w-full rounded-btn border border-moss/30 bg-cream px-4 py-3 text-sm font-medium text-dark-earth shadow-soft focus:outline-none focus:ring-2 focus:ring-moss focus:ring-offset-2"
        >
          {(Object.keys(TIMELINE_LABELS) as Timeline[]).map((t) => (
            <option key={t} value={t}>
              {TIMELINE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>
      <div
        className="hidden flex-wrap gap-2 sm:flex"
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
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 ${
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
    </>
  );
}
