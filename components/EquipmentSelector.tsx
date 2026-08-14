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
  "focus-within:ring-2 focus-within:ring-garden-ground focus-within:ring-offset-2 focus-within:ring-offset-pale-mineral";

export default function EquipmentSelector({
  selected,
  onToggle,
  showAll,
  onShowAllChange,
}: Props) {
  const isControlled = showAll !== undefined && onShowAllChange !== undefined;
  const equipment = !isControlled || showAll
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
              className={`flex min-h-11 items-center gap-2.5 border px-3 py-2 text-sm transition-colors ${focusRing} ${
                isSelected
                  ? "border-garden-ground bg-moss-veil/60 text-garden-ground"
                  : "border-garden-ground/35 bg-pale-mineral text-garden-ground hover:bg-moss-veil/25"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(item.id)}
                className="h-4 w-4 accent-[var(--rain-ink)]"
              />
              <span className="font-medium">{item.label}</span>
            </label>
          );
        })}
      </div>
      {isControlled && !showAll && (
        <button
          type="button"
          onClick={() => onShowAllChange(true)}
          className="min-h-11 border border-garden-ground/40 px-4 py-2 text-sm font-medium text-garden-ground transition-colors hover:bg-moss-veil/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral"
        >
          Show all tools
        </button>
      )}
    </div>
  );
}
