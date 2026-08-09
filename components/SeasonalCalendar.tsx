"use client";

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

  return (
    <section aria-label="This season" className="bg-cream py-5">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 px-1">
        <h2 className="text-xl font-semibold text-dark-earth">This season</h2>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-earth-ink">
          <span>
            <span
              aria-hidden="true"
              className="mr-1 inline-block h-2.5 w-2.5 bg-moss align-middle"
            />
            sow / plant
          </span>
          <span>
            <span
              aria-hidden="true"
              className="mr-1 inline-block h-2.5 w-2.5 bg-light-sage align-middle"
            />
            harvest
          </span>
          <span>
            <span
              aria-hidden="true"
              className="mr-1 inline-block h-2.5 w-2.5 border border-dark-earth/30 bg-warm-stone align-middle"
            />
            dormant
          </span>
        </p>
      </div>

      <div
        role="region"
        aria-label="Seasonal timeline"
        tabIndex={0}
        className="mt-4 overflow-x-auto border-y border-dark-earth/30 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-earth focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        <div className="min-w-[72rem]">
          <div className="grid grid-cols-[7rem_repeat(12,minmax(4.75rem,1fr))] items-end gap-px px-1 pb-2">
            <span aria-hidden="true" />
            {MONTH_NAMES.map((name) => (
              <span
                key={name}
                className="whitespace-nowrap text-center text-[10px] font-semibold uppercase tracking-wide text-earth-ink"
              >
                {name}
              </span>
            ))}
          </div>

          <div className="space-y-2">
            {vegetableIds.map((id) => {
              const veg = getVegetableById(id);
              if (!veg) return null;
              const active = new Set([
                ...veg.sowIndoors,
                ...veg.sowOutdoors,
                ...veg.transplant,
              ]);
              const harvest = new Set(veg.harvest);
              return (
                <div
                  key={id}
                  className="grid grid-cols-[7rem_repeat(12,minmax(4.75rem,1fr))] items-center gap-px px-1"
                >
                  <p className="pr-3 text-sm font-medium text-dark-earth">
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
                        ? "bg-moss"
                        : state === "harvest"
                          ? "bg-light-sage"
                          : "bg-warm-stone";
                    return (
                      <div
                        key={month}
                        role="img"
                        aria-label={`${veg.name}, ${name}: ${state}`}
                        className={`h-7 border border-dark-earth/10 ${colour} ${
                          isCurrent
                            ? "ring-2 ring-terracotta ring-offset-1 ring-offset-cream"
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
