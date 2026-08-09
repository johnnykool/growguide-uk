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
          className="min-h-11 w-full border border-garden-ground/40 bg-pale-mineral px-4 py-3 text-sm font-medium text-garden-ground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral"
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
              className={`min-h-11 whitespace-nowrap border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral ${
                isSelected
                  ? "bg-pale-mineral text-rain-ink ring-2 ring-rain-ink"
                  : "border-garden-ground/30 bg-pale-mineral text-garden-ground hover:border-garden-ground"
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
