"use client";

import { useRef } from "react";
import { TIMELINE_LABELS, Timeline } from "@/lib/types";

interface Props {
  value: Timeline;
  onChange: (t: Timeline) => void;
}

const COMMON_TIMELINES: Timeline[] = ["24-hours", "3-days", "7-days"];
const EXTENDED_TIMELINES: Timeline[] = ["14-days", "30-days", "3-months"];

export default function TimelineFilter({ value, onChange }: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const extendedLabel = EXTENDED_TIMELINES.includes(value)
    ? TIMELINE_LABELS[value]
    : null;

  const buttonClass = (isSelected: boolean) =>
    `min-h-11 whitespace-nowrap border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral ${
      isSelected
        ? "border-rain-ink bg-pale-mineral text-rain-ink ring-2 ring-rain-ink"
        : "border-garden-ground/30 bg-pale-mineral text-garden-ground hover:border-garden-ground"
    }`;

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
        {COMMON_TIMELINES.map((t) => {
          const isSelected = t === value;
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(t)}
              className={buttonClass(isSelected)}
            >
              {TIMELINE_LABELS[t]}
            </button>
          );
        })}
      </div>
      <details ref={detailsRef} className="mt-2 hidden sm:block">
        <summary className="flex min-h-11 w-fit cursor-pointer list-none items-center border border-garden-ground/30 bg-pale-mineral px-4 py-2 text-sm font-medium text-garden-ground marker:content-none hover:border-garden-ground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral">
          More timeframes{extendedLabel ? ` · ${extendedLabel}` : ""}
        </summary>
        <div className="mt-2 flex flex-wrap gap-2">
          {EXTENDED_TIMELINES.map((t) => {
            const isSelected = t === value;
            return (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => {
                  onChange(t);
                  detailsRef.current?.removeAttribute("open");
                }}
                className={buttonClass(isSelected)}
              >
                {TIMELINE_LABELS[t]}
              </button>
            );
          })}
        </div>
      </details>
    </>
  );
}
