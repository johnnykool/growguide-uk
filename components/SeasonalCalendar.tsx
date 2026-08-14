"use client";

import { useEffect, useRef } from "react";
import { getVegetableById } from "@/data/vegetables";

interface Props {
  vegetableIds: string[];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function SeasonalCalendar({ vegetableIds }: Props) {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const scrollRegionRef = useRef<HTMLDivElement>(null);
  const currentMonthCellRef = useRef<HTMLDivElement>(null);
  const vegetables = vegetableIds.flatMap((id) => {
    const vegetable = getVegetableById(id);
    return vegetable ? [vegetable] : [];
  });

  useEffect(() => {
    const scrollRegion = scrollRegionRef.current;
    const currentMonthCell = currentMonthCellRef.current;

    if (
      !scrollRegion ||
      !currentMonthCell ||
      typeof scrollRegion.scrollTo !== "function"
    ) {
      return;
    }

    const left = Math.max(
      0,
      currentMonthCell.offsetLeft - scrollRegion.clientWidth * 0.35,
    );
    scrollRegion.scrollTo({ left, behavior: "auto" });
  }, [vegetableIds]);

  return (
    <section aria-label="This season" className="bg-pale-mineral py-5">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 px-1">
        <h2 className="text-xl font-semibold text-garden-ground">This season</h2>
        <div className="flex items-end gap-4">
          <span className="text-xs font-semibold text-garden-ground sm:hidden">
            Months →
          </span>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-garden-ground/75">
            <span>
              <span
                aria-hidden="true"
                className="mr-1 inline-block h-2.5 w-2.5 bg-moss-veil align-middle"
              />
              sow / plant
            </span>
            <span>
              <span
                aria-hidden="true"
                className="mr-1 inline-block h-2.5 w-2.5 bg-rain-ink align-middle"
              />
              harvest
            </span>
            <span>
              <span
                aria-hidden="true"
                className="mr-1 inline-block h-2.5 w-2.5 border border-garden-ground/30 bg-pale-mineral align-middle"
              />
              dormant
            </span>
          </p>
        </div>
      </div>

      <div
        ref={scrollRegionRef}
        role="region"
        aria-label="Seasonal timeline"
        tabIndex={0}
        className="mt-4 overflow-x-auto border-y border-garden-ground/30 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral"
      >
        <div className="min-w-[72rem]">
          <div className="grid grid-cols-[7rem_repeat(12,minmax(4.75rem,1fr))] items-end gap-px px-1 pb-2">
            <span aria-hidden="true" />
            {MONTH_NAMES.map((name) => (
              <span
                key={name}
                className="whitespace-nowrap text-center text-[10px] font-semibold uppercase tracking-wide text-garden-ground/70"
              >
                {name}
              </span>
            ))}
          </div>

          <div className="space-y-2">
            {vegetables.map((veg, rowIndex) => {
              const active = new Set([
                ...veg.sowIndoors,
                ...veg.sowOutdoors,
                ...veg.transplant,
              ]);
              const harvest = new Set(veg.harvest);
              return (
                <div
                  key={veg.id}
                  className="grid grid-cols-[7rem_repeat(12,minmax(4.75rem,1fr))] items-center gap-px px-1"
                >
                  <p className="pr-3 text-sm font-medium text-garden-ground">
                    {veg.name}
                  </p>
                  {MONTH_NAMES.map((name, i) => {
                    const month = i + 1;
                    const isCurrent = month === currentMonth;
                    const state = active.has(month)
                      ? "sow or plant"
                      : harvest.has(month)
                        ? "harvest"
                        : "dormant";
                    const colour =
                      state === "sow or plant"
                        ? "bg-moss-veil"
                        : state === "harvest"
                          ? "bg-rain-ink"
                          : "bg-pale-mineral";
                    return (
                      <div
                        key={month}
                        ref={
                          rowIndex === 0 && isCurrent
                            ? currentMonthCellRef
                            : undefined
                        }
                        role="img"
                        aria-label={`${veg.name}, ${name}: ${state}`}
                        className={`h-7 border border-garden-ground/20 ${colour} ${
                          isCurrent
                            ? "ring-2 ring-ember ring-offset-1 ring-offset-pale-mineral"
                            : ""
                        }`}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
