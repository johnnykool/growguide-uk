"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { TIMELINE_LABELS, Timeline } from "@/lib/types";

interface Props {
  value: Timeline;
  onChange: (t: Timeline) => void;
}

const COMMON_TIMELINES: Timeline[] = ["24-hours", "3-days", "7-days"];
const EXTENDED_TIMELINES: Timeline[] = ["14-days", "30-days", "3-months"];
const ALL_TIMELINES = [...COMMON_TIMELINES, ...EXTENDED_TIMELINES];

export default function TimelineFilter({ value, onChange }: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
  const radioRefs = useRef<Partial<Record<Timeline, HTMLButtonElement | null>>>(
    {},
  );
  const extendedLabel = EXTENDED_TIMELINES.includes(value)
    ? TIMELINE_LABELS[value]
    : null;
  const usesDisclosureProxy = Boolean(extendedLabel && !isDisclosureOpen);

  const buttonClass = (isSelected: boolean) =>
    `min-h-11 whitespace-nowrap border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral ${
      isSelected
        ? "border-rain-ink bg-pale-mineral text-rain-ink ring-2 ring-rain-ink"
        : "border-garden-ground/30 bg-pale-mineral text-garden-ground hover:border-garden-ground"
    }`;

  const handleRadioKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    timeline: Timeline,
  ) => {
    const direction =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;

    if (!direction) return;

    event.preventDefault();
    const currentIndex = ALL_TIMELINES.indexOf(timeline);
    const nextTimeline =
      ALL_TIMELINES[
        (currentIndex + direction + ALL_TIMELINES.length) %
          ALL_TIMELINES.length
      ];

    const nextIsExtended = EXTENDED_TIMELINES.includes(nextTimeline);
    if (nextIsExtended) {
      detailsRef.current?.setAttribute("open", "");
    } else {
      detailsRef.current?.removeAttribute("open");
    }

    setIsDisclosureOpen(nextIsExtended);
    onChange(nextTimeline);
    radioRefs.current[nextTimeline]?.focus();
  };

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
              ref={(element) => {
                radioRefs.current[t] = element;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => {
                onChange(t);
                setIsDisclosureOpen(false);
              }}
              onKeyDown={(event) => handleRadioKeyDown(event, t)}
              className={buttonClass(isSelected)}
            >
              {TIMELINE_LABELS[t]}
            </button>
          );
        })}
        <details
          ref={detailsRef}
          open={isDisclosureOpen}
          onToggle={(event) => setIsDisclosureOpen(event.currentTarget.open)}
        >
          <summary
            role={usesDisclosureProxy ? "radio" : undefined}
            aria-label={
              usesDisclosureProxy
                ? `More timeframes, selected ${extendedLabel}`
                : undefined
            }
            aria-checked={usesDisclosureProxy || undefined}
            tabIndex={usesDisclosureProxy ? 0 : -1}
            onKeyDown={
              usesDisclosureProxy
                ? (event) => handleRadioKeyDown(event, value)
                : undefined
            }
            className="flex min-h-11 w-fit cursor-pointer list-none items-center border border-garden-ground/30 bg-pale-mineral px-4 py-2 text-sm font-medium text-garden-ground marker:content-none hover:border-garden-ground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral"
          >
            More timeframes{extendedLabel ? ` · ${extendedLabel}` : ""}
          </summary>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXTENDED_TIMELINES.map((t) => {
              const isSelected = isDisclosureOpen && t === value;
              return (
                <button
                  key={t}
                  ref={(element) => {
                    radioRefs.current[t] = element;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => {
                    onChange(t);
                    setIsDisclosureOpen(false);
                  }}
                  onKeyDown={(event) => handleRadioKeyDown(event, t)}
                  className={buttonClass(isSelected)}
                >
                  {TIMELINE_LABELS[t]}
                </button>
              );
            })}
          </div>
        </details>
      </div>
    </>
  );
}
