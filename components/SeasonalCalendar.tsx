"use client";

import { getVegetableById } from "@/data/vegetables";

interface Props {
  vegetableIds: string[];
}

const MONTH_INITIALS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
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
    <div className="bg-warm-stone/50 rounded-card shadow-soft p-5">
      <h3 className="font-serif text-xl mb-1">Season at a glance</h3>
      <p className="text-xs text-moss mb-4">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-moss align-middle mr-1" />
        sow / plant
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-light-sage align-middle ml-3 mr-1" />
        harvest
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-warm-stone align-middle ml-3 mr-1 ring-1 ring-moss/20" />
        dormant
      </p>
      <div className="space-y-3">
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
            <div key={id}>
              <p className="text-sm font-medium mb-1">
                <span aria-hidden className="mr-1">
                  {veg.emoji}
                </span>
                {veg.name}
              </p>
              <div className="grid grid-cols-12 gap-0.5">
                {MONTH_INITIALS.map((initial, i) => {
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
                      aria-label={`${veg.name}, ${MONTH_NAMES[i]}: ${state}`}
                      className={`relative h-5 rounded-sm ${colour} ${
                        isCurrent ? "ring-2 ring-terracotta" : ""
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute inset-0 flex items-center justify-center text-[9px] font-semibold ${
                          state === "sow or plant" ? "text-cream" : "text-dark-earth/60"
                        }`}
                      >
                        {initial}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
