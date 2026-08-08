"use client";

import { EQUIPMENT_OPTIONS } from "@/lib/types";

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
  showAll?: boolean;
  onShowAllChange?: (showAll: boolean) => void;
}

const COMMON_EQUIPMENT_IDS = new Set([
  "trowel",
  "watering-can",
  "spade",
  "fork",
  "secateurs",
  "seed-trays",
]);

const focusRing =
  "focus-within:ring-2 focus-within:ring-moss focus-within:ring-offset-2 focus-within:ring-offset-cream";

export default function EquipmentSelector({
  selected,
  onToggle,
  showAll = false,
  onShowAllChange = () => {},
}: Props) {
  const equipment = showAll
    ? EQUIPMENT_OPTIONS
    : EQUIPMENT_OPTIONS.filter((item) => COMMON_EQUIPMENT_IDS.has(item.id));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {equipment.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <label
              key={item.id}
              className={`flex min-h-11 items-center gap-2.5 rounded-btn px-3 py-2 text-sm transition-colors ${focusRing} ${
                isSelected
                  ? "bg-blush text-dark-earth"
                  : "bg-warm-stone/60 hover:bg-light-sage/60"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(item.id)}
                className="h-4 w-4 accent-[var(--moss)]"
              />
              <span className="font-medium">{item.label}</span>
            </label>
          );
        })}
      </div>
      {!showAll && (
        <button
          type="button"
          onClick={() => onShowAllChange(true)}
          className="min-h-11 rounded-btn px-4 py-2 text-sm font-medium text-dark-earth ring-1 ring-light-sage transition-colors hover:bg-light-sage/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          Show all tools
        </button>
      )}
    </div>
  );
}
